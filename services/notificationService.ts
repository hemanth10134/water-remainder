
import { NotificationPermission } from '../types.ts';

export const requestPermission = async (): Promise<NotificationPermission> => {
  if (!('Notification' in window)) {
    alert('This browser does not support desktop notification');
    return NotificationPermission.Denied;
  }
  
  const permission = await Notification.requestPermission();
  return permission as NotificationPermission;
};

export const sendNotification = (title: string, body: string) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, { 
        body,
        icon: '/favicon.svg' // You can host a proper icon
    });
  }
};
