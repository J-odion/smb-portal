"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Mail,
  Lock,
  Building2,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  Check
} from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [industry, setIndustry] = useState("RETAIL");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, businessName, industry }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to create account. Please try again.");
      }

      const token = data.access_token;
      document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax`;
      localStorage.setItem("token", token);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Error creating account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 font-sans">
      {/* Left Column - Clean Light Signup Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-12 overflow-y-auto">
        <div className="w-full flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-500 to-blue-400 flex items-center justify-center text-white font-bold shadow-md shadow-brand-500/25">
              <Sparkles size={16} />
            </div>
            <span className="font-extrabold text-slate-900 text-sm">SMB Portal</span>
          </Link>

          <span className="text-xs text-slate-600">
            Already have an account?{" "}
            <Link href="/login" className="text-brand-600 font-bold hover:underline">
              Log in
            </Link>
          </span>
        </div>

        <div className="my-auto max-w-md w-full mx-auto py-8 space-y-6">
          <div className="space-y-1.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Create your workspace</h1>
            <p className="text-xs text-slate-600">
              Start your free 14-day trial. No credit card required.
            </p>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold flex items-center gap-2.5 animate-fade-in">
              <AlertCircle size={16} className="shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Business / Store Name
              </label>
              <div className="relative">
                <Building2 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Apex Luxury Clothiers"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:border-brand-500 outline-none transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Work Email Address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="owner@business.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:border-brand-500 outline-none transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Industry Module Template
              </label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full p-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:border-brand-500 outline-none cursor-pointer"
              >
                <option value="RETAIL">General Retail / Mart (Barcode Scanner Ready)</option>
                <option value="TAILOR">Tailoring & Fashion (Custom Measurements)</option>
                <option value="SALON">Barbing, Salon & Spa (Staff Commissions)</option>
                <option value="FOOD">Restaurant / Food Vendor (Kitchen Orders)</option>
                <option value="PHOTOGRAPHY">Photography Studio (Session Bookings)</option>
                <option value="BOOK_STORE">Book Store & Stationery (ISBN)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Create Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:border-brand-500 outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full py-3.5 text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-brand-500/25 rounded-xl"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Creating Workspace...</span>
                </>
              ) : (
                <>
                  <span>Create Workspace & Start</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <p className="text-[11px] text-slate-500 text-center leading-relaxed">
            By signing up, you agree to our Terms of Service and Privacy Policy. All data is protected with zero-orphan cascading isolation.
          </p>
        </div>

        <div className="text-center text-xs text-slate-500">
          Render Cloud Backend Active &bull; Vercel Edge Cache
        </div>
      </div>

      {/* Right Column - Monday.com Light Showcase Panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden bg-gradient-to-br from-indigo-50/50 via-blue-50/40 to-slate-50 border-l border-slate-200/80">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-400/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-400/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10 flex items-center justify-end gap-2 text-xs text-slate-500">
          <span className="w-2 h-2 rounded-full bg-[#00c875]" />
          <span>Instant Provisioning Active</span>
        </div>

        <div className="relative z-10 space-y-6 max-w-lg my-auto">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
              Why 1,200+ Businesses Choose Us
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 leading-tight">
              Workflows that actually <br />
              <span className="gradient-text">make business flow.</span>
            </h2>
          </div>

          <div className="space-y-3 pt-2">
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-1.5">
              <div className="flex items-center gap-2">
                <Check size={16} className="text-[#00c875]" />
                <h4 className="text-xs font-bold text-slate-900">Full Multi-Branch Sync</h4>
              </div>
              <p className="text-[12px] text-slate-600 leading-relaxed">
                Connect your Ikeja, Lekki, and Abuja locations. Real-time centralized stock counts and profit tracking.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-1.5">
              <div className="flex items-center gap-2">
                <Check size={16} className="text-[#00c875]" />
                <h4 className="text-xs font-bold text-slate-900">Automated WhatsApp Invoicing</h4>
              </div>
              <p className="text-[12px] text-slate-600 leading-relaxed">
                Send professional digital receipts directly to customer WhatsApp chats with one tap. Zero thermal paper expense.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-1.5">
              <div className="flex items-center gap-2">
                <Check size={16} className="text-[#00c875]" />
                <h4 className="text-xs font-bold text-slate-900">Unbreakable Offline POS</h4>
              </div>
              <p className="text-[12px] text-slate-600 leading-relaxed">
                Keep processing sales with local IndexedDB storage when internet cuts out. Synced automatically once reconnected.
              </p>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-slate-500 flex items-center justify-between pt-4 border-t border-slate-200">
          <span>&copy; {new Date().getFullYear()} SMB Portal</span>
          <span className="text-slate-700 font-medium">99.98% System Uptime SLA</span>
        </div>
      </div>
    </div>
  );
}
