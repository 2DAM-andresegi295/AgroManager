// firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyA6bU_OuTFQ4zYmEtAWppggYVdo_W7on78",
  authDomain: "agromanager-e2ec7.firebaseapp.com",
  projectId: "agromanager-e2ec7",
  storageBucket: "agromanager-e2ec7.firebasestorage.app",
  messagingSenderId: "904391927976",
  appId: "1:904391927976:web:5902175d6e878a0a71ba9d"
});

const messaging = firebase.messaging();
