"use client";
import { useState } from "react";

export default function POSPage() {
  const [cart, setCart] = useState<{id: string, name: string, price: number, qty: number, category: string, icon: string}[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  
  const mockProducts = [
    { id: '1', name: 'Smartphone Pro Max', price: 950000, category: 'Electronics', icon: '📱' },
    { id: '2', name: 'Wireless Earbuds', price: 45000, category: 'Accessories', icon: '🎧' },
    { id: '3', name: 'Laptop Ultra 15"', price: 1250000, category: 'Electronics', icon: '💻' },
    { id: '4', name: 'Screen Protector', price: 5000, category: 'Accessories', icon: '🛡️' },
    { id: '5', name: 'Fast Charger 30W', price: 15000, category: 'Accessories', icon: '⚡' },
    { id: '6', name: 'Smartwatch Series X', price: 85000, category: 'Electronics', icon: '⌚' },
    { id: '7', name: 'Screen Repair Service', price: 35000, category: 'Services', icon: '🔧' },
    { id: '8', name: 'Software Setup', price: 10000, category: 'Services', icon: '⚙️' },
  ];

  const categories = ["All", "Electronics", "Accessories", "Services"];

  const filteredProducts = activeCategory === "All" 
    ? mockProducts 
    : mockProducts.filter(p => p.category === activeCategory);

  const addToCart = (product: any) => {
    setCart(prev => {
      const existing = prev.find(p => p.id === product.id);
      if (existing) {
        return prev.map(p => p.id === product.id ? { ...p, qty: p.qty + 1 } : p);
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(p => p.id !== productId));
  };

  const updateQty = (productId: string, newQty: number) => {
    if (newQty < 1) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(p => p.id === productId ? { ...p, qty: newQty } : p));
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-2rem)] md:h-[calc(100vh-80px)] overflow-hidden animate-fade-in -m-4 md:-m-8">
      
      {/* Products Area */}
      <div className="flex-1 p-4 md:p-8 flex flex-col overflow-hidden bg-primary/50 relative">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="mb-6 z-10">
          <h1 className="h2 text-white mb-2">Point of Sale</h1>
          <p className="text-secondary text-sm">Tap products to add them to the current order.</p>
        </div>

        {/* Categories */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 z-10 custom-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all ${
                activeCategory === cat 
                ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30' 
                : 'bg-tertiary text-secondary hover:text-white border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="flex-1 overflow-y-auto z-10 custom-scrollbar pb-24 lg:pb-0">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map(p => (
              <button 
                key={p.id}
                onClick={() => addToCart(p)}
                className="glass p-4 rounded-xl text-center hover:-translate-y-1 transition-all border border-white/5 hover:border-brand-500/50 flex flex-col items-center justify-between gap-3 aspect-square group overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-brand-500/0 group-hover:bg-brand-500/10 transition-colors"></div>
                <div className="text-4xl mt-2 drop-shadow-md transform group-hover:scale-110 transition-transform">{p.icon}</div>
                <div className="w-full">
                  <h3 className="font-semibold text-sm md:text-sm text-white line-clamp-2 leading-tight mb-1">{p.name}</h3>
                  <p className="text-xs font-bold text-brand-400">₦{p.price.toLocaleString()}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cart Sidebar */}
      <div className="w-full lg:w-96 glass border-t lg:border-l lg:border-t-0 border-white/10 flex flex-col h-[50vh] lg:h-full relative z-20">
        <div className="p-5 border-b border-white/5 bg-tertiary/50">
          <h2 className="h3 text-white flex items-center justify-between">
            Current Order
            <span className="text-xs bg-brand-500 text-white px-2 py-1 rounded-full">
              {cart.reduce((sum, item) => sum + item.qty, 0)} items
            </span>
          </h2>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 custom-scrollbar">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-tertiary opacity-50 gap-4">
              <span className="text-6xl">🛒</span>
              <p className="text-sm">Your cart is empty</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex justify-between items-center p-3 rounded-xl bg-tertiary/80 border border-white/5 animate-fade-in group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-xl">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white line-clamp-1">{item.name}</h4>
                    <p className="text-xs text-brand-400 font-medium">₦{item.price.toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-2">
                  <div className="font-bold text-sm text-white">
                    ₦{(item.price * item.qty).toLocaleString()}
                  </div>
                  <div className="flex items-center gap-2 bg-primary rounded-lg border border-white/10 overflow-hidden">
                    <button onClick={() => updateQty(item.id, item.qty - 1)} className="px-2 py-1 text-xs text-white hover:bg-white/10 transition-colors">-</button>
                    <span className="text-xs text-white font-bold w-4 text-center">{item.qty}</span>
                    <button onClick={() => updateQty(item.id, item.qty + 1)} className="px-2 py-1 text-xs text-white hover:bg-white/10 transition-colors">+</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-5 border-t border-white/10 bg-tertiary/80 backdrop-blur-md">
          <div className="flex justify-between items-center mb-4">
            <span className="text-secondary text-sm">Subtotal</span>
            <span className="text-white font-bold">₦{total.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center mb-6">
            <span className="text-secondary text-sm">Tax (0%)</span>
            <span className="text-white font-bold">₦0</span>
          </div>
          <div className="flex justify-between items-center mb-6 pt-4 border-t border-white/5">
            <span className="text-lg text-white">Total</span>
            <span className="text-2xl font-bold gradient-text">₦{total.toLocaleString()}</span>
          </div>
          <button 
            className="btn btn-primary w-full py-4 text-lg font-bold shadow-lg shadow-brand-500/20 disabled:opacity-50 disabled:shadow-none"
            disabled={cart.length === 0}
            onClick={() => {
              alert("Payment Successful! Mock transaction completed.");
              setCart([]);
            }}
          >
            Charge ₦{total.toLocaleString()}
          </button>
        </div>
      </div>
    </div>
  );
}
