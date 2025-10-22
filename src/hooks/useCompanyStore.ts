// src/hooks/useCompanyStore.ts
import { useState, useEffect, useCallback } from 'react';

export interface Company {
  id: string;
  name: string;
  default_currency: string;
  invoice_prefix: string;
  invoice_next_number: number;
  address?: string;
  tax_id?: string;
  logo_url?: string; // Can store a base64 Data URL
}

const STORAGE_KEY = 'invoice_company_settings';

// Default settings if none are found in local storage
const DEFAULT_COMPANY: Company = {
  id: 'default-company-01',
  name: 'My Company',
  default_currency: 'USD',
  invoice_prefix: 'INV',
  invoice_next_number: 1,
};

export function useCompanyStore() {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedSettings = localStorage.getItem(STORAGE_KEY);
      if (storedSettings) {
        setCompany(JSON.parse(storedSettings));
      } else {
        // If no settings exist, initialize with defaults
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_COMPANY));
        setCompany(DEFAULT_COMPANY);
      }
    } catch (error) {
      console.error("Failed to load company settings:", error);
      setCompany(DEFAULT_COMPANY); // Fallback to defaults on error
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCompany = useCallback(async (updatedCompany: Company) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCompany));
      setCompany(updatedCompany);
    } catch (error) {
      console.error("Failed to update company settings:", error);
    }
  }, []);

  return { company, loading, updateCompany };
}