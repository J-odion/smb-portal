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
} from "recharts";
import {
  TrendingUp,
  CreditCard,
  DollarSign,
  Users,
  Activity,
  ArrowUpRight,
  Zap,
  Receipt,
  Package,
  MessageSquare,
  RefreshCw,
  Clock
} from "lucide-react";

export default function DashboardOverview() {
  const [chartType, setChartType] = useState<"area" | "bar">("area");
  const [loading, setLoading] = useState(true);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [activeCustomers, setActiveCustomers] = useState(0);
  const [inventoryCount, setInventoryCount] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);

  const getToken = () => {
    if (typeof window === "undefined") return "";
    return (
      localStorage.getItem("token") ||
      document.cookie.split("; ").find((row) => row.startsWith("token="))?.split("=")[1] ||
      ""
    );
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    const token = getToken();
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const [txRes, expRes, custRes, invRes] = await Promise.all([
        fetch("/api/transactions", { headers }).catch(() => null),
        fetch("/api/expenses", { headers }).catch(() => null),
        fetch("/api/customers", { headers }).catch(() => null),
        fetch("/api/inventory", { headers }).catch(() => null),
      ]);

      if (txRes && txRes.ok) {
        const txData = await txRes.json();
        const txList = Array.isArray(txData) ? txData : txData.data || [];
        setRecentTransactions(txList.slice(0, 8));
        const rev = txList
          .filter((t: any) => t.status === "Paid" || !t.status)
          .reduce((sum: number, t: any) => sum + (Number(t.total) || 0), 0);
        setTotalRevenue(rev);
      }

      if (expRes && expRes.ok) {
        const expData = await expRes.json();
        const expList = Array.isArray(expData) ? expData : expData.data || [];
        const expTotal = expList.reduce((sum: number, e: any) => sum + (Number(e.amount) || 0), 0);
        setTotalExpenses(expTotal);
      }

      if (custRes && custRes.ok) {
        const custData = await custRes.json();
        const custList = Array.isArray(custData) ? custData : custData.data || [];
        setActiveCustomers(custList.length);
      }

      if (invRes && invRes.ok) {
        const invData = await invRes.json();
        const invList = Array.isArray(invData) ? invData : invData.data || [];
        setInventoryCount(invList.length);
      }
    } catch (err) {
      console.warn("Could not fetch dashboard metrics", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const netProfit = totalRevenue - totalExpenses;
  const marginPercent = totalRevenue > 0 ? Math.round((netProfit / totalRevenue) * 100) : 0;

  const chartData = [
    { name: "Mon", revenue: Math.round(totalRevenue * 0.1), expenses: Math.round(totalExpenses * 0.12) },
    { name: "Tue", revenue: Math.round(totalRevenue * 0.15), expenses: Math.round(totalExpenses * 0.1) },
    { name: "Wed", revenue: Math.round(totalRevenue * 0.12), expenses: Math.round(totalExpenses * 0.15) },
    { name: "Thu", revenue: Math.round(totalRevenue * 0.18), expenses: Math.round(totalExpenses * 0.14) },
    { name: "Fri", revenue: Math.round(totalRevenue * 0.22), expenses: Math.round(totalExpenses * 0.25) },
    { name: "Sat", revenue: Math.round(totalRevenue * 0.28), expenses: Math.round(totalExpenses * 0.18) },
    { name: "Sun", revenue: Math.round(totalRevenue * 0.05), expenses: Math.round(totalExpenses * 0.06) },
  ];

  const formatWhatsAppUrl = (phone: string, customer: string, amount: number) => {
    const cleanPhone = (phone || "").replace(/\D/g, "");
    let intPhone = cleanPhone;
    if (cleanPhone.startsWith("0")) intPhone = "234" + cleanPhone.slice(1);
    const msg = encodeURIComponent(
      `Hello ${customer || "Valued Customer"}, thank you for your payment of ₦${amount.toLocaleString()} with SMB Portal. Here is your digital receipt.`
    );
    return `https://wa.me/${intPhone}?text=${msg}`;
  };

  return (
    <div className="animate-fade-in relative space-y-6 pb-24 md:pb-8 font-sans bg-white text-black">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">
            <span>Workspaces</span>
            <span>&rsaquo;</span>
            <span className="text-purple-600 font-bold">Executive Board</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-black">
            Business Financial Pulse
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Live revenue, branch transactions, catalog count, and operating margins.
          </p>
        </div>

        {/* Action Hub */}
        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <button
            onClick={fetchDashboardData}
            className="p-2.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-600 hover:text-black transition-colors"
            title="Refresh metrics"
          >
            <RefreshCw size={15} className={loading ? "animate-spin text-purple-600" : ""} />
          </button>
          <Link
            href="/invoices"
            className="btn btn-secondary text-xs px-4 py-2.5 flex items-center gap-2 flex-1 md:flex-none justify-center rounded-xl font-semibold"
          >
            <Receipt size={14} className="text-zinc-500" />
            <span>Invoices</span>
          </Link>
          <Link
            href="/pos"
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-purple-600/25 flex-1 md:flex-none justify-center transition-all cursor-pointer"
          >
            <Zap size={15} />
            <span>Launch POS</span>
          </Link>
        </div>
      </div>

      {/* Quick Operations Launcher Dock */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Link
          href="/pos"
          className="p-3.5 rounded-2xl bg-white border border-zinc-200 hover:border-purple-600/50 hover:shadow-sm transition-all flex items-center gap-3 group shadow-2xs"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Zap size={18} />
          </div>
          <div>
            <span className="text-xs font-bold text-black block group-hover:text-purple-600 transition-colors">
              New Sale
            </span>
            <span className="text-[11px] text-zinc-500 block">Fast Cashier POS</span>
          </div>
        </Link>

        <Link
          href="/invoices"
          className="p-3.5 rounded-2xl bg-white border border-zinc-200 hover:border-emerald-600/50 hover:shadow-sm transition-all flex items-center gap-3 group shadow-2xs"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Receipt size={18} />
          </div>
          <div>
            <span className="text-xs font-bold text-black block group-hover:text-emerald-600 transition-colors">
              Invoices
            </span>
            <span className="text-[11px] text-zinc-500 block">Record Receipt</span>
          </div>
        </Link>

        <Link
          href="/inventory"
          className="p-3.5 rounded-2xl bg-white border border-zinc-200 hover:border-amber-500/50 hover:shadow-sm transition-all flex items-center gap-3 group shadow-2xs"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Package size={18} />
          </div>
          <div>
            <span className="text-xs font-bold text-black block group-hover:text-amber-600 transition-colors">
              Inventory
            </span>
            <span className="text-[11px] text-zinc-500 block">{inventoryCount} live items</span>
          </div>
        </Link>

        <Link
          href="/expenses"
          className="p-3.5 rounded-2xl bg-white border border-zinc-200 hover:border-red-600/50 hover:shadow-sm transition-all flex items-center gap-3 group shadow-2xs"
        >
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <DollarSign size={18} />
          </div>
          <div>
            <span className="text-xs font-bold text-black block group-hover:text-red-600 transition-colors">
              Expenses
            </span>
            <span className="text-[11px] text-zinc-500 block">Record Outflow</span>
          </div>
        </Link>
      </div>

      {/* KPI Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Sales Inflow</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              ₦
            </div>
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-black block">
            ₦{totalRevenue.toLocaleString()}
          </span>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold pt-1">
            <TrendingUp size={14} />
            <span>Live MongoDB ledger</span>
          </div>
        </div>

        {/* Total Expenses */}
        <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-xs font-bold uppercase tracking-wider">Store Expenses</span>
            <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center font-bold">
              <DollarSign size={16} />
            </div>
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-black block">
            ₦{totalExpenses.toLocaleString()}
          </span>
          <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-semibold pt-1">
            <span>Operating cost tracked</span>
          </div>
        </div>

        {/* Net Profit */}
        <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-xs font-bold uppercase tracking-wider">Net Operating Profit</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Activity size={16} />
            </div>
          </div>
          <span className={`text-2xl sm:text-3xl font-extrabold block ${netProfit >= 0 ? "text-purple-700" : "text-red-600"}`}>
            ₦{netProfit.toLocaleString()}
          </span>
          <div className="flex items-center gap-1.5 text-xs text-purple-700 font-bold pt-1">
            <span>{marginPercent}% Operating Margin</span>
          </div>
        </div>

        {/* Customer Directory */}
        <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-xs font-bold uppercase tracking-wider">Customer Directory</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Users size={16} />
            </div>
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-black block">
            {activeCustomers}
          </span>
          <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-semibold pt-1">
            <Link href="/customers" className="text-purple-600 font-bold hover:underline">
              View customer profiles &rsaquo;
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-zinc-200 flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-base text-black">Live Ledger Transactions</h3>
            <p className="text-xs text-zinc-500">Real-time point of sale transactions and invoices</p>
          </div>
          <Link
            href="/invoices"
            className="text-xs font-bold text-purple-600 hover:text-purple-700 hover:underline"
          >
            View All Ledger Entries &rsaquo;
          </Link>
        </div>

        {recentTransactions.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto">
              <Receipt size={24} />
            </div>
            <h4 className="font-bold text-sm text-black">No transactions recorded yet</h4>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              Ready to take your first order? Launch the POS terminal or issue an invoice to see live records here.
            </p>
            <Link
              href="/pos"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm shadow-purple-600/25 mt-2"
            >
              <Zap size={14} />
              <span>Launch POS Cashier</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-zinc-50/80 border-b border-zinc-200 text-zinc-500 uppercase tracking-wider font-bold">
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Amount (₦)</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {recentTransactions.map((tx: any) => {
                  const customerName = tx.customer_id?.name || tx.customer?.name || "Walk-in Customer";
                  const phone = tx.customer_id?.phone || tx.customer?.phone || "";
                  const desc = tx.items?.[0]?.description || tx.metadata?.description || "POS Cashier Sale";
                  const isPaid = tx.status === "Paid" || !tx.status;
                  return (
                    <tr key={tx._id || tx.id} className="hover:bg-zinc-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-black">{desc}</td>
                      <td className="py-3.5 px-4 text-zinc-700">{customerName}</td>
                      <td className="py-3.5 px-4 font-extrabold text-black">
                        ₦{Number(tx.total || 0).toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                            isPaid
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${isPaid ? "bg-emerald-600" : "bg-amber-600"}`} />
                          {isPaid ? "Paid" : "Pending"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {phone ? (
                          <a
                            href={formatWhatsAppUrl(phone, customerName, tx.total)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs text-emerald-600 font-bold hover:underline"
                          >
                            <MessageSquare size={13} />
                            <span>WhatsApp</span>
                          </a>
                        ) : (
                          <span className="text-zinc-400 text-[11px]">No Phone</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
