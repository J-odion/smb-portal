"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  ArrowRight,
  Sparkles,
  MapPin,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Store
} from "lucide-react";

export default function OnboardingWizard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [businessName, setBusinessName] = useState("");
  const [industry, setIndustry] = useState("RETAIL");
  const [address, setAddress] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");

  const getToken = () => {
    if (typeof window === "undefined") return "";
    return (
      localStorage.getItem("token") ||
      document.cookie.split("; ").find((row) => row.startsWith("token="))?.split("=")[1] ||
      ""
    );
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const token = getToken();
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const res = await fetch("/api/tenant/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          if (data.name) setBusinessName(data.name);
          if (data.industry) setIndustry(data.industry);
          if (data.address) setAddress(data.address);
          if (data.bank_name) setBankName(data.bank_name);
          if (data.account_no) setAccountNumber(data.account_no);
          if (data.account_name) setAccountName(data.account_name);
        }
      } catch (err) {
        console.warn("Could not load initial profile", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const token = getToken();
    try {
      const res = await fetch("/api/tenant/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: businessName,
          industry,
          address,
          bank_name: bankName,
          account_no: accountNumber,
          account_name: accountName,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to update business settings");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 700);
    } catch (err: any) {
      setError(err.message || "Failed to save configuration. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-zinc-50 flex items-center justify-center p-4 font-sans text-black">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-purple-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Loading workspace setup...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 font-sans text-black animate-fade-in">
      <div className="w-full max-w-2xl bg-white border border-zinc-200 rounded-3xl p-6 sm:p-10 shadow-xl space-y-8">
        {/* Brand & Progress Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-600 flex items-center justify-center text-white font-extrabold shadow-sm shadow-purple-600/30">
              <Sparkles size={20} />
            </div>
            <div>
              <span className="font-extrabold text-base text-black block leading-tight">SMB Portal</span>
              <span className="text-[11px] text-zinc-500 font-semibold uppercase tracking-wider">Workspace Onboarding</span>
            </div>
          </div>
          <div className="px-3 py-1 rounded-full bg-purple-50 text-purple-700 font-bold text-xs border border-purple-200">
            Step 1 of 1
          </div>
        </div>

        {/* Title Intro */}
        <div className="space-y-1.5">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-black">Set up your business profile</h1>
          <p className="text-xs sm:text-sm text-zinc-600">
            Configure your store information, industry module template, and settlement credentials for automated receipts.
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold flex items-center gap-2.5 animate-fade-in">
            <AlertCircle size={16} className="shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-2.5 animate-fade-in">
            <CheckCircle2 size={16} className="shrink-0 text-emerald-600" />
            <span>Workspace profile configured! Redirecting to your dashboard...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Business Profile */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-600">
              <Store size={15} />
              <span>General Store Info</span>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="businessName" className="text-xs font-bold text-black uppercase tracking-wider">
                Store / Business Name
              </label>
              <input
                type="text"
                id="businessName"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. Apex Luxury Clothiers"
                className="w-full px-4 py-3 rounded-xl bg-white border border-zinc-300 text-black placeholder-zinc-400 text-sm focus:border-purple-600 focus:ring-1 focus:ring-purple-600 outline-none transition-all"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="industry" className="text-xs font-bold text-black uppercase tracking-wider">
                Industry Module Template
              </label>
              <select
                id="industry"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white border border-zinc-300 text-black text-sm focus:border-purple-600 focus:ring-1 focus:ring-purple-600 outline-none transition-all cursor-pointer"
                required
              >
                <option value="RETAIL">General Retail & Supermarket (POS Barcode Ready)</option>
                <option value="TAILOR">Tailoring & Bespoke Fashion (Measurement Sheets)</option>
                <option value="SALON">Barbing, Hair Salon & Spa (Staff Commission Splits)</option>
                <option value="FOOD">Restaurant, Lounge & Food Vendor (Kitchen Slips)</option>
                <option value="BOOK_STORE">Bookstore & Stationery (Inventory ISBN)</option>
                <option value="PHOTOGRAPHY">Photography & Film Studio (Session Schedule)</option>
                <option value="GYM_FITNESS">Gym, Fitness & Yoga Club (Pass Subscriptions)</option>
                <option value="AUTO_REPAIR">Auto Repair & Garage (Job Cards)</option>
                <option value="REAL_ESTATE">Real Estate & Property Agency (Rent Units)</option>
              </select>
              <p className="text-[11px] text-zinc-500">
                Tailors dashboard shortcuts and item catalogs to your industry workflow.
              </p>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="address" className="text-xs font-bold text-black uppercase tracking-wider">
                Physical Store / Outlet Address
              </label>
              <div className="relative">
                <MapPin size={16} className="absolute left-3.5 top-3.5 text-zinc-400" />
                <textarea
                  id="address"
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. 14 Admiralty Way, Lekki Phase 1, Lagos"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-zinc-300 text-black placeholder-zinc-400 text-sm focus:border-purple-600 focus:ring-1 focus:ring-purple-600 outline-none transition-all resize-none"
                />
              </div>
            </div>
          </div>

          <hr className="border-zinc-200" />

          {/* Section 2: Bank Settlement Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-600">
              <CreditCard size={15} />
              <span>Bank Settlement Details</span>
            </div>
            <p className="text-xs text-zinc-500 -mt-2">
              Printed on your customer WhatsApp receipts and digital invoices for bank transfers.
            </p>

            <div className="space-y-1.5">
              <label htmlFor="bankName" className="text-xs font-bold text-black uppercase tracking-wider">
                Bank Name
              </label>
              <input
                type="text"
                id="bankName"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="e.g. GTBank / Access Bank / Zenith Bank"
                className="w-full px-4 py-3 rounded-xl bg-white border border-zinc-300 text-black placeholder-zinc-400 text-sm focus:border-purple-600 focus:ring-1 focus:ring-purple-600 outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="accountNumber" className="text-xs font-bold text-black uppercase tracking-wider">
                  Account Number
                </label>
                <input
                  type="text"
                  id="accountNumber"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="10-digit NUBAN"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-zinc-300 text-black placeholder-zinc-400 text-sm focus:border-purple-600 focus:ring-1 focus:ring-purple-600 outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="accountName" className="text-xs font-bold text-black uppercase tracking-wider">
                  Account Holder Name
                </label>
                <input
                  type="text"
                  id="accountName"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  placeholder="Official Account Name"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-zinc-300 text-black placeholder-zinc-400 text-sm focus:border-purple-600 focus:ring-1 focus:ring-purple-600 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="w-full sm:flex-1 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-purple-600/25 transition-all cursor-pointer disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving Configuration...</span>
                </>
              ) : (
                <>
                  <span>Save & Launch Workspace</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-zinc-50 border border-zinc-300 text-black font-semibold text-sm transition-all cursor-pointer"
            >
              Skip to Dashboard
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
