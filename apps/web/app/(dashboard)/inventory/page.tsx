"use client";
import { useState, useEffect, useMemo } from "react";
import {
  Package,
  Plus,
  Search,
  Filter,
  Trash2,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  X,
  Boxes,
  Tag,
  DollarSign,
  Layers,
  ArrowUpDown
} from "lucide-react";

export interface ProductItem {
  _id?: string;
  id?: string;
  name: string;
  sku: string;
  price: number;
  stock_level: number;
  category: string;
  created_at?: string;
}

export default function InventoryPage() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState("");
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // New product form state
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [category, setCategory] = useState("General");
  const [price, setPrice] = useState("");
  const [stockLevel, setStockLevel] = useState("0");

  const categories = ["All", "General", "Electronics", "Accessories", "Fashion", "Beauty", "Services"];

  const getToken = () => {
    if (typeof window === "undefined") return "";
    return (
      localStorage.getItem("token") ||
      document.cookie.split("; ").find((row) => row.startsWith("token="))?.split("=")[1] ||
      ""
    );
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const token = getToken();
      const res = await fetch("/api/inventory", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } else {
        console.warn("Failed to load inventory from API, status:", res.status);
      }
    } catch (err) {
      console.error("Error fetching inventory", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        p.name.toLowerCase().includes(q) ||
        (p.sku && p.sku.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q));
      const matchesCat = categoryFilter === "All" || p.category === categoryFilter;
      return matchesSearch && matchesCat;
    });
  }, [products, searchQuery, categoryFilter]);

  const inStockCount = products.filter((p) => (p.stock_level || 0) > 10).length;
  const lowStockCount = products.filter((p) => (p.stock_level || 0) > 0 && (p.stock_level || 0) <= 10).length;
  const outOfStockCount = products.filter((p) => (p.stock_level || 0) === 0).length;

  const handleAddProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setModalError("");

    const token = getToken();
    try {
      const res = await fetch("/api/inventory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: name.trim(),
          sku: sku.trim() || undefined,
          category,
          price: parseFloat(price) || 0,
          stock_level: parseInt(stockLevel, 10) || 0,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to create item in inventory");
      }

      const created = await res.json();
      setProducts((prev) => [created, ...prev]);
      setIsModalOpen(false);
      setName("");
      setSku("");
      setPrice("");
      setStockLevel("0");
      setNotification({ type: "success", message: `"${created.name}" created successfully!` });
      setTimeout(() => setNotification(null), 4000);
    } catch (err: any) {
      setModalError(err.message || "Failed to create item. Please verify details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id: string, itemName: string) => {
    if (!confirm(`Are you sure you want to delete "${itemName}"?`)) return;
    const token = getToken();
    try {
      const res = await fetch(`/api/inventory/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => (p._id || p.id) !== id));
        setNotification({ type: "success", message: `"${itemName}" deleted.` });
        setTimeout(() => setNotification(null), 3500);
      } else {
        alert("Could not delete item. Please try again.");
      }
    } catch (err) {
      alert("Error deleting item.");
    }
  };

  const getStatusBadge = (stock: number) => {
    if (stock > 10) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
          In Stock ({stock})
        </span>
      );
    }
    if (stock > 0) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
          Low Stock ({stock})
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold border border-red-200">
        <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
        Out of Stock
      </span>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans text-black pb-24 md:pb-8">
      {/* Top Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">
            <span>Workspaces</span>
            <span>&rsaquo;</span>
            <span className="text-purple-600 font-bold">Inventory Management</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-black flex items-center gap-2">
            <span>Store Products & Stock</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-700 font-bold">
              {products.length} live {products.length === 1 ? "item" : "items"}
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={fetchProducts}
            className="p-2.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-600 hover:text-black transition-colors"
            title="Refresh inventory"
          >
            <RefreshCw size={16} className={loading ? "animate-spin text-purple-600" : ""} />
          </button>

          <button
            onClick={() => {
              setModalError("");
              setIsModalOpen(true);
            }}
            className="flex-1 md:flex-none px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-purple-600/25 transition-all cursor-pointer"
          >
            <Plus size={16} />
            <span>Add Item</span>
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {notification && (
        <div
          className={`p-4 rounded-2xl border text-xs font-bold flex items-center gap-2.5 animate-fade-in ${
            notification.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle size={16} className="text-red-600 shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* KPI Metric Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Items</span>
            <Boxes size={18} className="text-purple-600" />
          </div>
          <span className="text-2xl font-extrabold text-black">{products.length}</span>
          <span className="text-[11px] text-zinc-500 block mt-1">Catalog SKU listings</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">In Stock</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          </div>
          <span className="text-2xl font-extrabold text-emerald-600">{inStockCount}</span>
          <span className="text-[11px] text-zinc-500 block mt-1">&gt; 10 units available</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Low Stock</span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          </div>
          <span className="text-2xl font-extrabold text-amber-600">{lowStockCount}</span>
          <span className="text-[11px] text-zinc-500 block mt-1">&le; 10 units threshold</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Out of Stock</span>
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
          </div>
          <span className="text-2xl font-extrabold text-red-600">{outOfStockCount}</span>
          <span className="text-[11px] text-zinc-500 block mt-1">0 units remaining</span>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-zinc-200 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search items by name, SKU, or category..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-black placeholder-zinc-400 text-xs focus:border-purple-600 focus:bg-white outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto text-xs pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                categoryFilter === cat
                  ? "bg-purple-600 text-white shadow-xs"
                  : "bg-zinc-100 text-zinc-600 hover:text-black hover:bg-zinc-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-zinc-200 shadow-2xs space-y-3">
          <div className="w-8 h-8 border-3 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Loading items from cloud database...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        /* Empty State */
        <div className="p-12 text-center bg-white rounded-3xl border border-zinc-200 shadow-2xs space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto shadow-xs">
            <Package size={28} />
          </div>
          <div className="space-y-1 max-w-sm mx-auto">
            <h3 className="text-lg font-extrabold text-black">
              {searchQuery ? "No matching products found" : "Your store inventory is empty"}
            </h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              {searchQuery
                ? `No products matched "${searchQuery}". Clear your search or add a new item.`
                : "Add your retail items, fashion clothes, or spare parts. They'll instantly sync with your POS cashiering terminal."}
            </p>
          </div>
          <button
            onClick={() => {
              setModalError("");
              setIsModalOpen(true);
            }}
            className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs inline-flex items-center gap-2 shadow-md shadow-purple-600/20 cursor-pointer transition-all"
          >
            <Plus size={16} />
            <span>Add First Item</span>
          </button>
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-3xl border border-zinc-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-zinc-50/80 border-b border-zinc-200 text-zinc-500 uppercase tracking-wider font-bold">
                  <th className="py-3.5 px-4">Item Name & SKU</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Unit Price</th>
                  <th className="py-3.5 px-4">Stock Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredProducts.map((p) => {
                  const id = p._id || p.id || "";
                  return (
                    <tr key={id} className="hover:bg-zinc-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-sm shrink-0 border border-purple-100">
                            📦
                          </div>
                          <div>
                            <span className="font-extrabold text-black text-sm block leading-tight">{p.name}</span>
                            <span className="text-[11px] text-zinc-500 font-mono mt-0.5 block">{p.sku || "NO-SKU"}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-zinc-700">
                        <span className="px-2.5 py-1 rounded-lg bg-zinc-100 text-zinc-800 text-[11px] font-bold">
                          {p.category || "General"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-extrabold text-black text-sm">
                        ₦{Number(p.price || 0).toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4">
                        {getStatusBadge(p.stock_level || 0)}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleDeleteProduct(id, p.name)}
                          className="p-2 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          title="Delete item"
                        >
                          <Trash2 size={16} />
                        </button>
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
      {/* IMPROVED POPUP MODAL FOR ADDING INVENTORY ITEM             */}
      {/* ========================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl border border-zinc-200 shadow-2xl p-6 sm:p-8 space-y-6 my-auto text-black">
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-zinc-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-600 flex items-center justify-center text-white font-extrabold shadow-sm shadow-purple-600/30">
                  <Package size={20} />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-black">Add New Item</h2>
                  <p className="text-xs text-zinc-500 font-medium">Add to catalog & offline POS cashiering</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-500 hover:text-black flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Error in modal */}
            {modalError && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold flex items-center gap-2 animate-fade-in">
                <AlertCircle size={16} className="shrink-0 text-red-600" />
                <span>{modalError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-black uppercase tracking-wider block">
                  Item / Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Italian Wool Suit (3-Piece)"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-zinc-300 text-black text-sm focus:border-purple-600 focus:ring-1 focus:ring-purple-600 outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-black uppercase tracking-wider block">
                    SKU / Barcode Code
                  </label>
                  <input
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="e.g. SUIT-IW-001 (auto if empty)"
                    className="w-full px-4 py-3 rounded-xl bg-white border border-zinc-300 text-black text-sm focus:border-purple-600 focus:ring-1 focus:ring-purple-600 outline-none transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-black uppercase tracking-wider block">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-zinc-300 text-black text-sm focus:border-purple-600 focus:ring-1 focus:ring-purple-600 outline-none transition-all cursor-pointer"
                  >
                    <option value="General">General Retail</option>
                    <option value="Fashion">Fashion & Apparel</option>
                    <option value="Electronics">Electronics & Phones</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Beauty">Beauty & Salon Supplies</option>
                    <option value="Food">Food & Beverage</option>
                    <option value="Services">Services / Repairs</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-black uppercase tracking-wider block">
                    Selling Price (₦) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-4 py-3 rounded-xl bg-white border border-zinc-300 text-black text-sm focus:border-purple-600 focus:ring-1 focus:ring-purple-600 outline-none transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-black uppercase tracking-wider block">
                    Initial Stock Level
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={stockLevel}
                    onChange={(e) => setStockLevel(e.target.value)}
                    placeholder="0"
                    className="w-full px-4 py-3 rounded-xl bg-white border border-zinc-300 text-black text-sm focus:border-purple-600 focus:ring-1 focus:ring-purple-600 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-3 rounded-xl bg-white hover:bg-zinc-50 border border-zinc-300 text-black font-semibold text-sm transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-md shadow-purple-600/25 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Saving Item...</span>
                    </>
                  ) : (
                    <>
                      <Plus size={16} />
                      <span>Create Item</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
