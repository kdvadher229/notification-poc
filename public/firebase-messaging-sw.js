importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js"
);

(async function () {
  try {
    const firebaseConfig = {
      apiKey: "AIzaSyDkOmaXniWJSF2bEOoRypWPrUF-d9pMkLA",
      authDomain: "ops-notification-f21da.firebaseapp.com",
      projectId: "ops-notification-f21da",
      storageBucket: "ops-notification-f21da.firebasestorage.app",
      messagingSenderId: "223927492708",
      appId: "1:223927492708:web:a5702645fa95ce31a8bf71"
    };

    firebase.initializeApp(firebaseConfig);
    const messaging = firebase.messaging();

    messaging.onBackgroundMessage((payload) => {
      console.log("Received background message: ", payload);
      const notificationTitle = payload.notification.title;
      
        const notificationOptions = {
          body: payload.notification.body,
          icon: "/firebase-logo.png",
        };
        self.registration.showNotification(notificationTitle, notificationOptions);
    });
    
    // Handle Click on Notifications
    self.addEventListener("notificationclick", function (event) {
      event.notification.close();
      event.waitUntil(clients.openWindow("https://your-website.com"));
    });
  } catch (error) {
    console.error("Error fetching Firebase config:", error);
  }
})();

