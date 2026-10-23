"use client";
import { useState, useEffect, useMemo } from "react";

interface ExpenseItem {
  _id?: string;
  id?: string;
  category: string;
  amount: number;
  note?: string;
  date: string;
  created_at?: string;
}

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");

  const categories = ["ALL", "Rent", "Utilities", "Supplies", "Salaries", "Maintenance", "Logistics"];

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const token = document.cookie.split("; ").find((row) => row.startsWith("token="))?.split("=")[1];
      const res = await fetch("/api/expenses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setExpenses(Array.isArray(data) ? data : data.data || []);
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

  const filteredExpenses = useMemo(() => {
    return expenses.filter((ex) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        ex.category.toLowerCase().includes(q) ||
        (ex.note && ex.note.toLowerCase().includes(q)) ||
        String(ex.amount).includes(q);
      const matchesCat = selectedCategory === "ALL" || ex.category.toLowerCase() === selectedCategory.toLowerCase();
      return matchesSearch && matchesCat;
    });
  }, [expenses, searchQuery, selectedCategory]);

  const totalSpent = useMemo(
    () => filteredExpenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0),
    [filteredExpenses]
  );

  const handleLogExpense = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);

    try {
      const token = document.cookie.split("; ").find((row) => row.startsWith("token="))?.split("=")[1];
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          category: formData.get("category"),
          amount: parseFloat(formData.get("amount") as string) || 0,
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

  return (
    <div className="animate-fade-in relative space-y-6 pb-24 md:pb-8">
      {/* Monday.com Board Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-secondary mb-1">
            <span>Workspaces</span>
            <span>&rsaquo;</span>
            <span className="text-brand-400 font-medium">Cost Tracking</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
            <span>Expenses & Outflows</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-danger-500/10 text-danger-400 border border-danger-500/20 font-medium">
              {filteredExpenses.length} entries
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
            <span>Record Cost</span>
          </button>
        </div>
      </div>

      {/* Monday.com Total Outflow Banner */}
      <div className="glass p-4 rounded-xl border border-white/5 border-l-4 border-l-[#e2445c] flex justify-between items-center shadow-sm">
        <div>
          <span className="text-xs text-secondary font-medium uppercase tracking-wider block">
            Filtered Expenditure Total
          </span>
          <h3 className="text-2xl font-bold text-danger-400">₦{totalSpent.toLocaleString()}</h3>
        </div>
        <span className="text-xs text-secondary px-3 py-1 rounded-full bg-white/5">
          {filteredExpenses.length} records active
        </span>
      </div>

      {/* Search and Category Filter Chips */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white/[0.02] p-3 rounded-xl border border-white/5">
        <div className="flex-1 min-w-[240px]">
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="🔍 Search expenses by note or category..."
            className="w-full bg-primary/60 border border-white/10 rounded-lg px-3.5 py-2 text-sm text-white placeholder-secondary focus:border-brand-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1 sm:pb-0">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`px-3 py-1.5 rounded-full font-medium transition-all ${
                selectedCategory === c
                  ? "bg-white/20 text-white border border-white/30"
                  : "bg-white/[0.04] text-secondary hover:text-white border border-transparent"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-secondary">
          <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm">Loading expense board...</p>
        </div>
      ) : filteredExpenses.length === 0 ? (
        <div className="glass p-12 text-center rounded-2xl border border-white/5">
          <p className="text-4xl mb-3">💰</p>
          <h3 className="text-lg font-bold text-white mb-1">No expenses recorded</h3>
          <p className="text-sm text-secondary mb-4">Keep your profit calculations accurate by recording business expenses.</p>
          <button onClick={() => setIsModalOpen(true)} className="btn btn-primary text-sm">
            + Record First Expense
          </button>
        </div>
      ) : viewMode === "cards" ? (
        /* ========================================================== */
        /* MONDAY.COM MOBILE-FIRST EXPENSE CARDS                     */
        /* ========================================================== */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredExpenses.map((ex) => (
            <div
              key={ex._id || ex.id}
              className="glass p-4 rounded-xl border border-white/5 border-l-4 border-l-[#e2445c] hover:border-white/20 transition-all shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="monday-pill monday-pill-stuck !text-[10px] !py-0.5 !min-w-[60px] mb-1">
                      {ex.category}
                    </span>
                    <h4 className="font-semibold text-white text-sm mt-1">
                      {ex.note || "Operational Expense"}
                    </h4>
                  </div>
                  <span className="text-base font-bold text-danger-400">
                    ₦{Number(ex.amount).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-white/5 text-xs text-secondary mt-2">
                <span>Logged:</span>
                <span>{new Date(ex.date || ex.created_at || Date.now()).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* ========================================================== */
        /* MONDAY.COM TABLE VIEW                                      */
        /* ========================================================== */
        <div className="glass rounded-xl border border-white/5 overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[650px]">
              <thead className="bg-white/[0.03] text-xs text-secondary uppercase tracking-wider border-b border-white/10">
                <tr>
                  <th className="p-3.5 pl-4 font-semibold">Category</th>
                  <th className="p-3.5 font-semibold">Description / Note</th>
                  <th className="p-3.5 font-semibold">Date</th>
                  <th className="p-3.5 pr-4 font-semibold text-right">Amount (₦)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {filteredExpenses.map((ex) => (
                  <tr key={ex._id || ex.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-3.5 pl-4">
                      <span className="monday-pill monday-pill-stuck !text-[11px] !min-w-[70px]">
                        {ex.category}
                      </span>
                    </td>
                    <td className="p-3.5 text-white font-medium">{ex.note || "General expense"}</td>
                    <td className="p-3.5 text-secondary text-xs">
                      {new Date(ex.date || ex.created_at || Date.now()).toLocaleDateString()}
                    </td>
                    <td className="p-3.5 pr-4 font-bold text-danger-400 text-right">
                      ₦{Number(ex.amount).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* MONDAY.COM BOTTOM-SHEET / MODAL FOR EXPENSE                */}
      {/* ========================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 animate-fade-in">
          <div className="glass rounded-t-2xl sm:rounded-2xl p-6 sm:p-8 max-w-md w-full max-h-[90vh] overflow-y-auto border border-white/10 shadow-2xl">
            <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-4 sm:hidden"></div>

            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-white">Record Expense</h2>
                <p className="text-xs text-secondary">Log operational business cost</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20"
              >
                &times;
              </button>
            </div>

            <form className="flex flex-col gap-4" onSubmit={handleLogExpense}>
              <div>
                <label className="text-xs font-semibold text-secondary uppercase tracking-wider block mb-1">
                  Category
                </label>
                <select
                  name="category"
                  defaultValue="Utilities"
                  className="w-full p-3 rounded-xl border border-white/10 bg-primary text-white outline-none focus:border-brand-500"
                >
                  <option value="Rent">Rent</option>
                  <option value="Utilities">Utilities & Power</option>
                  <option value="Supplies">Store Supplies</option>
                  <option value="Salaries">Staff Salary / Advance</option>
                  <option value="Maintenance">Equipment Maintenance</option>
                  <option value="Logistics">Transport & Delivery</option>
                </select>
              </div>

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
                  Notes / Receipt Detail (Optional)
                </label>
                <input
                  type="text"
                  name="note"
                  placeholder="e.g. Generator diesel 30L purchase"
                  className="w-full p-3 rounded-xl border border-white/10 bg-primary text-white outline-none focus:border-brand-500"
                />
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
                  {isSubmitting ? "Saving..." : "Record Outflow"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
