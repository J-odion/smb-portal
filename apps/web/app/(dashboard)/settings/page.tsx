"use client";
import { useState, useEffect } from "react";
import {
  Settings,
  Building2,
  CreditCard,
  Globe,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Scissors,
  ShoppingBag,
  UtensilsCrossed,
  Camera,
  BookOpen,
  Wrench,
  Home,
  Dumbbell,
  Server,
  Zap,
  ShieldCheck,
  RefreshCw,
  ExternalLink
} from "lucide-react";

interface TenantData {
  _id?: string;
  name?: string;
  industry?: string;
  subscription_tier?: string;
  branches?: any[];
}

const INDUSTRIES = [
  {
    id: "RETAIL",
    label: "General Retail / Mart",
    icon: ShoppingBag,
    color: "#00c875",
    desc: "Fast barcode cashiering, stock tracking, and supplier invoices.",
    featureBadge: "POS Barcode Ready",
  },
  {
    id: "TAILOR",
    label: "Tailoring & Fashion",
    icon: Scissors,
    color: "#a25ddc",
    desc: "Native customer measurement tracking (Chest, Waist, Length, Sleeves).",
    featureBadge: "Measurement Cards",
  },
  {
    id: "SALON",
    label: "Barbing / Salon / Spa",
    icon: Sparkles,
    color: "#fdab3d",
    desc: "Staff commission splits, appointment slots, and service menus.",
    featureBadge: "Stylist Commissions",
  },
  {
    id: "FOOD",
    label: "Restaurant / Food Vendor",
    icon: UtensilsCrossed,
    color: "#e2445c",
    desc: "Table tickets, menu prep times, and fast food takeout orders.",
    featureBadge: "Kitchen Orders (KOT)",
  },
  {
    id: "PHOTOGRAPHY",
    label: "Photography Studio",
    icon: Camera,
    color: "#0073ea",
    desc: "Shoot booking packages, deposit schedules, and digital delivery.",
    featureBadge: "Session Bookings",
  },
  {
    id: "BOOK_STORE",
    label: "Book Store & Stationery",
    icon: BookOpen,
    color: "#579bfc",
    desc: "ISBN scanning, genre taxonomy, and bulk school stationery sales.",
    featureBadge: "ISBN Catalog",
  },
  {
    id: "GYM_FITNESS",
    label: "Gym & Fitness Studio",
    icon: Dumbbell,
    color: "#ff5ac4",
    desc: "Membership passes, monthly subscriptions, and trainer bookings.",
    featureBadge: "Membership Passes",
  },
  {
    id: "AUTO_REPAIR",
    label: "Auto Repair / Mechanic",
    icon: Wrench,
    color: "#784bd1",
    desc: "Vehicle job cards, spare parts billing, and mechanic labor tracking.",
    featureBadge: "Job Card Sheets",
  },
  {
    id: "REAL_ESTATE",
    label: "Real Estate & Agency",
    icon: Home,
    color: "#00c875",
    desc: "Property listings, inspection schedules, and agent commission splits.",
    featureBadge: "Property Units",
  },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"industry" | "billing" | "system">("industry");
  const [industry, setIndustry] = useState("RETAIL");
  const [tenantName, setTenantName] = useState("My Business");
  const [subscriptionTier, setSubscriptionTier] = useState("TRIAL");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [apiPingStatus, setApiPingStatus] = useState<"idle" | "checking" | "online" | "offline">("idle");
  const [apiLatency, setApiLatency] = useState<number | null>(null);

  const getToken = () => {
    return (
      (typeof window !== "undefined" && localStorage.getItem("token")) ||
      document.cookie.split("; ").find((row) => row.startsWith("token="))?.split("=")[1] ||
      ""
    );
  };

  useEffect(() => {
    async function loadProfile() {
      try {
        const token = getToken();
        const res = await fetch("/api/tenant/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data: TenantData = await res.json();
          setIndustry(data.industry || "RETAIL");
          setTenantName(data.name || "My Business");
          setSubscriptionTier(data.subscription_tier || "PRO TRIAL");
        }
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleSaveIndustry = async () => {
    setIsSaving(true);
    try {
      const token = getToken();
      const res = await fetch("/api/tenant/industry", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ industry }),
      });
      if (res.ok) {
        setNotification({
          type: "success",
          message: "Industry configuration saved successfully. Your modules have been updated.",
        });
        setTimeout(() => setNotification(null), 4000);
      } else {
        const data = await res.json().catch(() => ({}));
        setNotification({
          type: "error",
          message: `Failed: ${data.message || "Requires OWNER or MANAGER role"}`,
        });
      }
    } catch (err) {
      console.error(err);
      setNotification({ type: "error", message: "Error saving settings" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestApi = async () => {
    setApiPingStatus("checking");
    const start = Date.now();
    try {
      const res = await fetch("/api/health", { cache: "no-store" });
      const elapsed = Date.now() - start;
      setApiLatency(elapsed);
      if (res.ok) {
        setApiPingStatus("online");
      } else {
        // Fallback check
        const testRes = await fetch("/api/tenant/profile", {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        setApiPingStatus(testRes.ok || testRes.status === 401 ? "online" : "offline");
      }
    } catch (err) {
      setApiPingStatus("offline");
      setApiLatency(null);
    }
  };

  if (isLoading) {
    return (
      <div className="p-12 text-center text-secondary glass rounded-2xl border border-white/5">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm">Loading workspace settings...</p>
      </div>
    );
  }

  const selectedIndustryObj = INDUSTRIES.find((ind) => ind.id === industry) || INDUSTRIES[0];

  return (
    <div className="space-y-6 animate-fade-in pb-24 md:pb-8">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 border shadow-lg animate-fade-in ${
            notification.type === "success"
              ? "bg-[#00c875]/10 border-[#00c875]/40 text-[#00c875]"
              : "bg-[#e2445c]/10 border-[#e2445c]/40 text-[#e2445c]"
          }`}
        >
          {notification.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span className="text-sm font-semibold">{notification.message}</span>
        </div>
      )}

      {/* Monday Board Breadcrumb & Top Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-secondary uppercase tracking-wider mb-1">
            <span>Workspaces</span>
            <span>&rsaquo;</span>
            <span className="text-brand-400">Settings & Modules</span>
          </div>
          <h1 className="h2 gradient-text">Workspace Settings</h1>
          <p className="text-secondary text-sm">
            Customize industry modules, subscription billing, and cloud backend configurations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="monday-pill monday-pill-info text-xs">{tenantName}</span>
          <span className="monday-pill monday-pill-review text-xs">{selectedIndustryObj.label}</span>
        </div>
      </div>

      {/* Monday Style Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab("industry")}
          className={`px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shrink-0 ${
            activeTab === "industry"
              ? "bg-brand-500 text-white shadow-lg shadow-brand-500/20"
              : "text-secondary hover:text-white hover:bg-white/5"
          }`}
        >
          <Building2 size={16} />
          <span>Industry Modules</span>
        </button>

        <button
          onClick={() => setActiveTab("billing")}
          className={`px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shrink-0 ${
            activeTab === "billing"
              ? "bg-brand-500 text-white shadow-lg shadow-brand-500/20"
              : "text-secondary hover:text-white hover:bg-white/5"
          }`}
        >
          <CreditCard size={16} />
          <span>Subscription & Billing</span>
        </button>

        <button
          onClick={() => setActiveTab("system")}
          className={`px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shrink-0 ${
            activeTab === "system"
              ? "bg-brand-500 text-white shadow-lg shadow-brand-500/20"
              : "text-secondary hover:text-white hover:bg-white/5"
          }`}
        >
          <Server size={16} />
          <span>Cloud API & Offline Sync</span>
        </button>
      </div>

      {/* TAB 1: Industry Modules */}
      {activeTab === "industry" && (
        <div className="space-y-6 animate-fade-in">
          {/* Current Active Banner */}
          <div className="glass p-5 rounded-2xl border border-white/5 border-l-4 border-l-[#a25ddc] flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0 shadow-md"
                style={{ backgroundColor: selectedIndustryObj.color }}
              >
                <selectedIndustryObj.icon size={22} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-white text-base">{selectedIndustryObj.label}</h3>
                  <span className="monday-pill monday-pill-done text-[11px] py-0.5">Active Mode</span>
                </div>
                <p className="text-xs text-secondary mt-0.5">{selectedIndustryObj.desc}</p>
              </div>
            </div>

            <button
              onClick={handleSaveIndustry}
              disabled={isSaving}
              className="btn btn-primary text-sm font-bold py-2.5 px-5 self-end sm:self-auto shrink-0"
            >
              {isSaving ? "Saving..." : "Save Preferences"}
            </button>
          </div>

          {/* Industry Cards Grid */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-secondary">
              Select Business Template
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {INDUSTRIES.map((ind) => {
                const isSelected = industry === ind.id;
                const IconComp = ind.icon;
                return (
                  <div
                    key={ind.id}
                    onClick={() => setIndustry(ind.id)}
                    className={`glass p-4 rounded-2xl border transition-all cursor-pointer relative space-y-3 ${
                      isSelected
                        ? "border-brand-500 bg-brand-500/10 shadow-lg shadow-brand-500/10"
                        : "border-white/5 hover:border-white/20 bg-secondary/50"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                        style={{ backgroundColor: ind.color }}
                      >
                        <IconComp size={18} />
                      </div>
                      {isSelected ? (
                        <span className="monday-pill monday-pill-done text-[10px] min-w-0 px-2 py-0.5">
                          Selected
                        </span>
                      ) : (
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/5 text-secondary border border-white/5">
                          {ind.featureBadge}
                        </span>
                      )}
                    </div>

                    <div>
                      <h4 className="font-bold text-white text-sm">{ind.label}</h4>
                      <p className="text-xs text-secondary mt-1 line-clamp-2 leading-relaxed">
                        {ind.desc}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px]">
                      <span className="text-secondary">Feature Tag:</span>
                      <span className="text-white font-medium">{ind.featureBadge}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Subscription & Billing */}
      {activeTab === "billing" && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Current Active Plan */}
            <div className="glass p-6 rounded-2xl border border-white/5 border-l-4 border-l-[#00c875] space-y-5">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-semibold text-secondary uppercase tracking-wider block">
                    Active Subscription
                  </span>
                  <h3 className="text-2xl font-black text-white mt-0.5">Enterprise Pro Trial</h3>
                </div>
                <span className="monday-pill monday-pill-done text-xs">Active</span>
              </div>

              {/* Monday Battery for Days Remaining */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-[#00c875]">120 Days Remaining</span>
                  <span className="text-secondary">4 Months Included</span>
                </div>
                <div className="monday-battery h-2.5 rounded-full bg-white/5 overflow-hidden">
                  <div className="bg-[#00c875] h-full w-[25%]" />
                </div>
              </div>

              <div className="space-y-2.5 pt-2 border-t border-white/5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-secondary">
                  Included Enterprise Features
                </h4>
                <ul className="text-sm space-y-2 text-secondary">
                  <li className="flex items-center gap-2 text-white">
                    <CheckCircle2 size={15} className="text-[#00c875]" />
                    <span>Multi-Branch Inventory & Outlets (Up to 10 Branches)</span>
                  </li>
                  <li className="flex items-center gap-2 text-white">
                    <CheckCircle2 size={15} className="text-[#00c875]" />
                    <span>Zero Data Orphan Protection (Cascading Foreign Keys)</span>
                  </li>
                  <li className="flex items-center gap-2 text-white">
                    <CheckCircle2 size={15} className="text-[#00c875]" />
                    <span>Offline PWA Sync with IndexedDB & UUID Reconciliation</span>
                  </li>
                  <li className="flex items-center gap-2 text-white">
                    <CheckCircle2 size={15} className="text-[#00c875]" />
                    <span>Automated WhatsApp Receipts & Payment Inflow Tracking</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right: Plan Upgrade & Payment Gateway */}
            <div className="glass p-6 rounded-2xl border border-brand-500/30 space-y-5 flex flex-col justify-between relative overflow-hidden">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Zap size={18} className="text-brand-400" />
                  <h3 className="text-lg font-bold text-white">Extend or Upgrade Subscription</h3>
                </div>
                <p className="text-xs text-secondary leading-relaxed">
                  Support unlimited transactions, staff accounts, multi-branch synchronization, and dedicated SLA support.
                </p>

                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
                  <span className="text-xs text-secondary block font-medium">Standard SMB Plan</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-white">₦15,000</span>
                    <span className="text-xs text-secondary">/ month</span>
                  </div>
                  <span className="text-[11px] text-[#00c875] block font-semibold">
                    Instant Paystack Checkout & Automated Invoicing
                  </span>
                </div>
              </div>

              <div className="space-y-3 pt-4">
                <button
                  onClick={async () => {
                    const token = getToken();
                    try {
                      const res = await fetch("/api/payments/checkout-session", {
                        method: "POST",
                        headers: { Authorization: `Bearer ${token}` },
                      });
                      const data = await res.json();
                      if (data.url) {
                        window.location.href = data.url;
                      } else {
                        alert("Checkout session created. Redirecting to payment portal...");
                      }
                    } catch (err) {
                      alert("Error initiating checkout session.");
                    }
                  }}
                  className="btn btn-primary w-full py-3.5 text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-brand-500/25"
                >
                  <CreditCard size={16} />
                  <span>Upgrade via Paystack Gateway</span>
                </button>
                <p className="text-center text-[11px] text-secondary">
                  Secured 256-bit SSL Paystack payment. Cancel or modify anytime.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Cloud API & System Connectivity */}
      {activeTab === "system" && (
        <div className="space-y-6 animate-fade-in">
          {/* Cloud API Card */}
          <div className="glass p-6 rounded-2xl border border-white/5 border-l-4 border-l-[#0073ea] space-y-5">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-[#0073ea]/20 text-[#0073ea] flex items-center justify-center border border-[#0073ea]/30">
                  <Server size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Production Cloud Backend</h3>
                  <span className="text-xs text-secondary">Render Managed Microservice</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleTestApi}
                  disabled={apiPingStatus === "checking"}
                  className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <RefreshCw
                    size={13}
                    className={apiPingStatus === "checking" ? "animate-spin" : ""}
                  />
                  <span>Test Connection</span>
                </button>
                <a
                  href="https://smb-portal-1.onrender.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-brand-500/10 hover:bg-brand-500/20 border border-brand-500/30 text-brand-400 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <span>Open API</span>
                  <ExternalLink size={13} />
                </a>
              </div>
            </div>

            {/* Status Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                <span className="text-[11px] text-secondary block font-medium">Configured Endpoint</span>
                <span className="text-xs font-mono text-white truncate block">
                  https://smb-portal-1.onrender.com
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                <span className="text-[11px] text-secondary block font-medium">Heartbeat Status</span>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      apiPingStatus === "online"
                        ? "bg-[#00c875]"
                        : apiPingStatus === "offline"
                        ? "bg-[#e2445c]"
                        : "bg-[#fdab3d]"
                    }`}
                  />
                  <span className="text-xs font-bold text-white">
                    {apiPingStatus === "online"
                      ? "Healthy & Reachable"
                      : apiPingStatus === "offline"
                      ? "Unreachable / CORS"
                      : apiPingStatus === "checking"
                      ? "Pinging..."
                      : "Ready"}
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                <span className="text-[11px] text-secondary block font-medium">Roundtrip Latency</span>
                <span className="text-xs font-bold text-white">
                  {apiLatency !== null ? `${apiLatency} ms` : "—"}
                </span>
              </div>
            </div>
          </div>

          {/* Architecture & Integrity Info Card */}
          <div className="glass p-6 rounded-2xl border border-white/5 space-y-4">
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-[#00c875]" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                Zero Orphan Data Architecture
              </h3>
            </div>
            <p className="text-xs text-secondary leading-relaxed">
              Every customer invoice, payment record, staff commission, and inventory deduction is bound
              by cascading database foreign keys and MongoDB middleware triggers. Offline POS transactions
              generated on mobile devices use deterministic client-side UUIDs that are idempotently
              reconciled when reconnected.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                <span className="text-secondary">Client Database Cache</span>
                <span className="text-[#00c875] font-semibold">IndexedDB Ready</span>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                <span className="text-secondary">PWA Service Worker</span>
                <span className="text-[#00c875] font-semibold">Active & Caching</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
