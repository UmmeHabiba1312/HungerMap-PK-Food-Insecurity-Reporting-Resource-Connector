"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  PlusIcon,
  RefreshCwIcon,
  XIcon,
  HelpCircleIcon,
  AlertTriangleIcon,
} from "lucide-react";
import { casesApi } from "@/lib/api";
import type { Case } from "@/lib/types";
import Sidebar, { ViewKey, NAV_ITEMS } from "@/components/dashboard/Sidebar";
import CaseWorkspace from "@/components/dashboard/CaseWorkspace";
import AllCasesView from "@/components/dashboard/AllCasesView";
import OrganisationsView from "@/components/dashboard/OrganisationsView";
import ReferralsView from "@/components/dashboard/ReferralsView";
import ReportsView from "@/components/dashboard/ReportsView";
import MessagesView from "@/components/dashboard/MessagesView";
import NewCaseForm from "@/components/dashboard/NewCaseForm";
import { ToastStack, Spinner } from "@/components/dashboard/ui";
import { useToasts } from "@/components/dashboard/useToasts";

const VIEW_TITLE: Record<ViewKey, string> = {
  "my-cases": "Case Workspace",
  "all-cases": "All Cases",
  organisations: "Organisations",
  referrals: "Referral Letters",
  reports: "Reports & Analytics",
  messages: "Contact Messages",
};

export default function DashboardPage() {
  const { toasts, push, dismiss } = useToasts();
  const [view, setView] = useState<ViewKey>("my-cases");
  const [creating, setCreating] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [unreadMessages, setUnreadMessages] = useState(0);

  const loadCases = useCallback(async () => {
    setLoading(true);
    try {
      const data = await casesApi.list();
      setCases(data);
      setOffline(false);
      setSelectedId((prev) =>
        prev && data.some((c) => c.id === prev)
          ? prev
          : data.length > 0
          ? data[0].id
          : null
      );
    } catch (err) {
      setOffline(true);
      push("error", err instanceof Error ? err.message : "Failed to load cases.");
    } finally {
      setLoading(false);
    }
  }, [push]);

  useEffect(() => {
    loadCases();
  }, [loadCases]);

  const openInWorkspace = (id: number) => {
    setSelectedId(id);
    setView("my-cases");
  };

  const activeCase = useMemo(
    () => cases.find((c) => c.id === selectedId) || null,
    [cases, selectedId]
  );

  const renderView = () => {
    switch (view) {
      case "my-cases":
        return (
          <CaseWorkspace
            cases={cases}
            loading={loading}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onChanged={loadCases}
            pushToast={push}
          />
        );
      case "all-cases":
        return (
          <AllCasesView
            cases={cases}
            loading={loading}
            onOpen={openInWorkspace}
            onChanged={loadCases}
            pushToast={push}
          />
        );
      case "organisations":
        return <OrganisationsView pushToast={push} />;
      case "referrals":
        return (
          <ReferralsView cases={cases} loading={loading} pushToast={push} />
        );
      case "reports":
        return <ReportsView pushToast={push} />;
      case "messages":
        return (
          <MessagesView onCountChange={setUnreadMessages} pushToast={push} />
        );
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gradient-to-br from-emerald-50/80 via-teal-50/50 to-green-50/60 text-emerald-700 font-sans">
      <Sidebar
        active={view}
        onSelect={(v) => {
          setView(v);
          setCreating(false);
        }}
        onHelp={() => setShowHelp(true)}
        messageCount={unreadMessages}
      />

      <main className="flex-1 flex flex-col min-w-0 bg-emerald-50/40 overflow-y-auto p-8 space-y-6">
        {creating ? (
          <NewCaseForm
            onCancel={() => setCreating(false)}
            onCreated={(c) => {
              setCreating(false);
              setView("my-cases");
              loadCases().then(() => setSelectedId(c.id));
              setSelectedId(c.id);
            }}
            pushToast={push}
          />
        ) : (
          <>
            {/* Header toolbar */}
            <header className="flex items-center justify-between pb-5 border-b border-emerald-100">
              <div>
                <p className="text-[10px] font-semibold text-emerald-600 tracking-widest uppercase">
                  HungerMap PK
                </p>
                <h1 className="text-xl font-bold tracking-tight text-emerald-700 flex items-center gap-2 mt-0.5">
                  {loading && view === "my-cases" ? (
                    <Spinner />
                  ) : (
                    <span>
                      {view === "my-cases" && activeCase
                        ? activeCase.case_code
                        : VIEW_TITLE[view]}
                    </span>
                  )}
                </h1>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={loadCases}
                  className="p-2 rounded-xl bg-white border border-emerald-200 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 transition shadow-sm"
                  title="Refresh"
                >
                  <RefreshCwIcon
                    className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                  />
                </button>
                <button
                  onClick={() => setCreating(true)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-semibold flex items-center gap-1.5 hover:from-emerald-700 hover:to-teal-700 transition shadow-lg shadow-emerald-500/30"
                >
                  <PlusIcon className="w-3.5 h-3.5" />
                  New Case
                </button>
              </div>
            </header>

            {offline && (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200">
                <AlertTriangleIcon className="w-5 h-5 text-amber-500 flex-shrink-0" />
                <div className="text-xs text-amber-700">
                  <span className="font-semibold">Backend unreachable.</span> Make
                  sure the API is running, then press refresh.
                </div>
              </div>
            )}

            {renderView()}
          </>
        )}
      </main>

      <ToastStack toasts={toasts} onDismiss={dismiss} />

      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
    </div>
  );
}

function HelpModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-emerald-950/30 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl bg-white border border-emerald-100 shadow-2xl p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HelpCircleIcon className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-bold text-emerald-700">
              Help &amp; Information
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-500 hover:bg-emerald-50 transition"
          >
            <XIcon className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-3 text-xs text-emerald-600 leading-relaxed">
          <p>
            <span className="font-semibold text-emerald-700">Workflow:</span>{" "}
            Create a case → Run AI Triage to assign urgency and generate a
            referral letter → advance status as it is referred and resolved.
          </p>
          <ul className="space-y-2">
            {NAV_ITEMS.map((n) => (
              <li key={n.key} className="flex items-start gap-2">
                <n.icon className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                <span>
                  <span className="font-semibold text-emerald-700">
                    {n.name}
                  </span>{" "}
                  — {HELP_TEXT[n.key]}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

const HELP_TEXT: Record<ViewKey, string> = {
  "my-cases": "Focused workspace for one case: triage, status, referral letters.",
  "all-cases": "Search and filter every case; open or delete them.",
  organisations: "Add, edit, activate or remove partner NGOs used for matching.",
  referrals: "Browse every AI-generated referral letter across all cases.",
  reports: "Live analytics — case volume, urgency mix, match rate, cities.",
  messages: "Messages submitted through the public contact form.",
};
