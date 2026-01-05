import { createContext, useContext, useState, type ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  loginCustomer as authLoginCustomer,
  loginVendor as authLoginVendor,
  logout as authLogout,
  registerCustomer as authRegisterCustomer,
  isAuthenticated as authIsAuthenticated,
  isShopAuthenticated as authIsShopAuthenticated,
  isVendorAuthenticated as authIsVendorAuthenticated,
  getAuthToken,
  getShopToken,
  getVendorToken,
  loginVendorShop as authLoginVendorShop,
  loginAdmin as authLoginAdmin,
  forgotPassword as authForgotPassword,
  resetPassword as authResetPassword,
} from '../services/authService';
import type { RegisterCustomerPayload } from '../services/authService';

interface AuthContextType {
  isAuthenticated: boolean;
  isShopAuthenticated: boolean;
  isVendorAuthenticated: boolean;
  loginCustomer: (email: string, password: string) => Promise<boolean>;
  registerCustomer: (payload: RegisterCustomerPayload) => Promise<boolean>;
  loginShop: (email: string, password: string) => Promise<boolean>;
  loginVendor: (email: string, password: string) => Promise<boolean>;
  loginAdmin: (email: string, password: string) => Promise<boolean>;
  forgotPassword: (email: string) => Promise<boolean>;
  resetPassword: (token: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  error: string | null;
  token: string | null;
  shopToken: string | null;
  vendorToken: string | null;
  openAuthModal: boolean;
  setOpenAuthModal: (open: boolean) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);


export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(getAuthToken());
  const [shopToken, setShopToken] = useState<string | null>(getShopToken());
  const [vendorToken, setVendorToken] = useState<string | null>(getVendorToken());
  const [openAuthModal, setOpenAuthModal] = useState<boolean>(false);
  const navigate = useNavigate();
  const hostname = window.location.hostname;

  useEffect(() => {
    const initAuth = async () => {
      if (hostname.includes("shop")) {
        await authenticateShop();
        setLoading(false);

      } else if (hostname.includes("vendor")) {
        await authenticateVendor();
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

  const authenticateVendor = async () => {
    if (!vendorToken) {
      setLoading(false);
      return;
    }

    const { valid, accessToken } = await authIsVendorAuthenticated();
    if (!valid) {
      logout();
      return;
    }
    setVendorToken(accessToken);
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

  const loginVendor = async (email: string, _password: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await authLoginVendor(email, _password);
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

  const loginAdmin = async (email: string, _password: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await authLoginAdmin(email, _password);
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

  const forgotPassword = async (email: string) => {
    setLoading(true);
    setError(null);
    try {
      await authForgotPassword(email);
      return true;
    } catch (err: any) {
      setError(err?.message || 'Failed to send reset email. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (token: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      await authResetPassword(token, password);
      return true;
    } catch (err: any) {
      setError(err?.message || 'Failed to reset password. Link might be expired.');
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
        isVendorAuthenticated: !!vendorToken,
        token,
        shopToken,
        vendorToken,
        loginCustomer,
        registerCustomer,
        loginShop,
        loginVendor,
        loginAdmin,
        forgotPassword,
        resetPassword,
        logout,
        loading,
        error,
        openAuthModal,
        setOpenAuthModal
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
