import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styles from './Auth.module.css';

export const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { loginCustomer, loginShop, loginVendor, loginAdmin, loading, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const hostname = window.location.hostname;


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let res;
    if (hostname.includes("shop")) {
      res = await loginShop(email, password);
    } else if (hostname.includes("vendor")) {
      res = await loginVendor(email, password);
    } else if (hostname.includes("admin")) {
      res = await loginAdmin(email, password);
    } else {
      res = await loginCustomer(email, password);
    }

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
