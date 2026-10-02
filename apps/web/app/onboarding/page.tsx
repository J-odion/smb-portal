import styles from "../page.module.css";

export default function OnboardingWizard() {
  return (
    <main className={`flex flex-col items-center justify-center ${styles.main}`}>
      <div className={`glass p-8 container animate-fade-in ${styles.hero}`} style={{ maxWidth: '600px' }}>
        <h1 className="h2 mb-4">Set up your Business Profile</h1>
        <p className="text-sm text-secondary mb-8">Let's get your business ready for invoicing and tracking.</p>
        
        <form className="flex flex-col gap-4 w-full text-left">
          <div className="flex flex-col gap-2">
            <label htmlFor="businessName" className="text-sm">Business Name</label>
            <input 
              type="text" 
              id="businessName" 
              className="p-4" 
              style={{ borderRadius: 'var(--radius-sm)', border: '1px solid var(--bg-tertiary)', background: 'var(--bg-primary)' }}
              required 
            />
          </div>
          
          <div className="flex flex-col gap-2 mt-4">
            <label htmlFor="industry" className="text-sm">Select your Business Industry</label>
            <select 
              id="industry" 
              className="p-4 outline-none" 
              style={{ borderRadius: 'var(--radius-sm)', border: '1px solid var(--bg-tertiary)', background: 'var(--bg-primary)' }}
              required
            >
              <option value="" disabled selected>Select an industry...</option>
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
            <p className="text-xs text-secondary">This helps us customize your dashboard with the right modules.</p>
          </div>
          
          <div className="flex flex-col gap-2">
            <label htmlFor="address" className="text-sm">Business Address</label>
            <textarea 
              id="address" 
              rows={2}
              className="p-4" 
              style={{ borderRadius: 'var(--radius-sm)', border: '1px solid var(--bg-tertiary)', background: 'var(--bg-primary)' }}
            />
          </div>

          <hr style={{ border: '1px solid var(--bg-tertiary)', margin: '1rem 0' }} />
          <h2 className="h3">Bank Details <span className="text-sm font-normal text-secondary">(For Invoices)</span></h2>

          <div className="flex flex-col gap-2">
            <label htmlFor="bankName" className="text-sm">Bank Name</label>
            <input 
              type="text" 
              id="bankName" 
              className="p-4" 
              style={{ borderRadius: 'var(--radius-sm)', border: '1px solid var(--bg-tertiary)', background: 'var(--bg-primary)' }}
            />
          </div>

          <div className="flex gap-4 w-full">
            <div className="flex flex-col gap-2 w-full">
              <label htmlFor="accountNumber" className="text-sm">Account Number</label>
              <input 
                type="text" 
                id="accountNumber" 
                className="p-4" 
                style={{ borderRadius: 'var(--radius-sm)', border: '1px solid var(--bg-tertiary)', background: 'var(--bg-primary)' }}
              />
            </div>
            
            <div className="flex flex-col gap-2 w-full">
              <label htmlFor="accountHolder" className="text-sm">Account Name</label>
              <input 
                type="text" 
                id="accountHolder" 
                className="p-4" 
                style={{ borderRadius: 'var(--radius-sm)', border: '1px solid var(--bg-tertiary)', background: 'var(--bg-primary)' }}
              />
            </div>
          </div>
          
          <button type="button" className="btn btn-primary mt-8 w-full p-4">Save & Continue</button>
        </form>
      </div>
      
      <div className={styles.blob1}></div>
      <div className={styles.blob2}></div>
    </main>
  );
}
