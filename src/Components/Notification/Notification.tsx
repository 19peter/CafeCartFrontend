import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import styles from './Notification.module.css';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface NotificationProps {
  message: string;
  type?: NotificationType;
  duration?: number;
  onClose: () => void;
}

export const Notification: React.FC<NotificationProps> = ({
  message,
  type = 'info',
  duration = 3000,
  onClose,
}) => {
  const notificationRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (duration > 0) {
      timerRef.current = setTimeout(() => {
        handleClose();
      }, duration);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [duration]);

  const handleClose = () => {
    if (notificationRef.current) {
      notificationRef.current.classList.add(styles.slideOut);
      // Wait for the animation to complete before calling onClose
      setTimeout(() => {
        onClose();
      }, 300);
    } else {
      onClose();
    }
  };

  const notification = (
    <div
      ref={notificationRef}
      className={`${styles.notification} ${styles[type]} ${styles.slideIn}`}
      onClick={handleClose}
      role="alert"
      aria-live="assertive"
    >
      <div className={styles.icon}>
        {type === 'success' && '✓'}
        {type === 'error' && '✕'}
        {type === 'warning' && '⚠'}
        {type === 'info' && 'i'}
      </div>
      <div className={styles.message}>{message}</div>
      <button className={styles.closeButton} aria-label="Close notification">
        &times;
      </button>
    </div>
  );

  // Create portal to body
  return ReactDOM.createPortal(
    notification,
    document.body
  );
};
