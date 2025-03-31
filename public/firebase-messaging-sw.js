importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js"
);

(async function () {
  try {
    const firebaseConfig = {
      apiKey: true,
      authDomain: true,
      projectId: true,
      storageBucket: true,
      messagingSenderId: true,
      appId: true
    };

    console.log(firebaseConfig,'in background');

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

