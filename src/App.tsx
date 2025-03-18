
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";
import PublicRoutes from "./routes/publicRoutes";
import AuthRoutes from "./routes/authRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import VerificationPage from "./pages/auth/VerificationPage";
import Header from "./components/landing/Header";
import ScrollToTop from "./components/ui/scroll-to-top";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import { AuthProvider } from "@/hooks/useAuth";
import { TaskProvider } from "@/contexts/TaskContext";
import NotificationListener from "@/components/notifications/NotificationListener";
import ErrorBoundary from "@/components/ui/ErrorBoundary";

// Import i18n
import "./i18n/i18n";

const queryClient = new QueryClient();

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="system">
          <AuthProvider>
            <TaskProvider>
              <TooltipProvider>
                <BrowserRouter>
                  <ScrollToTop />
                  <NotificationListener />
                  <Toaster />
                  <Sonner />
                  <Routes>
                    {/* Public routes with Header */}
                    <Route path="/" element={<Header />}>
                      {PublicRoutes}
                    </Route>
                    
                    {/* Auth routes */}
                    <Route path="/auth/*" element={<AuthRoutes />} />
                    
                    {/* Direct auth-related pages for deep linking */}
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="/reset-password" element={<ResetPasswordPage />} />
                    <Route path="/verify-email" element={<VerificationPage />} />
                    
                    {/* Dashboard routes - wrapped in ProtectedRoute */}
                    <Route 
                      path="/dashboard/*" 
                      element={
                        <ProtectedRoute>
                          <DashboardLayout>
                            <Routes>
                              {dashboardRoutes.map((route, index) => (
                                <Route 
                                  key={index}
                                  path={route.path}
                                  element={route.element}
                                  index={route.index}
                                />
                              ))}
                            </Routes>
                          </DashboardLayout>
                        </ProtectedRoute>
                      } 
                    />
                  </Routes>
                </BrowserRouter>
              </TooltipProvider>
            </TaskProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
