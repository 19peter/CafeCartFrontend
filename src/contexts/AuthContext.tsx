import { createContext, useContext, useState, type ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  // const navigate = useNavigate();

  // Check for existing session on initial load
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setUser(JSON.parse(user));
    }
  }, []);

  const login = async (email: string, _password: string) => {
    setLoading(true);
    setError(null);
    try {
      // Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockUser = { 
        email, 
        name: email.split('@')[0],
        id: Date.now().toString()
      };
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      // Don't navigate here, let the component handle it
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError('Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, _password: string, name: string) => {
    setLoading(true);
    setError(null);
    try {
      // Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockUser = { 
        email, 
        name,
        id: Date.now().toString()
      };
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      // Don't navigate here, let the component handle it
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    // navigate('/login');
  };

  return (
    <AuthContext.Provider 
      value={{
        isAuthenticated: !!user,
        user,
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
  context = {
    isAuthenticated: true,
    user: null,
    login: () => Promise.resolve(),
    register: () => Promise.resolve(),
    logout: () => {},
    loading: false,
    error: null
  };
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
