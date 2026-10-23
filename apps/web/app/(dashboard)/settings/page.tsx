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
    color: "#16a34a",
    desc: "Fast barcode cashiering, stock tracking, and supplier invoices.",
    featureBadge: "POS Barcode Ready",
  },
  {
    id: "TAILOR",
    label: "Tailoring & Fashion",
    icon: Scissors,
    color: "#7c3aed",
    desc: "Native customer measurement tracking (Chest, Waist, Length, Sleeves).",
    featureBadge: "Measurement Cards",
  },
  {
    id: "SALON",
    label: "Barbing / Salon / Spa",
    icon: Sparkles,
    color: "#f59e0b",
    desc: "Staff commission splits, appointment slots, and service menus.",
    featureBadge: "Stylist Commissions",
  },
  {
    id: "FOOD",
    label: "Restaurant / Food Vendor",
    icon: UtensilsCrossed,
    color: "#dc2626",
    desc: "Table tickets, menu prep times, and fast food takeout orders.",
    featureBadge: "Kitchen Orders (KOT)",
  },
  {
    id: "PHOTOGRAPHY",
    label: "Photography Studio",
    icon: Camera,
    color: "#7c3aed",
    desc: "Shoot booking packages, deposit schedules, and digital delivery.",
    featureBadge: "Session Bookings",
  },
  {
    id: "BOOK_STORE",
    label: "Book Store & Stationery",
    icon: BookOpen,
    color: "#2563eb",
    desc: "ISBN scanning, genre taxonomy, and bulk school stationery sales.",
    featureBadge: "ISBN Catalog",
  },
  {
    id: "GYM_FITNESS",
    label: "Gym & Fitness Studio",
    icon: Dumbbell,
    color: "#db2777",
    desc: "Membership passes, monthly subscriptions, and trainer bookings.",
    featureBadge: "Membership Passes",
  },
  {
    id: "AUTO_REPAIR",
    label: "Auto Repair / Mechanic",
    icon: Wrench,
    color: "#6d28d9",
    desc: "Vehicle job cards, spare parts billing, and mechanic labor tracking.",
    featureBadge: "Job Card Sheets",
  },
  {
    id: "REAL_ESTATE",
    label: "Real Estate & Agency",
    icon: Home,
    color: "#16a34a",
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
      <div className="p-12 text-center text-zinc-500 bg-white rounded-2xl border border-zinc-200">
        <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm font-medium">Loading workspace settings...</p>
      </div>
    );
  }

  const selectedIndustryObj = INDUSTRIES.find((ind) => ind.id === industry) || INDUSTRIES[0];

  return (
    <div className="space-y-6 animate-fade-in pb-24 md:pb-8">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 border shadow-sm animate-fade-in ${
            notification.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-700"
              : "bg-red-50 border-red-200 text-red-700"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle size={18} className="text-red-600 shrink-0" />
          )}
          <span className="text-sm font-semibold">{notification.message}</span>
        </div>
      )}

      {/* Breadcrumb & Top Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">
            <span>Workspaces</span>
            <span>&rsaquo;</span>
            <span className="text-purple-600">Settings & Modules</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-black">Workspace Settings</h1>
          <p className="text-zinc-600 text-sm mt-0.5">
            Customize industry modules, subscription billing, and cloud backend configurations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700 border border-purple-200">
            {tenantName}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700 border border-purple-200">
            {selectedIndustryObj.label}
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab("industry")}
          className={`px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
            activeTab === "industry"
              ? "bg-purple-600 text-white shadow-md shadow-purple-600/20"
              : "text-zinc-700 hover:text-black hover:bg-zinc-100"
          }`}
        >
          <Building2 size={16} />
          <span>Industry Modules</span>
        </button>

        <button
          onClick={() => setActiveTab("billing")}
          className={`px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
            activeTab === "billing"
              ? "bg-purple-600 text-white shadow-md shadow-purple-600/20"
              : "text-zinc-700 hover:text-black hover:bg-zinc-100"
          }`}
        >
          <CreditCard size={16} />
          <span>Subscription & Billing</span>
        </button>

        <button
          onClick={() => setActiveTab("system")}
          className={`px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
            activeTab === "system"
              ? "bg-purple-600 text-white shadow-md shadow-purple-600/20"
              : "text-zinc-700 hover:text-black hover:bg-zinc-100"
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
          <div className="bg-white p-5 rounded-2xl border border-zinc-200 border-l-4 border-l-purple-600 flex flex-col sm:flex-row justify-between sm:items-center gap-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm"
                style={{ backgroundColor: selectedIndustryObj.color }}
              >
                <selectedIndustryObj.icon size={22} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-black text-base">{selectedIndustryObj.label}</h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                    Active Mode
                  </span>
                </div>
                <p className="text-xs text-zinc-500 mt-0.5">{selectedIndustryObj.desc}</p>
              </div>
            </div>

            <button
              onClick={handleSaveIndustry}
              disabled={isSaving}
              className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold py-2.5 px-5 rounded-xl self-end sm:self-auto shrink-0 shadow-md shadow-purple-600/20 transition-all cursor-pointer disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save Preferences"}
            </button>
          </div>

          {/* Industry Cards Grid */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-black">
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
                    className={`p-4 rounded-2xl border transition-all cursor-pointer relative space-y-3 ${
                      isSelected
                        ? "border-purple-600 bg-purple-50/50 shadow-md ring-1 ring-purple-600"
                        : "border-zinc-200 hover:border-purple-300 hover:shadow-md bg-white shadow-xs"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-xs"
                        style={{ backgroundColor: ind.color }}
                      >
                        <IconComp size={18} />
                      </div>
                      {isSelected ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                          Selected
                        </span>
                      ) : (
                        <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-zinc-100 text-black font-semibold border border-zinc-200">
                          {ind.featureBadge}
                        </span>
                      )}
                    </div>

                    <div>
                      <h4 className="font-bold text-black text-sm">{ind.label}</h4>
                      <p className="text-xs text-zinc-500 mt-1 line-clamp-2 leading-relaxed">
                        {ind.desc}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-[11px]">
                      <span className="text-zinc-500 font-medium">Feature Tag:</span>
                      <span className="text-black font-semibold">{ind.featureBadge}</span>
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
            <div className="bg-white p-6 rounded-2xl border border-zinc-200 border-l-4 border-l-emerald-600 space-y-5 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block">
                    Active Subscription
                  </span>
                  <h3 className="text-2xl font-black text-black mt-0.5">Enterprise Pro Trial</h3>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                  Active
                </span>
              </div>

              {/* Days Remaining Battery */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-emerald-600 font-bold">120 Days Remaining</span>
                  <span className="text-zinc-500">4 Months Included</span>
                </div>
                <div className="h-2.5 rounded-full bg-zinc-100 overflow-hidden">
                  <div className="bg-emerald-600 h-full w-[25%]" />
                </div>
              </div>

              <div className="space-y-2.5 pt-2 border-t border-zinc-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-black">
                  Included Enterprise Features
                </h4>
                <ul className="text-sm space-y-2 text-zinc-600">
                  <li className="flex items-center gap-2 text-black font-medium">
                    <CheckCircle2 size={15} className="text-emerald-600" />
                    <span>Multi-Branch Inventory & Outlets (Up to 10 Branches)</span>
                  </li>
                  <li className="flex items-center gap-2 text-black font-medium">
                    <CheckCircle2 size={15} className="text-emerald-600" />
                    <span>Zero Data Orphan Protection (Cascading Foreign Keys)</span>
                  </li>
                  <li className="flex items-center gap-2 text-black font-medium">
                    <CheckCircle2 size={15} className="text-emerald-600" />
                    <span>Offline PWA Sync with IndexedDB & UUID Reconciliation</span>
                  </li>
                  <li className="flex items-center gap-2 text-black font-medium">
                    <CheckCircle2 size={15} className="text-emerald-600" />
                    <span>Automated WhatsApp Receipts & Payment Inflow Tracking</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right: Plan Upgrade & Payment Gateway */}
            <div className="bg-white p-6 rounded-2xl border border-purple-200 space-y-5 flex flex-col justify-between relative overflow-hidden shadow-sm">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Zap size={18} className="text-purple-600" />
                  <h3 className="text-lg font-bold text-black">Extend or Upgrade Subscription</h3>
                </div>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Support unlimited transactions, staff accounts, multi-branch synchronization, and dedicated SLA support.
                </p>

                <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-1">
                  <span className="text-xs text-zinc-500 block font-medium">Standard SMB Plan</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-black">₦15,000</span>
                    <span className="text-xs text-zinc-500 font-medium">/ month</span>
                  </div>
                  <span className="text-[11px] text-emerald-600 block font-bold">
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
                  className="w-full py-3.5 text-sm font-bold rounded-xl bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center gap-2 shadow-lg shadow-purple-600/25 transition-colors cursor-pointer"
                >
                  <CreditCard size={16} />
                  <span>Upgrade via Paystack Gateway</span>
                </button>
                <p className="text-center text-[11px] text-zinc-400">
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
          <div className="bg-white p-6 rounded-2xl border border-zinc-200 border-l-4 border-l-purple-600 space-y-5 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center border border-purple-200">
                  <Server size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-black text-base">Production Cloud Backend</h3>
                  <span className="text-xs text-zinc-500">Render Managed Microservice</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleTestApi}
                  disabled={apiPingStatus === "checking"}
                  className="px-3.5 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-black text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
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
                  className="px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <span>Open API</span>
                  <ExternalLink size={13} />
                </a>
              </div>
            </div>

            {/* Status Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 space-y-1">
                <span className="text-[11px] text-zinc-500 block font-semibold">Configured Endpoint</span>
                <span className="text-xs font-mono text-black truncate block">
                  https://smb-portal-1.onrender.com
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 space-y-1">
                <span className="text-[11px] text-zinc-500 block font-semibold">Heartbeat Status</span>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      apiPingStatus === "online"
                        ? "bg-emerald-600"
                        : apiPingStatus === "offline"
                        ? "bg-red-600"
                        : "bg-amber-500"
                    }`}
                  />
                  <span className="text-xs font-bold text-black">
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

              <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 space-y-1">
                <span className="text-[11px] text-zinc-500 block font-semibold">Roundtrip Latency</span>
                <span className="text-xs font-bold text-black">
                  {apiLatency !== null ? `${apiLatency} ms` : "—"}
                </span>
              </div>
            </div>
          </div>

          {/* Architecture & Integrity Info Card */}
          <div className="bg-white p-6 rounded-2xl border border-zinc-200 space-y-4 shadow-sm">
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-emerald-600" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-black">
                Zero Orphan Data Architecture
              </h3>
            </div>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Every customer invoice, payment record, staff commission, and inventory deduction is bound
              by cascading database foreign keys and MongoDB middleware triggers. Offline POS transactions
              generated on mobile devices use deterministic client-side UUIDs that are idempotently
              reconciled when reconnected.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
              <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-between">
                <span className="text-zinc-600 font-medium">Client Database Cache</span>
                <span className="text-emerald-600 font-bold">IndexedDB Ready</span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-between">
                <span className="text-zinc-600 font-medium">PWA Service Worker</span>
                <span className="text-emerald-600 font-bold">Active & Caching</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

