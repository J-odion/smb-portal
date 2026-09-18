"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");
    const businessName = formData.get("businessName");
    
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, passwordPlain: password, businessName }),
      });
      
      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.message || "Failed to create account");
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
    <div className="min-h-screen flex flex-row-reverse w-full bg-primary overflow-hidden">
      
      {/* Right Column - Sales Pitch (Hidden on Mobile) */}
      <div className="hidden md:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden bg-gradient-to-bl from-brand-900/40 to-primary border-l border-tertiary">
        <div className="relative z-10 flex justify-end">
          <Link href="/" className="font-bold text-3xl tracking-tighter hover:opacity-80 transition-opacity">
            <span className="text-white">SMB</span>
            <span className="gradient-text">Portal</span>
          </Link>
        </div>
        
        <div className="relative z-10 mt-24 max-w-md self-end text-right">
          <h1 className="text-5xl font-bold leading-tight mb-6">Start growing your business today.</h1>
          <p className="text-xl text-secondary">
            Join hundreds of African businesses using SMB Portal to stay organized, manage inventory, and process offline sales.
          </p>
        </div>
        
        {/* Abstract Background Elements */}
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] bg-brand-500/20 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-1/4 -left-32 w-[400px] h-[400px] bg-primary rounded-full blur-[80px]"></div>

        {/* Testimonial Visual */}
        <div className="relative z-10 mt-12 glass p-6 rounded-xl border border-white/5 opacity-80 self-end max-w-sm">
          <div className="flex gap-4 items-center mb-4">
            <div className="w-12 h-12 rounded-full bg-brand-600 flex items-center justify-center font-bold text-xl">D</div>
            <div>
              <p className="font-bold text-white">David O.</p>
              <p className="text-xs text-brand-400">Retail Owner, Lagos</p>
            </div>
          </div>
          <p className="text-sm text-secondary italic">"The offline POS completely saved my business during internet outages. I can track every sale perfectly."</p>
        </div>
      </div>

      {/* Left Column - Signup Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 relative">
        {/* Decorative Blob for Mobile */}
        <div className="md:hidden absolute top-0 left-0 w-64 h-64 bg-brand-500/10 blur-[80px] rounded-full"></div>
        
        <div className="w-full max-w-md z-10">
          <div className="md:hidden mb-12 text-center">
            <Link href="/" className="font-bold text-3xl tracking-tighter">
              <span className="text-white">SMB</span>
              <span className="gradient-text">Portal</span>
            </Link>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Create Account</h2>
            <p className="text-secondary">Set up your business workspace in seconds.</p>
          </div>

          {error && (
            <div className="bg-danger-500/15 border border-danger-500 text-danger-400 p-4 rounded-lg mb-6 text-sm flex items-start gap-3">
              <span className="text-lg">⚠️</span>
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSignup} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label htmlFor="businessName" className="text-sm font-semibold text-secondary">Business Name</label>
              <input 
                type="text" 
                id="businessName" 
                name="businessName" 
                placeholder="e.g. Ade & Sons Enterprise"
                className="w-full p-4 bg-tertiary border border-white/5 rounded-xl focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all outline-none"
                required 
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-semibold text-secondary">Email Address</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                placeholder="admin@yourbusiness.com"
                className="w-full p-4 bg-tertiary border border-white/5 rounded-xl focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all outline-none"
                required 
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-sm font-semibold text-secondary">Password</label>
              <input 
                type="password" 
                id="password" 
                name="password" 
                placeholder="••••••••"
                className="w-full p-4 bg-tertiary border border-white/5 rounded-xl focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all outline-none"
                required 
                minLength={8}
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading} 
              className="btn btn-primary w-full py-4 mt-4 text-base shadow-lg shadow-brand-500/20"
            >
              {loading ? "Setting up workspace..." : "Create Business Account"}
            </button>
          </form>
          
          <div className="mt-8 text-center text-secondary text-sm">
            Already have an account?{' '}
            <Link href="/login" className="text-white font-medium hover:text-brand-400 transition-colors">
              Sign in here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
