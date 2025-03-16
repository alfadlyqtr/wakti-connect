
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";
import PublicRoutes from "./routes/publicRoutes";
import AuthRoutes from "./routes/authRoutes";
import DashboardRoutes from "./routes/dashboardRoutes";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import VerificationPage from "./pages/auth/VerificationPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes - using exact path for the root */}
            <Route path="/" element={<PublicRoutes />} />
            
            {/* Auth routes */}
            <Route path="/auth/*" element={<AuthRoutes />} />
            
            {/* Direct auth-related pages for deep linking */}
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/verify-email" element={<VerificationPage />} />
            
            {/* Dashboard routes */}
            <Route path="/dashboard/*" element={<DashboardRoutes />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
