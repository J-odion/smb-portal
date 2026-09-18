export default function DashboardPage() {
  return (
    <div className="animate-fade-in">
      <h1 className="h2 mb-8">Business Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="glass p-6 rounded-lg shadow-sm border border-tertiary">
          <h3 className="text-sm text-secondary">Total Invoiced (This Month)</h3>
          <p className="h2 gradient-text mt-2">₦0.00</p>
        </div>
        
        <div className="glass p-6 rounded-lg shadow-sm border border-tertiary">
          <h3 className="text-sm text-secondary">Total Paid (This Month)</h3>
          <p className="h2 text-success-500 mt-2">₦0.00</p>
        </div>

        <div className="glass p-6 rounded-lg shadow-sm border border-tertiary">
          <h3 className="text-sm text-secondary">Total Expenses (This Month)</h3>
          <p className="h2 text-danger-500 mt-2">₦0.00</p>
        </div>
      </div>

      <div className="glass p-6 rounded-lg shadow-sm border border-tertiary">
        <h3 className="h3 mb-4">Recent Transactions</h3>
        <p className="text-secondary text-sm">No transactions found. Create your first invoice to see it here.</p>
      </div>
    </div>
  );
}
