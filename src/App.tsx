
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import routes from './routes';
import { CurrencyProvider } from './utils/formatUtils';

const router = createBrowserRouter(routes);

function App() {
  return (
    <CurrencyProvider>
      <RouterProvider router={router} />
      <Toaster />
    </CurrencyProvider>
  );
}

export default App;
