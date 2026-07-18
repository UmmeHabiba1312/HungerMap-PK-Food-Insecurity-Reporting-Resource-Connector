"use client";

import React, { useEffect, useState } from "react";
import {
  FileSignatureIcon,
  ClipboardCopyIcon,
  ChevronDownIcon,
} from "lucide-react";
import { casesApi, orgsApi } from "@/lib/api";
import type { Case, Referral, Organisation } from "@/lib/types";
import { EmptyState, LoadingBlock, Card, UrgencyBadge } from "./ui";

interface Row {
  referral: Referral;
  caseItem: Case;
  orgName: string;
}

export default function ReferralsView({
  cases,
  loading,
  pushToast,
}: {
  cases: Case[];
  loading: boolean;
  pushToast: (kind: "success" | "error" | "info", text: string) => void;
}) {
  const [rows, setRows] = useState<Row[]>([]);
  const [busy, setBusy] = useState(true);
  const [openId, setOpenId] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (loading) return;
      setBusy(true);
      try {
        const orgList: Organisation[] = await orgsApi.list({ active_only: false });
        const orgMap: Record<number, string> = {};
        orgList.forEach((o) => (orgMap[o.id] = o.name));

        const triaged = cases.filter(
          (c) => c.status !== "new"
        );
        const all: Row[] = [];
        for (const c of triaged) {
          try {
            const refs = await casesApi.referrals(c.id);
            refs.forEach((r) =>
              all.push({
                referral: r,
                caseItem: c,
                orgName: orgMap[r.organisation_id] || `Org #${r.organisation_id}`,
              })
            );
          } catch {
            /* skip a case whose referrals fail to load */
          }
        }
        all.sort(
          (a, b) =>
            new Date(b.referral.created_at).getTime() -
            new Date(a.referral.created_at).getTime()
        );
        if (!cancelled) setRows(all);
      } finally {
        if (!cancelled) setBusy(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [cases, loading]);

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    pushToast("info", "Referral letter copied.");
  };

  return (
    <Card className="space-y-5">
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-5 rounded-full bg-gradient-to-b from-emerald-500 to-teal-600" />
        <h2 className="text-sm font-semibold text-emerald-700">
          Referral Letters ({rows.length})
        </h2>
      </div>

      {loading || busy ? (
        <LoadingBlock label="Loading referrals..." />
      ) : rows.length === 0 ? (
        <EmptyState
          icon={FileSignatureIcon}
          title="No referrals generated yet"
          desc="Run AI Triage on a case to generate referral letters."
        />
      ) : (
        <div className="space-y-3">
          {rows.map(({ referral, caseItem, orgName }) => {
            const open = openId === referral.id;
            return (
              <div
                key={referral.id}
                className="rounded-xl border border-emerald-100 bg-white overflow-hidden"
              >
                <button
                  onClick={() => setOpenId(open ? null : referral.id)}
                  className="w-full flex items-center justify-between gap-3 p-4 hover:bg-emerald-50/50 transition text-left"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
                      <FileSignatureIcon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-emerald-700 truncate">
                        {orgName}
                      </p>
                      <p className="text-[10px] text-emerald-500/80">
                        <span className="font-mono">{caseItem.case_code}</span> ·{" "}
                        {caseItem.city}
                        {caseItem.area ? ` (${caseItem.area})` : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <UrgencyBadge urgency={caseItem.urgency} />
                    <ChevronDownIcon
                      className={`w-4 h-4 text-emerald-400 transition-transform ${
                        open ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </button>
                {open && (
                  <div className="px-4 pb-4 space-y-3">
                    <div className="p-3.5 rounded-lg bg-emerald-50/50 border border-emerald-100">
                      <p className="text-[11px] leading-relaxed text-emerald-700 whitespace-pre-line">
                        {referral.letter_text}
                      </p>
                    </div>
                    <button
                      onClick={() => copy(referral.letter_text)}
                      className="px-3 py-1.5 rounded-lg bg-white border border-emerald-200 text-emerald-600 text-[10px] font-semibold flex items-center gap-1.5 hover:bg-emerald-50 transition"
                    >
                      <ClipboardCopyIcon className="w-3 h-3" />
                      Copy Letter
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
