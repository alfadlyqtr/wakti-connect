
import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { router } from './router';
import { CurrencyProvider } from './utils/CurrencyProvider';
import ErrorBoundary from '@/components/ui/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <CurrencyProvider>
        <RouterProvider router={router} />
        <Toaster />
      </CurrencyProvider>
    </ErrorBoundary>
  );
}

export default App;
