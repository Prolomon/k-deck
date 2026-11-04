import { NextResponse } from "next/server";
import { DataStore } from "@/lib/data-store";
import { getAuthenticatedAdmin } from "@/lib/auth";
import { sendConsultationNotificationEmail } from "@/lib/zoho";

export const dynamic = "force-dynamic";

// GET /api/consultations (Admin only)
export async function GET() {
  try {
    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 401 });
    }

    const consultations = await DataStore.getConsultations();
    return NextResponse.json(consultations);
  } catch (error: any) {
    console.error("[api/consultations] Error fetching consultation requests:", error);
    return NextResponse.json(
      { error: "Failed to fetch consultation requests" },
      { status: 500 }
    );
  }
}

// POST /api/consultations (Public form submission)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, service, message } = body;

    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: "Name, email, and phone number are required." },
        { status: 400 }
      );
    }

    // 1. Persist to data store
    const consultation = await DataStore.createConsultation({
      name: String(name).trim(),
      email: String(email).trim(),
      phone: String(phone).trim(),
      service: service ? String(service).trim() : "General Consultation",
      message: message ? String(message).trim() : "",
    });

    // 2. Dispatch automated email alerts (Admin notice + Client acknowledgment)
    sendConsultationNotificationEmail({
      name: consultation.name,
      email: consultation.email,
      phone: consultation.phone,
      service: consultation.service,
      message: consultation.message,
    }).catch((err) => {
      console.warn("[api/consultations] Background notification email warning:", err);
    });

    return NextResponse.json(
      {
        success: true,
        message: "Your consultation request has been received. Our partners will connect with you promptly.",
        consultation,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("[api/consultations] Error creating consultation request:", error);
    return NextResponse.json(
      { error: "Failed to submit consultation request. Please try again." },
      { status: 500 }
    );
  }
}
