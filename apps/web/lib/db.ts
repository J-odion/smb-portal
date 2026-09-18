import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface SMBPortalDB extends DBSchema {
  syncQueue: {
    key: string;
    value: {
      id: string;
      type: 'customer' | 'transaction';
      payload: any;
      timestamp: number;
    };
    indexes: { 'by-timestamp': number };
  };
}

let dbPromise: Promise<IDBPDatabase<SMBPortalDB>> | null = null;

export const getDB = () => {
  if (typeof window === 'undefined') return null;
  if (!dbPromise) {
    dbPromise = openDB<SMBPortalDB>('smb-portal-db', 1, {
      upgrade(db) {
        const store = db.createObjectStore('syncQueue', {
          keyPath: 'id',
        });
        store.createIndex('by-timestamp', 'timestamp');
      },
    });
  }
  return dbPromise;
};

export const addToSyncQueue = async (type: 'customer' | 'transaction', payload: any) => {
  const db = await getDB();
  if (!db) return;
  
  const id = payload.id || crypto.randomUUID();
  await db.put('syncQueue', {
    id,
    type,
    payload: { ...payload, id },
    timestamp: Date.now(),
  });
  return id;
};

export const getSyncQueue = async () => {
  const db = await getDB();
  if (!db) return [];
  return db.getAllFromIndex('syncQueue', 'by-timestamp');
};

export const clearSyncQueue = async (ids: string[]) => {
  const db = await getDB();
  if (!db) return;
  const tx = db.transaction('syncQueue', 'readwrite');
  await Promise.all(ids.map(id => tx.store.delete(id)));
  await tx.done;
};
