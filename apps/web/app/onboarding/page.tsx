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
