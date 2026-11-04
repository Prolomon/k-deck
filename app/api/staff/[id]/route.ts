import { NextResponse } from "next/server";
import { DataStore } from "@/lib/data-store";
import { getAuthenticatedAdmin } from "@/lib/auth";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const staff = await DataStore.getStaffById(id);
    if (!staff) {
      return NextResponse.json({ error: "Staff profile not found" }, { status: 404 });
    }
    return NextResponse.json(staff);
  } catch (error) {
    console.error("Error fetching staff:", error);
    return NextResponse.json({ error: "Failed to fetch staff" }, { status: 500 });
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

    const updated = await DataStore.updateStaff(id, {
      name: body.name,
      role: body.role,
      department: body.department,
      email: body.email || null,
      phone: body.phone || null,
      bio: body.bio || null,
      image: body.image || null,
      order: body.order !== undefined ? Number(body.order) : undefined,
    });

    if (!updated) {
      return NextResponse.json({ error: "Staff profile not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Staff profile updated successfully",
      staff: updated,
    });
  } catch (error) {
    console.error("Error updating staff:", error);
    return NextResponse.json({ error: "Failed to update staff" }, { status: 500 });
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
    await DataStore.deleteStaff(id);
    return NextResponse.json({ success: true, message: "Staff removed successfully" });
  } catch (error) {
    console.error("Error deleting staff:", error);
    return NextResponse.json({ error: "Failed to delete staff" }, { status: 500 });
  }
}
