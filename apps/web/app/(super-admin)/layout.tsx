import '../globals.css';
import { ReactNode } from 'react';
import { Shield, Users, Mail, Settings, AlertTriangle, Activity } from 'lucide-react';

export default function SuperAdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-black text-white selection:bg-brand-500/30 overflow-hidden" style={{ '--bg-primary': '#000', '--bg-secondary': '#111', '--bg-tertiary': '#222', '--text-primary': '#fff', '--text-secondary': '#aaa' } as any}>
      {/* Sidebar */}
      <aside className="w-64 border-r border-tertiary bg-secondary flex flex-col">
        <div className="p-6 border-b border-tertiary">
          <div className="flex items-center gap-2 text-brand-500">
            <Shield size={24} />
            <h1 className="font-bold text-lg tracking-wider">PORTAL<span className="text-white">ADMIN</span></h1>
          </div>
          <div className="mt-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-success-500 animate-pulse"></span>
            <span className="text-xs text-secondary font-mono">SYSTEM: ONLINE</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <a href="#" className="flex items-center gap-3 p-3 rounded-lg bg-tertiary text-white font-medium border border-brand-500/30 shadow-[0_0_15px_rgba(168,85,247,0.1)]">
            <Activity size={18} className="text-brand-400" />
            <span>Command Center</span>
          </a>
          <a href="#" className="flex items-center gap-3 p-3 rounded-lg text-secondary hover:bg-tertiary hover:text-white transition-colors">
            <Users size={18} />
            <span>Tenant Management</span>
          </a>
          <a href="#" className="flex items-center gap-3 p-3 rounded-lg text-secondary hover:bg-tertiary hover:text-white transition-colors">
            <Mail size={18} />
            <span>Broadcasts & Comms</span>
          </a>
          <a href="#" className="flex items-center gap-3 p-3 rounded-lg text-secondary hover:bg-tertiary hover:text-white transition-colors">
            <AlertTriangle size={18} />
            <span>Support & Penalties</span>
          </a>
          <a href="#" className="flex items-center gap-3 p-3 rounded-lg text-secondary hover:bg-tertiary hover:text-white transition-colors">
            <Settings size={18} />
            <span>Global Policies</span>
          </a>
        </nav>
        
        <div className="p-4 border-t border-tertiary">
          <div className="flex items-center gap-3 p-3 bg-tertiary rounded-lg">
            <div className="w-8 h-8 rounded-full bg-brand-500/20 text-brand-500 flex items-center justify-center font-bold text-sm">
              SA
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold truncate">Super Admin</p>
              <p className="text-xs text-secondary truncate">God Mode</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden bg-primary relative">
        {/* Subtle grid background for the god-mode feel */}
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        
        <header className="h-16 border-b border-tertiary bg-primary/80 backdrop-blur-md flex items-center justify-between px-8 z-10">
          <h2 className="font-mono text-sm text-secondary">/SUPER_ADMIN/COMMAND_CENTER</h2>
          <div className="flex gap-4">
            <button className="text-sm px-4 py-1.5 border border-danger-500/50 text-danger-400 rounded hover:bg-danger-500/10 transition-colors">EMERGENCY LOCKDOWN</button>
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto p-8 z-10">
          {children}
        </div>
      </main>
    </div>
  );
}
