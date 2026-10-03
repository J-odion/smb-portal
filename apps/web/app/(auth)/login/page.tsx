"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock successful login
    document.cookie = `token=mock_token_123; path=/; max-age=86400`;
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex w-full bg-primary font-sans">
      
      {/* Left Column - Dynamic Monday Style Visual */}
      <div className="hidden md:flex flex-col justify-center items-center w-1/2 p-12 relative overflow-hidden bg-brand-50">
        {/* Background blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-brand-500/20 blur-[80px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-success-500/20 blur-[80px]"></div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 w-full max-w-lg"
        >
          <div className="glass p-8 rounded-3xl border border-white/10 shadow-2xl bg-primary/80 backdrop-blur-xl">
            <h2 className="text-3xl font-extrabold mb-4 text-primary leading-tight">
              Manage everything <br/> <span className="text-brand-500">in one workspace.</span>
            </h2>
            <div className="space-y-4 mt-8">
              <motion.div 
                initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}
                className="flex items-center gap-4 bg-secondary p-4 rounded-2xl shadow-sm border border-tertiary"
              >
                <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-500 font-bold">1</div>
                <div className="h-4 bg-tertiary rounded w-1/2"></div>
              </motion.div>
              <motion.div 
                initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 }}
                className="flex items-center gap-4 bg-secondary p-4 rounded-2xl shadow-sm border border-tertiary"
              >
                <div className="w-10 h-10 rounded-full bg-success-500/20 flex items-center justify-center text-success-500 font-bold">2</div>
                <div className="h-4 bg-tertiary rounded w-3/4"></div>
              </motion.div>
              <motion.div 
                initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.6 }}
                className="flex items-center gap-4 bg-secondary p-4 rounded-2xl shadow-sm border border-tertiary"
              >
                <div className="w-10 h-10 rounded-full bg-warning-500/20 flex items-center justify-center text-warning-500 font-bold">3</div>
                <div className="h-4 bg-tertiary rounded w-2/3"></div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right Column - Clean Login Form */}
      <div className="w-full md:w-1/2 flex flex-col p-8 md:p-12 relative overflow-y-auto">
        <div className="w-full flex justify-end">
           <Link href="/signup" className="text-sm font-medium text-secondary hover:text-brand-500">
             Don't have an account? <span className="text-brand-500 font-bold">Sign up</span>
           </Link>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-sm">
            <Link href="/" className="font-extrabold text-2xl tracking-tight flex items-center gap-2 mb-12">
              <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center text-white text-lg">S</div>
              <span className="text-primary">SMB Portal</span>
            </Link>

            <h1 className="text-3xl font-extrabold mb-2 text-primary">Log in to your account</h1>
            <p className="text-secondary mb-8 text-sm">Enter your email and password to continue.</p>

            {error && (
              <div className="bg-danger-500/10 border border-danger-500/20 text-danger-500 p-4 rounded-xl mb-6 text-sm flex items-center gap-3">
                <span className="text-lg">⚠️</span>
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-sm font-bold text-primary">Email address</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  placeholder="name@company.com"
                  className="w-full p-3.5 bg-tertiary border border-white/10 rounded-xl focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all outline-none text-primary"
                  required 
                />
              </div>
              
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="password" className="text-sm font-bold text-primary">Password</label>
                  <Link href="#" className="text-xs text-brand-500 hover:text-brand-600 font-medium">Forgot password?</Link>
                </div>
                <input 
                  type="password" 
                  id="password" 
                  name="password" 
                  placeholder="••••••••"
                  className="w-full p-3.5 bg-tertiary border border-white/10 rounded-xl focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all outline-none text-primary"
                  required 
                />
              </div>
              
              <button 
                type="submit" 
                disabled={loading} 
                className="btn btn-primary w-full py-4 mt-2 text-base rounded-xl font-bold shadow-md hover:shadow-lg transition-all"
              >
                {loading ? "Logging in..." : "Log In"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
