import { createContext, useContext, useEffect, useState } from 'react';
import * as authService from '../services/authService';

const AuthContext = createContext(null);
const TOKEN_KEY = 'engilearn_token';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true while we check for an existing session

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setLoading(false);
      return;
    }
    authService.getMe().then((result) => {
      if (result.success) {
        setUser(result.user);
      } else {
        localStorage.removeItem(TOKEN_KEY);
      }
      setLoading(false);
    });
  }, []);

  async function login(credentials) {
    const result = await authService.login(credentials);
    if (result.success) {
      localStorage.setItem(TOKEN_KEY, result.token);
      setUser(result.user);
    }
    return result;
  }

  async function register(details) {
    const result = await authService.register(details);
    if (result.success) {
      localStorage.setItem(TOKEN_KEY, result.token);
      setUser(result.user);
    }
    return result;
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }

  function updateUser(updatedUser) {
    setUser(updatedUser);
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, isAuthenticated: !!user, login, register, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
