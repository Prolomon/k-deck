"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import {
  AcademicCapIcon,
  CheckCircleIcon,
  BookOpenIcon,
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  XMarkIcon,
  ArrowRightIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

interface WhatsAppGroup {
  id: string;
  name: string;
  atsLevel: string;
  inviteUrl: string;
  description: string | null;
}

export default function ClassesPage() {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    subjectTaken: "",
    notes: "",
  });

  const [selectedAts, setSelectedAts] = useState<string[]>(["ATS 1"]);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [matchingGroups, setMatchingGroups] = useState<WhatsAppGroup[]>([]);
  const [errorMessage, setErrorMessage] = useState("");

  const atsOptions = [
    {
      id: "Foundation",
      title: "Foundation",
      description: "Basic Accounting Processes, Business Law, Quantitative Techniques, Communication Skills.",
      badge: "Foundation",
    },
    {
      id: "ATS 1",
      title: "ATS 1",
      description: "Basic Accounting Processes, Business Law, Economics, Communication Skills.",
      badge: "ATS 1",
    },
    {
      id: "ATS 2",
      title: "ATS 2",
      description: "Principles of Auditing, Quantitative Analysis, Information Technology, Cost Accounting.",
      badge: "ATS 2",
    },
    {
      id: "ATS 3",
      title: "ATS 3",
      description: "Preparing for full ACA transition: Management, Public Sector Accounting, Tax & Audit.",
      badge: "ATS 3",
    },
  ];

  const handleCheckboxChange = (atsId: string) => {
    if (selectedAts.includes(atsId)) {
      if (selectedAts.length === 1) return; // keep at least one
      setSelectedAts(selectedAts.filter((item) => item !== atsId));
    } else {
      setSelectedAts([...selectedAts, atsId]);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.address ||
      !formData.phone ||
      !formData.email ||
      !formData.subjectTaken
    ) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    if (selectedAts.length === 0) {
      setErrorMessage("Please select at least one ATS training stage.");
      return;
    }

    setSubmitting(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          atsLevels: selectedAts,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit class registration.");
      }

      setMatchingGroups(data.whatsappGroups || []);
      setShowSuccessModal(true);
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMessage(error.message || "Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative text-white h-72 sm:h-80 flex items-center justify-center overflow-hidden">
          <Image
            src="/images/bg4.jpg"
            alt="ATS Training Program"
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-blue-950/85 backdrop-blur-xs flex items-center justify-center">
            <div className="max-w-4xl mx-auto px-4 text-center">
              <span className="inline-block px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-3 border border-blue-400/30">
                Accounting Technicians Scheme (ATS)
              </span>
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
                ATS Professional Training & Masterclasses
              </h1>
              <p className="text-base sm:text-lg text-slate-200 max-w-2xl mx-auto">
                Comprehensive ICAN-accredited Accounting Technicians Scheme
                preparation. Register below to access intensive tuition and join
                your stage-specific WhatsApp study cohort.
              </p>
            </div>
          </div>
        </section>

        {/* Training Info & Form */}
        <section className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              {/* Left Column: ATS Overview */}
              <div className="lg:col-span-5 space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                    Why Train with K-Deck
                  </span>
                  <h2 className="text-3xl font-extrabold text-gray-900 mt-1">
                    Structured Path to Professional Accounting
                  </h2>
                  <p className="text-gray-600 text-sm sm:text-base mt-3 leading-relaxed">
                    Our ATS coaching program is delivered by experienced Fellows
                    and Associates of ICAN and CITN. We guide candidates through
                    rigorous past question reviews, mock exams, and personalized
                    mentorship.
                  </p>
                </div>

                <div className="space-y-4">
                  {atsOptions.map((opt) => (
                    <div
                      key={opt.id}
                      className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-gray-900 text-base">
                          {opt.title}
                        </h3>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                          {opt.badge}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {opt.description}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-900 to-slate-900 text-white space-y-3">
                  <div className="flex items-center gap-2 text-blue-300 font-semibold text-xs uppercase tracking-wider">
                    <UserGroupIcon className="w-4 h-4" />
                    <span>Dedicated Cohort Groups</span>
                  </div>
                  <h4 className="text-lg font-bold">
                    Direct WhatsApp Study Cohorts
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Immediately upon completing registration, you will receive
                    direct access links to join the official WhatsApp tutorial
                    groups for your selected ATS stages.
                  </p>
                </div>
              </div>

              {/* Right Column: Registration Form */}
              <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl shadow-sm border border-gray-200">
                <div className="mb-6">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                    Enrollment Form
                  </span>
                  <h3 className="text-2xl font-bold text-gray-900 mt-1">
                    Register for ATS Classes
                  </h3>
                  <p className="text-xs text-gray-600 mt-1">
                    Fill in your verified contact information to reserve your space
                    and receive study links.
                  </p>
                </div>

                {errorMessage && (
                  <div className="p-3.5 mb-5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                    {errorMessage}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5"
                      >
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-sm outline-hidden transition-all"
                        placeholder="e.g. Samuel Olaniyi"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5"
                      >
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-sm outline-hidden transition-all"
                        placeholder="samuel@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5"
                      >
                        Phone / WhatsApp Number *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-sm outline-hidden transition-all"
                        placeholder="080 5544 3322"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="address"
                        className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5"
                      >
                        Residential / City Address *
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-sm outline-hidden transition-all"
                        placeholder="e.g. Festac Town, Lagos"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="subjectTaken"
                      className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5"
                    >
                      Subjects / Papers Taken *
                    </label>
                    <input
                      type="text"
                      id="subjectTaken"
                      name="subjectTaken"
                      value={formData.subjectTaken}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-sm outline-hidden transition-all"
                      placeholder="e.g. Financial Accounting, Business Law, Quantitative Analysis"
                      required
                    />
                  </div>

                  {/* MULTIPLE ATS SELECTION */}
                  <div className="pt-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2">
                      Select ATS Stages (Select Multiple as Applicable) *
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {atsOptions.map((opt) => {
                        const checked = selectedAts.includes(opt.id);
                        return (
                          <label
                            key={opt.id}
                            className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                              checked
                                ? "bg-blue-50 border-blue-600 text-blue-900 shadow-xs"
                                : "bg-white border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => handleCheckboxChange(opt.id)}
                              className="w-4 h-4 text-blue-600 rounded-sm border-gray-300 focus:ring-blue-500"
                            />
                            <div className="text-xs">
                              <span className="font-bold block">{opt.title}</span>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="notes"
                      className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5"
                    >
                      Additional Notes / Study Preference (Optional)
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      rows={2}
                      value={formData.notes}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-sm outline-hidden transition-all"
                      placeholder="e.g. Weekend batch preference, preparatory past question requests..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-blue-600 text-white py-3.5 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-md shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 text-sm"
                  >
                    {submitting ? (
                      <span>Submitting Registration...</span>
                    ) : (
                      <>
                        <span>Submit Registration & Get WhatsApp Links</span>
                        <ArrowRightIcon className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* SUCCESS MODAL BASED ON SELECTED ATS */}
        {showSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-gray-100 animate-in zoom-in-95 duration-200">
              <button
                onClick={() => setShowSuccessModal(false)}
                className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>

              <div className="text-center space-y-3 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircleIcon className="w-8 h-8" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                  Registration Successful
                </span>
                <h3 className="text-2xl font-bold text-gray-900">
                  Welcome to K-Deck ATS Training!
                </h3>
                <p className="text-xs text-gray-600 max-w-sm mx-auto">
                  Your registration has been saved. Join the official WhatsApp
                  study groups below based on your selected ATS stages:
                </p>
              </div>

              {/* Group links matching selected ATS */}
              <div className="space-y-3 mb-6">
                {matchingGroups.length > 0 ? (
                  matchingGroups.map((group) => (
                    <div
                      key={group.id}
                      className="p-4 rounded-2xl bg-blue-50 border border-blue-200/80 flex items-center justify-between gap-3"
                    >
                      <div className="text-left">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-600 text-white">
                            {group.atsLevel}
                          </span>
                          <span className="font-bold text-sm text-gray-900">
                            {group.name}
                          </span>
                        </div>
                        {group.description && (
                          <p className="text-[11px] text-gray-600 line-clamp-1">
                            {group.description}
                          </p>
                        )}
                      </div>

                      <a
                        href={group.inviteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition-colors"
                      >
                        <ChatBubbleLeftRightIcon className="w-3.5 h-3.5" />
                        <span>Join Group</span>
                      </a>
                    </div>
                  ))
                ) : (
                  <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-center">
                    <p className="text-xs text-blue-900 font-semibold mb-2">
                      Join our central ATS Study Channel
                    </p>
                    <a
                      href="https://chat.whatsapp.com/I1paAUnSVWq0SvbQQmp9OK"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700"
                    >
                      <span>Join General ATS Channel</span>
                    </a>
                  </div>
                )}
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    setShowSuccessModal(false);
                    setFormData({
                      name: "",
                      address: "",
                      phone: "",
                      email: "",
                      subjectTaken: "",
                      notes: "",
                    });
                  }}
                  className="w-full py-3 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-semibold transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
