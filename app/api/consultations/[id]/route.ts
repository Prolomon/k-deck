import { NextResponse } from "next/server";
import { DataStore } from "@/lib/data-store";
import { getAuthenticatedAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 401 });
    }

    const { id } = await params;
    const consultation = await DataStore.getConsultationById(id);
    if (!consultation) {
      return NextResponse.json({ error: "Consultation request not found" }, { status: 404 });
    }

    return NextResponse.json(consultation);
  } catch (error: any) {
    console.error("[api/consultations/[id]] Error fetching consultation:", error);
    return NextResponse.json({ error: "Failed to fetch consultation" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json({ error: "Status is required." }, { status: 400 });
    }

    const updated = await DataStore.updateConsultationStatus(id, status);
    if (!updated) {
      return NextResponse.json({ error: "Consultation request not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, consultation: updated });
  } catch (error: any) {
    console.error("[api/consultations/[id]] Error updating status:", error);
    return NextResponse.json({ error: "Failed to update consultation status" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 401 });
    }

    const { id } = await params;
    const deleted = await DataStore.deleteConsultation(id);
    if (!deleted) {
      return NextResponse.json({ error: "Consultation request not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Consultation deleted successfully." });
  } catch (error: any) {
    console.error("[api/consultations/[id]] Error deleting consultation:", error);
    return NextResponse.json({ error: "Failed to delete consultation" }, { status: 500 });
  }
}
