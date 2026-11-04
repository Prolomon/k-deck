import { NextResponse } from "next/server";
import { DataStore } from "@/lib/data-store";
import { getAuthenticatedAdmin } from "@/lib/auth";

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
    await DataStore.deleteWhatsAppGroup(id);
    return NextResponse.json({ success: true, message: "WhatsApp group configuration deleted" });
  } catch (error) {
    console.error("Error deleting WhatsApp group:", error);
    return NextResponse.json(
      { error: "Failed to delete WhatsApp group" },
      { status: 500 }
    );
  }
}
