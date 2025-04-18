
// Import React and ReactDOM
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import './index.css';
import './App.css';
import { AuthProvider } from './hooks/auth';
import { CurrencyProvider } from './contexts/CurrencyContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react'; // Explicitly import React

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

// Render the app directly with React.StrictMode
root.render(
  <React.StrictMode>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <CurrencyProvider>
          <RouterProvider router={router} />
        </CurrencyProvider>
      </QueryClientProvider>
    </AuthProvider>
  </React.StrictMode>
);
