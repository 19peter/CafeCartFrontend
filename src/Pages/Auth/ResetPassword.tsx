import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styles from './Auth.module.css';
import { KeyRound, CheckCircle2, AlertCircle } from 'lucide-react';

export const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [localError, setLocalError] = useState('');
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const { resetPassword, loading, error } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            setLocalError('Invalid or missing reset token.');
        }
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError('');

        if (password !== confirmPassword) {
            setLocalError("Passwords don't match.");
            return;
        }

        if (!token) {
            setLocalError('Missing reset token.');
            return;
        }

        const success = await resetPassword(token, password);
        if (success) {
            setSubmitted(true);
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        }
    };

    if (submitted) {
        return (
            <div className={styles.authContainer}>
                <div className={styles.authCard}>
                    <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                        <CheckCircle2 size={48} color="#10b981" />
                    </div>
                    <h2>Password Reset!</h2>
                    <p className={styles.subtitle}>
                        Your password has been successfully reset. Redirecting you to login...
                    </p>
                    <div className={styles.authFooter}>
                        <Link to="/login" className={styles.authLink}>
                            Click here if not redirected
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (!token && !submitted) {
        return (
            <div className={styles.authContainer}>
                <div className={styles.authCard}>
                    <div style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#ef4444' }}>
                        <AlertCircle size={48} />
                    </div>
                    <h2>Invalid Link</h2>
                    <p className={styles.subtitle}>
                        This password reset link is invalid or has expired.
                    </p>
                    <div className={styles.authFooter}>
                        <Link to="/forgot-password" className={styles.authLink}>
                            Request a new link
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.authContainer}>
            <div className={styles.authCard}>
                <div style={{ textAlign: 'center', marginBottom: '1rem', color: 'var(--color-primary)' }}>
                    <KeyRound size={40} />
                </div>
                <h2>Reset Password</h2>
                <p className={styles.subtitle}>
                    Enter your new password below to regain access to your account.
                </p>

                {(error || localError) && (
                    <div className={styles.error}>{error || localError}</div>
                )}

                <form onSubmit={handleSubmit} className={styles.authForm}>
                    <div className={styles.formGroup}>
                        <label htmlFor="password">New Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                            disabled={loading}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="confirmPassword">Confirm New Password</label>
                        <input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>

                    <button type="submit" className={styles.submitButton} disabled={loading}>
                        {loading ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
