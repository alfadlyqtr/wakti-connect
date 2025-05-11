
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthShell, ProtectedRoute } from '@/features/auth';
import { authRoutes, businessRoutes, publicRoutes } from '@/routes';

// This is just an example to show how the new imports would work
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth routes */}
        <Route path="auth" element={<AuthShell />}>
          {authRoutes.map((route) => (
            <Route 
              key={route.path} 
              path={`auth/${route.path}`} 
              element={route.element} 
            />
          ))}
        </Route>
        
        {/* Public routes */}
        <Route path="/">
          {publicRoutes.map((route) => (
            <Route 
              key={route.path} 
              path={route.path} 
              element={route.element} 
            />
          ))}
        </Route>
        
        {/* Protected routes */}
        <Route 
          path="dashboard/*" 
          element={
            <ProtectedRoute>
              <div>Dashboard content here</div>
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
