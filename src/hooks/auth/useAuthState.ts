
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "./types";
import { UserRole } from "@/types/user";

export function useAuthState() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Initialize auth state from Supabase
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        
        // First set up the auth listener to catch any auth changes
        const { data: authListener } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log("Auth state changed:", event, session?.user?.id);
            
            if (event === 'SIGNED_IN' && session) {
              try {
                // Check if user is a super admin first
                const { data: superAdminData, error: superAdminError } = await supabase
                  .from('super_admins')
                  .select('id')
                  .eq('id', session.user.id)
                  .maybeSingle();
                  
                const isSuperAdmin = !!superAdminData;
                
                if (isSuperAdmin) {
                  console.log("Auth state: User is a super admin");
                  localStorage.setItem('isSuperAdmin', 'true');
                  
                  const userData: User = {
                    ...session.user,
                    name: 'System Administrator',
                    displayName: 'System Administrator',
                    plan: 'super-admin' as UserRole
                  };
                  
                  setUser(userData);
                  return;
                } else {
                  localStorage.setItem('isSuperAdmin', 'false');
                }
                
                // Get user profile data
                const { data: profile, error: profileError } = await supabase
                  .from("profiles")
                  .select("*")
                  .eq("id", session.user.id)
                  .single();
                  
                if (profileError) {
                  console.error("Error fetching profile:", profileError);
                  // Don't throw on PGRST116 (not found) as the trigger might still be creating the profile
                  if (profileError.code !== "PGRST116") {
                    throw profileError;
                  }
                }
                
                const userData: User = {
                  ...session.user,
                  name: profile?.full_name || session.user.email?.split('@')[0],
                  displayName: profile?.display_name || profile?.full_name,
                  plan: (profile?.account_type as UserRole) || "free"
                };
                
                setUser(userData);
              } catch (error) {
                console.error("Error processing sign in:", error);
              }
            } else if (event === 'SIGNED_OUT') {
              setUser(null);
              localStorage.removeItem('isSuperAdmin');
            }
          }
        );
        
        // Then check for existing session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting session:", error);
          return;
        }
        
        if (session?.user) {
          try {
            // Check if user is a super admin first
            const { data: superAdminData, error: superAdminError } = await supabase
              .from('super_admins')
              .select('id')
              .eq('id', session.user.id)
              .maybeSingle();
              
            const isSuperAdmin = !!superAdminData;
            
            if (isSuperAdmin) {
              console.log("Initial session: User is a super admin");
              localStorage.setItem('isSuperAdmin', 'true');
              
              const userData: User = {
                ...session.user,
                name: 'System Administrator',
                displayName: 'System Administrator',
                plan: 'super-admin' as UserRole
              };
              
              setUser(userData);
              setIsLoading(false);
              return;
            } else {
              localStorage.setItem('isSuperAdmin', 'false');
            }
            
            // Get user profile data
            const { data: profile, error: profileError } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", session.user.id)
              .single();
              
            if (profileError) {
              console.error("Error fetching profile:", profileError);
              // Don't throw on PGRST116 (not found) as the profile might not exist yet
              if (profileError.code !== "PGRST116") {
                throw profileError;
              }
            }
            
            const userData: User = {
              ...session.user,
              name: profile?.full_name || session.user.email?.split('@')[0],
              displayName: profile?.display_name || profile?.full_name,
              plan: (profile?.account_type as UserRole) || "free"
            };
            
            setUser(userData);
          } catch (error) {
            console.error("Error processing existing session:", error);
          }
        }
        
        return () => {
          authListener?.subscription.unsubscribe();
        };
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  return { user, setUser, isLoading, setIsLoading };
}
