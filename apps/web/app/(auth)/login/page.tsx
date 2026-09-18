"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");
    
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      
      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.message || "Invalid email or password");
      }
      
      const data = await res.json();
      document.cookie = `token=${data.access_token}; path=/; max-age=86400`;
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-primary overflow-hidden">
      
      {/* Left Column - Sales Pitch (Hidden on Mobile) */}
      <div className="hidden md:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden bg-gradient-to-br from-brand-900/40 to-primary border-r border-tertiary">
        <div className="relative z-10">
          <Link href="/" className="font-bold text-3xl tracking-tighter hover:opacity-80 transition-opacity">
            <span className="text-white">SMB</span>
            <span className="gradient-text">Portal</span>
          </Link>
          <div className="mt-24 max-w-md">
            <h1 className="text-5xl font-bold leading-tight mb-6">Welcome back to your business hub.</h1>
            <p className="text-xl text-secondary">
              Review your daily sales, track offline operations, and manage your staff effortlessly.
            </p>
          </div>
        </div>
        
        {/* Abstract Background Elements */}
        <div className="absolute -bottom-32 -left-32 w-[600px] h-[600px] bg-brand-500/20 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute top-1/4 -right-32 w-[400px] h-[400px] bg-primary rounded-full blur-[80px]"></div>

        {/* Abstract Dashboard Visual */}
        <div className="relative z-10 mt-12 glass p-4 rounded-xl border border-white/5 opacity-70 transform rotate-[-2deg] translate-y-8">
          <div className="flex gap-2 mb-4 border-b border-tertiary pb-2">
            <div className="h-2 w-16 bg-brand-500 rounded"></div>
            <div className="h-2 w-8 bg-tertiary rounded"></div>
          </div>
          <div className="flex gap-4">
            <div className="w-1/3 h-24 bg-brand-600/20 rounded border border-brand-500/30"></div>
            <div className="w-1/3 h-24 bg-tertiary rounded"></div>
            <div className="w-1/3 h-24 bg-tertiary rounded"></div>
          </div>
        </div>
      </div>

      {/* Right Column - Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 relative">
        {/* Decorative Blob for Mobile */}
        <div className="md:hidden absolute top-0 right-0 w-64 h-64 bg-brand-500/10 blur-[80px] rounded-full"></div>
        
        <div className="w-full max-w-md z-10">
          <div className="md:hidden mb-12 text-center">
            <Link href="/" className="font-bold text-3xl tracking-tighter">
              <span className="text-white">SMB</span>
              <span className="gradient-text">Portal</span>
            </Link>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Sign In</h2>
            <p className="text-secondary">Enter your email and password to access your dashboard.</p>
          </div>

          {error && (
            <div className="bg-danger-500/15 border border-danger-500 text-danger-400 p-4 rounded-lg mb-6 text-sm flex items-start gap-3">
              <span className="text-lg">⚠️</span>
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-semibold text-secondary">Email Address</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                placeholder="admin@example.com"
                className="w-full p-4 bg-tertiary border border-white/5 rounded-xl focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all outline-none"
                required 
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="text-sm font-semibold text-secondary">Password</label>
                <Link href="#" className="text-xs text-brand-500 hover:text-brand-400 font-medium">Forgot password?</Link>
              </div>
              <input 
                type="password" 
                id="password" 
                name="password" 
                placeholder="••••••••"
                className="w-full p-4 bg-tertiary border border-white/5 rounded-xl focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all outline-none"
                required 
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading} 
              className="btn btn-primary w-full py-4 mt-4 text-base shadow-lg shadow-brand-500/20"
            >
              {loading ? "Authenticating..." : "Sign In to Dashboard"}
            </button>
          </form>
          
          <div className="mt-8 text-center text-secondary text-sm">
            Don't have an account yet?{' '}
            <Link href="/signup" className="text-white font-medium hover:text-brand-400 transition-colors">
              Create a business account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
