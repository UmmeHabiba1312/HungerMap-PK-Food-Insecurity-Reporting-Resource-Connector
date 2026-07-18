"use client";

import { useCallback, useState } from "react";
import type { Toast, ToastKind } from "./ui";

let counter = 1;

export function useToasts() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (kind: ToastKind, text: string) => {
      const id = counter++;
      setToasts((prev) => [...prev, { id, kind, text }]);
      setTimeout(() => dismiss(id), 4000);
    },
    [dismiss]
  );

  return { toasts, push, dismiss };
}

export const inputCls =
  "w-full bg-emerald-50/40 border border-emerald-200 rounded-lg px-3.5 py-2 text-xs text-emerald-700 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30 transition";
