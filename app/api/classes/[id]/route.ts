import { NextResponse } from "next/server";
import { DataStore } from "@/lib/data-store";
import { getAuthenticatedAdmin } from "@/lib/auth";

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
    const registration = await DataStore.getAtsRegistrationById(id);
    if (!registration) {
      return NextResponse.json({ error: "ATS registration not found" }, { status: 404 });
    }
    return NextResponse.json(registration);
  } catch (error) {
    console.error("Error fetching ATS registration:", error);
    return NextResponse.json(
      { error: "Failed to fetch ATS registration" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    const updated = await DataStore.updateAtsRegistration(id, {
      name: body.name,
      address: body.address,
      phone: body.phone,
      email: body.email,
      subjectTaken: body.subjectTaken,
      atsLevels: Array.isArray(body.atsLevels) ? body.atsLevels : [body.atsLevels],
      notes: body.notes || null,
    });

    if (!updated) {
      return NextResponse.json({ error: "ATS registration not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "ATS registration updated successfully",
      registration: updated,
    });
  } catch (error) {
    console.error("Error updating ATS registration:", error);
    return NextResponse.json(
      { error: "Failed to update ATS registration" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await DataStore.deleteAtsRegistration(id);
    return NextResponse.json({
      success: true,
      message: "ATS Student Registration deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting ATS registration:", error);
    return NextResponse.json(
      { error: "Failed to delete ATS registration" },
      { status: 500 }
    );
  }
}
