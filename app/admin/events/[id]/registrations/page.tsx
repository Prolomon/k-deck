"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import {
  ArrowLeftIcon,
  UserGroupIcon,
  CalendarDaysIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";

interface Registration {
  id: string;
  name: string;
  email: string;
  phone: string;
  paymentStatus: string;
  amountPaid: number;
  paystackReference: string | null;
  createdAt: string;
}

interface EventDetail {
  id: string;
  title: string;
  category: string;
  date: string;
  time: string;
  location: string;
  isFree: boolean;
  amount: number;
}

export default function EventRegistrationsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchRegistrations = async () => {
    try {
      const res = await fetch(`/api/events/${id}/registrations`);
      if (res.ok) {
        const data = await res.json();
        setEvent(data.event);
        setRegistrations(data.registrations || []);
      }
    } catch (err) {
      console.error("Error fetching event registrations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, [id]);

  const filtered = registrations.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase()) ||
      r.phone.includes(search)
  );

  const totalCollected = registrations.reduce(
    (acc, curr) => acc + (curr.amountPaid || 0),
    0
  );

  const exportToCSV = () => {
    const headers = ["Name", "Email", "Phone", "Status", "Amount", "Reference", "Date"];
    const rows = filtered.map((r) => [
      `"${r.name}"`,
      `"${r.email}"`,
      `"${r.phone}"`,
      `"${r.paymentStatus}"`,
      r.amountPaid,
      `"${r.paystackReference || "N/A"}"`,
      `"${new Date(r.createdAt).toLocaleString()}"`,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `registrations-${id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      {/* Back button */}
      <div>
        <Link
          href="/admin/events"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-400 hover:text-blue-400 transition-colors"
        >
          <ArrowLeftIcon className="w-3.5 h-3.5" />
          <span>Back to Event Management</span>
        </Link>
      </div>

      {/* Header & Event Overview */}
      <div className="bg-neutral-950 p-6 sm:p-8 rounded-3xl border border-neutral-800/90 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-blue-950/70 text-blue-300 border border-blue-800/60 text-[11px] font-bold uppercase">
              {event?.category || "Webinar"}
            </span>
            {event?.isFree ? (
              <span className="px-2 py-0.5 rounded-full bg-emerald-950/70 text-emerald-300 border border-emerald-800/60 text-[10px] font-bold">
                Free Event
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full bg-blue-950/70 text-blue-300 border border-blue-800/60 text-[10px] font-bold">
                ₦{event?.amount.toLocaleString()} Admission
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            {event?.title || "Event Registrations"}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-400">
            <div className="flex items-center gap-1.5">
              <CalendarDaysIcon className="w-4 h-4 text-neutral-500" />
              <span>{event?.date} at {event?.time}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPinIcon className="w-4 h-4 text-neutral-500" />
              <span>{event?.location}</span>
            </div>
          </div>
        </div>

        {/* Counter badges */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="text-center p-4 rounded-2xl bg-neutral-900 border border-neutral-800 min-w-28 shadow-xs">
            <span className="text-[10px] font-bold uppercase text-blue-400 tracking-wider block">
              Total Signups
            </span>
            <span className="text-2xl font-black text-white block mt-0.5">
              {registrations.length}
            </span>
          </div>
          <div className="text-center p-4 rounded-2xl bg-neutral-900 border border-neutral-800 min-w-32 shadow-xs">
            <span className="text-[10px] font-bold uppercase text-emerald-400 tracking-wider block">
              Revenue Generated
            </span>
            <span className="text-2xl font-black text-white block mt-0.5">
              ₦{totalCollected.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Registrations List */}
      <div className="bg-neutral-950 rounded-3xl p-6 sm:p-8 border border-neutral-800/90 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative max-w-sm w-full">
            <MagnifyingGlassIcon className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by attendee name, email, or phone..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 text-xs outline-hidden focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => {
                setLoading(true);
                fetchRegistrations();
              }}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-neutral-200 font-semibold text-xs transition-colors cursor-pointer disabled:opacity-60 shadow-xs"
              title="Refresh attendee registrations"
            >
              <ArrowPathIcon className={`w-3.5 h-3.5 text-neutral-400 ${loading ? "animate-spin text-blue-400" : ""}`} />
              <span>{loading ? "Refreshing..." : "Refresh"}</span>
            </button>

            <button
              onClick={exportToCSV}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-200 font-semibold text-xs transition-colors cursor-pointer"
            >
              <ArrowDownTrayIcon className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-800 overflow-hidden">
          <Table>
            <TableHeader className="bg-neutral-900/90">
              <TableRow className="border-neutral-800 hover:bg-transparent">
                <TableHead className="py-3 px-4 font-bold text-neutral-300 uppercase tracking-wider text-[10px]">Attendee Name</TableHead>
                <TableHead className="py-3 px-4 font-bold text-neutral-300 uppercase tracking-wider text-[10px]">Email Address</TableHead>
                <TableHead className="py-3 px-4 font-bold text-neutral-300 uppercase tracking-wider text-[10px]">Phone Number</TableHead>
                <TableHead className="py-3 px-4 font-bold text-neutral-300 uppercase tracking-wider text-[10px]">Payment Status</TableHead>
                <TableHead className="py-3 px-4 font-bold text-neutral-300 uppercase tracking-wider text-[10px]">Amount Paid</TableHead>
                <TableHead className="py-3 px-4 font-bold text-neutral-300 uppercase tracking-wider text-[10px]">Paystack Ref</TableHead>
                <TableHead className="py-3 px-4 font-bold text-neutral-300 uppercase tracking-wider text-[10px]">Registered At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-neutral-800/70">
              {filtered.length > 0 ? (
                filtered.map((reg) => (
                  <TableRow key={reg.id} className="hover:bg-neutral-900/50 border-neutral-800/70 transition-colors">
                    <TableCell className="py-3.5 px-4 font-bold text-white">
                      {reg.name}
                    </TableCell>
                    <TableCell className="py-3.5 px-4 text-neutral-400 font-mono text-[11px]">
                      {reg.email}
                    </TableCell>
                    <TableCell className="py-3.5 px-4 text-neutral-300 font-medium">
                      {reg.phone}
                    </TableCell>
                    <TableCell className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
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
                    <TableCell className="py-3.5 px-4 font-bold text-white">
                      {reg.amountPaid > 0
                        ? `₦${reg.amountPaid.toLocaleString()}`
                        : "Free"}
                    </TableCell>
                    <TableCell className="py-3.5 px-4 text-neutral-500 font-mono text-[10px]">
                      {reg.paystackReference || "-"}
                    </TableCell>
                    <TableCell className="py-3.5 px-4 text-neutral-400 whitespace-nowrap text-xs">
                      {new Date(reg.createdAt).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow className="border-neutral-800">
                  <TableCell colSpan={7} className="py-10 text-center text-neutral-500 text-xs">
                    {search
                      ? "No attendees matching your search filter."
                      : "No one has registered for this event yet."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
