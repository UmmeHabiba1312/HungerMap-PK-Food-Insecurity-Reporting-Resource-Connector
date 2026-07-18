"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Leaf,
  Send,
} from "lucide-react";
import { contactApi, ApiError } from "@/lib/api";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const update = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setStatus("error");
      setMessage("Name, email and message are required.");
      return;
    }
    setSubmitting(true);
    setStatus("idle");
    setMessage("");
    try {
      await contactApi.create({
        name: form.name.trim(),
        email: form.email.trim(),
        subject: form.subject.trim() || null,
        message: form.message.trim(),
      });
      setStatus("success");
      setMessage(
        "Thank you! Your message has been received. Our team will get back to you shortly."
      );
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setStatus("error");
      setMessage(
        err instanceof ApiError
          ? err.message
          : "Something went wrong. Please try again later."
      );
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full bg-white border border-emerald-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-400 transition";

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 text-slate-800 font-sans">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-emerald-200/40 blur-3xl" />
        <div className="absolute -bottom-32 -left-24 w-96 h-96 rounded-full bg-teal-200/40 blur-3xl" />
        <div className="absolute top-1/3 left-1/2 w-72 h-72 rounded-full bg-green-200/30 blur-3xl" />
      </div>

      <div className="relative">
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
              href="/report"
              className="text-xs font-medium text-emerald-700 hover:text-emerald-800 transition"
            >
              Report a Case →
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
                  <MessageSquare className="w-4 h-4 text-white" />
                  <span className="text-[11px] font-semibold text-white uppercase tracking-wider">
                    Get In Touch
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-[1.1]">
                  Contact <span className="text-emerald-100">Our Team</span>
                </h1>
                <p className="text-emerald-50/90 text-sm md:text-base leading-relaxed mt-4 max-w-md">
                  Questions, partnership inquiries, or need help with a case?
                  Reach out and we&apos;ll respond as soon as possible.
                </p>
                <div className="flex flex-wrap gap-3 mt-6">
                  {[
                    { icon: Mail, label: "Email Us" },
                    { icon: Phone, label: "Call Us" },
                    { icon: MapPin, label: "Visit" },
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
                  src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&h=500&fit=crop"
                  alt="Community support"
                  className="relative rounded-3xl w-full h-56 md:h-64 object-cover shadow-2xl ring-4 ring-white/20"
                />
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-5 gap-10 items-start">
            {/* Left info panel */}
            <aside className="lg:col-span-2 space-y-6 lg:sticky lg:top-28">
              <div className="rounded-2xl overflow-hidden border border-emerald-100 shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1593113630400-ea4288922497?w=500&h=320&fit=crop"
                  alt="Volunteers helping"
                  className="w-full h-44 object-cover"
                />
                <div className="p-5 bg-white/80 backdrop-blur">
                  <h3 className="text-lg font-extrabold text-slate-800">
                    We&apos;re here to help
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed mt-2">
                    Our team responds to every message — whether you&apos;re a
                    partner, volunteer, or someone who needs support.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  {
                    icon: Mail,
                    title: "Email",
                    desc: "support@hungermappk.org",
                  },
                  {
                    icon: Phone,
                    title: "Phone",
                    desc: "+92 300 0000000",
                  },
                  {
                    icon: MapPin,
                    title: "Office",
                    desc: "Karachi, Pakistan",
                  },
                ].map((c) => (
                  <div
                    key={c.title}
                    className="flex items-start gap-3 p-3.5 rounded-xl bg-white/70 border border-emerald-100 shadow-sm hover:border-emerald-300 hover:shadow-md transition"
                  >
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0">
                      <c.icon className="w-4.5 h-4.5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        {c.title}
                      </p>
                      <p className="text-xs text-slate-500">{c.desc}</p>
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
                    <p className="text-sm font-semibold text-emerald-800">
                      {message}
                    </p>
                  </div>
                )}

                {status === "error" && (
                  <div className="mb-6 flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-600">{message}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] text-slate-500 font-semibold mb-1.5 block uppercase tracking-wide">
                        Name<span className="text-emerald-600 ml-0.5">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Your name"
                        value={form.name}
                        onChange={(e) => update("name", e.target.value)}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-500 font-semibold mb-1.5 block uppercase tracking-wide">
                        Email<span className="text-emerald-600 ml-0.5">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="you@example.com"
                        value={form.email}
                        onChange={(e) => update("email", e.target.value)}
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-500 font-semibold mb-1.5 block uppercase tracking-wide">
                      Subject
                    </label>
                    <input
                      type="text"
                      placeholder="How can we help?"
                      value={form.subject}
                      onChange={(e) => update("subject", e.target.value)}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-500 font-semibold mb-1.5 block uppercase tracking-wide">
                      Message
                      <span className="text-emerald-600 ml-0.5">*</span>
                    </label>
                    <textarea
                      required
                      placeholder="Write your message here..."
                      value={form.message}
                      onChange={(e) => update("message", e.target.value)}
                      className={`${inputClass} h-32 resize-none`}
                    />
                  </div>

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
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Send Message</span>
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
