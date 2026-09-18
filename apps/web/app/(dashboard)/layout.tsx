import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-primary text-primary pb-16 md:pb-0">
      {/* Sidebar Navigation - Desktop/Tablet Only */}
      <aside className="w-64 glass border-r hidden md:flex flex-col p-4 h-screen sticky top-0 overflow-y-auto">
        <div className="mb-8">
          <h1 className="h2 gradient-text">SMB Portal</h1>
        </div>
        <div className="mb-6">
          <label className="text-xs text-secondary uppercase tracking-wider mb-2 block">Active Branch</label>
          <select className="w-full p-2" style={{ borderRadius: 'var(--radius-sm)', border: '1px solid var(--bg-tertiary)', background: 'var(--bg-primary)' }}>
            <option>Main HQ (Ikeja)</option>
            <option>Branch 2 (Lekki)</option>
          </select>
        </div>
        
        <nav className="flex flex-col gap-2">
          <Link href="/pos" className="btn btn-primary justify-start p-2 mb-4">
            POS Terminal
          </Link>
          <Link href="/dashboard" className="btn btn-secondary justify-start p-2 hover:bg-tertiary">
            Dashboard
          </Link>
          <Link href="/inventory" className="btn btn-secondary justify-start p-2 hover:bg-tertiary">
            Inventory
          </Link>
          <Link href="/customers" className="btn btn-secondary justify-start p-2 hover:bg-tertiary">
            Customers
          </Link>
          <Link href="/invoices" className="btn btn-secondary justify-start p-2 hover:bg-tertiary">
            Transactions
          </Link>
          <Link href="/expenses" className="btn btn-secondary justify-start p-2 hover:bg-tertiary">
            Expenses
          </Link>
          <Link href="/staff" className="btn btn-secondary justify-start p-2 hover:bg-tertiary">
            Staff
          </Link>
          <Link href="/settings" className="btn btn-secondary justify-start p-2 hover:bg-tertiary mt-8">
            Settings
          </Link>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {children}
      </main>

      {/* Bottom Navigation - Mobile Only */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 glass border-t border-tertiary flex justify-around items-center h-16 px-2 z-50">
        <Link href="/dashboard" className="flex flex-col items-center p-2 text-secondary hover:text-primary">
          <span className="text-xl">🏠</span>
          <span className="text-[10px]">Home</span>
        </Link>
        <Link href="/invoices" className="flex flex-col items-center p-2 text-secondary hover:text-primary">
          <span className="text-xl">🧾</span>
          <span className="text-[10px]">Sales</span>
        </Link>
        <Link href="/pos" className="flex flex-col items-center justify-center -mt-8 bg-brand-600 text-white rounded-full w-14 h-14 shadow-lg shadow-brand-500/30">
          <span className="text-2xl">⚡</span>
        </Link>
        <Link href="/customers" className="flex flex-col items-center p-2 text-secondary hover:text-primary">
          <span className="text-xl">👥</span>
          <span className="text-[10px]">Clients</span>
        </Link>
        <Link href="/expenses" className="flex flex-col items-center p-2 text-secondary hover:text-primary">
          <span className="text-xl">💰</span>
          <span className="text-[10px]">Costs</span>
        </Link>
      </nav>
    </div>
  );
}
