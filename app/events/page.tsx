"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import {
  CalendarDaysIcon,
  ClockIcon,
  MapPinIcon,
  CheckCircleIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  AcademicCapIcon,
  ArrowRightIcon,
  ChatBubbleLeftRightIcon,
  ShieldCheckIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

interface EventItem {
  id: string;
  title: string;
  description: string;
  content: string | null;
  category: string;
  date: string;
  time: string;
  location: string;
  image: string | null;
  isFree: boolean;
  amount: number;
  isPast: boolean;
  whatsappGroupLink: string | null;
}

export default function EventsPage() {
  const [upcomingEvents, setUpcomingEvents] = useState<EventItem[]>([]);
  const [pastEvents, setPastEvents] = useState<EventItem[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(true);

  // Registration Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [registeredEvent, setRegisteredEvent] = useState<EventItem | null>(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const fetchEvents = async () => {
    try {
      const res = await fetch("/api/events");
      if (res.ok) {
        const data: EventItem[] = await res.json();
        const upcoming = data.filter((e) => !e.isPast);
        const past = data.filter((e) => e.isPast);
        setUpcomingEvents(upcoming);
        setPastEvents(past);
        if (upcoming.length > 0 && !selectedEvent) {
          setSelectedEvent(upcoming[0]);
        }
      }
    } catch (err) {
      console.error("Failed to fetch events:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent) return;

    if (!formData.name || !formData.email || !formData.phone) {
      setErrorMessage("Please complete all required fields.");
      return;
    }

    setSubmitting(true);
    setErrorMessage("");

    try {
      if (selectedEvent.isFree || selectedEvent.amount <= 0) {
        // Free registration: direct submission
        setStatusMessage("Securing your spot...");
        const res = await fetch(`/api/events/${selectedEvent.id}/registrations`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
          }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to register.");
        }

        setRegistered(true);
        setRegisteredEvent(selectedEvent);
        setStatusMessage("Registration successful!");
      } else {
        // Paid Event: Initialize Paystack
        setStatusMessage("Initializing secure Paystack checkout...");
        const initRes = await fetch("/api/payments/paystack/initialize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            eventId: selectedEvent.id,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
          }),
        });

        const initData = await initRes.json();
        if (!initRes.ok || !initData.success) {
          throw new Error(initData.error || "Payment initialization failed.");
        }

        // If redirect URL provided (or mock)
        if (initData.authorizationUrl) {
          // Check if Paystack inline script is available or redirect
          if (initData.reference && initData.reference.startsWith("demo_ref_")) {
            // Verify development mock transaction
            const verifyRes = await fetch("/api/payments/paystack/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                reference: initData.reference,
                eventId: selectedEvent.id,
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
              }),
            });
            if (verifyRes.ok) {
              setRegistered(true);
              setRegisteredEvent(selectedEvent);
              setStatusMessage("Payment verified & registration complete!");
            }
          } else {
            // Real Paystack redirect to checkout
            window.location.href = initData.authorizationUrl;
          }
        }
      }
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMessage(error.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const activeEvent = selectedEvent || upcomingEvents[0];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative text-white h-72 sm:h-80 flex items-center justify-center overflow-hidden">
          <Image
            src="/images/webinar-pc.jpg"
            alt="Events & Webinars"
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-blue-950/85 backdrop-blur-xs flex items-center justify-center">
            <div className="max-w-4xl mx-auto px-4 text-center">
              <span className="inline-block px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-3 border border-blue-400/30">
                Live Knowledge Sessions
              </span>
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
                Events, Masterclasses & Webinars
              </h1>
              <p className="text-base sm:text-lg text-slate-200 max-w-2xl mx-auto">
                Join our qualified chartered accountants and tax consultants for
                intensive, actionable executive sessions.
              </p>
            </div>
          </div>
        </section>

        {/* Featured Upcoming Event */}
        {activeEvent && (
          <section className="py-16 sm:py-20 border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                {/* Event details */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-700">
                      {activeEvent.category || "Webinar"}
                    </span>
                    {activeEvent.isFree ? (
                      <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                        Free Admission
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-800">
                        ₦{activeEvent.amount.toLocaleString()} Registration
                      </span>
                    )}
                  </div>

                  <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
                    {activeEvent.title}
                  </h2>

                  <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
                    {activeEvent.description}
                  </p>

                  {/* Date, Time, Location pills */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
                      <CalendarDaysIcon className="w-5 h-5 text-blue-600 shrink-0" />
                      <div className="text-xs">
                        <span className="text-gray-500 block">Date</span>
                        <span className="font-bold text-gray-900">{activeEvent.date}</span>
                      </div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
                      <ClockIcon className="w-5 h-5 text-blue-600 shrink-0" />
                      <div className="text-xs">
                        <span className="text-gray-500 block">Time</span>
                        <span className="font-bold text-gray-900">{activeEvent.time}</span>
                      </div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
                      <MapPinIcon className="w-5 h-5 text-blue-600 shrink-0" />
                      <div className="text-xs">
                        <span className="text-gray-500 block">Venue</span>
                        <span className="font-bold text-gray-900">{activeEvent.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* What you'll learn */}
                  <div className="pt-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-3 flex items-center gap-2">
                      <AcademicCapIcon className="w-4 h-4 text-blue-600" />
                      <span>What You Will Learn in this Session</span>
                    </h3>
                    <div className="space-y-2.5 rounded-2xl border border-gray-200 bg-gray-50/70 p-5">
                      {[
                        "Why profitable businesses still run out of cash and liquidity traps.",
                        "Step-by-step methods to prepare a functional cash flow forecast.",
                        "Managing trade receivables, aging debtor recovery, and payables effectively.",
                        "Controlling operational expenses without jeopardizing long-term growth.",
                        "Common tax and cash flow oversights made by Nigerian SMEs and startups.",
                        "Practical audit-tested tools and templates to monitor cash health.",
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-start gap-3 text-sm text-gray-700">
                          <CheckCircleIcon className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Target audience */}
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-3 flex items-center gap-2">
                      <UserGroupIcon className="w-4 h-4 text-blue-600" />
                      <span>Who Should Attend</span>
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "Business Owners & CEOs",
                        "Entrepreneurs & Founders",
                        "Finance Managers & Accountants",
                        "Startups & Growing SMEs",
                        "Consultants & ATS Candidates",
                      ].map((aud, i) => (
                        <span
                          key={i}
                          className="px-3.5 py-1.5 rounded-lg bg-blue-50 text-blue-800 text-xs font-semibold border border-blue-100"
                        >
                          {aud}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Registration Form / Success Confirmation */}
                <div className="lg:col-span-5">
                  <div className="bg-white rounded-3xl p-8 border-2 border-blue-100 shadow-xl relative overflow-hidden">
                    {registered ? (
                      <div className="space-y-6 animate-in fade-in duration-300">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                          <CheckCircleIcon className="w-8 h-8" />
                        </div>
                        <div>
                          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 block mb-1">
                            Registration Confirmed
                          </span>
                          <h3 className="text-2xl font-bold text-gray-900">
                            You&apos;re officially registered!
                          </h3>
                          <p className="text-sm text-gray-600 mt-2">
                            Thank you for signing up for{" "}
                            <strong>{registeredEvent?.title}</strong>.
                          </p>
                        </div>

                        {/* Next steps list */}
                        <div className="space-y-3 pt-2">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700">
                            Immediate Next Steps:
                          </h4>

                          <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 text-sm">
                            <div className="flex items-start gap-3">
                              <ChatBubbleLeftRightIcon className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                              <div>
                                <p className="font-semibold text-blue-900">
                                  Join Event WhatsApp Group
                                </p>
                                <p className="text-xs text-blue-700 mt-1 mb-2">
                                  Access webinar links, handouts, and live session updates directly on WhatsApp:
                                </p>
                                <a
                                  href={
                                    registeredEvent?.whatsappGroupLink ||
                                    "https://chat.whatsapp.com/I1paAUnSVWq0SvbQQmp9OK"
                                  }
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 transition-colors shadow-xs"
                                >
                                  <span>Join WhatsApp Channel</span>
                                  <ArrowRightIcon className="w-3.5 h-3.5" />
                                </a>
                              </div>
                            </div>
                          </div>

                          <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-600 space-y-1.5">
                            <div className="flex items-center gap-2">
                              <CalendarDaysIcon className="w-4 h-4 text-gray-500" />
                              <span>Mark your calendar: {registeredEvent?.date}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <ClockIcon className="w-4 h-4 text-gray-500" />
                              <span>Starting time: {registeredEvent?.time}</span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            setRegistered(false);
                            setFormData({ name: "", email: "", phone: "" });
                          }}
                          className="w-full py-2.5 text-xs text-gray-500 hover:text-gray-800 transition-colors"
                        >
                          Register another attendee &rarr;
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleRegister} className="space-y-5">
                        <div className="border-b border-gray-100 pb-4">
                          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                            Reserve Your Seat
                          </span>
                          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                            Sign up for this Masterclass
                          </h3>
                          <div className="mt-2 text-xs font-medium text-gray-600">
                            {activeEvent.isFree ? (
                              <span className="text-emerald-700 font-semibold">
                                ✓ 100% Free - Instant Confirmation
                              </span>
                            ) : (
                              <span className="text-blue-700 font-semibold">
                                ₦{activeEvent.amount.toLocaleString()} - Powered by Paystack Secure Checkout
                              </span>
                            )}
                          </div>
                        </div>

                        {errorMessage && (
                          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                            {errorMessage}
                          </div>
                        )}

                        <div>
                          <label
                            htmlFor="fullName"
                            className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5"
                          >
                            Full Name
                          </label>
                          <input
                            type="text"
                            id="fullName"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-sm outline-hidden transition-all"
                            placeholder="e.g. Olamide Joseph"
                            required
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="email"
                            className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5"
                          >
                            Email Address
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-sm outline-hidden transition-all"
                            placeholder="olamide@company.com"
                            required
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="phone"
                            className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5"
                          >
                            Phone / WhatsApp Number
                          </label>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-sm outline-hidden transition-all"
                            placeholder="080 1234 5678"
                            required
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={submitting}
                          className="w-full bg-blue-600 text-white py-3.5 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-md shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 text-sm"
                        >
                          {submitting ? (
                            <span>{statusMessage || "Processing..."}</span>
                          ) : (
                            <>
                              <span>
                                {activeEvent.isFree
                                  ? "Register Now (Free)"
                                  : `Pay ₦${activeEvent.amount.toLocaleString()} with Paystack`}
                              </span>
                              <ArrowRightIcon className="w-4 h-4" />
                            </>
                          )}
                        </button>

                        <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-500 pt-1">
                          <ShieldCheckIcon className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Verified K-Deck Professional Services Gateway</span>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* SECTION FOR PAST EVENTS (Specifically requested) */}
        <section className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
              <div className="max-w-3xl">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Archived Sessions
                </span>
                <h2 className="text-3xl font-extrabold text-gray-900 mt-1">
                  Past Events &amp; Concluded Webinars
                </h2>
                <p className="text-gray-600 text-sm sm:text-base mt-2">
                  Browse our previous executive masterclasses. Stay tuned to our
                  upcoming calendar to participate in future live interactive sessions.
                </p>
              </div>

              <button
                onClick={() => {
                  setLoading(true);
                  fetchEvents();
                }}
                disabled={loading}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-semibold shadow-2xs transition-colors cursor-pointer self-start sm:self-auto disabled:opacity-60"
                title="Refresh events calendar"
              >
                <ArrowPathIcon className={`w-3.5 h-3.5 text-gray-600 ${loading ? "animate-spin text-blue-600" : ""}`} />
                <span>{loading ? "Refreshing..." : "Refresh Events"}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pastEvents.length > 0 ? (
                pastEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-gray-100 text-gray-600">
                          {evt.category || "Past Webinar"}
                        </span>
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                          Concluded
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-gray-900 mb-2 leading-snug">
                        {evt.title}
                      </h3>

                      <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3">
                        {evt.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-gray-100 space-y-2 text-xs text-gray-500">
                      <div className="flex items-center gap-2">
                        <CalendarDaysIcon className="w-4 h-4 text-gray-400" />
                        <span>Held on: {evt.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPinIcon className="w-4 h-4 text-gray-400" />
                        <span>{evt.location}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center py-12 text-gray-500 text-sm">
                  No archived events recorded yet.
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
