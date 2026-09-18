"use client";
import { useState, useEffect } from "react";

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
      const res = await fetch("/api/expenses", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setExpenses(data);
      }
    } catch (err) {
      console.error("Failed to fetch expenses", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleLogExpense = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          category: formData.get("category"),
          amount: parseFloat(formData.get("amount") as string),
          note: formData.get("note"),
        }),
      });
      
      if (res.ok) {
        setIsModalOpen(false);
        fetchExpenses();
      } else {
        alert("Failed to log expense");
      }
    } catch (err) {
      console.error(err);
      alert("Error logging expense");
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalExpenses = expenses.reduce((sum: number, exp: any) => sum + Number(exp.amount), 0);

  return (
    <div className="animate-fade-in relative">
      <div className="flex justify-between items-center mb-8">
        <h1 className="h2">Expenses</h1>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>Log Expense</button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="glass p-6 rounded-lg shadow-sm border border-tertiary">
          <h3 className="text-sm text-secondary">Total Expenses (This Month)</h3>
          <p className="h3 mt-2">₦{totalExpenses.toLocaleString()}</p>
        </div>
      </div>

      <div className="glass p-6 rounded-lg shadow-sm border border-tertiary">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[500px]">
            <thead>
              <tr className="border-b border-tertiary text-sm text-secondary">
                <th className="pb-2">Date</th>
                <th className="pb-2">Category</th>
                <th className="pb-2">Amount (₦)</th>
                <th className="pb-2">Note</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="py-4 text-center text-secondary" colSpan={4}>
                    Loading expenses...
                  </td>
                </tr>
              ) : expenses.length === 0 ? (
                <tr>
                  <td className="py-4 text-center text-secondary" colSpan={4}>
                    No expenses logged yet. Click "Log Expense" to track costs.
                  </td>
                </tr>
              ) : (
                expenses.map((exp: any) => (
                  <tr key={exp.id} className="border-b border-tertiary">
                    <td className="py-4">{new Date(exp.date).toLocaleDateString()}</td>
                    <td className="py-4">{exp.category}</td>
                    <td className="py-4 font-bold">₦{Number(exp.amount).toLocaleString()}</td>
                    <td className="py-4 text-secondary">{exp.note || '-'}</td>
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
              <h2 className="h3">Log Expense</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-secondary hover:text-primary">&times;</button>
            </div>
            
            <form className="flex flex-col gap-4" onSubmit={handleLogExpense}>
              <div className="flex flex-col gap-2">
                <label htmlFor="category" className="text-sm">Category</label>
                <select id="category" name="category" required className="p-3" style={{ borderRadius: 'var(--radius-sm)', border: '1px solid var(--bg-tertiary)', background: 'var(--bg-primary)' }}>
                  <option value="Fuel">Generator Fuel</option>
                  <option value="Materials">Materials/Supplies</option>
                  <option value="Rent">Rent</option>
                  <option value="Transport">Transport</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="amount" className="text-sm">Amount (₦)</label>
                <input type="number" step="0.01" id="amount" name="amount" required className="p-3" style={{ borderRadius: 'var(--radius-sm)', border: '1px solid var(--bg-tertiary)', background: 'var(--bg-primary)' }} />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="note" className="text-sm">Note (Optional)</label>
                <input type="text" id="note" name="note" className="p-3" style={{ borderRadius: 'var(--radius-sm)', border: '1px solid var(--bg-tertiary)', background: 'var(--bg-primary)' }} />
              </div>
              
              <div className="flex gap-4 mt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary w-full p-3">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="btn btn-primary w-full p-3">{isSubmitting ? 'Saving...' : 'Save Expense'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
