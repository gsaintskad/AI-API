import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addMessage } from './chatSlice'; // Ensure this path is correct
import { RootState } from './store'; // Import RootState for typing
import { v4 as uuidv4 } from 'uuid';

function Chat() {
  const messages = useSelector((state: RootState) => state.chat.messages); // Type the state
  const dispatch = useDispatch();
  const [inputText, setInputText] = useState('');

  const handleSendMessage = (message: string) => {
    // Add type annotation to message
    if (message.trim() === '') return;

    const newMessage = {
      id: uuidv4(),
      text: message,
      sender: 'user' as 'user' | 'bot', // Explicitly type sender
      timestamp: Date.now(),
    };

    dispatch(addMessage(newMessage));
    setInputText('');

    // Simulate a bot response
    setTimeout(() => {
      const botMessage = {
        id: uuidv4(),
        text: `You said: "${message}"`,
        sender: 'bot' as 'user' | 'bot', // Explicitly type sender
        timestamp: Date.now(),
      };
      dispatch(addMessage(botMessage));
    }, 1000);
  };

  return (
    <div className="chat-container">
      <div className="chat-header">Simple Chat</div>
      <div className="messages-list">
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}>
            <div className="message-text">{message.text}</div>
            <div className="message-timestamp">{new Date(message.timestamp).toLocaleTimeString()}</div>
          </div>
        ))}
      </div>
      <div className="chat-input-container">
        <input
          type="text"
          className="chat-input"
          placeholder="Type your message..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSendMessage(inputText);
            }
          }}
        />
        <button className="send-button" onClick={() => handleSendMessage(inputText)}>
          Send
        </button>
      </div>
    </div>
  );
}

export default Chat;
