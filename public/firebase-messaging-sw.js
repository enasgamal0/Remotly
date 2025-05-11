// Scripts for firebase and firebase messaging
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");

// Initialize the Firebase app in the service worker by passing the generated config

const firebaseConfig = {
  apiKey: "AIzaSyAXpvZ7OLd9xhYtqzcHTyLuZJOyvBNYroE",
  authDomain: "tagamaly-d6fe4.firebaseapp.com",
  projectId: "tagamaly-d6fe4",
  storageBucket: "tagamaly-d6fe4.firebasestorage.app",
  messagingSenderId: "451531457200",
  appId: "1:451531457200:web:93fd9875929ead25703175",
  measurementId: "G-4JSQY1T8B1"
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function (payload) {
  console.log("Received background message", payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);

  self.clients.matchAll().then((clients) => {
    clients.forEach((client) => {
      client.postMessage(payload);
    });
  });
});
// =================================== new ==========================
