const urlBase64ToUint8Array = (base64String: string) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return new Uint8Array([...rawData].map((char) => char.charCodeAt(0)));
};
const applicationServerKey = urlBase64ToUint8Array(
  "BE8sLglm4R91faCMnAgmsOzxDr4kENdsgD91jTxOcY05t34HtnzIvxRIuO_THIF15cO2xuF4CB3BnNxDX_ThfJ0"
);

export const subscribeUser = async () => {
  if ("serviceWorker" in navigator) {
    try {
      const register = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
      });

      console.log("Service Worker Registered", register);

      const subscription = await register.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey,
      });

      await fetch("http://localhost:3000/subscribe", {
        method: "POST",
        body: JSON.stringify(subscription),
        headers: { "Content-Type": "application/json" },
      });

      console.log("Push Notifications Enabled");
    } catch (error) {
      console.log("Error enabling notifications", error);
    }
  }
};

export const sendNotification = async () => {
  try {
    const response = await fetch("http://localhost:3000/sendNotification", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: "Hello World!" }),
    });

    if (response.ok) {
      console.log("Notification sent successfully");
    } else {
      console.error("Failed to send notification");
    }
  } catch (error) {
    console.error("Error sending notification", error);
  }
};
