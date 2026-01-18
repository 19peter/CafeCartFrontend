import { createContext, useContext, type ReactNode } from 'react';
import { useRoleAuth } from '../hooks/useRoleAuth';
import {
    loginAdmin as authLoginAdmin,
    // isAuthenticated as authIsAuthenticated, // REVISIT: Admin likely needs its own isAuth check or uses shared logic
    isAuthenticated, // Using shared for now, or need specific admin check
    getAdminToken,
    setAdminToken,
    forgotPassword as authForgotPassword,
    resetPassword as authResetPassword,
} from '../services/authService';

interface AdminAuthContextType {
    isAdminAuthenticated: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    forgotPassword: (email: string) => Promise<boolean>;
    resetPassword: (token: string, password: string) => Promise<boolean>;
    logout: () => void;
    loading: boolean;
    error: string | null;
    adminToken: string | null;
}

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
    const {
        token: adminToken,
        isAuthenticated: isAdminAuthenticated,
        loading,
        error,
        login,
        logout: originalLogout
    } = useRoleAuth({
        loginApi: authLoginAdmin,
        checkAuthApi: isAuthenticated,
        getStoredToken: getAdminToken,
        setStoredToken: setAdminToken,
        removeStoredToken: () => setAdminToken(''),
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
        <AdminAuthContext.Provider
            value={{
                isAdminAuthenticated,
                adminToken,
                login,
                forgotPassword,
                resetPassword,
                logout,
                loading,
                error,
            }}
        >
            {children}
        </AdminAuthContext.Provider>
    );
};

export const useAdminAuth = () => {
    const context = useContext(AdminAuthContext);
    if (!context) {
        throw new Error('useAdminAuth must be used within a AdminAuthProvider');
    }
    return context;
};
