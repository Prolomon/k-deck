import { NextResponse } from "next/server";
import { getAuthenticatedAdmin } from "@/lib/auth";
import { DataStore } from "@/lib/data-store";
import { sendWebinarBroadcastEmail, WebinarNotificationType } from "@/lib/zoho";
import { scheduleWebinarReminders } from "@/lib/scheduler";
import { Cache } from "@/lib/cache";

export async function GET(req: Request) {
  try {
    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get("eventId") || undefined;

    const events = await DataStore.getEvents(true);
    const logs = await DataStore.getScheduledEmails(eventId);

    return NextResponse.json({
      events,
      logs,
    });
  } catch (error) {
    console.error("Error fetching broadcast data:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      eventId,
      type = "LINK",
      customSubject,
      customMessage,
      scheduleRemaining = false,
      eventDateTimeISO,
    } = body as {
      eventId: string;
      type: WebinarNotificationType;
      customSubject?: string;
      customMessage?: string;
      scheduleRemaining?: boolean;
      eventDateTimeISO?: string;
    };

    if (!eventId) {
      return NextResponse.json({ error: "Please select an event" }, { status: 400 });
    }

    const event = await DataStore.getEventById(eventId);
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const registrations = await DataStore.getEventRegistrations(eventId);
    const recipientEmails = Array.from(
      new Set(
        registrations
          .map((r) => r.email?.trim())
          .filter((email): email is string => Boolean(email && email.includes("@")))
      )
    );

    if (recipientEmails.length === 0) {
      return NextResponse.json(
        { error: "No registered attendees found for this event yet." },
        { status: 400 }
      );
    }

    // Convert stored binary bytes to Base64 image URL for email rendering
    const imageBase64 = event.imageBytes
      ? `data:${event.imageMimeType || "image/jpeg"};base64,${Buffer.from(event.imageBytes).toString("base64")}`
      : event.image?.startsWith("data:")
      ? event.image
      : null;

    const webinarLink =
      event.webinarLink || "https://kdeckprofessionalservices.com.ng/events";

    // 1. Send the broadcast email immediately via Zoho Mail
    const sendResult = await sendWebinarBroadcastEmail({
      recipients: recipientEmails,
      eventTitle: event.title,
      eventDate: event.date,
      eventTime: event.time,
      webinarLink,
      type,
      imageBase64,
      customSubject,
      customMessage,
    });

    // Record this broadcast in the database
    await DataStore.recordScheduledEmail({
      eventId: event.id,
      type,
      subject: customSubject || `Broadcast: ${type} for ${event.title}`,
      status: sendResult.success ? "SENT" : "FAILED",
      recipientCount: recipientEmails.length,
      sentAt: new Date(),
    });

    let scheduledJobs: Array<{
      type: WebinarNotificationType;
      label: string;
      runAt: Date;
      jobId: string | null;
      engine: string;
    }> = [];

    // 2. If scheduleRemaining is true or type is LINK with reminders enabled:
    // schedule the remaining 1 Hour, 30 Min, 15 Min, and Live cron reminders using pg-boss
    if (scheduleRemaining || type === "LINK") {
      scheduledJobs = await scheduleWebinarReminders({
        eventId: event.id,
        eventTitle: event.title,
        eventDate: event.date,
        eventTime: event.time,
        webinarLink,
        eventDateTimeISO,
        imageBase64,
      });

      // Record scheduled items
      for (const item of scheduledJobs) {
        await DataStore.recordScheduledEmail({
          eventId: event.id,
          type: item.type,
          subject: `Automated Reminder: ${item.label} for ${event.title}`,
          status: "PENDING",
          recipientCount: recipientEmails.length,
          scheduledFor: item.runAt,
        });
      }
    }

    // Cache latest broadcast summary for faster dashboard rendering
    Cache.set(`last_broadcast_${eventId}`, {
      sentAt: new Date().toISOString(),
      recipientsCount: recipientEmails.length,
      type,
    }, 3600);

    return NextResponse.json({
      success: true,
      message: `Broadcast of '${type}' dispatched successfully to ${recipientEmails.length} attendees via Zoho Mail.`,
      recipientsCount: recipientEmails.length,
      scheduledJobs,
    });
  } catch (error) {
    console.error("Webinar broadcast dispatch error:", error);
    return NextResponse.json(
      { error: "Failed to dispatch webinar broadcast" },
      { status: 500 }
    );
  }
}
