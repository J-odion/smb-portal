"use client";
import { useState, useMemo } from "react";

interface ProductItem {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock_level: number;
  category: string;
  status: "In Stock" | "Low Stock" | "Out of Stock";
  icon: string;
}

export default function InventoryPage() {
  const [products, setProducts] = useState<ProductItem[]>([
    { id: "1", name: "Smartphone Pro Max", sku: "ELEC-SPM-01", price: 950000, stock_level: 12, category: "Electronics", status: "In Stock", icon: "📱" },
    { id: "2", name: "Wireless Earbuds", sku: "ACC-WEB-02", price: 45000, stock_level: 45, category: "Accessories", status: "In Stock", icon: "🎧" },
    { id: "3", name: "Laptop Ultra 15\"", sku: "ELEC-LU-03", price: 1250000, stock_level: 3, category: "Electronics", status: "Low Stock", icon: "💻" },
    { id: "4", name: "Screen Protector", sku: "ACC-SP-04", price: 5000, stock_level: 120, category: "Accessories", status: "In Stock", icon: "🛡️" },
    { id: "5", name: "Fast Charger 30W", sku: "ACC-FC-05", price: 15000, stock_level: 0, category: "Accessories", status: "Out of Stock", icon: "⚡" },
    { id: "6", name: "Smartwatch Series X", sku: "ELEC-SW-06", price: 85000, stock_level: 8, category: "Electronics", status: "Low Stock", icon: "⌚" },
    { id: "7", name: "USB-C Cable 2m", sku: "ACC-UC-07", price: 3500, stock_level: 200, category: "Accessories", status: "In Stock", icon: "🔌" },
    { id: "8", name: "Bluetooth Speaker", sku: "ELEC-BS-08", price: 25000, stock_level: 15, category: "Electronics", status: "In Stock", icon: "🔊" },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [viewMode, setViewMode] = useState<"table" | "cards">("cards");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categories = ["All", "Electronics", "Accessories", "Services"];

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);
      const matchesCat = categoryFilter === "All" || p.category === categoryFilter;
      return matchesSearch && matchesCat;
    });
  }, [products, searchQuery, categoryFilter]);

  const inStockCount = products.filter((p) => p.status === "In Stock").length;
  const lowStockCount = products.filter((p) => p.status === "Low Stock").length;
  const outOfStockCount = products.filter((p) => p.status === "Out of Stock").length;

  const handleAddProduct = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const stock = parseInt(formData.get("stock_level") as string, 10) || 0;

    let status: "In Stock" | "Low Stock" | "Out of Stock" = "In Stock";
    if (stock === 0) status = "Out of Stock";
    else if (stock < 10) status = "Low Stock";

    const newProd: ProductItem = {
      id: String(Date.now()),
      name: formData.get("name") as string,
      sku: formData.get("sku") as string || `SKU-${Date.now().toString().slice(-4)}`,
      category: formData.get("category") as string || "Accessories",
      price: parseFloat(formData.get("price") as string) || 0,
      stock_level: stock,
      status,
      icon: "📦",
    };

    setProducts((prev) => [newProd, ...prev]);
    setIsModalOpen(false);
  };

  const getStatusBadge = (status: string) => {
    if (status === "In Stock") return <span className="monday-pill monday-pill-done">In Stock</span>;
    if (status === "Low Stock") return <span className="monday-pill monday-pill-working">Low Stock</span>;
    return <span className="monday-pill monday-pill-stuck">Out of Stock</span>;
  };

  return (
    <div className="animate-fade-in relative space-y-6 pb-24 md:pb-8">
      {/* Monday.com Board Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-secondary mb-1">
            <span>Workspaces</span>
            <span>&rsaquo;</span>
            <span className="text-brand-400 font-medium">Inventory & Catalog</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
            <span>Stock Management</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-secondary">
              {filteredProducts.length} items
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
            <span>Add Item</span>
          </button>
        </div>
      </div>

      {/* Monday.com Stock Health Battery */}
      <div className="bg-white/[0.03] p-4 rounded-xl border border-white/5 space-y-2">
        <div className="flex justify-between items-center text-xs">
          <span className="text-secondary font-medium">Inventory Health Status</span>
          <span className="text-white font-bold">{inStockCount} Healthy &bull; {lowStockCount} Need Restock</span>
        </div>
        <div className="monday-battery w-full">
          <div style={{ width: `${(inStockCount / products.length) * 100}%` }} className="bg-[#00c875] h-full"></div>
          <div style={{ width: `${(lowStockCount / products.length) * 100}%` }} className="bg-[#fdab3d] h-full"></div>
          <div style={{ width: `${(outOfStockCount / products.length) * 100}%` }} className="bg-[#e2445c] h-full"></div>
        </div>
        <div className="flex items-center gap-4 text-xs text-secondary pt-1">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00c875]"></span> In Stock ({inStockCount})
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#fdab3d]"></span> Low Stock ({lowStockCount})
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#e2445c]"></span> Out of Stock ({outOfStockCount})
          </span>
        </div>
      </div>

      {/* Search and Category Filter */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white/[0.02] p-3 rounded-xl border border-white/5">
        <div className="flex-1 min-w-[240px]">
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="🔍 Search items by name, SKU, or category..."
            className="w-full bg-primary/60 border border-white/10 rounded-lg px-3.5 py-2 text-sm text-white placeholder-secondary focus:border-brand-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-full font-medium transition-all ${
                categoryFilter === cat
                  ? "bg-white/20 text-white border border-white/30"
                  : "bg-white/[0.04] text-secondary hover:text-white border border-transparent"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="glass p-12 text-center rounded-2xl border border-white/5">
          <p className="text-4xl mb-3">📦</p>
          <h3 className="text-lg font-bold text-white mb-1">No items found</h3>
          <p className="text-sm text-secondary mb-4">No products match your search or filter.</p>
        </div>
      ) : viewMode === "cards" ? (
        /* ========================================================== */
        /* MONDAY.COM MOBILE-FIRST STOCK CARDS                       */
        /* ========================================================== */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
          {filteredProducts.map((p) => {
            const borderCol =
              p.status === "In Stock"
                ? "border-l-[#00c875]"
                : p.status === "Low Stock"
                ? "border-l-[#fdab3d]"
                : "border-l-[#e2445c]";

            return (
              <div
                key={p.id}
                className={`glass p-4 rounded-xl border border-white/5 border-l-4 ${borderCol} hover:border-white/20 transition-all shadow-sm flex flex-col justify-between`}
              >
                <div>
                  <div className="flex justify-between items-start mb-2.5">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{p.icon}</span>
                      <div>
                        <h4 className="font-semibold text-white text-sm leading-tight line-clamp-1">{p.name}</h4>
                        <span className="text-[11px] text-secondary font-mono">{p.sku}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center my-3 py-2 border-y border-white/5 text-xs">
                    <span className="text-secondary">Current Stock:</span>
                    <span className="font-bold text-white">{p.stock_level} units</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-base font-bold text-brand-300">
                    ₦{p.price.toLocaleString()}
                  </span>
                  <div>{getStatusBadge(p.status)}</div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* ========================================================== */
        /* MONDAY.COM INVENTORY TABLE                                 */
        /* ========================================================== */
        <div className="glass rounded-xl border border-white/5 overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead className="bg-white/[0.03] text-xs text-secondary uppercase tracking-wider border-b border-white/10">
                <tr>
                  <th className="p-3.5 pl-4 font-semibold">Product Name</th>
                  <th className="p-3.5 font-semibold">SKU</th>
                  <th className="p-3.5 font-semibold">Category</th>
                  <th className="p-3.5 font-semibold text-right">Price (₦)</th>
                  <th className="p-3.5 font-semibold text-center">Stock Level</th>
                  <th className="p-3.5 pr-4 font-semibold text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-3.5 pl-4">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">{p.icon}</span>
                        <span className="font-medium text-white">{p.name}</span>
                      </div>
                    </td>
                    <td className="p-3.5 font-mono text-xs text-secondary">{p.sku}</td>
                    <td className="p-3.5 text-secondary">{p.category}</td>
                    <td className="p-3.5 font-bold text-white text-right">₦{p.price.toLocaleString()}</td>
                    <td className="p-3.5 text-center font-semibold text-white">{p.stock_level}</td>
                    <td className="p-3.5 pr-4 text-center">{getStatusBadge(p.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* MONDAY.COM BOTTOM-SHEET / MODAL FOR NEW PRODUCT            */}
      {/* ========================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 animate-fade-in">
          <div className="glass rounded-t-2xl sm:rounded-2xl p-6 sm:p-8 max-w-md w-full max-h-[90vh] overflow-y-auto border border-white/10 shadow-2xl">
            <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-4 sm:hidden"></div>

            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-white">Add New Product</h2>
                <p className="text-xs text-secondary">Add item to inventory and POS catalog</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20"
              >
                &times;
              </button>
            </div>

            <form className="flex flex-col gap-4" onSubmit={handleAddProduct}>
              <div>
                <label className="text-xs font-semibold text-secondary uppercase tracking-wider block mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. Wireless Headset"
                  className="w-full p-3 rounded-xl border border-white/10 bg-primary text-white outline-none focus:border-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-secondary uppercase tracking-wider block mb-1">
                    Price (₦)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="price"
                    required
                    placeholder="0.00"
                    className="w-full p-3 rounded-xl border border-white/10 bg-primary text-white outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-secondary uppercase tracking-wider block mb-1">
                    Opening Stock
                  </label>
                  <input
                    type="number"
                    name="stock_level"
                    defaultValue="10"
                    required
                    className="w-full p-3 rounded-xl border border-white/10 bg-primary text-white outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-secondary uppercase tracking-wider block mb-1">
                  Category
                </label>
                <select
                  name="category"
                  defaultValue="Electronics"
                  className="w-full p-3 rounded-xl border border-white/10 bg-primary text-white outline-none focus:border-brand-500"
                >
                  <option value="Electronics">Electronics</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Services">Services</option>
                </select>
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
                  className="btn btn-primary flex-1 p-3 text-sm shadow-lg shadow-brand-500/20"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
