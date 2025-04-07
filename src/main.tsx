
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './App.css';
import { AuthProvider } from './hooks/auth';
import { CurrencyProvider } from './contexts/CurrencyContext';
import './i18n/i18n'; // Import i18n configuration
import i18n from './i18n/i18n';

// Function to apply RTL styling
function applyRTLStyling(isRTL: boolean) {
  if (isRTL) {
    document.documentElement.dir = 'rtl';
    document.documentElement.lang = 'ar';
    document.body.classList.add('rtl');
    document.body.classList.add('font-arabic');
    
    // Add additional RTL-specific styles if needed
    const style = document.createElement('style');
    style.id = 'rtl-styles';
    style.innerHTML = `
      .rtl { direction: rtl; }
      .rtl .flex-row-reverse { flex-direction: row !important; }
      .rtl .ml-2 { margin-right: 0.5rem !important; margin-left: 0 !important; }
      .rtl .mr-2 { margin-left: 0.5rem !important; margin-right: 0 !important; }
      .rtl .pl-2 { padding-right: 0.5rem !important; padding-left: 0 !important; }
      .rtl .pr-2 { padding-left: 0.5rem !important; padding-right: 0 !important; }
    `;
    document.head.appendChild(style);
    
  } else {
    document.documentElement.dir = 'ltr';
    document.documentElement.lang = 'en';
    document.body.classList.remove('rtl');
    document.body.classList.remove('font-arabic');
    
    // Remove RTL-specific styles
    const rtlStyles = document.getElementById('rtl-styles');
    if (rtlStyles) {
      rtlStyles.remove();
    }
  }
  
  console.log(`[RTL] Applied ${isRTL ? 'RTL' : 'LTR'} styling to document`);
}

// Check current language and set RTL class on root element
const savedLanguage = localStorage.getItem('wakti-language');
const isRTL = savedLanguage === 'ar';
applyRTLStyling(isRTL);

// Listen for language changes after initial load
i18n.on('languageChanged', (lng) => {
  applyRTLStyling(lng === 'ar');
});

// Render the app
console.log(`[RTL] Initializing app with language: ${i18n.language} (RTL: ${isRTL})`);
createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <CurrencyProvider>
      <App />
    </CurrencyProvider>
  </AuthProvider>
);
