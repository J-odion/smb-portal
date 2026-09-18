"use client";
import { useState, useEffect } from "react";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
      const headers = { "Authorization": `Bearer ${token}` };
      
      const [invRes, custRes] = await Promise.all([
        fetch("/api/transactions", { headers }),
        fetch("/api/customers", { headers })
      ]);
      
      if (invRes.ok) setInvoices(await invRes.json());
      if (custRes.ok) setCustomers(await custRes.json());
    } catch (err) {
      console.error("Failed to fetch data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateInvoice = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    
    const payload = {
      customer_id: formData.get("customer_id"),
      subtotal: parseFloat(formData.get("amount") as string),
      vat: 0,
      total: parseFloat(formData.get("amount") as string),
      items: [
        {
          description: formData.get("description"),
          quantity: 1,
          unit_price: parseFloat(formData.get("amount") as string),
        }
      ]
    };

    try {
      if (!navigator.onLine) {
        // Dynamic import because of browser APIs
        const { addToSyncQueue } = await import('../../../lib/db');
        await addToSyncQueue('transaction', payload);
        setIsModalOpen(false);
        setIsSubmitting(false);
        // Show a temporary offline row or just alert
        alert("You are offline. Invoice queued for sync when connection is restored.");
        return;
      }

      const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });
      
      if (res.ok) {
        setIsModalOpen(false);
        fetchData();
      } else {
        alert("Failed to create invoice");
      }
    } catch (err) {
      console.error(err);
      alert("Error creating invoice");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in relative">
      <div className="flex justify-between items-center mb-8">
        <h1 className="h2">Transactions & Invoices</h1>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>Create Invoice</button>
      </div>
      
      <div className="glass p-6 rounded-lg shadow-sm border border-tertiary">
        <div className="flex justify-between mb-4">
          <input 
            type="search" 
            placeholder="Search invoices..." 
            className="p-2 w-64" 
            style={{ borderRadius: 'var(--radius-sm)', border: '1px solid var(--bg-tertiary)', background: 'var(--bg-primary)' }}
          />
          <select className="p-2" style={{ borderRadius: 'var(--radius-sm)', border: '1px solid var(--bg-tertiary)', background: 'var(--bg-primary)' }}>
            <option>All Statuses</option>
            <option>Pending</option>
            <option>Paid</option>
            <option>Void</option>
          </select>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-tertiary text-sm text-secondary">
                <th className="pb-2">Date</th>
                <th className="pb-2">Customer</th>
                <th className="pb-2">Total (₦)</th>
                <th className="pb-2">Status</th>
                <th className="pb-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="py-4 text-center text-secondary" colSpan={5}>
                    Loading invoices...
                  </td>
                </tr>
              ) : invoices.length === 0 ? (
                <tr>
                  <td className="py-4 text-center text-secondary" colSpan={5}>
                    No invoices found. Click "Create Invoice" to start billing.
                  </td>
                </tr>
              ) : (
                invoices.map((inv: any) => (
                  <tr key={inv.id} className="border-b border-tertiary">
                    <td className="py-4">{new Date(inv.created_at).toLocaleDateString()}</td>
                    <td className="py-4">{inv.customer?.name || 'Unknown'}</td>
                    <td className="py-4 font-bold">₦{Number(inv.total).toLocaleString()}</td>
                    <td className="py-4 text-secondary">{inv.status}</td>
                    <td className="py-4">
                      <button className="text-brand-600 mr-2">View</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
          <div className="glass p-8 container max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="h3">Create Invoice</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-secondary hover:text-primary">&times;</button>
            </div>
            
            <form className="flex flex-col gap-4" onSubmit={handleCreateInvoice}>
              <div className="flex flex-col gap-2">
                <label htmlFor="customer_id" className="text-sm">Select Customer</label>
                <select id="customer_id" name="customer_id" required className="p-3" style={{ borderRadius: 'var(--radius-sm)', border: '1px solid var(--bg-tertiary)', background: 'var(--bg-primary)' }}>
                  <option value="">-- Choose Customer --</option>
                  {customers.map((c: any) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="description" className="text-sm">Item Description</label>
                <input type="text" id="description" name="description" required className="p-3" style={{ borderRadius: 'var(--radius-sm)', border: '1px solid var(--bg-tertiary)', background: 'var(--bg-primary)' }} />
              </div>
              
              <div className="flex flex-col gap-2">
                <label htmlFor="amount" className="text-sm">Amount (₦)</label>
                <input type="number" step="0.01" id="amount" name="amount" required className="p-3" style={{ borderRadius: 'var(--radius-sm)', border: '1px solid var(--bg-tertiary)', background: 'var(--bg-primary)' }} />
              </div>
              
              <div className="flex gap-4 mt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary w-full p-3">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="btn btn-primary w-full p-3">{isSubmitting ? 'Creating...' : 'Create Invoice'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
