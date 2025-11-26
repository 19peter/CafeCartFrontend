import { createContext, useContext, useState, type ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginCustomer, logout as authLogout } from '../services/authService';
import { registerCustomer } from '../services/registerService';
import type { RegisterCustomerPayload } from '../services/registerService';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (payload: RegisterCustomerPayload) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  error: string | null;
  token: string | null;
  refreshToken: string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [refreshToken, setRefreshToken] = useState<string | null>(() => localStorage.getItem('refreshToken'));
  const navigate = useNavigate();


  const login = async (email: string, _password: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await loginCustomer(email, _password);
      const access = res?.token ?? res?.accessToken ?? res?.jwt ?? null;
      const refresh = res?.refreshToken ?? res?.refresh_token ?? null;
      if (!access) throw new Error('Missing token in response');
      setToken(access);
      if (refresh) setRefreshToken(refresh);
      localStorage.setItem('token', access);
      if (refresh) localStorage.setItem('refreshToken', refresh); else localStorage.removeItem('refreshToken');
      return true;
    } catch (err: any) {
      setError(err?.message || 'Failed to login. Please check your credentials.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload: RegisterCustomerPayload) => {
    setLoading(true);
    setError(null);
    try {
      await registerCustomer(payload);

      return true;
    } catch (err: any) {
      setError(err?.message || 'Registration failed. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    try {
      authLogout();
    } finally {
      setToken(null);
      setRefreshToken(null);
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      navigate('/login');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!token,
        token,
        refreshToken,
        login,
        register,
        logout,
        loading,
        error
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  let context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
