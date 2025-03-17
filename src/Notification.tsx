import React from "react";

interface NotificationProps {
  notifications: { title: string }[];
}
const Notification: React.FC<NotificationProps> = ({ notifications }) => {
  return (
    <div className="notifications">
      {notifications.map((notification, index) => (
        <div key={index} className="notification">
          <h2>{notification.title}</h2>
        </div>
      ))}
    </div>
  );
};

export default Notification;
