import { Provider } from 'react-redux'; // Import Provider
import { store } from './store'; // Import the Redux store
import Chat from './Chat'; // Import the Chat component
import './App.css'; // Keep your existing App styles if needed
import './index.css'; // Keep your existing index styles if needed

function App() {
  return (
    // Wrap your application with the Redux Provider
    <Provider store={store}>
      <div className="App">
        {/* Render the Chat component */}
        <Chat />
      </div>
    </Provider>
  );
}

export default App;
