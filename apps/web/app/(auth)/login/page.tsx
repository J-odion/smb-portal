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
  ShieldCheck,
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
    <div className="min-h-screen w-full bg-zinc-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans text-black">
      {/* Centered Modern Enterprise Container */}
      <div className="max-w-5xl w-full bg-white rounded-3xl border border-zinc-200 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        {/* Left Column - Showcase & Brand Panel */}
        <div className="hidden lg:flex flex-col justify-between p-10 bg-zinc-50 border-r border-zinc-200">
          {/* Brand Header */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-600 flex items-center justify-center text-white font-extrabold shadow-sm shadow-purple-600/30">
              <Sparkles size={22} />
            </div>
            <div>
              <span className="font-extrabold text-lg text-black block leading-tight">
                SMB Portal
              </span>
              <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">HosOS Workspace</span>
            </div>
          </div>

          {/* Center Content */}
          <div className="space-y-6 my-auto py-8">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-600">
                Modern Enterprise Operations
              </span>
              <h2 className="text-3xl font-extrabold text-black leading-tight">
                Manage your entire business <br />
                <span className="text-purple-600">in one clean workspace.</span>
              </h2>
              <p className="text-sm text-zinc-600 leading-relaxed">
                Real-time POS cashiering, zero orphan customer records, automated WhatsApp digital receipts, and staff payroll tiers.
              </p>
            </div>

            {/* Showcase Feature Cards */}
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-white border border-zinc-200 shadow-xs flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                    <Receipt size={17} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-black">Daily Revenue Pulse</h4>
                    <span className="text-[11px] text-zinc-500">48 live sales recorded today</span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                  ₦355,500
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-zinc-200 shadow-xs flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                    <Store size={17} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-black">Multi-Branch Outlets</h4>
                    <span className="text-[11px] text-zinc-500">Main HQ (Ikeja) &bull; Lekki Branch</span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700 border border-purple-200">
                  Online
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-zinc-200 shadow-xs flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                    <Zap size={17} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-black">100% Offline PWA Mode</h4>
                    <span className="text-[11px] text-zinc-500">Zero dropped transactions</span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700 border border-purple-200">
                  Ready
                </span>
              </div>
            </div>
          </div>

          {/* Footer Info */}
          <div className="text-xs text-zinc-500 flex items-center justify-between pt-4 border-t border-zinc-200">
            <span>&copy; {new Date().getFullYear()} SMB Portal Inc.</span>
            <span className="flex items-center gap-1.5 text-emerald-600 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              Cloud API Active
            </span>
          </div>
        </div>

        {/* Right Column - Clean Login Form */}
        <div className="flex flex-col justify-between p-8 sm:p-12 bg-white">
          <div className="flex justify-between items-center mb-6">
            <Link href="/" className="lg:hidden flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-purple-600 flex items-center justify-center text-white font-bold">
                <Sparkles size={16} />
              </div>
              <span className="font-extrabold text-black text-sm">SMB Portal</span>
            </Link>

            <span className="text-xs text-zinc-600 ml-auto">
              Don't have an account?{" "}
              <Link href="/signup" className="text-purple-600 font-bold hover:underline">
                Sign up
              </Link>
            </span>
          </div>

          <div className="space-y-6 my-auto">
            <div className="space-y-1.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-black">Log in to your account</h1>
              <p className="text-xs text-zinc-500">
                Enter your credentials to access your store workspaces.
              </p>
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold flex items-center gap-2.5 animate-fade-in">
                <AlertCircle size={16} className="shrink-0 text-red-600" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-black uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-zinc-300 text-black placeholder-zinc-400 text-sm focus:border-purple-600 focus:ring-1 focus:ring-purple-600 outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-black uppercase tracking-wider">
                    Password
                  </label>
                  <a href="#" className="text-[11px] text-zinc-500 hover:text-black transition-colors">
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-3 rounded-xl bg-white border border-zinc-300 text-black placeholder-zinc-400 text-sm focus:border-purple-600 focus:ring-1 focus:ring-purple-600 outline-none transition-colors"
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

              {/* Purple Button with White Text */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 text-sm font-bold rounded-xl bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center gap-2 shadow-md shadow-purple-600/25 transition-all cursor-pointer disabled:opacity-50"
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

          <div className="text-center text-xs text-zinc-500 pt-6">
            Protected by 256-bit SSL cloud encryption &bull; Render microservice
          </div>
        </div>
      </div>
    </div>
  );
}

