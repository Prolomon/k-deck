"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  CalendarDaysIcon,
  TrashIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  ClockIcon,
  MapPinIcon,
  UserGroupIcon,
  EnvelopeIcon,
  PhotoIcon,
  VideoCameraIcon,
  CurrencyDollarIcon,
  ChatBubbleLeftRightIcon,
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
import { Textarea } from "@/components/ui/textarea";
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
  image?: string | null;
  imageBytes?: { type: string; data: number[] } | Uint8Array | null;
  imageMimeType?: string | null;
  isFree: boolean;
  amount: number;
  isPast: boolean;
  whatsappGroupLink: string | null;
}

export default function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [event, setEvent] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [attendeeCount, setAttendeeCount] = useState(0);

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

  const [uploadedImageBytesInfo, setUploadedImageBytesInfo] = useState<{
    name: string;
    bytes: number;
  } | null>(null);

  const { notification, showSuccess, showError, showWarn, clearNotification } =
    useAdminNotification();

  const fetchEvent = async () => {
    try {
      const res = await fetch(`/api/events/${id}`);
      if (!res.ok) throw new Error("Event not found");
      const data: EventItem = await res.json();
      setEvent(data);
      setFormData({
        title: data.title,
        description: data.description,
        content: data.content || "",
        category: data.category || "Webinar",
        date: data.date,
        time: data.time,
        location: data.location || "Virtual (Online / Zoom)",
        webinarLink: data.webinarLink || "",
        image: data.image || "/images/webinar-pc.jpg",
        isFree: data.isFree,
        amount: String(data.amount || 0),
        isPast: data.isPast || false,
        whatsappGroupLink: data.whatsappGroupLink || "",
      });

      // Also fetch attendee count
      const regRes = await fetch(`/api/events/${id}/registrations`);
      if (regRes.ok) {
        const regData = await regRes.json();
        setAttendeeCount(regData.registrations?.length || 0);
      }
    } catch (err) {
      console.error(err);
      showError("Unable to load event details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [id]);

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
      showSuccess(`Image "${file.name}" converted to byte data for storage.`);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(`/api/events/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          amount: formData.isFree ? 0 : Number(formData.amount),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update event");
      }

      const updated = await res.json();
      setEvent(updated.event);
      showSuccess(`Masterclass "${formData.title}" updated successfully.`);
    } catch (err: unknown) {
      const error = err as Error;
      showError(error.message || "Failed to save event changes");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/events/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete event");
      showWarn(`Event "${event?.title}" deleted successfully.`);
      setTimeout(() => {
        router.push("/admin/events");
      }, 1000);
    } catch (err: unknown) {
      const error = err as Error;
      showError(error.message || "Failed to delete event");
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-neutral-400 flex items-center justify-center gap-2 text-sm">
        <ArrowPathIcon className="w-5 h-5 animate-spin text-blue-400" />
        <span>Loading event details...</span>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Event Not Found</h2>
        <p className="text-neutral-400 text-xs">The requested event does not exist or was deleted.</p>
        <Link href="/admin/events" className="text-xs text-blue-400 underline">
          &larr; Back to Event Management
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <NotificationBanner notification={notification} onClose={clearNotification} />

      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        title="Confirm Event Deletion"
        description="Are you sure you want to permanently delete this masterclass? All attendee signups and scheduled countdown emails will also be removed."
        itemName={`${event.title} (${event.date})`}
        confirmLabel="Yes, Delete Event"
        isDeleting={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />

      {/* Top Bar with Navigation & Shortcuts */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          href="/admin/events"
          className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          <span>Back to All Events</span>
        </Link>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href={`/admin/events/${id}/registrations`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-950/70 border border-blue-800/60 text-blue-300 hover:bg-blue-900/70 text-xs font-semibold transition-colors"
          >
            <UserGroupIcon className="w-4 h-4" />
            <span>View Signups ({attendeeCount})</span>
          </Link>

          <Link
            href={`/admin/webinar-broadcast?eventId=${id}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-950/70 border border-emerald-800/60 text-emerald-300 hover:bg-emerald-900/70 text-xs font-semibold transition-colors"
          >
            <EnvelopeIcon className="w-4 h-4" />
            <span>Broadcast Email</span>
          </Link>

          <Button
            variant="destructive"
            size="sm"
            onClick={() => setShowDeleteModal(true)}
            className="bg-rose-950/70 border border-rose-800/80 text-rose-300 hover:bg-rose-900 cursor-pointer h-9 px-3.5"
          >
            <TrashIcon className="w-4 h-4 mr-1.5" />
            <span>Delete</span>
          </Button>
        </div>
      </div>

      {/* Header Info Banner */}
      <div className="bg-neutral-950 p-6 sm:p-8 rounded-3xl border border-neutral-800/90 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-950/80 text-blue-300 border border-blue-800/70">
              {formData.category}
            </span>
            {formData.isFree ? (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-950/80 text-emerald-300 border border-emerald-800/70">
                Free Admission
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-950/80 text-amber-300 border border-amber-800/70">
                ₦{Number(formData.amount).toLocaleString()}
              </span>
            )}
            {formData.isPast ? (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-neutral-900 text-neutral-400 border border-neutral-800">
                Past Event
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-950/80 text-emerald-300 border border-emerald-800/70">
                Active / Upcoming
              </span>
            )}
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white">{event.title}</h1>
          <p className="text-xs text-neutral-400 mt-1 flex items-center gap-3">
            <span>{event.date}</span>
            <span>&bull;</span>
            <span>{event.time}</span>
            <span>&bull;</span>
            <span>{event.location}</span>
          </p>
        </div>

        {formData.image && (
          <div className="relative w-28 h-20 rounded-2xl overflow-hidden border border-neutral-800 shrink-0">
            <Image
              src={formData.image}
              alt={formData.title}
              fill
              sizes="112px"
              className="object-cover"
            />
          </div>
        )}
      </div>

      {/* Edit Event Form Card */}
      <Card className="bg-neutral-950 border border-neutral-800 shadow-xl text-neutral-100 rounded-3xl">
        <CardHeader>
          <CardTitle className="text-base font-bold text-white">Edit Masterclass &amp; Webinar Content</CardTitle>
          <CardDescription className="text-xs text-neutral-400">
            Update event title, detailed syllabus, venue link, pricing, and binary flyer banner.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-5">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
                Event Title *
              </Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="bg-neutral-900 border-neutral-800 text-white text-xs h-10"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
                  Event Category *
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(val) => val && setFormData({ ...formData, category: val })}
                >
                  <SelectTrigger className="w-full bg-neutral-900 border-neutral-800 text-white text-xs h-10">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent className="bg-neutral-950 border-neutral-800 text-white">
                    <SelectItem value="Webinar">Webinar (Virtual Lecture)</SelectItem>
                    <SelectItem value="Executive Masterclass">Executive Masterclass</SelectItem>
                    <SelectItem value="Workshop">Hands-on Workshop</SelectItem>
                    <SelectItem value="Tax Clinic">Tax Advisory Clinic</SelectItem>
                    <SelectItem value="ATS Orientation">ATS / ICAN Orientation</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
                  Platform / Physical Location *
                </Label>
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                  placeholder="e.g. Zoom Video Conference or FESTAC Office"
                  className="bg-neutral-900 border-neutral-800 text-white text-xs h-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
                  Scheduled Date *
                </Label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                  className="bg-neutral-900 border-neutral-800 text-white text-xs h-10"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
                  Scheduled Time *
                </Label>
                <Input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  required
                  className="bg-neutral-900 border-neutral-800 text-white text-xs h-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
                  Direct Webinar Access URL
                </Label>
                <Input
                  type="url"
                  value={formData.webinarLink}
                  onChange={(e) => setFormData({ ...formData, webinarLink: e.target.value })}
                  placeholder="https://us02web.zoom.us/j/..."
                  className="bg-neutral-900 border-neutral-800 text-white text-xs h-10 font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
                  WhatsApp Cohort Group Link
                </Label>
                <Input
                  type="url"
                  value={formData.whatsappGroupLink}
                  onChange={(e) => setFormData({ ...formData, whatsappGroupLink: e.target.value })}
                  placeholder="https://chat.whatsapp.com/..."
                  className="bg-neutral-900 border-neutral-800 text-white text-xs h-10 font-mono"
                />
              </div>
            </div>

            {/* Pricing Section */}
            <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
                    Admission Type
                  </Label>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    Toggle whether this webinar is free or requires Paystack card payment.
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-white">
                    <input
                      type="radio"
                      name="isFree"
                      checked={formData.isFree}
                      onChange={() => setFormData({ ...formData, isFree: true, amount: "0" })}
                      className="text-blue-600 focus:ring-blue-500/20"
                    />
                    <span>Free Admission</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-white">
                    <input
                      type="radio"
                      name="isFree"
                      checked={!formData.isFree}
                      onChange={() => setFormData({ ...formData, isFree: false })}
                      className="text-blue-600 focus:ring-blue-500/20"
                    />
                    <span>Paid Registration</span>
                  </label>
                </div>
              </div>

              {!formData.isFree && (
                <div className="pt-2 border-t border-neutral-800">
                  <Label className="text-xs font-semibold text-neutral-300 mb-1 block">
                    Registration Fee (NGN ₦) *
                  </Label>
                  <Input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    required
                    placeholder="e.g. 15000"
                    className="bg-neutral-900 border-neutral-800 text-white text-xs h-10 max-w-xs font-bold"
                  />
                </div>
              )}
            </div>

            {/* Short Description */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
                Short Summary Description *
              </Label>
              <Textarea
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                className="bg-neutral-900 border-neutral-800 text-white text-xs resize-none"
              />
            </div>

            {/* Detailed Content */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
                Detailed Masterclass Curriculum &amp; Content
              </Label>
              <Textarea
                rows={5}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Outline syllabus, key discussion topics, target audience prerequisites, and facilitator bio..."
                className="bg-neutral-900 border-neutral-800 text-white text-xs resize-none"
              />
            </div>

            {/* Flyer Upload & Binary Byte Preview */}
            <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-3">
              <Label className="text-xs font-semibold uppercase tracking-wider text-neutral-300 block">
                Webinar Flyer / Banner Image
              </Label>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleImageFileChange}
                  className="text-xs text-neutral-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-950/80 file:text-blue-300 hover:file:bg-blue-900/80 file:cursor-pointer cursor-pointer"
                />

                {uploadedImageBytesInfo && (
                  <span className="text-[11px] text-emerald-400 font-mono font-medium">
                    ✓ {uploadedImageBytesInfo.name} ({Math.round(uploadedImageBytesInfo.bytes / 1024)} KB)
                  </span>
                )}
              </div>
            </div>

            {/* Past Event Toggle */}
            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-300">
                <input
                  type="checkbox"
                  checked={formData.isPast}
                  onChange={(e) => setFormData({ ...formData, isPast: e.target.checked })}
                  className="rounded border-neutral-800 bg-neutral-900 text-blue-500 focus:ring-blue-500/20"
                />
                <span>Mark as Past Event (Moves to past events archive)</span>
              </label>
            </div>

            <div className="pt-4 border-t border-neutral-800 flex items-center justify-end gap-3">
              <Link href="/admin/events">
                <Button variant="outline" type="button" className="border-neutral-800 text-neutral-300 hover:bg-neutral-900 text-xs h-10">
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs h-10 px-6 cursor-pointer"
              >
                {saving ? (
                  <>
                    <ArrowPathIcon className="w-4 h-4 animate-spin mr-2" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <span>Save Event Changes</span>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
