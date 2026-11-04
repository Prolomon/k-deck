import { NextResponse } from "next/server";
import { initializePaystackPayment } from "@/lib/paystack";
import { DataStore } from "@/lib/data-store";

export async function POST(req: Request) {
  try {
    const { eventId, name, email, phone } = await req.json();

    if (!eventId || !email || !name) {
      return NextResponse.json(
        { error: "Event ID, name, and email are required" },
        { status: 400 }
      );
    }

    const event = await DataStore.getEventById(eventId);
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    if (event.isFree || event.amount <= 0) {
      return NextResponse.json(
        { error: "This event is free. No payment initialization required." },
        { status: 400 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const callbackUrl = `${appUrl}/events?payment=callback&eventId=${eventId}`;

    const paystackRes = await initializePaystackPayment({
      email,
      amountInNaira: event.amount,
      callbackUrl,
      metadata: {
        eventId,
        name,
        phone,
      },
    });

    if (!paystackRes.status) {
      return NextResponse.json(
        { error: paystackRes.message || "Failed to initialize payment with Paystack" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      authorizationUrl: paystackRes.data?.authorization_url,
      reference: paystackRes.data?.reference,
      accessCode: paystackRes.data?.access_code,
      amount: event.amount,
    });
  } catch (error) {
    console.error("Paystack init error:", error);
    return NextResponse.json(
      { error: "Internal payment processing error" },
      { status: 500 }
    );
  }
}
