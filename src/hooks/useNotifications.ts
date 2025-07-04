import { useEffect, useState } from 'react';
import { notificationService } from '../services/notificationService';

export const useNotifications = () => {
  const [token, setToken] = useState<string | null>(null);
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    // Check current permission status
    setPermission(Notification.permission);

    // Setup message listener
    notificationService.setupMessageListener();

    // If permission is already granted, get token
    if (Notification.permission === 'granted') {
      notificationService.getToken().then(setToken);
    }

    // Check for stored token
    const storedToken = localStorage.getItem('fcmToken');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const requestPermission = async () => {
    const newToken = await notificationService.requestPermission();
    setToken(newToken);
    setPermission(Notification.permission);
    return newToken;
  };

  return {
    token,
    permission,
    requestPermission,
  };
};