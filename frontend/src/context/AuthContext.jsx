import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const TOKEN_KEY = 'basketly-token-v1';
const USER_KEY = 'basketly-user-v1';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || null);
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem(USER_KEY) || 'null'); } catch { return null; }
  });
  const [loading, setLoading] = useState(true);

  const persist = useCallback((tok, usr) => {
    if (tok) { localStorage.setItem(TOKEN_KEY, tok); setToken(tok); }
    if (usr) { localStorage.setItem(USER_KEY, JSON.stringify(usr)); setUser(usr); }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  }, []);

  // Validate token on load
  useEffect(() => {
    let active = true;
    async function verify() {
      if (!token) { setLoading(false); return; }
      try {
        const { data } = await axios.get(`${API}/auth/me`, { headers: { Authorization: `Bearer ${token}` } });
        if (active && data?.user) { setUser(data.user); localStorage.setItem(USER_KEY, JSON.stringify(data.user)); }
      } catch (e) {
        if (active) { logout(); }
      } finally {
        if (active) setLoading(false);
      }
    }
    verify();
    return () => { active = false; };
  }, []);

  const signup = useCallback(async ({ name, email, password }) => {
    const { data } = await axios.post(`${API}/auth/signup`, { name, email, password });
    persist(data.token, data.user);
    return data.user;
  }, [persist]);

  const login = useCallback(async ({ email, password }) => {
    const { data } = await axios.post(`${API}/auth/login`, { email, password });
    persist(data.token, data.user);
    return data.user;
  }, [persist]);

  const value = {
    user,
    token,
    loading,
    isAuthed: !!user && !!token,
    signup,
    login,
    logout,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
