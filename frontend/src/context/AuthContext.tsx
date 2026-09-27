import React, { createContext, useContext, useState } from 'react';
import { mockUserProfile } from '../data/mockData';

interface AuthContextType {
  isAuthenticated: boolean;
  user: typeof mockUserProfile;
  currentOrg: string;
  login: (email?: string, password?: string) => Promise<boolean>;
  logout: () => void;
  setOrganization: (org: string) => void;
  availableOrgs: string[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('cybertwin_auth') !== 'false';
  });

  const [currentOrg, setCurrentOrg] = useState<string>(() => {
    return localStorage.getItem('cybertwin_org') || 'ABC Bank India';
  });

  const availableOrgs = [
    'ABC Bank India',
    'Global FinTech Ltd.',
    'CyberQuant Enterprise',
    'Capital Wealth Management',
  ];

  const login = async (_email?: string, _password?: string) => {
    setIsAuthenticated(true);
    localStorage.setItem('cybertwin_auth', 'true');
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.setItem('cybertwin_auth', 'false');
  };

  const setOrganization = (org: string) => {
    setCurrentOrg(org);
    localStorage.setItem('cybertwin_org', org);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user: mockUserProfile,
        currentOrg,
        login,
        logout,
        setOrganization,
        availableOrgs,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
