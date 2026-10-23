"use client";
import { useState, useEffect, useMemo } from "react";

interface Customer {
  _id?: string;
  id?: string;
  name: string;
  phone: string;
  whatsapp?: string;
  address?: string;
  notes?: string;
  created_at?: string;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"table" | "cards">("cards");

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const token = document.cookie.split("; ").find((row) => row.startsWith("token="))?.split("=")[1];
      const res = await fetch("/api/customers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setCustomers(Array.isArray(data) ? data : data.data || []);
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

  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const q = searchQuery.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        (c.phone && c.phone.includes(q)) ||
        (c.whatsapp && c.whatsapp.includes(q)) ||
        (c.address && c.address.toLowerCase().includes(q))
      );
    });
  }, [customers, searchQuery]);

  const handleAddCustomer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData);

    try {
      const token = document.cookie.split("; ").find((row) => row.startsWith("token="))?.split("=")[1];
      const res = await fetch("/api/customers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchCustomers();
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
    <div className="animate-fade-in relative space-y-6 pb-24 md:pb-8">
      {/* Monday.com Board Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-secondary mb-1">
            <span>Workspaces</span>
            <span>&rsaquo;</span>
            <span className="text-brand-400 font-medium">CRM & Directory</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
            <span>Customers & Clients</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-secondary">
              {filteredCustomers.length} contacts
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* View Mode Switcher */}
          <div className="bg-white/[0.05] p-1 rounded-lg border border-white/10 flex text-xs">
            <button
              onClick={() => setViewMode("cards")}
              className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                viewMode === "cards" ? "bg-brand-500 text-white shadow-sm" : "text-secondary hover:text-white"
              }`}
            >
              🃏 Cards
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                viewMode === "table" ? "bg-brand-500 text-white shadow-sm" : "text-secondary hover:text-white"
              }`}
            >
              📋 Table
            </button>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="btn btn-primary flex-1 md:flex-none text-sm px-4 py-2 gap-1.5 shadow-md shadow-brand-500/20"
          >
            <span className="text-base font-bold">+</span>
            <span>Add Customer</span>
          </button>
        </div>
      </div>

      {/* Monday.com Search Bar */}
      <div className="bg-white/[0.02] p-3 rounded-xl border border-white/5 flex items-center gap-3">
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="🔍 Search customers by name, phone, or address..."
          className="w-full bg-primary/60 border border-white/10 rounded-lg px-3.5 py-2 text-sm text-white placeholder-secondary focus:border-brand-500 outline-none"
        />
      </div>

      {loading ? (
        <div className="text-center py-12 text-secondary">
          <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm">Loading contacts...</p>
        </div>
      ) : filteredCustomers.length === 0 ? (
        <div className="glass p-12 text-center rounded-2xl border border-white/5">
          <p className="text-4xl mb-3">👥</p>
          <h3 className="text-lg font-bold text-white mb-1">No customers yet</h3>
          <p className="text-sm text-secondary mb-4">Add your clients to track invoices and sales history.</p>
          <button onClick={() => setIsModalOpen(true)} className="btn btn-primary text-sm">
            + Add First Customer
          </button>
        </div>
      ) : viewMode === "cards" ? (
        /* ========================================================== */
        /* MONDAY.COM MOBILE-FIRST CONTACT CARDS                     */
        /* ========================================================== */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredCustomers.map((cust) => {
            const initial = cust.name.charAt(0).toUpperCase();
            const cleanPhone = cust.phone?.replace(/[^0-9]/g, "");
            const waNumber = (cust.whatsapp || cust.phone)?.replace(/[^0-9]/g, "");

            return (
              <div
                key={cust._id || cust.id}
                className="glass p-4 rounded-xl border border-white/5 border-l-4 border-l-[#579bfc] hover:border-white/20 transition-all shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center font-bold text-sm border border-blue-500/30">
                      {initial}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-white text-base truncate">{cust.name}</h4>
                      <p className="text-xs text-secondary truncate">{cust.phone || "No phone"}</p>
                    </div>
                  </div>

                  {cust.address && (
                    <p className="text-xs text-secondary line-clamp-1 mb-3">
                      📍 {cust.address}
                    </p>
                  )}
                </div>

                {/* Quick Action Buttons for Mobile */}
                <div className="flex items-center gap-2 pt-3 border-t border-white/5 mt-auto">
                  {cleanPhone && (
                    <a
                      href={`tel:${cleanPhone}`}
                      className="flex-1 text-center py-2 px-3 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>📞</span>
                      <span>Call</span>
                    </a>
                  )}

                  {waNumber && (
                    <a
                      href={`https://wa.me/${waNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center py-2 px-3 rounded-lg bg-success-500/15 hover:bg-success-500/25 text-xs font-semibold text-success-400 border border-success-500/30 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>💬</span>
                      <span>WhatsApp</span>
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* ========================================================== */
        /* MONDAY.COM DIRECTORY TABLE                                 */
        /* ========================================================== */
        <div className="glass rounded-xl border border-white/5 overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[650px]">
              <thead className="bg-white/[0.03] text-xs text-secondary uppercase tracking-wider border-b border-white/10">
                <tr>
                  <th className="p-3.5 pl-4 font-semibold">Customer</th>
                  <th className="p-3.5 font-semibold">Phone Number</th>
                  <th className="p-3.5 font-semibold">WhatsApp</th>
                  <th className="p-3.5 font-semibold">Address</th>
                  <th className="p-3.5 pr-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {filteredCustomers.map((c) => {
                  const initial = c.name.charAt(0).toUpperCase();
                  const waNumber = (c.whatsapp || c.phone)?.replace(/[^0-9]/g, "");

                  return (
                    <tr key={c._id || c.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-3.5 pl-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center font-bold text-xs">
                            {initial}
                          </div>
                          <span className="font-medium text-white">{c.name}</span>
                        </div>
                      </td>
                      <td className="p-3.5 text-secondary">{c.phone || "—"}</td>
                      <td className="p-3.5 text-secondary">{c.whatsapp || "—"}</td>
                      <td className="p-3.5 text-secondary text-xs">{c.address || "—"}</td>
                      <td className="p-3.5 pr-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {waNumber && (
                            <a
                              href={`https://wa.me/${waNumber}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-success-400 hover:text-success-300 font-medium"
                            >
                              WhatsApp
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* MONDAY.COM BOTTOM-SHEET / MODAL FOR NEW CUSTOMER          */}
      {/* ========================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 animate-fade-in">
          <div className="glass rounded-t-2xl sm:rounded-2xl p-6 sm:p-8 max-w-md w-full max-h-[90vh] overflow-y-auto border border-white/10 shadow-2xl">
            <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-4 sm:hidden"></div>

            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-white">Add New Customer</h2>
                <p className="text-xs text-secondary">Store client details for invoices and messaging</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20"
              >
                &times;
              </button>
            </div>

            <form className="flex flex-col gap-4" onSubmit={handleAddCustomer}>
              <div>
                <label className="text-xs font-semibold text-secondary uppercase tracking-wider block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. Adebayo Ogunlesi"
                  className="w-full p-3 rounded-xl border border-white/10 bg-primary text-white outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-secondary uppercase tracking-wider block mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="e.g. 08012345678"
                  className="w-full p-3 rounded-xl border border-white/10 bg-primary text-white outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-secondary uppercase tracking-wider block mb-1">
                  WhatsApp Number (Optional)
                </label>
                <input
                  type="tel"
                  name="whatsapp"
                  placeholder="e.g. 08012345678"
                  className="w-full p-3 rounded-xl border border-white/10 bg-primary text-white outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-secondary uppercase tracking-wider block mb-1">
                  Address (Optional)
                </label>
                <textarea
                  name="address"
                  rows={2}
                  placeholder="Shop address or delivery location"
                  className="w-full p-3 rounded-xl border border-white/10 bg-primary text-white outline-none focus:border-brand-500"
                ></textarea>
              </div>

              <div className="flex gap-3 pt-3 mt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-secondary flex-1 p-3 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary flex-1 p-3 text-sm shadow-lg shadow-brand-500/20"
                >
                  {isSubmitting ? "Saving..." : "Save Contact"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
