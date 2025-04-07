
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './App.css';
import { AuthProvider } from './hooks/auth';
import { CurrencyProvider } from './contexts/CurrencyContext';
import { TranslationProvider } from './contexts/TranslationContext';
import './i18n/i18n'; // Import i18n configuration
import Cookies from 'js-cookie';

// Check if we should apply RTL based on cookie (more reliable than localStorage)
const savedLanguage = Cookies.get('wakti-language');
if (savedLanguage === 'ar') {
  document.documentElement.dir = 'rtl';
  document.body.classList.add('rtl');
  document.body.classList.add('font-arabic');
} else {
  document.documentElement.dir = 'ltr';
  document.body.classList.remove('rtl');
  document.body.classList.remove('font-arabic');
}

// Render the app
console.log(`[App] Initializing app`);
createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <CurrencyProvider>
      <TranslationProvider>
        <App />
      </TranslationProvider>
    </CurrencyProvider>
  </AuthProvider>
);
