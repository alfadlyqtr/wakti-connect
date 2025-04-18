// This file is now just a wrapper with no routing logic
// All routing has been moved to router.tsx

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/hooks/use-theme";
import { HelmetProvider } from "react-helmet-async";
import { TaskProvider } from "@/contexts/TaskContext";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";

// Import the new AI Assistant styles
import './styles/ai-assistant.css';

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <TooltipProvider>
          <TaskProvider>
            <ErrorBoundary>
              <RouterProvider router={router} />
              <Toaster />
              <Sonner />
            </ErrorBoundary>
          </TaskProvider>
        </TooltipProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
