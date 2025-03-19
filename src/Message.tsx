import React from "react";

interface MessageProps {
  messages: { title: string }[];
}
const Message: React.FC<MessageProps> = ({ messages }) => {
  return (
    <div className="messages">
      {messages.map((message, index) => (
        <div key={index} className="message">
          <h2>{message.title}</h2>
        </div>
      ))}
    </div>
  );
};

export default Message;
