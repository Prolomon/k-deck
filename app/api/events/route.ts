import { NextResponse } from "next/server";
import { DataStore } from "@/lib/data-store";
import { getAuthenticatedAdmin } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const filter = searchParams.get("filter"); // 'all', 'upcoming', 'past'

    const allEvents = await DataStore.getEvents(true);

    if (filter === "upcoming") {
      return NextResponse.json(allEvents.filter((e) => !e.isPast));
    }
    if (filter === "past") {
      return NextResponse.json(allEvents.filter((e) => e.isPast));
    }
    return NextResponse.json(allEvents);
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 401 });
    }

    const body = await req.json();
    const {
      title,
      description,
      content,
      category,
      date,
      time,
      location,
      webinarLink,
      image,
      imageBytes,
      imageMimeType,
      isFree,
      amount,
      isPast,
      whatsappGroupLink,
    } = body;

    if (!title || !description || !date || !time) {
      return NextResponse.json(
        { error: "Title, description, date, and time are required." },
        { status: 400 }
      );
    }

    const freeBoolean = Boolean(isFree);
    const parsedAmount = freeBoolean ? 0 : Number(amount || 0);

    // If image is a Base64 data URI, extract bytes directly
    let resolvedBytes: Buffer | undefined;
    let resolvedMime = imageMimeType || "image/jpeg";

    if (imageBytes) {
      resolvedBytes = Buffer.from(imageBytes);
    } else if (image && typeof image === "string" && image.startsWith("data:")) {
      const match = image.match(/^data:([^;]+);base64,(.+)$/);
      if (match) {
        resolvedMime = match[1];
        resolvedBytes = Buffer.from(match[2], "base64");
      }
    }

    const newEvent = await DataStore.createEvent({
      title,
      description,
      content: content || "",
      category: category || "Webinar",
      date,
      time,
      location: location || "Virtual (Online)",
      webinarLink: webinarLink || null,
      image: image || "/images/webinar-pc.jpg",
      imageBytes: resolvedBytes,
      imageMimeType: resolvedMime,
      isFree: freeBoolean,
      amount: parsedAmount,
      isPast: Boolean(isPast),
      whatsappGroupLink: whatsappGroupLink || "",
    });

    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
  }
}
