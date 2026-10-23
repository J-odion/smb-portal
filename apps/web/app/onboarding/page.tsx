"use client";
import { useState } from "react";
import { Building2, ArrowRight } from "lucide-react";

export default function OnboardingWizard() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="w-full max-w-xl bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-purple-600 uppercase tracking-wider mb-1">
            <Building2 size={16} />
            <span>Setup Workspace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-black">Set up your Business Profile</h1>
          <p className="text-sm text-zinc-600 mt-1">
            Let's configure your business modules, offline POS cashiering, and automated invoicing.
          </p>
        </div>

        <form className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="businessName" className="text-xs font-semibold text-black uppercase tracking-wider">
              Business Name
            </label>
            <input 
              type="text" 
              id="businessName" 
              placeholder="e.g. Modern Boutique & Tailors"
              className="w-full p-3.5 rounded-xl bg-white border border-zinc-300 text-black placeholder-zinc-400 text-sm focus:border-purple-600 outline-none"
              required 
            />
          </div>
          
          <div className="space-y-1.5">
            <label htmlFor="industry" className="text-xs font-semibold text-black uppercase tracking-wider">
              Select Business Industry
            </label>
            <select 
              id="industry" 
              className="w-full p-3.5 rounded-xl bg-white border border-zinc-300 text-black text-sm focus:border-purple-600 outline-none"
              required
              defaultValue="RETAIL"
            >
              <option value="RETAIL">General Retail / Mart</option>
              <option value="TAILOR">Tailoring & Fashion</option>
              <option value="SALON">Barbing / Salon / Spa</option>
              <option value="FOOD">Restaurant / Food Vendor</option>
              <option value="BOOK_STORE">Book Store / Stationery</option>
              <option value="PHOTOGRAPHY">Photography Studio</option>
              <option value="GYM_FITNESS">Gym & Fitness Center</option>
              <option value="AUTO_REPAIR">Auto Repair / Mechanic</option>
              <option value="REAL_ESTATE">Real Estate / Agency</option>
            </select>
            <p className="text-xs text-zinc-500">This configures your dashboard tabs, measurement sheets, or POS barcode items.</p>
          </div>
          
          <div className="space-y-1.5">
            <label htmlFor="address" className="text-xs font-semibold text-black uppercase tracking-wider">
              Store / Outlet Address
            </label>
            <textarea 
              id="address" 
              rows={2}
              placeholder="e.g. 14 Admiralty Way, Lekki Phase 1, Lagos"
              className="w-full p-3.5 rounded-xl bg-white border border-zinc-300 text-black placeholder-zinc-400 text-sm focus:border-purple-600 outline-none resize-none"
            />
          </div>

          <hr className="border-zinc-200 my-4" />
          
          <div>
            <h2 className="text-base font-bold text-black">Bank Settlement Details</h2>
            <p className="text-xs text-zinc-500 mt-0.5">Displayed on digital customer receipts and invoices.</p>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="bankName" className="text-xs font-semibold text-black uppercase tracking-wider">
              Bank Name
            </label>
            <input 
              type="text" 
              id="bankName" 
              placeholder="e.g. Access Bank / GTBank / Zenith Bank"
              className="w-full p-3.5 rounded-xl bg-white border border-zinc-300 text-black placeholder-zinc-400 text-sm focus:border-purple-600 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label htmlFor="accountNumber" className="text-xs font-semibold text-black uppercase tracking-wider">
                Account Number
              </label>
              <input 
                type="text" 
                id="accountNumber" 
                placeholder="10-digit NUBAN"
                className="w-full p-3.5 rounded-xl bg-white border border-zinc-300 text-black placeholder-zinc-400 text-sm focus:border-purple-600 outline-none"
              />
            </div>
            
            <div className="space-y-1.5">
              <label htmlFor="accountHolder" className="text-xs font-semibold text-black uppercase tracking-wider">
                Account Name
              </label>
              <input 
                type="text" 
                id="accountHolder" 
                placeholder="Official Account Name"
                className="w-full p-3.5 rounded-xl bg-white border border-zinc-300 text-black placeholder-zinc-400 text-sm focus:border-purple-600 outline-none"
              />
            </div>
          </div>
          
          <button 
            type="button" 
            onClick={() => window.location.href = "/dashboard"}
            className="w-full py-3.5 mt-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-purple-600/20 transition-all cursor-pointer"
          >
            <span>Save & Go to Workspace</span>
            <ArrowRight size={16} />
          </button>
        </form>
      </div>
    </main>
  );
}

