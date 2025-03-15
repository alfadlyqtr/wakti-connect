
import React, { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Auth from "@/pages/Auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

// Auth callback handler for OAuth providers
const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Handle OAuth redirect
    const handleOAuthRedirect = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        // Redirect to appropriate dashboard based on account type
        if (data?.session) {
          // Get user profile to check account type
          const { data: profileData } = await supabase
            .from('profiles')
            .select('account_type')
            .eq('id', data.session.user.id)
            .single();
          
          if (profileData) {
            // Redirect based on account type
            navigate(`/dashboard/${profileData.account_type}`);
          } else {
            // Default redirect if no profile
            navigate("/dashboard");
          }
        } else {
          navigate("/auth");
        }
      } catch (error) {
        console.error("Error in auth callback:", error);
        toast({
          title: "Authentication Error",
          description: "There was a problem processing your login. Please try again.",
          variant: "destructive",
        });
        navigate("/auth");
      }
    };

    handleOAuthRedirect();
  }, [navigate]);

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="mx-auto h-16 w-16 mb-4">
          <div className="h-16 w-16 border-4 border-t-transparent border-wakti-blue rounded-full animate-spin"></div>
        </div>
        <h2 className="text-2xl font-bold mb-2">Processing authentication...</h2>
        <p className="text-muted-foreground">Please wait while we set up your account.</p>
      </div>
    </div>
  );
};

const AuthRoutes = () => {
  return (
    <Routes>
      <Route path="/auth" element={<Auth />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
    </Routes>
  );
};

export default AuthRoutes;
