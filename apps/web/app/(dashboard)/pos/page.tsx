"use client";
import { useState } from "react";
import { addToSyncQueue } from "../../../lib/db";

interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  category: string;
  icon: string;
}

export default function POSPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [isProcessing, setIsProcessing] = useState(false);

  const mockProducts = [
    { id: "1", name: "Smartphone Pro Max", price: 950000, category: "Electronics", icon: "📱" },
    { id: "2", name: "Wireless Earbuds", price: 45000, category: "Accessories", icon: "🎧" },
    { id: "3", name: "Laptop Ultra 15\"", price: 1250000, category: "Electronics", icon: "💻" },
    { id: "4", name: "Screen Protector", price: 5000, category: "Accessories", icon: "🛡️" },
    { id: "5", name: "Fast Charger 30W", price: 15000, category: "Accessories", icon: "⚡" },
    { id: "6", name: "Smartwatch Series X", price: 85000, category: "Electronics", icon: "⌚" },
    { id: "7", name: "Screen Repair Service", price: 35000, category: "Services", icon: "🔧" },
    { id: "8", name: "Software Setup", price: 10000, category: "Services", icon: "⚙️" },
  ];

  const categories = ["All", "Electronics", "Accessories", "Services"];

  const filteredProducts =
    activeCategory === "All"
      ? mockProducts
      : mockProducts.filter((p) => p.category === activeCategory);

  const addToCart = (product: any) => {
    setCart((prev) => {
      const existing = prev.find((p) => p.id === product.id);
      if (existing) {
        return prev.map((p) => (p.id === product.id ? { ...p, qty: p.qty + 1 } : p));
      }
      return [...prev, { ...product, qty: 1 }];
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
      alert("✅ Transaction charged successfully! Recorded to ledger.");
      setCart([]);
      setIsMobileCartOpen(false);
    } catch (e) {
      alert("Failed to save transaction.");
    } finally {
      setIsProcessing(false);
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
              <span className="monday-pill monday-pill-done !min-w-[60px] !text-[10px] !py-0.5">Active</span>
            </h1>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1 z-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full whitespace-nowrap text-xs font-semibold transition-all ${
                activeCategory === cat
                  ? "bg-purple-600 text-white shadow-xs font-bold"
                  : "bg-zinc-100 text-zinc-700 hover:text-black border border-zinc-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="flex-1 overflow-y-auto z-10 pb-28 lg:pb-4 pr-1">
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
            {filteredProducts.map((p) => {
              const inCartItem = cart.find((c) => c.id === p.id);

              return (
                <button
                  key={p.id}
                  onClick={() => addToCart(p)}
                  className={`p-3.5 rounded-2xl text-left border transition-all flex flex-col justify-between aspect-square group relative active:scale-95 ${
                    inCartItem
                      ? "border-purple-600 bg-purple-50/70 shadow-sm"
                      : "bg-white border-zinc-200 hover:border-purple-300 hover:shadow-xs"
                  }`}
                >
                  <div className="flex justify-between items-start w-full">
                    <span className="text-3xl drop-shadow-2xs group-hover:scale-110 transition-transform">
                      {p.icon}
                    </span>
                    {inCartItem && (
                      <span className="w-6 h-6 rounded-full bg-purple-600 text-white text-xs font-bold flex items-center justify-center shadow-xs">
                        {inCartItem.qty}
                      </span>
                    )}
                  </div>

                  <div className="w-full">
                    <h3 className="font-bold text-xs md:text-sm text-black line-clamp-2 leading-tight mb-1">
                      {p.name}
                    </h3>
                    <p className="text-xs font-extrabold text-purple-600">
                      ₦{p.price.toLocaleString()}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile Sticky Floating Order Bar */}
        {cart.length > 0 && (
          <div className="lg:hidden fixed bottom-16 left-3 right-3 z-30 animate-fade-in">
            <button
              onClick={() => setIsMobileCartOpen(true)}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white p-3.5 rounded-2xl shadow-lg shadow-purple-600/30 flex items-center justify-between font-bold text-sm"
            >
              <div className="flex items-center gap-2">
                <span className="bg-black/20 px-2.5 py-1 rounded-full text-xs font-bold">
                  {totalItemCount} items
                </span>
                <span>Review Cart</span>
              </div>
              <span className="text-base font-bold">Charge ₦{total.toLocaleString()} &rsaquo;</span>
            </button>
          </div>
        )}
      </div>

      {/* Desktop Cart Sidebar */}
      <div className="hidden lg:flex w-96 bg-white border-l border-zinc-200 flex-col h-full relative z-20 shadow-xs">
        <div className="p-4 border-b border-zinc-200 bg-zinc-50">
          <h2 className="text-base font-bold text-black flex items-center justify-between">
            <span>Current Order</span>
            <span className="monday-pill monday-pill-info !min-w-[65px] !text-[11px]">
              {totalItemCount} items
            </span>
          </h2>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2.5">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-zinc-400 opacity-60 gap-3">
              <span className="text-5xl">🛒</span>
              <p className="text-xs font-medium">Cart is empty. Tap products to add.</p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center p-3 rounded-xl bg-zinc-50 border border-zinc-200"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-xl">{item.icon}</span>
                  <div className="min-w-0">
                    <h4 className="font-semibold text-xs text-black truncate">{item.name}</h4>
                    <p className="text-[11px] text-purple-600 font-bold">₦{item.price.toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="flex items-center bg-white rounded-lg overflow-hidden border border-zinc-200 shadow-2xs">
                    <button
                      onClick={() => updateQty(item.id, item.qty - 1)}
                      className="px-2 py-1 text-xs text-zinc-700 hover:bg-zinc-100 font-semibold"
                    >
                      -
                    </button>
                    <span className="px-2 text-xs font-bold text-black">{item.qty}</span>
                    <button
                      onClick={() => updateQty(item.id, item.qty + 1)}
                      className="px-2 py-1 text-xs text-zinc-700 hover:bg-zinc-100 font-semibold"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Checkout Breakdown */}
        <div className="p-4 border-t border-zinc-200 bg-zinc-50 space-y-3">
          {/* Payment Method Selector */}
          <div>
            <label className="text-[11px] font-semibold text-zinc-600 uppercase tracking-wider block mb-1">
              Payment Method
            </label>
            <div className="grid grid-cols-3 gap-1.5 text-xs">
              {["CASH", "TRANSFER", "POS/CARD"].map((m) => (
                <button
                  key={m}
                  onClick={() => setPaymentMethod(m)}
                  className={`py-1.5 rounded-lg font-semibold transition-all border ${
                    paymentMethod === m
                      ? "bg-purple-600 text-white border-purple-600 font-bold"
                      : "bg-white text-zinc-700 border-zinc-200 hover:text-black"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-zinc-200">
            <span className="text-sm text-zinc-600 font-medium">Total Due</span>
            <span className="text-xl font-extrabold text-black">₦{total.toLocaleString()}</span>
          </div>

          <button
            disabled={cart.length === 0 || isProcessing}
            onClick={handleCheckout}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white font-bold py-3.5 rounded-xl shadow-md shadow-purple-600/25 text-sm transition-all"
          >
            {isProcessing ? "Processing..." : `Charge ₦${total.toLocaleString()}`}
          </button>
        </div>
      </div>

      {/* Mobile Slide-Up Cart Bottom Sheet */}
      {isMobileCartOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setIsMobileCartOpen(false)}
          />

          <div className="relative bg-white border-t border-zinc-200 rounded-t-3xl p-5 max-h-[85vh] overflow-y-auto z-10 shadow-2xl flex flex-col gap-4 animate-fade-in">
            <div className="w-12 h-1.5 bg-zinc-300 rounded-full mx-auto"></div>

            <div className="flex justify-between items-center pb-2 border-b border-zinc-200">
              <h3 className="font-bold text-lg text-black">Order Summary ({totalItemCount})</h3>
              <button
                onClick={() => setIsMobileCartOpen(false)}
                className="w-8 h-8 rounded-full bg-zinc-100 text-zinc-600 flex items-center justify-center text-lg hover:bg-zinc-200"
              >
                &times;
              </button>
            </div>

            <div className="flex flex-col gap-2.5 max-h-[40vh] overflow-y-auto">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center p-3 rounded-xl bg-zinc-50 border border-zinc-200"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <h4 className="font-semibold text-xs text-black">{item.name}</h4>
                      <p className="text-[11px] text-purple-600 font-bold">₦{item.price.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center bg-white rounded-lg overflow-hidden border border-zinc-200 shadow-2xs">
                    <button
                      onClick={() => updateQty(item.id, item.qty - 1)}
                      className="px-2.5 py-1 text-xs text-zinc-700 hover:bg-zinc-100 font-semibold"
                    >
                      -
                    </button>
                    <span className="px-2.5 text-xs font-bold text-black">{item.qty}</span>
                    <button
                      onClick={() => updateQty(item.id, item.qty + 1)}
                      className="px-2.5 py-1 text-xs text-zinc-700 hover:bg-zinc-100 font-semibold"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Payment Mode */}
            <div>
              <label className="text-[11px] font-semibold text-zinc-600 uppercase tracking-wider block mb-1">
                Payment Channel
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {["CASH", "TRANSFER", "POS/CARD"].map((m) => (
                  <button
                    key={m}
                    onClick={() => setPaymentMethod(m)}
                    className={`py-2 rounded-xl font-semibold transition-all border ${
                      paymentMethod === m
                        ? "bg-purple-600 text-white border-purple-600 font-bold"
                        : "bg-zinc-100 text-zinc-700 border-zinc-200 hover:bg-zinc-200"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-zinc-200 text-base font-bold">
              <span className="text-black">Total Amount</span>
              <span className="text-purple-600 font-extrabold">₦{total.toLocaleString()}</span>
            </div>

            <button
              disabled={isProcessing}
              onClick={handleCheckout}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3.5 rounded-xl shadow-md shadow-purple-600/25 text-base"
            >
              {isProcessing ? "Processing..." : `Complete & Charge ₦${total.toLocaleString()}`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
