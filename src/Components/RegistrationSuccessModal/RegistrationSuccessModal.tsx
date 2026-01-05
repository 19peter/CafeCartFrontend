import React from 'react';
import ReactDOM from 'react-dom';
import { Mail, CheckCircle2, X } from 'lucide-react';
import styles from './RegistrationSuccessModal.module.css';

interface RegistrationSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const RegistrationSuccessModal: React.FC<RegistrationSuccessModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className={styles.backdrop} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
                    <X size={20} />
                </button>

                <div className={styles.iconWrapper}>
                    <div className={styles.successBadge}>
                        <CheckCircle2 size={24} className={styles.checkIcon} />
                    </div>
                    <Mail size={48} className={styles.mailIcon} />
                </div>

                <h2 className={styles.title}>Registration Successful!</h2>

                <div className={styles.content}>
                    <p className={styles.primaryText}>
                        We've sent a verification email to your inbox.
                    </p>
                    <p className={styles.secondaryText}>
                        Please check your email and click the verification link to activate your account.
                    </p>
                </div>

                <button className={styles.actionBtn} onClick={onClose}>
                    Got it, thanks!
                </button>
            </div>
        </div>,
        document.body
    );
};

export default RegistrationSuccessModal;
