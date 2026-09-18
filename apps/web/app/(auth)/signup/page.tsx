"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "../../page.module.css";

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  
  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const formData = new FormData(e.currentTarget);
    
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(formData)),
      });
      
      if (!res.ok) throw new Error("Failed to sign up");
      
      const data = await res.json();
      document.cookie = `token=${data.access_token}; path=/; max-age=3600`;
      router.push("/onboarding");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <main className={`flex flex-col items-center justify-center ${styles.main}`}>
      <div className={`glass p-8 container animate-fade-in ${styles.hero}`} style={{ maxWidth: '400px' }}>
        <h1 className="h2 mb-4">Create Account</h1>
        <p className="text-sm text-secondary mb-8">Join SMB Portal to manage your business</p>
        
        {error && <p className="text-sm text-danger-500 mb-4">{error}</p>}

        <form className="flex flex-col gap-4 w-full text-left" onSubmit={handleSignup}>
          <div className="flex flex-col gap-2">
            <label htmlFor="businessName" className="text-sm">Business Name</label>
            <input 
              type="text" 
              id="businessName" 
              name="businessName"
              className="p-4" 
              style={{ borderRadius: 'var(--radius-sm)', border: '1px solid var(--bg-tertiary)', background: 'var(--bg-primary)' }}
              required 
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm">Email Address</label>
            <input 
              type="email" 
              id="email" 
              name="email"
              className="p-4" 
              style={{ borderRadius: 'var(--radius-sm)', border: '1px solid var(--bg-tertiary)', background: 'var(--bg-primary)' }}
              required 
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-sm">Password</label>
            <input 
              type="password" 
              id="password" 
              name="password"
              className="p-4" 
              style={{ borderRadius: 'var(--radius-sm)', border: '1px solid var(--bg-tertiary)', background: 'var(--bg-primary)' }}
              required 
            />
          </div>
          
          <button type="submit" disabled={loading} className="btn btn-primary mt-4 w-full p-4">
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>
        
        <p className="mt-8 text-sm text-secondary">
          Already have an account? <Link href="/login" className="text-primary font-bold">Sign in</Link>
        </p>
      </div>
      
      <div className={styles.blob1}></div>
      <div className={styles.blob2}></div>
    </main>
  );
}
