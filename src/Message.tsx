import React from "react";

interface NotificationProps {
  title: string;
}

const Message: React.FC<NotificationProps> = ({ title }) => {
  return (
    <div className="notification">
      <h2>{title}</h2>
    </div>
  );
};

export default Message;
