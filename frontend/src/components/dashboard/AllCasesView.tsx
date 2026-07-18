"use client";

import React, { useMemo, useState } from "react";
import { SearchIcon, BriefcaseIcon, Trash2Icon, EyeIcon } from "lucide-react";
import { casesApi } from "@/lib/api";
import type { Case, CaseStatus, Urgency } from "@/lib/types";
import { UrgencyBadge, StatusBadge, EmptyState, LoadingBlock, Card, Spinner } from "./ui";

const STATUSES: (CaseStatus | "all")[] = [
  "all",
  "new",
  "triaged",
  "referred",
  "closed",
];
const URGENCIES: (Urgency | "all")[] = ["all", "High", "Medium", "Low"];

export default function AllCasesView({
  cases,
  loading,
  onOpen,
  onChanged,
  pushToast,
}: {
  cases: Case[];
  loading: boolean;
  onOpen: (id: number) => void;
  onChanged: () => void;
  pushToast: (kind: "success" | "error" | "info", text: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<CaseStatus | "all">("all");
  const [urgency, setUrgency] = useState<Urgency | "all">("all");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return cases.filter((c) => {
      if (status !== "all" && c.status !== status) return false;
      if (urgency !== "all" && c.urgency !== urgency) return false;
      if (!q) return true;
      return (
        c.case_code.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q) ||
        (c.area || "").toLowerCase().includes(q) ||
        (c.beneficiary_name || "").toLowerCase().includes(q) ||
        c.volunteer_name.toLowerCase().includes(q) ||
        c.situation_notes.toLowerCase().includes(q)
      );
    });
  }, [cases, query, status, urgency]);

  const handleDelete = async (id: number, code: string) => {
    if (!confirm(`Delete case ${code}? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      await casesApi.remove(id);
      pushToast("success", `Case ${code} deleted.`);
      onChanged();
    } catch (err) {
      pushToast("error", err instanceof Error ? err.message : "Delete failed.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Card className="space-y-5">
      <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:justify-between">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-5 rounded-full bg-gradient-to-b from-emerald-500 to-teal-600" />
          <h2 className="text-sm font-semibold text-emerald-700">
            All Cases ({filtered.length})
          </h2>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <SearchIcon className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-emerald-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search cases..."
              className="w-52 bg-emerald-50/40 border border-emerald-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-emerald-700 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30"
            />
          </div>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as CaseStatus | "all")}
            className="bg-emerald-50/40 border border-emerald-200 rounded-lg px-2.5 py-1.5 text-xs text-emerald-700 focus:outline-none focus:border-emerald-400 capitalize"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s === "all" ? "All statuses" : s}
              </option>
            ))}
          </select>
          <select
            value={urgency}
            onChange={(e) => setUrgency(e.target.value as Urgency | "all")}
            className="bg-emerald-50/40 border border-emerald-200 rounded-lg px-2.5 py-1.5 text-xs text-emerald-700 focus:outline-none focus:border-emerald-400"
          >
            {URGENCIES.map((u) => (
              <option key={u} value={u}>
                {u === "all" ? "All urgency" : u}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <LoadingBlock label="Loading cases..." />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={BriefcaseIcon}
          title="No matching cases"
          desc="Try adjusting your search or filters."
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-emerald-100 text-[10px] tracking-wider text-emerald-500/80 uppercase">
                <th className="py-3 px-2 font-medium">Case Code</th>
                <th className="py-3 px-2 font-medium">Beneficiary</th>
                <th className="py-3 px-2 font-medium">Reporter</th>
                <th className="py-3 px-2 font-medium">City / Area</th>
                <th className="py-3 px-2 font-medium">Urgency</th>
                <th className="py-3 px-2 font-medium">Status</th>
                <th className="py-3 px-2 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-50">
              {filtered.map((row) => (
                <tr key={row.id} className="text-xs hover:bg-emerald-50/70 transition">
                  <td className="py-3.5 px-2 font-mono text-emerald-600 font-semibold">
                    {row.case_code}
                  </td>
                  <td className="py-3.5 px-2 font-semibold text-emerald-700">
                    {row.beneficiary_name || "Anonymous"}
                  </td>
                  <td className="py-3.5 px-2 text-emerald-600">
                    {row.volunteer_name}
                  </td>
                  <td className="py-3.5 px-2 text-emerald-600">
                    {row.city} {row.area ? `(${row.area})` : ""}
                  </td>
                  <td className="py-3.5 px-2">
                    <UrgencyBadge urgency={row.urgency} />
                  </td>
                  <td className="py-3.5 px-2">
                    <StatusBadge status={row.status} />
                  </td>
                  <td className="py-3.5 px-2">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onOpen(row.id)}
                        className="p-1.5 rounded-lg bg-white border border-emerald-200 text-emerald-600 hover:bg-emerald-50 transition"
                        title="Open in workspace"
                      >
                        <EyeIcon className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(row.id, row.case_code)}
                        disabled={deletingId === row.id}
                        className="p-1.5 rounded-lg bg-white border border-red-200 text-red-500 hover:bg-red-50 transition disabled:opacity-50"
                        title="Delete case"
                      >
                        {deletingId === row.id ? (
                          <Spinner className="w-3.5 h-3.5" />
                        ) : (
                          <Trash2Icon className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
