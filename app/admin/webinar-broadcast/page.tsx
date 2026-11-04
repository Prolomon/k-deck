"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  EnvelopeIcon,
  PaperAirplaneIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  CalendarDaysIcon,
  VideoCameraIcon,
  UsersIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import {
  NotificationBanner,
  useAdminNotification,
} from "@/components/admin/admin-feedback";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EventItem {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  webinarLink?: string | null;
  image?: string | null;
  imageBytes?: { type: string; data: number[] } | Uint8Array | null;
  imageMimeType?: string | null;
  isFree: boolean;
  amount: number;
}

interface BroadcastLog {
  id: string;
  eventId: string;
  type: string;
  subject: string;
  status: string;
  recipientCount: number;
  scheduledFor?: string | null;
  sentAt?: string | null;
  createdAt: string;
}

type NotificationType =
  | "LINK"
  | "1_HOUR"
  | "30_MIN"
  | "15_MIN"
  | "LIVE"
  | "CUSTOM";

export default function AdminWebinarBroadcastPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [attendeeCount, setAttendeeCount] = useState<number>(0);
  const [logs, setLogs] = useState<BroadcastLog[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [notificationType, setNotificationType] = useState<NotificationType>("LINK");
  const [customSubject, setCustomSubject] = useState("");
  const [customMessage, setCustomMessage] = useState("");
  const [scheduleRemaining, setScheduleRemaining] = useState(true);
  const [eventDateTime, setEventDateTime] = useState("");

  const [sending, setSending] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
    details?: string[];
  } | null>(null);

  // Admin Notification
  const { notification, showSuccess, showError, showWarn, clearNotification } =
    useAdminNotification();

  // Load events and broadcast logs
  const loadData = async (isManualRefresh = false) => {
    setLoading(true);
    try {
      const res = await fetch("/api/webinars/broadcast");
      if (res.ok) {
        const data = await res.json();
        setEvents(data.events || []);
        setLogs(data.logs || []);

        if (data.events && data.events.length > 0 && !selectedEventId) {
          setSelectedEventId(data.events[0].id);
        }

        if (isManualRefresh) {
          showSuccess("Webinar broadcast logs and events refreshed.");
        }
      }
    } catch (err) {
      console.error("Failed to load broadcast data:", err);
      showError("Unable to fetch broadcast data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Fetch attendees for selected event
  useEffect(() => {
    if (!selectedEventId) return;

    fetch(`/api/events/${selectedEventId}/registrations`)
      .then((res) => res.json())
      .then((data) => {
        if (data.registrations) {
          setAttendeeCount(data.registrations.length);
        }
      })
      .catch((err) => console.error("Error fetching attendee count:", err));
  }, [selectedEventId]);

  const selectedEvent = events.find((e) => e.id === selectedEventId);

  // Get image source for selected event
  const getSelectedEventImageSrc = () => {
    if (!selectedEvent) return "/images/webinar-pc.jpg";
    if (selectedEvent.imageBytes) {
      const bytesArray =
        (selectedEvent.imageBytes as { data?: number[] }).data ||
        Array.from(selectedEvent.imageBytes as unknown as number[]);
      const base64 = btoa(
        bytesArray.reduce((data, byte) => data + String.fromCharCode(byte), "")
      );
      return `data:${selectedEvent.imageMimeType || "image/jpeg"};base64,${base64}`;
    }
    return selectedEvent.image || "/images/webinar-pc.jpg";
  };

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEventId) {
      setStatusMessage({ type: "error", text: "Please select an event first." });
      return;
    }

    setSending(true);
    setStatusMessage(null);

    try {
      const res = await fetch("/api/webinars/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: selectedEventId,
          type: notificationType,
          customSubject: customSubject || undefined,
          customMessage: customMessage || undefined,
          scheduleRemaining,
          eventDateTimeISO: eventDateTime ? new Date(eventDateTime).toISOString() : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to dispatch broadcast");
      }

      const scheduledList = data.scheduledJobs
        ? data.scheduledJobs.map(
            (j: { label: string; runAt: string; engine: string }) =>
              `${j.label} scheduled for ${new Date(j.runAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} via ${j.engine}`
          )
        : [];

      setStatusMessage({
        type: "success",
        text: data.message || "Broadcast successfully sent via Zoho Mail!",
        details: scheduledList,
      });

      showSuccess(data.message || "Broadcast successfully dispatched via Zoho Mail!");

      // Refresh logs
      loadData();
    } catch (err: unknown) {
      const error = err as Error;
      setStatusMessage({
        type: "error",
        text: error.message || "An unexpected error occurred while broadcasting.",
      });
      showError(error.message || "An unexpected error occurred while broadcasting.");
    } finally {
      setSending(false);
    }
  };

  const templatePreviews = {
    LINK: {
      title: "Webinar Access Link & Instructions",
      subject: selectedEvent ? `Webinar Link & Access Instructions: ${selectedEvent.title}` : "Webinar Access Link",
      tag: "Immediate Link Dispatch",
      bannerText: "Direct Webinar Access Room Link & Credentials",
      desc: "Dispatches the official webinar link, joining instructions, event schedule, and the uploaded webinar banner image to all registered attendees.",
    },
    "1_HOUR": {
      title: "1 Hour To Go Reminder",
      subject: selectedEvent ? `[1 Hour To Go] ${selectedEvent.title} starts soon!` : "[1 Hour To Go] Starting soon!",
      tag: "Countdown Urgency: 60m",
      bannerText: "Starting in 1 Hour — Please Get Ready!",
      desc: "Sends a polite countdown alert urging participants to test their audio, download slide materials, and stand by.",
    },
    "30_MIN": {
      title: "30 Minutes To Go Reminder",
      subject: selectedEvent ? `[30 Minutes To Go] Join room for ${selectedEvent.title}` : "[30 Minutes To Go] Join room",
      tag: "Countdown Urgency: 30m",
      bannerText: "30 Minutes To Go — Webinar Access Room Opening!",
      desc: "Alerts attendees that the virtual waiting room has opened and presentation slides will begin shortly.",
    },
    "15_MIN": {
      title: "15 Minutes To Go (Final Call)",
      subject: selectedEvent ? `[15 Minutes To Go] Final Call: ${selectedEvent.title}` : "[15 Minutes To Go] Final Call",
      tag: "Countdown Urgency: 15m",
      bannerText: "15 Minutes Remaining — Join The Waiting Room!",
      desc: "Final push reminder before live broadcast begins.",
    },
    LIVE: {
      title: "We Are Now Live! (Broadcast)",
      subject: selectedEvent ? `🔴 WE ARE NOW LIVE: ${selectedEvent.title}` : "🔴 WE ARE NOW LIVE!",
      tag: "🔴 Live Streaming Now",
      bannerText: "WE ARE NOW LIVE — Click Below To Join Immediately!",
      desc: "High-priority notice indicating the speakers have started and attendees should click to join instantly.",
    },
    CUSTOM: {
      title: "Custom Email Announcement",
      subject: customSubject || "Important Update regarding your K-Deck Masterclass",
      tag: "Custom Message",
      bannerText: "Special Announcement from K-Deck Facilitators",
      desc: "Send a custom personalized email announcement to all registered attendees.",
    },
  };

  const activeTemplate = templatePreviews[notificationType];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Toast Notification Banner */}
      <NotificationBanner
        notification={notification}
        onClose={clearNotification}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <EnvelopeIcon className="w-7 h-7 text-blue-400" />
            <span>Webinar Email Manager &amp; Automated Broadcasts</span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Dispatch Zoho Mail templates with banner images, webinar links, and automated pg-boss countdown cron reminders.
          </p>
        </div>

        <button
          onClick={() => loadData(true)}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold text-neutral-200 bg-neutral-900 border border-neutral-800 rounded-xl hover:bg-neutral-800 hover:text-white shadow-xs cursor-pointer self-start sm:self-auto disabled:opacity-60 transition-colors"
          title="Refresh webinar broadcast queue"
        >
          <ArrowPathIcon className={`w-3.5 h-3.5 text-neutral-400 ${loading ? "animate-spin text-blue-400" : ""}`} />
          <span>{loading ? "Refreshing..." : "Refresh"}</span>
        </button>
      </div>

      {statusMessage && (
        <div
          className={`p-4 rounded-2xl border text-sm ${
            statusMessage.type === "success"
              ? "bg-emerald-950/60 border-emerald-800/60 text-emerald-300"
              : "bg-red-950/60 border-red-800/60 text-red-300"
          }`}
        >
          <div className="flex items-center gap-2 font-semibold">
            {statusMessage.type === "success" ? (
              <CheckCircleIcon className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <ExclamationTriangleIcon className="w-5 h-5 text-red-400 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>

          {statusMessage.details && statusMessage.details.length > 0 && (
            <div className="mt-2.5 pt-2 border-t border-emerald-800/50 text-xs space-y-1 text-emerald-300">
              <p className="font-bold">Scheduled Background Reminders (pg-boss):</p>
              <ul className="list-disc list-inside space-y-0.5">
                {statusMessage.details.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form & Settings */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-neutral-950 rounded-3xl p-6 sm:p-8 shadow-xl border border-neutral-800/90">
            <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <VideoCameraIcon className="w-5 h-5 text-blue-400" />
              <span>1. Select Target Webinar &amp; Audience</span>
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                  Choose Webinar / Masterclass
                </label>
                <Select
                  value={selectedEventId}
                  onValueChange={(val) => val && setSelectedEventId(val)}
                >
                  <SelectTrigger className="w-full h-11 bg-neutral-900 border-neutral-800 text-white text-sm font-medium">
                    <SelectValue placeholder="Select Webinar / Masterclass" />
                  </SelectTrigger>
                  <SelectContent className="bg-neutral-950 border-neutral-800 text-white">
                    {events.map((evt) => (
                      <SelectItem key={evt.id} value={evt.id}>
                        {evt.title} ({evt.date})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedEvent && (
                <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-blue-300">
                      <CalendarDaysIcon className="w-4 h-4 text-blue-400" />
                      <span>{selectedEvent.date} at {selectedEvent.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-neutral-300">
                      <VideoCameraIcon className="w-4 h-4 text-blue-400" />
                      <span className="truncate max-w-xs">{selectedEvent.webinarLink || "No link specified yet"}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 bg-blue-950/60 px-3 py-1.5 rounded-xl border border-blue-800/60 text-xs font-bold text-blue-300 shrink-0 shadow-xs">
                    <UsersIcon className="w-4 h-4 text-blue-400" />
                    <span>{attendeeCount} Registered Attendees</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Template Selector */}
          <div className="bg-neutral-950 rounded-3xl p-6 sm:p-8 shadow-xl border border-neutral-800/90">
            <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <EnvelopeIcon className="w-5 h-5 text-blue-400" />
              <span>2. Choose Email Template</span>
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-6">
              {[
                { type: "LINK", label: "Webinar Link", badge: "Access" },
                { type: "1_HOUR", label: "1 Hour To Go", badge: "Countdown" },
                { type: "30_MIN", label: "30 Min To Go", badge: "Urgent" },
                { type: "15_MIN", label: "15 Min To Go", badge: "Final" },
                { type: "LIVE", label: "We Are LIVE", badge: "Live Now" },
                { type: "CUSTOM", label: "Custom Mail", badge: "Custom" },
              ].map((btn) => (
                <button
                  key={btn.type}
                  type="button"
                  onClick={() => setNotificationType(btn.type as NotificationType)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    notificationType === btn.type
                      ? "border-blue-500 bg-blue-950/80 ring-2 ring-blue-500/20 text-white font-bold"
                      : "border-neutral-800 hover:border-neutral-700 bg-neutral-900 text-neutral-400 font-medium"
                  }`}
                >
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-neutral-800 text-blue-400 block w-fit mb-1">
                    {btn.badge}
                  </span>
                  <span className="text-xs sm:text-sm block text-white">{btn.label}</span>
                </button>
              ))}
            </div>

            {/* Custom fields if CUSTOM or subject override */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                  Subject Line Override (Optional)
                </label>
                <input
                  type="text"
                  value={customSubject}
                  onChange={(e) => setCustomSubject(e.target.value)}
                  placeholder={activeTemplate.subject}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-800 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden bg-neutral-900 text-white placeholder-neutral-500"
                />
              </div>

              {notificationType === "CUSTOM" && (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                    Custom Message Body (HTML / Text)
                  </label>
                  <textarea
                    rows={4}
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    placeholder="Enter any special announcement, session link updates, or agenda details..."
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-800 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden bg-neutral-900 text-white placeholder-neutral-500"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Background Cron Scheduler Section */}
          <div className="bg-neutral-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-neutral-800/90">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                <ClockIcon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-white">
                  Automated pg-boss Background Cron Scheduler
                </h3>
                <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                  Once you send the official Webinar Access Link, the scheduler can automatically queue and trigger the remaining reminder emails (1 Hour to Go, 30 Minutes to Go, 15 Minutes to Go, and We Are Now Live) right on schedule.
                </p>

                <div className="mt-4 pt-4 border-t border-neutral-800 space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={scheduleRemaining}
                      onChange={(e) => setScheduleRemaining(e.target.checked)}
                      className="w-4 h-4 rounded border-neutral-700 text-blue-600 focus:ring-blue-500 bg-neutral-900"
                    />
                    <span className="text-xs font-medium text-neutral-200">
                      Queue remaining countdown reminders automatically with pg-boss
                    </span>
                  </label>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                      Event Exact Start Time (for cron queue calculation)
                    </label>
                    <input
                      type="datetime-local"
                      value={eventDateTime}
                      onChange={(e) => setEventDateTime(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-neutral-800 bg-neutral-900 text-xs text-white outline-hidden focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-neutral-800">
              <button
                type="button"
                onClick={handleSendBroadcast}
                disabled={sending || attendeeCount === 0}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3.5 px-6 rounded-2xl font-bold transition-all shadow-md shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-sm"
              >
                {sending ? (
                  <>
                    <ArrowPathIcon className="w-4 h-4 animate-spin" />
                    <span>Broadcasting via Zoho Mail &amp; Scheduling pg-boss...</span>
                  </>
                ) : (
                  <>
                    <PaperAirplaneIcon className="w-4 h-4" />
                    <span>Send {activeTemplate.title} to {attendeeCount} Attendees</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Live Email Preview */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-neutral-950 rounded-3xl p-6 sm:p-8 shadow-xl border border-neutral-800/90 sticky top-6">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                Live Zoho Mail Mockup
              </span>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-950/70 border border-blue-800/60 text-blue-300">
                {activeTemplate.tag}
              </span>
            </div>

            <div className="mt-4 bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden text-xs">
              {/* Fake Email Client Bar */}
              <div className="bg-neutral-950 px-4 py-2 border-b border-neutral-800 space-y-1">
                <div className="flex items-center justify-between text-[11px] text-neutral-400">
                  <span><strong className="text-white">From:</strong> K-DECK Professional Services</span>
                  <span className="text-blue-400 font-mono">Zoho Mail SMTP</span>
                </div>
                <div className="text-[11px] text-white font-semibold truncate">
                  <strong>Subject:</strong> {customSubject || activeTemplate.subject}
                </div>
              </div>

              {/* Email Content Container */}
              <div className="p-4 sm:p-5 space-y-4 bg-neutral-950">
                {/* Header with Logo */}
                <div className="bg-black p-4 rounded-2xl text-center text-white border border-neutral-800 space-y-2">
                  <div className="flex items-center justify-center gap-3">
                    <div className="relative w-9 h-9 shrink-0 rounded-lg bg-white p-1 border border-neutral-700 overflow-hidden">
                      <Image
                        src="/images/k-deck.png"
                        alt="K-Deck Logo"
                        fill
                        sizes="36px"
                        className="object-contain"
                      />
                    </div>
                    <div className="text-left">
                      <h4 className="text-xs font-black tracking-tight text-white uppercase">
                        K-DECK PROFESSIONAL
                      </h4>
                      <p className="text-[9px] text-blue-400 font-bold uppercase tracking-wider">
                        Chartered Accountants &amp; Consultants
                      </p>
                    </div>
                  </div>
                  <div className="pt-1">
                    <span className="inline-block px-3 py-0.5 rounded-full bg-blue-950/80 border border-blue-800/80 text-blue-300 text-[10px] font-extrabold uppercase tracking-widest">
                      {activeTemplate.tag}
                    </span>
                  </div>
                </div>

                {/* Urgency Badge */}
                <div className="p-3 rounded-xl bg-amber-950/60 border border-amber-800/60 text-amber-300 font-bold text-center text-xs">
                  {activeTemplate.bannerText}
                </div>

                {/* Webinar Banner Image Preview */}
                <div className="relative w-full h-36 rounded-xl overflow-hidden border border-neutral-800">
                  <Image
                    src={getSelectedEventImageSrc()}
                    alt="Webinar Banner"
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    className="object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-black/80 text-white text-[9px] px-2 py-0.5 rounded-md backdrop-blur-xs font-mono border border-white/10">
                    Binary Bytes Database Storage
                  </div>
                </div>

                {/* Body Text */}
                <div className="text-neutral-300 space-y-2 leading-relaxed">
                  <p>
                    Hello <strong className="text-white">[Attendee Name]</strong>,
                  </p>
                  <p>
                    {customMessage || activeTemplate.desc}
                  </p>

                  <div className="bg-neutral-900 p-3.5 rounded-xl border border-neutral-800 text-[11px] space-y-1 text-neutral-300">
                    <p><strong className="text-white">Session:</strong> {selectedEvent?.title}</p>
                    <p><strong className="text-white">Schedule:</strong> {selectedEvent?.date} ({selectedEvent?.time})</p>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="text-center pt-2">
                  <a
                    href={selectedEvent?.webinarLink || "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block bg-blue-600 text-white font-bold py-2.5 px-6 rounded-xl text-xs shadow-md shadow-blue-600/30 hover:bg-blue-500"
                  >
                    Enter Live Webinar Room &rarr;
                  </a>
                </div>

                {/* Corporate Email Footer with Company Name & Logo */}
                <div className="pt-4 border-t border-neutral-800/90 text-center space-y-2.5 bg-black/50 -mx-4 -mb-4 p-4 rounded-b-xl">
                  <div className="flex items-center justify-center gap-2.5">
                    <div className="relative w-7 h-7 rounded-md bg-white p-0.5 border border-neutral-700 overflow-hidden shrink-0">
                      <Image
                        src="/images/k-deck.png"
                        alt="K-Deck Logo"
                        fill
                        sizes="28px"
                        className="object-contain"
                      />
                    </div>
                    <div className="text-left">
                      <span className="block text-[11px] font-black text-white uppercase tracking-tight">
                        K-DECK PROFESSIONAL SERVICES
                      </span>
                      <span className="block text-[8px] font-semibold text-blue-400 uppercase tracking-wider -mt-0.5">
                        Chartered Accountants &bull; Tax Practitioners &bull; Financial Advisers
                      </span>
                    </div>
                  </div>
                  <p className="text-[9px] text-neutral-400 leading-tight">
                    21 Road, F1 Close, FESTAC Town, Lagos State, Nigeria &bull; +234 907 057 3104
                  </p>
                  <div className="pt-1.5 border-t border-neutral-800/80 text-[9px] text-neutral-500">
                    &copy; {new Date().getFullYear()} K-DECK Professional Services. All rights reserved.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Broadcast History & Cron Logs */}
      <div className="bg-neutral-950 rounded-3xl p-6 sm:p-8 shadow-xl border border-neutral-800/90">
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <ClockIcon className="w-5 h-5 text-blue-400" />
          <span>Webinar Email Broadcast &amp; Cron Dispatch History</span>
        </h3>

        {logs.length === 0 ? (
          <p className="text-xs text-neutral-500 py-6 text-center">
            No broadcast emails or scheduled reminders dispatched yet. Select an event above to send the first broadcast!
          </p>
        ) : (
          <div className="rounded-2xl border border-neutral-800 overflow-hidden">
            <Table>
              <TableHeader className="bg-neutral-900/90">
                <TableRow className="hover:bg-transparent border-neutral-800">
                  <TableHead className="text-[11px] font-bold uppercase tracking-wider text-neutral-300 py-3.5 px-4">Template / Type</TableHead>
                  <TableHead className="text-[11px] font-bold uppercase tracking-wider text-neutral-300 py-3.5 px-4">Subject</TableHead>
                  <TableHead className="text-[11px] font-bold uppercase tracking-wider text-neutral-300 py-3.5 px-4">Recipients</TableHead>
                  <TableHead className="text-[11px] font-bold uppercase tracking-wider text-neutral-300 py-3.5 px-4">Status</TableHead>
                  <TableHead className="text-[11px] font-bold uppercase tracking-wider text-neutral-300 py-3.5 px-4">Scheduled For</TableHead>
                  <TableHead className="text-[11px] font-bold uppercase tracking-wider text-neutral-300 py-3.5 px-4">Dispatched At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-neutral-800/70">
                {logs.map((log) => (
                  <TableRow key={log.id} className="hover:bg-neutral-900/50 border-neutral-800/70 transition-colors">
                    <TableCell className="py-3 px-4 font-bold text-white">
                      <span className="px-2.5 py-1 rounded-md bg-blue-950/70 text-blue-300 border border-blue-800/60 font-mono text-[10px]">
                        {log.type}
                      </span>
                    </TableCell>
                    <TableCell className="py-3 px-4 max-w-xs truncate text-xs text-neutral-300 font-medium">{log.subject}</TableCell>
                    <TableCell className="py-3 px-4 font-semibold text-xs text-white">
                      {log.recipientCount} attendees
                    </TableCell>
                    <TableCell className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          log.status === "SENT"
                            ? "bg-emerald-950/70 text-emerald-300 border border-emerald-800/60"
                            : log.status === "PENDING"
                            ? "bg-amber-950/70 text-amber-300 border border-amber-800/60"
                            : "bg-red-950/70 text-red-300 border border-red-800/60"
                        }`}
                      >
                        {log.status}
                      </span>
                    </TableCell>
                    <TableCell className="py-3 px-4 text-xs text-neutral-400 whitespace-nowrap">
                      {log.scheduledFor
                        ? new Date(log.scheduledFor).toLocaleString([], {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "Immediate"}
                    </TableCell>
                    <TableCell className="py-3 px-4 text-xs text-neutral-400 whitespace-nowrap">
                      {log.sentAt
                        ? new Date(log.sentAt).toLocaleString([], {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
