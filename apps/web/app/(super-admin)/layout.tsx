import '../globals.css';
import { ReactNode } from 'react';
import { Shield, Users, Mail, Settings, AlertTriangle, Activity } from 'lucide-react';

export default function SuperAdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-white text-black overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-200 bg-white flex flex-col shrink-0">
        <div className="p-6 border-b border-zinc-200">
          <div className="flex items-center gap-2 text-purple-600">
            <Shield size={24} />
            <h1 className="font-extrabold text-lg tracking-wider text-black">
              PORTAL<span className="text-purple-600">ADMIN</span>
            </h1>
          </div>
          <div className="mt-1.5 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
            <span className="text-xs text-zinc-500 font-mono font-semibold">SYSTEM: ONLINE</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          <a href="#" className="flex items-center gap-3 p-3 rounded-xl bg-purple-50 text-purple-700 font-bold border border-purple-200 shadow-xs">
            <Activity size={18} className="text-purple-600" />
            <span>Command Center</span>
          </a>
          <a href="#" className="flex items-center gap-3 p-3 rounded-xl text-zinc-600 hover:bg-zinc-100 hover:text-black font-semibold transition-colors">
            <Users size={18} />
            <span>Tenant Management</span>
          </a>
          <a href="#" className="flex items-center gap-3 p-3 rounded-xl text-zinc-600 hover:bg-zinc-100 hover:text-black font-semibold transition-colors">
            <Mail size={18} />
            <span>Broadcasts & Comms</span>
          </a>
          <a href="#" className="flex items-center gap-3 p-3 rounded-xl text-zinc-600 hover:bg-zinc-100 hover:text-black font-semibold transition-colors">
            <AlertTriangle size={18} />
            <span>Support & Penalties</span>
          </a>
          <a href="#" className="flex items-center gap-3 p-3 rounded-xl text-zinc-600 hover:bg-zinc-100 hover:text-black font-semibold transition-colors">
            <Settings size={18} />
            <span>Global Policies</span>
          </a>
        </nav>
        
        <div className="p-4 border-t border-zinc-200">
          <div className="flex items-center gap-3 p-3 bg-zinc-50 rounded-2xl border border-zinc-200">
            <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-extrabold text-sm border border-purple-200">
              SA
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold text-black truncate">Super Admin</p>
              <p className="text-xs text-zinc-500 truncate">System Governance</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden bg-white relative">
        <header className="h-16 border-b border-zinc-200 bg-white/90 backdrop-blur-md flex items-center justify-between px-8 z-10 shrink-0">
          <h2 className="font-mono text-xs font-bold text-zinc-500 uppercase tracking-wider">
            /SUPER_ADMIN/COMMAND_CENTER
          </h2>
          <div className="flex gap-4">
            <button className="text-xs font-bold px-4 py-2 border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl transition-colors cursor-pointer">
              EMERGENCY LOCKDOWN
            </button>
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto p-8 z-10">
          {children}
        </div>
      </main>
    </div>
  );
}

