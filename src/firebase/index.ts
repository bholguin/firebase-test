import { initializeApp, getApps } from 'firebase/app';
import { getMessaging, getToken, isSupported } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: 'AIzaSyBWZo3lO4ckL6mGE5szGbJ3KPSy772ibfU',
  authDomain: 'suscription-72c84.firebaseapp.com',
  projectId: 'suscription-72c84',
  storageBucket: 'suscription-72c84.firebasestorage.app',
  messagingSenderId: '98945309445',
  appId: '1:98945309445:web:83ffda424cd7888842f56c',
  measurementId: 'G-121MQLFJGY',
};

const vapidKey =
  'BFfhnXeDzS-9eAcxd-fmwKq8e_4ovZ__WOieZQ7CUkQAEf5HCR7JK-G5lkby-m370i9CmmEkWgwCUH4KNduHHkA';

const getFirebaseApp = () => {
  if (!getApps().length) {
    initializeApp(firebaseConfig);
  }
  return getApps()[0];
};

const validateConfig = () => {
  const missing = Object.entries(firebaseConfig)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    throw new Error(`Missing Firebase config values: ${missing.join(', ')}`);
  }

  if (!vapidKey) {
    throw new Error('Missing Firebase VAPID key.');
  }
};

export const requestMessagingToken = async (): Promise<string | null> => {
  if (typeof window === 'undefined') {
    return null;
  }

  const supported = await isSupported();
  if (!supported) {
    return null;
  }

  if (!('Notification' in window)) {
    return null;
  }

  if (!('serviceWorker' in navigator)) {
    throw new Error('Service workers are not supported in this browser.');
  }

  validateConfig();

  if (!window.isSecureContext) {
    throw new Error('Push requires a secure context (https or localhost).');
  }

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    return null;
  }

  const registration = await navigator.serviceWorker.register(
    '/firebase-messaging-sw.js',
  );

  const messaging = getMessaging();
  const token = await getToken(messaging, {
    vapidKey,
    serviceWorkerRegistration: registration,
  });

  return token || null;
};
