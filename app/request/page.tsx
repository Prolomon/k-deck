"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import {
  DocumentTextIcon,
  CheckCircleIcon,
  PaperAirplaneIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function RFPFormPage() {
  const [formData, setFormData] = useState({
    company: "",
    contactName: "",
    email: "",
    phone: "",
    service: "Audit & Assurance",
    projectTitle: "",
    projectDescription: "",
    budget: "",
    timeline: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "2349070573104";
    const message = `RFP Submission:%0ACompany: ${encodeURIComponent(
      formData.company
    )}%0AContact Name: ${encodeURIComponent(
      formData.contactName
    )}%0AEmail: ${encodeURIComponent(formData.email)}%0APhone: ${encodeURIComponent(
      formData.phone
    )}%0AService: ${encodeURIComponent(
      formData.service
    )}%0AProject Title: ${encodeURIComponent(
      formData.projectTitle
    )}%0ADescription: ${encodeURIComponent(
      formData.projectDescription
    )}%0ABudget: ${encodeURIComponent(
      formData.budget || "N/A"
    )}%0ATimeline: ${encodeURIComponent(formData.timeline || "N/A")}`;

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;
    window.open(whatsappUrl, "_blank");
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Procurement & Engagement
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-1">
              Request for Proposal (RFP)
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-2 max-w-2xl mx-auto">
              Please complete the engagement specification form below. Our
              partners will review your scope and provide a formal, confidential
              proposal.
            </p>
          </div>

          <div className="bg-white p-8 sm:p-12 rounded-3xl shadow-sm border border-gray-200">
            {submitted ? (
              <div className="text-center py-10 space-y-4 animate-in fade-in duration-300">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircleIcon className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  RFP Successfully Dispatched
                </h3>
                <p className="text-sm text-gray-600 max-w-md mx-auto">
                  Thank you for submitting your Request for Proposal! A senior
                  consultant from K-DECK Professional Services has been alerted
                  and will contact you within 24 business hours.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        company: "",
                        contactName: "",
                        email: "",
                        phone: "",
                        service: "Audit & Assurance",
                        projectTitle: "",
                        projectDescription: "",
                        budget: "",
                        timeline: "",
                      });
                    }}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 underline"
                  >
                    Submit another proposal request
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="company"
                      className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5"
                    >
                      Company / Organization Name *
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-sm outline-hidden transition-all"
                      placeholder="e.g. Apex Global Ventures Ltd"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="contactName"
                      className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5"
                    >
                      Contact Person Full Name *
                    </label>
                    <input
                      type="text"
                      id="contactName"
                      name="contactName"
                      value={formData.contactName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-sm outline-hidden transition-all"
                      placeholder="e.g. Jane Doe"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5"
                    >
                      Corporate Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-sm outline-hidden transition-all"
                      placeholder="jane@apexventures.com"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5"
                    >
                      Telephone / WhatsApp Number *
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
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="service"
                      className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5"
                    >
                      Service Domain *
                    </label>
                    <Select
                      value={formData.service}
                      onValueChange={(val) => val && setFormData({ ...formData, service: val })}
                    >
                      <SelectTrigger className="w-full h-11 border border-gray-200 bg-white text-gray-900 text-sm">
                        <SelectValue placeholder="Service Domain" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-200 text-gray-900 shadow-xl">
                        <SelectItem value="Audit & Assurance">Audit &amp; Assurance</SelectItem>
                        <SelectItem value="Tax Services & Transfer Pricing">Tax Services &amp; Transfer Pricing</SelectItem>
                        <SelectItem value="Financial Reporting & IFRS">Financial Reporting &amp; IFRS</SelectItem>
                        <SelectItem value="Strategic Business Consultancy">Strategic Business Consultancy</SelectItem>
                        <SelectItem value="Corporate Governance & Internal Controls">Corporate Governance &amp; Internal Controls</SelectItem>
                        <SelectItem value="ATS Professional Training Cohort">ATS Professional Training Cohort</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label
                      htmlFor="projectTitle"
                      className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5"
                    >
                      Project or Engagement Title *
                    </label>
                    <input
                      type="text"
                      id="projectTitle"
                      name="projectTitle"
                      value={formData.projectTitle}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-sm outline-hidden transition-all"
                      placeholder="e.g. 2026 Statutory Financial Statement Audit"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="projectDescription"
                    className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5"
                  >
                    Engagement Scope & Specific Requirements *
                  </label>
                  <textarea
                    id="projectDescription"
                    name="projectDescription"
                    rows={4}
                    value={formData.projectDescription}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-sm outline-hidden transition-all"
                    placeholder="Provide relevant details regarding your company size, transaction volume, deliverables, and timeline expectations..."
                    required
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="budget"
                      className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5"
                    >
                      Target Budget Range (Optional)
                    </label>
                    <input
                      type="text"
                      id="budget"
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-sm outline-hidden transition-all"
                      placeholder="e.g. ₦1,500,000 - ₦3,000,000"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="timeline"
                      className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5"
                    >
                      Expected Completion Date / Timeline (Optional)
                    </label>
                    <input
                      type="text"
                      id="timeline"
                      name="timeline"
                      value={formData.timeline}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-sm outline-hidden transition-all"
                      placeholder="e.g. Within 60 Days"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-md shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer text-sm"
                >
                  <PaperAirplaneIcon className="w-5 h-5" />
                  <span>Submit RFP & Transmit to Partners</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
