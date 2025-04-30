
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import './index.css';
import './App.css';
import { CurrencyProvider } from './contexts/CurrencyContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from "@/components/theme-provider";

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

// Render the app with proper provider hierarchy
root.render(
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="ui-theme">
      <CurrencyProvider>
        <RouterProvider router={router} />
      </CurrencyProvider>
    </ThemeProvider>
  </QueryClientProvider>
);
