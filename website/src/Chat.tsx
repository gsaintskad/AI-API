import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addMessage } from './chatSlice'; // Ensure this path is correct relative to Chat.tsx
import { RootState } from './store'; // Import RootState for typing the selector
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

// Define the expected structure of the bot's response
interface BotResponse {
  reply: string; // Assuming the server sends a JSON object with a 'reply' field
}

function Chat() {
  // Select messages from the Redux store, ensuring correct type using RootState
  const messages = useSelector((state: RootState) => state.chat.messages);
  const dispatch = useDispatch();
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false); // State to disable input while sending

  // Function to handle sending a message
  // Add type annotation to messageText parameter
  const handleSendMessage = async (messageText: string) => {
    // Trim whitespace and check if the message is empty
    const trimmedMessage = messageText.trim();
    if (trimmedMessage === '') {
      return; // Don't send empty messages
    }

    // Create the user message object
    const userMessage = {
      id: uuidv4(), // Generate a unique ID for the message
      text: trimmedMessage,
      sender: 'user' as 'user' | 'bot', // Explicitly type sender
      timestamp: Date.now(), // Add timestamp
    };

    // Add the user message to the Redux store immediately
    dispatch(addMessage(userMessage));
    // Clear the input field
    setInputText('');
    // Set sending state to true to disable input
    setIsSending(true);

    try {
      const apiResponse = await axios.post(
        '/api/ollama/generate',
        {
          prompt: trimmedMessage, // The data sent TO the API
          // You might need to add other fields or headers depending on your API
          // headers: { 'Authorization': 'Bearer YOUR_API_KEY' } // Example header
        },
        {
          timeout: 60000, // Optional: Set a timeout (e.g., 60 seconds)
        }
      );
      // --- IMPORTANT: Adjust how you extract the response based on YOUR AI API ---
      const { data: resp, status }: { data: string; status: number } = apiResponse; // Adjust 'answer' based on the actual response key
      const data: BotResponse = { reply: resp }; // Parse the response to get the bot's reply
      if (status !== 200 || !data.reply) {
        throw new Error('Invalid response from server');
      }
      // Create the bot message object from the server response
      const botMessage = {
        id: uuidv4(), // Generate a unique ID for the bot message
        text: data.reply, // Use the 'reply' field from the server response
        sender: 'bot' as 'user' | 'bot', // Explicitly type sender
        timestamp: Date.now(), // Add timestamp
      };

      // Add the bot message to the Redux store
      dispatch(addMessage(botMessage));
    } catch (error) {
      // Log any errors during the fetch operation
      console.error('Error sending message to server:', error);
      // Optionally, add an error message to the chat
      const errorMessage = {
        id: uuidv4(),
        text: 'Error receiving response from server.',
        sender: 'bot' as 'user' | 'bot',
        timestamp: Date.now(),
      };
      dispatch(addMessage(errorMessage));
    } finally {
      // Set sending state back to false
      setIsSending(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">Simple Chat</div>
      <div className="messages-list">
        {messages.map((message) => (
          // Use the Message component (assuming you have one)
          // Ensure Message component is imported and correctly receives message prop
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
          placeholder={isSending ? 'Sending...' : 'Type your message...'} // Update placeholder based on sending state
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !isSending) {
              // Prevent sending if already sending
              handleSendMessage(inputText);
            }
          }}
          disabled={isSending} // Disable input while sending
        />
        <button
          className="send-button"
          onClick={() => handleSendMessage(inputText)}
          disabled={isSending} // Disable button while sending
        >
          {isSending ? 'Sending...' : 'Send'} {/* Update button text */}
        </button>
      </div>
    </div>
  );
}

export default Chat;
