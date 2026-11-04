"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import {
  StarIcon,
  CheckCircleIcon,
  ChatBubbleLeftRightIcon,
  ShareIcon,
  ClipboardDocumentCheckIcon,
  PaperAirplaneIcon,
  HandThumbUpIcon,
} from "@heroicons/react/24/solid";
import {
  StarIcon as StarOutlineIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ReviewItem {
  id: string;
  name: string;
  email: string | null;
  role: string | null;
  company: string | null;
  serviceUsed: string;
  rating: number;
  title: string;
  comment: string;
  recommend: boolean;
  createdAt: string;
}

export default function ReviewPage() {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    company: "",
    serviceUsed: "Audit & Assurance",
    title: "",
    comment: "",
    recommend: true,
  });

  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchReviews = async () => {
    try {
      const res = await fetch("/api/reviews");
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setFormData({ ...formData, [name]: (e.target as HTMLInputElement).checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.title || !formData.comment) {
      setErrorMessage("Please complete all required fields.");
      return;
    }

    setSubmitting(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          rating,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit review");
      }

      setSubmitted(true);
      fetchReviews();
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMessage(error.message || "Failed to record your review");
    } finally {
      setSubmitting(false);
    }
  };

  const copyPageLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const shareViaWhatsApp = () => {
    if (typeof window !== "undefined") {
      const text = encodeURIComponent(
        `We would value your feedback! Please take 60 seconds to review your experience with K-DECK Professional Services: ${window.location.href}`
      );
      window.open(`https://wa.me/?text=${text}`, "_blank");
    }
  };

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length
        ).toFixed(1)
      : "5.0";

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative text-white py-16 sm:py-20 bg-gradient-to-br from-blue-950 via-slate-900 to-blue-900 overflow-hidden">
          <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-4 border border-blue-400/30">
              <HandThumbUpIcon className="w-4 h-4 text-blue-300" />
              <span>Client & Student Feedback</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 text-white">
              Review Your Experience with K-DECK
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed mb-6">
              Your candid feedback drives our continuous pursuit of excellence
              across statutory audit, tax advisory, financial reporting, and ATS coaching.
            </p>

            {/* Quick Share Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={copyPageLink}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 backdrop-blur-xs transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <ClipboardDocumentCheckIcon className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-300">Link Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <ShareIcon className="w-4 h-4" />
                    <span>Copy Review Link to Share</span>
                  </>
                )}
              </button>

              <button
                onClick={shareViaWhatsApp}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
              >
                <ChatBubbleLeftRightIcon className="w-4 h-4" />
                <span>Send Out on WhatsApp</span>
              </button>
            </div>
          </div>
        </section>

        {/* Content Section: Form & Reviews */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              {/* Form Column */}
              <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl shadow-sm border border-gray-200">
                {submitted ? (
                  <div className="text-center py-12 space-y-4 animate-in fade-in duration-300">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                      <CheckCircleIcon className="w-10 h-10" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                      Feedback Received
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                      Thank you for your valuable review!
                    </h2>
                    <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
                      We truly appreciate you taking the time to review K-DECK
                      Professional Services. Your perspective helps us serve you
                      and our community even better.
                    </p>
                    <div className="pt-4 flex justify-center gap-4">
                      <button
                        onClick={() => {
                          setSubmitted(false);
                          setFormData({
                            name: "",
                            email: "",
                            role: "",
                            company: "",
                            serviceUsed: "Audit & Assurance",
                            title: "",
                            comment: "",
                            recommend: true,
                          });
                        }}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-800 underline"
                      >
                        Submit another review
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                        Leave a Testimonial
                      </span>
                      <h2 className="text-2xl font-bold text-gray-900 mt-1">
                        Share Your Honest Review
                      </h2>
                      <p className="text-xs text-gray-500 mt-1">
                        Takes less than 60 seconds to complete.
                      </p>
                    </div>

                    {errorMessage && (
                      <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                        {errorMessage}
                      </div>
                    )}

                    {/* Star Rating Picker */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2">
                        Overall Rating *
                      </label>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setRating(star)}
                            className="p-1 focus:outline-hidden transition-transform hover:scale-110 cursor-pointer"
                          >
                            {(hoverRating || rating) >= star ? (
                              <StarIcon className="w-8 h-8 text-amber-400" />
                            ) : (
                              <StarOutlineIcon className="w-8 h-8 text-gray-300" />
                            )}
                          </button>
                        ))}
                        <span className="ml-3 text-sm font-bold text-gray-700">
                          {rating} out of 5 Stars
                        </span>
                      </div>
                    </div>

                    {/* Service Used Selector */}
                    <div>
                      <label
                        htmlFor="serviceUsed"
                        className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5"
                      >
                        Service or Program Experienced *
                      </label>
                      <Select
                        value={formData.serviceUsed}
                        onValueChange={(val) => val && setFormData({ ...formData, serviceUsed: val })}
                      >
                        <SelectTrigger className="w-full h-11 border border-gray-200 bg-white text-gray-900 text-sm">
                          <SelectValue placeholder="Select Service" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-200 text-gray-900 shadow-xl">
                          <SelectItem value="Audit & Assurance">Statutory Audit &amp; Assurance</SelectItem>
                          <SelectItem value="Tax Services & Transfer Pricing">Tax Advisory &amp; Transfer Pricing</SelectItem>
                          <SelectItem value="Financial Reporting & IFRS">Financial Reporting &amp; IFRS Accounting</SelectItem>
                          <SelectItem value="Strategic Business Consultancy">Strategic Business Consultancy</SelectItem>
                          <SelectItem value="ATS Professional Training">ATS Professional Coaching &amp; Classes</SelectItem>
                          <SelectItem value="Webinars & Masterclasses">Webinars &amp; Cash Flow Masterclasses</SelectItem>
                          <SelectItem value="General Platform & Advisory Experience">General Platform &amp; Client Service</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Review Title */}
                    <div>
                      <label
                        htmlFor="title"
                        className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5"
                      >
                        Headline / Review Summary *
                      </label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-sm outline-hidden"
                        placeholder="e.g. Excellent audit turnaround and professional insight"
                        required
                      />
                    </div>

                    {/* Detailed Comment */}
                    <div>
                      <label
                        htmlFor="comment"
                        className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5"
                      >
                        Detailed Feedback / Review *
                      </label>
                      <textarea
                        id="comment"
                        name="comment"
                        rows={4}
                        value={formData.comment}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-sm outline-hidden"
                        placeholder="What did you appreciate most about working with K-Deck? What impact did our services have on your business or exams?..."
                        required
                      ></textarea>
                    </div>

                    {/* Name & Contact */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5"
                        >
                          Your Name *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-sm outline-hidden"
                          placeholder="e.g. Olawale Adeleke"
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5"
                        >
                          Email (Optional)
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-sm outline-hidden"
                          placeholder="olawale@company.com"
                        />
                      </div>
                    </div>

                    {/* Role & Company */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="role"
                          className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5"
                        >
                          Designation / Role (Optional)
                        </label>
                        <input
                          type="text"
                          id="role"
                          name="role"
                          value={formData.role}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-sm outline-hidden"
                          placeholder="e.g. Managing Director or Student"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="company"
                          className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5"
                        >
                          Company / Institution (Optional)
                        </label>
                        <input
                          type="text"
                          id="company"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-sm outline-hidden"
                          placeholder="e.g. Adeleke Logistics Ltd"
                        />
                      </div>
                    </div>

                    {/* Recommend toggle */}
                    <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-gray-200">
                      <input
                        type="checkbox"
                        id="recommend"
                        name="recommend"
                        checked={formData.recommend}
                        onChange={handleChange}
                        className="w-4 h-4 text-blue-600 rounded-sm"
                      />
                      <label
                        htmlFor="recommend"
                        className="text-xs text-gray-700 font-semibold cursor-pointer flex items-center gap-1.5"
                      >
                        <HandThumbUpIcon className="w-4 h-4 text-emerald-600" />
                        <span>I recommend K-DECK Professional Services to others</span>
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-blue-600 text-white py-3.5 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-md shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 text-sm"
                    >
                      {submitting ? (
                        <span>Publishing Review...</span>
                      ) : (
                        <>
                          <PaperAirplaneIcon className="w-4 h-4" />
                          <span>Submit Platform Review</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>

              {/* Right Column: Rating Summary & Client Reviews */}
              <div className="lg:col-span-5 space-y-6">
                {/* Score badge */}
                <div className="bg-gradient-to-br from-blue-900 to-slate-900 text-white p-8 rounded-3xl shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-blue-300">
                        Reputation & Trust
                      </span>
                      <h3 className="text-xl font-bold text-white mt-1">
                        Average Client Score
                      </h3>
                    </div>
                    <div className="text-right">
                      <div className="text-4xl font-black text-amber-400">
                        {averageRating}
                      </div>
                      <div className="flex items-center gap-1 justify-end mt-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <StarIcon key={s} className="w-3.5 h-3.5 text-amber-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed pt-2 border-t border-white/10">
                    Based on verified reviews from businesses, startups, and ATS
                    students across Nigeria.
                  </p>
                </div>

                {/* Testimonials list */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-base text-gray-900">
                      Recent Client Testimonials
                    </h3>
                    <button
                      onClick={() => fetchReviews()}
                      className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-blue-600 transition-colors cursor-pointer"
                      title="Refresh reviews"
                    >
                      <ArrowPathIcon className="w-3.5 h-3.5" />
                      <span>Refresh</span>
                    </button>
                  </div>

                  {reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <StarIcon
                              key={s}
                              className={`w-4 h-4 ${
                                s <= rev.rating ? "text-amber-400" : "text-gray-200"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-50 text-blue-700">
                          {rev.serviceUsed}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-gray-900 leading-snug">
                        &ldquo;{rev.title}&rdquo;
                      </h4>

                      <p className="text-xs text-gray-600 leading-relaxed italic">
                        {rev.comment}
                      </p>

                      <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
                        <div>
                          <strong className="text-gray-800">{rev.name}</strong>
                          {rev.role && <span> &bull; {rev.role}</span>}
                          {rev.company && <span>, {rev.company}</span>}
                        </div>
                        <span>{new Date(rev.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
