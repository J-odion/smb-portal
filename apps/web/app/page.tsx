import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className="min-h-screen bg-primary text-primary overflow-x-hidden">
      
      {/* Background Decorative Blobs */}
      <div className={`${styles.blob1} animate-spin-slow`} style={{ top: '-10%', left: '-10%', width: '600px', height: '600px', opacity: 0.15 }}></div>
      <div className={`${styles.blob2} animate-spin-slow`} style={{ bottom: '-10%', right: '-10%', width: '800px', height: '800px', opacity: 0.1, animationDirection: 'reverse' }}></div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-tertiary">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="font-bold text-2xl tracking-tighter">
            <span className="text-white">SMB</span>
            <span className="gradient-text">Portal</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-secondary hover:text-white transition-colors hidden md:block">
              Log in
            </Link>
            <Link href="/signup" className="btn btn-primary text-sm px-6">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-16">
        
        {/* HERO SECTION */}
        <section className="container mx-auto px-6 mb-32 flex flex-col items-center text-center relative z-10 animate-fade-in">
          <div className="inline-block py-1 px-3 rounded-full border border-brand-500/30 bg-brand-500/10 text-brand-400 text-xs font-bold mb-6">
            ✨ Now with Offline-First POS capability
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-6 leading-tight max-w-4xl">
            Run your entire business <br className="hidden md:block" />
            <span className="gradient-text">even when offline.</span>
          </h1>
          <p className="text-lg md:text-xl text-secondary max-w-2xl mb-10">
            The ultimate operating system for African SMBs. Manage inventory, process sales, track expenses, and view real-time analytics—all from one beautiful dashboard.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
            <Link href="/signup" className="btn btn-primary text-lg px-8 py-4 shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 hover:-translate-y-1 transition-all">
              Start for free today
            </Link>
            <Link href="#features" className="btn btn-secondary text-lg px-8 py-4">
              See how it works
            </Link>
          </div>

          {/* Hero Dashboard Abstract Preview */}
          <div className="mt-20 w-full max-w-5xl relative animate-float">
            <div className="absolute inset-0 bg-gradient-to-t from-primary to-transparent z-10 top-1/2"></div>
            <div className="glass rounded-xl border border-tertiary p-2 md:p-4 shadow-2xl overflow-hidden relative">
              {/* Fake Mac Window Controls */}
              <div className="flex gap-2 mb-4 px-2">
                <div className="w-3 h-3 rounded-full bg-danger-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-warning-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-success-500/80"></div>
              </div>
              {/* Fake UI */}
              <div className="flex gap-4">
                {/* Sidebar */}
                <div className="w-1/4 hidden md:flex flex-col gap-2">
                  <div className="h-8 bg-tertiary rounded w-full"></div>
                  <div className="h-8 bg-tertiary rounded w-3/4"></div>
                  <div className="h-8 bg-tertiary rounded w-5/6"></div>
                </div>
                {/* Main */}
                <div className="flex-1 flex flex-col gap-4">
                  <div className="flex gap-4">
                    <div className="flex-1 h-24 bg-brand-500/20 border border-brand-500/30 rounded-lg"></div>
                    <div className="flex-1 h-24 bg-tertiary rounded-lg"></div>
                    <div className="flex-1 h-24 bg-tertiary rounded-lg"></div>
                  </div>
                  <div className="h-48 bg-tertiary rounded-lg w-full"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES BENTO GRID */}
        <section id="features" className="container mx-auto px-6 mb-32 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Everything you need to scale</h2>
            <p className="text-secondary max-w-2xl mx-auto">Built specifically for the realities of modern business. No internet? No problem. Complex industry? We handle it.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 - Large */}
            <div className="md:col-span-2 glass p-8 rounded-2xl border border-tertiary hover:border-brand-500/50 transition-colors group">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-2xl font-bold mb-2">Lightning Fast Offline POS</h3>
              <p className="text-secondary mb-6 max-w-md">Our Point of Sale terminal works flawlessly without an internet connection. Queue transactions locally and sync automatically when you're back online.</p>
              <div className="h-40 bg-tertiary rounded-lg border border-white/5 overflow-hidden group-hover:scale-[1.02] transition-transform">
                {/* Abstract POS visual */}
                <div className="flex h-full p-4 gap-4">
                  <div className="flex-1 grid grid-cols-2 gap-2">
                    <div className="bg-brand-500/20 rounded"></div>
                    <div className="bg-brand-500/20 rounded"></div>
                    <div className="bg-brand-500/20 rounded"></div>
                    <div className="bg-brand-500/20 rounded"></div>
                  </div>
                  <div className="w-1/3 bg-primary rounded border border-tertiary flex flex-col justify-end p-2">
                    <div className="h-8 bg-brand-600 rounded w-full mt-auto"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 2 - Small */}
            <div className="glass p-8 rounded-2xl border border-tertiary hover:border-brand-500/50 transition-colors">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold mb-2">Live Analytics</h3>
              <p className="text-secondary">Track revenue, expenses, and top-selling products in real-time from an intuitive dashboard.</p>
            </div>

            {/* Feature 3 - Small */}
            <div className="glass p-8 rounded-2xl border border-tertiary hover:border-brand-500/50 transition-colors">
              <div className="text-4xl mb-4">✂️</div>
              <h3 className="text-xl font-bold mb-2">Industry Verticals</h3>
              <p className="text-secondary">Are you a Tailor? A Salon? Turn on industry-specific modules to track measurements, appointments, and more.</p>
            </div>

            {/* Feature 4 - Large */}
            <div className="md:col-span-2 glass p-8 rounded-2xl border border-tertiary hover:border-brand-500/50 transition-colors">
              <div className="text-4xl mb-4">🏦</div>
              <h3 className="text-2xl font-bold mb-2">Multi-Branch Management</h3>
              <p className="text-secondary">Manage multiple physical store locations from one single account. Filter inventory and sales by specific branches instantly.</p>
            </div>
          </div>
        </section>

        {/* BOTTOM CTA */}
        <section className="container mx-auto px-6 relative z-10">
          <div className="glass rounded-3xl p-12 md:p-20 border border-brand-500/30 bg-brand-500/5 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-brand-900/20"></div>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to upgrade your business?</h2>
              <p className="text-xl text-secondary mb-10 max-w-2xl mx-auto">
                Join the hundreds of African SMBs using our portal to organize their operations, save time, and increase profits.
              </p>
              <Link href="/signup" className="btn btn-primary text-xl px-10 py-5 shadow-xl shadow-brand-500/30 hover:scale-105 transition-transform inline-block">
                Create your free account
              </Link>
            </div>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-tertiary bg-primary relative z-10">
        <div className="container mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="font-bold text-xl tracking-tighter">
            <span className="text-white">SMB</span>
            <span className="gradient-text">Portal</span>
          </div>
          <p className="text-secondary text-sm">© {new Date().getFullYear()} SMB Portal. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-secondary">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
