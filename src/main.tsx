
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './App.css'
import { AuthProvider } from './hooks/auth'
import { CurrencyProvider } from './contexts/CurrencyContext'
import { ErrorBoundary } from 'react-error-boundary'
import ErrorFallback from './components/ui/ErrorBoundary'

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <AuthProvider>
      <CurrencyProvider>
        <App />
      </CurrencyProvider>
    </AuthProvider>
  </ErrorBoundary>
);
