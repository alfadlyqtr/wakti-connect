
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { User } from '@/types/auth.types';
import { 
  getUserRole, 
  getBusinessId, 
  getUserProfile, 
  createDefaultProfile 
} from '@/services/auth/authService';

export function useUserData() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUserData = async (session: any) => {
    try {
      if (!session?.user) {
        setUser(null);
        return;
      }
      
      console.log("Found active session for user:", session.user.id);
      
      const userRole = await getUserRole(session.user.id);
      console.log("User role:", userRole);
      
      if (!userRole) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          plan: "free"
        });
        return;
      }
      
      const businessId = await getBusinessId(session.user.id, userRole);
      
      let profile = await getUserProfile(session.user.id);
      
      if (!profile) {
        console.log("Profile not found for user, attempting to create default profile");
        profile = await createDefaultProfile(session.user.id, session.user.email, userRole);
      }
      
      setUser({
        id: session.user.id,
        email: session.user.email,
        name: profile?.full_name || session.user.email?.split('@')[0],
        displayName: profile?.display_name || profile?.full_name,
        plan: userRole as any,
        businessId
      });
      
    } catch (error) {
      console.error("Error loading user data:", error);
      if (session?.user) {
        // Minimal user object if we fail to load complete data
        setUser({
          id: session.user.id,
          email: session.user.email,
          plan: "free"
        });
      } else {
        setUser(null);
      }
    }
  };

  const refreshUserData = async () => {
    setIsLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    await loadUserData(session);
    setIsLoading(false);
  };

  useEffect(() => {
    let isMounted = true;
    const timeoutId = setTimeout(() => {
      if (isMounted && isLoading) {
        console.warn("Auth loading timeout - forcing completion to prevent blocking UI");
        setIsLoading(false);
      }
    }, 5000); // 5 second safety timeout

    const initAuth = async () => {
      try {
        setIsLoading(true);
        
        const { data: { session } } = await supabase.auth.getSession();
        await loadUserData(session);
        
      } catch (error) {
        console.error("Error loading user:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initAuth();
    
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session?.user?.id);
        
        if (event === 'SIGNED_IN' && session) {
          setIsLoading(true);
          await loadUserData(session);
          setIsLoading(false);
        } else if (event === 'SIGNED_OUT') {
          console.log("User signed out, clearing state");
          setUser(null);
        }
      }
    );

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    setUser,
    isLoading,
    setIsLoading,
    loadUserData,
    refreshUserData
  };
}
