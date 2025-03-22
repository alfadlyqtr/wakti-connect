
import React, { Suspense } from 'react';
import { RouterProvider } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { router } from "@/router";
import { ThemeProvider } from "@/components/ui/theme-provider";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const App = () => {
  return (
    <ThemeProvider defaultTheme="light" storageKey="wakti-theme">
      <Suspense fallback={<LoadingSpinner />}>
        <RouterProvider router={router} />
      </Suspense>
      <Toaster />
    </ThemeProvider>
  );
};

export default App;
