import React, { useState } from "react";
import "./Aichat.css";

const Aichat = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      setMessages([...messages, { text: inputMessage, isUser: true }]);
      setInputMessage("");
    }
  };

  return (
    <div className="aichat-container">
      <div className="aichat-header">
        <img src="/images/session-icons/voice1.svg" alt="voice" />
        <img src="/images/session-icons/brain.svg" alt="" />
        <img src="/images/iconsModule/settings.svg" alt="" />
      </div>

      <div className="aichat-messages">
        {messages.length === 0 ? (
          <img
            className="noChat"
            src="/images/session-icons/noChat.svg"
            alt="No chat messages"
          />
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`message ${
                message.isUser ? "user-message" : "ai-message"
              }`}
            >
              {message.text}
            </div>
          ))
        )}
      </div>

      <form className="aichat-input-form" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="message..."
          className="aichat-input"
        />
        <div className="sendButton" onClick={handleSendMessage}>
          <img src="/images/session-icons/send.svg" alt="" />
        </div>
      </form>
    </div>
  );
};

export default Aichat;
