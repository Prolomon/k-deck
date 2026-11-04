import { NextResponse } from "next/server";
import { DataStore } from "@/lib/data-store";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    // Optional secret check if CRON_SECRET is configured in environment
    const authHeader = request.headers.get("authorization");
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await DataStore.archiveExpiredEvents();

    return NextResponse.json({
      success: true,
      message: `Checked ${result.checked} events. Archived ${result.updated} event(s) past 1 day to past events.`,
      archivedCount: result.updated,
      archivedIds: result.updatedIds,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("[cron/check-past-events] Error executing cron:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to check and archive past events",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  return GET(request);
}
