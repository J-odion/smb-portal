"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Zap,
  ShoppingBag,
  Users,
  Receipt,
  Package,
  CheckCircle2,
  ShieldCheck,
  WifiOff,
  ArrowRight,
  Sparkles,
  TrendingUp,
  MessageSquare,
  Building2,
  Check
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100/50 to-blue-50/30 text-slate-900 overflow-x-hidden font-sans">
      {/* Subtle Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-400/10 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute top-[600px] right-0 w-[600px] h-[600px] bg-purple-400/10 blur-[160px] pointer-events-none rounded-full" />

      {/* Modern Light Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200/90 shadow-2xs">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-500 to-blue-400 flex items-center justify-center text-white font-extrabold shadow-md shadow-brand-500/25">
              <Sparkles size={20} />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-slate-900 block leading-tight">
                SMB Portal
              </span>
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">
                Monday Workspace
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
            <a href="#board-preview" className="hover:text-slate-900 transition-colors">Workspace Board</a>
            <a href="#offline-pos" className="hover:text-slate-900 transition-colors">Offline POS</a>
            <a href="#architecture" className="hover:text-slate-900 transition-colors">Enterprise Cloud</a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors px-3 py-2"
            >
              Log In
            </Link>
            <Link
              href="/signup"
              className="btn btn-primary text-xs md:text-sm font-bold px-5 py-2.5 rounded-xl shadow-md shadow-brand-500/25"
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
          <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-brand-700 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#00c875] animate-pulse" />
            <span>Built for Modern African Retailers, Salons, Tailors & Multi-Branch SMBs</span>
          </div>

          {/* Headline */}
          <h1 className="h1 text-slate-900">
            Run your business on a workspace <br className="hidden md:block" />
            <span className="gradient-text">that actually feels modern.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl leading-relaxed">
            Multi-branch inventory, rapid offline POS cashiering, automated WhatsApp receipts, and staff payroll — unified in one clean Monday.com board.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
            <Link
              href="/signup"
              className="btn btn-primary text-base font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-brand-500/25 w-full sm:w-auto"
            >
              <span>Start Free 14-Day Trial</span>
              <ArrowRight size={18} className="ml-2" />
            </Link>
            <Link
              href="/dashboard"
              className="btn btn-secondary text-base font-bold px-8 py-3.5 rounded-xl w-full sm:w-auto flex items-center justify-center gap-2"
            >
              <Zap size={18} className="text-brand-600" />
              <span>Explore Live Workspace</span>
            </Link>
          </div>

          {/* Trust Guarantees */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-slate-600 pt-2">
            <span className="flex items-center gap-1.5 text-slate-700">
              <CheckCircle2 size={15} className="text-[#00c875]" />
              No credit card required
            </span>
            <span className="flex items-center gap-1.5 text-slate-700">
              <CheckCircle2 size={15} className="text-[#00c875]" />
              Works 100% offline via PWA
            </span>
            <span className="flex items-center gap-1.5 text-slate-700">
              <CheckCircle2 size={15} className="text-[#00c875]" />
              Zero orphaned data architecture
            </span>
          </div>
        </section>

        {/* HIGH-FIDELITY MONDAY.COM BOARD HERO MOCKUP IN LIGHT THEME */}
        <section id="board-preview" className="relative">
          {/* Floating Live Sync Card Top Left */}
          <div className="absolute -top-6 -left-4 md:-left-8 z-20 bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#00c875] flex items-center justify-center font-bold">
              <Check size={20} />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block">Offline POS Synced</span>
              <span className="text-[11px] text-slate-500">Idempotent UUID Reconciled</span>
            </div>
          </div>

          {/* Floating Revenue Badge Bottom Right */}
          <div className="absolute -bottom-6 -right-4 md:-right-8 z-20 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-brand-600 flex items-center justify-center">
                <TrendingUp size={18} />
              </div>
              <div>
                <span className="text-[11px] text-slate-500 font-medium block">Weekly Revenue</span>
                <span className="text-base font-black text-slate-900">₦3,850,000</span>
              </div>
            </div>
            <div className="monday-battery h-2 w-32 rounded-full overflow-hidden bg-slate-100">
              <div className="bg-[#00c875] h-full w-[78%]" />
            </div>
          </div>

          {/* Main Board Container */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 md:p-8 shadow-xl space-y-6">
            {/* Mock Board Header */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0073ea] flex items-center justify-center text-white font-bold shadow-md shadow-brand-500/20">
                  <Receipt size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <span>Main Sales & Inventory Board</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-[#00c875] font-bold border border-emerald-200">
                      Branch: Ikeja HQ
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Active pulse &bull; 48 live transactions recorded today
                  </p>
                </div>
              </div>

              {/* View Switchers */}
              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-lg bg-brand-500 text-white text-xs font-bold shadow-xs">
                  📋 Table View
                </span>
                <span className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-xs font-semibold">
                  🃏 Cards View
                </span>
                <span className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-xs font-semibold">
                  ⚡ Fast POS
                </span>
              </div>
            </div>

            {/* Target Progress Battery */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-slate-600">Branch Weekly Goal (₦5,000,000 Target)</span>
                <span className="text-[#00c875]">78% Achieved &bull; Net Margin 64%</span>
              </div>
              <div className="monday-battery w-full h-2.5 rounded-full bg-slate-200/80 overflow-hidden">
                <div style={{ width: "70%" }} className="bg-[#00c875] h-full" />
                <div style={{ width: "20%" }} className="bg-[#fdab3d] h-full" />
                <div style={{ width: "10%" }} className="bg-[#e2445c] h-full" />
              </div>
            </div>

            {/* High-Fidelity Table Rows */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase font-bold tracking-wider">
                    <th className="pb-3 px-2">Item / Service Name</th>
                    <th className="pb-3 px-2">Customer Client</th>
                    <th className="pb-3 px-2">Payment Channel</th>
                    <th className="pb-3 px-2">Amount (₦)</th>
                    <th className="pb-3 px-2 text-center">Monday Status</th>
                    <th className="pb-3 px-2 text-right">Receipt Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-2 font-bold text-slate-900 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#00c875]" />
                      <span>Vintage Italian Fabric Suit (3 Pcs)</span>
                    </td>
                    <td className="py-3.5 px-2 text-slate-600">Chief Adeleke (VIP)</td>
                    <td className="py-3.5 px-2 text-slate-600">POS Terminal (Card)</td>
                    <td className="py-3.5 px-2 font-extrabold text-slate-900">₦285,000</td>
                    <td className="py-3.5 px-2 text-center">
                      <span className="monday-pill monday-pill-done !text-[11px] !py-0.5">Paid</span>
                    </td>
                    <td className="py-3.5 px-2 text-right">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-[#00c875] font-semibold text-[11px] border border-emerald-100">
                        <MessageSquare size={12} />
                        <span>WhatsApp Sent</span>
                      </span>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-2 font-bold text-slate-900 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#fdab3d]" />
                      <span>Samsung Galaxy S24 Ultra 512GB</span>
                    </td>
                    <td className="py-3.5 px-2 text-slate-600">Chioma Eze Enterprise</td>
                    <td className="py-3.5 px-2 text-slate-600">Bank Transfer (Pending)</td>
                    <td className="py-3.5 px-2 font-extrabold text-slate-900">₦1,450,000</td>
                    <td className="py-3.5 px-2 text-center">
                      <span className="monday-pill monday-pill-working !text-[11px] !py-0.5">Working</span>
                    </td>
                    <td className="py-3.5 px-2 text-right">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-brand-600 font-semibold text-[11px] border border-blue-100">
                        <span>Awaiting Alert</span>
                      </span>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-2 font-bold text-slate-900 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#00c875]" />
                      <span>Full Grooming, Facial & Beard Spa</span>
                    </td>
                    <td className="py-3.5 px-2 text-slate-600">David Adeleke</td>
                    <td className="py-3.5 px-2 text-slate-600">POS Cash Tender</td>
                    <td className="py-3.5 px-2 font-extrabold text-slate-900">₦45,000</td>
                    <td className="py-3.5 px-2 text-center">
                      <span className="monday-pill monday-pill-done !text-[11px] !py-0.5">Paid</span>
                    </td>
                    <td className="py-3.5 px-2 text-right">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-[#00c875] font-semibold text-[11px] border border-emerald-100">
                        <MessageSquare size={12} />
                        <span>Receipt Ready</span>
                      </span>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-2 font-bold text-slate-900 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#e2445c]" />
                      <span>Generator Fuel & Logistics Log</span>
                    </td>
                    <td className="py-3.5 px-2 text-slate-600">Station Operations</td>
                    <td className="py-3.5 px-2 text-slate-600">Cash Outflow</td>
                    <td className="py-3.5 px-2 font-extrabold text-[#e2445c]">₦24,500</td>
                    <td className="py-3.5 px-2 text-center">
                      <span className="monday-pill monday-pill-stuck !text-[11px] !py-0.5">Stuck</span>
                    </td>
                    <td className="py-3.5 px-2 text-right">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-500 font-semibold text-[11px] border border-slate-200">
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
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">
              Engineered for how African commerce actually happens
            </h2>
            <p className="text-slate-600 text-sm md:text-base">
              Say goodbye to clunky foreign ERPs that crash when your internet dips or don't support WhatsApp receipts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 border-l-4 border-l-[#00c875] space-y-4 shadow-xs hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#00c875] flex items-center justify-center font-bold">
                <WifiOff size={22} />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">100% Offline POS</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Network down? Keep scanning barcodes and charging customers without skipping a beat. Transactions auto-reconcile seamlessly.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 border-l-4 border-l-[#0073ea] space-y-4 shadow-xs hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-brand-600 flex items-center justify-center font-bold">
                <MessageSquare size={22} />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">WhatsApp Receipts</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Save paper printer roll costs. Tap once to fire a beautifully formatted digital receipt with PDF proof directly to customer chats.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 border-l-4 border-l-[#fdab3d] space-y-4 shadow-xs hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <Building2 size={22} />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">Multi-Branch Outlets</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Manage your Ikeja HQ, Lekki branch, and Abuja store in one workspace. Transfer stock and compare branch profits in real-time.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 border-l-4 border-l-[#a25ddc] space-y-4 shadow-xs hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-[#a25ddc] flex items-center justify-center font-bold">
                <ShieldCheck size={22} />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">Zero Data Orphans</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Hardened cascading MongoDB schemas ensure every invoice, inventory deduction, and staff payroll record remains 100% intact.
              </p>
            </div>
          </div>
        </section>

        {/* ENTERPRISE ARCHITECTURE BANNER */}
        <section id="architecture" className="bg-white p-8 md:p-12 rounded-3xl border border-slate-200 space-y-6 shadow-xs">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
                Production Decoupled Cloud Architecture
              </span>
              <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900">
                Powered by Render Backend & Vercel Edge
              </h3>
              <p className="text-xs md:text-sm text-slate-600 max-w-xl">
                Microservice NestJS backend hosted on Render (<code className="text-brand-600 bg-slate-100 px-2 py-0.5 rounded">https://smb-portal-1.onrender.com</code>) with sub-millisecond Next.js web caching on Vercel Edge.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-2xl font-black text-slate-900 block">99.98%</span>
                <span className="text-[10px] text-slate-500">Uptime SLA</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-2xl font-black text-[#00c875] block">&lt; 45ms</span>
                <span className="text-[10px] text-slate-500">Lagos Latency</span>
              </div>
            </div>
          </div>
        </section>

        {/* BOTTOM CTA SECTION */}
        <section className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-10 md:p-16 rounded-3xl text-center space-y-6 text-white shadow-xl">
          <div className="space-y-3 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white">
              Ready to modernize your business operations?
            </h2>
            <p className="text-sm md:text-base text-blue-100">
              Join hundreds of African store owners, boutiques, and service studios operating on the SMB Portal.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/signup"
              className="btn bg-white text-brand-700 hover:bg-slate-100 text-base font-bold px-10 py-4 rounded-xl shadow-lg w-full sm:w-auto transition-transform hover:scale-105"
            >
              <span>Get Started Now</span>
              <ArrowRight size={18} className="ml-2 text-brand-700" />
            </Link>
            <Link
              href="/login"
              className="btn bg-white/10 hover:bg-white/20 text-white border border-white/20 text-base font-bold px-8 py-4 rounded-xl w-full sm:w-auto"
            >
              <span>Log In to Workspace</span>
            </Link>
          </div>

          <p className="text-xs text-blue-200 pt-2">
            Free 14-day trial &bull; Instant setup &bull; Cancel anytime
          </p>
        </section>
      </main>

      {/* Modern Light Footer */}
      <footer className="border-t border-slate-200 bg-white py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">SMB Portal</span>
            <span>&bull;</span>
            <span>&copy; {new Date().getFullYear()} All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/login" className="hover:text-slate-900 transition-colors">Portal Login</Link>
            <Link href="/signup" className="hover:text-slate-900 transition-colors">Sign Up</Link>
            <a href="https://smb-portal-1.onrender.com" target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 transition-colors">API Endpoint</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
