"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from "recharts";
import {
  TrendingUp,
  CreditCard,
  DollarSign,
  Users,
  Activity,
  ArrowUpRight,
  Plus,
  Zap,
  ShoppingBag,
  Receipt,
  Package,
  MessageSquare,
  Sparkles,
  Layers,
  BarChart3
} from "lucide-react";

const chartData = [
  { name: "Mon", revenue: 42000, expenses: 14000 },
  { name: "Tue", revenue: 58000, expenses: 18000 },
  { name: "Wed", revenue: 32000, expenses: 9500 },
  { name: "Thu", revenue: 76000, expenses: 22000 },
  { name: "Fri", revenue: 95000, expenses: 31000 },
  { name: "Sat", revenue: 110000, expenses: 28000 },
  { name: "Sun", revenue: 84000, expenses: 19000 },
];

export default function DashboardOverview() {
  const [chartType, setChartType] = useState<"area" | "bar">("area");
  const [stats, setStats] = useState({
    totalRevenue: 497000,
    totalExpenses: 141500,
    activeCustomers: 38,
    recentTransactions: [
      { id: "1", desc: "Standard POS Cashier Sale", amount: 45000, time: "10 mins ago", status: "PAID", customer: "Amaka Obi", phone: "08034567890", channel: "POS Terminal" },
      { id: "2", desc: "Bulk Accessories Order", amount: 120000, time: "1 hour ago", status: "WORKING", customer: "Emeka Trading", phone: "08023456789", channel: "Direct Transfer" },
      { id: "3", desc: "Hardware Service & Setup", amount: 25000, time: "3 hours ago", status: "PAID", customer: "Tunde Bakare", phone: "08098765432", channel: "Card POS" },
      { id: "4", desc: "Generator Diesel Fuel Refill", amount: 18500, time: "Yesterday", status: "STUCK", customer: "Station Operations", phone: "08011223344", channel: "Cash Outflow" },
    ],
  });

  const netProfit = stats.totalRevenue - stats.totalExpenses;
  const marginPercent = Math.round((netProfit / stats.totalRevenue) * 100);

  const formatWhatsAppUrl = (phone: string, customer: string, amount: number) => {
    const cleanPhone = phone.replace(/\D/g, "");
    let intPhone = cleanPhone;
    if (cleanPhone.startsWith("0")) intPhone = "234" + cleanPhone.slice(1);
    const msg = encodeURIComponent(`Hello ${customer}, thank you for your payment of ₦${amount.toLocaleString()} with SMB Portal. Here is your digital receipt.`);
    return `https://wa.me/${intPhone}?text=${msg}`;
  };

  return (
    <div className="animate-fade-in relative space-y-6 pb-24 md:pb-8">
      {/* Monday Board Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-secondary uppercase tracking-wider mb-1">
            <span>Workspaces</span>
            <span>&rsaquo;</span>
            <span className="text-brand-400">Operations Pulse</span>
          </div>
          <h1 className="h2 text-white flex items-center gap-3">
            <span>Business Pulse</span>
            <span className="text-xs px-3 py-1 rounded-full bg-[#00c875]/15 text-[#00c875] border border-[#00c875]/30 font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#00c875] animate-pulse" />
              Live Pulse
            </span>
          </h1>
          <p className="text-xs text-secondary mt-1">
            Real-time financial performance, settlement battery, and branch transactions.
          </p>
        </div>

        {/* Monday Action Hub */}
        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <Link
            href="/invoices"
            className="btn btn-secondary text-xs px-4 py-2.5 flex items-center gap-2 flex-1 md:flex-none justify-center rounded-xl"
          >
            <Receipt size={14} className="text-secondary" />
            <span>Transactions Board</span>
          </Link>
          <Link
            href="/pos"
            className="btn btn-primary text-xs px-5 py-2.5 flex items-center gap-2 flex-1 md:flex-none justify-center shadow-lg shadow-brand-500/25 rounded-xl font-bold"
          >
            <Zap size={15} />
            <span>Launch POS</span>
          </Link>
        </div>
      </div>

      {/* Monday Quick Operations Launcher Dock */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Link
          href="/pos"
          className="p-3.5 rounded-2xl bg-secondary/80 border border-white/10 hover:border-brand-500/40 hover:bg-secondary transition-all flex items-center gap-3 group shadow-sm"
        >
          <div className="w-10 h-10 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Zap size={18} />
          </div>
          <div>
            <span className="text-xs font-bold text-white block group-hover:text-brand-400 transition-colors">
              New Sale
            </span>
            <span className="text-[11px] text-secondary block">Fast Cashier POS</span>
          </div>
        </Link>

        <Link
          href="/invoices"
          className="p-3.5 rounded-2xl bg-secondary/80 border border-white/10 hover:border-[#00c875]/40 hover:bg-secondary transition-all flex items-center gap-3 group shadow-sm"
        >
          <div className="w-10 h-10 rounded-xl bg-[#00c875]/20 text-[#00c875] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Receipt size={18} />
          </div>
          <div>
            <span className="text-xs font-bold text-white block group-hover:text-[#00c875] transition-colors">
              Invoices
            </span>
            <span className="text-[11px] text-secondary block">Issue Receipt</span>
          </div>
        </Link>

        <Link
          href="/inventory"
          className="p-3.5 rounded-2xl bg-secondary/80 border border-white/10 hover:border-[#fdab3d]/40 hover:bg-secondary transition-all flex items-center gap-3 group shadow-sm"
        >
          <div className="w-10 h-10 rounded-xl bg-[#fdab3d]/20 text-[#fdab3d] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Package size={18} />
          </div>
          <div>
            <span className="text-xs font-bold text-white block group-hover:text-[#fdab3d] transition-colors">
              Inventory
            </span>
            <span className="text-[11px] text-secondary block">Stock Manager</span>
          </div>
        </Link>

        <Link
          href="/expenses"
          className="p-3.5 rounded-2xl bg-secondary/80 border border-white/10 hover:border-[#e2445c]/40 hover:bg-secondary transition-all flex items-center gap-3 group shadow-sm"
        >
          <div className="w-10 h-10 rounded-xl bg-[#e2445c]/20 text-[#e2445c] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <DollarSign size={18} />
          </div>
          <div>
            <span className="text-xs font-bold text-white block group-hover:text-[#e2445c] transition-colors">
              Expenses
            </span>
            <span className="text-[11px] text-secondary block">Record Outflow</span>
          </div>
        </Link>
      </div>

      {/* Monday Target Achievement Battery Summary */}
      <div className="glass p-5 rounded-2xl border border-white/10 space-y-3">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-secondary">
              Weekly Revenue Goal (₦500,000 Target)
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-brand-500/20 text-brand-400 font-bold border border-brand-500/30">
              {Math.round((stats.totalRevenue / 500000) * 100)}% Reached
            </span>
          </div>
          <span className="text-xs font-bold text-[#00c875]">
            Net Operating Margin: {marginPercent}%
          </span>
        </div>

        {/* Multi-segment Monday battery */}
        <div className="monday-battery w-full h-3 rounded-full overflow-hidden flex bg-white/5">
          <div
            style={{ width: "72%" }}
            className="bg-[#00c875] h-full transition-all duration-500 hover:brightness-110"
            title="Settled Inflows: 72%"
          />
          <div
            style={{ width: "18%" }}
            className="bg-[#fdab3d] h-full transition-all duration-500 hover:brightness-110"
            title="Pending Collections: 18%"
          />
          <div
            style={{ width: "10%" }}
            className="bg-[#e2445c] h-full transition-all duration-500 hover:brightness-110"
            title="Operational Expenses: 10%"
          />
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-between text-xs text-secondary pt-1 gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-white font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00c875]" />
              Settled Sales (₦357,840)
            </span>
            <span className="flex items-center gap-1.5 text-white font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-[#fdab3d]" />
              Pending Tabs (₦139,160)
            </span>
            <span className="flex items-center gap-1.5 text-white font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-[#e2445c]" />
              Outflows (₦141,500)
            </span>
          </div>
          <span className="text-[11px] text-secondary">Target window ends in 2 days</span>
        </div>
      </div>

      {/* 4 High-Impact Monday KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Net Profit */}
        <div className="glass p-5 rounded-2xl border border-white/10 border-l-4 border-l-[#00c875] shadow-sm flex items-center justify-between hover:border-white/20 transition-all">
          <div>
            <span className="text-xs text-secondary font-bold uppercase tracking-wider block mb-1">
              Net Profit
            </span>
            <h3 className="text-2xl font-black text-white">₦{netProfit.toLocaleString()}</h3>
            <span className="text-xs text-[#00c875] font-semibold flex items-center gap-1 mt-1">
              <TrendingUp size={13} /> +14.2% vs last week
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#00c875]/15 text-[#00c875] flex items-center justify-center font-black text-lg border border-[#00c875]/30">
            ₦
          </div>
        </div>

        {/* Gross Sales */}
        <div className="glass p-5 rounded-2xl border border-white/10 border-l-4 border-l-[#0073ea] shadow-sm flex items-center justify-between hover:border-white/20 transition-all">
          <div>
            <span className="text-xs text-secondary font-bold uppercase tracking-wider block mb-1">
              Gross Sales
            </span>
            <h3 className="text-2xl font-black text-white">₦{stats.totalRevenue.toLocaleString()}</h3>
            <span className="text-xs text-brand-400 font-semibold flex items-center gap-1 mt-1">
              <ArrowUpRight size={13} /> 48 transactions
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#0073ea]/15 text-[#0073ea] flex items-center justify-center border border-[#0073ea]/30">
            <CreditCard size={20} />
          </div>
        </div>

        {/* Expenses */}
        <div className="glass p-5 rounded-2xl border border-white/10 border-l-4 border-l-[#e2445c] shadow-sm flex items-center justify-between hover:border-white/20 transition-all">
          <div>
            <span className="text-xs text-secondary font-bold uppercase tracking-wider block mb-1">
              Total Expenses
            </span>
            <h3 className="text-2xl font-black text-white">₦{stats.totalExpenses.toLocaleString()}</h3>
            <span className="text-xs text-[#e2445c] font-semibold flex items-center gap-1 mt-1">
              <Activity size={13} /> -3.5% controlled spend
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#e2445c]/15 text-[#e2445c] flex items-center justify-center border border-[#e2445c]/30">
            <DollarSign size={20} />
          </div>
        </div>

        {/* Active Clients */}
        <div className="glass p-5 rounded-2xl border border-white/10 border-l-4 border-l-[#a25ddc] shadow-sm flex items-center justify-between hover:border-white/20 transition-all">
          <div>
            <span className="text-xs text-secondary font-bold uppercase tracking-wider block mb-1">
              Active Clients
            </span>
            <h3 className="text-2xl font-black text-white">{stats.activeCustomers}</h3>
            <span className="text-xs text-[#a25ddc] font-semibold flex items-center gap-1 mt-1">
              <Users size={13} /> +4 new this week
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#a25ddc]/15 text-[#a25ddc] flex items-center justify-center border border-[#a25ddc]/30">
            <Users size={20} />
          </div>
        </div>
      </div>

      {/* Main Revenue Analytics & Live Board Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Chart with Tab Toggle */}
        <div className="lg:col-span-2 glass p-5 md:p-6 rounded-2xl border border-white/10 flex flex-col h-[400px] shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-bold text-white text-base">Weekly Inflow vs Outflow</h3>
              <p className="text-xs text-secondary">
                Daily breakdown of revenue generated vs operational overhead
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center bg-white/5 p-1 rounded-xl border border-white/10 text-xs">
                <button
                  onClick={() => setChartType("area")}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                    chartType === "area" ? "bg-brand-500 text-white" : "text-secondary hover:text-white"
                  }`}
                >
                  Area
                </button>
                <button
                  onClick={() => setChartType("bar")}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                    chartType === "bar" ? "bg-brand-500 text-white" : "text-secondary hover:text-white"
                  }`}
                >
                  Bars
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1 w-full min-h-0 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === "area" ? (
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="mondayGreen" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00c875" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#00c875" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="mondayRed" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#e2445c" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#e2445c" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 11 }}
                    tickFormatter={(v) => `₦${v / 1000}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#181d2f",
                      border: "1px solid rgba(255,255,255,0.15)",
                      borderRadius: "12px",
                      color: "#ffffff",
                      fontSize: "12px",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#00c875"
                    strokeWidth={2.5}
                    fill="url(#mondayGreen)"
                    name="Revenue"
                  />
                  <Area
                    type="monotone"
                    dataKey="expenses"
                    stroke="#e2445c"
                    strokeWidth={2}
                    fill="url(#mondayRed)"
                    name="Expenses"
                  />
                </AreaChart>
              ) : (
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 11 }}
                    tickFormatter={(v) => `₦${v / 1000}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#181d2f",
                      border: "1px solid rgba(255,255,255,0.15)",
                      borderRadius: "12px",
                      color: "#ffffff",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="revenue" fill="#00c875" radius={[6, 6, 0, 0]} name="Revenue" />
                  <Bar dataKey="expenses" fill="#e2445c" radius={[6, 6, 0, 0]} name="Expenses" />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monday Live Activity Board */}
        <div className="glass p-5 md:p-6 rounded-2xl border border-white/10 flex flex-col shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-bold text-white text-base">Live Board Activity</h3>
              <p className="text-xs text-secondary">Real-time store transaction stream</p>
            </div>
            <Link
              href="/invoices"
              className="text-xs text-brand-400 hover:text-brand-300 font-bold"
            >
              View Board &rsaquo;
            </Link>
          </div>

          <div className="flex flex-col gap-2.5 flex-1 overflow-y-auto pr-1">
            {stats.recentTransactions.map((item) => {
              const isPaid = item.status === "PAID";
              const isWorking = item.status === "WORKING";

              return (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between gap-3 hover:bg-white/[0.05] transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <h5 className="font-bold text-white text-xs truncate leading-tight">
                      {item.desc}
                    </h5>
                    <div className="flex items-center gap-1.5 text-[11px] text-secondary mt-0.5">
                      <span className="text-white font-medium">{item.customer}</span>
                      <span>&bull;</span>
                      <span>{item.channel}</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="text-xs font-black text-white">
                      ₦{item.amount.toLocaleString()}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {isPaid ? (
                        <span className="monday-pill monday-pill-done !text-[10px] !py-0.5 !min-w-[65px]">
                          Paid
                        </span>
                      ) : isWorking ? (
                        <span className="monday-pill monday-pill-working !text-[10px] !py-0.5 !min-w-[65px]">
                          Working
                        </span>
                      ) : (
                        <span className="monday-pill monday-pill-stuck !text-[10px] !py-0.5 !min-w-[65px]">
                          Stuck
                        </span>
                      )}
                      <a
                        href={formatWhatsAppUrl(item.phone, item.customer, item.amount)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 rounded-md text-[#00c875] hover:bg-[#00c875]/15 transition-colors"
                        title="Send WhatsApp Receipt"
                      >
                        <MessageSquare size={13} />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <Link
            href="/invoices"
            className="mt-3 pt-3 border-t border-white/10 text-center text-xs font-bold text-brand-400 hover:text-brand-300 block"
          >
            + Create New Transaction in Board
          </Link>
        </div>
      </div>
    </div>
  );
}
