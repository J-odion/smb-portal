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
  Smartphone,
  WifiOff,
  ArrowRight,
  Sparkles,
  BarChart3,
  TrendingUp,
  MessageSquare,
  Building2,
  Check
} from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"pos" | "inventory" | "crm">("pos");

  return (
    <div className="min-h-screen bg-primary text-primary overflow-x-hidden font-sans">
      {/* Subtle Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-brand-500/10 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute top-[600px] right-0 w-[600px] h-[600px] bg-purple-500/10 blur-[160px] pointer-events-none rounded-full" />

      {/* Modern Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-500 to-blue-400 flex items-center justify-center text-white font-extrabold shadow-md shadow-brand-500/30">
              <Sparkles size={20} />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-white block leading-tight">
                SMB Portal
              </span>
              <span className="text-[10px] text-secondary font-semibold uppercase tracking-wider block">
                Monday Workspace
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-secondary">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#board-preview" className="hover:text-white transition-colors">Workspace Board</a>
            <a href="#offline-pos" className="hover:text-white transition-colors">Offline POS</a>
            <a href="#architecture" className="hover:text-white transition-colors">Enterprise Cloud</a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-semibold text-secondary hover:text-white transition-colors px-3 py-2"
            >
              Log In
            </Link>
            <Link
              href="/signup"
              className="btn btn-primary text-xs md:text-sm font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-brand-500/25"
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
          <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-white shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#00c875] animate-pulse" />
            <span>Built for Modern African Retailers, Salons, Tailors & Multi-Branch SMBs</span>
          </div>

          {/* Headline */}
          <h1 className="h1 text-white">
            Run your business on a workspace <br className="hidden md:block" />
            <span className="gradient-text">that actually feels modern.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-secondary max-w-2xl leading-relaxed">
            Multi-branch inventory, rapid offline POS cashiering, automated WhatsApp receipts, and staff payroll — unified in one clean Monday.com board.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
            <Link
              href="/signup"
              className="btn btn-primary text-base font-bold px-8 py-3.5 rounded-xl shadow-xl shadow-brand-500/30 w-full sm:w-auto"
            >
              <span>Start Free 14-Day Trial</span>
              <ArrowRight size={18} className="ml-2" />
            </Link>
            <Link
              href="/dashboard"
              className="btn btn-secondary text-base font-bold px-8 py-3.5 rounded-xl w-full sm:w-auto flex items-center justify-center gap-2"
            >
              <Zap size={18} className="text-brand-400" />
              <span>Explore Live Workspace</span>
            </Link>
          </div>

          {/* Trust Guarantees */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-secondary pt-2">
            <span className="flex items-center gap-1.5 text-white">
              <CheckCircle2 size={15} className="text-[#00c875]" />
              No credit card required
            </span>
            <span className="flex items-center gap-1.5 text-white">
              <CheckCircle2 size={15} className="text-[#00c875]" />
              Works 100% offline via PWA
            </span>
            <span className="flex items-center gap-1.5 text-white">
              <CheckCircle2 size={15} className="text-[#00c875]" />
              Zero orphaned data architecture
            </span>
          </div>
        </section>

        {/* HIGH-FIDELITY MONDAY.COM BOARD HERO MOCKUP */}
        <section id="board-preview" className="relative">
          {/* Floating Live Sync Card Top Left */}
          <div className="absolute -top-6 -left-4 md:-left-8 z-20 glass p-3.5 rounded-2xl border border-white/10 shadow-2xl flex items-center gap-3 bg-secondary/95 animate-bounce-slow">
            <div className="w-10 h-10 rounded-xl bg-[#00c875]/20 text-[#00c875] flex items-center justify-center font-bold">
              <Check size={20} />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">Offline POS Synced</span>
              <span className="text-[11px] text-secondary">Idempotent UUID Reconciled</span>
            </div>
          </div>

          {/* Floating Revenue Badge Bottom Right */}
          <div className="absolute -bottom-6 -right-4 md:-right-8 z-20 glass p-4 rounded-2xl border border-white/10 shadow-2xl bg-secondary/95">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center">
                <TrendingUp size={18} />
              </div>
              <div>
                <span className="text-[11px] text-secondary font-medium block">Weekly Revenue</span>
                <span className="text-base font-black text-white">₦3,850,000</span>
              </div>
            </div>
            <div className="monday-battery h-2 w-32 rounded-full overflow-hidden bg-white/10">
              <div className="bg-[#00c875] h-full w-[78%]" />
            </div>
          </div>

          {/* Main Board Container */}
          <div className="glass rounded-3xl border border-white/15 p-5 md:p-8 shadow-2xl bg-secondary/90 backdrop-blur-2xl overflow-hidden space-y-6">
            {/* Mock Board Header */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0073ea] flex items-center justify-center text-white font-bold shadow-md">
                  <Receipt size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span>Main Sales & Inventory Board</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#00c875]/20 text-[#00c875] font-bold">
                      Branch: Ikeja HQ
                    </span>
                  </h3>
                  <p className="text-xs text-secondary">
                    Active pulse &bull; 48 live transactions recorded today
                  </p>
                </div>
              </div>

              {/* View Switchers */}
              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-lg bg-brand-500 text-white text-xs font-bold shadow-sm">
                  📋 Table View
                </span>
                <span className="px-3 py-1.5 rounded-lg bg-white/5 text-secondary text-xs font-semibold">
                  🃏 Cards View
                </span>
                <span className="px-3 py-1.5 rounded-lg bg-white/5 text-secondary text-xs font-semibold">
                  ⚡ Fast POS
                </span>
              </div>
            </div>

            {/* Target Progress Battery */}
            <div className="p-4 rounded-xl bg-primary/60 border border-white/5 space-y-2">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-secondary">Branch Weekly Goal (₦5,000,000 Target)</span>
                <span className="text-[#00c875]">78% Achieved &bull; Net Margin 64%</span>
              </div>
              <div className="monday-battery w-full h-2.5 rounded-full bg-white/5 overflow-hidden">
                <div style={{ width: "70%" }} className="bg-[#00c875] h-full" />
                <div style={{ width: "20%" }} className="bg-[#fdab3d] h-full" />
                <div style={{ width: "10%" }} className="bg-[#e2445c] h-full" />
              </div>
            </div>

            {/* High-Fidelity Table Rows */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-secondary uppercase font-bold tracking-wider">
                    <th className="pb-3 px-2">Item / Service Name</th>
                    <th className="pb-3 px-2">Customer Client</th>
                    <th className="pb-3 px-2">Payment Channel</th>
                    <th className="pb-3 px-2">Amount (₦)</th>
                    <th className="pb-3 px-2 text-center">Monday Status</th>
                    <th className="pb-3 px-2 text-right">Receipt Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr className="hover:bg-white/[0.02]">
                    <td className="py-3.5 px-2 font-bold text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#00c875]" />
                      <span>Vintage Italian Fabric Suit (3 Pcs)</span>
                    </td>
                    <td className="py-3.5 px-2 text-secondary">Chief Adeleke (VIP)</td>
                    <td className="py-3.5 px-2 text-secondary">POS Terminal (Card)</td>
                    <td className="py-3.5 px-2 font-extrabold text-white">₦285,000</td>
                    <td className="py-3.5 px-2 text-center">
                      <span className="monday-pill monday-pill-done !text-[11px] !py-0.5">Paid</span>
                    </td>
                    <td className="py-3.5 px-2 text-right">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#00c875]/15 text-[#00c875] font-semibold text-[11px]">
                        <MessageSquare size={12} />
                        <span>WhatsApp Sent</span>
                      </span>
                    </td>
                  </tr>

                  <tr className="hover:bg-white/[0.02]">
                    <td className="py-3.5 px-2 font-bold text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#fdab3d]" />
                      <span>Samsung Galaxy S24 Ultra 512GB</span>
                    </td>
                    <td className="py-3.5 px-2 text-secondary">Chioma Eze Enterprise</td>
                    <td className="py-3.5 px-2 text-secondary">Bank Transfer (Pending)</td>
                    <td className="py-3.5 px-2 font-extrabold text-white">₦1,450,000</td>
                    <td className="py-3.5 px-2 text-center">
                      <span className="monday-pill monday-pill-working !text-[11px] !py-0.5">Working</span>
                    </td>
                    <td className="py-3.5 px-2 text-right">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-brand-500/15 text-brand-400 font-semibold text-[11px]">
                        <span>Awaiting Alert</span>
                      </span>
                    </td>
                  </tr>

                  <tr className="hover:bg-white/[0.02]">
                    <td className="py-3.5 px-2 font-bold text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#00c875]" />
                      <span>Full Grooming, Facial & Beard Spa</span>
                    </td>
                    <td className="py-3.5 px-2 text-secondary">David Adeleke</td>
                    <td className="py-3.5 px-2 text-secondary">POS Cash Tender</td>
                    <td className="py-3.5 px-2 font-extrabold text-white">₦45,000</td>
                    <td className="py-3.5 px-2 text-center">
                      <span className="monday-pill monday-pill-done !text-[11px] !py-0.5">Paid</span>
                    </td>
                    <td className="py-3.5 px-2 text-right">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#00c875]/15 text-[#00c875] font-semibold text-[11px]">
                        <MessageSquare size={12} />
                        <span>Receipt Ready</span>
                      </span>
                    </td>
                  </tr>

                  <tr className="hover:bg-white/[0.02]">
                    <td className="py-3.5 px-2 font-bold text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#e2445c]" />
                      <span>Generator Fuel & Logistics Log</span>
                    </td>
                    <td className="py-3.5 px-2 text-secondary">Station Operations</td>
                    <td className="py-3.5 px-2 text-secondary">Cash Outflow</td>
                    <td className="py-3.5 px-2 font-extrabold text-[#e2445c]">₦24,500</td>
                    <td className="py-3.5 px-2 text-center">
                      <span className="monday-pill monday-pill-stuck !text-[11px] !py-0.5">Stuck</span>
                    </td>
                    <td className="py-3.5 px-2 text-right">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 text-secondary font-semibold text-[11px]">
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
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">
              Engineered for how African commerce actually happens
            </h2>
            <p className="text-secondary text-sm md:text-base">
              Say goodbye to clunky foreign ERPs that crash when your internet dips or don't support WhatsApp receipts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="glass p-6 rounded-2xl border border-white/10 border-l-4 border-l-[#00c875] space-y-4 hover:border-white/20 transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#00c875]/20 text-[#00c875] flex items-center justify-center font-bold">
                <WifiOff size={22} />
              </div>
              <h3 className="font-bold text-white text-lg">100% Offline POS</h3>
              <p className="text-xs text-secondary leading-relaxed">
                Network gone? Keep scanning barcodes and charging customers without skipping a beat. Transactions auto-reconcile seamlessly.
              </p>
            </div>

            <div className="glass p-6 rounded-2xl border border-white/10 border-l-4 border-l-[#0073ea] space-y-4 hover:border-white/20 transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#0073ea]/20 text-[#0073ea] flex items-center justify-center font-bold">
                <MessageSquare size={22} />
              </div>
              <h3 className="font-bold text-white text-lg">WhatsApp Receipts</h3>
              <p className="text-xs text-secondary leading-relaxed">
                Save paper printer roll costs. Tap once to fire a beautifully formatted digital receipt with PDF proof directly to customer chats.
              </p>
            </div>

            <div className="glass p-6 rounded-2xl border border-white/10 border-l-4 border-l-[#fdab3d] space-y-4 hover:border-white/20 transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#fdab3d]/20 text-[#fdab3d] flex items-center justify-center font-bold">
                <Building2 size={22} />
              </div>
              <h3 className="font-bold text-white text-lg">Multi-Branch Outlets</h3>
              <p className="text-xs text-secondary leading-relaxed">
                Manage your Ikeja HQ, Lekki branch, and Abuja store in one workspace. Transfer stock and compare branch profits in real-time.
              </p>
            </div>

            <div className="glass p-6 rounded-2xl border border-white/10 border-l-4 border-l-[#a25ddc] space-y-4 hover:border-white/20 transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#a25ddc]/20 text-[#a25ddc] flex items-center justify-center font-bold">
                <ShieldCheck size={22} />
              </div>
              <h3 className="font-bold text-white text-lg">Zero Data Orphans</h3>
              <p className="text-xs text-secondary leading-relaxed">
                Hardened cascading MongoDB schemas ensure every invoice, inventory deduction, and staff payroll record remains 100% intact.
              </p>
            </div>
          </div>
        </section>

        {/* ENTERPRISE ARCHITECTURE BANNER */}
        <section id="architecture" className="glass p-8 md:p-12 rounded-3xl border border-white/10 space-y-6 bg-gradient-to-br from-secondary to-primary">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-400">
                Production Decoupled Cloud Architecture
              </span>
              <h3 className="text-2xl md:text-3xl font-extrabold text-white">
                Powered by Render Backend & Vercel Edge
              </h3>
              <p className="text-xs md:text-sm text-secondary max-w-xl">
                Microservice NestJS backend hosted on Render (<code className="text-brand-300">https://smb-portal-1.onrender.com</code>) with sub-millisecond Next.js web caching on Vercel Edge.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-center">
                <span className="text-2xl font-black text-white block">99.98%</span>
                <span className="text-[10px] text-secondary">Uptime SLA</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-center">
                <span className="text-2xl font-black text-[#00c875] block">&lt; 45ms</span>
                <span className="text-[10px] text-secondary">Lagos Latency</span>
              </div>
            </div>
          </div>
        </section>

        {/* BOTTOM CTA SECTION */}
        <section className="glass p-10 md:p-16 rounded-3xl border border-brand-500/30 text-center space-y-6 relative overflow-hidden bg-gradient-to-b from-brand-900/60 to-primary">
          <div className="space-y-3 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white">
              Ready to modernize your business operations?
            </h2>
            <p className="text-sm md:text-base text-secondary">
              Join hundreds of African store owners, boutiques, and service studios operating on the SMB Portal.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/signup"
              className="btn btn-primary text-base font-bold px-10 py-4 rounded-xl shadow-xl shadow-brand-500/30 w-full sm:w-auto"
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

          <p className="text-xs text-secondary pt-2">
            Free 14-day trial &bull; Instant setup &bull; Cancel anytime
          </p>
        </section>
      </main>

      {/* Modern Footer */}
      <footer className="border-t border-white/10 bg-primary/80 py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-secondary">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">SMB Portal</span>
            <span>&bull;</span>
            <span>&copy; {new Date().getFullYear()} All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/login" className="hover:text-white transition-colors">Portal Login</Link>
            <Link href="/signup" className="hover:text-white transition-colors">Sign Up</Link>
            <a href="https://smb-portal-1.onrender.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">API Endpoint</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
