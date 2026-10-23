"use client";

import Link from "next/link";
import {
  Zap,
  CheckCircle2,
  ShieldCheck,
  WifiOff,
  ArrowRight,
  Sparkles,
  TrendingUp,
  MessageSquare,
  Building2,
  Check,
  Receipt
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-black overflow-x-hidden font-sans">
      {/* Modern Clean White Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-zinc-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center text-white font-extrabold shadow-sm shadow-purple-600/30">
              <Sparkles size={20} />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-black block leading-tight">
                SMB Portal
              </span>
              <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider block">
                HosOS Workspace
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-zinc-600">
            <a href="#features" className="hover:text-black transition-colors">Features</a>
            <a href="#board-preview" className="hover:text-black transition-colors">Workspace Board</a>
            <a href="#offline-pos" className="hover:text-black transition-colors">Offline POS</a>
            <a href="#architecture" className="hover:text-black transition-colors">Enterprise Cloud</a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-semibold text-zinc-700 hover:text-black transition-colors px-3 py-2"
            >
              Log In
            </Link>
            <Link
              href="/signup"
              className="btn btn-primary text-xs md:text-sm font-bold px-5 py-2.5 rounded-xl"
            >
              <span>Get Started Free</span>
              <ArrowRight size={15} className="ml-1" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="pt-36 pb-20 relative z-10 max-w-7xl mx-auto px-6 space-y-28">
        {/* HERO SECTION */}
        <section className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-purple-50 border border-purple-200 text-xs font-bold text-purple-700 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Built for Modern African Retailers, Salons, Tailors & Multi-Branch SMBs</span>
          </div>

          {/* Headline */}
          <h1 className="h1 text-black font-extrabold">
            Run your business on a workspace <br className="hidden md:block" />
            <span className="gradient-text">that actually feels modern.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-zinc-600 max-w-2xl leading-relaxed">
            Multi-branch inventory, rapid offline POS cashiering, automated WhatsApp receipts, and staff payroll — unified in one clean HosOS board.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
            <Link
              href="/signup"
              className="btn btn-primary text-base font-bold px-8 py-3.5 rounded-xl shadow-md shadow-purple-600/25 w-full sm:w-auto"
            >
              <span>Start Free 14-Day Trial</span>
              <ArrowRight size={18} className="ml-2" />
            </Link>
            <Link
              href="/dashboard"
              className="btn btn-secondary text-base font-bold px-8 py-3.5 rounded-xl w-full sm:w-auto flex items-center justify-center gap-2"
            >
              <Zap size={18} className="text-purple-600" />
              <span>Explore Live Workspace</span>
            </Link>
          </div>

          {/* Trust Guarantees */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-zinc-600 pt-2">
            <span className="flex items-center gap-1.5 text-zinc-800">
              <CheckCircle2 size={15} className="text-emerald-600" />
              No credit card required
            </span>
            <span className="flex items-center gap-1.5 text-zinc-800">
              <CheckCircle2 size={15} className="text-emerald-600" />
              Works 100% offline via PWA
            </span>
            <span className="flex items-center gap-1.5 text-zinc-800">
              <CheckCircle2 size={15} className="text-emerald-600" />
              Zero orphaned data architecture
            </span>
          </div>
        </section>

        {/* HIGH-FIDELITY BOARD HERO MOCKUP IN PURE WHITE THEME */}
        <section id="board-preview" className="relative">
          {/* Floating Live Sync Card Top Left */}
          <div className="absolute -top-6 -left-4 md:-left-8 z-20 bg-white p-3.5 rounded-2xl border border-zinc-200 shadow-md flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Check size={20} />
            </div>
            <div>
              <span className="text-xs font-bold text-black block">Offline POS Synced</span>
              <span className="text-[11px] text-zinc-500 font-medium">Idempotent UUID Reconciled</span>
            </div>
          </div>

          {/* Floating Revenue Badge Bottom Right */}
          <div className="absolute -bottom-6 -right-4 md:-right-8 z-20 bg-white p-4 rounded-2xl border border-zinc-200 shadow-md">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <TrendingUp size={18} />
              </div>
              <div>
                <span className="text-[11px] text-zinc-500 font-medium block">Weekly Revenue</span>
                <span className="text-base font-black text-black">₦3,850,000</span>
              </div>
            </div>
            <div className="monday-battery h-2 w-32 rounded-full overflow-hidden bg-zinc-100">
              <div className="bg-emerald-600 h-full w-[78%]" />
            </div>
          </div>

          {/* Main Board Container */}
          <div className="bg-white rounded-3xl border border-zinc-200 p-5 md:p-8 shadow-sm space-y-6">
            {/* Mock Board Header */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-zinc-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white font-bold shadow-sm shadow-purple-600/30">
                  <Receipt size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-black flex items-center gap-2">
                    <span>Main Sales & Inventory Board</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                      Branch: Ikeja HQ
                    </span>
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Active pulse &bull; 48 live transactions recorded today
                  </p>
                </div>
              </div>

              {/* View Switchers */}
              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-lg bg-purple-600 text-white text-xs font-bold shadow-xs">
                  📋 Table View
                </span>
                <span className="px-3 py-1.5 rounded-lg bg-zinc-100 text-zinc-700 text-xs font-semibold">
                  🃏 Cards View
                </span>
                <span className="px-3 py-1.5 rounded-lg bg-zinc-100 text-zinc-700 text-xs font-semibold">
                  ⚡ Fast POS
                </span>
              </div>
            </div>

            {/* Target Progress Battery */}
            <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-2">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-zinc-700">Branch Weekly Goal (₦5,000,000 Target)</span>
                <span className="text-emerald-700 font-bold">78% Achieved &bull; Net Margin 64%</span>
              </div>
              <div className="monday-battery w-full h-2.5 rounded-full bg-zinc-200 overflow-hidden">
                <div style={{ width: "70%" }} className="bg-emerald-600 h-full" />
                <div style={{ width: "20%" }} className="bg-amber-500 h-full" />
                <div style={{ width: "10%" }} className="bg-red-600 h-full" />
              </div>
            </div>

            {/* High-Fidelity Table Rows */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-zinc-200 text-zinc-500 uppercase font-bold tracking-wider">
                    <th className="pb-3 px-2">Item / Service Name</th>
                    <th className="pb-3 px-2">Customer Client</th>
                    <th className="pb-3 px-2">Payment Channel</th>
                    <th className="pb-3 px-2">Amount (₦)</th>
                    <th className="pb-3 px-2 text-center">Status</th>
                    <th className="pb-3 px-2 text-right">Receipt Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  <tr className="hover:bg-zinc-50/80 transition-colors">
                    <td className="py-3.5 px-2 font-bold text-black flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-600" />
                      <span>Vintage Italian Fabric Suit (3 Pcs)</span>
                    </td>
                    <td className="py-3.5 px-2 text-zinc-700">Chief Adeleke (VIP)</td>
                    <td className="py-3.5 px-2 text-zinc-700">POS Terminal (Card)</td>
                    <td className="py-3.5 px-2 font-extrabold text-black">₦285,000</td>
                    <td className="py-3.5 px-2 text-center">
                      <span className="monday-pill monday-pill-done !text-[11px] !py-0.5">Paid</span>
                    </td>
                    <td className="py-3.5 px-2 text-right">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-semibold text-[11px] border border-emerald-200">
                        <MessageSquare size={12} />
                        <span>WhatsApp Sent</span>
                      </span>
                    </td>
                  </tr>

                  <tr className="hover:bg-zinc-50/80 transition-colors">
                    <td className="py-3.5 px-2 font-bold text-black flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      <span>Samsung Galaxy S24 Ultra 512GB</span>
                    </td>
                    <td className="py-3.5 px-2 text-zinc-700">Chioma Eze Enterprise</td>
                    <td className="py-3.5 px-2 text-zinc-700">Bank Transfer (Pending)</td>
                    <td className="py-3.5 px-2 font-extrabold text-black">₦1,450,000</td>
                    <td className="py-3.5 px-2 text-center">
                      <span className="monday-pill monday-pill-working !text-[11px] !py-0.5">Working</span>
                    </td>
                    <td className="py-3.5 px-2 text-right">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 font-semibold text-[11px] border border-amber-200">
                        <span>Awaiting Alert</span>
                      </span>
                    </td>
                  </tr>

                  <tr className="hover:bg-zinc-50/80 transition-colors">
                    <td className="py-3.5 px-2 font-bold text-black flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-600" />
                      <span>Full Grooming, Facial & Beard Spa</span>
                    </td>
                    <td className="py-3.5 px-2 text-zinc-700">David Adeleke</td>
                    <td className="py-3.5 px-2 text-zinc-700">POS Cash Tender</td>
                    <td className="py-3.5 px-2 font-extrabold text-black">₦45,000</td>
                    <td className="py-3.5 px-2 text-center">
                      <span className="monday-pill monday-pill-done !text-[11px] !py-0.5">Paid</span>
                    </td>
                    <td className="py-3.5 px-2 text-right">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-semibold text-[11px] border border-emerald-200">
                        <MessageSquare size={12} />
                        <span>Receipt Ready</span>
                      </span>
                    </td>
                  </tr>

                  <tr className="hover:bg-zinc-50/80 transition-colors">
                    <td className="py-3.5 px-2 font-bold text-black flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-600" />
                      <span>Generator Fuel & Logistics Log</span>
                    </td>
                    <td className="py-3.5 px-2 text-zinc-700">Station Operations</td>
                    <td className="py-3.5 px-2 text-zinc-700">Cash Outflow</td>
                    <td className="py-3.5 px-2 font-extrabold text-red-600">₦24,500</td>
                    <td className="py-3.5 px-2 text-center">
                      <span className="monday-pill monday-pill-stuck !text-[11px] !py-0.5">Stuck</span>
                    </td>
                    <td className="py-3.5 px-2 text-right">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-50 text-red-700 font-semibold text-[11px] border border-red-200">
                        <span>Audit Log</span>
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* 4 CORE ADVANTAGES */}
        <section id="features" className="space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-extrabold text-black">
              Engineered for how African commerce actually happens
            </h2>
            <p className="text-zinc-600 text-sm md:text-base">
              Say goodbye to clunky foreign ERPs that crash when your internet dips or don't support WhatsApp receipts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white p-6 rounded-2xl border border-zinc-200 border-l-4 border-l-emerald-600 space-y-4 shadow-xs hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <WifiOff size={22} />
              </div>
              <h3 className="font-bold text-black text-lg">100% Offline POS</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Network down? Keep scanning barcodes and charging customers without skipping a beat. Transactions auto-reconcile seamlessly.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-zinc-200 border-l-4 border-l-purple-600 space-y-4 shadow-xs hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                <MessageSquare size={22} />
              </div>
              <h3 className="font-bold text-black text-lg">WhatsApp Receipts</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Save paper printer roll costs. Tap once to fire a beautifully formatted digital receipt with PDF proof directly to customer chats.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-zinc-200 border-l-4 border-l-amber-500 space-y-4 shadow-xs hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <Building2 size={22} />
              </div>
              <h3 className="font-bold text-black text-lg">Multi-Branch Outlets</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Manage your Ikeja HQ, Lekki branch, and Abuja store in one workspace. Transfer stock and compare branch profits in real-time.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-zinc-200 border-l-4 border-l-purple-700 space-y-4 shadow-xs hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                <ShieldCheck size={22} />
              </div>
              <h3 className="font-bold text-black text-lg">Zero Data Orphans</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Hardened cascading MongoDB schemas ensure every invoice, inventory deduction, and staff payroll record remains 100% intact.
              </p>
            </div>
          </div>
        </section>

        {/* ENTERPRISE ARCHITECTURE BANNER */}
        <section id="architecture" className="bg-white p-8 md:p-12 rounded-3xl border border-zinc-200 space-y-6 shadow-xs">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-600">
                Production Decoupled Cloud Architecture
              </span>
              <h3 className="text-2xl md:text-3xl font-extrabold text-black">
                Powered by Render Backend & Vercel Edge
              </h3>
              <p className="text-xs md:text-sm text-zinc-600 max-w-xl">
                Microservice NestJS backend hosted on Render (<code className="text-purple-600 bg-zinc-100 px-2 py-0.5 rounded">https://smb-portal-1.onrender.com</code>) with sub-millisecond Next.js web caching on Vercel Edge.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 text-center">
                <span className="text-2xl font-black text-black block">99.98%</span>
                <span className="text-[10px] text-zinc-500">Uptime SLA</span>
              </div>
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 text-center">
                <span className="text-2xl font-black text-emerald-600 block">&lt; 45ms</span>
                <span className="text-[10px] text-zinc-500">Lagos Latency</span>
              </div>
            </div>
          </div>
        </section>

        {/* BOTTOM CTA SECTION - CLEAN WHITE THEME WITH PURPLE BUTTONS */}
        <section className="bg-purple-50/70 p-10 md:p-16 rounded-3xl border border-purple-200 text-center space-y-6 text-black shadow-xs">
          <div className="space-y-3 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-extrabold text-black">
              Ready to modernize your business operations?
            </h2>
            <p className="text-sm md:text-base text-zinc-600">
              Join hundreds of African store owners, boutiques, and service studios operating on the SMB Portal.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/signup"
              className="btn btn-primary text-base font-bold px-10 py-4 rounded-xl shadow-md w-full sm:w-auto"
            >
              <span>Get Started Now</span>
              <ArrowRight size={18} className="ml-2" />
            </Link>
            <Link
              href="/login"
              className="btn btn-secondary text-base font-bold px-8 py-4 rounded-xl w-full sm:w-auto"
            >
              <span>Log In to Workspace</span>
            </Link>
          </div>

          <p className="text-xs text-zinc-500 pt-2">
            Free 14-day trial &bull; Instant setup &bull; Cancel anytime
          </p>
        </section>
      </main>

      {/* Modern Clean Footer */}
      <footer className="border-t border-zinc-200 bg-white py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-black">SMB Portal</span>
            <span>&bull;</span>
            <span>&copy; {new Date().getFullYear()} All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/login" className="hover:text-black transition-colors">Portal Login</Link>
            <Link href="/signup" className="hover:text-black transition-colors">Sign Up</Link>
            <a href="https://smb-portal-1.onrender.com" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors">API Endpoint</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
