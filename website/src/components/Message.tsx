// If RootState and useSelector are not used, remove the imports:
// import { RootState } from '../store';
// import { useSelector } from 'react-redux';

import React from 'react';

// Define the type for the message prop
interface MessageProps {
  message: {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: number;
  };
}

const Message: React.FC<MessageProps> = ({ message }) => {
  return (
    <div key={message.id} className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}>
      <div className="message-text">{message.text}</div>
      <div className="message-timestamp">{new Date(message.timestamp).toLocaleTimeString()}</div>
    </div>
  );
};

export default Message;
