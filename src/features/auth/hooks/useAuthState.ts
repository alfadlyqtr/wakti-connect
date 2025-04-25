
// Direct import from new location
import { AppUser } from "../types";
import { UserRole } from "@/types/user";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";

const SUPER_ADMIN_ID = "28e863b3-0a91-4220-8330-fbee7ecd3f96";

export function useAuthState() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    let isMounted = true;
    let authListenerSubscription: { subscription: { unsubscribe: () => void } } | null = null;
    
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        
        const { data: listener } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log("Auth state changed:", event, session?.user?.id);
            
            if (!isMounted) return;
            
            if (event === 'SIGNED_IN' && session) {
              try {
                if (session.user.id === SUPER_ADMIN_ID) {
                  console.log("Auth state: User is the hard-coded super admin");
                  localStorage.setItem('isSuperAdmin', 'true');
                  
                  const userData: AppUser = {
                    ...session.user,
                    name: 'System Administrator',
                    displayName: 'System Administrator',
                    plan: 'super-admin' as UserRole,
                    role: 'super-admin' as UserRole
                  };
                  
                  setUser(userData);
                  return;
                }
                
                localStorage.setItem('isSuperAdmin', 'false');

                const { data: profile, error: profileError } = await supabase
                  .from("profiles")
                  .select("*")
                  .eq("id", session.user.id)
                  .single();
                  
                if (profileError) {
                  console.error("Error fetching profile:", profileError);
                  if (profileError.code !== "PGRST116") {
                    throw profileError;
                  }
                }
                
                const userData: AppUser = {
                  ...session.user,
                  name: profile?.full_name || session.user.email?.split('@')[0],
                  displayName: profile?.display_name || profile?.full_name,
                  plan: (profile?.account_type as UserRole) || "individual",
                  role: (profile?.account_type as UserRole) || "individual"
                };
                
                if (isMounted) setUser(userData);
              } catch (error) {
                console.error("Error processing sign in:", error);
              }
            } else if (event === 'SIGNED_OUT') {
              if (isMounted) setUser(null);
              localStorage.removeItem('isSuperAdmin');
            }
            
            if (isMounted) setIsLoading(false);
          }
        );
        
        authListenerSubscription = listener;
        
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting session:", error);
          if (isMounted) setIsLoading(false);
          return;
        }
        
        if (session?.user) {
          try {
            if (session.user.id === SUPER_ADMIN_ID) {
              console.log("Initial session: User is the hard-coded super admin");
              localStorage.setItem('isSuperAdmin', 'true');
              
              const userData: AppUser = {
                ...session.user,
                name: 'System Administrator',
                displayName: 'System Administrator',
                plan: 'super-admin' as UserRole,
                role: 'super-admin' as UserRole
              };
              
              if (isMounted) {
                setUser(userData);
                setIsLoading(false);
              }
              return;
            }
            
            localStorage.setItem('isSuperAdmin', 'false');
            
            const { data: profile, error: profileError } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", session.user.id)
              .single();
              
            if (profileError) {
              console.error("Error fetching profile:", profileError);
              if (profileError.code !== "PGRST116") {
                throw profileError;
              }
            }
            
            const userData: AppUser = {
              ...session.user,
              name: profile?.full_name || session.user.email?.split('@')[0],
              displayName: profile?.display_name || profile?.full_name,
              plan: (profile?.account_type as UserRole) || "individual",
              role: (profile?.account_type as UserRole) || "individual"
            };
            
            if (isMounted) setUser(userData);
          } catch (error) {
            console.error("Error processing existing session:", error);
          }
        }
        
        if (isMounted) setIsLoading(false);
      } catch (error) {
        console.error("Error initializing auth:", error);
        if (isMounted) setIsLoading(false);
      }
    };

    initializeAuth();
    
    return () => {
      isMounted = false;
      if (authListenerSubscription?.subscription) {
        authListenerSubscription.subscription.unsubscribe();
      }
    };
  }, []);

  return { user, setUser, isLoading, setIsLoading };
}
