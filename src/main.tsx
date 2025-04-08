
// Import i18n initialization first to ensure it loads before React renders
import './i18n/i18n'; 
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './App.css';
import { AuthProvider } from './hooks/auth';
import { CurrencyProvider } from './contexts/CurrencyContext';

// Create the root with immediate access to the DOM element
const rootElement = document.getElementById("root");
const root = createRoot(rootElement!);

// Wait for i18n to be initialized, then render
const renderApp = () => {
  root.render(
    <AuthProvider>
      <CurrencyProvider>
        <App />
      </CurrencyProvider>
    </AuthProvider>
  );
};

// Ensure i18n is ready before rendering
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    renderApp();
  });
} else {
  renderApp();
}
