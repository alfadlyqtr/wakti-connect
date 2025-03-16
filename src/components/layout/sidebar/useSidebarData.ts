
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
          const { data, error } = await supabase
            .from('profiles')
            .select('account_type')
            .eq('id', session.user.id)
            .single();

          if (error) {
            console.error("Error fetching user data:", error);
          } else if (data) {
            setUserData({ accountType: data.account_type });
          }
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserData();
  }, []);

  return {
    userData,
    unreadMessagesCount,
    setUnreadMessagesCount
  };
};
