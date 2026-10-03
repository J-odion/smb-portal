"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock successful signup
    document.cookie = `token=mock_token_123; path=/; max-age=86400`;
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-row-reverse w-full bg-primary font-sans">
      
      {/* Right Column - Dynamic Visual */}
      <div className="hidden md:flex flex-col justify-center items-center w-1/2 p-12 relative overflow-hidden bg-brand-900 text-white">
        {/* Background blobs */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-brand-500/40 blur-[80px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-danger-500/30 blur-[80px]"></div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="relative z-10 w-full max-w-lg"
        >
          <div className="text-center mb-10">
            <h2 className="text-4xl font-extrabold mb-4 leading-tight">
              Create workflows that <br/> <span className="text-brand-400">click.</span>
            </h2>
          </div>

          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-brand-400 to-danger-400 rounded-3xl blur opacity-30"></div>
            <div className="glass p-8 rounded-3xl border border-white/10 shadow-2xl bg-black/20 backdrop-blur-xl relative">
               <div className="flex items-center gap-4 mb-6">
                 <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-brand-500 to-brand-300"></div>
                 <div>
                   <div className="h-4 bg-white/20 rounded w-24 mb-2"></div>
                   <div className="h-3 bg-white/10 rounded w-16"></div>
                 </div>
               </div>
               <div className="space-y-3">
                 <div className="h-10 bg-white/10 rounded-xl w-full"></div>
                 <div className="h-10 bg-white/10 rounded-xl w-5/6"></div>
                 <div className="h-10 bg-white/10 rounded-xl w-4/6"></div>
               </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Left Column - Clean Signup Form */}
      <div className="w-full md:w-1/2 flex flex-col p-8 md:p-12 relative overflow-y-auto">
        <div className="w-full flex justify-start">
           <Link href="/login" className="text-sm font-medium text-secondary hover:text-brand-500">
             Already have an account? <span className="text-brand-500 font-bold">Log in</span>
           </Link>
        </div>

        <div className="flex-1 flex items-center justify-center mt-8 md:mt-0">
          <div className="w-full max-w-sm">
            <Link href="/" className="font-extrabold text-2xl tracking-tight flex items-center gap-2 mb-12">
              <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center text-white text-lg">S</div>
              <span className="text-primary">SMB Portal</span>
            </Link>

            <h1 className="text-3xl font-extrabold mb-2 text-primary">Sign up for free</h1>
            <p className="text-secondary mb-8 text-sm">Full access. No credit card needed.</p>

            {error && (
              <div className="bg-danger-500/10 border border-danger-500/20 text-danger-500 p-4 rounded-xl mb-6 text-sm flex items-center gap-3">
                <span className="text-lg">⚠️</span>
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSignup} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label htmlFor="businessName" className="text-sm font-bold text-primary">Business Name</label>
                <input 
                  type="text" 
                  id="businessName" 
                  name="businessName" 
                  placeholder="Acme Corp"
                  className="w-full p-3.5 bg-tertiary border border-white/10 rounded-xl focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all outline-none text-primary"
                  required 
                />
              </div>

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
                <label htmlFor="password" className="text-sm font-bold text-primary">Password</label>
                <input 
                  type="password" 
                  id="password" 
                  name="password" 
                  placeholder="••••••••"
                  className="w-full p-3.5 bg-tertiary border border-white/10 rounded-xl focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all outline-none text-primary"
                  required 
                  minLength={8}
                />
              </div>
              
              <button 
                type="submit" 
                disabled={loading} 
                className="btn btn-primary w-full py-4 mt-2 text-base rounded-xl font-bold shadow-md hover:shadow-lg transition-all"
              >
                {loading ? "Creating account..." : "Continue"}
              </button>
            </form>
            <p className="text-center text-xs text-secondary mt-6">
              By proceeding, you agree to our <a href="#" className="underline hover:text-primary">Terms of Service</a> and <a href="#" className="underline hover:text-primary">Privacy Policy</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
