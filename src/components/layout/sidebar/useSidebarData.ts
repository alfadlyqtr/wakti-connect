
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface SidebarUserData {
  accountType: string;
}

export const useSidebarData = () => {
  const [userData, setUserData] = useState<SidebarUserData | null>(null);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
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
            } else if (data) {
              // Log fetched account type for debugging
              console.log("Sidebar - fetched account type:", data.account_type);
              
              // Store in localStorage for backup access
              localStorage.setItem('userRole', data.account_type);
              
              setUserData({ accountType: data.account_type });
            }
          } else {
            // Use the role from our security definer function
            console.log("Sidebar - fetched role from security definer function:", userRole);
            localStorage.setItem('userRole', userRole);
            setUserData({ accountType: userRole });
          }
        }
      } catch (error) {
        console.error("Failed to fetch sidebar user data:", error);
      }
    };

    fetchUserData();
    
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
  }, []);

  return {
    userData,
    unreadMessagesCount,
    setUnreadMessagesCount
  };
};
