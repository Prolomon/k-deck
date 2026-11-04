import { NextResponse } from "next/server";
import { DataStore } from "@/lib/data-store";
import { getAuthenticatedAdmin } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const ats = searchParams.get("ats");

    let groups = await DataStore.getWhatsAppGroups();
    if (ats) {
      groups = groups.filter(
        (g) => g.atsLevel.toLowerCase() === ats.toLowerCase()
      );
    }
    return NextResponse.json(groups);
  } catch (error) {
    console.error("Error fetching WhatsApp groups:", error);
    return NextResponse.json(
      { error: "Failed to fetch WhatsApp groups" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, atsLevel, inviteUrl, description } = body;

    if (!name || !atsLevel || !inviteUrl) {
      return NextResponse.json(
        { error: "Group name, ATS level, and invite link URL are required" },
        { status: 400 }
      );
    }

    const newGroup = await DataStore.createWhatsAppGroup({
      name,
      atsLevel,
      inviteUrl,
      description: description || "",
    });

    return NextResponse.json(newGroup, { status: 201 });
  } catch (error) {
    console.error("Error creating WhatsApp group config:", error);
    return NextResponse.json(
      { error: "Failed to create WhatsApp group config" },
      { status: 500 }
    );
  }
}
