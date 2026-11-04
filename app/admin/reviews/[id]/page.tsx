"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  StarIcon,
  TrashIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  EnvelopeIcon,
  BuildingOfficeIcon,
  BriefcaseIcon,
  HandThumbUpIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/solid";
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

export default function ReviewDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [review, setReview] = useState<ReviewItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    company: "",
    serviceUsed: "Audit & Assurance",
    rating: "5",
    title: "",
    comment: "",
    recommend: true,
    isApproved: true,
  });

  const { notification, showSuccess, showError, showWarn, clearNotification } =
    useAdminNotification();

  const fetchReview = async () => {
    try {
      const res = await fetch(`/api/reviews/${id}`);
      if (!res.ok) {
        throw new Error("Review not found");
      }
      const data: ReviewItem = await res.json();
      setReview(data);
      setFormData({
        name: data.name,
        email: data.email || "",
        role: data.role || "",
        company: data.company || "",
        serviceUsed: data.serviceUsed,
        rating: String(data.rating),
        title: data.title,
        comment: data.comment,
        recommend: data.recommend,
        isApproved: data.isApproved,
      });
    } catch (err) {
      console.error(err);
      showError("Unable to load review details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReview();
  }, [id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          rating: Number(formData.rating),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update review");
      }

      const updated = await res.json();
      setReview(updated.review);
      showSuccess("Review details and testimonial updated successfully.");
    } catch (err: unknown) {
      const error = err as Error;
      showError(error.message || "Failed to save review");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/reviews/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete review");
      showWarn("Review permanently removed.");
      setTimeout(() => {
        router.push("/admin/reviews");
      }, 1000);
    } catch (err: unknown) {
      const error = err as Error;
      showError(error.message || "Failed to delete review");
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-neutral-400 flex items-center justify-center gap-2 text-sm">
        <ArrowPathIcon className="w-5 h-5 animate-spin text-purple-400" />
        <span>Loading review details...</span>
      </div>
    );
  }

  if (!review) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Review Not Found</h2>
        <p className="text-neutral-400 text-xs">The requested testimonial does not exist or was removed.</p>
        <Link href="/admin/reviews" className="text-xs text-purple-400 underline">
          &larr; Back to Client Reviews
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <NotificationBanner notification={notification} onClose={clearNotification} />

      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        title="Delete Client Review"
        description="Are you sure you want to permanently delete this testimonial? It will no longer appear on your public website."
        itemName={`${review.name} - "${review.title}"`}
        confirmLabel="Yes, Delete Review"
        isDeleting={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />

      {/* Top Bar */}
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/admin/reviews"
          className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          <span>Back to All Reviews</span>
        </Link>

        <Button
          variant="destructive"
          size="sm"
          onClick={() => setShowDeleteModal(true)}
          className="bg-rose-950/70 border border-rose-800/80 text-rose-300 hover:bg-rose-900 cursor-pointer"
        >
          <TrashIcon className="w-4 h-4 mr-1.5" />
          <span>Delete Review</span>
        </Button>
      </div>

      {/* Header Info */}
      <div className="bg-neutral-950 p-6 sm:p-8 rounded-3xl border border-neutral-800/90 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-950/80 border border-purple-800/80 text-purple-300 flex items-center justify-center text-xl font-black shrink-0">
            {review.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white">{review.name}</h1>
              {formData.isApproved ? (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-800/80">
                  Approved
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-950/80 text-amber-300 border border-amber-800/80">
                  Hidden / Pending
                </span>
              )}
            </div>
            <p className="text-xs text-neutral-400 mt-1">
              {[review.role, review.company].filter(Boolean).join(" • ") || "Client Reviewer"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-neutral-900 px-4 py-2 rounded-xl border border-neutral-800">
          {[1, 2, 3, 4, 5].map((star) => (
            <StarIcon
              key={star}
              className={`w-5 h-5 ${star <= Number(formData.rating) ? "text-amber-400" : "text-neutral-700"}`}
            />
          ))}
          <span className="text-sm font-bold text-white ml-2">{formData.rating}.0</span>
        </div>
      </div>

      {/* Edit Form Card */}
      <Card className="bg-neutral-950 border border-neutral-800 shadow-xl text-neutral-100 rounded-3xl">
        <CardHeader>
          <CardTitle className="text-base font-bold text-white">Edit Client Feedback &amp; Testimonial</CardTitle>
          <CardDescription className="text-xs text-neutral-400">
            Review and update reviewer details, rating, and public testimonial text.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
                  Client Full Name *
                </Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="bg-neutral-900 border-neutral-800 text-white text-xs h-10"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
                  Email Address
                </Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-neutral-900 border-neutral-800 text-white text-xs h-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
                  Role / Designation
                </Label>
                <Input
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder="e.g. Managing Director"
                  className="bg-neutral-900 border-neutral-800 text-white text-xs h-10"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
                  Company / Organization
                </Label>
                <Input
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="e.g. Adeyemi Logistics Ltd"
                  className="bg-neutral-900 border-neutral-800 text-white text-xs h-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
                  Service Utilized *
                </Label>
                <Select
                  value={formData.serviceUsed}
                  onValueChange={(val) => val && setFormData({ ...formData, serviceUsed: val })}
                >
                  <SelectTrigger className="w-full bg-neutral-900 border-neutral-800 text-white text-xs h-10">
                    <SelectValue placeholder="Select Service" />
                  </SelectTrigger>
                  <SelectContent className="bg-neutral-950 border-neutral-800 text-white">
                    <SelectItem value="Audit & Assurance">Audit &amp; Assurance</SelectItem>
                    <SelectItem value="Tax Advisory & Compliance">Tax Advisory &amp; Compliance</SelectItem>
                    <SelectItem value="Accounting & Financial Reporting">Accounting &amp; Financial Reporting</SelectItem>
                    <SelectItem value="ATS / ICAN Professional Training">ATS / ICAN Professional Training</SelectItem>
                    <SelectItem value="Business Advisory & Valuation">Business Advisory &amp; Valuation</SelectItem>
                    <SelectItem value="Corporate Secretarial Services">Corporate Secretarial Services</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
                  Rating (1 to 5 Stars) *
                </Label>
                <Select
                  value={formData.rating}
                  onValueChange={(val) => val && setFormData({ ...formData, rating: val })}
                >
                  <SelectTrigger className="w-full bg-neutral-900 border-neutral-800 text-white text-xs h-10">
                    <SelectValue placeholder="Rating" />
                  </SelectTrigger>
                  <SelectContent className="bg-neutral-950 border-neutral-800 text-white">
                    <SelectItem value="5">5 Stars (Exceptional)</SelectItem>
                    <SelectItem value="4">4 Stars (Very Good)</SelectItem>
                    <SelectItem value="3">3 Stars (Good)</SelectItem>
                    <SelectItem value="2">2 Stars (Fair)</SelectItem>
                    <SelectItem value="1">1 Star (Poor)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
                Headline / Testimonial Title *
              </Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="bg-neutral-900 border-neutral-800 text-white text-xs h-10"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
                Full Feedback &amp; Comment *
              </Label>
              <Textarea
                rows={5}
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                required
                className="bg-neutral-900 border-neutral-800 text-white text-xs resize-none"
              />
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-300">
                <input
                  type="checkbox"
                  checked={formData.recommend}
                  onChange={(e) => setFormData({ ...formData, recommend: e.target.checked })}
                  className="rounded border-neutral-800 bg-neutral-900 text-emerald-500 focus:ring-emerald-500/20"
                />
                <span>Client Recommends K-Deck</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-300">
                <input
                  type="checkbox"
                  checked={formData.isApproved}
                  onChange={(e) => setFormData({ ...formData, isApproved: e.target.checked })}
                  className="rounded border-neutral-800 bg-neutral-900 text-blue-500 focus:ring-blue-500/20"
                />
                <span>Approved for Public Website Display</span>
              </label>
            </div>

            <div className="pt-4 border-t border-neutral-800 flex items-center justify-end gap-3">
              <Link href="/admin/reviews">
                <Button variant="outline" type="button" className="border-neutral-800 text-neutral-300 hover:bg-neutral-900 text-xs h-10">
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={saving}
                className="bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs h-10 px-6 cursor-pointer"
              >
                {saving ? (
                  <>
                    <ArrowPathIcon className="w-4 h-4 animate-spin mr-2" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <span>Save Review Updates</span>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
