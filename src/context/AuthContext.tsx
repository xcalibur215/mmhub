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
  /** Returns { ok, user } so callers can route based on role immediately */
  login: (email: string, password: string) => Promise<{ ok: boolean; user?: UserInfo }>;
  logout: () => void;
  isAdmin: boolean;
  /** Force an immediate access token refresh (primarily for debugging) */
  refreshNow: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8081/api/v1';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const refreshTimerRef = React.useRef<number | null>(null);

  // Decode a JWT (no verification) safely
  const decodeJwt = (token: string): any | null => {
    try {
      const payload = token.split('.')[1];
      const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(json);
    } catch {
      return null;
    }
  };

  const clearRefreshTimer = () => {
    if (refreshTimerRef.current) {
      window.clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
  };

  const scheduleRefresh = useCallback((token: string, fallbackDelayMs = 5 * 60 * 1000) => {
    clearRefreshTimer();
    const decoded = decodeJwt(token);
    if (!decoded || !decoded.exp) {
      // schedule a conservative refresh in fallbackDelayMs
      refreshTimerRef.current = window.setTimeout(() => {
        void refreshAccessToken();
      }, fallbackDelayMs);
      return;
    }
    const expMs = decoded.exp * 1000; // exp is seconds since epoch
    const now = Date.now();
    // Refresh 60s before expiry (minimum 10s)
    const refreshIn = Math.max(expMs - now - 60_000, 10_000);
    refreshTimerRef.current = window.setTimeout(() => {
      void refreshAccessToken();
    }, refreshIn);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshToken]);

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

  const refreshAccessToken = useCallback(async (): Promise<boolean> => {
    if (!refreshToken) return false;
    try {
      const res = await fetch(`${API_BASE}/auth/refresh?refresh_token=${encodeURIComponent(refreshToken)}`, {
        method: 'POST'
      });
      if (!res.ok) return false;
      const data = await res.json();
      if (data.access_token) {
        localStorage.setItem('mmhub_access', data.access_token);
        setAccessToken(data.access_token);
        scheduleRefresh(data.access_token);
        // Try updating profile silently (ignore failures)
        void fetchProfile(data.access_token);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, [refreshToken, fetchProfile, scheduleRefresh]);

  useEffect(() => {
    // Load stored tokens
    const storedAccess = localStorage.getItem('mmhub_access');
    const storedRefresh = localStorage.getItem('mmhub_refresh');
    if (storedRefresh) setRefreshToken(storedRefresh);
    if (storedAccess) {
      setAccessToken(storedAccess);
      void fetchProfile(storedAccess);
      scheduleRefresh(storedAccess);
    } else if (storedRefresh) {
      // Attempt to get a fresh access token right away
      void refreshAccessToken();
    }
    return () => clearRefreshTimer();
  }, [fetchProfile, refreshAccessToken, scheduleRefresh]);

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
      if (!res.ok) return { ok: false };
      const data = await res.json();
      if (data.access_token) {
        localStorage.setItem('mmhub_access', data.access_token);
        if (data.refresh_token) {
          localStorage.setItem('mmhub_refresh', data.refresh_token);
          setRefreshToken(data.refresh_token);
        }
        setAccessToken(data.access_token);
        // Optimistically set user from login payload (has role) for immediate routing
        if (data.user) {
          const u: UserInfo = {
            id: data.user.id,
            email: data.user.email,
            username: data.user.username,
            role: data.user.role,
            first_name: data.user.first_name,
            last_name: data.user.last_name,
          };
          setUser(u);
        }
        // Fetch full profile to ensure freshness; ignore failure
        await fetchProfile(data.access_token);
        scheduleRefresh(data.access_token);
        return { ok: true, user: data.user };
      }
      return { ok: false };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    clearRefreshTimer();
    localStorage.removeItem('mmhub_access');
    localStorage.removeItem('mmhub_refresh');
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
  };

  const value: AuthContextValue = {
    user,
    accessToken,
    isLoading,
    login,
    logout,
    isAdmin: !!user && user.role === 'admin',
    refreshNow: refreshAccessToken
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
