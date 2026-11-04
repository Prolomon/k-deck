import { NextResponse } from "next/server";
import { DataStore } from "@/lib/data-store";

export async function POST(req: Request) {
  try {
    const { email, token, newPassword } = await req.json();

    if (!email || !token || !newPassword) {
      return NextResponse.json(
        { error: "Email, reset token, and new password are required" },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const trimmedEmail = String(email).trim().toLowerCase();
    const isValid = await DataStore.verifyAndConsumePasswordResetToken(
      trimmedEmail,
      String(token).trim()
    );

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid or expired reset token. Please request a new link." },
        { status: 400 }
      );
    }

    await DataStore.resetAdminPassword(trimmedEmail, newPassword);

    return NextResponse.json({
      success: true,
      message: "Password reset successfully. You can now sign in with your new password.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Failed to reset password" },
      { status: 500 }
    );
  }
}
