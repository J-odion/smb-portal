"use client";
import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
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
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold mb-2">Command Center</h1>
          <p className="text-secondary">System-wide overview, policies, and tenant management.</p>
        </div>
        <div className="flex bg-tertiary rounded-lg border border-brand-500/20 overflow-hidden w-96">
          <div className="px-3 flex items-center text-secondary">
            <Search size={18} />
          </div>
          <input type="text" placeholder="Search tenants by ID, email, or name..." className="w-full bg-transparent p-3 text-sm outline-none text-white placeholder-secondary" />
        </div>
      </div>

      {/* System Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-secondary p-6 rounded-xl border border-tertiary">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-secondary text-sm font-mono mb-1">TOTAL_TENANTS</p>
              <p className="text-3xl font-bold">1,248</p>
            </div>
            <div className="p-2 bg-brand-500/20 text-brand-400 rounded-lg"><Users size={20} /></div>
          </div>
          <p className="text-xs text-success-500">+42 this week</p>
        </div>
        
        <div className="bg-secondary p-6 rounded-xl border border-tertiary">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-secondary text-sm font-mono mb-1">ACTIVE_USERS</p>
              <p className="text-3xl font-bold">5,892</p>
            </div>
            <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg"><Activity size={20} /></div>
          </div>
          <p className="text-xs text-success-500">+128 this week</p>
        </div>

        <div className="bg-secondary p-6 rounded-xl border border-tertiary">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-secondary text-sm font-mono mb-1">SERVER_LOAD</p>
              <p className="text-3xl font-bold">42%</p>
            </div>
            <div className="p-2 bg-success-500/20 text-success-400 rounded-lg"><Server size={20} /></div>
          </div>
          <p className="text-xs text-secondary">Optimal Performance</p>
        </div>

        <div className="bg-secondary p-6 rounded-xl border border-tertiary border-l-4 border-l-warning-500">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-secondary text-sm font-mono mb-1">OPEN_TICKETS</p>
              <p className="text-3xl font-bold">24</p>
            </div>
            <div className="p-2 bg-warning-500/20 text-warning-400 rounded-lg"><AlertCircle size={20} /></div>
          </div>
          <p className="text-xs text-warning-500">5 High Priority</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* System Load Chart */}
        <div className="lg:col-span-2 bg-secondary p-6 rounded-xl border border-tertiary flex flex-col h-[400px]">
          <h3 className="font-bold mb-6 font-mono text-sm text-secondary">SYSTEM_TRAFFIC_24H</h3>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={systemLoadData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px' }}
                  itemStyle={{ fontSize: '14px', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="tenants" stroke="#a855f7" fillOpacity={1} fill="url(#colorLoad)" name="Active Tenants" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Global Actions */}
        <div className="flex flex-col gap-6">
          <div className="bg-secondary p-6 rounded-xl border border-tertiary">
            <h3 className="font-bold mb-4 font-mono text-sm flex items-center gap-2"><Mail size={16} className="text-brand-500"/> SYSTEM_BROADCAST</h3>
            <p className="text-xs text-secondary mb-4">Send an email/notification to ALL tenant owners.</p>
            <textarea 
              rows={4} 
              value={broadcastMessage}
              onChange={(e) => setBroadcastMessage(e.target.value)}
              placeholder="Enter broadcast message (supports markdown)..."
              className="w-full bg-tertiary border border-tertiary rounded-lg p-3 text-sm text-white outline-none focus:border-brand-500/50 mb-4 resize-none"
            ></textarea>
            <button className="w-full py-2 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2">
              <Mail size={16} /> Broadcast to 1,248 Tenants
            </button>
          </div>

          <div className="bg-secondary p-6 rounded-xl border border-danger-500/30">
            <h3 className="font-bold mb-4 font-mono text-sm text-danger-400 flex items-center gap-2"><ShieldAlert size={16} /> PENALTY_ENFORCEMENT</h3>
            <p className="text-xs text-secondary mb-4">Suspend a tenant or enforce a policy penalty. Proceed with caution.</p>
            <div className="flex gap-2">
              <input type="text" placeholder="Tenant ID..." className="flex-1 bg-tertiary border border-tertiary rounded-lg p-2 text-sm text-white outline-none" />
              <button className="px-4 py-2 bg-danger-500/20 text-danger-400 hover:bg-danger-500 hover:text-white font-bold rounded-lg transition-colors text-sm border border-danger-500/50">
                Suspend
              </button>
            </div>
          </div>

          <div className="bg-secondary p-6 rounded-xl border border-success-500/30">
            <h3 className="font-bold mb-4 font-mono text-sm text-success-400 flex items-center gap-2"><ShieldAlert size={16} /> SUBSCRIPTION_OVERRIDE</h3>
            <p className="text-xs text-secondary mb-4">Bypass billing and grant extended access to a specific tenant.</p>
            <div className="flex flex-col gap-3">
              <input type="text" placeholder="Tenant ID..." className="w-full bg-tertiary border border-tertiary rounded-lg p-2 text-sm text-white outline-none" />
              <div className="flex gap-2">
                <select className="flex-1 bg-tertiary border border-tertiary rounded-lg p-2 text-sm text-white outline-none">
                  <option value="1Y">1 Year Free</option>
                  <option value="2Y">2 Years Free</option>
                  <option value="LIFETIME">Lifetime Free</option>
                </select>
                <button className="px-4 py-2 bg-success-500/20 text-success-400 hover:bg-success-500 hover:text-white font-bold rounded-lg transition-colors text-sm border border-success-500/50">
                  Grant
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Support Queries */}
      <div className="bg-secondary p-6 rounded-xl border border-tertiary">
        <h3 className="font-bold mb-4 font-mono text-sm">SUPPORT_QUEUE (HIGH_PRIORITY)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-secondary border-b border-tertiary">
                <th className="pb-3 font-medium">Ticket ID</th>
                <th className="pb-3 font-medium">Tenant</th>
                <th className="pb-3 font-medium">Issue</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {[
                { id: 'TK-8492', tenant: 'Green Grocery Ltd', issue: 'POS Sync failure offline', status: 'Open' },
                { id: 'TK-8491', tenant: 'Starlight Tailors', issue: 'Billing upgrade error', status: 'Open' },
                { id: 'TK-8488', tenant: 'Max Auto Repair', issue: 'Feature request: VIN scanner', status: 'In Progress' },
              ].map(ticket => (
                <tr key={ticket.id} className="border-b border-tertiary/50 last:border-0 hover:bg-tertiary/30 transition-colors">
                  <td className="py-4 font-mono text-brand-400">{ticket.id}</td>
                  <td className="py-4">{ticket.tenant}</td>
                  <td className="py-4 text-secondary">{ticket.issue}</td>
                  <td className="py-4">
                    <span className="px-2 py-1 bg-warning-500/10 text-warning-400 rounded text-xs">{ticket.status}</span>
                  </td>
                  <td className="py-4 text-right">
                    <button className="text-brand-400 hover:text-white transition-colors">Resolve</button>
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
