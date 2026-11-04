import { NextResponse } from "next/server";
import { DataStore } from "@/lib/data-store";
import { getAuthenticatedAdmin } from "@/lib/auth";
import { sendAtsClassRegistrationEmail } from "@/lib/zoho";

export async function GET() {
  try {
    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const registrations = await DataStore.getAtsRegistrations();
    return NextResponse.json(registrations);
  } catch (error) {
    console.error("Error fetching ATS registrations:", error);
    return NextResponse.json(
      { error: "Failed to fetch ATS registrations" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, address, phone, email, subjectTaken, atsLevels, notes } = body;

    if (!name || !address || !phone || !email || !subjectTaken) {
      return NextResponse.json(
        { error: "Name, address, phone, email, and subject taken are required" },
        { status: 400 }
      );
    }

    const parsedAtsLevels: string[] = Array.isArray(atsLevels)
      ? atsLevels
      : atsLevels
      ? [String(atsLevels)]
      : ["ATS 1"];

    if (parsedAtsLevels.length === 0) {
      return NextResponse.json(
        { error: "Please select at least one ATS training level" },
        { status: 400 }
      );
    }

    const registration = await DataStore.createAtsRegistration({
      name,
      address,
      phone,
      email,
      subjectTaken,
      atsLevels: parsedAtsLevels,
      notes: notes || "",
    });

    // Find the corresponding WhatsApp groups configured for the selected ATS levels
    const allGroups = await DataStore.getWhatsAppGroups(true);
    const matchingGroups = allGroups.filter((group) =>
      parsedAtsLevels.some(
        (level) =>
          group.atsLevel.toLowerCase() === level.toLowerCase() ||
          group.name.toLowerCase().includes(level.toLowerCase())
      )
    );

    // Send ATS enrollment confirmation email with WhatsApp links asynchronously
    sendAtsClassRegistrationEmail({
      toEmail: email,
      studentName: name,
      address,
      phone,
      subjectTaken,
      atsLevels: parsedAtsLevels,
      whatsappGroups: matchingGroups.map((g) => ({
        name: g.name,
        atsLevel: g.atsLevel,
        inviteUrl: g.inviteUrl,
      })),
    }).catch((err) => console.error("ATS registration email failed:", err));

    return NextResponse.json(
      {
        success: true,
        registration,
        whatsappGroups: matchingGroups,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error processing ATS class registration:", error);
    return NextResponse.json(
      { error: "Failed to process class registration" },
      { status: 500 }
    );
  }
}
