"use client";

import React, { useState, useEffect } from "react";
import Logo from "@/components/Logo";
import { 
  FolderIcon, 
  BriefcaseIcon, 
  FileTextIcon, 
  SettingsIcon, 
  LayersIcon, 
  HelpCircleIcon, 
  LogOutIcon,
  ChevronLeftIcon,
  CalendarIcon,
  MoreHorizontalIcon,
  PlusIcon,
  MessageSquareIcon,
  CheckCircle2Icon,
  MapPinIcon,
  UserIcon,
  Loader2Icon,
  ClipboardCopyIcon,
  FileSignatureIcon
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface Case {
  id: number;
  case_code: string;
  volunteer_name: string;
  volunteer_phone?: string;
  city: string;
  area?: string;
  household_size?: number;
  beneficiary_name?: string;
  beneficiary_phone?: string;
  situation_notes: string;
  status: string;
  urgency?: string;
  urgency_reason?: string;
  created_at: string;
}

interface Referral {
  id: number;
  case_id: number;
  organisation_id: number;
  letter_text: string;
  created_at: string;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState("My Cases");
  const [cases, setCases] = useState<Case[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState<number | null>(null);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(4); // Default to May
  const [notes, setNotes] = useState<Array<{ id: number; type: string; text: string; time: string }>>([]);
  
  // Notes local addition state
  const [newNoteText, setNewNoteText] = useState("");
  const [isAddingNote, setIsAddingNote] = useState(false);

  // Form submission state for creating new cases
  const [isCreatingCase, setIsCreatingCase] = useState(false);
  const [volName, setVolName] = useState("");
  const [volPhone, setVolPhone] = useState("");
  const [benName, setBenName] = useState("");
  const [benPhone, setBenPhone] = useState("");
  const [hhSize, setHhSize] = useState<number>(4);
  const [city, setCity] = useState("Karachi");
  const [area, setArea] = useState("");
  const [notesText, setNotesText] = useState("");
  
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [isTriaging, setIsTriaging] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // SVG Radial Gauge settings
  const totalTicks = 28;
  const activeTicks = Math.round(totalTicks * 0.725); // 72.5% active

  // Mock data fallbacks for local preview when API is offline
  const mockCases: Case[] = [
    { id: 1, case_code: "HM-1091", volunteer_name: "Ali Raza", city: "Karachi", area: "Landhi", household_size: 6, beneficiary_name: "Muhammad Aslam", situation_notes: "No cooked meal in 2 days, father lost job, 3 children under 10.", status: "triaged", urgency: "High", urgency_reason: "Extreme dietary deprivation with multiple children and no source of household income.", created_at: "2026-07-17T02:49:00Z" },
    { id: 2, case_code: "HM-8042", volunteer_name: "Zainab Malik", city: "Lahore", area: "Model Town", household_size: 4, beneficiary_name: "Fatima Bibi", situation_notes: "Widowed, unable to pay rent, children missing meals.", status: "new", created_at: "2026-07-16T18:30:00Z" },
    { id: 3, case_code: "HM-3015", volunteer_name: "Hamza Abbasi", city: "Rawalpindi", area: "Saddar", household_size: 5, beneficiary_name: "Ali Shah", situation_notes: "Disabled wage earner, food insecurity worsening due to high inflation.", status: "new", created_at: "2026-07-15T12:00:00Z" }
  ];

  const chartData = [
    { month: "Jan", value: 3.5, peak: "4.5k", prev: "3.1k" },
    { month: "Feb", value: 5.8, peak: "6.2k", prev: "4.9k" },
    { month: "Mar", value: 7.2, peak: "8.0k", prev: "6.8k" },
    { month: "Apr", value: 4.1, peak: "5.0k", prev: "3.9k" },
    { month: "May", value: 11.0, peak: "12.0k", prev: "9.5k" },
    { month: "Jun", value: 8.5, peak: "9.5k", prev: "7.9k" },
    { month: "Jul", value: 9.0, peak: "10.0k", prev: "8.2k" },
    { month: "Aug", value: 6.5, peak: "7.5k", prev: "5.8k" },
    { month: "Sep", value: 10.2, peak: "11.0k", prev: "9.1k" },
    { month: "Oct", value: 7.8, peak: "8.5k", prev: "7.0k" },
    { month: "Nov", value: 5.2, peak: "6.0k", prev: "4.5k" },
  ];

  // Fetch all cases on mount
  const loadCases = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/cases/`);
      if (res.ok) {
        const data = await res.json();
        setCases(data.length > 0 ? data : mockCases);
        if (data.length > 0 && !selectedCaseId) {
          setSelectedCaseId(data[0].id);
        } else if (data.length === 0) {
          setSelectedCaseId(1);
        }
      } else {
        setCases(mockCases);
        setSelectedCaseId(1);
      }
    } catch (err) {
      console.warn("Backend offline, loading mock cases", err);
      setCases(mockCases);
      setSelectedCaseId(1);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCases();
  }, []);

  // Find currently active case details
  const activeCase = cases.find(c => c.id === selectedCaseId) || cases[0];

  // Fetch referrals and compile sidebar notes list whenever active case changes
  useEffect(() => {
    if (!activeCase) return;

    const loadReferrals = async () => {
      let activeReferrals: Referral[] = [];
      try {
        const res = await fetch(`${API_URL}/cases/${activeCase.id}/referrals`);
        if (res.ok) {
          activeReferrals = await res.json();
          setReferrals(activeReferrals);
        }
      } catch (err) {
        console.error("Failed to load referrals:", err);
      }

      // Compile notes panel
      const caseNotes = [
        {
          id: 1,
          type: "Situation Description",
          text: activeCase.situation_notes,
          time: "Reported"
        }
      ];

      if (activeCase.urgency_reason) {
        caseNotes.push({
          id: 2,
          type: "AI Urgency Assessment",
          text: `Urgency: ${activeCase.urgency}. Reason: ${activeCase.urgency_reason}`,
          time: "AI Triage"
        });
      }

      activeReferrals.forEach((ref, index) => {
        caseNotes.push({
          id: 100 + index,
          type: "Generated Referral Letter",
          text: ref.letter_text,
          time: "Referral Draft"
        });
      });

      setNotes(caseNotes);
    };

    loadReferrals();
  }, [selectedCaseId, activeCase]);

  // Submit volunteer report
  const handleSubmitCase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!volName || !city || !notesText) return;

    setIsSubmittingForm(true);
    try {
      const payload = {
        volunteer_name: volName,
        volunteer_phone: volPhone || null,
        city: city,
        area: area || null,
        household_size: hhSize,
        beneficiary_name: benName || null,
        beneficiary_phone: benPhone || null,
        situation_notes: notesText
      };

      const res = await fetch(`${API_URL}/cases/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const newCase = await res.json();
        setCases([newCase, ...cases.filter(c => c.id !== newCase.id)]);
        setSelectedCaseId(newCase.id);
        
        // Reset form
        setVolName("");
        setVolPhone("");
        setBenName("");
        setBenPhone("");
        setHhSize(4);
        setArea("");
        setNotesText("");
        setIsCreatingCase(false);
      } else {
        alert("Failed to submit case to server.");
      }
    } catch (err) {
      alert("Backend offline. Cannot create case on database.");
      console.error(err);
    } finally {
      setIsSubmittingForm(false);
    }
  };

  // Trigger AI Triage matching
  const handleTriggerTriage = async () => {
    if (!activeCase) return;
    setIsTriaging(true);

    try {
      const res = await fetch(`${API_URL}/cases/${activeCase.id}/triage`, {
        method: "POST",
      });

      if (res.ok) {
        const referralResult = await res.json();
        // Reload cases to fetch updated urgency status
        await loadCases();
        // Force refresh active case notes
        setSelectedCaseId(null);
        setTimeout(() => setSelectedCaseId(activeCase.id), 50);
      } else {
        const errorData = await res.json();
        alert(`Triage failed: ${errorData.detail || "Unknown error"}`);
      }
    } catch (err) {
      alert("API request failed. Make sure database is seeded with Organisations in this city first.");
      console.error(err);
    } finally {
      setIsTriaging(false);
    }
  };

  const handleAddLocalNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    
    setNotes([
      {
        id: Date.now(),
        type: "Volunteer Note Update",
        text: newNoteText,
        time: "Just Now",
      },
      ...notes,
    ]);
    setNewNoteText("");
    setIsAddingNote(false);
  };

  // Copy referral letter text
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Referral letter copied to clipboard!");
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gradient-to-br from-emerald-50/80 via-teal-50/50 to-green-50/60 text-emerald-700 font-sans">
      
      {/* 1. LEFT SIDEBAR */}
      <aside className="w-[260px] flex-shrink-0 bg-white/80 backdrop-blur-xl border-r border-emerald-100 flex flex-col justify-between p-6 shadow-[4px_0_24px_-12px_rgba(16,185,129,0.25)] z-10">
        <div className="space-y-8">
          
          {/* Logo */}
          <Logo />

          {/* Account Profile Card */}
          <div className="space-y-2">
            <span className="text-[10px] font-semibold text-emerald-500/80 tracking-widest uppercase pl-2">Account</span>
            <div className="relative flex items-center gap-3 p-3 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 overflow-hidden">
              <div className="absolute -right-6 -top-6 w-20 h-20 rounded-full bg-emerald-300/20 blur-xl" />
              <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-semibold text-sm shadow-md shadow-emerald-500/30">
                HI
              </div>
              <div className="relative min-w-0 flex-1">
                <p className="text-xs font-semibold text-emerald-700 truncate">Haider Irshad</p>
                <p className="text-[10px] text-emerald-500/80 truncate">Volunteer Officer</p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] font-semibold text-emerald-500/80 tracking-widest uppercase pl-2">Main</span>
              <ul className="space-y-1">
                {[
                  { name: "My Cases", icon: FolderIcon },
                  { name: "All Cases", icon: BriefcaseIcon },
                  { name: "Reports", icon: FileTextIcon },
                  { name: "Configuration", icon: SettingsIcon },
                  { name: "Applications", icon: LayersIcon },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.name && !isCreatingCase;
                  return (
                    <li key={item.name}>
                      <button
                        onClick={() => {
                          setIsCreatingCase(false);
                          setActiveTab(item.name);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-300 ${
                          isActive 
                            ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30" 
                            : "text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-emerald-500/80"}`} />
                          <span>{item.name}</span>
                        </div>
                        {isActive && <div className="w-1.5 h-3.5 rounded-full bg-white/80" />}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </nav>
        </div>

        {/* Footer utilities in sidebar */}
        <div className="space-y-2 pt-6 border-t border-emerald-100">
          <span className="text-[10px] font-semibold text-emerald-500/80 tracking-widest uppercase pl-2">Others</span>
          <ul className="space-y-1">
            <li>
              <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 transition">
                <HelpCircleIcon className="w-4 h-4 text-emerald-500/80" />
                <span>Help & Information</span>
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium text-emerald-600 hover:bg-emerald-50 hover:text-emerald-600 transition">
                <LogOutIcon className="w-4 h-4 text-emerald-500/80" />
                <span>Log Out</span>
              </a>
            </li>
          </ul>
        </div>
      </aside>

      {/* 2. MAIN CONTENT BODY */}
      <main className="flex-1 flex flex-col min-w-0 bg-emerald-50/40 overflow-y-auto p-8 space-y-6">
        
        {isCreatingCase ? (
          /* CREATE NEW CASE VOLUNTEER FORM */
          <div className="space-y-6 max-w-2xl mx-auto w-full">
            <header className="flex items-center gap-4 pb-4 border-b border-emerald-100">
              <button 
                onClick={() => setIsCreatingCase(false)}
                className="p-2 rounded-lg bg-white border border-emerald-200 text-emerald-600 hover:text-emerald-700 transition"
              >
                <ChevronLeftIcon className="w-4 h-4" />
              </button>
              <h1 className="text-xl font-bold tracking-tight text-emerald-700">
                Submit Food Insecurity Case
              </h1>
            </header>

            <form onSubmit={handleSubmitCase} className="p-6 rounded-2xl bg-white border border-emerald-100 shadow-sm space-y-6">
              
              {/* Section 1: Volunteer */}
              <div className="space-y-4">
                <h3 className="text-xs font-semibold text-emerald-600 tracking-wider uppercase">Volunteer Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-emerald-600 font-medium">Your Name *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Ali Raza"
                      value={volName}
                      onChange={(e) => setVolName(e.target.value)}
                      className="w-full bg-emerald-50/40 border border-emerald-200 rounded-lg px-3.5 py-2 text-xs text-emerald-700 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-emerald-600 font-medium">Your Phone</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 0300-1234567"
                      value={volPhone}
                      onChange={(e) => setVolPhone(e.target.value)}
                      className="w-full bg-emerald-50/40 border border-emerald-200 rounded-lg px-3.5 py-2 text-xs text-emerald-700 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30" 
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Beneficiary */}
              <div className="space-y-4 pt-4 border-t border-emerald-100">
                <h3 className="text-xs font-semibold text-emerald-600 tracking-wider uppercase">Beneficiary Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-emerald-600 font-medium">Beneficiary Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. M. Aslam"
                      value={benName}
                      onChange={(e) => setBenName(e.target.value)}
                      className="w-full bg-emerald-50/40 border border-emerald-200 rounded-lg px-3.5 py-2 text-xs text-emerald-700 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-emerald-600 font-medium">Beneficiary Phone</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 0321-7654321"
                      value={benPhone}
                      onChange={(e) => setBenPhone(e.target.value)}
                      className="w-full bg-emerald-50/40 border border-emerald-200 rounded-lg px-3.5 py-2 text-xs text-emerald-700 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30" 
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-emerald-600 font-medium">City *</label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-emerald-50/40 border border-emerald-200 rounded-lg px-3.5 py-2.5 text-xs text-emerald-700 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30"
                    >
                      <option>Karachi</option>
                      <option>Lahore</option>
                      <option>Islamabad</option>
                      <option>Rawalpindi</option>
                      <option>Peshawar</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-emerald-600 font-medium">Area / Town</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Landhi"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      className="w-full bg-emerald-50/40 border border-emerald-200 rounded-lg px-3.5 py-2 text-xs text-emerald-700 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-emerald-600 font-medium">Household Size</label>
                    <input 
                      type="number" 
                      placeholder="6"
                      value={hhSize}
                      onChange={(e) => setHhSize(Number(e.target.value))}
                      className="w-full bg-emerald-50/40 border border-emerald-200 rounded-lg px-3.5 py-2 text-xs text-emerald-700 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30" 
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-emerald-600 font-medium">Situation Notes * (Please describe details)</label>
                  <textarea 
                    required
                    placeholder="No cooked meal in 2 days, father lost job, 3 children under 10..."
                    value={notesText}
                    onChange={(e) => setNotesText(e.target.value)}
                    className="w-full bg-emerald-50/40 border border-emerald-200 rounded-lg p-3 text-xs text-emerald-700 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30 h-28 resize-none" 
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreatingCase(false)}
                  className="px-4 py-2.5 rounded-lg text-xs font-semibold text-emerald-600 hover:bg-emerald-50 border border-transparent hover:border-emerald-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingForm}
                  className="px-6 py-2.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 text-white flex items-center gap-2 hover:from-emerald-700 hover:to-teal-700 shadow-lg shadow-emerald-500/30 transition disabled:opacity-50"
                >
                  {isSubmittingForm ? (
                    <>
                      <Loader2Icon className="w-3.5 h-3.5 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <span>Submit Case</span>
                  )}
                </button>
              </div>

            </form>
          </div>
        ) : (
          /* STANDARD CASE DASHBOARD VIEWS */
          <>
            {/* Header toolbar */}
            <header className="flex items-center justify-between pb-5 border-b border-emerald-100">
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-[10px] font-semibold text-emerald-600 tracking-widest uppercase">Case Dashboard</p>
                  <h1 className="text-xl font-bold tracking-tight text-emerald-700 flex items-center gap-2 mt-0.5">
                    {isLoading ? (
                      <Loader2Icon className="w-4 h-4 animate-spin text-emerald-600" />
                    ) : (
                      <span>{activeCase ? activeCase.case_code : "No Case Selected"}</span>
                    )}
                  </h1>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {activeCase && activeCase.status !== "triaged" && (
                  <button 
                    onClick={handleTriggerTriage}
                    disabled={isTriaging}
                    className="mr-1 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold flex items-center gap-1.5 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 transition shadow-lg shadow-emerald-500/30"
                  >
                    {isTriaging ? (
                      <Loader2Icon className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <FileSignatureIcon className="w-3.5 h-3.5" />
                    )}
                    <span>Run AI Triage</span>
                  </button>
                )}
                <button 
                  onClick={() => setIsCreatingCase(true)}
                  className="px-4 py-2 rounded-xl bg-white border border-emerald-200 text-emerald-700 hover:bg-emerald-50 transition flex items-center gap-1.5 text-xs font-semibold shadow-sm"
                >
                  <PlusIcon className="w-3.5 h-3.5" />
                  <span>New Case</span>
                </button>
                <button className="p-2 rounded-xl bg-white border border-emerald-200 text-emerald-600 hover:text-emerald-700 transition shadow-sm">
                  <CalendarIcon className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-xl bg-white border border-emerald-200 text-emerald-600 hover:text-emerald-700 transition shadow-sm">
                  <SettingsIcon className="w-4 h-4" />
                </button>
              </div>
            </header>

            {/* Case Info Meta Bar */}
            <section className="grid grid-cols-3 gap-4">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/80 backdrop-blur border border-emerald-100 shadow-sm hover:shadow-md hover:shadow-emerald-700/5 transition">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center text-emerald-600">
                  <CalendarIcon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-emerald-500/80">Created</p>
                  <p className="text-xs font-semibold text-emerald-700 mt-0.5">
                    {activeCase ? new Date(activeCase.created_at).toLocaleDateString("en-PK", {
                      year: 'numeric', month: 'short', day: 'numeric'
                    }) : "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/80 backdrop-blur border border-emerald-100 shadow-sm hover:shadow-md hover:shadow-emerald-700/5 transition">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center text-emerald-600">
                  <div className="w-5 h-5 rounded-full border-2 border-emerald-500/60 flex items-center justify-center text-[9px] font-bold">U</div>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-emerald-500/80">Assigned to</p>
                  <p className="text-xs font-semibold text-emerald-700 mt-0.5 truncate max-w-[130px]">
                    {referrals.length > 0 ? `NGO ID: ${referrals[0].organisation_id}` : "Not Referred Yet"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/80 backdrop-blur border border-emerald-100 shadow-sm hover:shadow-md hover:shadow-emerald-700/5 transition">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center text-emerald-600">
                  <MapPinIcon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-emerald-500/80">Location</p>
                  <p className="text-xs font-semibold text-emerald-700 mt-0.5 truncate max-w-[130px]">
                    {activeCase ? `${activeCase.city} - ${activeCase.area || "General"}` : "N/A"}
                  </p>
                </div>
              </div>
            </section>

            {/* Chart / Stats Section */}
            <section className="p-6 rounded-2xl bg-white/80 backdrop-blur border border-emerald-100 shadow-sm space-y-6 relative">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-emerald-700">Recent Case Interactions</h2>
                  <p className="text-[10px] text-emerald-500/80 mt-0.5">Monthly food relief volume across Pakistan</p>
                </div>
                <div className="relative">
                  <span className="text-xs text-emerald-500/80 cursor-pointer hover:text-emerald-800 flex items-center gap-1">
                    2026 <span className="text-[8px]">▼</span>
                  </span>
                </div>
              </div>

              {/* Bar Chart Canvas */}
              <div className="relative flex items-end justify-between h-44 pt-8 px-2 border-b border-emerald-100">
                {chartData.map((data, idx) => {
                  const isSelected = selectedMonth === idx;
                  const barHeightPercent = (data.value / 12) * 100;

                  return (
                    <div 
                      key={data.month} 
                      className="flex flex-col items-center flex-1 group cursor-pointer"
                      onClick={() => setSelectedMonth(idx)}
                    >
                      {/* Tooltip Card */}
                      {isSelected && (
                        <div className="absolute -top-2 bg-white text-emerald-700 p-2.5 rounded-xl border border-emerald-200 shadow-xl text-[10px] space-y-1 z-10 pointer-events-none transform -translate-y-1/2">
                          <p className="font-semibold text-emerald-700">{data.month} 2026</p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span className="text-emerald-500/80">Peak:</span>
                            <span className="text-emerald-700 font-medium">{data.peak}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-200" />
                            <span className="text-emerald-500/80">Previous:</span>
                            <span className="text-emerald-700 font-medium">{data.prev}</span>
                          </div>
                        </div>
                      )}

                      {/* Vertical Bar */}
                      <div className="w-[70%] max-w-[40px] bg-emerald-50 rounded-t-lg relative overflow-hidden transition-all duration-300 group-hover:bg-emerald-100" style={{ height: `130px` }}>
                        <div 
                          className={`w-full absolute bottom-0 rounded-t-lg transition-all duration-500 ${
                            isSelected ? "bg-gradient-to-t from-emerald-500 to-teal-500" : "bg-emerald-300"
                          }`}
                          style={{ height: `${barHeightPercent}%` }}
                        />
                      </div>

                      {/* Month Label */}
                      <span className={`text-[10px] mt-2 transition ${
                        isSelected ? "text-emerald-600 font-semibold" : "text-emerald-500/80"
                      }`}>
                        {data.month}
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Table/Listing Section */}
            <section className="p-6 rounded-2xl bg-white/80 backdrop-blur border border-emerald-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-5 rounded-full bg-gradient-to-b from-emerald-500 to-teal-600" />
                  <h2 className="text-sm font-semibold text-emerald-700">Applications</h2>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-emerald-600 font-medium border-b border-emerald-500 cursor-pointer">
                    Applications
                  </span>
                  <span className="text-xs text-emerald-500/80 hover:text-emerald-800 cursor-pointer transition">
                    Customers Performance
                  </span>
                  <span className="text-xs text-emerald-500/80 cursor-pointer hover:text-emerald-800 flex items-center gap-1 ml-4 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                    01-07 May <span className="text-[8px]">▼</span>
                  </span>
                </div>
              </div>

              {/* Data Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-emerald-100 text-[10px] tracking-wider text-emerald-500/80 uppercase">
                      <th className="py-3 px-2 font-medium">Case Code</th>
                      <th className="py-3 px-2 font-medium">Beneficiary Name</th>
                      <th className="py-3 px-2 font-medium">City / Area</th>
                      <th className="py-3 px-2 font-medium">Urgency</th>
                      <th className="py-3 px-2 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-50">
                    {cases.map((row) => (
                      <tr 
                        key={row.id} 
                        className={`text-xs hover:bg-emerald-50/70 cursor-pointer transition rounded-lg ${
                          selectedCaseId === row.id ? "bg-emerald-50" : ""
                        }`}
                        onClick={() => setSelectedCaseId(row.id)}
                      >
                        <td className="py-3.5 px-2 font-mono text-emerald-600 font-semibold">{row.case_code}</td>
                        <td className="py-3.5 px-2 font-semibold text-emerald-700">{row.beneficiary_name || "Anonymous Beneficiary"}</td>
                        <td className="py-3.5 px-2 text-emerald-600">{row.city} {row.area ? `(${row.area})` : ""}</td>
                        <td className="py-3.5 px-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-semibold tracking-wide ${
                            row.urgency === "High" 
                              ? "bg-emerald-600 text-white border border-emerald-700" 
                              : row.urgency === "Medium"
                              ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                              : row.urgency === "Low"
                              ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                              : "bg-emerald-100 text-emerald-500/80 border border-emerald-200"
                          }`}>
                            {row.urgency || "Pending"}
                          </span>
                        </td>
                        <td className="py-3.5 px-2">
                          <span className={`inline-flex items-center gap-1.5 text-[9px] font-semibold uppercase ${
                            row.status === "triaged" ? "text-emerald-600" : "text-emerald-500/80"
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              row.status === "triaged" ? "bg-emerald-500" : "bg-emerald-300"
                            }`} />
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </main>

      {/* 3. RIGHT PANEL */}
      <aside className="w-[320px] flex-shrink-0 bg-white/80 backdrop-blur-xl border-l border-emerald-100 flex flex-col p-6 space-y-6 overflow-y-auto shadow-[-4px_0_24px_-12px_rgba(16,185,129,0.25)] z-10">
        
        {/* Notes list */}
        <div className="space-y-4 flex-1 flex flex-col min-h-0">
          <div className="flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-5 rounded-full bg-gradient-to-b from-emerald-500 to-teal-600" />
              <h2 className="text-sm font-semibold text-emerald-700">Notes</h2>
            </div>
            <div className="relative">
              <select className="appearance-none bg-emerald-50 border border-emerald-200 text-emerald-600 text-[10px] rounded-lg pl-3 pr-8 py-1.5 font-medium cursor-pointer hover:text-emerald-700 focus:outline-none">
                <option>All Notes</option>
                <option>System Logs</option>
                <option>Volunteer Notes</option>
              </select>
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[8px] text-emerald-500/80">▼</div>
            </div>
          </div>

          {/* New note input form */}
          {isAddingNote && (
            <form onSubmit={handleAddLocalNote} className="space-y-3 p-3 rounded-lg bg-emerald-50 border border-emerald-200 flex-shrink-0">
              <textarea
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                placeholder="Type a new case note..."
                className="w-full bg-white border border-emerald-200 rounded-md p-2 text-xs text-emerald-700 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30 resize-none h-20"
                autoFocus
              />
              <div className="flex gap-2 justify-end">
                <button 
                  type="button" 
                  onClick={() => setIsAddingNote(false)}
                  className="px-3 py-1.5 rounded-md text-[10px] font-semibold text-emerald-600 hover:text-emerald-700"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-3 py-1.5 rounded-md text-[10px] font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700"
                >
                  Save Note
                </button>
              </div>
            </form>
          )}

          {/* Notes Cards Feed */}
          <div className="flex-1 overflow-y-auto pr-1 space-y-3 min-h-[220px]">
            {notes.map((note) => {
              const isReferralLetter = note.type === "Generated Referral Letter";
              return (
                <div key={note.id} className="p-3.5 rounded-xl bg-white border border-emerald-100 space-y-2 hover:border-emerald-300 transition relative group shadow-sm">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-emerald-100 flex items-center justify-center text-emerald-600">
                        <MessageSquareIcon className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[10px] font-semibold text-emerald-800 max-w-[130px] truncate">
                        {note.type}
                      </span>
                    </div>
                    <span className="text-[9px] text-emerald-500/80">{note.time}</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-emerald-600 whitespace-pre-line">
                    {note.text}
                  </p>
                  {isReferralLetter && (
                    <button 
                      onClick={() => copyToClipboard(note.text)}
                      className="absolute top-3 right-3 hidden group-hover:block p-1.5 rounded bg-white border border-emerald-200 text-emerald-600 hover:text-emerald-600 transition"
                      title="Copy Letter text"
                    >
                      <ClipboardCopyIcon className="w-3 h-3" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Notes Storage (Semicircular Gauge) */}
        <div className="pt-6 border-t border-emerald-100 space-y-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-emerald-700">Others</h2>
            <button className="text-emerald-500/80 hover:text-emerald-800">
              <MoreHorizontalIcon className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100 flex flex-col items-center">
            <div className="text-[10px] font-semibold text-emerald-500/80 self-start mb-2">Notes Storage</div>
            
            {/* Semicircular Tick Arc */}
            <div className="w-full flex justify-center py-2">
              <svg viewBox="0 0 200 100" className="w-full max-w-[160px] h-auto">
                {Array.from({ length: totalTicks }).map((_, i) => {
                  const angleDeg = 180 - (i * (180 / (totalTicks - 1)));
                  const angleRad = (Math.PI * angleDeg) / 180;
                  
                  const cx = 100;
                  const cy = 95;
                  const rInner = 72;
                  const rOuter = 88;
                  
                  const x1 = cx + rInner * Math.cos(angleRad);
                  const y1 = cy - rInner * Math.sin(angleRad);
                  const x2 = cx + rOuter * Math.cos(angleRad);
                  const y2 = cy - rOuter * Math.sin(angleRad);
                  
                  const isActive = i < activeTicks;
                  
                  return (
                    <line
                      key={i}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke={isActive ? "#10B981" : "#D1FAE5"}
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  );
                })}
                <text x="100" y="72" textAnchor="middle" fill="#047857" className="text-xl font-bold font-sans">
                  72.5%
                </text>
                <text x="100" y="88" textAnchor="middle" fill="#10B981" className="text-[8px] font-medium font-sans">
                  28.5% Storage Left
                </text>
              </svg>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 flex-shrink-0 space-y-3">
          <div className="flex items-center justify-between text-[10px] text-emerald-500/80 px-1">
            <span>Verify</span>
            <CheckCircle2Icon className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <button 
            onClick={() => setIsAddingNote(true)}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-semibold flex items-center justify-center gap-2 hover:from-emerald-700 hover:to-teal-700 transition shadow-lg shadow-emerald-500/20"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Add Note +</span>
          </button>
        </div>

      </aside>

    </div>
  );
}
