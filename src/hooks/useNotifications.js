import { useEffect, useState } from 'react';
import { notificationService } from '../services/notificationService';

export const useNotifications = () => {
  const [token, setToken] = useState(null);
  const [permission, setPermission] = useState('default');

  useEffect(() => {
    // Check current permission status
    setPermission(Notification.permission);

    // Setup message listener
    notificationService.setupMessageListener();

    // If permission is already granted, get token
    if (Notification.permission === 'granted') {
      notificationService.getToken().then(setToken);
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