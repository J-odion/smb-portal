"use client";
import { useState, useEffect } from "react";

export default function SettingsPage() {
  const [industry, setIndustry] = useState("RETAIL");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:3001/tenant/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setIndustry(data.industry || "RETAIL");
        }
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3001/tenant/industry", {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ industry })
      });
      if (res.ok) {
        alert("Settings saved successfully!");
      } else {
        const data = await res.json();
        alert(`Failed: ${data.message || 'Access Denied (Requires OWNER or MANAGER role)'}`);
      }
    } catch (err) {
      console.error(err);
      alert("Error saving settings");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="p-8">Loading settings...</div>;

  return (
    <div className="animate-fade-in pb-20 md:pb-0">
      <h1 className="h2 mb-8">Business Settings</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass p-6 rounded-lg shadow-sm border border-tertiary">
          <h3 className="h3 mb-6 border-b border-tertiary pb-2">Industry Configurations</h3>
          
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="industry" className="font-bold">Select your business type:</label>
              <p className="text-sm text-secondary mb-2">This tailors your dashboard to show specific modules like Custom Measurements or Appointments.</p>
              <select 
                id="industry" 
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="p-3 w-full outline-none" 
                style={{ borderRadius: 'var(--radius-sm)', border: '1px solid var(--bg-tertiary)', background: 'var(--bg-primary)' }}
              >
                <option value="RETAIL">General Retail / Mart</option>
                <option value="TAILOR">Tailoring & Fashion</option>
                <option value="SALON">Barbing / Salon / Spa</option>
                <option value="FOOD">Restaurant / Food Vendor</option>
                <option value="BOOK_STORE">Book Store / Stationery</option>
                <option value="PHOTOGRAPHY">Photography Studio</option>
                <option value="RESTAURANT_BAR">Kitchen / Restaurant & Bar</option>
                <option value="GYM_FITNESS">Gym & Fitness Center</option>
                <option value="AUTO_REPAIR">Auto Repair / Mechanic</option>
                <option value="REAL_ESTATE">Real Estate / Agency</option>
              </select>
            </div>
            
            {industry === 'TAILOR' && (
              <div className="p-4 bg-tertiary rounded-lg border border-brand-500/20 mt-4 animate-fade-in">
                <h4 className="font-bold text-brand-600 mb-2">✂️ Tailoring Module Enabled</h4>
                <p className="text-sm">Your Customer profiles will now include a "Measurements" tab. You can record Chest, Waist, Length, etc., natively.</p>
              </div>
            )}

            {industry === 'SALON' && (
              <div className="p-4 bg-tertiary rounded-lg border border-brand-500/20 mt-4 animate-fade-in">
                <h4 className="font-bold text-brand-600 mb-2">✂️ Salon Module Enabled</h4>
                <p className="text-sm">Your POS will now include an "Appointments" tab for booking specific staff members.</p>
              </div>
            )}
            
            {industry === 'RESTAURANT_BAR' && (
              <div className="p-4 bg-tertiary rounded-lg border border-brand-500/20 mt-4 animate-fade-in">
                <h4 className="font-bold text-brand-600 mb-2">🍽️ Kitchen/Restaurant & Bar Module Enabled</h4>
                <p className="text-sm">Enables Table Management, Kitchen Order Tickets (KOT), and Recipe tracking.</p>
              </div>
            )}

            {industry === 'PHOTOGRAPHY' && (
              <div className="p-4 bg-tertiary rounded-lg border border-brand-500/20 mt-4 animate-fade-in">
                <h4 className="font-bold text-brand-600 mb-2">📸 Photography Studio Module Enabled</h4>
                <p className="text-sm">Enables Booking Management, Package Selection, and Digital Asset Delivery links.</p>
              </div>
            )}

            {industry === 'BOOK_STORE' && (
              <div className="p-4 bg-tertiary rounded-lg border border-brand-500/20 mt-4 animate-fade-in">
                <h4 className="font-bold text-brand-600 mb-2">📚 Book Store Module Enabled</h4>
                <p className="text-sm">Enables ISBN barcode scanning and genre/author categorization in Inventory.</p>
              </div>
            )}

            <div className="mt-8 flex justify-end">
              <button className="btn btn-primary" onClick={handleSave} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </div>
        </div>

        <div className="glass p-6 rounded-lg shadow-sm border border-brand-500/30 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          </div>
          <div>
            <div className="flex justify-between items-center mb-6 border-b border-tertiary pb-2">
              <h3 className="h3">Subscription Plan</h3>
              <span className="px-3 py-1 bg-brand-500/10 text-brand-500 rounded-full text-xs font-bold border border-brand-500/30">TRIAL ACTIVE</span>
            </div>
            
            <div className="space-y-4 relative z-10">
              <div>
                <p className="text-sm text-secondary">Current Plan</p>
                <p className="text-2xl font-bold">Pro Trial</p>
              </div>
              
              <div className="p-4 bg-tertiary rounded-lg border border-tertiary">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-bold text-success-500">120 Days Remaining</span>
                  <span className="text-secondary">Ends in 4 Months</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div className="bg-success-500 h-2 rounded-full" style={{ width: '10%' }}></div>
                </div>
              </div>
              
              <ul className="text-sm space-y-2 mt-4 text-secondary">
                <li className="flex items-center gap-2">✓ Unlimited Transactions</li>
                <li className="flex items-center gap-2">✓ Team Management (Up to 10)</li>
                <li className="flex items-center gap-2">✓ Offline Support via PWA</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 relative z-10">
            <button 
              className="w-full btn btn-primary flex items-center justify-center gap-2"
              onClick={async () => {
                const token = localStorage.getItem("token");
                const res = await fetch("http://localhost:3001/payments/checkout-session", {
                  method: "POST",
                  headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.url) {
                  window.location.href = data.url;
                }
              }}
            >
              Upgrade to PRO 🚀
            </button>
            <p className="text-center text-xs text-secondary mt-3">Cancel anytime. No hidden fees.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
