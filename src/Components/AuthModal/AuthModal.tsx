import React from 'react';
import ReactDOM from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { LogIn, UserPlus, X } from 'lucide-react';
import styles from './AuthModal.module.css';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handleAction = (path: string) => {
        onClose();
        navigate(path);
    };

    return ReactDOM.createPortal(
        <div className={styles.backdrop} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
                    <X size={20} />
                </button>

                <div className={styles.iconWrapper}>
                    <LogIn size={32} />
                </div>

                <h2 className={styles.title}>Sign in to Order</h2>
                <p className={styles.description}>
                    Log in or create an account to start adding delicious items to your cart and placing orders.
                </p>

                <div className={styles.buttonGroup}>
                    <button
                        className={styles.loginBtn}
                        onClick={() => handleAction('/login')}
                    >
                        <LogIn size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                        Log In
                    </button>

                    <button
                        className={styles.registerBtn}
                        onClick={() => handleAction('/register')}
                    >
                        <UserPlus size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                        Create Account
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};
