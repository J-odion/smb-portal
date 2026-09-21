"use client";
import { useState } from "react";

export default function InventoryPage() {
  const [products] = useState([
    { id: '1', name: 'Smartphone Pro Max', sku: 'ELEC-SPM-01', price: 950000, stock_level: 12, category: 'Electronics', status: 'In Stock' },
    { id: '2', name: 'Wireless Earbuds', sku: 'ACC-WEB-02', price: 45000, stock_level: 45, category: 'Accessories', status: 'In Stock' },
    { id: '3', name: 'Laptop Ultra 15"', sku: 'ELEC-LU-03', price: 1250000, stock_level: 3, category: 'Electronics', status: 'Low Stock' },
    { id: '4', name: 'Screen Protector', sku: 'ACC-SP-04', price: 5000, stock_level: 120, category: 'Accessories', status: 'In Stock' },
    { id: '5', name: 'Fast Charger 30W', sku: 'ACC-FC-05', price: 15000, stock_level: 0, category: 'Accessories', status: 'Out of Stock' },
    { id: '6', name: 'Smartwatch Series X', sku: 'ELEC-SW-06', price: 85000, stock_level: 8, category: 'Electronics', status: 'Low Stock' },
    { id: '7', name: 'USB-C Cable 2m', sku: 'ACC-UC-07', price: 3500, stock_level: 200, category: 'Accessories', status: 'In Stock' },
    { id: '8', name: 'Bluetooth Speaker', sku: 'ELEC-BS-08', price: 25000, stock_level: 15, category: 'Electronics', status: 'In Stock' },
  ]);

  return (
    <div className="animate-fade-in relative max-w-7xl mx-auto h-full flex flex-col">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 z-10 relative">
        <div>
          <h1 className="h2 text-white">Product Inventory</h1>
          <p className="text-secondary text-sm mt-1">Manage your products, pricing, and stock levels.</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button className="btn btn-secondary flex-1 sm:flex-none">Export CSV</button>
          <button className="btn btn-primary flex-1 sm:flex-none shadow-lg shadow-brand-500/20">+ Add Product</button>
        </div>
      </div>
      
      {/* Search and Filter */}
      <div className="glass p-4 rounded-xl shadow-sm border border-white/5 mb-6 flex gap-4 z-10 relative">
        <input 
          type="text" 
          placeholder="Search products by name or SKU..." 
          className="flex-1 bg-primary/50 border border-white/10 rounded-lg px-4 py-2 text-sm focus:border-brand-500 outline-none text-white transition-colors"
        />
        <select className="bg-primary/50 border border-white/10 rounded-lg px-4 py-2 text-sm outline-none text-white hidden md:block cursor-pointer">
          <option>All Categories</option>
          <option>Electronics</option>
          <option>Accessories</option>
        </select>
      </div>

      <div className="glass rounded-xl shadow-sm border border-white/5 overflow-hidden z-10 relative flex-1 flex flex-col min-h-0">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="bg-tertiary/50 sticky top-0 z-10 backdrop-blur-md">
              <tr className="border-b border-white/10 text-xs text-secondary uppercase tracking-wider">
                <th className="p-4 font-medium">Product Details</th>
                <th className="p-4 font-medium">SKU</th>
                <th className="p-4 font-medium">Category</th>
                <th className="p-4 font-medium text-right">Price (₦)</th>
                <th className="p-4 font-medium text-right">Stock</th>
                <th className="p-4 font-medium text-center">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {products.map(p => (
                <tr key={p.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-tertiary border border-white/10 flex items-center justify-center text-brand-400">
                        📦
                      </div>
                      <span className="font-medium text-white">{p.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-secondary font-mono">{p.sku}</td>
                  <td className="p-4 text-sm text-secondary">{p.category}</td>
                  <td className="p-4 font-bold text-white text-right">₦{p.price.toLocaleString()}</td>
                  <td className="p-4 text-right">
                    <span className={`text-sm font-medium ${p.stock_level < 10 ? 'text-danger-400' : 'text-white'}`}>
                      {p.stock_level}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`px-2.5 py-1 text-xs rounded-full font-medium inline-block
                      ${p.status === 'In Stock' ? 'bg-success-500/10 text-success-500 border border-success-500/20' : ''}
                      ${p.status === 'Low Stock' ? 'bg-warning-500/10 text-warning-500 border border-warning-500/20' : ''}
                      ${p.status === 'Out of Stock' ? 'bg-danger-500/10 text-danger-500 border border-danger-500/20' : ''}
                    `}>
                      {p.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button className="text-secondary hover:text-brand-400 text-sm font-medium transition-colors">Edit</button>
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
