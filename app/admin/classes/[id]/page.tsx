"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AcademicCapIcon,
  TrashIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  BookOpenIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";
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
  ConfirmDeleteModal,
  NotificationBanner,
  useAdminNotification,
} from "@/components/admin/admin-feedback";

interface AtsRegistration {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  subjectTaken: string;
  atsLevels: string[];
  notes: string | null;
  createdAt: string;
}

export default function AtsStudentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [student, setStudent] = useState<AtsRegistration | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    subjectTaken: "",
    atsLevels: [] as string[],
    notes: "",
  });

  const { notification, showSuccess, showError, showWarn, clearNotification } =
    useAdminNotification();

  const fetchStudent = async () => {
    try {
      const res = await fetch(`/api/classes/${id}`);
      if (!res.ok) throw new Error("Student registration not found");
      const data: AtsRegistration = await res.json();
      setStudent(data);
      setFormData({
        name: data.name,
        address: data.address,
        phone: data.phone,
        email: data.email,
        subjectTaken: data.subjectTaken,
        atsLevels: data.atsLevels || [],
        notes: data.notes || "",
      });
    } catch (err) {
      console.error(err);
      showError("Unable to load student registration details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudent();
  }, [id]);

  const toggleLevel = (lvl: string) => {
    if (formData.atsLevels.includes(lvl)) {
      if (formData.atsLevels.length === 1) return; // keep at least 1
      setFormData({
        ...formData,
        atsLevels: formData.atsLevels.filter((l) => l !== lvl),
      });
    } else {
      setFormData({
        ...formData,
        atsLevels: [...formData.atsLevels, lvl],
      });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(`/api/classes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update registration");
      }

      const updated = await res.json();
      setStudent(updated.registration);
      showSuccess(`Student profile for "${formData.name}" updated successfully.`);
    } catch (err: unknown) {
      const error = err as Error;
      showError(error.message || "Failed to save student data");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/classes/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete registration");
      showWarn(`ATS candidate "${student?.name}" removed from records.`);
      setTimeout(() => {
        router.push("/admin/classes");
      }, 1000);
    } catch (err: unknown) {
      const error = err as Error;
      showError(error.message || "Failed to delete student");
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-neutral-400 flex items-center justify-center gap-2 text-sm">
        <ArrowPathIcon className="w-5 h-5 animate-spin text-purple-400" />
        <span>Loading ATS student registration...</span>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Student Registration Not Found</h2>
        <p className="text-neutral-400 text-xs">The requested student record does not exist or was removed.</p>
        <Link href="/admin/classes" className="text-xs text-purple-400 underline">
          &larr; Back to ATS Class Roster
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <NotificationBanner notification={notification} onClose={clearNotification} />

      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        title="Delete ATS Student Record"
        description="Are you sure you want to permanently delete this student registration? This will remove them from the ATS training roster."
        itemName={`${student.name} (${student.phone})`}
        confirmLabel="Yes, Delete Student"
        isDeleting={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />

      {/* Top Bar */}
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/admin/classes"
          className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          <span>Back to ATS Class Roster</span>
        </Link>

        <Button
          variant="destructive"
          size="sm"
          onClick={() => setShowDeleteModal(true)}
          className="bg-rose-950/70 border border-rose-800/80 text-rose-300 hover:bg-rose-900 cursor-pointer"
        >
          <TrashIcon className="w-4 h-4 mr-1.5" />
          <span>Delete Student</span>
        </Button>
      </div>

      {/* Header Info */}
      <div className="bg-neutral-950 p-6 sm:p-8 rounded-3xl border border-neutral-800/90 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-950/80 border border-purple-800/80 text-purple-300 flex items-center justify-center text-xl font-black shrink-0">
            {student.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white">{student.name}</h1>
              <span className="text-xs font-mono text-neutral-500">#{student.id.slice(-6)}</span>
            </div>
            <p className="text-xs text-neutral-400 mt-1 flex items-center gap-3">
              <span>{student.email}</span>
              <span>&bull;</span>
              <span>{student.phone}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {formData.atsLevels.map((lvl) => (
            <span
              key={lvl}
              className="px-3 py-1 rounded-xl bg-purple-950 text-purple-300 border border-purple-800 font-bold text-xs"
            >
              {lvl}
            </span>
          ))}
        </div>
      </div>

      {/* Edit Card */}
      <Card className="bg-neutral-950 border border-neutral-800 shadow-xl text-neutral-100 rounded-3xl">
        <CardHeader>
          <CardTitle className="text-base font-bold text-white">Edit ATS Student Registration</CardTitle>
          <CardDescription className="text-xs text-neutral-400">
            Update personal contact information, enrolled subjects, and target ATS coaching stages.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
                  Full Student Name *
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
                  Phone Number *
                </Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  className="bg-neutral-900 border-neutral-800 text-white text-xs h-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
                  Email Address *
                </Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="bg-neutral-900 border-neutral-800 text-white text-xs h-10"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
                  Residential / Work Address *
                </Label>
                <Input
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                  className="bg-neutral-900 border-neutral-800 text-white text-xs h-10"
                />
              </div>
            </div>

            {/* Target ATS Stages Selection */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
                Enrolled ATS Coaching Stages (Select Multiple) *
              </Label>
              <div className="flex flex-wrap gap-3">
                {["ATS 1", "ATS 2", "ATS 3", "Foundation"].map((stage) => {
                  const isSelected = formData.atsLevels.includes(stage);
                  return (
                    <button
                      key={stage}
                      type="button"
                      onClick={() => toggleLevel(stage)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        isSelected
                          ? "bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-600/30"
                          : "bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white hover:bg-neutral-850"
                      }`}
                    >
                      {stage} {isSelected && "✓"}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Subjects Taken */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
                Subjects / Papers Taken *
              </Label>
              <Input
                value={formData.subjectTaken}
                onChange={(e) => setFormData({ ...formData, subjectTaken: e.target.value })}
                required
                placeholder="e.g. Basic Accounting Processes, Business Law, Quantitative Analysis"
                className="bg-neutral-900 border-neutral-800 text-white text-xs h-10"
              />
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
                Administrative Notes / Special Requirements
              </Label>
              <Textarea
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="e.g. Needs weekend-only lectures, requests hardcopy study packs..."
                className="bg-neutral-900 border-neutral-800 text-white text-xs resize-none"
              />
            </div>

            <div className="pt-4 border-t border-neutral-800 flex items-center justify-between">
              <span className="text-[11px] text-neutral-500 font-mono">
                Registered: {new Date(student.createdAt).toLocaleDateString([], { dateStyle: "long" })}
              </span>

              <div className="flex items-center gap-3">
                <Link href="/admin/classes">
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
                      <span>Saving Student Data...</span>
                    </>
                  ) : (
                    <span>Save Student Updates</span>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
