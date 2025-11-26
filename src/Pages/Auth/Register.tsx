import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styles from './Auth.module.css';
import type { RegisterCustomerPayload } from '../../services/registerService';

export const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [dobError, setDobError] = useState('');
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const { register, loading, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';
  const todayStr = new Date().toISOString().split('T')[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneError('');
    setDobError('');
    setFirstNameError('');
    setLastNameError('');

    const namePattern = /^[A-Za-z]{2,}$/;
    if (!namePattern.test(firstName)) {
      setFirstNameError('First name must be at least 2 letters, letters only.');
      return;
    }
    if (!namePattern.test(lastName)) {
      setLastNameError('Last name must be at least 2 letters, letters only.');
      return;
    }

    const phonePattern = /^(010|011|012|015)\d{8}$/;
    if (!phonePattern.test(phone)) {
      setPhoneError('Phone must start with 010, 011, 012, or 015 and be 11 digits.');
      return;
    }

    if (!dob) {
      setDobError('Date of birth is required.');
      return;
    }
    const dobDate = new Date(dob);
    const today = new Date();
    // Zero out times for a fair comparison
    dobDate.setHours(0,0,0,0);
    today.setHours(0,0,0,0);
    if (!(dobDate instanceof Date) || isNaN(dobDate.getTime())) {
      setDobError('Please enter a valid date.');
      return;
    }
    if (dobDate >= today) {
      setDobError('Date of birth must be in the past.');
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    try {
      const payload: RegisterCustomerPayload = {
        firstName,
        lastName,
        email,
        password,
        dob,
        phoneNumber: phone
      };
      const success = await register(payload);
      if (!success) throw new Error('Registration failed');
      // Only navigate if registration was successful (no error was thrown)
      navigate('/login', { replace: true });
    } catch (error) {
      // Error is already handled in the AuthContext
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <h2>Create an Account</h2>
        <p className={styles.subtitle}>Join CafeCart today</p>
        
        {error && <div className={styles.error}>{error}</div>}
        
        <form onSubmit={handleSubmit} className={styles.authForm}>
          <div className={styles.formGroup}>
            <label htmlFor="firstName">First Name</label>
            <input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value);
                if (firstNameError) setFirstNameError('');
              }}
              required
              disabled={loading}
            />
            {firstNameError && <div className={styles.error}>{firstNameError}</div>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="lastName">Last Name</label>
            <input
              id="lastName"
              type="text"
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value);
                if (lastNameError) setLastNameError('');
              }}
              required
              disabled={loading}
            />
            {lastNameError && <div className={styles.error}>{lastNameError}</div>}
          </div>
          
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
            <label htmlFor="phone">Phone Number</label>
            <input
              id="phone"
              type="tel"
              inputMode="numeric"
              pattern='^(010|011|012|015)\d{8}$'
              minLength={11}
              maxLength={11}
              value={phone}
              onChange={(e) => {
                const v = e.target.value.replace(/[^0-9]/g, '');
                setPhone(v);
                if (phoneError) setPhoneError('');
              }}
              required
              disabled={loading}
            />
            {phoneError && <div className={styles.error}>{phoneError}</div>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="dob">Date of Birth</label>
            <input
              id="dob"
              type="date"
              value={dob}
              onChange={(e) => {
                setDob(e.target.value);
                if (dobError) setDobError('');
              }}
              max={todayStr}
              required
              disabled={loading}
            />
            {dobError && <div className={styles.error}>{dobError}</div>}
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
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
            <label htmlFor="confirmPassword">Confirm Password</label>
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
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>
        
        <div className={styles.authFooter}>
          Already have an account?{' '}
          <Link to="/login" className={styles.authLink}>
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
