"use client";
import { useState, useEffect, useMemo } from "react";

interface Transaction {
  _id?: string;
  id?: string;
  invoice_number?: string;
  created_at: string;
  customer_id?: { _id: string; name: string; phone?: string } | any;
  customer?: { name: string; phone?: string };
  total: number;
  subtotal: number;
  vat: number;
  status: string;
  type: string;
  items?: { description: string; quantity: number; unit_price: number }[];
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Transaction[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [viewMode, setViewMode] = useState<"table" | "cards">("cards");
  const [selectedInvoice, setSelectedInvoice] = useState<Transaction | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = document.cookie.split("; ").find((row) => row.startsWith("token="))?.split("=")[1];
      const headers = { Authorization: `Bearer ${token}` };

      const [invRes, custRes] = await Promise.all([
        fetch("/api/transactions", { headers }),
        fetch("/api/customers", { headers }),
      ]);

      if (invRes.ok) {
        const invJson = await invRes.json();
        setInvoices(Array.isArray(invJson) ? invJson : invJson.data || []);
      }
      if (custRes.ok) {
        const custJson = await custRes.json();
        setCustomers(Array.isArray(custJson) ? custJson : custJson.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filtered transactions
  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      const customerName = (inv.customer_id?.name || inv.customer?.name || "Walk-in Customer").toLowerCase();
      const desc = inv.items?.[0]?.description?.toLowerCase() || "";
      const matchesSearch =
        customerName.includes(searchQuery.toLowerCase()) ||
        desc.includes(searchQuery.toLowerCase()) ||
        String(inv.total).includes(searchQuery);

      const status = (inv.status || "Pending").toUpperCase();
      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "PAID" && status === "PAID") ||
        (statusFilter === "PENDING" && (status === "PENDING" || status === "UNPAID")) ||
        (statusFilter === "VOID" && (status === "VOID" || status === "CANCELLED"));

      return matchesSearch && matchesStatus;
    });
  }, [invoices, searchQuery, statusFilter]);

  // Group by status (Monday.com pattern)
  const paidGroup = useMemo(
    () => filteredInvoices.filter((i) => (i.status || "").toUpperCase() === "PAID"),
    [filteredInvoices]
  );
  const pendingGroup = useMemo(
    () => filteredInvoices.filter((i) => (i.status || "").toUpperCase() !== "PAID"),
    [filteredInvoices]
  );

  // Status stats for Monday.com Progress Battery
  const totalCount = invoices.length;
  const paidCount = invoices.filter((i) => (i.status || "").toUpperCase() === "PAID").length;
  const pendingCount = totalCount - paidCount;
  const paidPercent = totalCount > 0 ? (paidCount / totalCount) * 100 : 0;
  const pendingPercent = totalCount > 0 ? (pendingCount / totalCount) * 100 : 0;

  const handleCreateInvoice = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const amountVal = parseFloat(formData.get("amount") as string) || 0;
    const custId = formData.get("customer_id") as string;

    const payload = {
      customer_id: custId || undefined,
      subtotal: amountVal,
      vat: 0,
      total: amountVal,
      status: formData.get("status") || "Pending",
      items: [
        {
          description: formData.get("description") || "Standard Service",
          quantity: 1,
          unit_price: amountVal,
        },
      ],
    };

    try {
      if (!navigator.onLine) {
        const { addToSyncQueue } = await import("../../../lib/db");
        await addToSyncQueue("transaction", payload);
        setIsModalOpen(false);
        setIsSubmitting(false);
        alert("Saved offline. It will sync automatically when your internet reconnects.");
        return;
      }

      const token = document.cookie.split("; ").find((row) => row.startsWith("token="))?.split("=")[1];
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchData();
      } else {
        alert("Failed to create transaction");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving transaction");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status?: string) => {
    const s = (status || "Pending").toUpperCase();
    if (s === "PAID") return <span className="monday-pill monday-pill-done">Paid</span>;
    if (s === "PENDING" || s === "WORKING") return <span className="monday-pill monday-pill-working">Working on it</span>;
    if (s === "VOID" || s === "STUCK") return <span className="monday-pill monday-pill-stuck">Stuck</span>;
    return <span className="monday-pill monday-pill-info">{status}</span>;
  };

  const shareViaWhatsApp = (inv: Transaction) => {
    const custName = inv.customer_id?.name || inv.customer?.name || "Customer";
    const custPhone = inv.customer_id?.phone || inv.customer?.phone || "";
    const totalFormatted = `₦${Number(inv.total).toLocaleString()}`;
    const itemsText = inv.items?.map((it) => `- ${it.description}: ₦${it.unit_price}`).join("\n") || "";

    const text = `Hello ${custName},\n\nThank you for your business! Here are your transaction details:\n\n*Amount Due/Total:* ${totalFormatted}\n*Status:* ${inv.status || "Pending"}\n${itemsText}\n\nSMB Portal Business Receipts.`;
    const cleanPhone = custPhone.replace(/[^0-9]/g, "");
    const waUrl = cleanPhone
      ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`
      : `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(waUrl, "_blank");
  };

  return (
    <div className="animate-fade-in relative space-y-6 pb-24 md:pb-8">
      {/* Monday.com Board Header Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-secondary mb-1">
            <span>Workspaces</span>
            <span>&rsaquo;</span>
            <span className="text-brand-400 font-medium">Sales Pipeline</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
            <span>Transactions & Invoices</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-secondary">
              {filteredInvoices.length} items
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* View Mode Switcher (Monday.com pattern) */}
          <div className="bg-white/[0.05] p-1 rounded-lg border border-white/10 flex text-xs">
            <button
              onClick={() => setViewMode("table")}
              className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                viewMode === "table" ? "bg-brand-500 text-white shadow-sm" : "text-secondary hover:text-white"
              }`}
            >
              📋 Table
            </button>
            <button
              onClick={() => setViewMode("cards")}
              className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                viewMode === "cards" ? "bg-brand-500 text-white shadow-sm" : "text-secondary hover:text-white"
              }`}
            >
              🃏 Cards
            </button>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="btn btn-primary flex-1 md:flex-none text-sm px-4 py-2 gap-1.5 shadow-md shadow-brand-500/20"
          >
            <span className="text-base font-bold">+</span>
            <span>New Item</span>
          </button>
        </div>
      </div>

      {/* Monday.com Battery Progress Bar */}
      {totalCount > 0 && (
        <div className="bg-white/[0.03] p-4 rounded-xl border border-white/5 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-secondary font-medium">Board Settlement Progress</span>
            <span className="text-white font-bold">{Math.round(paidPercent)}% Settled</span>
          </div>
          <div className="monday-battery w-full">
            <div style={{ width: `${paidPercent}%` }} className="bg-[#00c875] h-full transition-all duration-500"></div>
            <div style={{ width: `${pendingPercent}%` }} className="bg-[#fdab3d] h-full transition-all duration-500"></div>
          </div>
          <div className="flex items-center gap-4 text-xs text-secondary pt-1">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00c875]"></span> Paid ({paidCount})
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#fdab3d]"></span> Working / Pending ({pendingCount})
            </span>
          </div>
        </div>
      )}

      {/* Monday.com Search & Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white/[0.02] p-3 rounded-xl border border-white/5">
        <div className="flex-1 min-w-[240px]">
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="🔍 Search items, customers, or amounts..."
            className="w-full bg-primary/60 border border-white/10 rounded-lg px-3.5 py-2 text-sm text-white placeholder-secondary focus:border-brand-500 outline-none"
          />
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1 sm:pb-0">
          {["ALL", "PAID", "PENDING", "VOID"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-full font-medium transition-all ${
                statusFilter === st
                  ? "bg-white/20 text-white border border-white/30"
                  : "bg-white/[0.04] text-secondary hover:text-white border border-transparent"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-secondary">
          <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm">Loading board items...</p>
        </div>
      ) : filteredInvoices.length === 0 ? (
        <div className="glass p-12 text-center rounded-2xl border border-white/5">
          <p className="text-4xl mb-3">📋</p>
          <h3 className="text-lg font-bold text-white mb-1">No items found</h3>
          <p className="text-sm text-secondary mb-4">Get started by creating your first invoice or transaction.</p>
          <button onClick={() => setIsModalOpen(true)} className="btn btn-primary text-sm">
            + Add New Transaction
          </button>
        </div>
      ) : viewMode === "cards" ? (
        /* ========================================================== */
        /* MONDAY.COM MOBILE-FIRST CARDS VIEW                        */
        /* ========================================================== */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredInvoices.map((inv) => {
            const isPaid = (inv.status || "").toUpperCase() === "PAID";
            const cust = inv.customer_id?.name || inv.customer?.name || "Walk-in Customer";
            const initial = cust.charAt(0).toUpperCase();

            return (
              <div
                key={inv._id || inv.id}
                className={`glass p-4 rounded-xl border border-white/5 relative overflow-hidden transition-all hover:border-white/20 shadow-sm flex flex-col justify-between border-l-4 ${
                  isPaid ? "border-l-[#00c875]" : "border-l-[#fdab3d]"
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-brand-500/20 text-brand-300 flex items-center justify-center font-bold text-xs border border-brand-500/30">
                        {initial}
                      </div>
                      <div>
                        <h4 className="font-semibold text-white text-sm leading-tight">{cust}</h4>
                        <span className="text-[11px] text-secondary">
                          {new Date(inv.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                        </span>
                      </div>
                    </div>
                    {getStatusBadge(inv.status)}
                  </div>

                  <p className="text-xs text-secondary line-clamp-1 mb-3">
                    {inv.items?.[0]?.description || "Retail POS Sale"}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/5 mt-auto">
                  <span className="text-base font-bold text-white">
                    ₦{Number(inv.total).toLocaleString()}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => shareViaWhatsApp(inv)}
                      className="px-2.5 py-1.5 rounded-lg bg-success-500/10 text-success-400 hover:bg-success-500/20 text-xs font-medium flex items-center gap-1 border border-success-500/20"
                      title="Share Receipt on WhatsApp"
                    >
                      <span>💬</span>
                      <span>Receipt</span>
                    </button>
                    <button
                      onClick={() => setSelectedInvoice(inv)}
                      className="px-2.5 py-1.5 rounded-lg bg-white/10 text-white hover:bg-white/20 text-xs font-medium"
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* ========================================================== */
        /* MONDAY.COM BOARD TABLE VIEW                                */
        /* ========================================================== */
        <div className="glass rounded-xl border border-white/5 overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead className="bg-white/[0.03] text-xs text-secondary uppercase tracking-wider border-b border-white/10">
                <tr>
                  <th className="p-3.5 pl-4 font-semibold">Item / Description</th>
                  <th className="p-3.5 font-semibold">Customer</th>
                  <th className="p-3.5 font-semibold">Date</th>
                  <th className="p-3.5 font-semibold text-center">Status</th>
                  <th className="p-3.5 font-semibold text-right">Total (₦)</th>
                  <th className="p-3.5 pr-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {filteredInvoices.map((inv) => {
                  const cust = inv.customer_id?.name || inv.customer?.name || "Walk-in Customer";
                  const initial = cust.charAt(0).toUpperCase();

                  return (
                    <tr key={inv._id || inv.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-3.5 pl-4">
                        <span className="font-medium text-white">
                          {inv.items?.[0]?.description || "Retail Transaction"}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-brand-500/20 text-brand-300 flex items-center justify-center font-bold text-[10px]">
                            {initial}
                          </div>
                          <span className="text-secondary">{cust}</span>
                        </div>
                      </td>
                      <td className="p-3.5 text-secondary text-xs">
                        {new Date(inv.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-3.5 text-center">
                        {getStatusBadge(inv.status)}
                      </td>
                      <td className="p-3.5 font-bold text-white text-right">
                        ₦{Number(inv.total).toLocaleString()}
                      </td>
                      <td className="p-3.5 pr-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => shareViaWhatsApp(inv)}
                            className="text-xs text-success-400 hover:text-success-300 font-medium"
                          >
                            WhatsApp
                          </button>
                          <button
                            onClick={() => setSelectedInvoice(inv)}
                            className="text-xs text-brand-400 hover:text-brand-300 font-medium"
                          >
                            Details
                          </button>
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
      {/* MONDAY.COM BOTTOM-SHEET / MODAL FOR CREATION               */}
      {/* ========================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 animate-fade-in">
          <div className="glass rounded-t-2xl sm:rounded-2xl p-6 sm:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto border border-white/10 shadow-2xl">
            {/* Sheet Handle for Mobile */}
            <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-4 sm:hidden"></div>

            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-white">Create New Item</h2>
                <p className="text-xs text-secondary">Record a sale or issue an invoice</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20"
              >
                &times;
              </button>
            </div>

            <form className="flex flex-col gap-4" onSubmit={handleCreateInvoice}>
              <div>
                <label className="text-xs font-semibold text-secondary uppercase tracking-wider block mb-1">
                  Customer
                </label>
                <select
                  name="customer_id"
                  className="w-full p-3 rounded-xl border border-white/10 bg-primary text-white outline-none focus:border-brand-500"
                >
                  <option value="">Walk-in Customer (General)</option>
                  {customers.map((c) => (
                    <option key={c._id || c.id} value={c._id || c.id}>
                      {c.name} {c.phone ? `(${c.phone})` : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-secondary uppercase tracking-wider block mb-1">
                  Item / Service Description
                </label>
                <input
                  type="text"
                  name="description"
                  required
                  placeholder="e.g. Consultation, Retail items, Service fee"
                  className="w-full p-3 rounded-xl border border-white/10 bg-primary text-white outline-none focus:border-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-secondary uppercase tracking-wider block mb-1">
                    Amount (₦)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="amount"
                    required
                    placeholder="0.00"
                    className="w-full p-3 rounded-xl border border-white/10 bg-primary text-white outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-secondary uppercase tracking-wider block mb-1">
                    Initial Status
                  </label>
                  <select
                    name="status"
                    defaultValue="Pending"
                    className="w-full p-3 rounded-xl border border-white/10 bg-primary text-white outline-none focus:border-brand-500"
                  >
                    <option value="Paid">Paid (Done)</option>
                    <option value="Pending">Pending (Working)</option>
                    <option value="Void">Void (Stuck)</option>
                  </select>
                </div>
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
                  {isSubmitting ? "Saving..." : "Create Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* ITEM DETAIL SLIDE-OVER / RECEIPT MODAL                     */}
      {/* ========================================================== */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 animate-fade-in">
          <div className="glass rounded-t-2xl sm:rounded-2xl p-6 sm:p-8 max-w-md w-full border border-white/10 shadow-2xl">
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-white/10">
              <div>
                <h3 className="font-bold text-lg text-white">Item Details</h3>
                <span className="text-xs text-secondary">
                  {new Date(selectedInvoice.created_at).toLocaleString()}
                </span>
              </div>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20"
              >
                &times;
              </button>
            </div>

            <div className="space-y-4 text-sm mb-6">
              <div className="flex justify-between items-center">
                <span className="text-secondary">Customer</span>
                <span className="font-semibold text-white">
                  {selectedInvoice.customer_id?.name || selectedInvoice.customer?.name || "Walk-in Customer"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-secondary">Status</span>
                <div>{getStatusBadge(selectedInvoice.status)}</div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-secondary">Item</span>
                <span className="text-white">{selectedInvoice.items?.[0]?.description || "Retail item"}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-white/10 text-base font-bold">
                <span className="text-white">Total Amount</span>
                <span className="text-brand-400">₦{Number(selectedInvoice.total).toLocaleString()}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => shareViaWhatsApp(selectedInvoice)}
                className="btn btn-primary w-full p-3 text-sm flex items-center justify-center gap-2"
              >
                <span>💬</span>
                <span>Send WhatsApp Receipt</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
