import { useEffect, useState } from "react";
import { getFCMToken, messaging, onMessage } from "./config/firebase";
import Message from "./Message";

function App() {
  const [token, setToken] = useState("");
  const [messages, setMessages] = useState<{ title: string; body?: string; id?: string }[]>([]);

  useEffect(() => {
    // Set up message listener only if messaging is available
    if (messaging) {
      const messageListener = onMessage(messaging, (payload) => {
        console.log("Foreground Notification Received:", payload);
        const { notification } = payload;
        
        // Extract notification data
        const title = notification?.title || "New Notification";
        const body = notification?.body;
        
        // Generate a unique ID for this notification
        const id = Date.now().toString();
        
        // Add to UI messages - only in the tab that received the notification
        setMessages(prevMessages => [...prevMessages, { title, body, id }]);
        
        // Show native browser notification if permission granted
        if (Notification.permission === "granted") {
          new Notification(title, { body });
        }
        
        // Broadcast the message for other tabs/windows ONLY
        // Include the ID to prevent duplicates
        const broadcast = new BroadcastChannel("notification-channel");
        broadcast.postMessage({ title, body, id, fromBroadcast: true });
      });
      
      // Clean up listener on unmount
      return () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        messageListener && messageListener();
      };
    }
  }, []);

  useEffect(() => {
    const getToken = async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          const fcmToken = await getFCMToken();
          if (fcmToken) {
            setToken(fcmToken);
            console.log("Token set:", fcmToken);
          }
        }
      } catch (error) {
        console.error("Error in getToken:", error);
      }
    };

    getToken();
  }, []);

  useEffect(() => {
    // Listen for messages from other tabs/windows
    const broadcast = new BroadcastChannel("notification-channel");
    
    broadcast.onmessage = (event) => {
      // Only process messages that are explicitly from broadcast
      // This prevents the original tab from processing its own broadcast
      if (event.data && event.data.title && event.data.fromBroadcast) {
        // Check if we already have this notification (by ID)
        const notificationExists = messages.some(msg => msg.id === event.data.id);
        
        if (!notificationExists) {
          setMessages(prevMessages => [...prevMessages, event.data]);
        }
      }
    };
    
    return () => {
      broadcast.close();
    };
  }, [messages]); // We need messages dependency to check for duplicates

  return (
    <div className="App">
      <h1>Push Notification with React & FCM</h1>
      <p>
        Device Token 👉 <span style={{ fontSize: "11px" }}> {token} </span>
      </p>
      {token && <h2>Notification permission enabled 👍🏻</h2>}
      {!token && <h2>Need notification permission ❗️ </h2>}
      
      <div className="notifications-container">
        <h2>Notifications ({messages.length})</h2>
        {messages.length > 0 ? (
          <Message messages={messages} />
        ) : (
          <p>No notifications received yet</p>
        )}
      </div>
    </div>
  );
}

export default App;