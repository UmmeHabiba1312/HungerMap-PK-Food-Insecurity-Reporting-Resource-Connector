"use client";

import React from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import {
  FolderIcon,
  BriefcaseIcon,
  Building2Icon,
  FileSignatureIcon,
  BarChart3Icon,
  MailIcon,
  HelpCircleIcon,
  LogOutIcon,
  HomeIcon,
} from "lucide-react";

export type ViewKey =
  | "my-cases"
  | "all-cases"
  | "organisations"
  | "referrals"
  | "reports"
  | "messages";

export const NAV_ITEMS: {
  key: ViewKey;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { key: "my-cases", name: "My Cases", icon: FolderIcon },
  { key: "all-cases", name: "All Cases", icon: BriefcaseIcon },
  { key: "organisations", name: "Organisations", icon: Building2Icon },
  { key: "referrals", name: "Referrals", icon: FileSignatureIcon },
  { key: "reports", name: "Reports", icon: BarChart3Icon },
  { key: "messages", name: "Messages", icon: MailIcon },
];

export default function Sidebar({
  active,
  onSelect,
  onHelp,
  messageCount,
}: {
  active: ViewKey;
  onSelect: (v: ViewKey) => void;
  onHelp: () => void;
  messageCount?: number;
}) {
  return (
    <aside className="w-[260px] flex-shrink-0 bg-white/80 backdrop-blur-xl border-r border-emerald-100 flex flex-col justify-between p-6 shadow-[4px_0_24px_-12px_rgba(16,185,129,0.25)] z-10">
      <div className="space-y-8">
        <Logo />

        {/* Account Profile Card */}
        <div className="space-y-2">
          <span className="text-[10px] font-semibold text-emerald-500/80 tracking-widest uppercase pl-2">
            Account
          </span>
          <div className="relative flex items-center gap-3 p-3 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 overflow-hidden">
            <div className="absolute -right-6 -top-6 w-20 h-20 rounded-full bg-emerald-300/20 blur-xl" />
            <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-semibold text-sm shadow-md shadow-emerald-500/30">
              HI
            </div>
            <div className="relative min-w-0 flex-1">
              <p className="text-xs font-semibold text-emerald-700 truncate">
                Haider Irshad
              </p>
              <p className="text-[10px] text-emerald-500/80 truncate">
                Volunteer Officer
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-6">
          <div className="space-y-2">
            <span className="text-[10px] font-semibold text-emerald-500/80 tracking-widest uppercase pl-2">
              Main
            </span>
            <ul className="space-y-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = active === item.key;
                const badge =
                  item.key === "messages" && messageCount
                    ? messageCount
                    : undefined;
                return (
                  <li key={item.key}>
                    <button
                      onClick={() => onSelect(item.key)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-300 ${
                        isActive
                          ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30"
                          : "text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          className={`w-4 h-4 ${
                            isActive ? "text-white" : "text-emerald-500/80"
                          }`}
                        />
                        <span>{item.name}</span>
                      </div>
                      {badge ? (
                        <span
                          className={`min-w-5 h-5 px-1.5 rounded-full text-[9px] font-bold flex items-center justify-center ${
                            isActive
                              ? "bg-white/25 text-white"
                              : "bg-emerald-500 text-white"
                          }`}
                        >
                          {badge}
                        </span>
                      ) : (
                        isActive && (
                          <div className="w-1.5 h-3.5 rounded-full bg-white/80" />
                        )
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>
      </div>

      {/* Footer utilities */}
      <div className="space-y-2 pt-6 border-t border-emerald-100">
        <span className="text-[10px] font-semibold text-emerald-500/80 tracking-widest uppercase pl-2">
          Others
        </span>
        <ul className="space-y-1">
          <li>
            <Link
              href="/"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 transition"
            >
              <HomeIcon className="w-4 h-4 text-emerald-500/80" />
              <span>Back to Site</span>
            </Link>
          </li>
          <li>
            <button
              onClick={onHelp}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 transition"
            >
              <HelpCircleIcon className="w-4 h-4 text-emerald-500/80" />
              <span>Help &amp; Information</span>
            </button>
          </li>
          <li>
            <Link
              href="/"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 transition"
            >
              <LogOutIcon className="w-4 h-4 text-emerald-500/80" />
              <span>Log Out</span>
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  );
}
