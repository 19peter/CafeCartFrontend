import { createContext, useContext, useState, type ReactNode } from 'react';
import { useRoleAuth } from '../hooks/useRoleAuth';
import {
    loginCustomer as authLoginCustomer,
    registerCustomer as authRegisterCustomer,
    isAuthenticated as authIsAuthenticated,
    getAuthToken,
    setAuthToken,
    forgotPassword as authForgotPassword,
    resetPassword as authResetPassword,
} from '../services/authService';
import type { RegisterCustomerPayload } from '../services/authService';

interface CustomerAuthContextType {
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    register: (payload: RegisterCustomerPayload) => Promise<boolean>;
    forgotPassword: (email: string) => Promise<boolean>;
    resetPassword: (token: string, password: string) => Promise<boolean>;
    logout: () => void;
    loading: boolean;
    error: string | null;
    token: string | null;
    openAuthModal: boolean;
    setOpenAuthModal: (open: boolean) => void;
}

const CustomerAuthContext = createContext<CustomerAuthContextType | null>(null);

export const CustomerAuthProvider = ({ children }: { children: ReactNode }) => {
    const [openAuthModal, setOpenAuthModal] = useState<boolean>(false);

    const {
        token,
        isAuthenticated,
        loading,
        error,
        login,
        register,
        logout: originalLogout
    } = useRoleAuth({
        loginApi: authLoginCustomer,
        registerApi: authRegisterCustomer,
        checkAuthApi: authIsAuthenticated,
        getStoredToken: getAuthToken,
        setStoredToken: setAuthToken,
        removeStoredToken: () => setAuthToken(''), // Helper in authService handles empty string as remove
    });

    const logout = () => originalLogout(true);

    const forgotPassword = async (email: string) => {
        try {
            await authForgotPassword(email);
            return true;
        } catch { return false; }
    };

    const resetPassword = async (token: string, password: string) => {
        try {
            await authResetPassword(token, password);
            return true;
        } catch { return false; }
    };

    return (
        <CustomerAuthContext.Provider
            value={{
                isAuthenticated,
                token,
                login,
                register,
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
        </CustomerAuthContext.Provider>
    );
};

export const useCustomerAuth = () => {
    const context = useContext(CustomerAuthContext);
    if (!context) {
        throw new Error('useCustomerAuth must be used within a CustomerAuthProvider');
    }
    return context;
};
