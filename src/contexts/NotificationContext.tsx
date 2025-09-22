import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { Notification } from '../Components/Notification/Notification';
import type { NotificationType } from '../Components/Notification/Notification';

type NotificationOptions = {
  type?: NotificationType;
  duration?: number;
};

type NotificationItem = {
  id: string;
  message: string;
  type: NotificationType;
  duration: number;
};

type NotificationContextType = {
  showNotification: (message: string, options?: NotificationOptions) => void;
  showSuccess: (message: string, duration?: number) => void;
  showError: (message: string, duration?: number) => void;
  showWarning: (message: string, duration?: number) => void;
  showInfo: (message: string, duration?: number) => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const showNotification = useCallback((message: string, options: NotificationOptions = {}) => {
    const id = Math.random().toString(36).substr(2, 9);
    const { type = 'info', duration = 5000 } = options;

    setNotifications((prev) => [
      ...prev,
      {
        id,
        message,
        type,
        duration,
      },
    ]);
  }, []);

  const showSuccess = useCallback((message: string, duration: number = 3000) => {
    showNotification(message, { type: 'success', duration });
  }, [showNotification]);

  const showError = useCallback((message: string, duration: number = 5000) => {
    showNotification(message, { type: 'error', duration });
  }, [showNotification]);

  const showWarning = useCallback((message: string, duration: number = 4000) => {
    showNotification(message, { type: 'warning', duration });
  }, [showNotification]);

  const showInfo = useCallback((message: string, duration: number = 3000) => {
    showNotification(message, { type: 'info', duration });
  }, [showNotification]);

  return (
    <NotificationContext.Provider
      value={{
        showNotification,
        showSuccess,
        showError,
        showWarning,
        showInfo,
      }}
    >
      {children}
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          message={notification.message}
          type={notification.type}
          duration={notification.duration}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
