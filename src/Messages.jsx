import React from "react";
import "./Messages.css";

const messages = [
  { from: "Recruiter at Amazon", text: "We reviewed your application. Let's talk!" },
  { from: "System", text: "You saved a new job: Backend Engineer at Tesla" },
];

const Messages = () => {
  return (
    <div className="messages">
      <h3>Recent Messages</h3>
      {messages.map((msg, idx) => (
        <div key={idx} className="message-item">
          <strong>{msg.from}:</strong> <span>{msg.text}</span>
        </div>
      ))}
    </div>
  );
};

export default Messages;
