"use client";

import React, { useEffect, useState } from "react";
import {
  FolderIcon,
  Building2Icon,
  FileSignatureIcon,
  TargetIcon,
  TrendingUpIcon,
} from "lucide-react";
import { statsApi } from "@/lib/api";
import type { StatsOverview } from "@/lib/types";
import { LoadingBlock, Card, EmptyState } from "./ui";

export default function ReportsView({
  pushToast,
}: {
  pushToast: (kind: "success" | "error" | "info", text: string) => void;
}) {
  const [stats, setStats] = useState<StatsOverview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setStats(await statsApi.overview());
      } catch (err) {
        pushToast("error", err instanceof Error ? err.message : "Failed to load stats.");
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <LoadingBlock label="Loading reports..." />;
  if (!stats)
    return (
      <EmptyState
        icon={TrendingUpIcon}
        title="No statistics available"
        desc="Could not load metrics from the server."
      />
    );

  const maxMonthly = Math.max(1, ...stats.monthly.map((m) => m.count));
  const urgencyTotal =
    stats.by_urgency.High + stats.by_urgency.Medium + stats.by_urgency.Low || 1;
  const maxCity = Math.max(1, ...stats.by_city.map((c) => c.count));

  return (
    <div className="space-y-6">
      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Kpi
          icon={<FolderIcon className="w-5 h-5" />}
          label="Total Cases"
          value={stats.totals.cases}
          sub={`${stats.totals.pending} pending`}
        />
        <Kpi
          icon={<TargetIcon className="w-5 h-5" />}
          label="Match Rate"
          value={`${stats.totals.match_rate}%`}
          sub={`${stats.totals.triaged} triaged`}
        />
        <Kpi
          icon={<FileSignatureIcon className="w-5 h-5" />}
          label="Referrals"
          value={stats.totals.referrals}
          sub="letters generated"
        />
        <Kpi
          icon={<Building2Icon className="w-5 h-5" />}
          label="Organisations"
          value={stats.totals.organisations}
          sub={`${stats.totals.active_organisations} active`}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Monthly volume */}
        <Card className="lg:col-span-2 space-y-6">
          <div>
            <h2 className="text-sm font-semibold text-emerald-700">
              Case Volume — {stats.year}
            </h2>
            <p className="text-[10px] text-emerald-500/80 mt-0.5">
              Cases reported per month
            </p>
          </div>
          <div className="flex items-end justify-between h-44 pt-8 px-1 border-b border-emerald-100">
            {stats.monthly.map((m) => {
              const pct = (m.count / maxMonthly) * 100;
              return (
                <div
                  key={m.month}
                  className="flex flex-col items-center flex-1 group"
                  title={`${m.month}: ${m.count}`}
                >
                  <div
                    className="w-[60%] max-w-[34px] bg-emerald-50 rounded-t-lg relative overflow-hidden"
                    style={{ height: "130px" }}
                  >
                    <div
                      className="w-full absolute bottom-0 rounded-t-lg bg-gradient-to-t from-emerald-500 to-teal-500 transition-all duration-500 group-hover:from-emerald-600"
                      style={{ height: `${pct}%` }}
                    />
                  </div>
                  <span className="text-[9px] mt-2 text-emerald-500/80">
                    {m.month}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Urgency breakdown */}
        <Card className="space-y-5">
          <h2 className="text-sm font-semibold text-emerald-700">
            Urgency Breakdown
          </h2>
          <div className="space-y-4">
            {(["High", "Medium", "Low"] as const).map((level) => {
              const val = stats.by_urgency[level];
              const pct = Math.round((val / urgencyTotal) * 100);
              const bar =
                level === "High"
                  ? "from-emerald-600 to-emerald-500"
                  : level === "Medium"
                  ? "from-emerald-500 to-teal-400"
                  : "from-teal-400 to-emerald-300";
              return (
                <div key={level} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-emerald-700">{level}</span>
                    <span className="text-emerald-500/80">
                      {val} ({pct}%)
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-emerald-50 overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${bar} transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Cases by city */}
      <Card className="space-y-5">
        <h2 className="text-sm font-semibold text-emerald-700">Cases by City</h2>
        {stats.by_city.length === 0 ? (
          <p className="text-xs text-emerald-500/80">No cases reported yet.</p>
        ) : (
          <div className="space-y-3">
            {stats.by_city.map((c) => (
              <div key={c.city} className="flex items-center gap-3">
                <span className="w-24 text-xs font-medium text-emerald-700 truncate">
                  {c.city}
                </span>
                <div className="flex-1 h-6 rounded-lg bg-emerald-50 overflow-hidden">
                  <div
                    className="h-full rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-end px-2 transition-all duration-500"
                    style={{ width: `${Math.max(8, (c.count / maxCity) * 100)}%` }}
                  >
                    <span className="text-[10px] font-bold text-white">
                      {c.count}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

function Kpi({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  sub?: string;
}) {
  return (
    <div className="p-5 rounded-2xl bg-white/80 backdrop-blur border border-emerald-100 shadow-sm hover:shadow-md hover:shadow-emerald-700/5 transition">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center text-emerald-600 mb-3">
        {icon}
      </div>
      <div className="text-2xl font-extrabold text-emerald-700">{value}</div>
      <div className="text-[11px] text-emerald-600 font-medium mt-0.5">
        {label}
      </div>
      {sub && <div className="text-[10px] text-emerald-500/80 mt-0.5">{sub}</div>}
    </div>
  );
}
