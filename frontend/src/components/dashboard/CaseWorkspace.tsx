"use client";

import React, { useEffect, useState } from "react";
import {
  CalendarIcon,
  MapPinIcon,
  FileSignatureIcon,
  ClipboardCopyIcon,
  UsersIcon,
  PhoneIcon,
  UserIcon,
  ChevronRightIcon,
  AlertTriangleIcon,
} from "lucide-react";
import { casesApi, orgsApi } from "@/lib/api";
import type { Case, CaseStatus, Referral, Organisation } from "@/lib/types";
import {
  UrgencyBadge,
  StatusBadge,
  Spinner,
  LoadingBlock,
  EmptyState,
  Card,
} from "./ui";

const NEXT_STATUS: Partial<Record<CaseStatus, CaseStatus>> = {
  triaged: "referred",
  referred: "closed",
};

export default function CaseWorkspace({
  cases,
  loading,
  selectedId,
  onSelect,
  onChanged,
  pushToast,
}: {
  cases: Case[];
  loading: boolean;
  selectedId: number | null;
  onSelect: (id: number) => void;
  onChanged: () => void;
  pushToast: (kind: "success" | "error" | "info", text: string) => void;
}) {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [orgs, setOrgs] = useState<Record<number, Organisation>>({});
  const [triaging, setTriaging] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const active = cases.find((c) => c.id === selectedId) || null;

  useEffect(() => {
    if (!active) {
      setReferrals([]);
      return;
    }
    let cancelled = false;
    setLoadingDetail(true);
    (async () => {
      try {
        const refs = await casesApi.referrals(active.id);
        if (cancelled) return;
        setReferrals(refs);
        // Resolve organisation names for the referrals.
        const cityOrgs = await orgsApi.list({ city: active.city, active_only: false });
        if (cancelled) return;
        const map: Record<number, Organisation> = {};
        cityOrgs.forEach((o) => (map[o.id] = o));
        setOrgs(map);
      } catch {
        if (!cancelled) setReferrals([]);
      } finally {
        if (!cancelled) setLoadingDetail(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [active?.id]);

  const handleTriage = async () => {
    if (!active) return;
    setTriaging(true);
    try {
      await casesApi.triage(active.id);
      pushToast("success", `Case ${active.case_code} triaged and matched.`);
      onChanged();
      const refs = await casesApi.referrals(active.id);
      setReferrals(refs);
    } catch (err) {
      pushToast(
        "error",
        err instanceof Error ? err.message : "Triage failed."
      );
    } finally {
      setTriaging(false);
    }
  };

  const handleAdvance = async () => {
    if (!active) return;
    const next = NEXT_STATUS[active.status];
    if (!next) return;
    setUpdating(true);
    try {
      await casesApi.update(active.id, { status: next });
      pushToast("success", `Case marked as ${next}.`);
      onChanged();
    } catch (err) {
      pushToast("error", err instanceof Error ? err.message : "Update failed.");
    } finally {
      setUpdating(false);
    }
  };

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    pushToast("info", "Referral letter copied to clipboard.");
  };

  if (loading) return <LoadingBlock label="Loading cases..." />;

  if (cases.length === 0) {
    return (
      <EmptyState
        icon={FileSignatureIcon}
        title="No cases yet"
        desc="Create a new case with the “New Case” button to get started."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_360px] gap-6">
      {/* Case list + detail */}
      <div className="space-y-6 min-w-0">
        {active && (
          <>
            {/* Meta bar */}
            <div className="grid sm:grid-cols-3 gap-4">
              <MetaCard
                icon={<CalendarIcon className="w-5 h-5" />}
                label="Created"
                value={new Date(active.created_at).toLocaleDateString("en-PK", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              />
              <MetaCard
                icon={<UsersIcon className="w-5 h-5" />}
                label="Household"
                value={
                  active.household_size
                    ? `${active.household_size} people`
                    : "Unknown"
                }
              />
              <MetaCard
                icon={<MapPinIcon className="w-5 h-5" />}
                label="Location"
                value={`${active.city}${active.area ? " · " + active.area : ""}`}
              />
            </div>

            {/* Detail card */}
            <Card className="space-y-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h2 className="text-lg font-bold text-emerald-700 font-mono">
                      {active.case_code}
                    </h2>
                    <UrgencyBadge urgency={active.urgency} />
                    <StatusBadge status={active.status} />
                  </div>
                  <p className="text-xs text-emerald-500/80 mt-1">
                    {active.beneficiary_name || "Anonymous beneficiary"}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {active.status === "new" && (
                    <button
                      onClick={handleTriage}
                      disabled={triaging}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold flex items-center gap-1.5 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 transition shadow-lg shadow-emerald-500/30"
                    >
                      {triaging ? (
                        <Spinner className="w-3.5 h-3.5" />
                      ) : (
                        <FileSignatureIcon className="w-3.5 h-3.5" />
                      )}
                      <span>Run AI Triage</span>
                    </button>
                  )}
                  {NEXT_STATUS[active.status] && (
                    <button
                      onClick={handleAdvance}
                      disabled={updating}
                      className="px-4 py-2 rounded-xl bg-white border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-1.5 hover:bg-emerald-50 disabled:opacity-50 transition shadow-sm"
                    >
                      {updating ? (
                        <Spinner className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronRightIcon className="w-3.5 h-3.5" />
                      )}
                      <span>Mark {NEXT_STATUS[active.status]}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Reporter + beneficiary contacts */}
              <div className="grid sm:grid-cols-2 gap-3">
                <ContactRow
                  icon={<UserIcon className="w-3.5 h-3.5" />}
                  label="Reported by"
                  value={active.volunteer_name}
                  sub={active.volunteer_phone || undefined}
                />
                <ContactRow
                  icon={<PhoneIcon className="w-3.5 h-3.5" />}
                  label="Beneficiary"
                  value={active.beneficiary_name || "—"}
                  sub={active.beneficiary_phone || undefined}
                />
              </div>

              {/* Situation */}
              <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100">
                <p className="text-[10px] uppercase tracking-wider text-emerald-500/80 mb-1.5 font-semibold">
                  Situation Notes
                </p>
                <p className="text-xs text-emerald-700 leading-relaxed whitespace-pre-line">
                  {active.situation_notes}
                </p>
              </div>

              {/* AI urgency assessment */}
              {active.urgency_reason && (
                <div className="p-4 rounded-xl bg-white border border-emerald-200">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <AlertTriangleIcon className="w-3.5 h-3.5 text-emerald-600" />
                    <p className="text-[10px] uppercase tracking-wider text-emerald-600 font-semibold">
                      AI Urgency Assessment
                    </p>
                  </div>
                  <p className="text-xs text-emerald-700 leading-relaxed">
                    <span className="font-semibold">{active.urgency}.</span>{" "}
                    {active.urgency_reason}
                  </p>
                </div>
              )}
            </Card>
          </>
        )}

        {/* Case table */}
        <Card className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-5 rounded-full bg-gradient-to-b from-emerald-500 to-teal-600" />
            <h2 className="text-sm font-semibold text-emerald-700">
              All Cases ({cases.length})
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-emerald-100 text-[10px] tracking-wider text-emerald-500/80 uppercase">
                  <th className="py-3 px-2 font-medium">Case Code</th>
                  <th className="py-3 px-2 font-medium">Beneficiary</th>
                  <th className="py-3 px-2 font-medium">City / Area</th>
                  <th className="py-3 px-2 font-medium">Urgency</th>
                  <th className="py-3 px-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-50">
                {cases.map((row) => (
                  <tr
                    key={row.id}
                    className={`text-xs hover:bg-emerald-50/70 cursor-pointer transition ${
                      selectedId === row.id ? "bg-emerald-50" : ""
                    }`}
                    onClick={() => onSelect(row.id)}
                  >
                    <td className="py-3.5 px-2 font-mono text-emerald-600 font-semibold">
                      {row.case_code}
                    </td>
                    <td className="py-3.5 px-2 font-semibold text-emerald-700">
                      {row.beneficiary_name || "Anonymous"}
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Referral panel */}
      <div className="space-y-4">
        <Card className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-5 rounded-full bg-gradient-to-b from-emerald-500 to-teal-600" />
            <h2 className="text-sm font-semibold text-emerald-700">
              Referral Letters
            </h2>
          </div>
          {loadingDetail ? (
            <LoadingBlock label="Loading referrals..." />
          ) : referrals.length === 0 ? (
            <EmptyState
              icon={FileSignatureIcon}
              title="No referrals yet"
              desc={
                active?.status === "new"
                  ? "Run AI Triage to generate a referral letter."
                  : "No referral letters for this case."
              }
            />
          ) : (
            <div className="space-y-3">
              {referrals.map((ref) => (
                <div
                  key={ref.id}
                  className="p-3.5 rounded-xl bg-white border border-emerald-100 space-y-2 hover:border-emerald-300 transition relative group shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-emerald-800">
                      {orgs[ref.organisation_id]?.name ||
                        `Organisation #${ref.organisation_id}`}
                    </span>
                    <button
                      onClick={() => copy(ref.letter_text)}
                      className="p-1.5 rounded bg-white border border-emerald-200 text-emerald-600 opacity-0 group-hover:opacity-100 transition"
                      title="Copy letter"
                    >
                      <ClipboardCopyIcon className="w-3 h-3" />
                    </button>
                  </div>
                  <p className="text-[11px] leading-relaxed text-emerald-600 whitespace-pre-line line-clamp-6">
                    {ref.letter_text}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

function MetaCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/80 backdrop-blur border border-emerald-100 shadow-sm hover:shadow-md hover:shadow-emerald-700/5 transition">
      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center text-emerald-600">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-wider text-emerald-500/80">
          {label}
        </p>
        <p className="text-xs font-semibold text-emerald-700 mt-0.5 truncate">
          {value}
        </p>
      </div>
    </div>
  );
}

function ContactRow({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50/40 border border-emerald-100">
      <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-wider text-emerald-500/80">
          {label}
        </p>
        <p className="text-xs font-semibold text-emerald-700 truncate">{value}</p>
        {sub && <p className="text-[10px] text-emerald-500/80 truncate">{sub}</p>}
      </div>
    </div>
  );
}
