import { NotificationPermission } from '../types';

export const requestPermission = async (): Promise<NotificationPermission> => {
  if (!('Notification' in window)) {
    alert('This browser does not support desktop notification');
    return NotificationPermission.Denied;
  }
  
  const permission = await Notification.requestPermission();

  // On iOS, users must add the app to the home screen to get 'granted' permission.
  if (permission !== 'granted') {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if(isIOS) {
        // You could show a more specific message here if needed
    }
  }

  return permission as NotificationPermission;
};

export const sendNotification = (title: string, body: string) => {
  if ('Notification' in window && Notification.permission === 'granted' && navigator.serviceWorker) {
    navigator.serviceWorker.ready.then(registration => {
      registration.showNotification(title, {
        body,
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        tag: 'hydropal-reminder', // Replaces old notifications with the same tag
        requireInteraction: true, // Requires user interaction on some platforms
      });
    });
  }
};