
// Import React and ReactDOM
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './index.css';
import './App.css';
import { AuthProvider } from './hooks/auth';
import { CurrencyProvider } from './contexts/CurrencyContext';

// Create the root with immediate access to the DOM element
const rootElement = document.getElementById("root");
const root = createRoot(rootElement!);

// Add a simple check to the window for debugging
// Using a type assertion to avoid TypeScript errors 
window.WAKTI_DEBUG = true;
console.log("Application initializing...");

// Render the app directly
root.render(
  <AuthProvider>
    <CurrencyProvider>
      <App />
    </CurrencyProvider>
  </AuthProvider>
);
