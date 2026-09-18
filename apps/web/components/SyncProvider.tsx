"use client";
import { useEffect, useState } from 'react';
import { getSyncQueue, clearSyncQueue } from '../lib/db';

export function SyncProvider({ children }: { children: React.ReactNode }) {
  const [isOnline, setIsOnline] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      syncData();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial sync check on mount if online
    if (navigator.onLine) {
      syncData();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const syncData = async () => {
    if (isSyncing) return;
    setIsSyncing(true);

    try {
      const queue = await getSyncQueue();
      if (queue.length === 0) {
        setIsSyncing(false);
        return;
      }

      const customers = queue.filter(q => q.type === 'customer').map(q => q.payload);
      const transactions = queue.filter(q => q.type === 'transaction').map(q => q.payload);

      const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
      if (!token) {
        setIsSyncing(false);
        return; // Not authenticated
      }

      const res = await fetch('/api/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ customers, transactions })
      });

      if (res.ok) {
        // Clear successfully synced items from IndexedDB
        const syncedIds = queue.map(q => q.id);
        await clearSyncQueue(syncedIds);
        console.log("Offline data synced successfully!");
      }
    } catch (err) {
      console.error("Failed to sync offline data", err);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <>
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 bg-danger-500 text-white text-center py-1 text-sm z-50 animate-fade-in">
          You are currently offline. Changes will be saved locally and synced when you reconnect.
        </div>
      )}
      {children}
    </>
  );
}
