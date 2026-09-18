import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-primary text-primary">
      {/* Sidebar Navigation */}
      <aside className="w-64 glass border-r flex flex-col p-4">
        <div className="mb-8">
          <h1 className="h2 gradient-text">SMB Portal</h1>
        </div>
        
        <nav className="flex flex-col gap-2">
          <Link href="/dashboard" className="btn btn-secondary justify-start p-2 hover:bg-tertiary">
            Dashboard
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
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
