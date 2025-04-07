
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './App.css';
import { AuthProvider } from './hooks/auth';
import { CurrencyProvider } from './contexts/CurrencyContext';
import './i18n/i18n'; // Import i18n configuration

// Check current language and set RTL class on root element if needed
const savedLanguage = localStorage.getItem('wakti-language');
if (savedLanguage === 'ar') {
  document.documentElement.dir = 'rtl';
  document.documentElement.lang = 'ar';
  document.body.classList.add('rtl');
  document.body.classList.add('font-arabic');
}

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <CurrencyProvider>
      <App />
    </CurrencyProvider>
  </AuthProvider>
);
