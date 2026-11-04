import { PgBoss } from "pg-boss";
import { sendWebinarBroadcastEmail, WebinarNotificationType } from "@/lib/zoho";
import { DataStore } from "@/lib/data-store";

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://postgres:postgres@localhost:5432/kdeck_db?schema=public";

declare global {
  // eslint-disable-next-line no-var
  var __kdeck_pg_boss: PgBoss | undefined;
}

let bossInstance: PgBoss | null = global.__kdeck_pg_boss || null;

async function getBoss(): Promise<PgBoss | null> {
  if (bossInstance) return bossInstance;

  try {
    const boss = new PgBoss({
      connectionString,
      schema: "pgboss",
      max: 5,
    });

    boss.on("error", (err: unknown) => {
      const error = err as Error;
      console.warn("[pg-boss] Background queue notice:", error.message);
    });

    await boss.start();

    // Register job handler
    await boss.work("send-webinar-reminder", async (job: any) => {
      const {
        eventId,
        type,
        eventTitle,
        eventDate,
        eventTime,
        webinarLink,
        imageBase64,
        customSubject,
        customMessage,
      } = job.data as {
        eventId: string;
        type: WebinarNotificationType;
        eventTitle: string;
        eventDate: string;
        eventTime: string;
        webinarLink: string;
        imageBase64?: string | null;
        customSubject?: string;
        customMessage?: string;
      };

      console.log(`[pg-boss] Executing job: ${type} reminder for event ${eventId}`);

      // Fetch current attendees
      const registrations = await DataStore.getEventRegistrations(eventId);
      const recipientEmails = registrations
        .map((r) => r.email)
        .filter((email): email is string => Boolean(email));

      if (recipientEmails.length === 0) {
        console.log(`[pg-boss] No attendees registered for event ${eventId}`);
        return;
      }

      await sendWebinarBroadcastEmail({
        recipients: recipientEmails,
        eventTitle,
        eventDate,
        eventTime,
        webinarLink,
        type,
        imageBase64,
        customSubject,
        customMessage,
      });
    });

    // Register check-past-events worker
    await boss.work("check-past-events", async () => {
      console.log("[pg-boss] Running cron: checking for expired events (1 day post-event)...");
      try {
        const result = await DataStore.archiveExpiredEvents();
        console.log(`[pg-boss] Past events check finished. Checked: ${result.checked}, Archived: ${result.updated}`);
      } catch (err) {
        console.error("[pg-boss] Error checking past events:", err);
      }
    });

    // Schedule hourly recurring job for past event checking
    try {
      await boss.schedule("check-past-events", "0 * * * *", {});
    } catch {
      // Job schedule might already be present in pg-boss schema
    }

    bossInstance = boss;
    if (process.env.NODE_ENV !== "production") {
      global.__kdeck_pg_boss = boss;
    }
    return bossInstance;
  } catch (err: unknown) {
    const error = err as Error;
    console.warn("[pg-boss] Could not start pg-boss directly on PostgreSQL (will use in-memory schedule fallback):", error.message);
    return null;
  }
}

// Global state tracking whether scheduler has been initialized
let hasInitScheduler = false;

export async function initScheduler(): Promise<void> {
  if (hasInitScheduler) return;
  hasInitScheduler = true;

  // 1. Run startup check for past events
  DataStore.archiveExpiredEvents()
    .then((res) => {
      if (res.updated > 0) {
        console.log(`[scheduler] Initial startup check: ${res.updated} past events archived.`);
      }
    })
    .catch((err) => console.error("[scheduler] Startup check failed:", err));

  // 2. Initialize pg-boss queue & worker
  const boss = await getBoss();

  // 3. Fallback recurring timer (every 30 minutes) to ensure guarantee regardless of pg-boss connection
  setInterval(async () => {
    try {
      await DataStore.archiveExpiredEvents();
    } catch (err) {
      console.error("[scheduler fallback] Recurring 30m past events check error:", err);
    }
  }, 30 * 60 * 1000);
}

// In-memory fallback timers for development/demo
interface FallbackJob {
  id: string;
  runAt: Date;
  execute: () => Promise<void>;
}
const fallbackJobs: FallbackJob[] = [];

// Helper to schedule webinar reminders based on event date & time
export async function scheduleWebinarReminders(options: {
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  webinarLink: string;
  eventDateTimeISO?: string;
  imageBase64?: string | null;
}) {
  const boss = await getBoss();

  // Parse target date and time into a JS Date object
  let targetDate = new Date();
  if (options.eventDateTimeISO) {
    targetDate = new Date(options.eventDateTimeISO);
  } else {
    // Attempt best-effort parse, default 2 hours from now for testing
    targetDate = new Date(Date.now() + 2 * 60 * 60 * 1000);
  }

  const now = Date.now();
  const scheduleTimes: Array<{ type: WebinarNotificationType; runAt: Date; offsetLabel: string }> = [
    {
      type: "1_HOUR",
      runAt: new Date(targetDate.getTime() - 60 * 60 * 1000),
      offsetLabel: "1 Hour Before",
    },
    {
      type: "30_MIN",
      runAt: new Date(targetDate.getTime() - 30 * 60 * 1000),
      offsetLabel: "30 Minutes Before",
    },
    {
      type: "15_MIN",
      runAt: new Date(targetDate.getTime() - 15 * 60 * 1000),
      offsetLabel: "15 Minutes Before",
    },
    {
      type: "LIVE",
      runAt: targetDate,
      offsetLabel: "When Live (Start Time)",
    },
  ];

  const scheduledResults = [];

  for (const item of scheduleTimes) {
    // Only schedule if runAt is in the future (or within 2 minutes)
    const runAt = item.runAt.getTime() > now ? item.runAt : new Date(now + 10 * 1000);

    const payload = {
      eventId: options.eventId,
      type: item.type,
      eventTitle: options.eventTitle,
      eventDate: options.eventDate,
      eventTime: options.eventTime,
      webinarLink: options.webinarLink,
      imageBase64: options.imageBase64,
    };

    if (boss) {
      try {
        const jobId = await boss.send("send-webinar-reminder", payload, {
          startAfter: runAt,
          retryLimit: 2,
        });
        scheduledResults.push({
          type: item.type,
          label: item.offsetLabel,
          runAt,
          jobId,
          engine: "pg-boss",
        });
        continue;
      } catch (err) {
        console.warn(`[pg-boss] send failed for ${item.type}, using timer fallback:`, err);
      }
    }

    // Fallback in-memory schedule
    const delayMs = Math.max(1000, runAt.getTime() - now);
    const timerId = setTimeout(async () => {
      try {
        const registrations = await DataStore.getEventRegistrations(options.eventId);
        const recipientEmails = registrations
          .map((r) => r.email)
          .filter((email): email is string => Boolean(email));

        if (recipientEmails.length > 0) {
          await sendWebinarBroadcastEmail({
            recipients: recipientEmails,
            eventTitle: options.eventTitle,
            eventDate: options.eventDate,
            eventTime: options.eventTime,
            webinarLink: options.webinarLink,
            type: item.type,
            imageBase64: options.imageBase64,
          });
        }
      } catch (err) {
        console.error(`[scheduler fallback] error executing ${item.type}:`, err);
      }
    }, delayMs);

    scheduledResults.push({
      type: item.type,
      label: item.offsetLabel,
      runAt,
      jobId: `timer_${item.type}_${Date.now()}`,
      engine: "in-memory timer fallback",
    });
  }

  return scheduledResults;
}
