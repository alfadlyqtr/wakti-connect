
// THIS FILE IS NO LONGER USED FOR ROUTING
// All routing has been moved to router.tsx
// This file is kept for reference only

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/hooks/use-theme";
import { HelmetProvider } from "react-helmet-async";
import { TaskProvider } from "@/contexts/TaskContext";
import NotificationListener from "@/components/notifications/NotificationListener";
import ErrorBoundary from "@/components/ui/ErrorBoundary";

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="system">
        <HelmetProvider>
          <TaskProvider>
            <TooltipProvider>
              <NotificationListener />
              <Toaster />
              <Sonner />
              {/* All routing has been moved to router.tsx */}
              <div>This component is no longer used for routing.</div>
            </TooltipProvider>
          </TaskProvider>
        </HelmetProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
