
// Import React and ReactDOM
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import './index.css';
import './App.css';
import { AuthProvider } from './hooks/auth';
import { CurrencyProvider } from './contexts/CurrencyContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a client for React Query
const queryClient = new QueryClient();

// Create the root with immediate access to the DOM element
const rootElement = document.getElementById("root");
const root = createRoot(rootElement!);

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
