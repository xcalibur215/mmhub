import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';

interface UserInfo {
  id: number;
  email: string;
  username: string;
  role: string;
  first_name?: string;
  last_name?: string;
}

interface AuthContextValue {
  user: UserInfo | null;
  accessToken: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8081/api/v1';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchProfile = useCallback(async (token: string) => {
    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) return false;
      const data = await res.json();
      setUser(data);
      return true;
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    // Load stored token
    const stored = localStorage.getItem('mmhub_access');
    if (stored) {
      setAccessToken(stored);
      fetchProfile(stored);
    }
  }, [fetchProfile]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const body = new URLSearchParams();
      body.append('username', email); // FastAPI OAuth2 uses 'username'
      body.append('password', password);
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body
      });
      if (!res.ok) return false;
      const data = await res.json();
      if (data.access_token) {
        localStorage.setItem('mmhub_access', data.access_token);
        setAccessToken(data.access_token);
        await fetchProfile(data.access_token);
        return true;
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('mmhub_access');
    setAccessToken(null);
    setUser(null);
  };

  const value: AuthContextValue = {
    user,
    accessToken,
    isLoading,
    login,
    logout,
    isAdmin: !!user && user.role === 'admin'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
