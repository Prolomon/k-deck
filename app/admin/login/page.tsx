"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  LockClosedIcon,
  EnvelopeIcon,
  KeyIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlToken = searchParams?.get("resetToken") || "";
  const urlEmail = searchParams?.get("email") || "";

  const [mode, setMode] = useState<"login" | "forgot" | "reset">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetToken, setResetToken] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (urlToken && urlEmail) {
      setMode("reset");
      setResetToken(urlToken);
      setEmail(urlEmail);
    }
  }, [urlToken, urlEmail]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      router.push("/admin");
      router.refresh();
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMessage(error.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to process request");
      }

      setSuccessMessage(
        "A password recovery link has been dispatched to your email address via Zoho Mail."
      );
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMessage(error.message || "Unable to send reset email");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          token: resetToken,
          newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Reset failed");
      }

      setSuccessMessage("Password reset successfully! You can now sign in.");
      setPassword(newPassword);
      setMode("login");
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMessage(error.message || "Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Brand Header */}
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center gap-3 group">
          <div className="relative w-12 h-12">
            <Image
              src="/images/k-deck.png"
              alt="K-Deck Logo"
              fill
              sizes="48px"
              className="object-contain"
            />
          </div>
          <div className="text-left">
            <span className="text-lg font-black text-white tracking-tight block">
              K-DECK PROFESSIONAL
            </span>
            <span className="text-xs font-semibold text-blue-400 tracking-wider uppercase block -mt-1">
              SECURE ADMIN PORTAL
            </span>
          </div>
        </Link>
      </div>

      {/* ShadCN Card in Deep Black */}
      <Card className="bg-neutral-950/95 backdrop-blur-md rounded-3xl p-2 sm:p-4 shadow-2xl border border-neutral-800 text-neutral-100">
        <CardHeader className="text-center pb-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-950/70 border border-blue-800/60 text-blue-400 flex items-center justify-center mx-auto mb-3 shadow-inner">
            <LockClosedIcon className="w-6 h-6" />
          </div>
          <CardTitle className="text-2xl font-bold text-white tracking-tight">
            {mode === "login" && "Staff & Admin Sign In"}
            {mode === "forgot" && "Recover Account Password"}
            {mode === "reset" && "Set New Password"}
          </CardTitle>
          <CardDescription className="text-xs text-neutral-400 mt-1">
            {mode === "login" && "IT Services & System Administration Directorate"}
            {mode === "forgot" && "Enter your email to receive recovery instructions via Zoho Mail"}
            {mode === "reset" && "Enter and confirm your new administrator password"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-950/50 border border-red-800/80 text-red-200 text-xs text-center font-medium">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-emerald-950/50 border border-emerald-800/80 text-emerald-200 text-xs text-center font-medium flex items-center justify-center gap-2">
              <CheckCircleIcon className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* LOGIN MODE */}
          {mode === "login" && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <Label
                  htmlFor="email"
                  className="block text-xs font-semibold uppercase tracking-wider text-neutral-300"
                >
                  Staff Administrator Username / Email
                </Label>
                <div className="relative">
                  <EnvelopeIcon className="w-5 h-5 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <Input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 h-11 rounded-xl bg-neutral-900 border-neutral-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm text-white placeholder:text-neutral-500"
                    placeholder="name@kdeckprofessionalservices.com.ng"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="password"
                    className="block text-xs font-semibold uppercase tracking-wider text-neutral-300"
                  >
                    Security Password
                  </Label>
                  <button
                    type="button"
                    onClick={() => {
                      setErrorMessage("");
                      setSuccessMessage("");
                      setMode("forgot");
                    }}
                    className="text-xs text-blue-400 hover:text-blue-300 font-semibold cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <KeyIcon className="w-5 h-5 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <Input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 h-11 rounded-xl bg-neutral-900 border-neutral-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm text-white placeholder:text-neutral-500"
                    placeholder="••••••••••••"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full mt-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 h-11 rounded-xl transition-all shadow-md shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 text-sm"
              >
                {loading ? (
                  <>
                    <ArrowPathIcon className="w-4 h-4 animate-spin" />
                    <span>Authenticating Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Dashboard</span>
                    <ArrowRightIcon className="w-4 h-4" />
                  </>
                )}
              </Button>
            </form>
          )}

          {/* FORGOT PASSWORD MODE */}
          {mode === "forgot" && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="space-y-1.5">
                <Label
                  htmlFor="forgot-email"
                  className="block text-xs font-semibold uppercase tracking-wider text-neutral-300"
                >
                  Registered Staff Email
                </Label>
                <div className="relative">
                  <EnvelopeIcon className="w-5 h-5 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <Input
                    type="email"
                    id="forgot-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 h-11 rounded-xl bg-neutral-900 border-neutral-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm text-white placeholder:text-neutral-500"
                    placeholder="your.email@kdeckprofessionalservices.com.ng"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 h-11 rounded-xl transition-all shadow-md shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 text-sm"
              >
                {loading ? (
                  <>
                    <ArrowPathIcon className="w-4 h-4 animate-spin" />
                    <span>Sending Recovery Link...</span>
                  </>
                ) : (
                  <>
                    <span>Send Reset Link via Zoho Mail</span>
                    <ArrowRightIcon className="w-4 h-4" />
                  </>
                )}
              </Button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setErrorMessage("");
                    setSuccessMessage("");
                    setMode("login");
                  }}
                  className="text-xs text-neutral-400 hover:text-white font-medium cursor-pointer"
                >
                  &larr; Back to Sign In
                </button>
              </div>
            </form>
          )}

          {/* RESET PASSWORD MODE */}
          {mode === "reset" && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-1.5">
                <Label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300">
                  New Security Password
                </Label>
                <div className="relative">
                  <KeyIcon className="w-5 h-5 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 h-11 rounded-xl bg-neutral-900 border-neutral-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm text-white placeholder:text-neutral-500"
                    placeholder="At least 6 characters"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300">
                  Confirm New Password
                </Label>
                <div className="relative">
                  <KeyIcon className="w-5 h-5 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 h-11 rounded-xl bg-neutral-900 border-neutral-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm text-white placeholder:text-neutral-500"
                    placeholder="Repeat new password"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 h-11 rounded-xl transition-all shadow-md shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 text-sm"
              >
                {loading ? (
                  <>
                    <ArrowPathIcon className="w-4 h-4 animate-spin" />
                    <span>Updating Password...</span>
                  </>
                ) : (
                  <>
                    <span>Save New Password</span>
                    <ArrowRightIcon className="w-4 h-4" />
                  </>
                )}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>

      <div className="text-center mt-6">
        <Link
          href="/"
          className="text-xs text-neutral-400 hover:text-white transition-colors"
        >
          &larr; Return to Public Website
        </Link>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-black text-neutral-100 flex flex-col justify-center items-center p-4 selection:bg-blue-500/30 selection:text-blue-200">
      <Suspense fallback={<div className="text-white text-sm">Loading admin security portal...</div>}>
        <AdminLoginForm />
      </Suspense>
    </div>
  );
}
