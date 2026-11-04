"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ChatBubbleBottomCenterTextIcon,
  EnvelopeIcon,
  PhoneIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon,
  TrashIcon,
  EyeIcon,
  CheckCircleIcon,
  ClockIcon,
  UserCircleIcon,
  BuildingOffice2Icon,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  ConfirmDeleteModal,
  NotificationBanner,
  useAdminNotification,
} from "@/components/admin/admin-feedback";

interface ConsultationItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  status: "PENDING" | "CONTACTED" | "RESOLVED" | string;
  createdAt: string;
  updatedAt?: string;
}

export default function ConsultationsAdminPage() {
  const [consultations, setConsultations] = useState<ConsultationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [serviceFilter, setServiceFilter] = useState("ALL");

  // Inspection modal
  const [selectedInquiry, setSelectedInquiry] = useState<ConsultationItem | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Deletion modal
  const [deleteTarget, setDeleteTarget] = useState<ConsultationItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Admin Notification Banner
  const { notification, showSuccess, showError, showWarn, clearNotification } =
    useAdminNotification();

  const fetchConsultations = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const res = await fetch("/api/consultations");
      if (res.ok) {
        const data = await res.json();
        setConsultations(data);
        if (isManual) {
          showSuccess("Consultation requests synchronized successfully.");
        }
      } else {
        throw new Error("Failed to load consultations");
      }
    } catch (err: any) {
      console.error("Error fetching consultations:", err);
      showError("Could not retrieve consultation requests. Please check database connection.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchConsultations();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/consultations/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        throw new Error("Failed to update status");
      }

      setConsultations((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
      );

      if (selectedInquiry && selectedInquiry.id === id) {
        setSelectedInquiry({ ...selectedInquiry, status: newStatus });
      }

      showSuccess(`Inquiry marked as ${newStatus}.`);
    } catch (err: any) {
      console.error("Error updating status:", err);
      showError("Unable to update inquiry status. Try again.");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/consultations/${deleteTarget.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete request");
      }

      setConsultations((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      if (selectedInquiry && selectedInquiry.id === deleteTarget.id) {
        setModalOpen(false);
        setSelectedInquiry(null);
      }

      showWarn(`Consultation inquiry from "${deleteTarget.name}" deleted.`);
      setDeleteTarget(null);
    } catch (err: any) {
      console.error("Error deleting inquiry:", err);
      showError("Failed to delete consultation request.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtered dataset
  const filteredList = consultations.filter((item) => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      item.name.toLowerCase().includes(query) ||
      item.email.toLowerCase().includes(query) ||
      item.phone.toLowerCase().includes(query) ||
      item.service.toLowerCase().includes(query) ||
      item.message.toLowerCase().includes(query);

    const matchesStatus =
      statusFilter === "ALL" || item.status === statusFilter;

    const matchesService =
      serviceFilter === "ALL" || item.service === serviceFilter;

    return matchesSearch && matchesStatus && matchesService;
  });

  // Calculate statistics
  const totalCount = consultations.length;
  const pendingCount = consultations.filter((c) => c.status === "PENDING").length;
  const contactedCount = consultations.filter((c) => c.status === "CONTACTED").length;
  const resolvedCount = consultations.filter((c) => c.status === "RESOLVED").length;

  const uniqueServices = Array.from(
    new Set(consultations.map((c) => c.service).filter(Boolean))
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Toast Notification Banner */}
      <NotificationBanner
        notification={notification}
        onClose={clearNotification}
      />

      {/* Header & Refresh Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-950/60 border border-blue-800/80 text-blue-400">
              <ChatBubbleBottomCenterTextIcon className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Consultation Inquiries
            </h1>
          </div>
          <p className="text-neutral-400 text-xs sm:text-sm mt-1">
            Real-time inbound requests submitted from the public consultation form on the website.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => fetchConsultations(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-200 hover:text-white hover:bg-neutral-800 text-xs font-semibold transition-all cursor-pointer shadow-xs disabled:opacity-50"
            title="Refresh database records"
          >
            <ArrowPathIcon className={`w-4 h-4 ${refreshing ? "animate-spin text-blue-400" : ""}`} />
            <span>{refreshing ? "Refreshing..." : "Refresh"}</span>
          </button>
        </div>
      </div>

      {/* Stats KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-neutral-950 rounded-2xl p-5 border border-neutral-800/90 shadow-xl">
          <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
            Total Inquiries
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white mt-1">
            {totalCount}
          </div>
          <div className="text-[11px] text-neutral-500 mt-1">Lifetime inquiries logged</div>
        </div>

        <div className="bg-neutral-950 rounded-2xl p-5 border border-neutral-800/90 shadow-xl">
          <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
            Pending Review
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-300 mt-1">
            {pendingCount}
          </div>
          <div className="text-[11px] text-neutral-500 mt-1">Awaiting partner callback</div>
        </div>

        <div className="bg-neutral-950 rounded-2xl p-5 border border-neutral-800/90 shadow-xl">
          <div className="text-[11px] font-bold uppercase tracking-wider text-blue-400">
            Contacted
          </div>
          <div className="text-2xl sm:text-3xl font-black text-blue-300 mt-1">
            {contactedCount}
          </div>
          <div className="text-[11px] text-neutral-500 mt-1">In engagement discussion</div>
        </div>

        <div className="bg-neutral-950 rounded-2xl p-5 border border-neutral-800/90 shadow-xl">
          <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
            Resolved / Onboarded
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-300 mt-1">
            {resolvedCount}
          </div>
          <div className="text-[11px] text-neutral-500 mt-1">Successfully addressed</div>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-neutral-950 rounded-2xl p-4 sm:p-5 border border-neutral-800/90 shadow-xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
          {/* Search box */}
          <div className="md:col-span-6 relative">
            <MagnifyingGlassIcon className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by client name, email, phone, or message..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Status Filter using ShadCN Select */}
          <div className="md:col-span-3">
            <Select
              value={statusFilter}
              onValueChange={(val) => val && setStatusFilter(val)}
            >
              <SelectTrigger className="w-full h-10 px-3.5 rounded-xl bg-neutral-900 border-neutral-800 text-white text-xs">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent className="bg-neutral-900 border-neutral-800 text-white">
                <SelectItem value="ALL">All Statuses</SelectItem>
                <SelectItem value="PENDING">Pending Review</SelectItem>
                <SelectItem value="CONTACTED">Contacted / In Progress</SelectItem>
                <SelectItem value="RESOLVED">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Service Filter using ShadCN Select */}
          <div className="md:col-span-3">
            <Select
              value={serviceFilter}
              onValueChange={(val) => val && setServiceFilter(val)}
            >
              <SelectTrigger className="w-full h-10 px-3.5 rounded-xl bg-neutral-900 border-neutral-800 text-white text-xs">
                <SelectValue placeholder="Filter by Service" />
              </SelectTrigger>
              <SelectContent className="bg-neutral-900 border-neutral-800 text-white">
                <SelectItem value="ALL">All Services</SelectItem>
                {uniqueServices.map((svc) => (
                  <SelectItem key={svc} value={svc}>
                    {svc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Main Consultations Table */}
      <div className="bg-neutral-950 rounded-3xl p-6 sm:p-8 border border-neutral-800/90 shadow-xl">
        <Table>
          <TableHeader className="bg-neutral-900/90">
            <TableRow className="border-neutral-800 hover:bg-transparent">
              <TableHead className="py-3.5 px-4 font-bold text-neutral-300 uppercase tracking-wider text-[11px]">
                Client Information
              </TableHead>
              <TableHead className="py-3.5 px-4 font-bold text-neutral-300 uppercase tracking-wider text-[11px]">
                Service Area
              </TableHead>
              <TableHead className="py-3.5 px-4 font-bold text-neutral-300 uppercase tracking-wider text-[11px]">
                Inquiry Preview
              </TableHead>
              <TableHead className="py-3.5 px-4 font-bold text-neutral-300 uppercase tracking-wider text-[11px]">
                Date Submitted
              </TableHead>
              <TableHead className="py-3.5 px-4 font-bold text-neutral-300 uppercase tracking-wider text-[11px]">
                Status
              </TableHead>
              <TableHead className="py-3.5 px-4 font-bold text-neutral-300 uppercase tracking-wider text-[11px] text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-neutral-800/70">
            {loading ? (
              <TableRow className="border-neutral-800">
                <TableCell colSpan={6} className="py-12 text-center text-neutral-400 text-xs">
                  <ArrowPathIcon className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-500" />
                  <span>Loading consultation inquiries...</span>
                </TableCell>
              </TableRow>
            ) : filteredList.length > 0 ? (
              filteredList.map((item) => (
                <TableRow
                  key={item.id}
                  className="hover:bg-neutral-900/50 border-neutral-800/70 transition-colors"
                >
                  {/* Client Info */}
                  <TableCell className="py-4 px-4 font-bold text-white max-w-xs">
                    <button
                      onClick={() => {
                        setSelectedInquiry(item);
                        setModalOpen(true);
                      }}
                      className="text-white hover:text-blue-400 font-bold transition-colors text-left block truncate cursor-pointer"
                      title="Inspect full consultation request"
                    >
                      {item.name}
                    </button>
                    <div className="flex flex-col gap-0.5 mt-1 text-[11px] font-normal text-neutral-400">
                      <a
                        href={`mailto:${item.email}`}
                        className="hover:text-blue-400 transition-colors truncate"
                      >
                        {item.email}
                      </a>
                      <a
                        href={`tel:${item.phone}`}
                        className="hover:text-emerald-400 transition-colors font-mono"
                      >
                        {item.phone}
                      </a>
                    </div>
                  </TableCell>

                  {/* Service Domain */}
                  <TableCell className="py-4 px-4">
                    <span className="px-2.5 py-1 rounded-md bg-blue-950/70 border border-blue-800/60 text-blue-300 font-semibold text-[11px]">
                      {item.service}
                    </span>
                  </TableCell>

                  {/* Inquiry Preview */}
                  <TableCell className="py-4 px-4 max-w-sm">
                    <p
                      onClick={() => {
                        setSelectedInquiry(item);
                        setModalOpen(true);
                      }}
                      className="text-xs text-neutral-300 line-clamp-2 cursor-pointer hover:text-white transition-colors"
                      title="Click to view full message"
                    >
                      {item.message || "— No detailed message provided —"}
                    </p>
                  </TableCell>

                  {/* Date Submitted */}
                  <TableCell className="py-4 px-4 text-neutral-400 text-xs whitespace-nowrap">
                    <div>
                      {new Date(item.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                    <div className="text-[10px] text-neutral-500">
                      {new Date(item.createdAt).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </TableCell>

                  {/* Status Dropdown using ShadCN Select */}
                  <TableCell className="py-4 px-4">
                    <Select
                      value={item.status}
                      onValueChange={(val) => val && handleStatusChange(item.id, val)}
                    >
                      <SelectTrigger
                        className={`w-32 h-8 px-2.5 rounded-lg text-[11px] font-bold border transition-colors ${
                          item.status === "PENDING"
                            ? "bg-amber-950/70 border-amber-800/80 text-amber-300"
                            : item.status === "CONTACTED"
                            ? "bg-blue-950/70 border-blue-800/80 text-blue-300"
                            : "bg-emerald-950/70 border-emerald-800/80 text-emerald-300"
                        }`}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-neutral-900 border-neutral-800 text-white">
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="CONTACTED">Contacted</SelectItem>
                        <SelectItem value="RESOLVED">Resolved</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="py-4 px-4 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setSelectedInquiry(item);
                          setModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-blue-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
                        title="View Full Details"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setDeleteTarget(item)}
                        className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-red-400 hover:text-red-200 hover:bg-red-950/40 transition-colors cursor-pointer"
                        title="Delete Inquiry"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow className="border-neutral-800">
                <TableCell colSpan={6} className="py-12 text-center text-neutral-500 text-xs">
                  No consultation inquiries match your search filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Inquiry Detail Inspection Dialog (ShadCN Dialog) */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="bg-neutral-950 border border-neutral-800 text-white max-w-2xl rounded-2xl p-6 sm:p-8">
          {selectedInquiry && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold border uppercase tracking-wider ${
                      selectedInquiry.status === "PENDING"
                        ? "bg-amber-950/70 border-amber-800 text-amber-300"
                        : selectedInquiry.status === "CONTACTED"
                        ? "bg-blue-950/70 border-blue-800 text-blue-300"
                        : "bg-emerald-950/70 border-emerald-800 text-emerald-300"
                    }`}
                  >
                    {selectedInquiry.status}
                  </span>
                  <span className="text-[11px] text-neutral-500">
                    Logged on {new Date(selectedInquiry.createdAt).toLocaleString()}
                  </span>
                </div>
                <DialogTitle className="text-xl font-bold text-white">
                  {selectedInquiry.name}
                </DialogTitle>
                <DialogDescription className="text-neutral-400 text-xs">
                  Confidential consultation inquiry for {selectedInquiry.service}
                </DialogDescription>
              </DialogHeader>

              {/* Inquiry Details Body */}
              <div className="space-y-4 my-4">
                {/* Contact Card */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-neutral-900/80 border border-neutral-800/80 text-xs">
                  <div>
                    <div className="text-neutral-400 font-semibold mb-1">Email Address</div>
                    <a
                      href={`mailto:${selectedInquiry.email}`}
                      className="text-blue-400 hover:underline font-medium break-all"
                    >
                      {selectedInquiry.email}
                    </a>
                  </div>
                  <div>
                    <div className="text-neutral-400 font-semibold mb-1">Phone Number</div>
                    <a
                      href={`tel:${selectedInquiry.phone}`}
                      className="text-emerald-400 hover:underline font-mono font-medium"
                    >
                      {selectedInquiry.phone}
                    </a>
                  </div>
                </div>

                {/* Message Box */}
                <div>
                  <div className="text-neutral-400 text-xs font-semibold uppercase tracking-wider mb-2">
                    Client Inquiry & Objectives
                  </div>
                  <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-200 text-sm whitespace-pre-line leading-relaxed max-h-60 overflow-y-auto">
                    {selectedInquiry.message || "No additional text provided in the form submission."}
                  </div>
                </div>

                {/* Status Toggle in Modal */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-900/60 border border-neutral-800">
                  <span className="text-xs font-medium text-neutral-300">
                    Update Inquiry Status:
                  </span>
                  <Select
                    value={selectedInquiry.status}
                    onValueChange={(val) => val && handleStatusChange(selectedInquiry.id, val)}
                  >
                    <SelectTrigger className="w-36 h-8 text-xs bg-black border-neutral-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-neutral-900 border-neutral-800 text-white">
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="CONTACTED">Contacted</SelectItem>
                      <SelectItem value="RESOLVED">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Quick Communication Actions in Footer */}
              <DialogFooter className="flex flex-col sm:flex-row gap-2 border-t border-neutral-800 pt-4">
                <a
                  href={`mailto:${selectedInquiry.email}?subject=K-Deck%20Professional%20Services%20-%20Re:%20Consultation%20Inquiry`}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors"
                >
                  <EnvelopeIcon className="w-4 h-4" />
                  <span>Reply via Email</span>
                </a>
                <a
                  href={`https://wa.me/${selectedInquiry.phone.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold transition-colors"
                >
                  <ChatBubbleBottomCenterTextIcon className="w-4 h-4" />
                  <span>Chat on WhatsApp</span>
                </a>
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Close
                </button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Confirmation Modal for Deletion */}
      <ConfirmDeleteModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Consultation Inquiry"
        itemName={deleteTarget ? `${deleteTarget.name} (${deleteTarget.service})` : undefined}
        description={`Are you sure you want to delete the consultation request from "${deleteTarget?.name}"? This action cannot be undone.`}
        isDeleting={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
