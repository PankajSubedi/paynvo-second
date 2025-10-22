// src/hooks/useClientStore.ts
import { useState, useEffect, useCallback } from 'react';
import { openDB, IDBPDatabase } from 'idb';

export interface Client {
  id?: number;
  name: string;
  email: string;
  phone?: string;
  billing_address?: string;
  tax_id?: string;
  created_at: string;
}

const DB_NAME = 'InvoiceAppDB';
const STORE_NAME = 'clients';
const DB_VERSION = 2; // Use version 2 to ensure all tables are created

async function initDB(): Promise<IDBPDatabase> {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('invoices')) {
        db.createObjectStore('invoices', { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    },
  });
}

export function useClientStore() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshClients = useCallback(async () => {
    setLoading(true);
    try {
      const db = await initDB();
      const allClients = await db.getAll(STORE_NAME);
      allClients.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setClients(allClients || []);
    } catch (error) {
      console.error("Failed to load clients from IndexedDB:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshClients();
  }, [refreshClients]);

  const addClient = async (client: Omit<Client, 'id' | 'created_at'>) => {
    const db = await initDB();
    const newClient = { ...client, created_at: new Date().toISOString() };
    await db.add(STORE_NAME, newClient);
    await refreshClients();
  };

  const updateClient = async (client: Client) => {
    const db = await initDB();
    await db.put(STORE_NAME, client);
    await refreshClients();
  };

  const deleteClient = async (id: number) => {
    const db = await initDB();
    await db.delete(STORE_NAME, id);
    await refreshClients();
  };

  return { clients, loading, addClient, updateClient, deleteClient };
}