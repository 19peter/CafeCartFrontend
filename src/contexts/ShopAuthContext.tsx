import { createContext, useContext, type ReactNode } from 'react';
import { useRoleAuth } from '../hooks/useRoleAuth';
import {
    loginVendorShop as authLoginVendorShop,
    isShopAuthenticated as authIsShopAuthenticated,
    getShopToken,
    setShopToken,
    forgotPassword as authForgotPassword,
    resetPassword as authResetPassword,
} from '../services/authService';

interface ShopAuthContextType {
    isShopAuthenticated: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    forgotPassword: (email: string) => Promise<boolean>;
    resetPassword: (token: string, password: string) => Promise<boolean>;
    logout: () => void;
    loading: boolean;
    error: string | null;
    shopToken: string | null;
}

const ShopAuthContext = createContext<ShopAuthContextType | null>(null);

export const ShopAuthProvider = ({ children }: { children: ReactNode }) => {
    const {
        token: shopToken,
        isAuthenticated: isShopAuthenticated,
        loading,
        error,
        login,
        logout: originalLogout
    } = useRoleAuth({
        loginApi: authLoginVendorShop,
        checkAuthApi: authIsShopAuthenticated,
        getStoredToken: getShopToken,
        setStoredToken: setShopToken,
        removeStoredToken: () => setShopToken(''),
        loginRoute: '/login', // Adjust if shop has different login route
    });

    const logout = () => originalLogout(true);

    const forgotPassword = async (email: string) => {
        try { await authForgotPassword(email); return true; } catch { return false; }
    };

    const resetPassword = async (token: string, password: string) => {
        try { await authResetPassword(token, password); return true; } catch { return false; }
    };

    return (
        <ShopAuthContext.Provider
            value={{
                isShopAuthenticated,
                shopToken,
                login,
                forgotPassword,
                resetPassword,
                logout,
                loading,
                error,
            }}
        >
            {children}
        </ShopAuthContext.Provider>
    );
};

export const useShopAuth = () => {
    const context = useContext(ShopAuthContext);
    if (!context) {
        throw new Error('useShopAuth must be used within a ShopAuthProvider');
    }
    return context;
};
