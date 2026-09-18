"use client";
import { useState, useEffect } from "react";

export default function DashboardOverview() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalExpenses: 0,
    activeCustomers: 0,
    recentTransactions: []
  });

  useEffect(() => {
    // In a real app we'd fetch this from /api/analytics
    // Simulating response for MVP
    setStats({
      totalRevenue: 450000,
      totalExpenses: 120000,
      activeCustomers: 45,
      recentTransactions: [
        { id: 1, desc: 'Invoice #1042', amount: 15000, date: 'Today' },
        { id: 2, desc: 'POS Sale', amount: 3500, date: 'Today' },
        { id: 3, desc: 'Invoice #1041', amount: 45000, date: 'Yesterday' }
      ]
    });
  }, []);

  return (
    <div className="animate-fade-in pb-20 md:pb-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
        <h1 className="h2 gradient-text">Dashboard Overview</h1>
        <div className="flex gap-2">
          <button className="btn btn-secondary text-sm">Export Report</button>
          <button className="btn btn-primary text-sm">New Sale</button>
        </div>
      </div>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="glass p-4 md:p-6 rounded-lg shadow-sm border border-tertiary">
          <h3 className="text-xs md:text-sm text-secondary uppercase tracking-wider mb-1 md:mb-2">Net Revenue</h3>
          <p className="text-xl md:text-3xl font-bold text-success-500">₦{(stats.totalRevenue - stats.totalExpenses).toLocaleString()}</p>
          <p className="text-xs text-secondary mt-2">+12% vs last month</p>
        </div>
        
        <div className="glass p-4 md:p-6 rounded-lg shadow-sm border border-tertiary">
          <h3 className="text-xs md:text-sm text-secondary uppercase tracking-wider mb-1 md:mb-2">Total Sales</h3>
          <p className="text-xl md:text-3xl font-bold">₦{stats.totalRevenue.toLocaleString()}</p>
        </div>

        <div className="glass p-4 md:p-6 rounded-lg shadow-sm border border-tertiary">
          <h3 className="text-xs md:text-sm text-secondary uppercase tracking-wider mb-1 md:mb-2">Total Expenses</h3>
          <p className="text-xl md:text-3xl font-bold text-danger-500">₦{stats.totalExpenses.toLocaleString()}</p>
        </div>
        
        <div className="glass p-4 md:p-6 rounded-lg shadow-sm border border-tertiary">
          <h3 className="text-xs md:text-sm text-secondary uppercase tracking-wider mb-1 md:mb-2">Active Customers</h3>
          <p className="text-xl md:text-3xl font-bold">{stats.activeCustomers}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Placeholder */}
        <div className="lg:col-span-2 glass p-4 md:p-6 rounded-lg shadow-sm border border-tertiary flex flex-col h-64 md:h-80">
          <h3 className="font-bold mb-4">Revenue Trend (This Week)</h3>
          <div className="flex-1 border-b border-l border-tertiary relative flex items-end justify-between p-4 pt-10">
            {/* CSS Bar Chart Simulation */}
            {[40, 70, 45, 90, 65, 80, 100].map((h, i) => (
              <div key={i} className="w-8 md:w-12 bg-brand-500/80 rounded-t-sm" style={{ height: `${h}%` }}></div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-secondary mt-2 px-4">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass p-4 md:p-6 rounded-lg shadow-sm border border-tertiary">
          <h3 className="font-bold mb-4">Recent Activity</h3>
          <div className="flex flex-col gap-4">
            {stats.recentTransactions.map(txn => (
              <div key={txn.id} className="flex justify-between items-center pb-4 border-b border-tertiary last:border-0">
                <div>
                  <p className="font-bold text-sm md:text-base">{txn.desc}</p>
                  <p className="text-xs text-secondary">{txn.date}</p>
                </div>
                <div className="text-success-500 font-bold text-sm md:text-base">
                  +₦{txn.amount.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
