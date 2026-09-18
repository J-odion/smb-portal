"use client";
import { useState } from "react";

export default function SettingsPage() {
  const [industry, setIndustry] = useState("retail");

  return (
    <div className="animate-fade-in pb-20 md:pb-0">
      <h1 className="h2 mb-8">Business Settings</h1>
      
      <div className="glass p-6 rounded-lg shadow-sm border border-tertiary max-w-2xl">
        <h3 className="h3 mb-6 border-b border-tertiary pb-2">Industry Configurations</h3>
        
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="industry" className="font-bold">Select your business type:</label>
            <p className="text-sm text-secondary mb-2">This tailors your dashboard to show specific modules like Custom Measurements or Appointments.</p>
            <select 
              id="industry" 
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="p-3 w-full max-w-sm" 
              style={{ borderRadius: 'var(--radius-sm)', border: '1px solid var(--bg-tertiary)', background: 'var(--bg-primary)' }}
            >
              <option value="retail">General Retail / Mart</option>
              <option value="tailor">Tailoring & Fashion</option>
              <option value="salon">Barbing / Salon / Spa</option>
              <option value="food">Restaurant / Food Vendor</option>
            </select>
          </div>
          
          {industry === 'tailor' && (
            <div className="p-4 bg-tertiary rounded-lg border border-brand-500/20 mt-4 animate-fade-in">
              <h4 className="font-bold text-brand-600 mb-2">✂️ Tailoring Module Enabled</h4>
              <p className="text-sm">Your Customer profiles will now include a "Measurements" tab. You can record Chest, Waist, Length, etc., natively.</p>
            </div>
          )}

          {industry === 'salon' && (
            <div className="p-4 bg-tertiary rounded-lg border border-brand-500/20 mt-4 animate-fade-in">
              <h4 className="font-bold text-brand-600 mb-2">✂️ Salon Module Enabled</h4>
              <p className="text-sm">Your POS will now include an "Appointments" tab for booking specific staff members.</p>
            </div>
          )}

          <div className="mt-8 flex justify-end">
            <button className="btn btn-primary" onClick={() => alert("Settings saved successfully!")}>
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
