"use client";
import { useState } from "react";

export default function InventoryPage() {
  const [products, setProducts] = useState([
    { id: '1', name: 'Generator Oil', sku: 'GEN-OIL', price: 4500, stock_level: 25 },
    { id: '2', name: 'A4 Paper Ream', sku: 'A4-P', price: 6000, stock_level: 10 }
  ]);

  return (
    <div className="animate-fade-in relative">
      <div className="flex justify-between items-center mb-8">
        <h1 className="h2">Inventory</h1>
        <button className="btn btn-primary">Add Product</button>
      </div>
      
      <div className="glass p-6 rounded-lg shadow-sm border border-tertiary">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[500px]">
            <thead>
              <tr className="border-b border-tertiary text-sm text-secondary">
                <th className="pb-2">Name</th>
                <th className="pb-2">SKU</th>
                <th className="pb-2">Price (₦)</th>
                <th className="pb-2">Stock Level</th>
                <th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} className="border-b border-tertiary">
                  <td className="py-4">{p.name}</td>
                  <td className="py-4">{p.sku}</td>
                  <td className="py-4 font-bold">₦{p.price.toLocaleString()}</td>
                  <td className="py-4">{p.stock_level}</td>
                  <td className="py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${p.stock_level > 15 ? 'bg-success-500/20 text-success-500' : 'bg-warning-500/20 text-warning-500'}`}>
                      {p.stock_level > 15 ? 'In Stock' : 'Low Stock'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
