"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  ChartBarSquareIcon,
  CalendarDaysIcon,
  UserGroupIcon,
  AcademicCapIcon,
  ChatBubbleLeftRightIcon,
  StarIcon,
  ArrowLeftOnRectangleIcon,
  ArrowTopRightOnSquareIcon,
  Bars3Icon,
  XMarkIcon,
  GlobeAltIcon,
  EnvelopeIcon,
  ChatBubbleBottomCenterTextIcon,
} from "@heroicons/react/24/outline";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Authenticate session via HTTP-only cookie check (never sessionStorage)
  useEffect(() => {
    if (pathname === "/admin/login") return;

    fetch("/api/auth/me")
      .then((res) => {
        if (!res.ok) {
          router.push("/admin/login");
        }
      })
      .catch(() => {
        router.push("/admin/login");
      });
  }, [pathname, router]);

  // If on login page, render children directly without admin sidebar
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const navItems = [
    { name: "Overview Dashboard", href: "/admin", icon: ChartBarSquareIcon },
    { name: "Consultation Inquiries", href: "/admin/consultations", icon: ChatBubbleBottomCenterTextIcon },
    { name: "Event Management", href: "/admin/events", icon: CalendarDaysIcon },
    { name: "Webinar Broadcasts", href: "/admin/webinar-broadcast", icon: EnvelopeIcon },
    { name: "Staff Management", href: "/admin/staff", icon: UserGroupIcon },
    { name: "ATS Class Signups", href: "/admin/classes", icon: AcademicCapIcon },
    { name: "WhatsApp Config", href: "/admin/whatsapp", icon: ChatBubbleLeftRightIcon },
    { name: "Platform Reviews", href: "/admin/reviews", icon: StarIcon },
  ];

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch {
      router.push("/admin/login");
    }
  };

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  const getPageTitle = () => {
    if (pathname === "/admin") return "Overview Dashboard";
    if (pathname.startsWith("/admin/consultations")) return "Consultation Inquiries";
    if (pathname.startsWith("/admin/events/") && pathname.includes("/registrations"))
      return "Attendee Registrations";
    if (pathname.startsWith("/admin/events")) return "Event Management";
    if (pathname.startsWith("/admin/webinar-broadcast")) return "Webinar Broadcasts";
    if (pathname.startsWith("/admin/staff")) return "Staff Directory & Roles";
    if (pathname.startsWith("/admin/classes")) return "ATS Class Enrollments";
    if (pathname.startsWith("/admin/whatsapp")) return "WhatsApp Group Routing";
    if (pathname.startsWith("/admin/reviews")) return "Platform Review Management";
    return "Administrative Control Portal";
  };

  return (
    <div className="dark min-h-screen bg-black text-neutral-100 flex flex-col lg:flex-row antialiased selection:bg-blue-600 selection:text-white">
      {/* Mobile Top Header */}
      <div className="lg:hidden bg-black text-white px-4 py-3 flex items-center justify-between sticky top-0 z-40 border-b border-neutral-800 shadow-sm">
        <Link href="/admin" className="flex items-center gap-2.5">
          <div className="relative w-8 h-8">
            <Image
              src="/images/k-deck.png"
              alt="Logo"
              fill
              sizes="32px"
              className="object-contain"
            />
          </div>
          <div>
            <span className="font-extrabold text-sm tracking-tight block">K-DECK</span>
            <span className="text-[9px] font-semibold text-blue-400 uppercase tracking-widest block -mt-1">
              Admin Portal
            </span>
          </div>
        </Link>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-xl bg-neutral-900 text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
          aria-label="Toggle navigation"
        >
          {sidebarOpen ? <XMarkIcon className="w-5 h-5" /> : <Bars3Icon className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation with Independent Custom Scrollbar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-black text-neutral-200 flex flex-col border-r border-neutral-800/80 transition-transform duration-300 ease-in-out lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        {/* Fixed Header section in Sidebar */}
        <div className="p-6 pb-4 border-b border-neutral-900 flex items-center justify-between shrink-0">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 transition-transform duration-200 group-hover:scale-105">
              <Image
                src="/images/k-deck.png"
                alt="K-Deck"
                fill
                sizes="40px"
                className="object-contain"
              />
            </div>
            <div>
              <span className="text-sm font-black text-white block tracking-tight group-hover:text-blue-400 transition-colors">
                K-DECK
              </span>
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest block -mt-0.5">
                Control Portal
              </span>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-neutral-900 cursor-pointer"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation section with its own deep black scrollbar */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-1.5 [scrollbar-width:thin] [scrollbar-color:#262626_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-neutral-800 hover:[&::-webkit-scrollbar-thumb]:bg-neutral-700">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-neutral-500">
            System Modules
          </div>
          {navItems.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                  active
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                    : "text-neutral-400 hover:bg-neutral-900 hover:text-white"
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${active ? "text-white" : "text-neutral-400"}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Sign Out Action at Bottom of Sidebar */}
        <div className="p-4 border-t border-neutral-900 shrink-0 bg-black">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-red-950/20 border border-red-900/40 text-red-400 hover:bg-red-900/40 hover:text-red-200 transition-all text-xs font-semibold cursor-pointer shadow-xs"
          >
            <ArrowLeftOnRectangleIcon className="w-4 h-4" />
            <span>Sign Out Session</span>
          </button>
        </div>
      </aside>

      {/* Main Viewport Container */}
      <div className="flex-1 min-w-0 flex flex-col bg-black">
        {/* UNIQUE UNIFIED ADMIN TOP HEADER ACROSS ALL PAGES */}
        <header className="sticky top-0 z-30 bg-black/90 backdrop-blur-md border-b border-neutral-800/80 px-4 sm:px-8 py-3.5 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 max-w-7xl mx-auto w-full">
            {/* Left: Dynamic Location Indicator */}
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-sm shadow-emerald-500/50" />
              <div>
                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block">
                  K-Deck Management Desk
                </span>
                <h2 className="text-sm sm:text-base font-bold text-white tracking-tight leading-tight">
                  {getPageTitle()}
                </h2>
              </div>
            </div>

            {/* Right: Quick External Actions & User Details */}
            <div className="flex items-center flex-wrap gap-2.5 sm:gap-4 self-end sm:self-auto">
              {/* Review Page Link Button */}
              <Link
                href="/review"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-950/40 border border-purple-800/50 text-purple-300 hover:bg-purple-900/60 hover:text-white text-xs font-semibold transition-colors shadow-2xs"
                title="Open Client Review Page"
              >
                <StarIcon className="w-3.5 h-3.5 text-purple-400" />
                <span className="hidden sm:inline">Review Page</span>
                <span className="sm:hidden">Reviews</span>
                <ArrowTopRightOnSquareIcon className="w-3 h-3 text-purple-400" />
              </Link>

              {/* Main Website Link Button */}
              <Link
                href="/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:bg-neutral-800 hover:text-white text-xs font-semibold transition-colors shadow-2xs"
                title="Open Public Website"
              >
                <GlobeAltIcon className="w-3.5 h-3.5 text-blue-400" />
                <span className="hidden sm:inline">Main Website</span>
                <span className="sm:hidden">Website</span>
                <ArrowTopRightOnSquareIcon className="w-3 h-3 text-neutral-400" />
              </Link>

              {/* Divider */}
              <div className="h-6 w-px bg-neutral-800 hidden sm:block" />

              {/* User Name & Role in Header */}
              <div className="flex items-center gap-2.5 pl-1 sm:pl-0">
                <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-extrabold text-xs shadow-md shadow-blue-600/30 ring-2 ring-blue-500/30 shrink-0">
                  IT
                </div>
                <div className="text-left leading-tight">
                  <div className="font-bold text-white text-xs truncate max-w-[160px] sm:max-w-xs">
                    IT Systems Directorate
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[10px] font-bold text-blue-300 uppercase tracking-wider bg-blue-950/60 px-1.5 py-0.5 rounded-sm border border-blue-800/60 font-mono">
                      Role: Admin
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Viewport with Professional Spacing */}
        <main className="flex-1 p-5 sm:p-8 lg:p-10 max-w-7xl w-full mx-auto space-y-8 bg-black">
          {children}
        </main>
      </div>
    </div>
  );
}
