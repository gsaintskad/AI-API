import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the type for a single message
interface Message {
  id: string; // Unique identifier for the message
  text: string;
  sender: 'user' | 'bot'; // Indicate who sent the message
  timestamp: number; // Timestamp for sorting/display
}

// Define the state shape for the chat slice
interface ChatState {
  messages: Message[];
}

// Initial state for the chat slice
const initialState: ChatState = {
  messages: [],
};

// Create the chat slice
const chatSlice = createSlice({
  name: 'chat', // Slice name
  initialState, // Initial state
  reducers: {
    // Reducer to add a new message
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    // Add other reducers if needed (e.g., deleteMessage, clearChat)
  },
});

// Export actions and the reducer
export const { addMessage } = chatSlice.actions;
export default chatSlice.reducer;
