import { createContext, useContext, type ReactNode } from 'react';
import { useRoleAuth } from '../hooks/useRoleAuth';
import {
    loginVendor as authLoginVendor,
    isVendorAuthenticated as authIsVendorAuthenticated,
    getVendorToken,
    setVendorToken,
    forgotPassword as authForgotPassword,
    resetPassword as authResetPassword,
} from '../services/authService';

interface VendorAuthContextType {
    isVendorAuthenticated: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    forgotPassword: (email: string) => Promise<boolean>;
    resetPassword: (token: string, password: string) => Promise<boolean>;
    logout: () => void;
    loading: boolean;
    error: string | null;
    vendorToken: string | null;
}

const VendorAuthContext = createContext<VendorAuthContextType | null>(null);

export const VendorAuthProvider = ({ children }: { children: ReactNode }) => {
    const {
        token: vendorToken,
        isAuthenticated: isVendorAuthenticated,
        loading,
        error,
        login,
        logout: originalLogout
    } = useRoleAuth({
        loginApi: authLoginVendor,
        checkAuthApi: authIsVendorAuthenticated,
        getStoredToken: getVendorToken,
        setStoredToken: setVendorToken,
        removeStoredToken: () => setVendorToken(''),
        loginRoute: '/login',
    });

    const logout = () => originalLogout(true);

    const forgotPassword = async (email: string) => {
        try { await authForgotPassword(email); return true; } catch { return false; }
    };

    const resetPassword = async (token: string, password: string) => {
        try { await authResetPassword(token, password); return true; } catch { return false; }
    };

    return (
        <VendorAuthContext.Provider
            value={{
                isVendorAuthenticated,
                vendorToken,
                login,
                forgotPassword,
                resetPassword,
                logout,
                loading,
                error,
            }}
        >
            {children}
        </VendorAuthContext.Provider>
    );
};

export const useVendorAuth = () => {
    const context = useContext(VendorAuthContext);
    if (!context) {
        throw new Error('useVendorAuth must be used within a VendorAuthProvider');
    }
    return context;
};
