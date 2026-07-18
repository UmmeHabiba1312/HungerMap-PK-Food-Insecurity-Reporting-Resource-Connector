"use client";

import React, { useEffect, useState } from "react";
import { MailIcon, MailOpenIcon, CheckIcon } from "lucide-react";
import { contactApi } from "@/lib/api";
import type { ContactMessage } from "@/lib/types";
import { EmptyState, LoadingBlock, Card, Spinner } from "./ui";

export default function MessagesView({
  onCountChange,
  pushToast,
}: {
  onCountChange?: (unread: number) => void;
  pushToast: (kind: "success" | "error" | "info", text: string) => void;
}) {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await contactApi.list();
      setMessages(data);
      onCountChange?.(data.filter((m) => !m.is_read).length);
    } catch (err) {
      pushToast("error", err instanceof Error ? err.message : "Failed to load messages.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const markRead = async (m: ContactMessage) => {
    if (m.is_read) return;
    setBusyId(m.id);
    try {
      await contactApi.markRead(m.id);
      await load();
    } catch (err) {
      pushToast("error", err instanceof Error ? err.message : "Update failed.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <Card className="space-y-5">
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-5 rounded-full bg-gradient-to-b from-emerald-500 to-teal-600" />
        <h2 className="text-sm font-semibold text-emerald-700">
          Contact Messages ({messages.length})
        </h2>
      </div>

      {loading ? (
        <LoadingBlock label="Loading messages..." />
      ) : messages.length === 0 ? (
        <EmptyState
          icon={MailIcon}
          title="No messages yet"
          desc="Messages submitted through the public contact form appear here."
        />
      ) : (
        <div className="space-y-3">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`p-4 rounded-xl border space-y-2 transition ${
                m.is_read
                  ? "bg-white border-emerald-100"
                  : "bg-emerald-50/60 border-emerald-200"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      m.is_read
                        ? "bg-emerald-50 text-emerald-400"
                        : "bg-emerald-100 text-emerald-600"
                    }`}
                  >
                    {m.is_read ? (
                      <MailOpenIcon className="w-4 h-4" />
                    ) : (
                      <MailIcon className="w-4 h-4" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-emerald-700 truncate">
                      {m.name}{" "}
                      <span className="font-normal text-emerald-500/80">
                        · {m.email}
                      </span>
                    </p>
                    <p className="text-[10px] text-emerald-500/80">
                      {new Date(m.created_at).toLocaleString("en-PK")}
                    </p>
                  </div>
                </div>
                {!m.is_read && (
                  <button
                    onClick={() => markRead(m)}
                    disabled={busyId === m.id}
                    className="px-2.5 py-1.5 rounded-lg bg-white border border-emerald-200 text-emerald-600 text-[10px] font-semibold flex items-center gap-1 hover:bg-emerald-50 transition disabled:opacity-50 flex-shrink-0"
                  >
                    {busyId === m.id ? (
                      <Spinner className="w-3 h-3" />
                    ) : (
                      <CheckIcon className="w-3 h-3" />
                    )}
                    Mark read
                  </button>
                )}
              </div>
              {m.subject && (
                <p className="text-xs font-semibold text-emerald-700">
                  {m.subject}
                </p>
              )}
              <p className="text-[11px] text-emerald-600 leading-relaxed whitespace-pre-line">
                {m.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
