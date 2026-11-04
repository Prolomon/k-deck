"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  UserGroupIcon,
  TrashIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  EnvelopeIcon,
  PhoneIcon,
  CheckBadgeIcon,
  PhotoIcon,
  BriefcaseIcon,
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

export default function StaffDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [staff, setStaff] = useState<StaffItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Form State
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

  const [imageBytesInfo, setImageBytesInfo] = useState<{
    name: string;
    bytes: number;
  } | null>(null);

  const { notification, showSuccess, showError, showWarn, clearNotification } =
    useAdminNotification();

  const fetchStaff = async () => {
    try {
      const res = await fetch(`/api/staff/${id}`);
      if (!res.ok) throw new Error("Staff member not found");
      const data: StaffItem = await res.json();
      setStaff(data);
      setFormData({
        name: data.name,
        role: data.role,
        department: data.department,
        email: data.email || "",
        phone: data.phone || "",
        bio: data.bio || "",
        image: data.image || "/images/showcase.jpeg",
        order: String(data.order || 1),
      });
    } catch (err) {
      console.error(err);
      showError("Unable to load staff profile details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, [id]);

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
      showSuccess(`Photo "${file.name}" converted and ready to save.`);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(`/api/staff/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          order: Number(formData.order || 0),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update staff member");
      }

      const updated = await res.json();
      setStaff(updated.staff);
      showSuccess(`Staff profile for "${formData.name}" updated successfully.`);
    } catch (err: unknown) {
      const error = err as Error;
      showError(error.message || "Failed to save staff profile");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/staff/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete staff member");
      showWarn(`Staff profile for "${staff?.name}" removed from directory.`);
      setTimeout(() => {
        router.push("/admin/staff");
      }, 1000);
    } catch (err: unknown) {
      const error = err as Error;
      showError(error.message || "Failed to delete staff member");
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-neutral-400 flex items-center justify-center gap-2 text-sm">
        <ArrowPathIcon className="w-5 h-5 animate-spin text-blue-400" />
        <span>Loading staff profile...</span>
      </div>
    );
  }

  if (!staff) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Staff Profile Not Found</h2>
        <p className="text-neutral-400 text-xs">The requested staff member does not exist or was removed.</p>
        <Link href="/admin/staff" className="text-xs text-blue-400 underline">
          &larr; Back to Staff Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <NotificationBanner notification={notification} onClose={clearNotification} />

      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        title="Remove Staff Profile"
        description="Are you sure you want to permanently delete this staff profile? They will no longer appear on your firm directory."
        itemName={`${staff.name} - ${staff.role} (${staff.department})`}
        confirmLabel="Yes, Remove Staff Profile"
        isDeleting={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />

      {/* Top Bar */}
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/admin/staff"
          className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          <span>Back to All Staff</span>
        </Link>

        <Button
          variant="destructive"
          size="sm"
          onClick={() => setShowDeleteModal(true)}
          className="bg-rose-950/70 border border-rose-800/80 text-rose-300 hover:bg-rose-900 cursor-pointer"
        >
          <TrashIcon className="w-4 h-4 mr-1.5" />
          <span>Remove Staff Profile</span>
        </Button>
      </div>

      {/* Header Info */}
      <div className="bg-neutral-950 p-6 sm:p-8 rounded-3xl border border-neutral-800/90 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-neutral-800 shrink-0 bg-neutral-900">
            <Image
              src={formData.image || "/images/showcase.jpeg"}
              alt={staff.name}
              fill
              sizes="64px"
              className="object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white">{staff.name}</h1>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-950/70 text-blue-300 border border-blue-800/60">
                {formData.department}
              </span>
            </div>
            <p className="text-xs text-blue-400 font-semibold mt-0.5">{formData.role}</p>
          </div>
        </div>

        <div className="text-right text-xs text-neutral-400 space-y-1">
          {formData.email && <div className="font-mono">{formData.email}</div>}
          {formData.phone && <div>{formData.phone}</div>}
        </div>
      </div>

      {/* Edit Form Card */}
      <Card className="bg-neutral-950 border border-neutral-800 shadow-xl text-neutral-100 rounded-3xl">
        <CardHeader>
          <CardTitle className="text-base font-bold text-white">Edit Staff Profile Data</CardTitle>
          <CardDescription className="text-xs text-neutral-400">
            Update executive credentials, designation, contact info, bio, and portrait.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
                  Full Name &amp; Credentials *
                </Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="e.g. Babatunde Adeyemi, FCA, ACTI"
                  className="bg-neutral-900 border-neutral-800 text-white text-xs h-10"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
                  Designation / Role Title *
                </Label>
                <Input
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  required
                  placeholder="e.g. Senior Partner, Tax Services"
                  className="bg-neutral-900 border-neutral-800 text-white text-xs h-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
                  Corporate Department *
                </Label>
                <Select
                  value={formData.department}
                  onValueChange={(val) => val && setFormData({ ...formData, department: val })}
                >
                  <SelectTrigger className="w-full bg-neutral-900 border-neutral-800 text-white text-xs h-10">
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent className="bg-neutral-950 border-neutral-800 text-white">
                    <SelectItem value="Executive Management">Executive Management</SelectItem>
                    <SelectItem value="Audit & Assurance">Audit &amp; Assurance</SelectItem>
                    <SelectItem value="Tax Advisory & Compliance">Tax Advisory &amp; Compliance</SelectItem>
                    <SelectItem value="Accounting Services">Accounting Services</SelectItem>
                    <SelectItem value="ATS Coaching Academy">ATS Coaching Academy</SelectItem>
                    <SelectItem value="IT Systems Directorate">IT Systems Directorate</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
                  Display Order Priority
                </Label>
                <Select
                  value={formData.order}
                  onValueChange={(val) => val && setFormData({ ...formData, order: val })}
                >
                  <SelectTrigger className="w-full bg-neutral-900 border-neutral-800 text-white text-xs h-10">
                    <SelectValue placeholder="Order Priority" />
                  </SelectTrigger>
                  <SelectContent className="bg-neutral-950 border-neutral-800 text-white">
                    <SelectItem value="1">1 (Principal Partner / Top)</SelectItem>
                    <SelectItem value="2">2 (Partner / Director)</SelectItem>
                    <SelectItem value="3">3 (Senior Manager)</SelectItem>
                    <SelectItem value="4">4 (Manager / Lead Consultant)</SelectItem>
                    <SelectItem value="5">5 (Associate / Specialist)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
                  Official Email Address
                </Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@kdeckprofessionalservices.com.ng"
                  className="bg-neutral-900 border-neutral-800 text-white text-xs h-10"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
                  Official Phone Contact
                </Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+234 ..."
                  className="bg-neutral-900 border-neutral-800 text-white text-xs h-10"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
                Professional Bio &amp; Qualifications
              </Label>
              <Textarea
                rows={4}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Highlight years of experience, professional memberships (ICAN, CITN), industry expertise..."
                className="bg-neutral-900 border-neutral-800 text-white text-xs resize-none"
              />
            </div>

            {/* Photo Upload */}
            <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-3">
              <Label className="text-xs font-semibold uppercase tracking-wider text-neutral-300 block">
                Profile Portrait Photo
              </Label>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleImageFileChange}
                  className="text-xs text-neutral-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-950/80 file:text-blue-300 hover:file:bg-blue-900/80 file:cursor-pointer cursor-pointer"
                />
                {imageBytesInfo && (
                  <span className="text-[11px] text-emerald-400 font-mono font-medium">
                    ✓ {imageBytesInfo.name} ({Math.round(imageBytesInfo.bytes / 1024)} KB)
                  </span>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-800 flex items-center justify-end gap-3">
              <Link href="/admin/staff">
                <Button variant="outline" type="button" className="border-neutral-800 text-neutral-300 hover:bg-neutral-900 text-xs h-10">
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs h-10 px-6 cursor-pointer"
              >
                {saving ? (
                  <>
                    <ArrowPathIcon className="w-4 h-4 animate-spin mr-2" />
                    <span>Saving Profile...</span>
                  </>
                ) : (
                  <span>Save Staff Updates</span>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
