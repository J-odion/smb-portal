import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={`flex flex-col items-center justify-center ${styles.main}`}>
      <div className={`glass p-8 container animate-fade-in ${styles.hero}`}>
        <h1 className="h1 gradient-text mb-4">SMB Portal</h1>
        <p className="text-lg text-secondary mb-8">
          Manage your customers, transactions, invoicing, staff, and expenses all in one place.
        </p>
        
        <div className="flex gap-4">
          <Link href="/login" className="btn btn-primary">
            Sign In
          </Link>
          <Link href="/signup" className="btn btn-secondary">
            Create Account
          </Link>
        </div>
      </div>
      
      {/* Decorative background elements */}
      <div className={styles.blob1}></div>
      <div className={styles.blob2}></div>
    </main>
  );
}
