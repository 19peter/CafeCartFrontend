import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styles from './Auth.module.css';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

export const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const { forgotPassword, loading, error } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const success = await forgotPassword(email);
        if (success) {
            setSubmitted(true);
        }
    };

    if (submitted) {
        return (
            <div className={styles.authContainer}>
                <div className={styles.authCard}>
                    <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                        <CheckCircle2 size={48} color="#10b981" />
                    </div>
                    <h2>Check your email</h2>
                    <p className={styles.subtitle}>
                        We've sent a password reset link to <strong>{email}</strong>
                    </p>
                    <div className={styles.authFooter}>
                        <Link to="/login" className={styles.authLink} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                            <ArrowLeft size={16} />
                            Back to Sign In
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
                    <Mail size={40} />
                </div>
                <h2>Forgot Password?</h2>
                <p className={styles.subtitle}>
                    No worries! Enter your email and we'll send you a link to reset your password.
                </p>

                {error && <div className={styles.error}>{error}</div>}

                <form onSubmit={handleSubmit} className={styles.authForm}>
                    <div className={styles.formGroup}>
                        <label htmlFor="email">Email Address</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="e.g. delicious@cafecart.com"
                            required
                            disabled={loading}
                        />
                    </div>

                    <button type="submit" className={styles.submitButton} disabled={loading}>
                        {loading ? 'Sending Link...' : 'Send Reset Link'}
                    </button>
                </form>

                <div className={styles.authFooter} style={{ marginTop: '2rem' }}>
                    <Link to="/login" className={styles.authLink} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <ArrowLeft size={16} />
                        Back to Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
