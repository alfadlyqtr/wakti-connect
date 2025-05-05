
import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { AuthProvider } from "@/features/auth";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from "next-themes";

// Create a client for React Query with improved caching
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime)
    },
  },
});

// Preload critical permissions
const preloadPermissions = async () => {
  const commonPermissions = [
    'staff_management',
    'booking_system',
    'business_analytics'
  ];
  
  // Prefetch direct permissions check
  commonPermissions.forEach(feature => {
    queryClient.prefetchQuery({
      queryKey: ['direct-permission', feature],
      queryFn: () => Promise.resolve(null), // Will be properly fetched when needed
      staleTime: 0 // Ensure it's refetched when actually needed
    });
  });
};

function App() {
  React.useEffect(() => {
    preloadPermissions();
  }, []);
  
  return (
    <ThemeProvider 
      attribute="class" 
      defaultTheme="system" 
      enableSystem 
      disableTransitionOnChange
    >
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
