import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

const AuthContext = createContext();
const API_BASE_URL = import.meta.env.VITE_API_URL || '';
const TOKEN_KEY = 'kito_token';

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // validate token on mount

  // On mount: validate saved token against /api/auth/me
  useEffect(() => {
    const validateSession = async () => {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          setIsAuthenticated(true);
        } else {
          // Token invalid/expired — clear it
          localStorage.removeItem(TOKEN_KEY);
        }
      } catch {
        localStorage.removeItem(TOKEN_KEY);
      } finally {
        setIsLoading(false);
      }
    };
    validateSession();
  }, []);

  /**
   * Login with email + password.
   * Returns { success: true } or { success: false, error: string }
   */
  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Login gagal.' };
      }
      localStorage.setItem(TOKEN_KEY, data.token);
      setUser(data.user);
      setIsAuthenticated(true);
      return { success: true };
    } catch {
      return { success: false, error: 'Tidak dapat terhubung ke server.' };
    }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setIsAuthenticated(false);
    setUser(null);
  };

  /**
   * Update local user profile (name, photo, etc.)
   * Optionally persists to backend if an update endpoint exists.
   */
  const updateProfile = (updates) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  /**
   * Get the current auth token for API calls
   */
  const getToken = useCallback(() => {
    return localStorage.getItem(TOKEN_KEY);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, updateProfile, getToken, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
