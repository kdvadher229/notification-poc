import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const response = await fetch("http://localhost:3000/config");
const firebaseConfig = await response.json();

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// ✅ Register Service Worker
navigator.serviceWorker
  .register("/firebase-messaging-sw.js")
  .then((registration) => {
    console.log("Service Worker registered successfully:", registration);
  })
  .catch((error) => {
    console.error("Service Worker registration failed:", error);
  });

// ✅ Get Firebase Token
export const getFCMToken = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_VAPID_KEY, // Ensure you have a valid VAPID key
        serviceWorkerRegistration: await navigator.serviceWorker.ready,
      });
      console.log("FCM Token:", token);
      return token;
    } else {
      console.log("Push notification permission denied");
    }
  } catch (error) {
    console.error("Error retrieving FCM token:", error);
  }
};

export { messaging, onMessage };
