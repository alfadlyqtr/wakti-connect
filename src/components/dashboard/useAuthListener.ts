
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export const useAuthListener = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed in dashboard layout:", event);
      
      if (event === 'SIGNED_OUT') {
        // Clear stored user role on sign out
        localStorage.removeItem('userRole');
        navigate("/auth");
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [navigate]);
};
