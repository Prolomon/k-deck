"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  UserGroupIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon,
  EnvelopeIcon,
  PhoneIcon,
  CheckBadgeIcon,
  PhotoIcon,
  CheckCircleIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
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

interface StaffItem {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string | null;
  phone: string | null;
  bio: string | null;
  image: string | null;
  order: number;
}

export default function AdminStaffPage() {
  const [staff, setStaff] = useState<StaffItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [imageBytesInfo, setImageBytesInfo] = useState<{
    name: string;
    bytes: number;
  } | null>(null);

  // Deletion Confirmation Modal State
  const [deleteTarget, setDeleteTarget] = useState<StaffItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Notification Banner
  const { notification, showSuccess, showError, showWarn, clearNotification } =
    useAdminNotification();

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    department: "Audit & Assurance",
    email: "",
    phone: "",
    bio: "",
    image: "/images/showcase.jpeg",
    order: "1",
  });

  const fetchStaff = async (isManualRefresh = false) => {
    try {
      const res = await fetch("/api/staff");
      if (res.ok) {
        const data = await res.json();
        setStaff(data);
        if (isManualRefresh) {
          showSuccess("Staff directory refreshed successfully.");
        }
      }
    } catch (err) {
      console.error("Error fetching staff:", err);
      showError("Unable to fetch staff directory.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result as string;
      setFormData((prev) => ({ ...prev, image: base64String }));
      setImageBytesInfo({
        name: file.name,
        bytes: file.size,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.role || !formData.department) {
      setErrorMessage("Please complete all required fields.");
      return;
    }

    setSubmitting(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          order: Number(formData.order || 0),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to add staff member");
      }

      const staffName = formData.name;
      setModalOpen(false);
      setImageBytesInfo(null);
      setFormData({
        name: "",
        role: "",
        department: "Audit & Assurance",
        email: "",
        phone: "",
        bio: "",
        image: "/images/showcase.jpeg",
        order: "1",
      });
      fetchStaff();
      showSuccess(`Staff profile for "${staffName}" added successfully.`);
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMessage(error.message || "Failed to add staff");
      showError(error.message || "Failed to add staff");
    } finally {
      setSubmitting(false);
    }
  };

  const triggerDeleteConfirm = (member: StaffItem) => {
    setDeleteTarget(member);
  };

  const confirmDeleteStaff = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/staff/${deleteTarget.id}`, { method: "DELETE" });
      if (res.ok) {
        setStaff(staff.filter((s) => s.id !== deleteTarget.id));
        showWarn(`Staff profile "${deleteTarget.name}" removed from directory.`);
        setDeleteTarget(null);
      } else {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete staff");
      }
    } catch (err: unknown) {
      const error = err as Error;
      showError(error.message || "Failed to delete staff");
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
        title="Confirm Staff Profile Removal"
        description="Are you sure you want to remove this staff profile? The member will no longer appear in the official corporate directory."
        itemName={deleteTarget ? `${deleteTarget.name} - ${deleteTarget.role} (${deleteTarget.department})` : undefined}
        confirmLabel="Yes, Remove Profile"
        isDeleting={isDeleting}
        onConfirm={confirmDeleteStaff}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
            Human Resources
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Staff &amp; Leadership Management
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Manage your firm&apos;s chartered accountants, audit leaders, and
            specialists shown on the public Staff directory.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => {
              setLoading(true);
              fetchStaff(true);
            }}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-200 hover:bg-neutral-800 hover:text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer disabled:opacity-60"
            title="Refresh staff directory"
          >
            <ArrowPathIcon className={`w-3.5 h-3.5 text-neutral-400 ${loading ? "animate-spin text-blue-400" : ""}`} />
            <span>{loading ? "Refreshing..." : "Refresh"}</span>
          </button>

          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold text-xs shadow-md shadow-blue-600/30 hover:bg-blue-500 transition-colors cursor-pointer"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Add New Staff</span>
          </button>
        </div>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staff.map((member) => (
          <div
            key={member.id}
            className="bg-neutral-950 rounded-3xl p-6 border border-neutral-800/90 shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start gap-4 mb-4">
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-neutral-900 shrink-0 border border-neutral-800 shadow-xs">
                  <Image
                    src={member.image || "/images/showcase.jpeg"}
                    alt={member.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-950/70 text-blue-300 border border-blue-800/60">
                    {member.department}
                  </span>
                  <h3 className="font-bold text-base text-white mt-1 leading-snug">
                    <Link
                      href={`/admin/staff/${member.id}`}
                      className="hover:text-blue-400 transition-colors"
                      title="View and edit staff profile"
                    >
                      {member.name}
                    </Link>
                  </h3>
                  <p className="text-xs font-semibold text-blue-400">
                    {member.role}
                  </p>
                </div>
              </div>

              {member.bio && (
                <p className="text-xs text-neutral-300 leading-relaxed mb-4 line-clamp-3">
                  {member.bio}
                </p>
              )}

              <div className="space-y-1.5 text-xs text-neutral-400 pt-2 border-t border-neutral-800/70">
                {member.email && (
                  <div className="flex items-center gap-2 truncate">
                    <EnvelopeIcon className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                    <span className="truncate font-mono">{member.email}</span>
                  </div>
                )}
                {member.phone && (
                  <div className="flex items-center gap-2">
                    <PhoneIcon className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                    <span>{member.phone}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-neutral-800/70 flex items-center justify-between">
              <span className="text-[11px] text-neutral-500 font-mono">
                Order: #{member.order}
              </span>
              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/staff/${member.id}`}
                  className="px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-blue-400 hover:text-blue-300 hover:bg-neutral-800 text-xs font-semibold transition-colors"
                >
                  Edit
                </Link>
                <button
                  onClick={() => triggerDeleteConfirm(member)}
                  className="text-xs font-semibold text-rose-400 hover:text-rose-300 p-1.5 rounded-lg hover:bg-rose-950/30 transition-colors flex items-center gap-1 cursor-pointer"
                  title="Remove Profile"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ADD STAFF MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-neutral-950 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-neutral-800 my-8 text-neutral-100">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors cursor-pointer"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                HR Portal
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-0.5">
                Add Staff Profile
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                This profile will appear on the public Staff directory.
              </p>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-800/70 text-red-300 text-xs">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleCreateStaff} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                  Full Name &amp; Qualifications *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-white text-sm outline-hidden placeholder-neutral-500"
                  placeholder="e.g. Babatunde Alabi, FCA, ACTI"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                    Job Title / Role *
                  </label>
                  <input
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-white text-sm outline-hidden placeholder-neutral-500"
                    placeholder="e.g. Lead Tax Consultant"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                    Department *
                  </label>
                  <Select
                    value={formData.department}
                    onValueChange={(val) => val && setFormData({ ...formData, department: val })}
                  >
                    <SelectTrigger className="w-full h-10 bg-neutral-900 border-neutral-800 text-white text-xs">
                      <SelectValue placeholder="Department" />
                    </SelectTrigger>
                    <SelectContent className="bg-neutral-950 border-neutral-800 text-white">
                      <SelectItem value="Audit & Assurance">Audit &amp; Assurance</SelectItem>
                      <SelectItem value="Tax Services">Tax Services</SelectItem>
                      <SelectItem value="Financial Reporting">Financial Reporting</SelectItem>
                      <SelectItem value="Business Consultancy">Business Consultancy</SelectItem>
                      <SelectItem value="ATS Training Department">ATS Training Department</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-white text-sm outline-hidden placeholder-neutral-500"
                    placeholder="staff@kdeckprofessionalservices.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                    Telephone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-white text-sm outline-hidden placeholder-neutral-500"
                    placeholder="0907 057 3104"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                  Professional Bio &amp; Experience
                </label>
                <textarea
                  name="bio"
                  rows={3}
                  value={formData.bio}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-white text-sm outline-hidden placeholder-neutral-500"
                  placeholder="Summary of professional background, specialized industry knowledge, and certifications..."
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                  Staff Headshot / Photo (Converted to Binary Bytes in Database)
                </label>
                <div className="flex items-center gap-3">
                  <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-neutral-200 font-semibold text-xs shadow-xs hover:bg-neutral-700 cursor-pointer transition-colors">
                    <PhotoIcon className="w-4 h-4 text-blue-400" />
                    <span>Upload Photo File</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden"
                    />
                  </label>
                  {imageBytesInfo ? (
                    <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                      <CheckCircleIcon className="w-4 h-4 text-emerald-400" />
                      {imageBytesInfo.name} ({(imageBytesInfo.bytes / 1024).toFixed(1)} KB converted to bytes)
                    </span>
                  ) : (
                    <span className="text-[11px] text-neutral-500">or choose from library below:</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                    Preset Photo Asset
                  </label>
                  <Select
                    value={formData.image.startsWith("data:") ? "custom" : formData.image}
                    onValueChange={(val) => {
                      if (val && val !== "custom") {
                        setFormData({ ...formData, image: val });
                      }
                    }}
                  >
                    <SelectTrigger className="w-full h-10 bg-neutral-900 border-neutral-800 text-white text-xs">
                      <SelectValue placeholder="Photo Asset" />
                    </SelectTrigger>
                    <SelectContent className="bg-neutral-950 border-neutral-800 text-white">
                      {formData.image.startsWith("data:") && (
                        <SelectItem value="custom">Custom Uploaded Photo (Bytes)</SelectItem>
                      )}
                      <SelectItem value="/images/showcase.jpeg">Showcase Portrait</SelectItem>
                      <SelectItem value="/images/meeting.jpeg">Meeting Specialist</SelectItem>
                      <SelectItem value="/images/service.jpeg">Executive Desk</SelectItem>
                      <SelectItem value="/images/k-deck.png">K-Deck Emblem</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                    Display Order Index
                  </label>
                  <input
                    type="number"
                    name="order"
                    value={formData.order}
                    onChange={handleChange}
                    min="1"
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-white text-sm outline-hidden"
                  />
                </div>
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
                  {submitting ? "Saving..." : "Add Staff Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
