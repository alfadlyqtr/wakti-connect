
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './App.css'
import { AuthProvider } from './hooks/auth'
import { CurrencyProvider } from './contexts/CurrencyContext'
import ErrorBoundary from './components/ui/ErrorBoundary'
import ErrorFallback from './components/ui/ErrorFallback'

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary fallback={<ErrorFallback 
    error={new Error("Application failed to initialize")} 
    resetErrorBoundary={() => window.location.reload()} 
  />}>
    <AuthProvider>
      <CurrencyProvider>
        <App />
      </CurrencyProvider>
    </AuthProvider>
  </ErrorBoundary>
);
