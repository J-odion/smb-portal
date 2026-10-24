"use client";
import { useState, useEffect, useMemo } from "react";
import {
  Zap,
  Plus,
  Search,
  ShoppingCart,
  Trash2,
  CheckCircle2,
  CreditCard,
  Banknote,
  Smartphone,
  RefreshCw,
  X,
  Package,
  AlertCircle
} from "lucide-react";
import { addToSyncQueue } from "../../../lib/db";

interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  category: string;
  sku?: string;
}

interface ProductItem {
  _id?: string;
  id?: string;
  name: string;
  price: number;
  category?: string;
  sku?: string;
  stock_level?: number;
}

export default function POSPage() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [isProcessing, setIsProcessing] = useState(false);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Quick Add Item Modal inside POS
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [quickName, setQuickName] = useState("");
  const [quickPrice, setQuickPrice] = useState("");
  const [quickCategory, setQuickCategory] = useState("General");
  const [quickSubmitting, setQuickSubmitting] = useState(false);
  const [quickError, setQuickError] = useState("");

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
      }
    } catch (err) {
      console.warn("Could not load products for POS", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const categories = useMemo(() => {
    const set = new Set(["All"]);
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        p.name.toLowerCase().includes(q) ||
        (p.sku && p.sku.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q));
      const matchesCat = activeCategory === "All" || p.category === activeCategory;
      return matchesSearch && matchesCat;
    });
  }, [products, searchQuery, activeCategory]);

  const addToCart = (product: ProductItem) => {
    const id = product._id || product.id || String(Date.now());
    setCart((prev) => {
      const existing = prev.find((p) => p.id === id);
      if (existing) {
        return prev.map((p) => (p.id === id ? { ...p, qty: p.qty + 1 } : p));
      }
      return [
        ...prev,
        {
          id,
          name: product.name,
          price: Number(product.price) || 0,
          qty: 1,
          category: product.category || "General",
          sku: product.sku,
        },
      ];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((p) => p.id !== productId));
  };

  const updateQty = (productId: string, newQty: number) => {
    if (newQty < 1) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) => prev.map((p) => (p.id === productId ? { ...p, qty: newQty } : p)));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const totalItemCount = cart.reduce((sum, item) => sum + item.qty, 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setIsProcessing(true);

    const payload = {
      type: "SALE",
      subtotal: total,
      vat: 0,
      total: total,
      status: "Paid",
      metadata: {
        payment_method: paymentMethod,
      },
      items: cart.map((item) => ({
        description: item.name,
        quantity: item.qty,
        unit_price: item.price,
      })),
    };

    try {
      await addToSyncQueue("transaction", payload);
      window.dispatchEvent(new Event("sync-requested"));
      setSuccessNotice(`✅ Sale charged (₦${total.toLocaleString()}) via ${paymentMethod}!`);
      setTimeout(() => setSuccessNotice(null), 4500);
      setCart([]);
      setIsMobileCartOpen(false);
    } catch (e) {
      alert("Failed to record transaction.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleQuickAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setQuickSubmitting(true);
    setQuickError("");

    const token = getToken();
    try {
      const res = await fetch("/api/inventory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: quickName.trim(),
          price: parseFloat(quickPrice) || 0,
          category: quickCategory,
          stock_level: 50,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to create product");
      }

      const newProd = await res.json();
      setProducts((prev) => [newProd, ...prev]);
      addToCart(newProd);
      setIsQuickAddOpen(false);
      setQuickName("");
      setQuickPrice("");
    } catch (err: any) {
      setQuickError(err.message || "Could not add item");
    } finally {
      setQuickSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)] md:h-[calc(100vh-80px)] overflow-hidden animate-fade-in -m-4 md:-m-8 bg-white text-black font-sans">
      {/* Products Catalog Area */}
      <div className="flex-1 p-4 md:p-6 flex flex-col overflow-hidden bg-white relative">
        {/* POS Header */}
        <div className="mb-4 z-10 flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2 text-xs text-zinc-500 mb-0.5">
              <span>Workspaces</span>
              <span>&rsaquo;</span>
              <span className="text-purple-600 font-bold">Quick Cashier</span>
            </div>
            <h1 className="text-xl md:text-2xl font-extrabold text-black flex items-center gap-2">
              <span>Point of Sale Terminal</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                Offline PWA Active
              </span>
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchProducts}
              className="p-2 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-600 hover:text-black transition-colors"
              title="Refresh catalog"
            >
              <RefreshCw size={15} className={loading ? "animate-spin text-purple-600" : ""} />
            </button>
            <button
              onClick={() => {
                setQuickError("");
                setIsQuickAddOpen(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm shadow-purple-600/25 cursor-pointer transition-all"
            >
              <Plus size={15} />
              <span>Add Product</span>
            </button>
          </div>
        </div>

        {/* Success Alert Banner */}
        {successNotice && (
          <div className="mb-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fade-in">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            <span>{successNotice}</span>
          </div>
        )}

        {/* Search & Category Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by product name or SKU..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-black placeholder-zinc-400 text-xs focus:border-purple-600 focus:bg-white outline-none transition-all"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? "bg-purple-600 text-white shadow-xs"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-black"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1 overflow-y-auto pr-1">
          {loading ? (
            <div className="p-12 text-center space-y-3">
              <div className="w-8 h-8 border-3 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Syncing store items...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-12 text-center bg-zinc-50/60 rounded-3xl border border-zinc-200/80 space-y-4 my-4">
              <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto shadow-xs">
                <Package size={28} />
              </div>
              <div className="space-y-1 max-w-sm mx-auto">
                <h3 className="text-base font-extrabold text-black">
                  {searchQuery ? "No products found" : "No items in catalog yet"}
                </h3>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  {searchQuery
                    ? `No product matches "${searchQuery}". Clear search or add a quick product.`
                    : "Add your store items to start cashiering. You can create items on the fly right here."}
                </p>
              </div>
              <button
                onClick={() => {
                  setQuickError("");
                  setIsQuickAddOpen(true);
                }}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-sm shadow-purple-600/25 cursor-pointer transition-all"
              >
                <Plus size={15} />
                <span>Add Item to Store</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
              {filteredProducts.map((p) => {
                const id = p._id || p.id || "";
                return (
                  <button
                    key={id}
                    onClick={() => addToCart(p)}
                    className="p-3.5 rounded-2xl bg-white border border-zinc-200 hover:border-purple-300 hover:shadow-md transition-all text-left flex flex-col justify-between group cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-xl">📦</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-600">
                        {p.category || "General"}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-black line-clamp-1 group-hover:text-purple-600 transition-colors">
                        {p.name}
                      </h4>
                      <p className="text-sm font-extrabold text-purple-700 mt-1">
                        ₦{Number(p.price || 0).toLocaleString()}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Mobile Floating Cart Summary Button */}
        <div className="lg:hidden pt-3 border-t border-zinc-200 flex items-center justify-between">
          <div>
            <span className="text-xs text-zinc-500 block">Total Due</span>
            <span className="text-base font-extrabold text-black">₦{total.toLocaleString()}</span>
          </div>
          <button
            onClick={() => setIsMobileCartOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-purple-600/25"
          >
            <ShoppingCart size={15} />
            <span>View Cart ({totalItemCount})</span>
          </button>
        </div>
      </div>

      {/* Desktop Persistent Order Sidebar */}
      <div className="hidden lg:flex w-96 bg-zinc-50/70 border-l border-zinc-200 p-6 flex-col justify-between h-full">
        <div className="space-y-4 flex flex-col h-[calc(100%-140px)]">
          <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
            <div className="flex items-center gap-2">
              <ShoppingCart size={18} className="text-purple-600" />
              <h2 className="font-extrabold text-base text-black">Current Order</h2>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
              {totalItemCount} {totalItemCount === 1 ? "item" : "items"}
            </span>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-zinc-400">
                <ShoppingCart size={32} className="stroke-1 mb-2 opacity-50" />
                <p className="text-xs font-semibold text-zinc-500">Cart is currently empty</p>
                <p className="text-[11px] text-zinc-400 mt-0.5">Click any product in the catalog to add to bill</p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-2xl bg-white border border-zinc-200 shadow-2xs flex items-center justify-between gap-2"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs text-black truncate">{item.name}</h4>
                    <span className="text-[11px] font-extrabold text-purple-600">
                      ₦{item.price.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 bg-zinc-50 border border-zinc-200 rounded-lg p-0.5">
                    <button
                      onClick={() => updateQty(item.id, item.qty - 1)}
                      className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold text-zinc-600 hover:bg-zinc-200"
                    >
                      -
                    </button>
                    <span className="w-5 text-center text-xs font-extrabold text-black">{item.qty}</span>
                    <button
                      onClick={() => updateQty(item.id, item.qty + 1)}
                      className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold text-zinc-600 hover:bg-zinc-200"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Checkout Controls */}
        <div className="pt-4 border-t border-zinc-200 space-y-3">
          {/* Payment Method Selector */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block mb-1.5">
              Payment Method
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: "CASH", label: "Cash", icon: Banknote },
                { id: "TRANSFER", label: "Transfer", icon: Smartphone },
                { id: "CARD", label: "Card POS", icon: CreditCard },
              ].map((m) => {
                const Icon = m.icon;
                const isSelected = paymentMethod === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setPaymentMethod(m.id)}
                    className={`py-2 px-1 rounded-xl text-xs font-bold flex flex-col items-center gap-1 border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-purple-600 text-white border-purple-600 shadow-xs"
                        : "bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50"
                    }`}
                  >
                    <Icon size={14} />
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Total Amount Due */}
          <div className="flex justify-between items-center pt-1">
            <span className="text-xs font-bold text-zinc-600 uppercase tracking-wider">Total Due</span>
            <span className="text-xl font-extrabold text-black">₦{total.toLocaleString()}</span>
          </div>

          <button
            disabled={cart.length === 0 || isProcessing}
            onClick={handleCheckout}
            className="w-full py-3.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-md shadow-purple-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Processing Sale...</span>
              </>
            ) : (
              <>
                <Zap size={16} />
                <span>Charge ₦{total.toLocaleString()}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ========================================================== */}
      {/* MOBILE POPUP OVERLAY FOR CART CHECKOUT                     */}
      {/* ========================================================== */}
      {isMobileCartOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl border border-zinc-200 shadow-2xl p-6 max-h-[85vh] overflow-y-auto space-y-4">
            <div className="w-12 h-1 bg-zinc-300 rounded-full mx-auto sm:hidden mb-2" />
            <div className="flex justify-between items-center pb-3 border-b border-zinc-100">
              <h3 className="font-extrabold text-lg text-black">Order Summary ({totalItemCount})</h3>
              <button
                onClick={() => setIsMobileCartOpen(false)}
                className="w-8 h-8 rounded-full bg-zinc-100 text-zinc-600 flex items-center justify-center hover:bg-zinc-200"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-2 max-h-[40vh] overflow-y-auto">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 flex justify-between items-center"
                >
                  <div>
                    <h4 className="font-bold text-xs text-black">{item.name}</h4>
                    <p className="text-[11px] font-extrabold text-purple-600">₦{item.price.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-2 bg-white border border-zinc-200 rounded-lg p-1">
                    <button
                      onClick={() => updateQty(item.id, item.qty - 1)}
                      className="px-2 text-xs font-bold text-zinc-600"
                    >
                      -
                    </button>
                    <span className="text-xs font-extrabold text-black">{item.qty}</span>
                    <button
                      onClick={() => updateQty(item.id, item.qty + 1)}
                      className="px-2 text-xs font-bold text-zinc-600"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-zinc-200">
              <span className="text-sm font-bold text-zinc-600">Total Amount</span>
              <span className="text-xl font-extrabold text-purple-700">₦{total.toLocaleString()}</span>
            </div>

            <button
              disabled={isProcessing}
              onClick={handleCheckout}
              className="w-full py-3.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-md shadow-purple-600/25 flex items-center justify-center gap-2"
            >
              {isProcessing ? "Processing..." : `Complete & Charge ₦${total.toLocaleString()}`}
            </button>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* QUICK ADD ITEM MODAL POPUP (HosOS Refined Overlay)         */}
      {/* ========================================================== */}
      {isQuickAddOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in">
          <div className="relative w-full max-w-md bg-white rounded-3xl border border-zinc-200 shadow-2xl p-6 sm:p-8 space-y-5 my-auto text-black">
            <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center text-white font-extrabold shadow-sm">
                  <Plus size={18} />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-black">Quick Add Product</h3>
                  <p className="text-[11px] text-zinc-500">Add directly to POS & inventory</p>
                </div>
              </div>
              <button
                onClick={() => setIsQuickAddOpen(false)}
                className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-500 hover:text-black flex items-center justify-center transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {quickError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold flex items-center gap-2">
                <AlertCircle size={15} />
                <span>{quickError}</span>
              </div>
            )}

            <form onSubmit={handleQuickAdd} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-black uppercase tracking-wider block">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={quickName}
                  onChange={(e) => setQuickName(e.target.value)}
                  placeholder="e.g. Wireless Power Bank 10000mAh"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-zinc-300 text-black text-sm focus:border-purple-600 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-black uppercase tracking-wider block">
                    Selling Price (₦) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={quickPrice}
                    onChange={(e) => setQuickPrice(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-zinc-300 text-black text-sm focus:border-purple-600 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-black uppercase tracking-wider block">
                    Category
                  </label>
                  <select
                    value={quickCategory}
                    onChange={(e) => setQuickCategory(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-white border border-zinc-300 text-black text-sm focus:border-purple-600 outline-none"
                  >
                    <option value="General">General</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Beauty">Beauty</option>
                    <option value="Services">Services</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setIsQuickAddOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-white border border-zinc-300 text-black text-xs font-bold hover:bg-zinc-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={quickSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-600/25 flex items-center gap-1.5"
                >
                  {quickSubmitting ? "Adding..." : "Add to Catalog"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
