
import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { router } from './router';
import { CurrencyProvider } from './utils/formatUtils';

function App() {
  return (
    <CurrencyProvider>
      <RouterProvider router={router} />
      <Toaster />
    </CurrencyProvider>
  );
}

export default App;
