"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  AcademicCapIcon,
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  BookOpenIcon,
  ArrowPathIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  ConfirmDeleteModal,
  NotificationBanner,
  useAdminNotification,
} from "@/components/admin/admin-feedback";

interface AtsRegistration {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  subjectTaken: string;
  atsLevels: string[];
  notes: string | null;
  createdAt: string;
}

export default function AdminClassesPage() {
  const [registrations, setRegistrations] = useState<AtsRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [atsFilter, setAtsFilter] = useState("ALL");

  // Deletion Confirmation Modal State
  const [deleteTarget, setDeleteTarget] = useState<AtsRegistration | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Admin Notification Banner
  const { notification, showSuccess, showError, showWarn, clearNotification } =
    useAdminNotification();

  const fetchRegistrations = async (isManualRefresh = false) => {
    try {
      const res = await fetch("/api/classes");
      if (res.ok) {
        const data = await res.json();
        setRegistrations(data);
        if (isManualRefresh) {
          showSuccess("ATS student registrations refreshed successfully.");
        }
      } else {
        throw new Error("Failed to load ATS registrations");
      }
    } catch (err) {
      console.error("Error fetching class signups:", err);
      showError("Unable to fetch ATS student registrations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const triggerDeleteConfirm = (reg: AtsRegistration) => {
    setDeleteTarget(reg);
  };

  const confirmDeleteStudent = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/classes/${deleteTarget.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setRegistrations(registrations.filter((r) => r.id !== deleteTarget.id));
        showWarn(`ATS Student registration for "${deleteTarget.name}" deleted.`);
        setDeleteTarget(null);
      } else {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete student registration");
      }
    } catch (err: unknown) {
      const error = err as Error;
      showError(error.message || "Failed to delete registration");
    } finally {
      setIsDeleting(false);
    }
  };

  const filtered = registrations.filter((reg) => {
    const matchesSearch =
      reg.name.toLowerCase().includes(search.toLowerCase()) ||
      reg.phone.includes(search) ||
      reg.email.toLowerCase().includes(search.toLowerCase()) ||
      reg.subjectTaken.toLowerCase().includes(search.toLowerCase());

    const matchesStage =
      atsFilter === "ALL" || reg.atsLevels.includes(atsFilter);

    return matchesSearch && matchesStage;
  });

  const exportCSV = () => {
    if (registrations.length === 0) return;
    const headers = [
      "ID",
      "Full Name",
      "Phone",
      "Email",
      "Address",
      "Subjects Taken",
      "ATS Levels",
      "Notes",
      "Registered At",
    ];
    const rows = filtered.map((r) => [
      `"${r.id}"`,
      `"${r.name}"`,
      `"${r.phone}"`,
      `"${r.email}"`,
      `"${r.address.replace(/"/g, '""')}"`,
      `"${r.subjectTaken.replace(/"/g, '""')}"`,
      `"${r.atsLevels.join("; ")}"`,
      `"${(r.notes || "").replace(/"/g, '""')}"`,
      `"${new Date(r.createdAt).toISOString()}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `kdeck_ats_candidates_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showSuccess("ATS roster exported to CSV file.");
  };

  return (
    <div className="space-y-8">
      {/* Toast Notification Banner */}
      <NotificationBanner
        notification={notification}
        onClose={clearNotification}
      />

      {/* Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={Boolean(deleteTarget)}
        title="Confirm Student Registration Deletion"
        description="Are you sure you want to permanently delete this ATS candidate registration? This record will be removed from your student roster."
        itemName={
          deleteTarget
            ? `${deleteTarget.name} (${deleteTarget.atsLevels.join(", ")})`
            : undefined
        }
        confirmLabel="Yes, Delete Student"
        isDeleting={isDeleting}
        onConfirm={confirmDeleteStudent}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
            ATS Training Coaching Roster
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            ATS Classes &amp; Student Registrations
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Accounting Technicians Scheme candidates, enrolled subjects, and WhatsApp cohort routing.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => {
              setLoading(true);
              fetchRegistrations(true);
            }}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-200 hover:bg-neutral-800 hover:text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer disabled:opacity-60"
            title="Refresh ATS student list"
          >
            <ArrowPathIcon
              className={`w-3.5 h-3.5 text-neutral-400 ${
                loading ? "animate-spin text-purple-400" : ""
              }`}
            />
            <span>{loading ? "Refreshing..." : "Refresh"}</span>
          </button>

          <button
            onClick={exportCSV}
            disabled={registrations.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 text-white font-semibold text-xs shadow-md shadow-purple-600/30 hover:bg-purple-500 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <ArrowDownTrayIcon className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filters & Table */}
      <div className="bg-neutral-950 rounded-3xl p-6 sm:p-7 border border-neutral-800/90 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlassIcon className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by student name, phone, email, subject..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-800 bg-neutral-900 text-white text-xs outline-hidden focus:border-purple-500 placeholder:text-neutral-500"
            />
          </div>

          {/* Level Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {["ALL", "Foundation", "ATS 1", "ATS 2", "ATS 3"].map((stage) => (
              <button
                key={stage}
                onClick={() => setAtsFilter(stage)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  atsFilter === stage
                    ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                    : "bg-neutral-900 text-neutral-400 hover:bg-neutral-800 hover:text-white border border-neutral-800"
                }`}
              >
                {stage === "ALL" ? "All Stages" : stage}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="rounded-2xl border border-neutral-800 overflow-hidden">
          <Table>
            <TableHeader className="bg-neutral-900/90">
              <TableRow className="border-neutral-800 hover:bg-transparent">
                <TableHead className="py-3 px-4 font-bold text-neutral-300 uppercase tracking-wider text-[10px]">Student Details</TableHead>
                <TableHead className="py-3 px-4 font-bold text-neutral-300 uppercase tracking-wider text-[10px]">Contact &amp; Address</TableHead>
                <TableHead className="py-3 px-4 font-bold text-neutral-300 uppercase tracking-wider text-[10px]">ATS Stages</TableHead>
                <TableHead className="py-3 px-4 font-bold text-neutral-300 uppercase tracking-wider text-[10px]">Enrolled At</TableHead>
                <TableHead className="py-3 px-4 font-bold text-neutral-300 uppercase tracking-wider text-[10px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-neutral-800/70">
              {filtered.length > 0 ? (
                filtered.map((reg) => (
                  <TableRow key={reg.id} className="hover:bg-neutral-900/50 border-neutral-800/70 transition-colors">
                    <TableCell className="py-4 px-4 font-bold text-white">
                      <Link
                        href={`/admin/classes/${reg.id}`}
                        className="text-white hover:text-purple-400 font-bold transition-colors inline-block"
                        title="View and edit student record"
                      >
                        {reg.name}
                      </Link>
                      <div className="text-[11px] text-neutral-500 font-mono font-normal">
                        ID: #{reg.id.slice(-6)}
                      </div>
                    </TableCell>

                    <TableCell className="py-4 px-4 text-neutral-300">
                      <div className="flex items-center gap-1.5">
                        <PhoneIcon className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                        <span className="text-white font-medium">{reg.phone}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-neutral-400 text-[11px] mt-0.5">
                        <EnvelopeIcon className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                        <span className="font-mono">{reg.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-neutral-400 text-[11px] mt-0.5">
                        <MapPinIcon className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                        <span className="truncate max-w-xs">{reg.address}</span>
                      </div>
                    </TableCell>

                    <TableCell className="py-4 px-4">
                      <div className="flex flex-wrap gap-1">
                        {reg.atsLevels.map((lvl, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-md bg-purple-950/70 text-purple-300 border border-purple-800/60 font-bold text-[10px]"
                          >
                            {lvl}
                          </span>
                        ))}
                      </div>
                    </TableCell>

                    <TableCell className="py-4 px-4 text-neutral-400 whitespace-nowrap text-[11px]">
                      {new Date(reg.createdAt).toLocaleDateString()}
                    </TableCell>

                    <TableCell className="py-4 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/classes/${reg.id}`}
                          className="px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-purple-400 hover:text-purple-300 hover:bg-neutral-800 text-xs font-semibold transition-colors"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => triggerDeleteConfirm(reg)}
                          className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                          title="Delete Student Registration"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow className="border-neutral-800">
                  <TableCell colSpan={5} className="py-10 text-center text-neutral-500 text-xs">
                    {search || atsFilter !== "ALL"
                      ? "No candidates matching your filter criteria."
                      : "No students registered for ATS training yet."}
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
