"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CalendarDaysIcon,
  UserGroupIcon,
  AcademicCapIcon,
  ChatBubbleLeftRightIcon,
  ChatBubbleBottomCenterTextIcon,
  BanknotesIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

interface Stats {
  totalEvents: number;
  upcomingEventsCount: number;
  pastEventsCount: number;
  totalRegistrations: number;
  totalStaff: number;
  totalAtsRegistrations: number;
  totalWhatsAppGroups: number;
  totalRevenue: number;
  totalConsultations?: number;
  pendingConsultations?: number;
}

interface Registration {
  id: string;
  name: string;
  email: string;
  phone: string;
  paymentStatus: string;
  amountPaid: number;
  createdAt: string;
  event?: { title: string } | null;
}

interface AtsReg {
  id: string;
  name: string;
  email: string;
  phone: string;
  subjectTaken: string;
  atsLevels: string[];
  createdAt: string;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentRegistrations, setRecentRegistrations] = useState<Registration[]>([]);
  const [recentAtsRegs, setRecentAtsRegs] = useState<AtsReg[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, classesRes, eventsRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/classes"),
        fetch("/api/events"),
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      if (classesRes.ok) {
        const classesData = await classesRes.json();
        setRecentAtsRegs(classesData.slice(0, 5));
      }

      if (eventsRes.ok) {
        // Fetch event registrations for upcoming
        const eventsData = await eventsRes.json();
        if (eventsData.length > 0) {
          const firstEvent = eventsData[0];
          const regRes = await fetch(`/api/events/${firstEvent.id}/registrations`);
          if (regRes.ok) {
            const regData = await regRes.json();
            setRecentRegistrations(regData.registrations?.slice(0, 5) || []);
          }
        }
      }
    } catch (err) {
      console.error("Dashboard data load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Page Title & Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
            Administrative Control Center
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Overview Dashboard
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Real-time monitoring of events, revenue, staff, and ATS class enrollments.
          </p>
        </div>

        {/* Action Shortcuts */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              setLoading(true);
              fetchDashboardData();
            }}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-200 hover:bg-neutral-800 hover:text-white font-semibold text-xs transition-colors cursor-pointer disabled:opacity-60 shadow-xs"
            title="Refresh dashboard data"
          >
            <ArrowPathIcon className={`w-3.5 h-3.5 text-neutral-400 ${loading ? "animate-spin text-blue-400" : ""}`} />
            <span>{loading ? "Refreshing..." : "Refresh Data"}</span>
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {/* Consultation Inquiries */}
        <div className="bg-neutral-950 p-6 rounded-3xl border border-neutral-800/80 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Consultations
            </span>
            <div className="text-3xl font-black text-white mt-1">
              {stats?.totalConsultations ?? 0}
            </div>
            <Link
              href="/admin/consultations"
              className="text-xs text-amber-400 hover:text-amber-300 mt-1 font-medium inline-flex items-center gap-0.5"
            >
              <span>{stats?.pendingConsultations ?? 0} Pending</span>
              <ArrowRightIcon className="w-3 h-3" />
            </Link>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-950/60 border border-amber-800/50 text-amber-400 flex items-center justify-center shrink-0">
            <ChatBubbleBottomCenterTextIcon className="w-6 h-6" />
          </div>
        </div>

        {/* Total Events */}
        <div className="bg-neutral-950 p-6 rounded-3xl border border-neutral-800/80 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Total Events
            </span>
            <div className="text-3xl font-black text-white mt-1">
              {stats?.totalEvents ?? 0}
            </div>
            <div className="text-xs text-blue-400 mt-1 font-medium">
              {stats?.upcomingEventsCount ?? 0} Upcoming &bull; {stats?.pastEventsCount ?? 0} Past
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-950/60 border border-blue-800/50 text-blue-400 flex items-center justify-center shrink-0">
            <CalendarDaysIcon className="w-6 h-6" />
          </div>
        </div>

        {/* ATS Students */}
        <div className="bg-neutral-950 p-6 rounded-3xl border border-neutral-800/80 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              ATS Class Signups
            </span>
            <div className="text-3xl font-black text-white mt-1">
              {stats?.totalAtsRegistrations ?? 0}
            </div>
            <Link
              href="/admin/classes"
              className="text-xs text-purple-400 hover:text-purple-300 mt-1 font-medium inline-flex items-center gap-0.5"
            >
              <span>View registered students</span>
              <ArrowRightIcon className="w-3 h-3" />
            </Link>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-950/60 border border-purple-800/50 text-purple-400 flex items-center justify-center shrink-0">
            <AcademicCapIcon className="w-6 h-6" />
          </div>
        </div>

        {/* Event Attendees */}
        <div className="bg-neutral-950 p-6 rounded-3xl border border-neutral-800/80 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Event Signups
            </span>
            <div className="text-3xl font-black text-white mt-1">
              {stats?.totalRegistrations ?? 0}
            </div>
            <div className="text-xs text-emerald-400 mt-1 font-medium">
              Paid &amp; Free verified
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-950/60 border border-emerald-800/50 text-emerald-400 flex items-center justify-center shrink-0">
            <UserGroupIcon className="w-6 h-6" />
          </div>
        </div>

        {/* WhatsApp Cohorts */}
        <div className="bg-neutral-950 p-6 rounded-3xl border border-neutral-800/80 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              WhatsApp Configs
            </span>
            <div className="text-3xl font-black text-white mt-1">
              {stats?.totalWhatsAppGroups ?? 0}
            </div>
            <Link
              href="/admin/whatsapp"
              className="text-xs text-emerald-400 hover:text-emerald-300 mt-1 font-medium inline-flex items-center gap-0.5"
            >
              <span>Manage active groups</span>
              <ArrowRightIcon className="w-3 h-3" />
            </Link>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-950/60 border border-emerald-800/50 text-emerald-400 flex items-center justify-center shrink-0">
            <ChatBubbleLeftRightIcon className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Two Columns: Recent ATS Signups & Recent Event Attendees */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ATS Class Signups */}
        <div className="bg-neutral-950 rounded-3xl p-6 sm:p-7 border border-neutral-800/90 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold text-white">
                  Recent ATS Training Registrations
                </h2>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Candidates enrolled for ATS Levels 1, 2, and 3
                </p>
              </div>
              <Link
                href="/admin/classes"
                className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
              >
                View All &rarr;
              </Link>
            </div>

            <div className="rounded-2xl border border-neutral-800 overflow-hidden">
              <Table>
                <TableHeader className="bg-neutral-900/90">
                  <TableRow className="hover:bg-transparent border-neutral-800">
                    <TableHead className="text-[10px] font-bold uppercase tracking-wider text-neutral-300 py-3 px-3">Student</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-wider text-neutral-300 py-3 px-3">Contact</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-wider text-neutral-300 py-3 px-3">ATS Level(s)</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-wider text-neutral-300 py-3 px-3">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentAtsRegs.length > 0 ? (
                    recentAtsRegs.map((reg) => (
                      <TableRow key={reg.id} className="hover:bg-neutral-900/50 border-neutral-800/70 transition-colors">
                        <TableCell className="py-3 px-3 font-semibold text-xs text-white">
                          {reg.name}
                        </TableCell>
                        <TableCell className="py-3 px-3 text-xs text-neutral-300">
                          <div className="font-medium text-white">{reg.phone}</div>
                          <div className="text-[11px] text-neutral-400 font-mono">{reg.email}</div>
                        </TableCell>
                        <TableCell className="py-3 px-3">
                          <div className="flex flex-wrap gap-1">
                            {reg.atsLevels.map((lvl, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 rounded-md bg-blue-950/70 text-blue-300 border border-blue-800/60 font-bold text-[10px]"
                              >
                                {lvl}
                              </span>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="py-3 px-3 text-xs text-neutral-400 whitespace-nowrap">
                          {new Date(reg.createdAt).toLocaleDateString([], {
                            month: "short",
                            day: "numeric",
                          })}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow className="border-neutral-800">
                      <TableCell colSpan={4} className="py-8 text-center text-neutral-500 text-xs">
                        No ATS registrations logged yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        {/* Event Registrations */}
        <div className="bg-neutral-950 rounded-3xl p-6 sm:p-7 border border-neutral-800/90 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold text-white">
                  Recent Event Attendees
                </h2>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Attendees registered for webinars &amp; masterclasses
                </p>
              </div>
              <Link
                href="/admin/events"
                className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
              >
                Manage Events &rarr;
              </Link>
            </div>

            <div className="rounded-2xl border border-neutral-800 overflow-hidden">
              <Table>
                <TableHeader className="bg-neutral-900/90">
                  <TableRow className="hover:bg-transparent border-neutral-800">
                    <TableHead className="text-[10px] font-bold uppercase tracking-wider text-neutral-300 py-3 px-3">Attendee</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-wider text-neutral-300 py-3 px-3">Phone</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-wider text-neutral-300 py-3 px-3">Payment</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-wider text-neutral-300 py-3 px-3">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentRegistrations.length > 0 ? (
                    recentRegistrations.map((reg) => (
                      <TableRow key={reg.id} className="hover:bg-neutral-900/50 border-neutral-800/70 transition-colors">
                        <TableCell className="py-3 px-3 font-semibold text-xs text-white">
                          <div className="text-white">{reg.name}</div>
                          <div className="text-[11px] text-neutral-400 font-mono font-normal">{reg.email}</div>
                        </TableCell>
                        <TableCell className="py-3 px-3 text-xs text-neutral-300 font-medium">{reg.phone}</TableCell>
                        <TableCell className="py-3 px-3">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full font-bold text-[10px] ${
                              reg.paymentStatus === "SUCCESS"
                                ? "bg-emerald-950/70 text-emerald-300 border border-emerald-800/60"
                                : reg.paymentStatus === "FREE"
                                ? "bg-blue-950/70 text-blue-300 border border-blue-800/60"
                                : "bg-amber-950/70 text-amber-300 border border-amber-800/60"
                            }`}
                          >
                            {reg.paymentStatus}
                          </span>
                        </TableCell>
                        <TableCell className="py-3 px-3 font-bold text-xs text-white whitespace-nowrap">
                          {reg.amountPaid > 0 ? `₦${reg.amountPaid.toLocaleString()}` : "Free"}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow className="border-neutral-800">
                      <TableCell colSpan={4} className="py-8 text-center text-neutral-500 text-xs">
                        No attendee registrations recorded yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
