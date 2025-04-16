
// Import React and ReactDOM
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import './index.css';
import './App.css';
import './styles/mobile.css'; // Import our mobile styles
import { AuthProvider } from './hooks/auth';
import { CurrencyProvider } from './contexts/CurrencyContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Create the root with immediate access to the DOM element
const rootElement = document.getElementById("root");
const root = createRoot(rootElement!);

// Add a simple check to the window for debugging
// Using a type assertion to avoid TypeScript errors 
window.WAKTI_DEBUG = true;
console.log("Application initializing...");

// Add platform detection to HTML element
const detectPlatform = () => {
  const html = document.documentElement;
  
  // Detect iOS
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
               (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  
  // Detect Android
  const isAndroid = /Android/.test(navigator.userAgent);
  
  // Add platform classes to HTML element
  if (isIOS) {
    html.classList.add('ios');
    console.log('iOS platform detected');
  } else if (isAndroid) {
    html.classList.add('android');
    console.log('Android platform detected');
  }
  
  // Add mobile class regardless of specific platform
  const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
  
  if (isMobileDevice) {
    html.classList.add('mobile');
    console.log('Mobile device detected');
  } else {
    html.classList.add('desktop');
    console.log('Desktop device detected');
  }
  
  return { isIOS, isAndroid, isMobileDevice };
};

// Run platform detection
const { isIOS, isAndroid, isMobileDevice } = detectPlatform();
console.log("Platform detection:", { isIOS, isAndroid, isMobileDevice });

// Register service worker for PWA support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('SW registered:', registration);
      })
      .catch(error => {
        console.log('SW registration failed:', error);
      });
  });
}

// Add support for bottom safe area padding on iOS
if (isIOS) {
  // Apply safe area bottom padding to elements with .safe-area-bottom class
  document.body.classList.add('has-ios-padding');
}

// Render the app directly
root.render(
  <AuthProvider>
    <QueryClientProvider client={queryClient}>
      <CurrencyProvider>
        <RouterProvider router={router} />
      </CurrencyProvider>
    </QueryClientProvider>
  </AuthProvider>
);
