import React, { createContext, useContext, useEffect, useState } from 'react';
import { Tenant } from '../types.ts';
import { fetchTenantContext } from '../services/api.ts';

interface TenantContextType {
  tenant: Tenant | null;
  loading: boolean;
}

const TenantContext = createContext<TenantContextType>({ tenant: null, loading: true });

export const useTenant = () => useContext(TenantContext);

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, we might get the tenant ID from the subdomain or a query param
    fetchTenantContext().then(data => {
      setTenant(data);
      setLoading(false);
    });
  }, []);

  return (
    <TenantContext.Provider value={{ tenant, loading }}>
      {children}
    </TenantContext.Provider>
  );
};