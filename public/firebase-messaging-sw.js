importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js"
);

(async function () {
  try {
    const response = await fetch("http://localhost:3000/config");
    const firebaseConfig = await response.json();

    firebase.initializeApp(firebaseConfig);
    const messaging = firebase.messaging();

    messaging.onBackgroundMessage((payload) => {
      console.log("Received background message: ", payload);
      const notificationTitle = payload.notification.title;
      
      if(notificationTitle !== 'Active Check'){
        const notificationOptions = {
          body: payload.notification.body,
          icon: "/firebase-logo.png",
        };
        self.registration.showNotification(notificationTitle, notificationOptions);
      }
        
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

