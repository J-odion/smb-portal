"use client";
import { useState } from "react";

export default function POSPage() {
  const [cart, setCart] = useState<{name: string, price: number, qty: number}[]>([]);
  
  const products = [
    { name: 'Haircut', price: 2500 },
    { name: 'Beard Trim', price: 1000 },
    { name: 'Hair Dye', price: 3500 },
    { name: 'Home Service', price: 15000 },
  ];

  const addToCart = (product: any) => {
    setCart(prev => {
      const existing = prev.find(p => p.name === product.name);
      if (existing) {
        return prev.map(p => p.name === product.name ? { ...p, qty: p.qty + 1 } : p);
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  return (
    <div className="flex flex-col md:flex-row h-full md:h-[calc(100vh-80px)] overflow-hidden animate-fade-in -m-4 md:-m-8">
      {/* Products Grid */}
      <div className="flex-1 p-4 md:p-8 bg-tertiary overflow-y-auto">
        <h1 className="h2 mb-6">Point of Sale</h1>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map(p => (
            <button 
              key={p.name}
              onClick={() => addToCart(p)}
              className="glass p-4 md:p-6 rounded-lg text-center hover:-translate-y-1 transition-transform border border-tertiary flex flex-col items-center justify-center gap-2 aspect-square"
            >
              <h3 className="font-bold text-sm md:text-base">{p.name}</h3>
              <p className="text-xs md:text-sm text-brand-600">₦{p.price.toLocaleString()}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Cart Sidebar */}
      <div className="w-full md:w-96 glass border-t md:border-l md:border-t-0 border-tertiary flex flex-col h-1/2 md:h-full">
        <div className="p-4 md:p-6 border-b border-tertiary">
          <h2 className="h3">Current Order</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-4">
          {cart.length === 0 ? (
            <p className="text-secondary text-center my-auto">Cart is empty</p>
          ) : (
            cart.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 rounded-lg bg-primary">
                <div>
                  <h4 className="font-bold text-sm md:text-base">{item.name}</h4>
                  <p className="text-xs md:text-sm text-secondary">₦{item.price.toLocaleString()} x {item.qty}</p>
                </div>
                <div className="font-bold text-sm md:text-base">
                  ₦{(item.price * item.qty).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 md:p-6 border-t border-tertiary bg-primary">
          <div className="flex justify-between items-center mb-4 md:mb-6">
            <span className="text-base md:text-lg">Total</span>
            <span className="h2 gradient-text">₦{total.toLocaleString()}</span>
          </div>
          <button 
            className="btn btn-primary w-full p-3 md:p-4 text-base md:text-lg"
            disabled={cart.length === 0}
            onClick={() => {
              alert("Transaction queued offline. Will sync when online!");
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
