"use client";

import React, { useState, useEffect } from "react";
import {
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  XMarkIcon,
  ArrowPathIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

export interface NotificationState {
  type: "success" | "error" | "warn";
  title?: string;
  message: string;
}

export function useAdminNotification() {
  const [notification, setNotification] = useState<NotificationState | null>(null);

  const showSuccess = (message: string, title?: string) => {
    setNotification({ type: "success", message, title: title || "Success" });
  };

  const showError = (message: string, title?: string) => {
    setNotification({ type: "error", message, title: title || "Error" });
  };

  const showWarn = (message: string, title?: string) => {
    setNotification({ type: "warn", message, title: title || "Warning" });
  };

  const clearNotification = () => setNotification(null);

  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => {
      setNotification(null);
    }, 4500);
    return () => clearTimeout(timer);
  }, [notification]);

  return {
    notification,
    showSuccess,
    showError,
    showWarn,
    clearNotification,
  };
}

export function NotificationBanner({
  notification,
  onClose,
}: {
  notification: NotificationState | null;
  onClose: () => void;
}) {
  if (!notification) return null;

  const styles = {
    success: {
      bg: "bg-emerald-950/90 border-emerald-800/90 text-emerald-100",
      icon: <CheckCircleIcon className="w-5 h-5 text-emerald-400 shrink-0" />,
      accent: "text-emerald-400",
    },
    error: {
      bg: "bg-rose-950/90 border-rose-800/90 text-rose-100",
      icon: <ExclamationCircleIcon className="w-5 h-5 text-rose-400 shrink-0" />,
      accent: "text-rose-400",
    },
    warn: {
      bg: "bg-amber-950/90 border-amber-800/90 text-amber-100",
      icon: <ExclamationTriangleIcon className="w-5 h-5 text-amber-400 shrink-0" />,
      accent: "text-amber-400",
    },
  }[notification.type];

  return (
    <div className="fixed top-5 right-5 z-50 max-w-md w-full animate-in fade-in slide-in-from-top-4 duration-300">
      <div
        className={`p-4 rounded-2xl border backdrop-blur-md shadow-2xl flex items-start gap-3.5 ${styles.bg}`}
      >
        <div className="mt-0.5">{styles.icon}</div>
        <div className="flex-1 min-w-0">
          {notification.title && (
            <h5 className={`text-xs font-bold uppercase tracking-wider ${styles.accent}`}>
              {notification.title}
            </h5>
          )}
          <p className="text-xs font-medium leading-relaxed mt-0.5 text-neutral-100">
            {notification.message}
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
        >
          <XMarkIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export interface ConfirmDeleteModalProps {
  isOpen: boolean;
  title?: string;
  description?: string;
  itemName?: string;
  confirmLabel?: string;
  isDeleting?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDeleteModal({
  isOpen,
  title = "Confirm Deletion",
  description = "Are you sure you want to delete this item? This action will permanently remove it from the database and cannot be undone.",
  itemName,
  confirmLabel = "Delete Record",
  isDeleting = false,
  onConfirm,
  onCancel,
}: ConfirmDeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl text-neutral-100 space-y-5 animate-in zoom-in-95 duration-200">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-rose-950/80 border border-rose-800/80 text-rose-400 flex items-center justify-center mx-auto shadow-inner">
            <TrashIcon className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight">{title}</h3>
          <p className="text-xs text-neutral-400 leading-relaxed">{description}</p>
        </div>

        {itemName && (
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-xs text-center text-neutral-300 font-medium">
            <span className="text-neutral-500 block text-[10px] uppercase tracking-wider mb-0.5">Target item:</span>
            <span className="text-white font-semibold line-clamp-2">{itemName}</span>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="flex-1 px-4 py-2.5 rounded-xl border border-neutral-800 text-neutral-300 hover:bg-neutral-900 hover:text-white text-xs font-semibold transition-colors cursor-pointer disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs shadow-md shadow-rose-600/30 transition-all cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {isDeleting ? (
              <>
                <ArrowPathIcon className="w-4 h-4 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <TrashIcon className="w-4 h-4" />
                <span>{confirmLabel}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
