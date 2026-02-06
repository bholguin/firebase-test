/* eslint-disable no-undef */
importScripts(
  'https://www.gstatic.com/firebasejs/12.9.0/firebase-app-compat.js',
);
importScripts(
  'https://www.gstatic.com/firebasejs/12.9.0/firebase-messaging-compat.js',
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

const messaging = firebase.messaging();

messaging.onBackgroundMessage(() => {
  // Optional: handle background messages.
});
