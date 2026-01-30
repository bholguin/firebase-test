/* eslint-disable no-undef */
importScripts(
  'https://www.gstatic.com/firebasejs/12.8.0/firebase-app-compat.js',
);
importScripts(
  'https://www.gstatic.com/firebasejs/12.8.0/firebase-messaging-compat.js',
);

firebase.initializeApp({
  apiKey: 'AIzaSyBWZo3lO4ckL6mGE5szGbJ3KPSy772ibfU',
  authDomain: 'suscription-72c84.firebaseapp.com',
  projectId: 'suscription-72c84',
  storageBucket: 'suscription-72c84.firebasestorage.app',
  messagingSenderId: '98945309445',
  appId: '1:98945309445:web:83ffda424cd7888842f56c',
  measurementId: 'G-121MQLFJGY',
});

// Acelera la activación/control del SW (útil en dev)
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => self.clients.claim());

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload,
  );
  // Customize notification here
  const notificationTitle = 'Background Message Title';
  const notificationOptions = {
    body: 'Background Message body.',
    icon: '/firebase-logo.png',
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
