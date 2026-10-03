"use client";

import Link from "next/link";
import { motion, Variants } from "framer-motion";

export default function Home() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 12 },
    },
  };

  return (
    <div className="min-h-screen bg-primary text-primary overflow-x-hidden font-sans">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-brand-500/10 blur-[100px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-danger-500/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[20%] w-[700px] h-[700px] rounded-full bg-success-500/10 blur-[120px] pointer-events-none" />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-primary/80 backdrop-blur-md border-b border-tertiary">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="font-extrabold text-2xl tracking-tight flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center text-white text-lg">S</div>
            <span className="text-primary">SMB Portal</span>
          </div>
          <div className="flex items-center gap-6 font-medium">
            <Link href="/login" className="text-sm text-secondary hover:text-brand-500 transition-colors hidden md:block">
              Log in
            </Link>
            <Link href="/signup" className="btn btn-primary text-sm px-6 rounded-full shadow-md shadow-brand-500/20">
              Get Started →
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-40 pb-16 relative z-10">
        
        {/* HERO SECTION */}
        <motion.section 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="container mx-auto px-6 mb-32 flex flex-col items-center text-center"
        >
          <motion.div variants={itemVariants} className="inline-block py-1.5 px-4 rounded-full bg-success-500/10 text-success-500 text-sm font-bold mb-8 border border-success-500/20 shadow-sm">
            🚀 Now with seamless Offline POS Sync
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="h1 mb-6 max-w-4xl text-primary">
            A platform built for a <br className="hidden md:block" />
            <span className="gradient-text">new way of working</span>
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-xl text-secondary max-w-2xl mb-10 leading-relaxed">
            What would you like to manage? Inventory, Sales, CRM, or Appointments? SMB Portal helps African businesses run their entire workflow offline and online.
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
            <Link href="/signup" className="btn btn-primary text-lg px-8 py-4 rounded-full shadow-xl shadow-brand-500/30 hover:-translate-y-1 transition-all">
              Start for free today
            </Link>
            <p className="text-sm text-secondary self-center mt-2 sm:mt-0 sm:ml-4">No credit card needed.</p>
          </motion.div>

          {/* Hero Abstract Dashboard with Floating elements */}
          <motion.div variants={itemVariants} className="mt-24 w-full max-w-5xl relative">
            <motion.div 
              animate={{ y: [0, -10, 0] }} 
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute -top-12 -left-12 z-20 glass p-4 rounded-2xl border-white/40 shadow-xl"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-success-500 flex justify-center items-center text-white">✓</div>
                <div className="text-left">
                  <p className="text-xs font-bold text-primary">Sale Synced</p>
                  <p className="text-[10px] text-secondary">Just now</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              animate={{ y: [0, 15, 0] }} 
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              className="absolute -bottom-10 -right-8 z-20 glass p-4 rounded-2xl border-white/40 shadow-xl"
            >
              <div className="flex flex-col gap-2">
                <p className="text-xs font-bold text-primary">Monthly Revenue</p>
                <div className="h-2 w-24 bg-tertiary rounded-full overflow-hidden">
                  <div className="h-full bg-brand-500 w-[75%]"></div>
                </div>
              </div>
            </motion.div>

            <div className="glass rounded-2xl border border-tertiary/50 p-4 shadow-2xl overflow-hidden relative bg-primary/60">
              <div className="flex gap-2 mb-6 px-2">
                <div className="w-3 h-3 rounded-full bg-danger-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-warning-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-success-500/80"></div>
              </div>
              <div className="flex gap-6 h-[400px]">
                {/* Sidebar */}
                <div className="w-1/4 hidden md:flex flex-col gap-4">
                  <div className="h-10 bg-brand-500/10 rounded-xl w-full flex items-center px-4"><div className="w-4 h-4 rounded bg-brand-500 mr-2"></div><div className="h-2 bg-brand-500/40 rounded w-16"></div></div>
                  <div className="h-10 bg-tertiary/40 rounded-xl w-full flex items-center px-4"><div className="w-4 h-4 rounded bg-secondary mr-2"></div><div className="h-2 bg-secondary rounded w-20"></div></div>
                  <div className="h-10 bg-tertiary/40 rounded-xl w-full flex items-center px-4"><div className="w-4 h-4 rounded bg-secondary mr-2"></div><div className="h-2 bg-secondary rounded w-12"></div></div>
                </div>
                {/* Main */}
                <div className="flex-1 flex flex-col gap-6">
                  <div className="flex gap-4">
                    <div className="flex-1 bg-secondary rounded-xl shadow-sm border border-tertiary/50 p-4 flex flex-col justify-between">
                      <div className="w-8 h-8 rounded bg-brand-100 mb-4"></div>
                      <div className="h-3 bg-tertiary rounded w-1/2 mb-2"></div>
                      <div className="h-6 bg-primary rounded w-3/4"></div>
                    </div>
                    <div className="flex-1 bg-secondary rounded-xl shadow-sm border border-tertiary/50 p-4 flex flex-col justify-between">
                      <div className="w-8 h-8 rounded bg-success-500/20 mb-4"></div>
                      <div className="h-3 bg-tertiary rounded w-1/2 mb-2"></div>
                      <div className="h-6 bg-primary rounded w-1/2"></div>
                    </div>
                    <div className="flex-1 bg-secondary rounded-xl shadow-sm border border-tertiary/50 p-4 flex flex-col justify-between">
                      <div className="w-8 h-8 rounded bg-warning-500/20 mb-4"></div>
                      <div className="h-3 bg-tertiary rounded w-1/2 mb-2"></div>
                      <div className="h-6 bg-primary rounded w-2/3"></div>
                    </div>
                  </div>
                  <div className="flex-1 bg-secondary rounded-xl shadow-sm border border-tertiary/50 p-4">
                    <div className="flex gap-4 items-end h-full pt-8 px-4 pb-2">
                       <div className="flex-1 bg-brand-100 rounded-t-md h-[40%]"></div>
                       <div className="flex-1 bg-brand-100 rounded-t-md h-[60%]"></div>
                       <div className="flex-1 bg-brand-500 rounded-t-md h-[90%] relative"><div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold bg-primary text-white px-2 py-1 rounded">Growth</div></div>
                       <div className="flex-1 bg-brand-100 rounded-t-md h-[50%]"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.section>

        {/* FEATURES GRID */}
        <section className="container mx-auto px-6 mb-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Manage everything in one workspace</h2>
            <p className="text-secondary max-w-2xl mx-auto">From multi-branch inventory to seamless offline sales, the tools you need to run your business efficiently.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div whileHover={{ y: -5 }} className="glass p-8 rounded-3xl border border-tertiary bg-secondary hover:shadow-xl transition-all">
              <div className="w-14 h-14 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-500 text-2xl mb-6 shadow-inner">⚡</div>
              <h3 className="text-xl font-bold mb-3">Offline-First POS</h3>
              <p className="text-secondary text-sm">Keep selling even when the internet goes down. Background sync ensures you never lose a transaction.</p>
            </motion.div>
            
            <motion.div whileHover={{ y: -5 }} className="glass p-8 rounded-3xl border border-tertiary bg-secondary hover:shadow-xl transition-all">
              <div className="w-14 h-14 rounded-2xl bg-success-500/10 flex items-center justify-center text-success-500 text-2xl mb-6 shadow-inner">📊</div>
              <h3 className="text-xl font-bold mb-3">Real-time Analytics</h3>
              <p className="text-secondary text-sm">Make data-driven decisions with dynamic visual dashboards, built natively with Recharts.</p>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} className="glass p-8 rounded-3xl border border-tertiary bg-secondary hover:shadow-xl transition-all">
              <div className="w-14 h-14 rounded-2xl bg-warning-500/10 flex items-center justify-center text-warning-500 text-2xl mb-6 shadow-inner">🏦</div>
              <h3 className="text-xl font-bold mb-3">Multi-Branch Control</h3>
              <p className="text-secondary text-sm">Track inventory, staff, and sales across multiple physical locations securely from a single pane of glass.</p>
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <section className="container mx-auto px-6">
          <div className="rounded-[40px] p-12 md:p-20 bg-brand-900 text-white text-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-500 rounded-full blur-[100px] opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-danger-500 rounded-full blur-[100px] opacity-30"></div>
            
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-bold mb-6">Deliver your best work.</h2>
              <p className="text-xl text-brand-100 mb-10 max-w-2xl mx-auto">
                No credit card needed ✦ Unlimited time on Free plan ✦ Offline capable
              </p>
              <Link href="/signup" className="btn bg-brand-500 text-white hover:bg-brand-400 text-xl px-10 py-5 rounded-full shadow-xl hover:scale-105 transition-transform inline-block font-bold">
                Get Started
              </Link>
            </div>
          </div>
        </section>

      </main>

      <footer className="border-t border-tertiary bg-primary mt-20 relative z-10">
        <div className="container mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="font-extrabold text-xl tracking-tight">
            <span className="text-primary">SMB Portal</span>
          </div>
          <p className="text-secondary text-sm">© {new Date().getFullYear()} SMB Portal. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-secondary font-medium">
            <a href="#" className="hover:text-brand-500 transition-colors">Privacy</a>
            <a href="#" className="hover:text-brand-500 transition-colors">Terms</a>
            <a href="#" className="hover:text-brand-500 transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
