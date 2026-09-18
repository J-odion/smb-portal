"use client";
import { useState, useEffect } from "react";

export default function StaffPage() {
  const [staffMembers, setStaffMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [payType, setPayType] = useState("flat");

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
      const res = await fetch("/api/staff", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStaffMembers(data);
      }
    } catch (err) {
      console.error("Failed to fetch staff", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleAddStaff = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
      const res = await fetch("/api/staff", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.get("name"),
          phone: formData.get("phone"),
          pay_type: formData.get("pay_type"),
          flat_amount: formData.get("flat_amount") ? parseFloat(formData.get("flat_amount") as string) : null,
          commission_percent: formData.get("commission_percent") ? parseFloat(formData.get("commission_percent") as string) : null,
        }),
      });
      
      if (res.ok) {
        setIsModalOpen(false);
        fetchStaff();
      } else {
        alert("Failed to add staff member");
      }
    } catch (err) {
      console.error(err);
      alert("Error adding staff");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in relative">
      <div className="flex justify-between items-center mb-8">
        <h1 className="h2">Staff & Payroll</h1>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>Add Staff Member</button>
      </div>
      
      <div className="glass p-6 rounded-lg shadow-sm border border-tertiary">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-tertiary text-sm text-secondary">
              <th className="pb-2">Name</th>
              <th className="pb-2">Phone</th>
              <th className="pb-2">Pay Type</th>
              <th className="pb-2">Rate/Commission</th>
              <th className="pb-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="py-4 text-center text-secondary" colSpan={5}>
                  Loading staff...
                </td>
              </tr>
            ) : staffMembers.length === 0 ? (
              <tr>
                <td className="py-4 text-center text-secondary" colSpan={5}>
                  No staff members found. Click "Add Staff Member" to manage employees.
                </td>
              </tr>
            ) : (
              staffMembers.map((staff: any) => (
                <tr key={staff.id} className="border-b border-tertiary">
                  <td className="py-4">{staff.name}</td>
                  <td className="py-4">{staff.phone}</td>
                  <td className="py-4 capitalize">{staff.pay_type}</td>
                  <td className="py-4 font-bold">
                    {staff.pay_type === 'flat' ? `₦${Number(staff.flat_amount).toLocaleString()}` : `${staff.commission_percent}%`}
                  </td>
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
              <h2 className="h3">Add Staff Member</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-secondary hover:text-primary">&times;</button>
            </div>
            
            <form className="flex flex-col gap-4" onSubmit={handleAddStaff}>
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-sm">Full Name</label>
                <input type="text" id="name" name="name" required className="p-3" style={{ borderRadius: 'var(--radius-sm)', border: '1px solid var(--bg-tertiary)', background: 'var(--bg-primary)' }} />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="phone" className="text-sm">Phone Number</label>
                <input type="tel" id="phone" name="phone" required className="p-3" style={{ borderRadius: 'var(--radius-sm)', border: '1px solid var(--bg-tertiary)', background: 'var(--bg-primary)' }} />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="pay_type" className="text-sm">Compensation Type</label>
                <select id="pay_type" name="pay_type" value={payType} onChange={(e) => setPayType(e.target.value)} required className="p-3" style={{ borderRadius: 'var(--radius-sm)', border: '1px solid var(--bg-tertiary)', background: 'var(--bg-primary)' }}>
                  <option value="flat">Fixed Salary (Flat)</option>
                  <option value="commission">Commission Based</option>
                </select>
              </div>

              {payType === 'flat' ? (
                <div className="flex flex-col gap-2">
                  <label htmlFor="flat_amount" className="text-sm">Salary Amount (₦)</label>
                  <input type="number" step="0.01" id="flat_amount" name="flat_amount" required className="p-3" style={{ borderRadius: 'var(--radius-sm)', border: '1px solid var(--bg-tertiary)', background: 'var(--bg-primary)' }} />
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <label htmlFor="commission_percent" className="text-sm">Commission Percentage (%)</label>
                  <input type="number" step="0.01" max="100" id="commission_percent" name="commission_percent" required className="p-3" style={{ borderRadius: 'var(--radius-sm)', border: '1px solid var(--bg-tertiary)', background: 'var(--bg-primary)' }} />
                </div>
              )}
              
              <div className="flex gap-4 mt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary w-full p-3">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="btn btn-primary w-full p-3">{isSubmitting ? 'Saving...' : 'Add Staff'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
