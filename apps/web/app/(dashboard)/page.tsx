"use client";
import { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { DollarSign, TrendingUp, Users, CreditCard, Activity } from 'lucide-react';

const data = [
  { name: 'Mon', revenue: 4000, expenses: 2400 },
  { name: 'Tue', revenue: 3000, expenses: 1398 },
  { name: 'Wed', revenue: 2000, expenses: 9800 },
  { name: 'Thu', revenue: 2780, expenses: 3908 },
  { name: 'Fri', revenue: 1890, expenses: 4800 },
  { name: 'Sat', revenue: 2390, expenses: 3800 },
  { name: 'Sun', revenue: 3490, expenses: 4300 },
];

export default function DashboardOverview() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalExpenses: 0,
    activeCustomers: 0,
    recentTransactions: []
  });

  useEffect(() => {
    // In a real app we'd fetch this from /api/analytics
    setStats({
      totalRevenue: 450000,
      totalExpenses: 120000,
      activeCustomers: 45,
      recentTransactions: [
        { id: 1, desc: 'Invoice #1042', amount: 15000, date: 'Today', type: 'IN' },
        { id: 2, desc: 'Office Supplies', amount: 3500, date: 'Today', type: 'OUT' },
        { id: 3, desc: 'Invoice #1041', amount: 45000, date: 'Yesterday', type: 'IN' }
      ]
    });
  }, []);

  return (
    <div className="animate-fade-in pb-20 md:pb-0 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="h2 gradient-text">Dashboard Overview</h1>
          <p className="text-secondary text-sm">Welcome back! Here's what's happening with your business today.</p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-secondary text-sm">Download Report</button>
          <button className="btn btn-primary text-sm">New Transaction</button>
        </div>
      </div>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass p-6 rounded-lg shadow-sm border border-tertiary flex items-center justify-between">
          <div>
            <h3 className="text-sm text-secondary font-medium mb-1">Net Revenue</h3>
            <p className="text-2xl font-bold text-success-500">₦{(stats.totalRevenue - stats.totalExpenses).toLocaleString()}</p>
            <p className="text-xs text-secondary mt-1 flex items-center gap-1"><TrendingUp size={12} className="text-success-500" /> +12% this week</p>
          </div>
          <div className="p-3 bg-success-500/10 rounded-full text-success-500"><DollarSign size={24} /></div>
        </div>
        
        <div className="glass p-6 rounded-lg shadow-sm border border-tertiary flex items-center justify-between">
          <div>
            <h3 className="text-sm text-secondary font-medium mb-1">Total Sales</h3>
            <p className="text-2xl font-bold">₦{stats.totalRevenue.toLocaleString()}</p>
            <p className="text-xs text-secondary mt-1 flex items-center gap-1"><TrendingUp size={12} className="text-success-500" /> +8% this week</p>
          </div>
          <div className="p-3 bg-brand-500/10 rounded-full text-brand-500"><CreditCard size={24} /></div>
        </div>

        <div className="glass p-6 rounded-lg shadow-sm border border-tertiary flex items-center justify-between">
          <div>
            <h3 className="text-sm text-secondary font-medium mb-1">Total Expenses</h3>
            <p className="text-2xl font-bold text-danger-500">₦{stats.totalExpenses.toLocaleString()}</p>
            <p className="text-xs text-secondary mt-1 flex items-center gap-1"><TrendingUp size={12} className="text-danger-500" /> +2% this week</p>
          </div>
          <div className="p-3 bg-danger-500/10 rounded-full text-danger-500"><Activity size={24} /></div>
        </div>
        
        <div className="glass p-6 rounded-lg shadow-sm border border-tertiary flex items-center justify-between">
          <div>
            <h3 className="text-sm text-secondary font-medium mb-1">Active Customers</h3>
            <p className="text-2xl font-bold">{stats.activeCustomers}</p>
            <p className="text-xs text-secondary mt-1">+3 new today</p>
          </div>
          <div className="p-3 bg-blue-500/10 rounded-full text-blue-500"><Users size={24} /></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 glass p-6 rounded-lg shadow-sm border border-tertiary flex flex-col h-[400px]">
          <h3 className="font-bold mb-6">Revenue vs Expenses (This Week)</h3>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--bg-tertiary)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--text-secondary)', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--text-secondary)', fontSize: 12}} dx={-10} tickFormatter={(val) => `₦${val}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--bg-tertiary)', borderRadius: '8px' }}
                  itemStyle={{ fontSize: '14px', fontWeight: 'bold' }}
                />
                <Legend verticalAlign="top" height={36}/>
                <Area type="monotone" dataKey="revenue" stroke="#10b981" fillOpacity={1} fill="url(#colorRevenue)" name="Revenue" />
                <Area type="monotone" dataKey="expenses" stroke="#ef4444" fillOpacity={1} fill="url(#colorExpense)" name="Expenses" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity & Quick Stats */}
        <div className="flex flex-col gap-6">
          <div className="glass p-6 rounded-lg shadow-sm border border-tertiary">
            <h3 className="font-bold mb-4">Cash Flow Overview</h3>
            <div className="h-[180px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[{ name: 'Summary', In: stats.totalRevenue, Out: stats.totalExpenses }]} barSize={40}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--bg-tertiary)" />
                  <XAxis dataKey="name" hide />
                  <YAxis hide />
                  <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--bg-tertiary)' }}/>
                  <Legend />
                  <Bar dataKey="In" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Out" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass p-6 rounded-lg shadow-sm border border-tertiary flex-1">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold">Recent Activity</h3>
              <button className="text-xs text-brand-500 font-medium">View All</button>
            </div>
            <div className="flex flex-col gap-4">
              {stats.recentTransactions.map(txn => (
                <div key={txn.id} className="flex justify-between items-center pb-3 border-b border-tertiary last:border-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${txn.type === 'IN' ? 'bg-success-500/10 text-success-500' : 'bg-danger-500/10 text-danger-500'}`}>
                      <DollarSign size={16} />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{txn.desc}</p>
                      <p className="text-xs text-secondary">{txn.date}</p>
                    </div>
                  </div>
                  <div className={`font-bold text-sm ${txn.type === 'IN' ? 'text-success-500' : 'text-danger-500'}`}>
                    {txn.type === 'IN' ? '+' : '-'}₦{txn.amount.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
