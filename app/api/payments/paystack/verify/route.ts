import { NextResponse } from "next/server";
import { verifyPaystackPayment } from "@/lib/paystack";
import { DataStore } from "@/lib/data-store";
import { sendEventRegistrationEmail } from "@/lib/zoho";

export async function POST(req: Request) {
  try {
    const { reference, eventId, name, email, phone } = await req.json();

    if (!reference) {
      return NextResponse.json(
        { error: "Payment reference is required" },
        { status: 400 }
      );
    }

    const verification = await verifyPaystackPayment(reference);

    if (!verification.status || verification.data?.status !== "success") {
      return NextResponse.json(
        { error: "Payment verification failed or payment was not successful" },
        { status: 400 }
      );
    }

    const amountInNaira = verification.data?.amount ? verification.data.amount / 100 : 0;

    let registration;
    if (eventId && name && email && phone) {
      registration = await DataStore.createEventRegistration({
        eventId,
        name,
        email,
        phone,
        paymentStatus: "SUCCESS",
        amountPaid: amountInNaira,
        paystackReference: reference,
      });

      // Send confirmation email asynchronously
      DataStore.getEventById(eventId)
        .then((event) => {
          if (!event) return;
          const imageBase64 = event.imageBytes
            ? `data:${event.imageMimeType || "image/jpeg"};base64,${Buffer.from(event.imageBytes).toString("base64")}`
            : event.image?.startsWith("data:")
            ? event.image
            : null;

          return sendEventRegistrationEmail({
            toEmail: email,
            attendeeName: name,
            eventTitle: event.title,
            eventDate: event.date,
            eventTime: event.time,
            eventLocation: event.location,
            isFree: false,
            amount: amountInNaira,
            webinarLink: event.webinarLink,
            whatsappGroupLink: event.whatsappGroupLink,
            imageBase64,
          });
        })
        .catch((err) => console.error("Paystack post-verify email error:", err));
    }

    return NextResponse.json({
      success: true,
      message: "Payment successfully verified",
      reference,
      amountPaid: amountInNaira,
      registration,
    });
  } catch (error) {
    console.error("Paystack verify error:", error);
    return NextResponse.json(
      { error: "Internal error during payment verification" },
      { status: 500 }
    );
  }
}
