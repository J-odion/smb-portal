"use client";
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeBranch, setActiveBranch] = useState('Main HQ (Ikeja)');
  const pathname = usePathname();

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/pos', label: 'POS Terminal', icon: '⚡', isPrimary: true },
    { href: '/invoices', label: 'Transactions', icon: '🧾' },
    { href: '/inventory', label: 'Inventory', icon: '📦' },
    { href: '/customers', label: 'Customers', icon: '👥' },
    { href: '/expenses', label: 'Expenses', icon: '💰' },
    { href: '/staff', label: 'Staff & Payroll', icon: '👔' },
    { href: '/team', label: 'Team Members', icon: '🛡️' },
    { href: '/settings', label: 'Settings', icon: '⚙️' },
  ];

  const handleLogout = () => {
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    window.location.href = '/login';
  };

  return (
    <div className="flex min-h-screen bg-primary text-primary pb-20 md:pb-0">
      {/* Desktop / Tablet Sidebar */}
      <aside className="w-64 glass border-r border-white/5 hidden md:flex flex-col p-4 h-screen sticky top-0 overflow-y-auto">
        <div className="mb-8">
          <h1 className="h2 gradient-text">SMB Portal</h1>
          <p className="text-xs text-secondary mt-1">Multi-branch Retail & Services</p>
        </div>

        <div className="mb-6">
          <label className="text-xs text-secondary uppercase tracking-wider mb-2 block font-medium">Active Branch</label>
          <select
            value={activeBranch}
            onChange={(e) => setActiveBranch(e.target.value)}
            className="w-full p-2.5 text-sm rounded-lg border border-white/10 bg-primary/80 text-white focus:border-brand-500 outline-none"
          >
            <option value="Main HQ (Ikeja)">Main HQ (Ikeja)</option>
            <option value="Branch 2 (Lekki)">Branch 2 (Lekki)</option>
            <option value="Branch 3 (Abuja)">Branch 3 (Abuja)</option>
          </select>
        </div>

        <nav className="flex flex-col gap-1.5 flex-1">
          <Link
            href="/pos"
            className="btn btn-primary justify-start p-3 mb-3 gap-2 shadow-lg shadow-brand-500/20 text-white"
          >
            <span className="text-lg">⚡</span>
            <span>Launch POS</span>
          </Link>

          {navLinks.filter(l => !l.isPrimary).map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-500/15 text-brand-400 border border-brand-500/30'
                    : 'text-secondary hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="pt-4 mt-auto border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 text-sm text-danger-400 hover:text-danger-500 w-full rounded-lg transition-colors"
          >
            <span>🚪</span>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Top Header (Brand, Active Branch, Drawer Trigger) */}
        <header className="md:hidden glass border-b border-white/5 sticky top-0 z-40 px-4 py-3 flex items-center justify-between">
          <div>
            <span className="text-base font-bold gradient-text">SMB Portal</span>
            <div className="flex items-center gap-1.5 text-xs text-secondary mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-success-500"></span>
              <span className="truncate max-w-[150px]">{activeBranch}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="p-2 text-secondary hover:text-white rounded-lg bg-white/[0.05] border border-white/10 text-sm font-medium flex items-center gap-1"
              aria-label="Open Navigation Menu"
            >
              <span>☰</span>
              <span className="text-xs">Menu</span>
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Mobile Slide-Up / Slide-Over Navigation Drawer */}
      {isDrawerOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm animate-fade-in"
            onClick={() => setIsDrawerOpen(false)}
          />

          {/* Drawer Sheet */}
          <div className="relative glass border-t border-white/10 rounded-t-2xl p-6 max-h-[85vh] overflow-y-auto z-10 animate-fade-in shadow-2xl flex flex-col gap-4">
            <div className="flex justify-between items-center pb-3 border-b border-white/10">
              <div>
                <h2 className="text-lg font-bold text-white">Full Menu</h2>
                <p className="text-xs text-secondary">Switch branch or navigate modules</p>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center text-lg hover:bg-white/20"
              >
                &times;
              </button>
            </div>

            {/* Branch Switcher for Mobile */}
            <div className="bg-white/[0.03] p-3 rounded-xl border border-white/5">
              <label className="text-xs text-secondary uppercase tracking-wider block mb-1.5 font-medium">Switch Active Branch</label>
              <select
                value={activeBranch}
                onChange={(e) => setActiveBranch(e.target.value)}
                className="w-full p-2.5 text-sm rounded-lg border border-white/10 bg-primary text-white outline-none focus:border-brand-500"
              >
                <option value="Main HQ (Ikeja)">Main HQ (Ikeja)</option>
                <option value="Branch 2 (Lekki)">Branch 2 (Lekki)</option>
                <option value="Branch 3 (Abuja)">Branch 3 (Abuja)</option>
              </select>
            </div>

            {/* Module Links */}
            <div className="grid grid-cols-2 gap-2.5 pt-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsDrawerOpen(false)}
                  className={`flex flex-col items-center justify-center p-3.5 rounded-xl text-center border transition-colors ${
                    pathname === link.href
                      ? 'bg-brand-500/20 border-brand-500/40 text-brand-300'
                      : 'bg-white/[0.02] border-white/5 text-white hover:bg-white/[0.06]'
                  }`}
                >
                  <span className="text-2xl mb-1">{link.icon}</span>
                  <span className="text-xs font-medium">{link.label}</span>
                </Link>
              ))}
            </div>

            <div className="pt-2 border-t border-white/10 flex gap-2">
              <button
                onClick={handleLogout}
                className="btn btn-secondary w-full p-3 text-danger-400 text-sm font-medium"
              >
                🚪 Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation - Mobile Thumb Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 glass border-t border-white/10 flex justify-around items-center h-16 px-2 z-40" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
        <Link
          href="/dashboard"
          className={`flex flex-col items-center p-2 min-w-[56px] ${
            pathname === '/dashboard' ? 'text-brand-400' : 'text-secondary'
          }`}
        >
          <span className="text-xl">🏠</span>
          <span className="text-[10px] font-medium">Home</span>
        </Link>

        <Link
          href="/invoices"
          className={`flex flex-col items-center p-2 min-w-[56px] ${
            pathname === '/invoices' ? 'text-brand-400' : 'text-secondary'
          }`}
        >
          <span className="text-xl">🧾</span>
          <span className="text-[10px] font-medium">Sales</span>
        </Link>

        {/* Central Floating POS Launcher */}
        <Link
          href="/pos"
          className="flex flex-col items-center justify-center -mt-6 bg-brand-500 hover:bg-brand-600 text-white rounded-full w-14 h-14 shadow-lg shadow-brand-500/40 border-2 border-primary active:scale-95 transition-transform"
          aria-label="Open Point of Sale"
        >
          <span className="text-2xl">⚡</span>
        </Link>

        <Link
          href="/customers"
          className={`flex flex-col items-center p-2 min-w-[56px] ${
            pathname === '/customers' ? 'text-brand-400' : 'text-secondary'
          }`}
        >
          <span className="text-xl">👥</span>
          <span className="text-[10px] font-medium">Clients</span>
        </Link>

        <button
          onClick={() => setIsDrawerOpen(true)}
          className="flex flex-col items-center p-2 min-w-[56px] text-secondary hover:text-white"
          aria-label="More Options"
        >
          <span className="text-xl">☰</span>
          <span className="text-[10px] font-medium">More</span>
        </button>
      </nav>
    </div>
  );
}
