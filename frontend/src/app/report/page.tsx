"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  HandHeart,
  Loader2,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Phone,
  Users,
  FileText,
  User,
  Leaf,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { casesApi, API_URL, ApiError } from "@/lib/api";

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

interface FormState {
  volunteer_name: string;
  volunteer_phone: string;
  beneficiary_name: string;
  beneficiary_phone: string;
  city: string;
  area: string;
  household_size: string;
  situation_notes: string;
}

const initialForm: FormState = {
  volunteer_name: "",
  volunteer_phone: "",
  beneficiary_name: "",
  beneficiary_phone: "",
  city: "Karachi",
  area: "",
  household_size: "",
  situation_notes: "",
};

export default function ReportPage() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [caseCode, setCaseCode] = useState("");

  const update = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.volunteer_name.trim() || !form.situation_notes.trim()) {
      setStatus("error");
      setMessage("Reporter name and situation notes are required.");
      return;
    }

    setSubmitting(true);
    setStatus("idle");
    setMessage("");

    try {
      const data = await casesApi.create({
        volunteer_name: form.volunteer_name.trim(),
        volunteer_phone: form.volunteer_phone.trim() || null,
        beneficiary_name: form.beneficiary_name.trim() || null,
        beneficiary_phone: form.beneficiary_phone.trim() || null,
        city: form.city,
        area: form.area.trim() || null,
        household_size: form.household_size
          ? Number(form.household_size)
          : null,
        situation_notes: form.situation_notes.trim(),
      });

      setCaseCode(data.case_code || "");
      setStatus("success");
      setMessage(
        "Case submitted successfully. Our team will triage and match it with a nearby NGO."
      );
      setForm(initialForm);
    } catch (err) {
      setStatus("error");
      setMessage(
        err instanceof ApiError
          ? err.message
          : "Could not reach the server at " + API_URL
      );
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 text-slate-800 font-sans">
      {/* Decorative background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-emerald-200/40 blur-3xl" />
        <div className="absolute -bottom-32 -left-24 w-96 h-96 rounded-full bg-teal-200/40 blur-3xl" />
        <div className="absolute top-1/3 left-1/2 w-72 h-72 rounded-full bg-green-200/30 blur-3xl" />
      </div>

      <div className="relative">
        {/* Top bar */}
        <header className="border-b border-emerald-100/70 bg-white/70 backdrop-blur-xl sticky top-0 z-30">
          <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2.5 font-semibold tracking-wide text-slate-800"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-500/30">
                H
              </div>
              HungerMap<span className="text-emerald-600">PK</span>
            </Link>
            <Link
              href="/dashboard"
              className="text-xs font-medium text-emerald-700 hover:text-emerald-800 transition"
            >
              Go to Dashboard →
            </Link>
          </div>
        </header>

        <div className="max-w-6xl mx-auto px-5 py-10 lg:py-14">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-emerald-700 transition mb-8"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to home
          </Link>

          {/* Hero */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-green-700 p-8 md:p-12 mb-12 shadow-xl shadow-emerald-900/10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(255,255,255,0.25),transparent_45%),radial-gradient(circle_at_85%_80%,rgba(255,255,255,0.18),transparent_40%)]" />
            <div className="relative grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur border border-white/20 mb-5">
                  <HandHeart className="w-4 h-4 text-white" />
                  <span className="text-[11px] font-semibold text-white uppercase tracking-wider">
                    Report Food Insecurity
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-[1.1]">
                  Submit a{" "}
                  <span className="text-emerald-100">Case Report</span>
                </h1>
                <p className="text-emerald-50/90 text-sm md:text-base leading-relaxed mt-4 max-w-md">
                  Volunteers and community members can report a household in
                  need. Your report is triaged by our AI and matched with the
                  nearest available NGO partner.
                </p>
                <div className="flex flex-wrap gap-3 mt-6">
                  {[
                    { icon: Sparkles, label: "AI Triage" },
                    { icon: MapPin, label: "Smart Match" },
                    { icon: ShieldCheck, label: "Confidential" },
                  ].map((b) => (
                    <span
                      key={b.label}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur text-white text-xs font-medium border border-white/20"
                    >
                      <b.icon className="w-3.5 h-3.5" />
                      {b.label}
                    </span>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-white/10 rounded-3xl blur-2xl" />
                <img
                  src="https://images.unsplash.com/photo-1593113630400-ea4288922497?w=600&h=500&fit=crop"
                  alt="Community food relief"
                  className="relative rounded-3xl w-full h-56 md:h-64 object-cover shadow-2xl ring-4 ring-white/20"
                />
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-5 gap-10 items-start">
            {/* Left intro panel */}
            <aside className="lg:col-span-2 space-y-6 lg:sticky lg:top-28">
              <div className="rounded-2xl overflow-hidden border border-emerald-100 shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=500&h=320&fit=crop"
                  alt="Food distribution volunteers"
                  className="w-full h-44 object-cover"
                />
                <div className="p-5 bg-white/80 backdrop-blur">
                  <h3 className="text-lg font-extrabold text-slate-800">
                    Every report feeds a family
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed mt-2">
                    A single submission connects a struggling household to
                    meals, ration, and support — fast.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  {
                    icon: Sparkles,
                    title: "AI-powered triage",
                    desc: "Cases are prioritized by urgency automatically.",
                  },
                  {
                    icon: MapPin,
                    title: "Smart NGO matching",
                    desc: "Connected with the closest relief partner.",
                  },
                  {
                    icon: ShieldCheck,
                    title: "Secure & confidential",
                    desc: "Beneficiary data is handled with care.",
                  },
                ].map((f) => (
                  <div
                    key={f.title}
                    className="flex items-start gap-3 p-3.5 rounded-xl bg-white/70 border border-emerald-100 shadow-sm hover:border-emerald-300 hover:shadow-md transition"
                  >
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0">
                      <f.icon className="w-4.5 h-4.5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        {f.title}
                      </p>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {f.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </aside>

            {/* Right form card */}
            <div className="lg:col-span-3">
              <div className="rounded-2xl bg-white/90 backdrop-blur-xl border border-emerald-100 shadow-xl shadow-emerald-900/5 p-6 sm:p-8">
                {status === "success" && (
                  <div className="mb-6 flex items-start gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-emerald-800">
                        {message}
                      </p>
                      {caseCode && (
                        <p className="text-xs text-slate-500 mt-1">
                          Reference case code:{" "}
                          <span className="font-mono font-semibold text-slate-700">
                            {caseCode}
                          </span>
                        </p>
                      )}
                      <button
                        onClick={() => setStatus("idle")}
                        className="text-xs font-medium text-emerald-700 hover:underline mt-2"
                      >
                        Submit another report
                      </button>
                    </div>
                  </div>
                )}

                {status === "error" && (
                  <div className="mb-6 flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-600">{message}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-7">
                  {/* Reporter heading */}
                  <div className="flex items-center gap-3 pb-1">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md shadow-emerald-500/30">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-base font-extrabold text-slate-800">
                        Reporter (Volunteer) Details
                      </h2>
                      <p className="text-[11px] text-slate-400">
                        Tell us who is submitting this report
                      </p>
                    </div>
                  </div>
                  {/* Volunteer */}
                  <section className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Field
                        label="Your Name"
                        required
                        hint="e.g. Ali Raza"
                      >
                        <input
                          type="text"
                          required
                          placeholder="e.g. Ali Raza"
                          value={form.volunteer_name}
                          onChange={(e) =>
                            update("volunteer_name", e.target.value)
                          }
                          className={inputClass}
                        />
                      </Field>
                      <Field label="Your Phone" hint="e.g. 0300-1234567">
                        <div className="relative">
                          <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input
                            type="text"
                            placeholder="0300-1234567"
                            value={form.volunteer_phone}
                            onChange={(e) =>
                              update("volunteer_phone", e.target.value)
                            }
                            className={`${inputClass} pl-9`}
                          />
                        </div>
                      </Field>
                    </div>
                  </section>

                  <div className="h-px bg-emerald-100" />

                  {/* Beneficiary heading */}
                  <div className="flex items-center gap-3 pb-1">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md shadow-emerald-500/30">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-base font-extrabold text-slate-800">
                        Beneficiary Information
                      </h2>
                      <p className="text-[11px] text-slate-400">
                        Details about the household in need
                      </p>
                    </div>
                  </div>
                  <section className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Field label="Beneficiary Name" hint="e.g. M. Aslam">
                        <input
                          type="text"
                          placeholder="e.g. M. Aslam"
                          value={form.beneficiary_name}
                          onChange={(e) =>
                            update("beneficiary_name", e.target.value)
                          }
                          className={inputClass}
                        />
                      </Field>
                      <Field label="Beneficiary Phone" hint="e.g. 0321-7654321">
                        <div className="relative">
                          <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input
                            type="text"
                            placeholder="0321-7654321"
                            value={form.beneficiary_phone}
                            onChange={(e) =>
                              update("beneficiary_phone", e.target.value)
                            }
                            className={`${inputClass} pl-9`}
                          />
                        </div>
                      </Field>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4">
                      <Field label="City" required>
                        <div className="relative">
                          <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                          <select
                            value={form.city}
                            onChange={(e) => update("city", e.target.value)}
                            className={`${inputClass} pl-9 appearance-none`}
                          >
                            {CITIES.map((c) => (
                              <option key={c}>{c}</option>
                            ))}
                          </select>
                        </div>
                      </Field>
                      <Field label="Area / Town" hint="e.g. Landhi">
                        <input
                          type="text"
                          placeholder="e.g. Landhi"
                          value={form.area}
                          onChange={(e) => update("area", e.target.value)}
                          className={inputClass}
                        />
                      </Field>
                      <Field label="Household Size" hint="e.g. 6">
                        <input
                          type="number"
                          min={1}
                          placeholder="6"
                          value={form.household_size}
                          onChange={(e) =>
                            update("household_size", e.target.value)
                          }
                          className={inputClass}
                        />
                      </Field>
                    </div>

                    <Field
                      label="Situation Notes"
                      required
                      hint="Describe the situation in detail"
                    >
                      <div className="relative">
                        <FileText className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                        <textarea
                          required
                          placeholder="No cooked meal in 2 days, father lost job, 3 children under 10..."
                          value={form.situation_notes}
                          onChange={(e) =>
                            update("situation_notes", e.target.value)
                          }
                          className={`${inputClass} pl-9 h-32 resize-none pt-2.5`}
                        />
                      </div>
                    </Field>
                  </section>

                  <div className="flex items-center justify-end gap-3 pt-1">
                    <Link
                      href="/"
                      className="px-4 py-2.5 rounded-lg text-xs font-semibold text-slate-500 hover:bg-emerald-50 border border-transparent hover:border-emerald-200 transition"
                    >
                      Cancel
                    </Link>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-6 py-2.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 text-white flex items-center gap-2 hover:from-emerald-700 hover:to-teal-700 shadow-lg shadow-emerald-500/30 transition disabled:opacity-60"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <Leaf className="w-3.5 h-3.5" />
                          <span>Submit Case</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const inputClass =
  "w-full bg-white border border-emerald-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-400 transition";

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-[11px] text-slate-500 font-semibold mb-1.5 block uppercase tracking-wide">
        {label}
        {required && <span className="text-emerald-600 ml-0.5">*</span>}
      </label>
      {children}
      {hint && <p className="text-[11px] text-slate-400 mt-1">{hint}</p>}
    </div>
  );
}
