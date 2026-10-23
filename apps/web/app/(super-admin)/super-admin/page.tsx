"use client";
import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Server, Users, Activity, AlertCircle, Search, Mail, ShieldAlert } from 'lucide-react';

const systemLoadData = [
  { time: '00:00', load: 30, tenants: 120 },
  { time: '04:00', load: 25, tenants: 110 },
  { time: '08:00', load: 60, tenants: 300 },
  { time: '12:00', load: 85, tenants: 450 },
  { time: '16:00', load: 75, tenants: 420 },
  { time: '20:00', load: 50, tenants: 280 },
  { time: '24:00', load: 35, tenants: 150 },
];

export default function SuperAdminDashboard() {
  const [broadcastMessage, setBroadcastMessage] = useState('');

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-black mb-1">Command Center</h1>
          <p className="text-zinc-600 text-sm">System-wide overview, policies, and tenant management.</p>
        </div>
        <div className="flex bg-white rounded-xl border border-zinc-200 overflow-hidden w-full md:w-96 shadow-xs">
          <div className="px-3 flex items-center text-zinc-400">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Search tenants by ID, email, or name..."
            className="w-full bg-transparent p-3 text-sm outline-none text-black placeholder-zinc-400"
          />
        </div>
      </div>

      {/* System Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-zinc-200 border-l-4 border-l-purple-600 shadow-sm">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1">TOTAL_TENANTS</p>
              <p className="text-3xl font-extrabold text-black">1,248</p>
            </div>
            <div className="p-2.5 bg-purple-50 text-purple-700 rounded-xl border border-purple-200">
              <Users size={20} />
            </div>
          </div>
          <p className="text-xs text-emerald-600 font-bold">+42 this week</p>
        </div>
        
        <div className="bg-white p-5 rounded-2xl border border-zinc-200 border-l-4 border-l-purple-500 shadow-sm">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1">ACTIVE_USERS</p>
              <p className="text-3xl font-extrabold text-black">5,892</p>
            </div>
            <div className="p-2.5 bg-purple-50 text-purple-700 rounded-xl border border-purple-200">
              <Activity size={20} />
            </div>
          </div>
          <p className="text-xs text-emerald-600 font-bold">+128 this week</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-zinc-200 border-l-4 border-l-emerald-600 shadow-sm">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1">SERVER_LOAD</p>
              <p className="text-3xl font-extrabold text-black">42%</p>
            </div>
            <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-200">
              <Server size={20} />
            </div>
          </div>
          <p className="text-xs text-emerald-600 font-bold">Optimal Performance</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-zinc-200 border-l-4 border-l-amber-500 shadow-sm">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1">OPEN_TICKETS</p>
              <p className="text-3xl font-extrabold text-black">24</p>
            </div>
            <div className="p-2.5 bg-amber-50 text-amber-700 rounded-xl border border-amber-200">
              <AlertCircle size={20} />
            </div>
          </div>
          <p className="text-xs text-red-600 font-bold">5 High Priority</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* System Load Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm flex flex-col h-[400px]">
          <h3 className="font-bold mb-6 text-xs text-zinc-500 uppercase tracking-wider">SYSTEM_TRAFFIC_24H</h3>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={systemLoadData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#71717a', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#71717a', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e4e4e7', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                  itemStyle={{ fontSize: '13px', fontWeight: 'bold', color: '#000000' }}
                />
                <Area type="monotone" dataKey="tenants" stroke="#7c3aed" strokeWidth={2.5} fillOpacity={1} fill="url(#colorLoad)" name="Active Tenants" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Global Actions */}
        <div className="flex flex-col gap-6">
          <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
            <h3 className="font-bold mb-3 text-xs uppercase tracking-wider text-black flex items-center gap-2">
              <Mail size={16} className="text-purple-600"/> SYSTEM_BROADCAST
            </h3>
            <p className="text-xs text-zinc-500 mb-3">Send an email/notification to ALL tenant owners.</p>
            <textarea 
              rows={3} 
              value={broadcastMessage}
              onChange={(e) => setBroadcastMessage(e.target.value)}
              placeholder="Enter broadcast message (supports markdown)..."
              className="w-full bg-white border border-zinc-200 rounded-xl p-3 text-sm text-black outline-none focus:border-purple-600 mb-3 resize-none"
            ></textarea>
            <button className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 text-sm shadow-md shadow-purple-600/20 cursor-pointer">
              <Mail size={16} /> Broadcast to 1,248 Tenants
            </button>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-red-200 shadow-sm">
            <h3 className="font-bold mb-2 text-xs uppercase tracking-wider text-red-600 flex items-center gap-2">
              <ShieldAlert size={16} /> PENALTY_ENFORCEMENT
            </h3>
            <p className="text-xs text-zinc-500 mb-3">Suspend a tenant or enforce a policy penalty.</p>
            <div className="flex gap-2">
              <input type="text" placeholder="Tenant ID..." className="flex-1 bg-white border border-zinc-200 rounded-xl p-2.5 text-sm text-black outline-none" />
              <button className="px-4 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 font-bold rounded-xl transition-colors text-sm border border-red-200 cursor-pointer">
                Suspend
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-emerald-200 shadow-sm">
            <h3 className="font-bold mb-2 text-xs uppercase tracking-wider text-emerald-700 flex items-center gap-2">
              <ShieldAlert size={16} /> SUBSCRIPTION_OVERRIDE
            </h3>
            <p className="text-xs text-zinc-500 mb-3">Bypass billing and grant extended access.</p>
            <div className="flex flex-col gap-2.5">
              <input type="text" placeholder="Tenant ID..." className="w-full bg-white border border-zinc-200 rounded-xl p-2 text-sm text-black outline-none" />
              <div className="flex gap-2">
                <select className="flex-1 bg-white border border-zinc-200 rounded-xl p-2 text-sm text-black outline-none">
                  <option value="1Y">1 Year Free</option>
                  <option value="2Y">2 Years Free</option>
                  <option value="LIFETIME">Lifetime Free</option>
                </select>
                <button className="px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold rounded-xl transition-colors text-sm border border-emerald-200 cursor-pointer">
                  Grant
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Support Queries */}
      <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
        <h3 className="font-bold mb-4 text-xs uppercase tracking-wider text-black">SUPPORT_QUEUE (HIGH_PRIORITY)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-zinc-500 border-b border-zinc-200 text-xs uppercase tracking-wider">
                <th className="pb-3 font-bold">Ticket ID</th>
                <th className="pb-3 font-bold">Tenant</th>
                <th className="pb-3 font-bold">Issue</th>
                <th className="pb-3 font-bold">Status</th>
                <th className="pb-3 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {[
                { id: 'TK-8492', tenant: 'Green Grocery Ltd', issue: 'POS Sync failure offline', status: 'Open' },
                { id: 'TK-8491', tenant: 'Starlight Tailors', issue: 'Billing upgrade error', status: 'Open' },
                { id: 'TK-8488', tenant: 'Max Auto Repair', issue: 'Feature request: VIN scanner', status: 'In Progress' },
              ].map(ticket => (
                <tr key={ticket.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="py-4 font-mono font-bold text-purple-600">{ticket.id}</td>
                  <td className="py-4 font-semibold text-black">{ticket.tenant}</td>
                  <td className="py-4 text-zinc-600">{ticket.issue}</td>
                  <td className="py-4">
                    <span className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-bold">{ticket.status}</span>
                  </td>
                  <td className="py-4 text-right">
                    <button className="text-purple-600 hover:text-purple-800 font-bold transition-colors cursor-pointer">Resolve</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

