"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import {
  ArrowRight,
  Sparkles,
  Brain,
  FileText,
  MapPin,
  Star,
  Users,
  Play,
  Check,
  Target,
  Building2,
  MessageCircle,
  Share2,
  Truck,
  Heart,
  Zap,
  TrendingUp,
  Activity,
  Trophy,
  HandHeart,
  ShieldCheck,
  Leaf,
  Lightbulb,
  Quote,
  ArrowUpRight,
  Menu,
  X,
} from "lucide-react";

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const testimonials = [
    {
      quote:
        "HungerMap PK transformed how we handle emergency food cases. AI triage saves us hours daily and helps us reach more families than ever before.",
      author: "Ahmed Khan",
      role: "Volunteer Coordinator, Karachi",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    },
    {
      quote:
        "The auto-matching feature connected us with families in need within minutes. This platform is a game-changer for humanitarian work in Pakistan.",
      author: "Fatima Hassan",
      role: "NGO Director, Lahore",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    },
    {
      quote:
        "From case logging to referral letters, everything is streamlined. Best tool we've used for food relief coordination across multiple cities.",
      author: "Bilal Mahmood",
      role: "Field Operations Lead, Islamabad",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    },
  ];

  const faqs = [
    {
      question: "How does the AI triage system work?",
      answer:
        "Our AI analyzes household size, income levels, number of dependents, and urgency markers from volunteer-submitted case reports. It then assigns a priority score and automatically matches cases with the most suitable nearby NGO partner based on capacity and specialization.",
    },
    {
      question: "Is the platform really free to use?",
      answer:
        "Yes! HungerMap PK is completely free for volunteers and NGOs. We believe humanitarian technology should be accessible to everyone working to help those in need. There are no hidden fees, premium tiers, or paid features.",
    },
    {
      question: "How long does the matching process take?",
      answer:
        "The AI matching process takes less than 2 minutes on average. Once a case is submitted, our system instantly analyzes the data and queries our NGO database for the best match based on location, capacity, and specialization.",
    },
    {
      question: "Can I track the status of referred cases?",
      answer:
        "Absolutely! Our dashboard provides real-time tracking of all cases from submission through matching to delivery confirmation. You can see the status of every case at a glance with detailed timelines and updates.",
    },
  ];

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#process" },
    { label: "Impact", href: "#impact" },
    { label: "Partners", href: "#partners" },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-green-50 to-teal-50 text-slate-800 font-sans">
      {/* Soft decorative background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-24 w-[500px] h-[500px] rounded-full bg-emerald-200/40 blur-3xl" />
        <div className="absolute top-1/3 -left-32 w-[450px] h-[450px] rounded-full bg-teal-200/40 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-green-200/30 blur-3xl" />
      </div>

      {/* ===== NAVIGATION ===== */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrollY > 30 ? "py-3" : "py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-5">
          <div
            className={`transition-all duration-500 ${
              scrollY > 30
                ? "bg-white/80 backdrop-blur-xl border border-emerald-100 rounded-2xl shadow-lg shadow-emerald-900/5"
                : "bg-transparent"
            }`}
          >
            <div className="flex items-center justify-between px-5 h-16">
              <Logo />

              <div className="hidden lg:flex items-center gap-1">
                {navLinks.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="relative px-4 py-2 text-sm font-medium text-slate-500 hover:text-emerald-700 transition-colors rounded-lg hover:bg-emerald-50"
                  >
                    {item.label}
                  </a>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-emerald-700 transition-colors px-3 py-2"
                >
                  Sign In
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/signup"
                  className="hidden sm:inline-flex items-center text-sm font-semibold text-emerald-700 hover:text-emerald-800 border border-emerald-200 hover:border-emerald-300 rounded-full px-4 py-2 transition-colors bg-white/60"
                >
                  Sign Up
                </Link>
                <Link href="/report" className="relative group">
                  <span className="relative inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm font-semibold rounded-full shadow-lg shadow-emerald-500/30 hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 group-hover:scale-105">
                    Report a Case
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
                <button
                  onClick={() => setMobileOpen(!mobileOpen)}
                  className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-emerald-50"
                >
                  {mobileOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {mobileOpen && (
            <div className="lg:hidden mt-2 bg-white/90 backdrop-blur-xl border border-emerald-100 rounded-2xl shadow-lg p-4 flex flex-col gap-1">
              {navLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg"
                >
                  {item.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* ===== HERO SECTION ===== */}
      <section className="relative pt-32 md:pt-44 pb-20 md:pb-28 px-5 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
            {/* Left Content */}
            <div className="max-w-2xl">
              <div
                className={`inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-emerald-100 border border-emerald-200 mb-8 transition-all duration-1000 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-6"
                }`}
              >
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                </span>
                <span className="text-xs font-semibold text-emerald-700 tracking-wide uppercase">
                  Live • AI-Powered Food Relief
                </span>
              </div>

              <h1
                className={`text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[1.05] mb-6 transition-all duration-1000 delay-200 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-6"
                }`}
              >
                <span className="text-slate-900">End Hunger</span>
                <br />
                <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                  With Intelligence
                </span>
              </h1>

              <p
                className={`text-lg text-slate-500 leading-relaxed mb-10 max-w-xl transition-all duration-1000 delay-300 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-6"
                }`}
              >
                AI-powered platform connecting{" "}
                <span className="text-slate-800 font-semibold">volunteers</span>
                ,{" "}
                <span className="text-slate-800 font-semibold">food banks</span>
                , and <span className="text-slate-800 font-semibold">NGOs</span>{" "}
                to deliver emergency food relief across Pakistan with{" "}
                <span className="text-emerald-600 font-semibold">speed</span>{" "}
                and{" "}
                <span className="text-teal-600 font-semibold">precision</span>.
              </p>

              <div
                className={`flex flex-col sm:flex-row flex-wrap items-center gap-4 mb-14 transition-all duration-1000 delay-400 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-6"
                }`}
              >
                <Link href="/report" className="relative group w-full sm:w-auto">
                  <span className="relative inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-full shadow-xl shadow-emerald-500/30 transition-all duration-300 group-hover:scale-105 group-hover:shadow-emerald-500/40 w-full">
                    <HandHeart className="w-5 h-5" />
                    Report a Case
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>

                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-white border-2 border-emerald-200 text-emerald-700 font-semibold rounded-full hover:bg-emerald-50 hover:border-emerald-300 transition-all w-full sm:w-auto"
                >
                  <Play className="w-5 h-5" />
                  Launch Dashboard
                </Link>
              </div>

              {/* Stats Row */}
              <div
                className={`grid grid-cols-3 gap-6 pt-8 border-t border-emerald-100 transition-all duration-1000 delay-500 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-6"
                }`}
              >
                {[
                  {
                    value: "12K+",
                    label: "Families Fed",
                    icon: Heart,
                    color: "text-rose-500",
                  },
                  {
                    value: "98%",
                    label: "Match Rate",
                    icon: Target,
                    color: "text-emerald-600",
                  },
                  {
                    value: "2min",
                    label: "Response",
                    icon: Zap,
                    color: "text-amber-500",
                  },
                ].map((stat, i) => (
                  <div key={i} className="group cursor-default">
                    <div className="flex items-center gap-2 mb-2">
                      <stat.icon
                        className={`w-5 h-5 ${stat.color} group-hover:scale-110 transition-transform`}
                      />
                    </div>
                    <div className="text-2xl font-extrabold tracking-tight text-slate-900">
                      {stat.value}
                    </div>
                    <div className="text-xs text-slate-400 font-medium mt-1">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Hero Visual */}
            <div
              className={`relative transition-all duration-1000 delay-600 ${
                isVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-10"
              }`}
            >
              <div className="relative">
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl rotate-12 opacity-80 blur-sm animate-float shadow-xl shadow-emerald-500/20 z-10" />
                <div
                  className="absolute -bottom-4 -left-4 w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl -rotate-6 opacity-80 blur-sm animate-float shadow-xl shadow-emerald-500/20 z-10"
                  style={{ animationDelay: "2s" }}
                />

                <div className="relative rounded-3xl overflow-hidden border border-emerald-100 shadow-2xl shadow-emerald-900/10 group">
                  <img
                    src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&h=600&fit=crop"
                    alt="Volunteers distributing food to families"
                    className="w-full h-[550px] object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/70 via-emerald-900/20 to-transparent" />

                  <div
                    className="absolute top-6 right-6 p-4 rounded-2xl bg-white/90 backdrop-blur-xl border border-emerald-100 shadow-2xl animate-float"
                    style={{ animationDelay: "1s" }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-400">
                          Success Rate
                        </div>
                        <div className="text-xl font-extrabold text-emerald-600">
                          98.5%
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="absolute bottom-6 left-6 right-6 p-5 rounded-2xl bg-white/90 backdrop-blur-xl border border-emerald-100 shadow-2xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs text-slate-400 mb-1">
                          Active Cases This Month
                        </div>
                        <div className="text-3xl font-extrabold tracking-tight text-slate-800">
                          1,247
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(3)].map((_, i) => (
                          <div
                            key={i}
                            className="w-2 rounded-full bg-gradient-to-t from-emerald-500 to-teal-500"
                            style={{
                              height: `${40 + i * 25}px`,
                              opacity: 0.5 + i * 0.2,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section id="features" className="py-28 md:py-36 px-5 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-emerald-100 border border-emerald-200 mb-6">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold text-emerald-700 tracking-widest uppercase">
                Platform Features
              </span>
            </div>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 text-slate-900 leading-[1.1]">
              Powered by{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Advanced AI
              </span>
            </h2>
            <p className="text-slate-500 max-w-3xl mx-auto text-lg leading-relaxed">
              Cutting-edge machine learning that streamlines every step of food
              relief — from intake to delivery.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-10">
            {[
              {
                icon: Brain,
                title: "AI Triage Engine",
                subtitle: "Intelligent Case Analysis",
                desc: "Machine learning analyzes household data, income, dependents, and urgency markers to auto-prioritize cases instantly.",
                gradient: "from-emerald-500 to-teal-600",
                image:
                  "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600&h=300&fit=crop",
                features: [
                  "Real-time urgency detection",
                  "Multi-factor priority scoring",
                  "Pattern recognition engine",
                ],
              },
              {
                icon: FileText,
                title: "Smart Documentation",
                subtitle: "Auto-Generated Referrals",
                desc: "Generate professional referral letters and reports ready for NGO submission with a single click.",
                gradient: "from-amber-500 to-orange-600",
                image:
                  "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=300&fit=crop",
                features: [
                  "One-click letter generation",
                  "WhatsApp & email sharing",
                  "PDF export with branding",
                ],
              },
              {
                icon: MapPin,
                title: "Location Intelligence",
                subtitle: "Smart NGO Matching",
                desc: "Geospatial algorithms match cases with nearest NGOs, optimizing delivery routes and minimizing response time.",
                gradient: "from-teal-500 to-green-600",
                image:
                  "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=600&h=300&fit=crop",
                features: [
                  "Live GPS tracking",
                  "Route optimization",
                  "Coverage heatmaps",
                ],
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group relative rounded-3xl bg-white border border-emerald-100 shadow-sm hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-500 overflow-hidden hover:-translate-y-2"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-emerald-900/30 to-transparent" />
                  <div className="absolute -bottom-6 left-6">
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}
                    >
                      <feature.icon className="w-7 h-7 text-white" />
                    </div>
                  </div>
                </div>

                <div className="relative p-8 pt-12">
                  <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-2">
                    {feature.subtitle}
                  </p>
                  <h3 className="text-2xl font-extrabold mb-3 text-slate-900">
                    {feature.title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-7">
                    {feature.desc}
                  </p>
                  <div className="space-y-3">
                    {feature.features.map((f, j) => (
                      <div
                        key={j}
                        className="flex items-center gap-3 text-sm text-slate-600"
                      >
                        <div className="w-5 h-5 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3 text-emerald-600" />
                        </div>
                        {f}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PROCESS SECTION ===== */}
      <section
        id="process"
        className="py-28 md:py-36 px-5 bg-white/60 border-y border-emerald-100"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-amber-100 border border-amber-200 mb-6">
              <Target className="w-4 h-4 text-amber-600" />
              <span className="text-xs font-bold text-amber-700 tracking-widest uppercase">
                Simple Process
              </span>
            </div>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 text-slate-900 leading-[1.1]">
              How It{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Works
              </span>
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg">
              Four simple steps from emergency report to food delivery. No
              complexity — just results.
            </p>
          </div>

          <div className="relative grid md:grid-cols-4 gap-x-12 gap-y-16">
            {/* Single horizontal connector behind the boxes (desktop) */}
            <div className="hidden md:block absolute left-[12.5%] right-[12.5%] top-[3.5rem] h-1.5 -translate-y-1/2 bg-gradient-to-r from-emerald-400 via-teal-400 to-green-500 rounded-full shadow-sm z-0" />
            {/* Single vertical connector behind the boxes (mobile) */}
            <div className="md:hidden absolute left-1/2 top-[3.5rem] bottom-0 w-1.5 -translate-x-1/2 bg-gradient-to-b from-emerald-400 to-green-500 rounded-full z-0" />

            {[
              {
                step: "01",
                icon: MessageCircle,
                title: "Report Case",
                desc: "Volunteers submit emergency food relief requests with household details.",
              },
              {
                step: "02",
                icon: Brain,
                title: "AI Analyzes",
                desc: "Machine learning processes data, determines urgency, and assigns priority score.",
              },
              {
                step: "03",
                icon: Share2,
                title: "Auto-Match",
                desc: "System finds nearest available NGO partner with matching capacity.",
              },
              {
                step: "04",
                icon: Truck,
                title: "Relief Delivered",
                desc: "Food package dispatched with real-time tracking until confirmation.",
              },
            ].map((item, i) => (
              <div key={i} className="relative text-center group">
                <div className="relative mb-6 mx-auto w-28 h-28 z-10">
                  <div className="absolute inset-0 bg-emerald-200/50 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative w-28 h-28 rounded-3xl bg-white border-2 border-emerald-200 flex items-center justify-center group-hover:border-emerald-400 group-hover:scale-110 transition-all duration-500 shadow-lg z-10">
                    <item.icon className="w-12 h-12 text-emerald-500 group-hover:text-emerald-600 transition-colors duration-500" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-sm font-extrabold text-white shadow-lg group-hover:scale-110 transition-transform z-20">
                    {item.step}
                  </div>
                </div>
                <h3 className="relative text-xl font-extrabold mb-3 text-slate-900 z-10">
                  {item.title}
                </h3>
                <p className="relative text-sm text-slate-500 leading-relaxed z-10">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Powered by AI — redesigned highlight band */}
          <div className="mt-20 relative rounded-3xl overflow-hidden border border-emerald-200 bg-white shadow-xl shadow-emerald-900/5">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(16,185,129,0.10),transparent_40%),radial-gradient(circle_at_100%_100%,rgba(20,184,166,0.10),transparent_40%)]" />
            <div className="relative px-8 py-10 md:px-12 md:py-12">
              <div className="flex items-center justify-center gap-2.5 mb-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md shadow-emerald-500/30">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs font-bold text-emerald-700 tracking-widest uppercase">
                  Powered by Advanced AI
                </span>
              </div>
              <p className="text-center text-slate-500 text-sm max-w-2xl mx-auto mb-8">
                Cutting-edge machine learning streamlines every step of food
                relief — from intake to delivery.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {[
                  {
                    icon: Brain,
                    title: "Smart Prioritization",
                    desc: "Urgency scored in real time",
                  },
                  {
                    icon: Zap,
                    title: "Instant Matching",
                    desc: "Nearest NGO in seconds",
                  },
                  {
                    icon: ShieldCheck,
                    title: "Verified Relief",
                    desc: "Tracked to delivery",
                  },
                ].map((f) => (
                  <div
                    key={f.title}
                    className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 hover:border-emerald-300 hover:shadow-md transition"
                  >
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                      <f.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-extrabold text-slate-800">
                        {f.title}
                      </div>
                      <div className="text-xs text-emerald-600/80">
                        {f.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TRUSTED PARTNERS SECTION ===== */}
      <section
        id="partners"
        className="py-28 md:py-36 px-5 relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-emerald-100 border border-emerald-200 mb-6">
              <Building2 className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold text-emerald-700 tracking-widest uppercase">
                Trusted Partners
              </span>
            </div>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 text-slate-900 leading-[1.1]">
              Backed by Pakistan's{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Most Trusted
              </span>
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg">
              Working alongside the nation's most reputable humanitarian
              organizations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-16 max-w-3xl mx-auto">
            {[
              {
                value: "5+",
                label: "Partner NGOs",
                icon: Building2,
                color: "text-emerald-600",
              },
              {
                value: "12K+",
                label: "Cases Handled",
                icon: Activity,
                color: "text-teal-600",
              },
              {
                value: "98%",
                label: "Success Rate",
                icon: Trophy,
                color: "text-amber-500",
              },
            ].map((stat, i) => (
              <div key={i} className="text-center group">
                <div className="w-16 h-16 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all duration-300">
                  <stat.icon className={`w-7 h-7 ${stat.color}`} />
                </div>
                <div className="text-3xl font-extrabold tracking-tight text-slate-900">
                  {stat.value}
                </div>
                <div className="text-xs text-slate-400 font-semibold mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-16">
            {[
              {
                name: "Saylani Welfare",
                type: "Food Distribution",
                cases: "3,200+",
                founded: "1999",
                color: "from-emerald-500 to-teal-600",
                logo: "🏛️",
                desc: "Pakistan's largest food distribution network serving millions daily.",
              },
              {
                name: "Edhi Foundation",
                type: "Emergency Relief",
                cases: "5,100+",
                founded: "1951",
                color: "from-amber-500 to-orange-600",
                logo: "🚑",
                desc: "World's largest volunteer ambulance network with food programs.",
              },
              {
                name: "Al-Khidmat",
                type: "Ration Supply",
                cases: "2,800+",
                founded: "1990",
                color: "from-teal-500 to-green-600",
                logo: "📦",
                desc: "Centralized warehouses with bulk distribution capabilities.",
              },
              {
                name: "JDC Foundation",
                type: "Community Kitchen",
                cases: "4,500+",
                founded: "2009",
                color: "from-green-500 to-emerald-600",
                logo: "🍽️",
                desc: "Large-scale urban kitchens and flood rehabilitation programs.",
              },
              {
                name: "Bait-ul-Mal",
                type: "Government Relief",
                cases: "6,000+",
                founded: "1992",
                color: "from-rose-500 to-pink-600",
                logo: "🏢",
                desc: "Government body for social safety nets and food security.",
              },
            ].map((ngo, i) => (
              <div
                key={i}
                className="group relative rounded-2xl bg-white border border-emerald-100 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-900/5 transition-all duration-500 overflow-hidden"
              >
                <div
                  className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${ngo.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${ngo.color} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300`}
                    >
                      {ngo.logo}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                      </span>
                      <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                        Active
                      </span>
                    </div>
                  </div>
                  <h3 className="font-extrabold text-base mb-1 text-slate-900">
                    {ngo.name}
                  </h3>
                  <p className="text-xs font-semibold text-emerald-600 mb-3">
                    {ngo.type}
                  </p>
                  <p className="text-xs text-slate-500 leading-relaxed mb-4 line-clamp-2">
                    {ngo.desc}
                  </p>
                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-emerald-100">
                    <div>
                      <div className="text-lg font-extrabold text-slate-900">
                        {ngo.cases}
                      </div>
                      <div className="text-[10px] text-slate-400">Cases</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-extrabold text-slate-900">
                        {ngo.founded}
                      </div>
                      <div className="text-[10px] text-slate-400">Founded</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Trust Banner */}
          <div className="relative max-w-4xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-200/40 via-teal-200/40 to-green-200/40 rounded-3xl blur-xl" />
            <div className="relative rounded-3xl border border-emerald-100 bg-white/90 backdrop-blur-sm p-10 shadow-lg">
              <div className="flex flex-col md:flex-row items-center gap-10">
                <div className="flex-shrink-0 text-center">
                  <div className="text-6xl font-extrabold tracking-tight bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent mb-2">
                    4.9/5
                  </div>
                  <div className="flex items-center justify-center gap-0.5 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <p className="text-xs text-slate-400 font-semibold">
                    200+ Reviews
                  </p>
                </div>
                <div className="hidden md:block w-px h-24 bg-emerald-100" />
                <div className="flex-1 text-center md:text-left">
                  <p className="text-slate-600 italic leading-relaxed mb-5 text-lg">
                    "HungerMap PK has revolutionized how we handle food relief.
                    The AI matching reduced our response time by 70%. It's an
                    indispensable tool for humanitarian work."
                  </p>
                  <div className="flex items-center justify-center md:justify-start gap-3">
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
                      alt=""
                      className="w-12 h-12 rounded-full object-cover border-2 border-emerald-300"
                    />
                    <div>
                      <div className="font-bold text-slate-900">
                        Dr. Ahmed Raza
                      </div>
                      <div className="text-sm text-slate-500">
                        Director, Saylani Welfare Trust
                      </div>
                    </div>
                  </div>
                </div>
                <div className="hidden lg:flex items-center gap-5 flex-shrink-0">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center mx-auto mb-2">
                      <ShieldCheck className="w-8 h-8 text-emerald-600" />
                    </div>
                    <p className="text-[10px] text-slate-400 font-semibold">
                      Verified
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-2xl bg-teal-100 border border-teal-200 flex items-center justify-center mx-auto mb-2">
                      <Leaf className="w-8 h-8 text-teal-600" />
                    </div>
                    <p className="text-[10px] text-slate-400 font-semibold">
                      Impact
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== IMPACT SECTION ===== */}
      <section
        id="impact"
        className="py-28 md:py-36 px-5 bg-white/60 border-y border-emerald-100"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="grid grid-cols-2 gap-3 sm:gap-5 px-1">
              <img
                src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&h=500&fit=crop"
                alt="Food distribution"
                className="rounded-3xl w-full h-40 sm:h-56 md:h-64 object-cover hover:scale-105 transition-transform duration-500 shadow-lg"
              />
              <img
                src="https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=400&h=500&fit=crop"
                alt="Volunteers helping"
                className="rounded-3xl w-full h-40 sm:h-56 md:h-64 object-cover mt-8 hover:scale-105 transition-transform duration-500 shadow-lg"
              />
              <img
                src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&h=500&fit=crop"
                alt="Food packages"
                className="rounded-3xl w-full h-40 sm:h-56 md:h-64 object-cover hover:scale-105 transition-transform duration-500 shadow-lg"
              />
              <img
                src="https://images.unsplash.com/photo-1593113630400-ea4288922497?w=400&h=500&fit=crop"
                alt="Community support"
                className="rounded-3xl w-full h-40 sm:h-56 md:h-64 object-cover mt-8 hover:scale-105 transition-transform duration-500 shadow-lg"
              />
            </div>

            <div className="lg:pl-4 mt-8 lg:mt-0">
              <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-emerald-100 border border-emerald-200 mb-6">
                <Trophy className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold text-emerald-700 tracking-widest uppercase">
                  Our Impact
                </span>
              </div>
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 text-slate-900 leading-[1.1]">
                Making a{" "}
                <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Real Difference
                </span>
              </h2>
              <p className="text-slate-500 text-base sm:text-lg leading-relaxed mb-8 sm:mb-10 max-w-lg">
                Every day, our platform connects families in need with
                organizations that can help. Here's the impact we're making
                together.
              </p>
              <div className="space-y-5">
                {[
                  {
                    value: "12,000+",
                    label: "Families received food assistance",
                    icon: Heart,
                  },
                  {
                    value: "200+",
                    label: "Active volunteers across Pakistan",
                    icon: Users,
                  },
                  {
                    value: "5",
                    label: "Partner NGO organizations",
                    icon: Building2,
                  },
                  {
                    value: "98%",
                    label: "Successful match rate",
                    icon: Target,
                  },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <item.icon className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-extrabold text-slate-900">
                        {item.value}
                      </div>
                      <div className="text-sm text-slate-500">{item.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-28 md:py-36 px-5">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-emerald-100 border border-emerald-200 mb-6">
            <Quote className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold text-emerald-700 tracking-widest uppercase">
              What People Say
            </span>
          </div>
          <div className="relative bg-white border border-emerald-100 rounded-3xl p-6 sm:p-10 shadow-lg min-h-[220px] flex flex-col justify-center">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className={`transition-all duration-500 ${
                  activeTestimonial === i
                    ? "opacity-100 translate-y-0 relative"
                    : "opacity-0 absolute inset-10"
                }`}
              >
                <p className="text-xl md:text-2xl font-medium text-slate-700 leading-relaxed mb-8">
                  "{t.quote}"
                </p>
                <div className="flex items-center justify-center gap-3">
                  <img
                    src={t.image}
                    alt={t.author}
                    className="w-12 h-12 rounded-full object-cover border-2 border-emerald-300"
                  />
                  <div className="text-left">
                    <div className="font-bold text-slate-900">{t.author}</div>
                    <div className="text-sm text-slate-500">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
            <div className="flex items-center justify-center gap-2 mt-6">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTestimonial(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    activeTestimonial === i
                      ? "bg-emerald-600 w-6"
                      : "bg-emerald-200"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== FAQ SECTION ===== */}
      <section
        id="faq"
        className="py-28 md:py-36 px-5 bg-white/60 border-y border-emerald-100"
      >
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-emerald-100 border border-emerald-200 mb-6">
              <Lightbulb className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold text-emerald-700 tracking-widest uppercase">
                FAQ
              </span>
            </div>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 text-slate-900 leading-[1.1]">
              Frequently Asked{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Questions
              </span>
            </h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="rounded-2xl border border-emerald-100 bg-white overflow-hidden cursor-pointer hover:border-emerald-300 transition-all"
                onClick={() => setActiveFaq(activeFaq === i ? null : i)}
              >
                <div className="flex items-center justify-between p-6">
                  <h3 className="font-bold text-lg text-slate-900 pr-8">
                    {faq.question}
                  </h3>
                  <div
                    className={`w-7 h-7 rounded-full border-2 border-emerald-200 flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                      activeFaq === i
                        ? "rotate-45 bg-emerald-100 border-emerald-300"
                        : ""
                    }`}
                  >
                    <span className="text-xl leading-none font-light text-emerald-600">
                      +
                    </span>
                  </div>
                </div>
                <div
                  className={`transition-all duration-300 ${
                    activeFaq === i
                      ? "max-h-60 opacity-100"
                      : "max-h-0 opacity-0"
                  } overflow-hidden`}
                >
                  <p className="px-6 pb-6 text-slate-500 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="py-28 md:py-36 px-5">
        <div className="max-w-7xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1200&h=600&fit=crop"
              alt="Join our mission"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/70 via-teal-600/60 to-green-700/70" />
            <div className="relative p-8 sm:p-12 md:p-20 lg:p-28 text-center">
              <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/15 border border-white/20 mb-8 backdrop-blur-sm">
                <Sparkles className="w-4 h-4 text-white" />
                <span className="text-xs font-bold text-white tracking-widest uppercase">
                  Join 200+ Volunteers
                </span>
              </div>
              <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.35)]">
                Ready to Make a{" "}
                <span className="text-emerald-100">Difference?</span>
              </h2>
              <p className="text-white/90 max-w-2xl mx-auto mb-12 text-lg leading-relaxed drop-shadow-[0_1px_8px_rgba(0,0,0,0.3)]">
                Join hundreds of volunteers and NGOs already using HungerMap PK
                to coordinate emergency food relief across Pakistan.
              </p>
              <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 sm:gap-5">
                <Link
                  href="/report"
                  className="px-10 py-5 bg-white text-emerald-700 font-extrabold rounded-full hover:bg-emerald-50 transition-all text-lg shadow-xl w-full sm:w-auto"
                >
                  Report a Case
                </Link>
                <Link
                  href="/contact"
                  className="px-10 py-5 bg-white/10 border-2 border-white/30 text-white font-bold rounded-full hover:bg-white/20 transition-all text-lg w-full sm:w-auto"
                >
                  Contact Team
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-emerald-100 bg-white/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-5 py-16">
          <div className="grid md:grid-cols-5 gap-12 mb-12">
            <div className="md:col-span-2">
              <Logo />
              <p className="text-slate-500 max-w-md leading-relaxed mt-5">
                Intelligent food triage and dispatch system connecting
                volunteers, AI technology, and NGOs for faster emergency relief
                across Pakistan.
              </p>
            </div>
            <div>
              <h4 className="font-extrabold mb-5 text-sm uppercase tracking-wider text-slate-700">
                Product
              </h4>
              <div className="space-y-3">
                {["Features", "How It Works", "Dashboard", "API Docs"].map(
                  (item) => (
                    <a
                      key={item}
                      href="#"
                      className="block text-sm text-slate-500 hover:text-emerald-700 transition-colors font-medium"
                    >
                      {item}
                    </a>
                  )
                )}
              </div>
            </div>
            <div>
              <h4 className="font-extrabold mb-5 text-sm uppercase tracking-wider text-slate-700">
                Company
              </h4>
              <div className="space-y-3">
                {["About", "Blog", "Careers", "Contact"].map((item) => (
                  <a
                    key={item}
                    href="#"
                    className="block text-sm text-slate-500 hover:text-emerald-700 transition-colors font-medium"
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-extrabold mb-5 text-sm uppercase tracking-wider text-slate-700">
                Legal
              </h4>
              <div className="space-y-3">
                {["Privacy", "Terms", "Security"].map((item) => (
                  <a
                    key={item}
                    href="#"
                    className="block text-sm text-slate-500 hover:text-emerald-700 transition-colors font-medium"
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-emerald-100 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span className="text-sm text-slate-500 font-medium">
                All systems operational
              </span>
            </div>
            <p className="text-sm text-slate-400 font-medium">
              © 2026 HungerMap PK. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
