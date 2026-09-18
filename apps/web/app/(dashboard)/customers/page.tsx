"use client";
import { useState, useEffect } from "react";

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
      const res = await fetch("/api/customers", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setCustomers(data);
      }
    } catch (err) {
      console.error("Failed to fetch customers", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleAddCustomer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
      const res = await fetch("/api/customers", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(Object.fromEntries(formData)),
      });
      
      if (res.ok) {
        setIsModalOpen(false);
        fetchCustomers(); // Refresh the list
      } else {
        alert("Failed to add customer");
      }
    } catch (err) {
      console.error(err);
      alert("Error adding customer");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in relative">
      <div className="flex justify-between items-center mb-8">
        <h1 className="h2">Customers</h1>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>Add Customer</button>
      </div>
      
      <div className="glass p-6 rounded-lg shadow-sm border border-tertiary">
        <div className="flex justify-between mb-4">
          <input 
            type="search" 
            placeholder="Search customers..." 
            className="p-2 w-64" 
            style={{ borderRadius: 'var(--radius-sm)', border: '1px solid var(--bg-tertiary)', background: 'var(--bg-primary)' }}
          />
        </div>
        
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-tertiary text-sm text-secondary">
              <th className="pb-2">Name</th>
              <th className="pb-2">Phone</th>
              <th className="pb-2">WhatsApp</th>
              <th className="pb-2">Address</th>
              <th className="pb-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="py-4 text-center text-secondary" colSpan={5}>
                  Loading customers...
                </td>
              </tr>
            ) : customers.length === 0 ? (
              <tr>
                <td className="py-4 text-center text-secondary" colSpan={5}>
                  No customers found. Click "Add Customer" to get started.
                </td>
              </tr>
            ) : (
              customers.map((c: any) => (
                <tr key={c.id} className="border-b border-tertiary">
                  <td className="py-4">{c.name}</td>
                  <td className="py-4">{c.phone}</td>
                  <td className="py-4">{c.whatsapp || '-'}</td>
                  <td className="py-4">{c.address || '-'}</td>
                  <td className="py-4">
                    <button className="text-brand-600 mr-2">Edit</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
          <div className="glass p-8 container max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="h3">Add New Customer</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-secondary hover:text-primary">&times;</button>
            </div>
            
            <form className="flex flex-col gap-4" onSubmit={handleAddCustomer}>
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-sm">Full Name</label>
                <input type="text" id="name" name="name" required className="p-3" style={{ borderRadius: 'var(--radius-sm)', border: '1px solid var(--bg-tertiary)', background: 'var(--bg-primary)' }} />
              </div>
              
              <div className="flex flex-col gap-2">
                <label htmlFor="phone" className="text-sm">Phone Number</label>
                <input type="tel" id="phone" name="phone" required className="p-3" style={{ borderRadius: 'var(--radius-sm)', border: '1px solid var(--bg-tertiary)', background: 'var(--bg-primary)' }} />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="whatsapp" className="text-sm">WhatsApp (Optional)</label>
                <input type="tel" id="whatsapp" name="whatsapp" className="p-3" style={{ borderRadius: 'var(--radius-sm)', border: '1px solid var(--bg-tertiary)', background: 'var(--bg-primary)' }} />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="address" className="text-sm">Address (Optional)</label>
                <textarea id="address" name="address" rows={2} className="p-3" style={{ borderRadius: 'var(--radius-sm)', border: '1px solid var(--bg-tertiary)', background: 'var(--bg-primary)' }}></textarea>
              </div>
              
              <div className="flex gap-4 mt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary w-full p-3">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="btn btn-primary w-full p-3">{isSubmitting ? 'Saving...' : 'Save Customer'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
