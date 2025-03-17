import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
};

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
