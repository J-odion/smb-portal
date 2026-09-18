"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "../../page.module.css";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const formData = new FormData(e.currentTarget);
    
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(formData)),
      });
      
      if (!res.ok) throw new Error("Invalid credentials");
      
      const data = await res.json();
      document.cookie = `token=${data.access_token}; path=/; max-age=3600`;
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <main className={`flex flex-col items-center justify-center ${styles.main}`}>
      <div className={`glass p-8 container animate-fade-in ${styles.hero}`} style={{ maxWidth: '400px' }}>
        <h1 className="h2 mb-4">Welcome Back</h1>
        <p className="text-sm text-secondary mb-8">Sign in to your SMB Portal account</p>
        
        {error && <p className="text-sm text-danger-500 mb-4">{error}</p>}
        
        <form className="flex flex-col gap-4 w-full text-left" onSubmit={handleLogin}>
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm">Email</label>
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
          
          <button type="submit" className="btn btn-primary mt-4 w-full p-4">Sign In</button>
        </form>
        
        <p className="mt-8 text-sm text-secondary">
          Don't have an account? <Link href="/signup" className="text-primary font-bold">Sign up</Link>
        </p>
      </div>
      
      <div className={styles.blob1}></div>
      <div className={styles.blob2}></div>
    </main>
  );
}
