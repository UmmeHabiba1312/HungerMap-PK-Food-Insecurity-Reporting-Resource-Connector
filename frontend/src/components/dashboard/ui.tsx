"use client";

import React from "react";
import { Loader2Icon } from "lucide-react";
import type { CaseStatus, Urgency } from "@/lib/types";

// ---- Urgency badge --------------------------------------------------------

export function UrgencyBadge({ urgency }: { urgency?: Urgency | null }) {
  const cls =
    urgency === "High"
      ? "bg-emerald-600 text-white border-emerald-700"
      : urgency === "Medium"
      ? "bg-emerald-100 text-emerald-700 border-emerald-200"
      : urgency === "Low"
      ? "bg-emerald-50 text-emerald-600 border-emerald-200"
      : "bg-emerald-50 text-emerald-500/80 border-emerald-200";
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-semibold tracking-wide border ${cls}`}
    >
      {urgency || "Pending"}
    </span>
  );
}

// ---- Status badge ---------------------------------------------------------

const STATUS_LABEL: Record<CaseStatus, string> = {
  new: "New",
  triaged: "Triaged",
  referred: "Referred",
  closed: "Closed",
};

export function StatusBadge({ status }: { status: CaseStatus }) {
  const dot =
    status === "closed"
      ? "bg-slate-400"
      : status === "referred"
      ? "bg-teal-500"
      : status === "triaged"
      ? "bg-emerald-500"
      : "bg-emerald-300";
  return (
    <span className="inline-flex items-center gap-1.5 text-[9px] font-semibold uppercase text-emerald-600">
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {STATUS_LABEL[status] || status}
    </span>
  );
}

// ---- Spinner --------------------------------------------------------------

export function Spinner({ className = "w-4 h-4" }: { className?: string }) {
  return <Loader2Icon className={`${className} animate-spin text-emerald-600`} />;
}

export function LoadingBlock({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-16 text-emerald-600">
      <Spinner />
      <span className="text-xs font-medium">{label}</span>
    </div>
  );
}

// ---- Empty state ----------------------------------------------------------

export function EmptyState({
  icon: Icon,
  title,
  desc,
  action,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 mb-4">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-sm font-bold text-emerald-700">{title}</h3>
      {desc && <p className="text-xs text-emerald-500/80 mt-1 max-w-sm">{desc}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

// ---- Section card ---------------------------------------------------------

export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`p-6 rounded-2xl bg-white/80 backdrop-blur border border-emerald-100 shadow-sm ${className}`}
    >
      {children}
    </section>
  );
}

// ---- Toast ----------------------------------------------------------------

export type ToastKind = "success" | "error" | "info";
export interface Toast {
  id: number;
  kind: ToastKind;
  text: string;
}

export function ToastStack({
  toasts,
  onDismiss,
}: {
  toasts: Toast[];
  onDismiss: (id: number) => void;
}) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm">
      {toasts.map((t) => (
        <button
          key={t.id}
          onClick={() => onDismiss(t.id)}
          className={`text-left px-4 py-3 rounded-xl shadow-lg border text-xs font-medium backdrop-blur transition ${
            t.kind === "success"
              ? "bg-emerald-600 text-white border-emerald-700"
              : t.kind === "error"
              ? "bg-red-50 text-red-700 border-red-200"
              : "bg-white text-emerald-700 border-emerald-200"
          }`}
        >
          {t.text}
        </button>
      ))}
    </div>
  );
}
