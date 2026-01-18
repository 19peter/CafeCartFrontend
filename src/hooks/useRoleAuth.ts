import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from './useNotification';

interface UseRoleAuthOptions {
    loginApi: (email: string, password: string) => Promise<any>;
    registerApi?: (payload: any) => Promise<any>;
    checkAuthApi: () => Promise<{ valid: boolean; accessToken: string | null }>;
    getStoredToken: () => string | null;
    setStoredToken: (token: string) => void;
    removeStoredToken: () => void;
    loginRoute?: string;
    defaultRoute?: string;
}

export const useRoleAuth = (options: UseRoleAuthOptions) => {
    const {
        loginApi,
        registerApi,
        checkAuthApi,
        getStoredToken,
        setStoredToken,
        removeStoredToken,
        loginRoute = '/login',
        defaultRoute = '/'
    } = options;

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [token, setTokenState] = useState<string | null>(getStoredToken());
    const navigate = useNavigate();
    // We can optionally use notification hook here if available, or just return error string
    // const { showError } = useNotification(); 

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const currentToken = getStoredToken();
        if (!currentToken) {
            setLoading(false);
            return;
        }

        try {
            const { valid, accessToken } = await checkAuthApi();
            if (!valid) {
                logout(false);
            } else if (accessToken) {
                setTokenState(accessToken);
                // Ensure strictly only this token is set if needed, but we typically just set ours
                setStoredToken(accessToken);
            }
        } catch (err) {
            logout(false);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        setLoading(true);
        setError(null);
        try {
            const res = await loginApi(email, password);
            // Handle different response structures if necessary
            const access = res?.token ?? res?.accessToken ?? res?.jwt ?? null;

            if (!access) throw new Error('Missing token in response');

            setTokenState(access);
            setStoredToken(access);
            return true;
        } catch (err: any) {
            const msg = err?.message || 'Failed to login. Please check your credentials.';
            setError(msg);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const register = async (payload: any) => {
        if (!registerApi) {
            throw new Error("Registration not supported for this role");
        }
        setLoading(true);
        setError(null);
        try {
            await registerApi(payload);
            return true;
        } catch (err: any) {
            const msg = err?.message || 'Registration failed. Please try again.';
            setError(msg);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const logout = (redirect = true) => {
        removeStoredToken();
        setTokenState(null);
        // Explicitly navigate to login if requested
        if (redirect) {
            navigate(loginRoute);
        }
    };

    const resetError = () => setError(null);

    return {
        isAuthenticated: !!token,
        token, // Role specific token
        loading,
        error,
        login,
        register,
        logout,
        resetError,
        // Expose helpers if needed
        setToken: setTokenState
    };
};
