
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { getUserRoleInfo } from "@/services/permissions/accessControlService";

export interface SidebarUserData {
  accountType: string;
  businessId?: string;
}

export const useSidebarData = () => {
  const [userData, setUserData] = useState<SidebarUserData | null>(null);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          // First, try to get role info from access_control_manager
          const roleInfo = await getUserRoleInfo();
          
          if (roleInfo) {
            console.log("Sidebar - fetched role info from access_control_manager:", roleInfo);
            
            // Store the role and business id for permission checks
            setUserData({ 
              accountType: roleInfo.role,
              businessId: roleInfo.businessId
            });
            localStorage.setItem('userRole', roleInfo.role);
            return;
          }
          
          // If no role info, fall back to current methods
          try {
            // Use our security definer function to get user role
            const { data: userRole, error: roleError } = await supabase.rpc('get_user_role');
            
            if (roleError) {
              console.error("Error getting user role:", roleError);
              // Fallback to profile query
              const { data, error } = await supabase
                .from('profiles')
                .select('account_type')
                .eq('id', session.user.id)
                .single();
  
              if (error) {
                console.error("Error fetching user data for sidebar:", error);
                
                // Last resort: try to get role from auth context
                if (user?.plan) {
                  console.log("Using role from auth context:", user.plan);
                  setUserData({ accountType: user.plan });
                  localStorage.setItem('userRole', user.plan);
                }
              } else if (data) {
                console.log("Sidebar - fetched account type:", data.account_type);
                localStorage.setItem('userRole', data.account_type);
                setUserData({ accountType: data.account_type });
              }
            } else {
              // Use the role from our security definer function
              console.log("Sidebar - fetched role from security definer function:", userRole);
              localStorage.setItem('userRole', userRole);
              setUserData({ accountType: userRole });
            }
          } catch (error) {
            console.error("Error in role fetch process:", error);
          }
        }
      } catch (error) {
        console.error("Failed to fetch sidebar user data:", error);
        
        // Try to recover from localStorage as last resort
        const storedRole = localStorage.getItem('userRole');
        if (storedRole) {
          console.log("Using stored role from localStorage:", storedRole);
          setUserData({ accountType: storedRole });
        }
      }
    };

    if (user?.id) {
      fetchUserData();
    }
    
    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        fetchUserData();
      } else {
        setUserData(null);
        localStorage.removeItem('userRole');
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [user]);

  return {
    userData,
    unreadMessagesCount,
    setUnreadMessagesCount
  };
};
