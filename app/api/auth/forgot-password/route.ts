import { NextResponse } from "next/server";
import crypto from "crypto";
import { DataStore } from "@/lib/data-store";
import { sendPasswordResetEmail } from "@/lib/zoho";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const trimmedEmail = String(email).trim().toLowerCase();

    // Check if admin or staff
    const admin = await DataStore.findAdminByEmail(trimmedEmail);
    const staffList = await DataStore.getStaff();
    const staffMatch = staffList.find(
      (s) => s.email && s.email.toLowerCase() === trimmedEmail
    );

    const userName = admin?.name || staffMatch?.name || "K-Deck Team Member";

    // Generate secure random reset token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await DataStore.createPasswordResetToken(trimmedEmail, token, expiresAt);

    // Send email via Zoho Mail
    await sendPasswordResetEmail({
      toEmail: trimmedEmail,
      name: userName,
      resetToken: token,
    });

    return NextResponse.json({
      success: true,
      message: "If that email is registered, a password recovery link has been sent.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Failed to process password reset request" },
      { status: 500 }
    );
  }
}
