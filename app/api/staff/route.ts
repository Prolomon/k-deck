import { NextResponse } from "next/server";
import { DataStore } from "@/lib/data-store";
import { getAuthenticatedAdmin } from "@/lib/auth";
import { sendStaffWelcomeEmail } from "@/lib/zoho";

export async function GET() {
  try {
    const staff = await DataStore.getStaff();
    return NextResponse.json(staff);
  } catch (error) {
    console.error("Error fetching staff:", error);
    return NextResponse.json({ error: "Failed to fetch staff" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, role, department, email, phone, bio, image, imageBytes, imageMimeType, order, isAdmin } = body;

    if (!name || !role || !department) {
      return NextResponse.json(
        { error: "Name, role, and department are required" },
        { status: 400 }
      );
    }

    const newStaff = await DataStore.createStaff({
      name,
      role,
      department,
      email,
      phone,
      bio,
      image: image || "/images/showcase.jpeg",
      imageBytes: imageBytes ? Buffer.from(imageBytes) : undefined,
      imageMimeType: imageMimeType || "image/jpeg",
      order: order ? Number(order) : 0,
      isAdmin: Boolean(isAdmin),
    });

    // Send onboarding welcome email if email provided
    if (email) {
      sendStaffWelcomeEmail({
        toEmail: email,
        name,
        role,
        department,
        isAdmin: Boolean(isAdmin || role.toLowerCase().includes("admin")),
      }).catch((err) => console.error("Staff welcome email failed:", err));
    }

    return NextResponse.json(newStaff, { status: 201 });
  } catch (error) {
    console.error("Error creating staff:", error);
    return NextResponse.json({ error: "Failed to create staff member" }, { status: 500 });
  }
}
