import { useEffect, useState } from "react";
import { getFCMToken, messaging, onMessage } from "./config/firebase";

function App() {
  const [token, setToken] = useState("");
  onMessage(messaging, (payload) => {
    console.log("Foreground Notification Received:", payload);
    const { title, body } = payload.notification || {};

    // Show native browser notification
    new Notification(title || "New Notification", { body });
  });
  useEffect(() => {
    const getToken = async () => {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        const token = await getFCMToken();
        if (token) {
          setToken(token);
          console.log(token);
        }
      }
    };

    getToken();
  }, []);

  return (
    <div className="App">
      <h1>Push Notification with React & FCM</h1>
      <p>
        Device Token 👉 <span style={{ fontSize: "11px" }}> {token} </span>
      </p>
      {token && <h2>Notification permission enabled 👍🏻</h2>}
      {!token && <h2>Need notification permission ❗️ </h2>}
    </div>
  );
}

export default App;
