import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import styles from './Auth.module.css';

interface SignInProps {
  login: (email: string, password: string) => Promise<boolean>;
  loading: boolean;
  error: string | null;
}

export const SignIn = ({ login, loading, error }: SignInProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await login(email, password);

    if (res) {
      const from = location.state?.from ?? "/";
      navigate(from, { state: location?.state });
    }

  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <h2>Welcome Back</h2>
        <p className={styles.subtitle}>Sign in to continue to CafeCart</p>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.authForm}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
              <Link to="/forgot-password" className={styles.authLink} style={{ fontSize: '0.85rem' }}>
                Forgot Password?
              </Link>
            </div>
          </div>

          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className={styles.authFooter}>
          Don't have an account?{' '}
          <Link to="/register" className={styles.authLink}>
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
