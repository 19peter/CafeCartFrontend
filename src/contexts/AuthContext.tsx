import { createContext, useContext, useState, type ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  loginCustomer as authLoginCustomer,
  logout as authLogout,
  registerCustomer as authRegisterCustomer,
  isAuthenticated as authIsAuthenticated,
  isShopAuthenticated as authIsShopAuthenticated,
  getAuthToken,
  getShopToken,
  loginVendorShop as authLoginVendorShop,
} from '../services/authService';
import type { RegisterCustomerPayload } from '../services/authService';

interface AuthContextType {
  isAuthenticated: boolean;
  isShopAuthenticated: boolean;
  loginCustomer: (email: string, password: string) => Promise<boolean>;
  registerCustomer: (payload: RegisterCustomerPayload) => Promise<boolean>;
  loginShop: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  error: string | null;
  token: string | null;
  shopToken: string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);


export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(getAuthToken());
  const [shopToken, setShopToken] = useState<string | null>(getShopToken());
  const navigate = useNavigate();
  const hostname = window.location.hostname;

  useEffect(() => {
    const initAuth = async () => {
      if (hostname.includes("shop")) {
        await authenticateShop();
        setLoading(false);

      } else {
        await authenticateCustomer();
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const authenticateShop = async () => {
    if (!shopToken) {
      setLoading(false);
      return;
    }

    const { valid, accessToken } = await authIsShopAuthenticated();
    if (!valid) {
      logout();
      return;
    }
    setShopToken(accessToken);
    setLoading(false);
  };

  const authenticateCustomer = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    const { valid, accessToken } = await authIsAuthenticated();
    if (!valid) {
      logout();
      return;
    }
    setToken(accessToken);
    setLoading(false);
  };

  const loginCustomer = async (email: string, _password: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await authLoginCustomer(email, _password);
      const access = res?.token ?? res?.accessToken ?? res?.jwt ?? null;
      if (!access) throw new Error('Missing token in response');
      setToken(access);
      return true;
    } catch (err: any) {
      setError(err?.message || 'Failed to login. Please check your credentials.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const registerCustomer = async (payload: RegisterCustomerPayload) => {
    setLoading(true);
    setError(null);
    try {
      await authRegisterCustomer(payload);

      return true;
    } catch (err: any) {
      setError(err?.message || 'Registration failed. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const loginShop = async (email: string, _password: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await authLoginVendorShop(email, _password);
      const access = res?.token ?? res?.accessToken ?? res?.jwt ?? null;
      if (!access) throw new Error('Missing token in response');
      setToken(access);
      return true;
    } catch (err: any) {
      setError(err?.message || 'Failed to login. Please check your credentials.');
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
      navigate('/login');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!token,
        isShopAuthenticated: !!shopToken,
        token,
        shopToken,
        loginCustomer,
        registerCustomer,
        loginShop,
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
