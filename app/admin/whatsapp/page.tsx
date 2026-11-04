"use client";

import React, { useState, useEffect } from "react";
import {
  ChatBubbleLeftRightIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon,
  ArrowTopRightOnSquareIcon,
  CheckCircleIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import {
  ConfirmDeleteModal,
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

interface WhatsAppGroup {
  id: string;
  name: string;
  atsLevel: string;
  inviteUrl: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
}

export default function AdminWhatsAppConfigPage() {
  const [groups, setGroups] = useState<WhatsAppGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Deletion Confirmation Modal State
  const [deleteTarget, setDeleteTarget] = useState<WhatsAppGroup | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Admin Notification Banner
  const { notification, showSuccess, showError, showWarn, clearNotification } =
    useAdminNotification();

  const [formData, setFormData] = useState({
    name: "",
    atsLevel: "ATS 1",
    inviteUrl: "",
    description: "",
  });

  const fetchGroups = async (isManualRefresh = false) => {
    try {
      const res = await fetch("/api/whatsapp");
      if (res.ok) {
        const data = await res.json();
        setGroups(data);
        if (isManualRefresh) {
          showSuccess("WhatsApp group configurations refreshed successfully.");
        }
      }
    } catch (err) {
      console.error("Error fetching WhatsApp groups:", err);
      showError("Unable to load WhatsApp group configurations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.atsLevel || !formData.inviteUrl) {
      setErrorMessage("Please complete all required fields.");
      showError("Please complete all required fields.");
      return;
    }

    setSubmitting(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to add WhatsApp group");
      }

      const savedName = formData.name;
      setModalOpen(false);
      setFormData({
        name: "",
        atsLevel: "ATS 1",
        inviteUrl: "",
        description: "",
      });
      fetchGroups();
      showSuccess(`WhatsApp group "${savedName}" configured successfully.`);
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMessage(error.message || "Failed to create group configuration");
      showError(error.message || "Failed to create group configuration");
    } finally {
      setSubmitting(false);
    }
  };

  const triggerDeleteConfirm = (group: WhatsAppGroup) => {
    setDeleteTarget(group);
  };

  const confirmDeleteGroup = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/whatsapp/${deleteTarget.id}`, { method: "DELETE" });
      if (res.ok) {
        setGroups(groups.filter((g) => g.id !== deleteTarget.id));
        showWarn(`WhatsApp group "${deleteTarget.name}" deleted.`);
        setDeleteTarget(null);
      } else {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete WhatsApp group");
      }
    } catch (err: unknown) {
      const error = err as Error;
      showError(error.message || "Failed to delete WhatsApp group");
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
        title="Confirm WhatsApp Group Deletion"
        description="Are you sure you want to delete this WhatsApp cohort link? Trainees enrolling for this ATS level will no longer be redirected to this group."
        itemName={deleteTarget ? `${deleteTarget.name} (${deleteTarget.atsLevel})` : undefined}
        confirmLabel="Yes, Delete Group"
        isDeleting={isDeleting}
        onConfirm={confirmDeleteGroup}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Community &amp; Cohort Routing
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            WhatsApp Group Configurations
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Map WhatsApp study group invite URLs to ATS stages. When candidates enroll on the training page, the modal automatically displays the corresponding links!
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => {
              setLoading(true);
              fetchGroups(true);
            }}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-200 hover:bg-neutral-800 hover:text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer disabled:opacity-60"
            title="Refresh WhatsApp groups"
          >
            <ArrowPathIcon className={`w-3.5 h-3.5 text-neutral-400 ${loading ? "animate-spin text-emerald-400" : ""}`} />
            <span>{loading ? "Refreshing..." : "Refresh"}</span>
          </button>

          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 bg-emerald-600 text-white px-5 py-3 rounded-xl font-semibold text-xs shadow-md shadow-emerald-600/30 hover:bg-emerald-500 transition-colors cursor-pointer"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Add WhatsApp Group</span>
          </button>
        </div>
      </div>

      {/* Group Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group) => (
          <div
            key={group.id}
            className="bg-neutral-950 rounded-3xl p-6 border border-neutral-800/90 shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-4">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-950/70 text-purple-300 border border-purple-800/60">
                  Target: {group.atsLevel}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-950/70 text-emerald-300 border border-emerald-800/60 text-[10px] font-bold">
                  <CheckCircleIcon className="w-3.5 h-3.5 text-emerald-400" />
                  Active
                </span>
              </div>

              <h3 className="font-bold text-base text-white mb-2 leading-snug">
                {group.name}
              </h3>

              {group.description && (
                <p className="text-xs text-neutral-300 mb-4 line-clamp-2">
                  {group.description}
                </p>
              )}

              <div className="bg-neutral-900 p-3 rounded-xl border border-neutral-800 text-[11px] text-neutral-400 mb-4 font-mono truncate">
                {group.inviteUrl}
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-800 flex items-center justify-between">
              <a
                href={group.inviteUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                <span>Test Link</span>
                <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={() => triggerDeleteConfirm(group)}
                className="text-xs font-semibold text-rose-400 hover:text-rose-300 p-1.5 rounded-lg hover:bg-rose-950/30 transition-colors flex items-center gap-1 cursor-pointer"
                title="Delete Group Link"
              >
                <TrashIcon className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {groups.length === 0 && !loading && (
        <div className="bg-neutral-950 rounded-3xl p-12 text-center border border-neutral-800 shadow-xl">
          <ChatBubbleLeftRightIcon className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-white">No WhatsApp Groups Configured</h3>
          <p className="text-xs text-neutral-400 mt-1 max-w-sm mx-auto">
            Click &quot;Add WhatsApp Group&quot; above to create invite links for ATS 1, ATS 2, and ATS 3 candidates.
          </p>
        </div>
      )}

      {/* ADD GROUP MODAL */}
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
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Cohort Routing Configuration
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-0.5">
                Add WhatsApp Group
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                Trainees who select this ATS stage in the registration form will receive this join link.
              </p>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-800/70 text-rose-300 text-xs">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleCreateGroup} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Group Name / Title *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. K-Deck ATS 1 Intensive Study Group"
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-800 bg-neutral-900 text-white text-xs outline-hidden focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Target ATS Training Stage *
                </label>
                <Select
                  value={formData.atsLevel}
                  onValueChange={(val) => val && setFormData({ ...formData, atsLevel: val })}
                >
                  <SelectTrigger className="w-full h-10 bg-neutral-900 border-neutral-800 text-white text-xs">
                    <SelectValue placeholder="Select ATS Level" />
                  </SelectTrigger>
                  <SelectContent className="bg-neutral-950 border-neutral-800 text-white">
                    <SelectItem value="ATS 1">ATS 1 (Foundation / Basic)</SelectItem>
                    <SelectItem value="ATS 2">ATS 2 (Intermediate)</SelectItem>
                    <SelectItem value="ATS 3">ATS 3 (Final Stage / Revision)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Official WhatsApp Invite Link *
                </label>
                <input
                  type="url"
                  name="inviteUrl"
                  value={formData.inviteUrl}
                  onChange={handleChange}
                  required
                  placeholder="https://chat.whatsapp.com/..."
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-800 bg-neutral-900 text-white text-xs outline-hidden focus:border-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Brief Description or Instructions
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-800 bg-neutral-900 text-white text-xs outline-hidden focus:border-emerald-500 resize-none"
                  placeholder="e.g. Daily lectures, revision question bank, and tutor Q&A."
                ></textarea>
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
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-500 shadow-md shadow-emerald-600/30 cursor-pointer disabled:opacity-60 transition-all"
                >
                  {submitting ? "Saving Link..." : "Save WhatsApp Config"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
