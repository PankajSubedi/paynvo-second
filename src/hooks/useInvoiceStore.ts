// // src/hooks/useInvoiceStore.ts
// import { useState, useEffect, useCallback } from 'react';
// import { openDB, IDBPDatabase } from 'idb';

// export interface Invoice {
//   id?: number;
//   invoice_number: string;
//   status: 'draft' | 'unpaid' | 'paid' | 'overdue';
//   clients: { name: string; email: string };
//   issue_date: string;
//   due_date: string;
//   items: any[];
//   total: number;
//   currency: string;
//   created_at: string;
//   subtotal: number;
//   discount_total: number;
//   tax_total: number;
//   shipping_fee?: number;
//   custom_fee_name?: string;
//   custom_fee_value?: number;
//   custom_fee_type?: 'fixed' | 'percent';
//   payment_method?: any;
//   notes?: string;
// }

// const DB_NAME = 'InvoiceAppDB';
// const STORE_NAME = 'invoices';
// const DB_VERSION = 2; // Use version 2 to ensure all tables are created

// async function initDB(): Promise<IDBPDatabase> {
//   return openDB(DB_NAME, DB_VERSION, {
//     upgrade(db) {
//       if (!db.objectStoreNames.contains(STORE_NAME)) {
//         db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
//       }
//       if (!db.objectStoreNames.contains('clients')) {
//         db.createObjectStore('clients', { keyPath: 'id', autoIncrement: true });
//       }
//     },
//   });
// }

// export function useInvoiceStore() {
//   const [invoices, setInvoices] = useState<Invoice[]>([]);
//   const [loading, setLoading] = useState(true);

//   const refreshInvoices = useCallback(async () => {
//     setLoading(true);
//     try {
//       const db = await initDB();
//       const allInvoices = await db.getAll(STORE_NAME);
//       allInvoices.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
//       setInvoices(allInvoices);
//     } catch (error) {
//       console.error("Failed to load invoices from IndexedDB:", error);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     refreshInvoices();
//   }, [refreshInvoices]);

//   const addInvoice = async (invoice: Omit<Invoice, 'id'>) => {
//     const db = await initDB();
//     await db.add(STORE_NAME, invoice);
//     await refreshInvoices();
//   };

//   const getInvoiceById = async (id: number) => {
//     const db = await initDB();
//     return db.get(STORE_NAME, id);
//   };
  
//   const updateInvoice = async (invoice: Invoice) => {
//     const db = await initDB();
//     await db.put(STORE_NAME, invoice);
//     await refreshInvoices();
//   };

//   const deleteInvoice = async (id: number) => {
//     const db = await initDB();
//     await db.delete(STORE_NAME, id);
//     // No need to call refreshInvoices here, it will be handled on the page
//   };

//   return { invoices, loading, addInvoice, getInvoiceById, updateInvoice, deleteInvoice };
// }





import { useState, useEffect, useCallback } from 'react';
import { openDB, IDBPDatabase } from 'idb';

export interface Invoice {
  id?: number;
  invoice_number: string;
  status: 'draft' | 'unpaid' | 'paid' | 'overdue';
  clients: { // <-- FIX IS HERE
    name: string;
    email: string;
    billing_address?: string; // Added optional property
    tax_id?: string;          // Added optional property
  };
  issue_date: string;
  due_date: string;
  items: any[];
  total: number;
  currency: string;
  created_at: string;
  subtotal: number;
  discount_total: number;
  tax_total: number;
  shipping_fee?: number;
  custom_fee_name?: string;
  custom_fee_value?: number;
  custom_fee_type?: 'fixed' | 'percent';
  payment_method?: any;
  notes?: string;
}

const DB_NAME = 'InvoiceAppDB';
const STORE_NAME = 'invoices';
const DB_VERSION = 2;

async function initDB(): Promise<IDBPDatabase> {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains('clients')) {
        db.createObjectStore('clients', { keyPath: 'id', autoIncrement: true });
      }
    },
  });
}

export function useInvoiceStore() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshInvoices = useCallback(async () => {
    setLoading(true);
    try {
      const db = await initDB();
      const allInvoices = await db.getAll(STORE_NAME);
      allInvoices.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setInvoices(allInvoices);
    } catch (error) {
      console.error("Failed to load invoices from IndexedDB:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshInvoices();
  }, [refreshInvoices]);

  const addInvoice = async (invoice: Omit<Invoice, 'id'>) => {
    const db = await initDB();
    await db.add(STORE_NAME, invoice);
    await refreshInvoices();
  };

  const getInvoiceById = async (id: number) => {
    const db = await initDB();
    return db.get(STORE_NAME, id);
  };
  
  const updateInvoice = async (invoice: Invoice) => {
    const db = await initDB();
    await db.put(STORE_NAME, invoice);
    await refreshInvoices();
  };

  const deleteInvoice = async (id: number) => {
    const db = await initDB();
    await db.delete(STORE_NAME, id);
  };

  return { invoices, loading, addInvoice, getInvoiceById, updateInvoice, deleteInvoice };
}