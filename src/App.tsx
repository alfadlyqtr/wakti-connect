
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";
import { publicRoutes } from "./routes/publicRoutes";
import { authRoutes } from "./routes/authRoutes";
import { dashboardRoutes } from "./routes/dashboardRoutes";
import Header from "./components/landing/Header";
import ScrollToTop from "./components/ui/scroll-to-top";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import { AuthProvider } from "@/hooks/useAuth";
import { TaskProvider } from "@/contexts/TaskContext";
import NotificationListener from "@/components/notifications/NotificationListener";
import ErrorBoundary from "@/components/ui/ErrorBoundary";

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
                    <Route element={<Header />}>
                      {publicRoutes.map((route) => (
                        <Route
                          key={route.path}
                          path={route.path}
                          element={route.element}
                        />
                      ))}
                    </Route>
                    
                    {/* Auth routes */}
                    {authRoutes.map((route) => (
                      <Route
                        key={route.path}
                        path={`/auth/${route.path}`}
                        element={route.element}
                      />
                    ))}
                    
                    {/* Dashboard routes */}
                    <Route
                      path="/dashboard/*"
                      element={
                        <ProtectedRoute>
                          <DashboardLayout>
                            <Routes>
                              {dashboardRoutes.map((route) => (
                                <Route
                                  key={route.path}
                                  path={route.path}
                                  element={route.element}
                                />
                              ))}
                            </Routes>
                          </DashboardLayout>
                        </ProtectedRoute>
                      }
                    />
                    
                    {/* Catch-all redirect */}
                    <Route path="*" element={<Navigate to="/" replace />} />
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
