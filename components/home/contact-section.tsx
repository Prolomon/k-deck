"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CalendarDaysIcon,
  ChatBubbleLeftRightIcon,
  QuestionMarkCircleIcon,
  PaperAirplaneIcon,
  UserGroupIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "Audit & Assurance",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectService = (value: string | null) => {
    if (value) {
      setFormData((prev) => ({
        ...prev,
        service: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit consultation request");
      }

      setSubmitted(true);
    } catch (err: any) {
      console.error("Submission error:", err);
      setErrorMessage(
        err.message || "Failed to submit your request. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOpenWhatsApp = () => {
    const { name, email, phone, service, message } = formData;
    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "2349070573104";
    const text = encodeURIComponent(
      `New Consultation Request:\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nService: ${service}\nMessage: ${message}`
    );
    const url = `https://wa.me/${whatsappNumber}?text=${text}`;
    window.open(url, "_blank");
  };

  return (
    <section className="bg-slate-50 py-20" id="consultation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Form */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl shadow-sm border border-gray-100">
            <div className="mb-8">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Get In Touch
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
                Request a confidential consultation
              </h2>
              <p className="text-gray-600 text-sm mt-2">
                Fill out the details below and our senior partners will connect
                with you promptly.
              </p>
            </div>

            {submitted ? (
              <div className="bg-blue-50/60 border border-blue-200 rounded-2xl p-8 text-center animate-in fade-in zoom-in-95 duration-300">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-md shadow-blue-600/30">
                  <CheckCircleIcon className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Consultation Request Received!
                </h3>
                <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed mb-6">
                  Thank you, <strong className="text-gray-900">{formData.name}</strong>. Your confidential inquiry regarding{" "}
                  <strong className="text-blue-600">{formData.service}</strong> has been logged. Our lead engagement partner has received your brief and will connect with you shortly.
                </p>

                <div className="bg-white rounded-xl p-4 border border-blue-100 text-left max-w-md mx-auto mb-6 text-xs text-gray-600 space-y-1.5">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-500">Contact Email:</span>
                    <span className="text-gray-900 font-medium">{formData.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-500">Phone:</span>
                    <span className="text-gray-900 font-medium">{formData.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-500">Service:</span>
                    <span className="text-blue-600 font-semibold">{formData.service}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={handleOpenWhatsApp}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition-colors cursor-pointer"
                  >
                    <ChatBubbleLeftRightIcon className="w-4 h-4" />
                    <span>Instant WhatsApp Chat</span>
                  </button>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        name: "",
                        email: "",
                        phone: "",
                        service: "Audit & Assurance",
                        message: "",
                      });
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 font-semibold text-xs transition-colors cursor-pointer"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {errorMessage && (
                  <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                    {errorMessage}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2"
                    >
                      Your Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-sm transition-all outline-hidden"
                      placeholder="e.g. John Doe"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-sm transition-all outline-hidden"
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2"
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-sm transition-all outline-hidden"
                      placeholder="+234 800 000 0000"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="service"
                      className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2"
                    >
                      Select Service
                    </label>
                    <Select
                      value={formData.service}
                      onValueChange={handleSelectService}
                    >
                      <SelectTrigger className="w-full h-11 px-4 rounded-xl border-gray-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 bg-white text-gray-900 shadow-2xs">
                        <SelectValue placeholder="Select Service" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-200 text-gray-900 shadow-lg">
                        <SelectItem value="Audit & Assurance">Audit &amp; Assurance</SelectItem>
                        <SelectItem value="Tax Advisory & Compliance">Tax Advisory &amp; Compliance</SelectItem>
                        <SelectItem value="Forensic Accounting">Forensic Accounting &amp; Investigation</SelectItem>
                        <SelectItem value="Advisory & Business Consulting">Advisory &amp; Consulting</SelectItem>
                        <SelectItem value="Accounting & Financial Reporting">Accounting &amp; Financial Reporting</SelectItem>
                        <SelectItem value="HR & Payroll Services">HR &amp; Payroll Advisory</SelectItem>
                        <SelectItem value="ATSWA / Professional Training">ATSWA / ICAN Coaching</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2"
                  >
                    Help Us Understand Your Needs
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-sm transition-all outline-hidden"
                    placeholder="Tell us briefly about your business or training objectives..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3.5 px-6 rounded-xl font-semibold hover:bg-blue-700 shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  <PaperAirplaneIcon className="w-5 h-5" />
                  <span>{loading ? "Submitting Inquiry..." : "Submit Request & Connect"}</span>
                </button>
              </form>
            )}
          </div>

          {/* Right column: Highlights */}
          <div className="lg:col-span-5 bg-gradient-to-br from-blue-900 to-slate-900 text-white p-8 sm:p-10 rounded-3xl shadow-sm space-y-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-300">
                Collaboration Hub
              </span>
              <h3 className="text-2xl font-bold mt-1 text-white">
                Connect with our expert network
              </h3>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center shrink-0">
                  <UserGroupIcon className="w-5 h-5 text-blue-300" />
                </div>
                <div>
                  <h4 className="font-semibold text-base text-white">
                    Join Our Professional Community
                  </h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    Be part of our network of visionary business leaders,
                    founders, and accountants sharing knowledge.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center shrink-0">
                  <CalendarDaysIcon className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h4 className="font-semibold text-base text-white">
                    Upcoming Webinars & Events
                  </h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    Access intensive webinars on cash-flow optimization, tax
                    readiness, and SME growth strategies.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center shrink-0">
                  <QuestionMarkCircleIcon className="w-5 h-5 text-emerald-300" />
                </div>
                <div>
                  <h4 className="font-semibold text-base text-white">
                    Direct Partner Q&A Sessions
                  </h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    Get clear answers to your complex tax questions and audit
                    compliance queries from qualified FCAs.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/events"
                className="w-full inline-flex items-center justify-center gap-2 bg-white text-blue-900 font-semibold py-3 px-6 rounded-xl hover:bg-blue-50 transition-colors text-sm shadow-sm"
              >
                <span>See Upcoming Activities</span>
                <span>&rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
