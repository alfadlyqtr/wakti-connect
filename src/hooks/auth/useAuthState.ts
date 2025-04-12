
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "./types";
import { UserRole } from "@/types/user";

// Correct ID for the super admin
const SUPER_ADMIN_ID = "28e863b3-0a91-4220-8330-fbee7ecd3f96";

export function useAuthState() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Initialize auth state from Supabase
  useEffect(() => {
    let isMounted = true;
    
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        
        // First set up the auth listener to catch any auth changes
        const { data: authListener } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log("Auth state changed:", event, session?.user?.id);
            
            if (!isMounted) return;
            
            if (event === 'SIGNED_IN' && session) {
              try {
                // Check if user is the hard-coded super admin ID first
                if (session.user.id === SUPER_ADMIN_ID) {
                  console.log("Auth state: User is the hard-coded super admin");
                  localStorage.setItem('isSuperAdmin', 'true');
                  
                  const userData: User = {
                    ...session.user,
                    name: 'System Administrator',
                    displayName: 'System Administrator',
                    plan: 'super-admin' as UserRole
                  };
                  
                  setUser(userData);
                  return;
                }
                
                // Check if user is a super admin in the database
                const { data: superAdminData } = await supabase
                  .from('super_admins')
                  .select('id')
                  .eq('id', session.user.id)
                  .maybeSingle();
                  
                if (superAdminData) {
                  console.log("Auth state: User is a database super admin");
                  localStorage.setItem('isSuperAdmin', 'true');
                  
                  const userData: User = {
                    ...session.user,
                    name: 'System Administrator',
                    displayName: 'System Administrator',
                    plan: 'super-admin' as UserRole
                  };
                  
                  if (isMounted) setUser(userData);
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
        
        // Then check for existing session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting session:", error);
          if (isMounted) setIsLoading(false);
          return;
        }
        
        if (session?.user) {
          try {
            // Check if user is the hard-coded super admin ID
            if (session.user.id === SUPER_ADMIN_ID) {
              console.log("Initial session: User is the hard-coded super admin");
              localStorage.setItem('isSuperAdmin', 'true');
              
              const userData: User = {
                ...session.user,
                name: 'System Administrator',
                displayName: 'System Administrator',
                plan: 'super-admin' as UserRole
              };
              
              if (isMounted) {
                setUser(userData);
                setIsLoading(false);
              }
              return;
            }
            
            // Check if user is a super admin in the database
            const { data: superAdminData } = await supabase
              .from('super_admins')
              .select('id')
              .eq('id', session.user.id)
              .maybeSingle();
              
            if (superAdminData) {
              console.log("Initial session: User is a database super admin");
              localStorage.setItem('isSuperAdmin', 'true');
              
              const userData: User = {
                ...session.user,
                name: 'System Administrator',
                displayName: 'System Administrator',
                plan: 'super-admin' as UserRole
              };
              
              if (isMounted) {
                setUser(userData);
                setIsLoading(false);
              }
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
            
            if (isMounted) setUser(userData);
          } catch (error) {
            console.error("Error processing existing session:", error);
          }
        }
        
        // Always set loading to false to not block rendering
        if (isMounted) setIsLoading(false);
      } catch (error) {
        console.error("Error initializing auth:", error);
        if (isMounted) setIsLoading(false);
      }
    };

    initializeAuth();
    
    return () => {
      isMounted = false;
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return { user, setUser, isLoading, setIsLoading };
}
