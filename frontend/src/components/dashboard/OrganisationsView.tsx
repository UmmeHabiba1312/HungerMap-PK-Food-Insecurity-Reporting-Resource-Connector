"use client";

import React, { useEffect, useState } from "react";
import {
  Building2Icon,
  PlusIcon,
  PencilIcon,
  Trash2Icon,
  XIcon,
  MapPinIcon,
} from "lucide-react";
import { orgsApi } from "@/lib/api";
import type { Organisation, OrganisationCreate } from "@/lib/types";
import { EmptyState, LoadingBlock, Card, Spinner } from "./ui";
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

const emptyForm: OrganisationCreate = {
  name: "",
  city: "Karachi",
  area: "",
  focus: "",
  contact_info: "",
  is_active: true,
};

export default function OrganisationsView({
  pushToast,
}: {
  pushToast: (kind: "success" | "error" | "info", text: string) => void;
}) {
  const [orgs, setOrgs] = useState<Organisation[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Organisation | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<OrganisationCreate>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await orgsApi.list({ active_only: false });
      setOrgs(data);
    } catch (err) {
      pushToast("error", err instanceof Error ? err.message : "Failed to load.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (org: Organisation) => {
    setEditing(org);
    setForm({
      name: org.name,
      city: org.city,
      area: org.area || "",
      focus: org.focus || "",
      contact_info: org.contact_info || "",
      is_active: org.is_active,
    });
    setShowForm(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      pushToast("error", "Organisation name is required.");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        area: form.area?.trim() || null,
        focus: form.focus?.trim() || null,
        contact_info: form.contact_info?.trim() || null,
      };
      if (editing) {
        await orgsApi.update(editing.id, payload);
        pushToast("success", `${form.name} updated.`);
      } else {
        await orgsApi.create(payload);
        pushToast("success", `${form.name} added.`);
      }
      setShowForm(false);
      await load();
    } catch (err) {
      pushToast("error", err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (org: Organisation) => {
    setBusyId(org.id);
    try {
      await orgsApi.update(org.id, { is_active: !org.is_active });
      pushToast(
        "success",
        `${org.name} ${org.is_active ? "deactivated" : "activated"}.`
      );
      await load();
    } catch (err) {
      pushToast("error", err instanceof Error ? err.message : "Update failed.");
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (org: Organisation) => {
    if (!confirm(`Delete ${org.name}? This cannot be undone.`)) return;
    setBusyId(org.id);
    try {
      await orgsApi.remove(org.id);
      pushToast("success", `${org.name} deleted.`);
      await load();
    } catch (err) {
      pushToast("error", err instanceof Error ? err.message : "Delete failed.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-5 rounded-full bg-gradient-to-b from-emerald-500 to-teal-600" />
            <h2 className="text-sm font-semibold text-emerald-700">
              Partner Organisations ({orgs.length})
            </h2>
          </div>
          <button
            onClick={openCreate}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-semibold flex items-center gap-1.5 hover:from-emerald-700 hover:to-teal-700 transition shadow-lg shadow-emerald-500/30"
          >
            <PlusIcon className="w-3.5 h-3.5" />
            Add Organisation
          </button>
        </div>

        {loading ? (
          <LoadingBlock label="Loading organisations..." />
        ) : orgs.length === 0 ? (
          <EmptyState
            icon={Building2Icon}
            title="No organisations yet"
            desc="Add NGOs and food banks so cases can be matched to them."
            action={
              <button
                onClick={openCreate}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition"
              >
                Add the first one
              </button>
            }
          />
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {orgs.map((org) => (
              <div
                key={org.id}
                className={`p-4 rounded-2xl border bg-white space-y-3 transition shadow-sm ${
                  org.is_active
                    ? "border-emerald-100 hover:border-emerald-300"
                    : "border-slate-200 opacity-70"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
                      <Building2Icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-emerald-700 truncate">
                        {org.name}
                      </p>
                      <p className="text-[11px] text-emerald-500/80 flex items-center gap-1">
                        <MapPinIcon className="w-3 h-3" />
                        {org.city}
                        {org.area ? ` · ${org.area}` : ""}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full flex-shrink-0 ${
                      org.is_active
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {org.is_active ? "Active" : "Inactive"}
                  </span>
                </div>

                {org.focus && (
                  <p className="text-[11px] text-emerald-600 leading-relaxed">
                    {org.focus}
                  </p>
                )}
                {org.contact_info && (
                  <p className="text-[10px] text-emerald-500/80 leading-relaxed">
                    {org.contact_info}
                  </p>
                )}

                <div className="flex items-center gap-2 pt-1 border-t border-emerald-50">
                  <button
                    onClick={() => openEdit(org)}
                    className="mt-2 px-2.5 py-1.5 rounded-lg bg-white border border-emerald-200 text-emerald-600 text-[10px] font-semibold flex items-center gap-1 hover:bg-emerald-50 transition"
                  >
                    <PencilIcon className="w-3 h-3" /> Edit
                  </button>
                  <button
                    onClick={() => toggleActive(org)}
                    disabled={busyId === org.id}
                    className="mt-2 px-2.5 py-1.5 rounded-lg bg-white border border-emerald-200 text-emerald-600 text-[10px] font-semibold hover:bg-emerald-50 transition disabled:opacity-50"
                  >
                    {org.is_active ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    onClick={() => remove(org)}
                    disabled={busyId === org.id}
                    className="mt-2 px-2.5 py-1.5 rounded-lg bg-white border border-red-200 text-red-500 text-[10px] font-semibold flex items-center gap-1 hover:bg-red-50 transition disabled:opacity-50 ml-auto"
                  >
                    {busyId === org.id ? (
                      <Spinner className="w-3 h-3" />
                    ) : (
                      <Trash2Icon className="w-3 h-3" />
                    )}
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Modal form */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-emerald-950/30 backdrop-blur-sm p-4"
          onClick={() => setShowForm(false)}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-white border border-emerald-100 shadow-2xl p-6 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-emerald-700">
                {editing ? "Edit Organisation" : "Add Organisation"}
              </h3>
              <button
                onClick={() => setShowForm(false)}
                className="p-1.5 rounded-lg text-emerald-500 hover:bg-emerald-50 transition"
              >
                <XIcon className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={save} className="space-y-4">
              <div>
                <label className="text-[10px] text-emerald-600 font-semibold uppercase tracking-wide">
                  Name *
                </label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Saylani Welfare Trust"
                  className={inputCls}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-emerald-600 font-semibold uppercase tracking-wide">
                    City *
                  </label>
                  <select
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className={inputCls}
                  >
                    {CITIES.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-emerald-600 font-semibold uppercase tracking-wide">
                    Area
                  </label>
                  <input
                    value={form.area || ""}
                    onChange={(e) => setForm({ ...form, area: e.target.value })}
                    placeholder="e.g. Gulshan"
                    className={inputCls}
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] text-emerald-600 font-semibold uppercase tracking-wide">
                  Focus
                </label>
                <input
                  value={form.focus || ""}
                  onChange={(e) => setForm({ ...form, focus: e.target.value })}
                  placeholder="e.g. Daily free meals, ration bags"
                  className={inputCls}
                />
              </div>
              <div>
                <label className="text-[10px] text-emerald-600 font-semibold uppercase tracking-wide">
                  Contact Info
                </label>
                <input
                  value={form.contact_info || ""}
                  onChange={(e) =>
                    setForm({ ...form, contact_info: e.target.value })
                  }
                  placeholder="Phone / email / address"
                  className={inputCls}
                />
              </div>
              <label className="flex items-center gap-2 text-xs text-emerald-700">
                <input
                  type="checkbox"
                  checked={form.is_active ?? true}
                  onChange={(e) =>
                    setForm({ ...form, is_active: e.target.checked })
                  }
                  className="accent-emerald-600"
                />
                Active (available for matching)
              </label>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-emerald-600 hover:bg-emerald-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-lg text-xs font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 text-white flex items-center gap-2 hover:from-emerald-700 hover:to-teal-700 transition disabled:opacity-50"
                >
                  {saving && <Spinner className="w-3.5 h-3.5" />}
                  {editing ? "Save Changes" : "Add Organisation"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
