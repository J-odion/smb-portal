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
    <div className="min-h-screen w-full bg-zinc-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans text-black">
      {/* Centered Modern Enterprise Container */}
      <div className="max-w-5xl w-full bg-white rounded-3xl border border-zinc-200 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        {/* Left Column - Signup Form */}
        <div className="flex flex-col justify-between p-8 sm:p-12 bg-white">
          <div className="flex justify-between items-center mb-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-purple-600 flex items-center justify-center text-white font-bold shadow-sm shadow-purple-600/30">
                <Sparkles size={16} />
              </div>
              <span className="font-extrabold text-black text-sm">SMB Portal</span>
            </Link>

            <span className="text-xs text-zinc-600">
              Already have an account?{" "}
              <Link href="/login" className="text-purple-600 font-bold hover:underline">
                Log in
              </Link>
            </span>
          </div>

          <div className="space-y-6 my-auto">
            <div className="space-y-1.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-black">Create your workspace</h1>
              <p className="text-xs text-zinc-500">
                Start your free 14-day trial. No credit card required.
              </p>
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold flex items-center gap-2.5 animate-fade-in">
                <AlertCircle size={16} className="shrink-0 text-red-600" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSignup} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-black uppercase tracking-wider">
                  Business / Store Name
                </label>
                <div className="relative">
                  <Building2 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Apex Luxury Clothiers"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-zinc-300 text-black placeholder-zinc-400 text-sm focus:border-purple-600 focus:ring-1 focus:ring-purple-600 outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-black uppercase tracking-wider">
                  Work Email Address
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="owner@business.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-zinc-300 text-black placeholder-zinc-400 text-sm focus:border-purple-600 focus:ring-1 focus:ring-purple-600 outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-black uppercase tracking-wider">
                  Industry Module Template
                </label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-zinc-300 text-black text-sm focus:border-purple-600 focus:ring-1 focus:ring-purple-600 outline-none transition-colors cursor-pointer"
                >
                  <option value="RETAIL">General Retail / Mart (Barcode Scanner Ready)</option>
                  <option value="TAILOR">Tailoring & Fashion (Custom Measurements)</option>
                  <option value="SALON">Barbing, Salon & Spa (Staff Commissions)</option>
                  <option value="FOOD">Restaurant / Food Vendor (Kitchen Orders)</option>
                  <option value="PHOTOGRAPHY">Photography Studio (Session Bookings)</option>
                  <option value="BOOK_STORE">Book Store & Stationery (ISBN)</option>
                  <option value="GYM_FITNESS">Gym & Fitness Studio (Passes)</option>
                  <option value="AUTO_REPAIR">Auto Repair & Garage (Job Cards)</option>
                  <option value="REAL_ESTATE">Real Estate & Agency (Units)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-black uppercase tracking-wider">
                  Create Password
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white border border-zinc-300 text-black placeholder-zinc-400 text-sm focus:border-purple-600 focus:ring-1 focus:ring-purple-600 outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 mt-2 text-sm font-bold rounded-xl bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center gap-2 shadow-md shadow-purple-600/25 transition-all cursor-pointer disabled:opacity-50"
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

              <p className="text-[11px] text-center text-zinc-500 pt-1">
                By signing up, you agree to our Terms of Service and Privacy Policy. All data is protected with zero-orphan cascading isolation.
              </p>
            </form>
          </div>

          <div className="text-center text-xs text-zinc-500 pt-4">
            Render Cloud Backend Active &bull; Vercel Edge Cache
          </div>
        </div>

        {/* Right Column - Brand Showcase */}
        <div className="hidden lg:flex flex-col justify-between p-10 bg-zinc-50 border-l border-zinc-200">
          <div className="w-full flex justify-end">
            <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              Instant Provisioning Active
            </span>
          </div>

          <div className="space-y-6 my-auto py-8">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-600">
                Why 1,200+ Businesses Choose Us
              </span>
              <h2 className="text-3xl font-extrabold text-black leading-tight">
                Workflows that actually <br />
                <span className="text-purple-600">make business flow.</span>
              </h2>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-xs space-y-1.5">
                <div className="flex items-center gap-2">
                  <Check size={16} className="text-emerald-600" />
                  <h4 className="text-xs font-bold text-black">Full Multi-Branch Sync</h4>
                </div>
                <p className="text-[12px] text-zinc-600 leading-relaxed">
                  Connect your Ikeja, Lekki, and Abuja locations. Real-time centralized stock counts and profit tracking.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-xs space-y-1.5">
                <div className="flex items-center gap-2">
                  <Check size={16} className="text-emerald-600" />
                  <h4 className="text-xs font-bold text-black">Automated WhatsApp Invoicing</h4>
                </div>
                <p className="text-[12px] text-zinc-600 leading-relaxed">
                  Send professional digital receipts directly to customer WhatsApp chats with one tap. Zero thermal paper expense.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-xs space-y-1.5">
                <div className="flex items-center gap-2">
                  <Check size={16} className="text-emerald-600" />
                  <h4 className="font-bold text-black text-sm">Unbreakable Offline POS</h4>
                </div>
                <p className="text-[12px] text-zinc-600 leading-relaxed">
                  Keep processing sales with local IndexedDB storage when internet cuts out. Synced automatically once reconnected.
                </p>
              </div>
            </div>
          </div>

          <div className="text-xs text-zinc-500 flex items-center justify-between pt-4 border-t border-zinc-200">
            <span>&copy; {new Date().getFullYear()} SMB Portal</span>
            <span className="text-emerald-600 font-semibold">99.98% System Uptime SLA</span>
          </div>
        </div>
      </div>
    </div>
  );
}
