import { NextResponse } from "next/server";
import { DataStore } from "@/lib/data-store";
import { getAuthenticatedAdmin } from "@/lib/auth";
import { sendEventRegistrationEmail } from "@/lib/zoho";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const event = await DataStore.getEventById(id);
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const registrations = await DataStore.getEventRegistrations(id);
    return NextResponse.json({ event, registrations });
  } catch (error) {
    console.error("Error fetching registrations:", error);
    return NextResponse.json(
      { error: "Failed to fetch event registrations" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const event = await DataStore.getEventById(id);
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const body = await req.json();
    const { name, email, phone, paystackReference, amountPaid } = body;

    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: "Name, email, and phone number are required" },
        { status: 400 }
      );
    }

    const isPaid = !event.isFree && event.amount > 0;
    const status = isPaid ? (paystackReference ? "SUCCESS" : "PENDING") : "FREE";

    const registration = await DataStore.createEventRegistration({
      eventId: id,
      name,
      email,
      phone,
      paymentStatus: status,
      amountPaid: isPaid ? Number(amountPaid || event.amount) : 0,
      paystackReference: paystackReference || null,
    });

    // Send confirmation email asynchronously with webinar link & banner image
    const imageBase64 = event.imageBytes
      ? `data:${event.imageMimeType || "image/jpeg"};base64,${Buffer.from(event.imageBytes).toString("base64")}`
      : event.image?.startsWith("data:")
      ? event.image
      : null;

    sendEventRegistrationEmail({
      toEmail: email,
      attendeeName: name,
      eventTitle: event.title,
      eventDate: event.date,
      eventTime: event.time,
      eventLocation: event.location,
      isFree: event.isFree,
      amount: event.amount,
      webinarLink: event.webinarLink,
      whatsappGroupLink: event.whatsappGroupLink,
      imageBase64,
    }).catch((err) => console.error("Event registration email failed:", err));

    return NextResponse.json(
      {
        success: true,
        registration,
        whatsappGroupLink: event.whatsappGroupLink,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating registration:", error);
    return NextResponse.json(
      { error: "Failed to process registration" },
      { status: 500 }
    );
  }
}
