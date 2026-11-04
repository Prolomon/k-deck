"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  CalendarDaysIcon,
  PlusIcon,
  TrashIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  XMarkIcon,
  CheckCircleIcon,
  ArrowTopRightOnSquareIcon,
  ClockIcon,
  EnvelopeIcon,
  PhotoIcon,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ConfirmDeleteModal,
  NotificationBanner,
  useAdminNotification,
} from "@/components/admin/admin-feedback";

interface EventItem {
  id: string;
  title: string;
  description: string;
  content: string | null;
  category: string;
  date: string;
  time: string;
  location: string;
  webinarLink?: string | null;
  image: string | null;
  isFree: boolean;
  amount: number;
  isPast: boolean;
  whatsappGroupLink: string | null;
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [uploadedImageBytesInfo, setUploadedImageBytesInfo] = useState<{
    name: string;
    bytes: number;
  } | null>(null);

  // Deletion Confirmation Modal State
  const [deleteTarget, setDeleteTarget] = useState<EventItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Admin Notification Banner
  const { notification, showSuccess, showError, showWarn, clearNotification } =
    useAdminNotification();

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    category: "Webinar",
    date: "",
    time: "",
    location: "Virtual (Online / Zoom)",
    webinarLink: "",
    image: "/images/webinar-pc.jpg",
    isFree: true,
    amount: "0",
    isPast: false,
    whatsappGroupLink: "",
  });

  const fetchEvents = async (isManualRefresh = false) => {
    try {
      const res = await fetch("/api/events?filter=all");
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
        if (isManualRefresh) {
          showSuccess("Events list refreshed successfully.");
        }
      }
    } catch (err) {
      console.error("Error fetching events:", err);
      showError("Unable to fetch events list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result as string;
      setFormData((prev) => ({ ...prev, image: base64String }));
      setUploadedImageBytesInfo({
        name: file.name,
        bytes: file.size,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.date || !formData.time) {
      setErrorMessage("Please complete all required fields.");
      return;
    }

    if (!formData.isFree && (!formData.amount || Number(formData.amount) <= 0)) {
      setErrorMessage("Please specify a valid payment amount for a paid event.");
      return;
    }

    setSubmitting(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          amount: formData.isFree ? 0 : Number(formData.amount),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create event");
      }

      const createdTitle = formData.title;
      setModalOpen(false);
      setUploadedImageBytesInfo(null);
      setFormData({
        title: "",
        description: "",
        content: "",
        category: "Webinar",
        date: "",
        time: "",
        location: "Virtual (Online / Zoom)",
        webinarLink: "",
        image: "/images/webinar-pc.jpg",
        isFree: true,
        amount: "0",
        isPast: false,
        whatsappGroupLink: "",
      });
      fetchEvents();
      showSuccess(`Event "${createdTitle}" created successfully!`);
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMessage(error.message || "Failed to create event");
      showError(error.message || "Failed to create event");
    } finally {
      setSubmitting(false);
    }
  };

  const triggerDeleteConfirm = (evt: EventItem) => {
    setDeleteTarget(evt);
  };

  const confirmDeleteEvent = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/events/${deleteTarget.id}`, { method: "DELETE" });
      if (res.ok) {
        setEvents(events.filter((e) => e.id !== deleteTarget.id));
        showWarn(`Event "${deleteTarget.title}" and registrations deleted.`);
        setDeleteTarget(null);
      } else {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete event");
      }
    } catch (err: unknown) {
      const error = err as Error;
      showError(error.message || "Failed to delete event");
    } finally {
      setIsDeleting(false);
    }
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
        title="Confirm Event Deletion"
        description="Are you sure you want to permanently delete this masterclass event? All attendee registrations and webinar reminder queue logs linked to this event will also be removed."
        itemName={deleteTarget ? `${deleteTarget.title} (${deleteTarget.date})` : undefined}
        confirmLabel="Yes, Delete Event"
        isDeleting={isDeleting}
        onConfirm={confirmDeleteEvent}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
            Events &amp; Webinars
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Event Management
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Create upcoming webinars, configure free or paid pricing with Paystack, and inspect attendee lists.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => {
              setLoading(true);
              fetchEvents(true);
            }}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-200 hover:bg-neutral-800 hover:text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer disabled:opacity-60"
            title="Refresh events list"
          >
            <ArrowPathIcon className={`w-3.5 h-3.5 text-neutral-400 ${loading ? "animate-spin text-blue-400" : ""}`} />
            <span>{loading ? "Refreshing..." : "Refresh"}</span>
          </button>

          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold text-xs shadow-md shadow-blue-600/30 hover:bg-blue-500 transition-colors cursor-pointer"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Add New Event</span>
          </button>
        </div>
      </div>

      {/* Events Table */}
      <div className="bg-neutral-950 rounded-3xl p-6 sm:p-8 border border-neutral-800/90 shadow-xl">
        <Table>
          <TableHeader className="bg-neutral-900/90">
            <TableRow className="border-neutral-800 hover:bg-transparent">
              <TableHead className="py-3.5 px-4 font-bold text-neutral-300 uppercase tracking-wider text-[11px]">Event Title</TableHead>
              <TableHead className="py-3.5 px-4 font-bold text-neutral-300 uppercase tracking-wider text-[11px]">Category</TableHead>
              <TableHead className="py-3.5 px-4 font-bold text-neutral-300 uppercase tracking-wider text-[11px]">Date &amp; Time</TableHead>
              <TableHead className="py-3.5 px-4 font-bold text-neutral-300 uppercase tracking-wider text-[11px]">Pricing</TableHead>
              <TableHead className="py-3.5 px-4 font-bold text-neutral-300 uppercase tracking-wider text-[11px]">Status</TableHead>
              <TableHead className="py-3.5 px-4 font-bold text-neutral-300 uppercase tracking-wider text-[11px] text-right">Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-neutral-800/70">
            {events.length > 0 ? (
              events.map((evt) => (
                <TableRow key={evt.id} className="hover:bg-neutral-900/50 border-neutral-800/70 transition-colors">
                  <TableCell className="py-4 px-4 font-bold text-white max-w-xs">
                    <Link
                      href={`/admin/events/${evt.id}`}
                      className="text-white hover:text-blue-400 font-bold transition-colors block truncate"
                      title="View and edit event details"
                    >
                      {evt.title}
                    </Link>
                    <div className="text-[11px] text-neutral-400 font-normal line-clamp-1">
                      {evt.location}
                    </div>
                  </TableCell>
                  <TableCell className="py-4 px-4">
                    <span className="px-2.5 py-1 rounded-md bg-neutral-900 border border-neutral-800 text-neutral-300 font-semibold text-[11px]">
                      {evt.category}
                    </span>
                  </TableCell>
                  <TableCell className="py-4 px-4 text-neutral-300">
                    <div className="text-white font-medium">{evt.date}</div>
                    <div className="text-[11px] text-neutral-400">{evt.time}</div>
                  </TableCell>
                  <TableCell className="py-4 px-4">
                    {evt.isFree ? (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-950/70 border border-emerald-800/60 text-emerald-300 font-bold text-[10px]">
                        Free
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-blue-950/70 border border-blue-800/60 text-blue-300 font-bold text-[10px]">
                        ₦{evt.amount.toLocaleString()}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="py-4 px-4">
                    {evt.isPast ? (
                      <span className="px-2 py-0.5 rounded-md bg-neutral-900 border border-neutral-800 text-neutral-400 font-semibold text-[10px]">
                        Past Event
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-950/70 border border-emerald-800/60 text-emerald-300 font-semibold text-[10px]">
                        Upcoming
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="py-4 px-4 text-right">
                    <Link
                      href={`/admin/events/${evt.id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-blue-400 hover:text-blue-300 hover:bg-neutral-800 font-semibold text-xs transition-colors"
                      title="Manage event"
                    >
                      <span>Manage &rarr;</span>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow className="border-neutral-800">
                <TableCell colSpan={6} className="py-8 text-center text-neutral-500 text-xs">
                  No events registered. Click &quot;Add New Event&quot; above to create one.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* CREATE EVENT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-neutral-950 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative border border-neutral-800 my-8 text-neutral-100">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors cursor-pointer"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                Event Editor
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-0.5">
                Add New Event / Webinar
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                Configure details, scheduling, and payment tier (Free or Paid).
              </p>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-800/70 text-red-300 text-xs">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                  Event Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-white text-sm outline-hidden placeholder-neutral-500"
                  placeholder="e.g. Mastering Cash Flow Strategies for SMEs"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                    Category *
                  </label>
                  <Select
                    value={formData.category}
                    onValueChange={(val) => val && setFormData({ ...formData, category: val })}
                  >
                    <SelectTrigger className="w-full h-10 bg-neutral-900 border-neutral-800 text-white text-xs">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent className="bg-neutral-950 border-neutral-800 text-white">
                      <SelectItem value="Webinar">Webinar</SelectItem>
                      <SelectItem value="Workshop">Workshop</SelectItem>
                      <SelectItem value="Tax Masterclass">Tax Masterclass</SelectItem>
                      <SelectItem value="Executive Seminar">Executive Seminar</SelectItem>
                      <SelectItem value="ATS Orientation">ATS Orientation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                    Venue / Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-white text-sm outline-hidden placeholder-neutral-500"
                    placeholder="e.g. Online / Zoom Webinar"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                    Event Date *
                  </label>
                  <input
                    type="text"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-white text-sm outline-hidden placeholder-neutral-500"
                    placeholder="e.g. Saturday, 22nd August 2026"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                    Event Time *
                  </label>
                  <input
                    type="text"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-white text-sm outline-hidden placeholder-neutral-500"
                    placeholder="e.g. 11:00 AM"
                    required
                  />
                </div>
              </div>

              {/* FREE YES/NO & AMOUNT CONFIG */}
              <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-bold text-xs uppercase tracking-wider text-white block">
                      Is this event Free? (Yes / No)
                    </label>
                    <span className="text-[11px] text-neutral-400">
                      If No, attendees will be prompted for Paystack payment.
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer text-neutral-200">
                      <input
                        type="radio"
                        name="isFreeRadio"
                        checked={formData.isFree === true}
                        onChange={() => setFormData({ ...formData, isFree: true, amount: "0" })}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span>Yes (Free)</span>
                    </label>
                    <label className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer text-neutral-200">
                      <input
                        type="radio"
                        name="isFreeRadio"
                        checked={formData.isFree === false}
                        onChange={() => setFormData({ ...formData, isFree: false, amount: "5000" })}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span>No (Paid)</span>
                    </label>
                  </div>
                </div>

                {/* Amount in Naira when Free is NO */}
                {!formData.isFree && (
                  <div className="pt-2 border-t border-neutral-800">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-blue-400 mb-1">
                      Registration Amount (₦ NGN) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-neutral-400 text-sm">
                        ₦
                      </span>
                      <input
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        min="100"
                        className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-white text-sm font-semibold outline-hidden"
                        placeholder="5000"
                        required={!formData.isFree}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                  Event Description *
                </label>
                <textarea
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-white text-sm outline-hidden placeholder-neutral-500"
                  placeholder="Summary of this masterclass and takeaways..."
                  required
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                  Direct Webinar Access Link (Zoom / Meet / Teams)
                </label>
                <input
                  type="url"
                  name="webinarLink"
                  value={formData.webinarLink}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-white text-sm outline-hidden placeholder-neutral-500"
                  placeholder="https://zoom.us/j/9876543210 or Google Meet link"
                />
              </div>

              {/* WEBINAR BANNER IMAGE UPLOAD (CONVERTED TO BYTES) */}
              <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-white mb-1">
                  Webinar Banner Image (Converted to Binary Bytes in Database)
                </label>
                <p className="text-[11px] text-neutral-400">
                  Select a JPG/PNG flyer or banner. The file is converted directly to byte data and embedded in registration emails and broadcasts.
                </p>

                <div className="flex items-center gap-4 pt-1">
                  <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-neutral-200 font-semibold text-xs shadow-xs hover:bg-neutral-700 cursor-pointer transition-colors">
                    <PhotoIcon className="w-4 h-4 text-blue-400" />
                    <span>Upload Banner Image File</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden"
                    />
                  </label>

                  {uploadedImageBytesInfo && (
                    <div className="text-xs text-emerald-400 font-medium flex items-center gap-1.5">
                      <CheckCircleIcon className="w-4 h-4 text-emerald-400" />
                      <span>
                        {uploadedImageBytesInfo.name} ({(uploadedImageBytesInfo.bytes / 1024).toFixed(1)} KB converted to bytes)
                      </span>
                    </div>
                  )}
                </div>

                {formData.image && formData.image.startsWith("data:") && (
                  <div className="mt-2 relative w-32 h-20 rounded-lg overflow-hidden border border-neutral-800">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={formData.image}
                      alt="Uploaded byte preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                  WhatsApp Group Invite URL for Registrants (Optional)
                </label>
                <input
                  type="url"
                  name="whatsappGroupLink"
                  value={formData.whatsappGroupLink}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-white text-sm outline-hidden placeholder-neutral-500"
                  placeholder="https://chat.whatsapp.com/I1paAUnSVWq0SvbQQmp9OK"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isPast"
                  name="isPast"
                  checked={formData.isPast}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 rounded-sm bg-neutral-900 border-neutral-800"
                />
                <label htmlFor="isPast" className="text-xs text-neutral-300 font-medium">
                  Mark as Past / Concluded Event (will appear in the Past Events section)
                </label>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-neutral-800 text-neutral-300 hover:bg-neutral-900 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-xs hover:bg-blue-500 shadow-md shadow-blue-600/30 cursor-pointer disabled:opacity-60 transition-all"
                >
                  {submitting ? "Saving Event..." : "Publish Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
