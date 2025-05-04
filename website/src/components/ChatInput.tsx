import React, { useState } from 'react';
import { useDispatch } from 'react-redux'; // Import useDispatch
import { addMessage } from '../chatSlice'; // Import the addMessage action
import { v4 as uuidv4 } from 'uuid'; // Import uuid for unique IDs (install uuid: npm install uuid @types/uuid)

// Define props for the ChatInput component (if any, none needed for now)
interface ChatInputProps {}

// ChatInput component for typing and sending messages
const ChatInput: React.FC<ChatInputProps> = () => {
  const [inputText, setInputText] = useState(''); // State for the input field
  const dispatch = useDispatch(); // Get the dispatch function

  // Handle input change
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(event.target.value);
  };

  // Handle sending message
  const handleSendMessage = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission

    if (inputText.trim()) {
      // Create a new message object
      const newMessage = {
        id: uuidv4(), // Generate a unique ID
        text: inputText,
        sender: 'user' as 'user' | 'bot', // Cast to the correct type
        timestamp: Date.now(),
      };

      // Dispatch the addMessage action
      dispatch(addMessage(newMessage));

      // Clear the input field
      setInputText('');

      // Optional: Simulate a bot response after a short delay
      setTimeout(() => {
        const botMessage = {
          id: uuidv4(),
          text: `Echo: ${inputText}`, // Simple echo for demonstration
          sender: 'bot' as 'user' | 'bot',
          timestamp: Date.now(),
        };
        dispatch(addMessage(botMessage));
      }, 1000); // 1 second delay
    }
  };

  return (
    <form className="chat-input-container" onSubmit={handleSendMessage}>
      <input type="text" value={inputText} onChange={handleInputChange} placeholder="Type a message..." className="chat-input" />
      <button type="submit" className="send-button">
        {/* You can use an icon here, e.g., from react-icons */}
        Send
      </button>
    </form>
  );
};

export default ChatInput;
