
import React from 'react';
import { Outlet } from 'react-router-dom';
import { AuthProvider } from "@/features/auth";
import { ThemeProvider } from "next-themes";

function App() {
  return (
    <ThemeProvider 
      attribute="class" 
      defaultTheme="system" 
      enableSystem 
      disableTransitionOnChange
    >
      <AuthProvider>
        <Outlet />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
