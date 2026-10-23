"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts";
import { TrendingUp, CreditCard, DollarSign, Users, Activity, ArrowUpRight, Plus } from "lucide-react";

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
  const [stats, setStats] = useState({
    totalRevenue: 497000,
    totalExpenses: 141500,
    activeCustomers: 38,
    recentTransactions: [
      { id: "1", desc: "Standard POS Sale", amount: 45000, time: "10 mins ago", status: "PAID", customer: "Amaka Obi" },
      { id: "2", desc: "Bulk Accessories Order", amount: 120000, time: "1 hour ago", status: "WORKING", customer: "Emeka Trading" },
      { id: "3", desc: "Hardware Service & Setup", amount: 25000, time: "3 hours ago", status: "PAID", customer: "Tunde Bakare" },
      { id: "4", desc: "Generator Fuel & Log", amount: 18500, time: "Yesterday", status: "STUCK", customer: "Station Operations" },
    ],
  });

  const netProfit = stats.totalRevenue - stats.totalExpenses;
  const marginPercent = Math.round((netProfit / stats.totalRevenue) * 100);

  return (
    <div className="animate-fade-in relative space-y-6 pb-24 md:pb-8">
      {/* Monday.com Workspace Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-secondary mb-1">
            <span>Workspaces</span>
            <span>&rsaquo;</span>
            <span className="text-brand-400 font-medium">Operations Dashboard</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
            <span>Business Pulse</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-success-500/10 text-success-400 border border-success-500/20 font-medium">
              Live Store
            </span>
          </h1>
          <p className="text-xs text-secondary mt-1">Real-time financial and branch performance metrics</p>
        </div>

        {/* Monday.com Quick Action Launcher */}
        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <Link
            href="/invoices"
            className="btn btn-secondary text-xs px-3.5 py-2 flex items-center gap-1.5 flex-1 md:flex-none justify-center"
          >
            <span>📋</span>
            <span>View Board</span>
          </Link>
          <Link
            href="/pos"
            className="btn btn-primary text-xs px-4 py-2 flex items-center gap-1.5 flex-1 md:flex-none justify-center shadow-lg shadow-brand-500/20"
          >
            <span className="text-sm font-bold">⚡</span>
            <span>Launch POS</span>
          </Link>
        </div>
      </div>

      {/* Monday.com Progress Battery Summary */}
      <div className="bg-white/[0.03] p-4 rounded-xl border border-white/5 space-y-2">
        <div className="flex justify-between items-center text-xs">
          <span className="text-secondary font-medium">Weekly Target Achievement (₦500,000 Target)</span>
          <span className="text-white font-bold">{Math.round((stats.totalRevenue / 500000) * 100)}% Reached</span>
        </div>
        <div className="monday-battery w-full">
          <div style={{ width: "72%" }} className="bg-[#00c875] h-full transition-all"></div>
          <div style={{ width: "18%" }} className="bg-[#fdab3d] h-full transition-all"></div>
          <div style={{ width: "10%" }} className="bg-[#e2445c] h-full transition-all"></div>
        </div>
        <div className="flex items-center justify-between text-[11px] text-secondary pt-1">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#00c875]"></span> Settled Sales (72%)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#fdab3d]"></span> Pending Tabs (18%)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#e2445c]"></span> Expenses (10%)
            </span>
          </div>
          <span className="font-semibold text-white">Profit Margin: {marginPercent}%</span>
        </div>
      </div>

      {/* Monday.com KPI Cards with Colored Left Strips */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Net Revenue */}
        <div className="glass p-5 rounded-xl border border-white/5 border-l-4 border-l-[#00c875] shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-secondary font-medium uppercase tracking-wider block mb-1">
              Net Profit
            </span>
            <h3 className="text-2xl font-bold text-white">₦{netProfit.toLocaleString()}</h3>
            <span className="text-[11px] text-success-400 flex items-center gap-0.5 mt-1">
              <TrendingUp size={12} /> +14.2% vs last week
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-success-500/10 text-success-400 flex items-center justify-center font-bold">
            ₦
          </div>
        </div>

        {/* Gross Sales */}
        <div className="glass p-5 rounded-xl border border-white/5 border-l-4 border-l-[#0073ea] shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-secondary font-medium uppercase tracking-wider block mb-1">
              Gross Sales
            </span>
            <h3 className="text-2xl font-bold text-white">₦{stats.totalRevenue.toLocaleString()}</h3>
            <span className="text-[11px] text-brand-400 flex items-center gap-0.5 mt-1">
              <ArrowUpRight size={12} /> 48 transactions
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
            <CreditCard size={18} />
          </div>
        </div>

        {/* Expenses */}
        <div className="glass p-5 rounded-xl border border-white/5 border-l-4 border-l-[#e2445c] shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-secondary font-medium uppercase tracking-wider block mb-1">
              Total Expenses
            </span>
            <h3 className="text-2xl font-bold text-white">₦{stats.totalExpenses.toLocaleString()}</h3>
            <span className="text-[11px] text-danger-400 flex items-center gap-0.5 mt-1">
              -3.5% controlled spend
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-danger-500/10 text-danger-400 flex items-center justify-center">
            <Activity size={18} />
          </div>
        </div>

        {/* Active Clients */}
        <div className="glass p-5 rounded-xl border border-white/5 border-l-4 border-l-[#a25ddc] shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-secondary font-medium uppercase tracking-wider block mb-1">
              Active Clients
            </span>
            <h3 className="text-2xl font-bold text-white">{stats.activeCustomers}</h3>
            <span className="text-[11px] text-purple-400 flex items-center gap-0.5 mt-1">
              +4 new this week
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
            <Users size={18} />
          </div>
        </div>
      </div>

      {/* Main Revenue Analytics & Recent Monday Pipeline Items */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Chart */}
        <div className="lg:col-span-2 glass p-5 md:p-6 rounded-xl border border-white/5 flex flex-col h-[380px] shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-bold text-white text-base">Weekly Inflow vs Outflow</h3>
              <p className="text-xs text-secondary">Daily breakdown of revenue generated vs operational costs</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-white/10 text-white">
              7 Days
            </span>
          </div>

          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="mondayGreen" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00c875" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00c875" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="mondayRed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#e2445c" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#e2445c" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#a1a1b5", fontSize: 11 }} />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#a1a1b5", fontSize: 11 }}
                  tickFormatter={(v) => `₦${v / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#131422",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "10px",
                    color: "#ffffff",
                    fontSize: "12px",
                  }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#00c875" strokeWidth={2.5} fill="url(#mondayGreen)" name="Revenue" />
                <Area type="monotone" dataKey="expenses" stroke="#e2445c" strokeWidth={2} fill="url(#mondayRed)" name="Expenses" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monday.com Live Activity Board */}
        <div className="glass p-5 md:p-6 rounded-xl border border-white/5 flex flex-col shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-bold text-white text-base">Live Board Activity</h3>
              <p className="text-xs text-secondary">Latest recorded transactions</p>
            </div>
            <Link href="/invoices" className="text-xs text-brand-400 hover:text-brand-300 font-medium">
              View Board &rsaquo;
            </Link>
          </div>

          <div className="flex flex-col gap-3 flex-1 overflow-y-auto">
            {stats.recentTransactions.map((item) => {
              const isPaid = item.status === "PAID";
              const isWorking = item.status === "WORKING";

              return (
                <div
                  key={item.id}
                  className="p-3 rounded-lg bg-white/[0.02] border border-white/5 flex items-center justify-between gap-2.5 transition-colors hover:bg-white/[0.04]"
                >
                  <div className="flex-1 min-w-0">
                    <h5 className="font-semibold text-white text-xs truncate leading-tight">{item.desc}</h5>
                    <p className="text-[11px] text-secondary truncate mt-0.5">{item.customer} &bull; {item.time}</p>
                  </div>

                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className="text-xs font-bold text-white">₦{item.amount.toLocaleString()}</span>
                    {isPaid ? (
                      <span className="monday-pill monday-pill-done !text-[10px] !py-0.5 !min-w-[65px]">Paid</span>
                    ) : isWorking ? (
                      <span className="monday-pill monday-pill-working !text-[10px] !py-0.5 !min-w-[65px]">Working</span>
                    ) : (
                      <span className="monday-pill monday-pill-stuck !text-[10px] !py-0.5 !min-w-[65px]">Stuck</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <Link
            href="/invoices"
            className="mt-4 pt-3 border-t border-white/5 text-center text-xs font-semibold text-brand-400 hover:text-brand-300 block"
          >
            + Create New Transaction in Board
          </Link>
        </div>
      </div>
    </div>
  );
}
