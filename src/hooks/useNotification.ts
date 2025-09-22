import { useNotification as useNotificationHook } from '../contexts/NotificationContext';

export const useNotification = () => {
  const notification = useNotificationHook();
  
  // Add any additional notification methods or overrides here if needed
  return notification;
};

// Example usage in a component:
/*
import { useNotification } from '../hooks/useNotification';

const MyComponent = () => {
  const { showSuccess, showError, showWarning, showInfo } = useNotification();
  
  const handleClick = () => {
    showSuccess('Operation completed successfully!');
  };
  
  return (
    <button onClick={handleClick}>
      Click me for a notification
    </button>
  );
};
*/
