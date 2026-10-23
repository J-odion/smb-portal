"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  Receipt,
  Store,
  Zap,
  CheckCircle2
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Invalid credentials. Please verify your email and password.");
      }

      const token = data.access_token;
      document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax`;
      localStorage.setItem("token", token);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Login failed. Please verify your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 font-sans">
      {/* Left Column - Monday.com Light Showcase Panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden bg-gradient-to-br from-blue-50/80 via-indigo-50/40 to-slate-50 border-r border-slate-200/80">
        {/* Subtle decorative circles */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-400/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-400/10 blur-[100px] rounded-full pointer-events-none" />

        {/* Brand Header */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-500 to-blue-400 flex items-center justify-center text-white font-extrabold shadow-md shadow-brand-500/25">
            <Sparkles size={22} />
          </div>
          <div>
            <span className="font-extrabold text-lg text-slate-900 block leading-tight">
              SMB Portal
            </span>
            <span className="text-xs text-slate-500 font-medium">Monday Workspace</span>
          </div>
        </div>

        {/* Center High-Fidelity Light Preview Cards */}
        <div className="relative z-10 space-y-6 max-w-lg my-auto">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
              Modern Enterprise Operations
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 leading-tight">
              Manage your entire business <br />
              <span className="gradient-text">in one clean workspace.</span>
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Real-time POS cashiering, zero orphan customer records, automated WhatsApp digital receipts, and staff payroll tiers.
            </p>
          </div>

          {/* Real Showcase Cards in Light Theme */}
          <div className="space-y-3 pt-2">
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#00c875]/15 text-[#00c875] flex items-center justify-center font-bold">
                  <Receipt size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Daily Revenue Pulse</h4>
                  <span className="text-[11px] text-slate-500">48 sales recorded today</span>
                </div>
              </div>
              <span className="monday-pill monday-pill-done !text-[11px] !py-0.5">₦355,500</span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-500/15 text-brand-600 flex items-center justify-center font-bold">
                  <Store size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Multi-Branch Outlets</h4>
                  <span className="text-[11px] text-slate-500">Main HQ (Ikeja) &bull; Lekki Outlet</span>
                </div>
              </div>
              <span className="monday-pill monday-pill-info !text-[11px] !py-0.5">Online</span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#a25ddc]/15 text-[#a25ddc] flex items-center justify-center font-bold">
                  <Zap size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">100% Offline PWA Mode</h4>
                  <span className="text-[11px] text-slate-500">Zero dropped transactions</span>
                </div>
              </div>
              <span className="monday-pill monday-pill-review !text-[11px] !py-0.5">Ready</span>
            </div>
          </div>
        </div>

        {/* Left Footer */}
        <div className="relative z-10 text-xs text-slate-500 flex items-center justify-between pt-4 border-t border-slate-200">
          <span>&copy; {new Date().getFullYear()} SMB Portal Inc.</span>
          <span className="flex items-center gap-1.5 text-[#00c875] font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#00c875]" />
            Cloud API Active
          </span>
        </div>
      </div>

      {/* Right Column - Clean Light Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-12 overflow-y-auto">
        <div className="w-full flex justify-between items-center">
          <Link href="/" className="lg:hidden flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center text-white font-bold">
              S
            </div>
            <span className="font-extrabold text-slate-900 text-sm">SMB Portal</span>
          </Link>

          <span className="text-xs text-slate-600 ml-auto">
            Don't have an account?{" "}
            <Link href="/signup" className="text-brand-600 font-bold hover:underline">
              Sign up
            </Link>
          </span>
        </div>

        <div className="my-auto max-w-md w-full mx-auto py-8 space-y-6">
          <div className="space-y-1.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Log in to your account</h1>
            <p className="text-xs text-slate-600">
              Enter your credentials to access your store workspaces.
            </p>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold flex items-center gap-2.5 animate-fade-in">
              <AlertCircle size={16} className="shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:border-brand-500 outline-none transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <a href="#" className="text-[11px] text-slate-500 hover:text-slate-800 transition-colors">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
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
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="text-center text-xs text-slate-500">
          Protected by 256-bit SSL cloud encryption &bull; Render microservice
        </div>
      </div>
    </div>
  );
}
