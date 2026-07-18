"use client";

import React, { useState } from "react";
import { ChevronLeftIcon } from "lucide-react";
import { casesApi } from "@/lib/api";
import type { Case } from "@/lib/types";
import { Spinner } from "./ui";
import { inputCls } from "./useToasts";

const CITIES = [
  "Karachi",
  "Lahore",
  "Islamabad",
  "Rawalpindi",
  "Peshawar",
  "Quetta",
  "Faisalabad",
  "Multan",
];

export default function NewCaseForm({
  onCancel,
  onCreated,
  pushToast,
}: {
  onCancel: () => void;
  onCreated: (c: Case) => void;
  pushToast: (kind: "success" | "error" | "info", text: string) => void;
}) {
  const [volName, setVolName] = useState("");
  const [volPhone, setVolPhone] = useState("");
  const [benName, setBenName] = useState("");
  const [benPhone, setBenPhone] = useState("");
  const [hhSize, setHhSize] = useState("4");
  const [city, setCity] = useState("Karachi");
  const [area, setArea] = useState("");
  const [notesText, setNotesText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!volName.trim() || !notesText.trim()) {
      pushToast("error", "Your name and situation notes are required.");
      return;
    }
    setSubmitting(true);
    try {
      const created = await casesApi.create({
        volunteer_name: volName.trim(),
        volunteer_phone: volPhone.trim() || null,
        city,
        area: area.trim() || null,
        household_size: hhSize ? Number(hhSize) : null,
        beneficiary_name: benName.trim() || null,
        beneficiary_phone: benPhone.trim() || null,
        situation_notes: notesText.trim(),
      });
      pushToast("success", `Case ${created.case_code} created.`);
      onCreated(created);
    } catch (err) {
      pushToast("error", err instanceof Error ? err.message : "Failed to create case.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto w-full">
      <header className="flex items-center gap-4 pb-4 border-b border-emerald-100">
        <button
          onClick={onCancel}
          className="p-2 rounded-lg bg-white border border-emerald-200 text-emerald-600 hover:text-emerald-700 transition"
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </button>
        <h1 className="text-xl font-bold tracking-tight text-emerald-700">
          Submit Food Insecurity Case
        </h1>
      </header>

      <form
        onSubmit={submit}
        className="p-6 rounded-2xl bg-white border border-emerald-100 shadow-sm space-y-6"
      >
        <div className="space-y-4">
          <h3 className="text-xs font-semibold text-emerald-600 tracking-wider uppercase">
            Volunteer Details
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <Labelled label="Your Name *">
              <input
                required
                value={volName}
                onChange={(e) => setVolName(e.target.value)}
                placeholder="e.g. Ali Raza"
                className={inputCls}
              />
            </Labelled>
            <Labelled label="Your Phone">
              <input
                value={volPhone}
                onChange={(e) => setVolPhone(e.target.value)}
                placeholder="e.g. 0300-1234567"
                className={inputCls}
              />
            </Labelled>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-emerald-100">
          <h3 className="text-xs font-semibold text-emerald-600 tracking-wider uppercase">
            Beneficiary Information
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <Labelled label="Beneficiary Name">
              <input
                value={benName}
                onChange={(e) => setBenName(e.target.value)}
                placeholder="e.g. M. Aslam"
                className={inputCls}
              />
            </Labelled>
            <Labelled label="Beneficiary Phone">
              <input
                value={benPhone}
                onChange={(e) => setBenPhone(e.target.value)}
                placeholder="e.g. 0321-7654321"
                className={inputCls}
              />
            </Labelled>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Labelled label="City *">
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className={inputCls}
              >
                {CITIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </Labelled>
            <Labelled label="Area / Town">
              <input
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="e.g. Landhi"
                className={inputCls}
              />
            </Labelled>
            <Labelled label="Household Size">
              <input
                type="number"
                min={1}
                value={hhSize}
                onChange={(e) => setHhSize(e.target.value)}
                placeholder="6"
                className={inputCls}
              />
            </Labelled>
          </div>
          <Labelled label="Situation Notes *">
            <textarea
              required
              value={notesText}
              onChange={(e) => setNotesText(e.target.value)}
              placeholder="No cooked meal in 2 days, father lost job, 3 children under 10..."
              className={`${inputCls} h-28 resize-none`}
            />
          </Labelled>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 rounded-lg text-xs font-semibold text-emerald-600 hover:bg-emerald-50 border border-transparent hover:border-emerald-200 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 text-white flex items-center gap-2 hover:from-emerald-700 hover:to-teal-700 shadow-lg shadow-emerald-500/30 transition disabled:opacity-50"
          >
            {submitting && <Spinner className="w-3.5 h-3.5" />}
            <span>{submitting ? "Submitting..." : "Submit Case"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

function Labelled({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] text-emerald-600 font-medium">{label}</label>
      {children}
    </div>
  );
}
