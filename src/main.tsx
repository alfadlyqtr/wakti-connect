
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './App.css'
import { AuthProvider } from './hooks/auth'
import { CurrencyProvider } from './contexts/CurrencyContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Create a client
const queryClient = new QueryClient()

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <CurrencyProvider>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </CurrencyProvider>
  </AuthProvider>
);
