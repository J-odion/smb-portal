"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Zap,
  Receipt,
  Package,
  Users,
  DollarSign,
  Briefcase,
  Shield,
  Settings,
  LogOut,
  Menu,
  X,
  Store,
  ChevronDown,
  Search,
  Wifi,
  Sparkles
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeBranch, setActiveBranch] = useState("Main HQ (Ikeja)");
  const pathname = usePathname();

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/pos", label: "POS Terminal", icon: Zap, isPrimary: true },
    { href: "/invoices", label: "Transactions", icon: Receipt },
    { href: "/inventory", label: "Inventory", icon: Package },
    { href: "/customers", label: "Customers", icon: Users },
    { href: "/expenses", label: "Expenses", icon: DollarSign },
    { href: "/staff", label: "Staff & Payroll", icon: Briefcase },
    { href: "/team", label: "Team Members", icon: Shield },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  const handleLogout = () => {
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="flex min-h-screen bg-primary text-primary pb-20 md:pb-0">
      {/* Desktop / Tablet Monday Sidebar */}
      <aside className="w-64 glass border-r border-white/10 hidden md:flex flex-col p-4 h-screen sticky top-0 overflow-y-auto shrink-0 z-30">
        {/* Brand Header */}
        <div className="mb-6 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-500 to-blue-400 flex items-center justify-center text-white font-extrabold shadow-md shadow-brand-500/30">
              <Sparkles size={20} />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-white block leading-tight">
                SMB Portal
              </span>
              <span className="text-[11px] text-secondary font-medium block">
                Monday Workspace
              </span>
            </div>
          </Link>
        </div>

        {/* Branch Selector Pill */}
        <div className="mb-5 p-2 rounded-xl bg-white/[0.03] border border-white/5">
          <div className="flex items-center justify-between text-[11px] text-secondary font-semibold uppercase tracking-wider mb-1.5 px-1">
            <span className="flex items-center gap-1">
              <Store size={12} className="text-brand-400" />
              Active Branch
            </span>
            <span className="w-2 h-2 rounded-full bg-[#00c875]" />
          </div>
          <div className="relative">
            <select
              value={activeBranch}
              onChange={(e) => setActiveBranch(e.target.value)}
              className="w-full py-1.5 px-2 text-xs font-semibold rounded-lg bg-secondary text-white border border-white/10 focus:border-brand-500 outline-none appearance-none cursor-pointer"
            >
              <option value="Main HQ (Ikeja)">Main HQ (Ikeja)</option>
              <option value="Branch 2 (Lekki)">Branch 2 (Lekki)</option>
              <option value="Branch 3 (Abuja)">Branch 3 (Abuja)</option>
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-secondary pointer-events-none" />
          </div>
        </div>

        {/* Quick Launch POS Button */}
        <Link
          href="/pos"
          className="btn btn-primary justify-center py-2.5 mb-4 gap-2 text-white font-bold shadow-lg shadow-brand-500/25 text-xs rounded-xl"
        >
          <Zap size={16} />
          <span>Launch POS Terminal</span>
        </Link>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-1 flex-1">
          <span className="text-[10px] font-bold text-secondary uppercase tracking-wider px-3 mb-1">
            Core Workspaces
          </span>
          {navLinks.map((link) => {
            if (link.isPrimary) return null;
            const isActive = pathname === link.href;
            const IconComp = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-brand-500/15 text-white border-l-4 border-brand-500 shadow-sm"
                    : "text-secondary hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                <IconComp
                  size={16}
                  className={isActive ? "text-brand-400" : "text-secondary"}
                />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom User Roster & Sign Out */}
        <div className="pt-3 mt-auto border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-brand-500/20 text-brand-400 font-bold flex items-center justify-center text-xs border border-brand-500/30">
              AD
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-white block truncate max-w-[100px]">
                Owner Account
              </span>
              <span className="text-[10px] text-secondary block">Lagos HQ</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-secondary hover:text-danger-400 rounded-lg hover:bg-danger-500/10 transition-colors"
            title="Sign Out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Desktop Top Workspace Bar */}
        <header className="hidden md:flex glass border-b border-white/5 sticky top-0 z-20 px-8 py-3 items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-secondary">
              Monday Board
            </span>
            <span className="text-secondary/40">/</span>
            <span className="text-xs font-semibold text-white px-2.5 py-0.5 rounded-full bg-white/5 border border-white/5">
              {activeBranch}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Live API Heartbeat Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00c875]/10 border border-[#00c875]/30 text-[#00c875] text-[11px] font-semibold">
              <Wifi size={12} />
              <span>Cloud API Connected</span>
            </div>

            <Link
              href="/pos"
              className="px-3.5 py-1.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-brand-500/20 transition-all"
            >
              <Zap size={14} />
              <span>Quick POS</span>
            </Link>
          </div>
        </header>

        {/* Mobile Top Header (Brand, Active Branch, Drawer Trigger) */}
        <header className="md:hidden glass border-b border-white/5 sticky top-0 z-40 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-500 to-blue-400 flex items-center justify-center text-white font-bold shadow-md">
              <Sparkles size={16} />
            </div>
            <div>
              <span className="text-sm font-extrabold text-white leading-none block">
                SMB Portal
              </span>
              <span className="text-[10px] text-secondary flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00c875]" />
                {activeBranch}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="p-2 text-secondary hover:text-white rounded-lg bg-white/5 border border-white/10 text-xs font-semibold flex items-center gap-1.5"
              aria-label="Open Navigation Menu"
            >
              <Menu size={16} />
              <span>Menu</span>
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Mobile Slide-Up Navigation Drawer */}
      {isDrawerOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end">
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm animate-fade-in"
            onClick={() => setIsDrawerOpen(false)}
          />

          <div className="relative glass border-t border-white/10 rounded-t-3xl p-6 max-h-[85vh] overflow-y-auto z-10 animate-fade-in shadow-2xl flex flex-col gap-4">
            <div className="flex justify-between items-center pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center text-white font-bold">
                  S
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Navigation Menu</h2>
                  <p className="text-[11px] text-secondary">Switch workspace or select branch</p>
                </div>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20"
              >
                <X size={16} />
              </button>
            </div>

            {/* Branch Selector */}
            <div className="space-y-1">
              <label className="text-[11px] text-secondary uppercase font-bold tracking-wider">
                Select Active Branch
              </label>
              <select
                value={activeBranch}
                onChange={(e) => setActiveBranch(e.target.value)}
                className="w-full p-3 rounded-xl bg-secondary text-white text-sm border border-white/10 outline-none"
              >
                <option value="Main HQ (Ikeja)">Main HQ (Ikeja)</option>
                <option value="Branch 2 (Lekki)">Branch 2 (Lekki)</option>
                <option value="Branch 3 (Abuja)">Branch 3 (Abuja)</option>
              </select>
            </div>

            {/* Navigation links grid */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              {navLinks.map((link) => {
                const IconComp = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsDrawerOpen(false)}
                    className={`p-3 rounded-xl border flex flex-col gap-1.5 transition-all ${
                      isActive
                        ? "bg-brand-500/20 border-brand-500 text-white"
                        : "bg-white/[0.02] border-white/5 text-secondary hover:text-white"
                    }`}
                  >
                    <IconComp size={18} className={isActive ? "text-brand-400" : "text-secondary"} />
                    <span className="text-xs font-semibold">{link.label}</span>
                  </Link>
                );
              })}
            </div>

            <div className="pt-2 border-t border-white/10">
              <button
                onClick={handleLogout}
                className="btn btn-secondary w-full py-3 text-danger-400 text-xs font-bold flex items-center justify-center gap-2"
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STRICTLY Mobile Bottom Navigation Bar (Hidden on desktop!) */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 glass border-t border-white/10 flex justify-around items-center h-16 px-2 z-40"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        <Link
          href="/dashboard"
          className={`flex flex-col items-center p-2 min-w-[56px] ${
            pathname === "/dashboard" ? "text-brand-400" : "text-secondary"
          }`}
        >
          <LayoutDashboard size={20} />
          <span className="text-[10px] font-semibold mt-1">Home</span>
        </Link>

        <Link
          href="/invoices"
          className={`flex flex-col items-center p-2 min-w-[56px] ${
            pathname === "/invoices" ? "text-brand-400" : "text-secondary"
          }`}
        >
          <Receipt size={20} />
          <span className="text-[10px] font-semibold mt-1">Sales</span>
        </Link>

        {/* Central Floating POS Launcher */}
        <Link
          href="/pos"
          className="flex flex-col items-center justify-center -mt-6 bg-brand-500 hover:bg-brand-600 text-white rounded-full w-14 h-14 shadow-lg shadow-brand-500/40 border-2 border-primary active:scale-95 transition-transform"
          aria-label="Open Point of Sale"
        >
          <Zap size={24} />
        </Link>

        <Link
          href="/customers"
          className={`flex flex-col items-center p-2 min-w-[56px] ${
            pathname === "/customers" ? "text-brand-400" : "text-secondary"
          }`}
        >
          <Users size={20} />
          <span className="text-[10px] font-semibold mt-1">Clients</span>
        </Link>

        <button
          onClick={() => setIsDrawerOpen(true)}
          className="flex flex-col items-center p-2 min-w-[56px] text-secondary hover:text-white"
          aria-label="More Options"
        >
          <Menu size={20} />
          <span className="text-[10px] font-semibold mt-1">More</span>
        </button>
      </nav>
    </div>
  );
}
