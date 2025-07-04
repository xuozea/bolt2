import { messaging } from '../firebase/config';
import { getToken, onMessage } from 'firebase/messaging';
import toast from 'react-hot-toast';

class NotificationService {
  private vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;

  async requestPermission(): Promise<string | null> {
    try {
      if (!messaging) {
        console.log('Messaging not supported');
        return null;
      }

      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        console.log('Notification permission granted.');
        const token = await this.getToken();
        if (token) {
          toast.success('Notifications enabled! You\'ll receive queue updates.');
        }
        return token;
      } else {
        console.log('Unable to get permission to notify.');
        toast.error('Notification permission denied. You won\'t receive queue updates.');
        return null;
      }
    } catch (error) {
      console.error('An error occurred while retrieving token. ', error);
      toast.error('Failed to enable notifications.');
      return null;
    }
  }

  async getToken(): Promise<string | null> {
    try {
      if (!messaging || !this.vapidKey) {
        console.log('Messaging not available or VAPID key missing');
        return null;
      }
      
      const currentToken = await getToken(messaging, {
        vapidKey: this.vapidKey,
      });
      
      if (currentToken) {
        console.log('Registration token:', currentToken);
        // In a real app, you'd send this token to your server
        localStorage.setItem('fcmToken', currentToken);
        return currentToken;
      } else {
        console.log('No registration token available.');
        return null;
      }
    } catch (error) {
      console.error('An error occurred while retrieving token. ', error);
      return null;
    }
  }

  setupMessageListener() {
    if (!messaging) return;

    onMessage(messaging, (payload) => {
      console.log('Message received. ', payload);
      
      // Show notification toast
      toast.success(
        payload.notification?.title || 'Queue Update',
        {
          duration: 5000,
          icon: '🔔',
        }
      );

      // Show browser notification if permission granted
      if (Notification.permission === 'granted' && payload.notification) {
        const notification = new Notification(payload.notification.title || 'Queue Away', {
          body: payload.notification.body,
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          tag: 'queue-update',
          requireInteraction: true,
        });

        notification.onclick = () => {
          window.focus();
          notification.close();
        };
      }
    });
  }

  // Send notification to user (this would typically be done from your backend)
  async sendQueueUpdateNotification(userId: string, message: string) {
    // This is a placeholder - in a real app, your backend would send notifications
    console.log(`Sending notification to ${userId}: ${message}`);
    
    // For demo purposes, show a local notification
    if (Notification.permission === 'granted') {
      new Notification('Queue Update', {
        body: message,
        icon: '/favicon.ico',
      });
    }
  }
}

export const notificationService = new NotificationService();