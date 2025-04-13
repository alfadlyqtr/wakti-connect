
// This file is now just a wrapper with no routing logic
// All routing has been moved to router.tsx

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/hooks/use-theme";
import { HelmetProvider } from "react-helmet-async";
import { TaskProvider } from "@/contexts/TaskContext";
import ErrorBoundary from "@/components/ui/ErrorBoundary";

function App() {
  return (
    <div>App is no longer used for routing. Please check router.tsx.</div>
  );
}

export default App;
