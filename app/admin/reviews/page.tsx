"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  StarIcon,
  TrashIcon,
  ShareIcon,
  ChatBubbleLeftRightIcon,
  ClipboardDocumentCheckIcon,
  ArrowTopRightOnSquareIcon,
  HandThumbUpIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/solid";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import {
  ConfirmDeleteModal,
  NotificationBanner,
  useAdminNotification,
} from "@/components/admin/admin-feedback";

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
  isApproved: boolean;
  createdAt: string;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  // Deletion Confirmation Modal State
  const [deleteTarget, setDeleteTarget] = useState<ReviewItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Admin Notification
  const { notification, showSuccess, showError, showWarn, clearNotification } =
    useAdminNotification();

  const fetchReviews = async (isManualRefresh = false) => {
    try {
      const res = await fetch("/api/reviews?all=true");
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
        if (isManualRefresh) {
          showSuccess("Client reviews refreshed successfully.");
        }
      } else {
        throw new Error("Failed to fetch reviews");
      }
    } catch (err: unknown) {
      console.error("Error fetching reviews:", err);
      showError("Unable to load reviews from database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const copyReviewLink = () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const reviewUrl = `${origin}/review`;
    navigator.clipboard.writeText(reviewUrl);
    setCopied(true);
    showSuccess("Public review link copied to clipboard!");
    setTimeout(() => setCopied(false), 2500);
  };

  const shareViaWhatsApp = () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const reviewUrl = `${origin}/review`;
    const message = encodeURIComponent(
      `Hello! We would love your feedback on your experience with K-DECK Professional Services. Please take 60 seconds to share your review: ${reviewUrl}`
    );
    window.open(`https://wa.me/?text=${message}`, "_blank");
  };

  const triggerDeleteConfirm = (rev: ReviewItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setDeleteTarget(rev);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/reviews/${deleteTarget.id}`, { method: "DELETE" });
      if (res.ok) {
        setReviews(reviews.filter((r) => r.id !== deleteTarget.id));
        showWarn(`Client review from "${deleteTarget.name}" permanently deleted.`);
        setDeleteTarget(null);
      } else {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete review");
      }
    } catch (err: unknown) {
      const error = err as Error;
      showError(error.message || "Failed to delete review");
    } finally {
      setIsDeleting(false);
    }
  };

  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length
        ).toFixed(1)
      : "5.0";

  const recommendCount = reviews.filter((r) => r.recommend).length;

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
        title="Confirm Review Deletion"
        description="Are you sure you want to permanently delete this client testimonial? This entry will be removed from your website showcase."
        itemName={deleteTarget ? `${deleteTarget.name}` : undefined}
        confirmLabel="Yes, Delete Review"
        isDeleting={isDeleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
            Reputation Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Platform Reviews &amp; Testimonials
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Send out the review page link to clients and students, monitor incoming feedback, and click on client names to manage feedback.
          </p>
        </div>

        {/* Share buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => {
              setLoading(true);
              fetchReviews(true);
            }}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-200 hover:bg-neutral-800 hover:text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer disabled:opacity-60"
            title="Refresh submitted reviews"
          >
            <ArrowPathIcon className={`w-3.5 h-3.5 text-neutral-400 ${loading ? "animate-spin text-purple-400" : ""}`} />
            <span>{loading ? "Refreshing..." : "Refresh"}</span>
          </button>

          <button
            onClick={copyReviewLink}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 text-white font-semibold text-xs shadow-md shadow-purple-600/30 hover:bg-purple-500 transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <ClipboardDocumentCheckIcon className="w-4 h-4 text-emerald-300" />
                <span>Link Copied!</span>
              </>
            ) : (
              <>
                <ShareIcon className="w-4 h-4" />
                <span>Copy Review Link</span>
              </>
            )}
          </button>

          <button
            onClick={shareViaWhatsApp}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold text-xs shadow-md shadow-emerald-600/30 hover:bg-emerald-500 transition-colors cursor-pointer"
          >
            <ChatBubbleLeftRightIcon className="w-4 h-4" />
            <span>Request via WhatsApp</span>
          </button>

          <Link
            href="/review"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 font-semibold text-xs hover:bg-neutral-800 hover:text-white transition-colors"
          >
            <span>Open Public Form</span>
            <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-neutral-950 p-6 rounded-3xl border border-neutral-800/90 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Total Reviews
            </span>
            <div className="text-3xl font-black text-white mt-1">{reviews.length}</div>
            <div className="text-xs text-neutral-400 mt-1">Verified Client Submissions</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-950/60 border border-purple-800/50 text-purple-400 flex items-center justify-center shrink-0">
            <ChatBubbleLeftRightIcon className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-neutral-950 p-6 rounded-3xl border border-neutral-800/90 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Average Rating
            </span>
            <div className="text-3xl font-black text-amber-400 mt-1 flex items-center gap-1">
              <span>{avgRating}</span>
              <StarIcon className="w-6 h-6 text-amber-400 inline" />
            </div>
            <div className="text-xs text-neutral-400 mt-1">Out of 5.0 Star Standard</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-950/60 border border-amber-800/50 text-amber-400 flex items-center justify-center shrink-0">
            <StarIcon className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-neutral-950 p-6 rounded-3xl border border-neutral-800/90 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Recommendation Rate
            </span>
            <div className="text-3xl font-black text-emerald-400 mt-1">
              {reviews.length > 0
                ? `${Math.round((recommendCount / reviews.length) * 100)}%`
                : "100%"}
            </div>
            <div className="text-xs text-neutral-400 mt-1">{recommendCount} clients recommend K-Deck</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-950/60 border border-emerald-800/50 text-emerald-400 flex items-center justify-center shrink-0">
            <HandThumbUpIcon className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Reviews Cards Grid (Replacing Table, No Feedback/Comment displayed) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Client Review Cards</h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Click on any client name to open the review detail page and inspect or edit full feedback.
            </p>
          </div>
          <span className="text-xs text-neutral-400 font-mono">
            {reviews.length} {reviews.length === 1 ? "entry" : "entries"}
          </span>
        </div>

        {reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-neutral-950 border border-neutral-800/90 rounded-3xl p-6 shadow-xl flex flex-col justify-between hover:border-purple-800/60 transition-all group"
              >
                <div>
                  {/* Client Info Header */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-purple-950/70 border border-purple-800/60 text-purple-300 flex items-center justify-center font-bold text-sm shrink-0">
                        {rev.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <Link
                          href={`/admin/reviews/${rev.id}`}
                          className="font-bold text-sm text-white group-hover:text-purple-400 transition-colors block truncate"
                          title="Open review detail"
                        >
                          {rev.name}
                        </Link>
                        {(rev.role || rev.company) && (
                          <div className="text-[11px] text-neutral-400 truncate">
                            {[rev.role, rev.company].filter(Boolean).join(" • ")}
                          </div>
                        )}
                        {rev.email && (
                          <div className="text-[10px] text-neutral-500 font-mono truncate mt-0.5">
                            {rev.email}
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={(e) => triggerDeleteConfirm(rev, e)}
                      className="p-1.5 text-neutral-500 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition-colors cursor-pointer shrink-0"
                      title="Delete Review"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Rating Stars & Service Badge */}
                  <div className="space-y-2.5 pt-2 border-t border-neutral-800/70">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <StarIcon
                            key={star}
                            className={`w-4 h-4 ${
                              star <= rev.rating ? "text-amber-400" : "text-neutral-700"
                            }`}
                          />
                        ))}
                        <span className="text-xs font-bold text-neutral-200 ml-1.5">{rev.rating}.0</span>
                      </div>
                      <span className="text-[10px] text-neutral-500 font-mono">
                        {new Date(rev.createdAt).toLocaleDateString([], {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="inline-block px-2.5 py-1 rounded-lg bg-blue-950/70 text-blue-300 border border-blue-800/60 font-bold text-[10px] uppercase tracking-wide">
                        {rev.serviceUsed}
                      </span>
                      {rev.recommend ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-950/70 text-emerald-300 border border-emerald-800/60 font-semibold text-[10px]">
                          <HandThumbUpIcon className="w-3 h-3 text-emerald-400" />
                          <span>Recommends</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 text-[10px]">
                          Neutral
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer Link to ID page */}
                <div className="pt-4 mt-4 border-t border-neutral-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-neutral-500 font-mono">
                    ID: #{rev.id.slice(-6)}
                  </span>
                  <Link
                    href={`/admin/reviews/${rev.id}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-purple-400 group-hover:text-purple-300 transition-colors"
                  >
                    <span>View Review Details</span>
                    <ArrowRightIcon className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-neutral-950 rounded-3xl p-12 text-center border border-neutral-800 shadow-xl">
            <ChatBubbleLeftRightIcon className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-white">No Reviews Available</h3>
            <p className="text-xs text-neutral-400 mt-1 max-w-sm mx-auto">
              {loading ? "Loading client reviews..." : "No reviews submitted yet. Use the share button above to request client feedback."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
