
import React, { useState, useEffect } from "react";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const ProtectedRoute = ({ 
  children, 
  requiredRole 
}: { 
  children: React.ReactNode;
  requiredRole?: 'free' | 'individual' | 'business';
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Auth error:", error);
          toast({
            variant: "destructive",
            title: "Authentication Error",
            description: "Please sign in again."
          });
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }
        
        // No session
        if (!data.session) {
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }
        
        // We have a session, now check if the profile exists and get the role
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('account_type')
          .eq('id', data.session.user.id)
          .single();
          
        if (profileError) {
          console.error("Profile error:", profileError);
          // Still authenticated, but we'll use 'free' as the default role
          setIsAuthenticated(true);
          setUserRole('free');
          localStorage.setItem('userRole', 'free');
        } else {
          // Successfully got the profile
          setIsAuthenticated(true);
          setUserRole(profileData.account_type);
          localStorage.setItem('userRole', profileData.account_type);
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed in protected route:", event);
        setIsAuthenticated(!!session);
        
        if (event === 'SIGNED_OUT') {
          localStorage.removeItem('userRole');
          navigate('/auth');
        } else if (event === 'SIGNED_IN' && session) {
          // Refresh the role when signing in
          supabase
            .from('profiles')
            .select('account_type')
            .eq('id', session.user.id)
            .single()
            .then(({ data, error }) => {
              if (!error && data) {
                setUserRole(data.account_type);
                localStorage.setItem('userRole', data.account_type);
              }
            });
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [navigate]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // If role is required but user doesn't have it, show an error
  if (requiredRole && userRole && requiredRole !== userRole) {
    // For business routes, redirect to upgrade page if not a business account
    if (requiredRole === 'business' && (userRole === 'free' || userRole === 'individual')) {
      return <Navigate to="/dashboard/upgrade" replace />;
    }
    
    // For other mismatches (this should rarely happen)
    toast({
      variant: "destructive",
      title: "Access Denied",
      description: `This page requires a ${requiredRole} account.`
    });
    
    return <Navigate to="/dashboard" replace />;
  }

  // All checks passed, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
