
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { StaffMember } from "@/pages/dashboard/staff-management/types";

export const useStaffMembers = () => {
  const [retryCount, setRetryCount] = useState(0);
  const [authError, setAuthError] = useState<boolean>(false);
  
  // Use edge function to get staff members (bypassing RLS issues)
  const { 
    data: staffMembers, 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['businessStaff', retryCount],
    queryFn: async () => {
      try {
        // Get fresh session
        const { data: session, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          setAuthError(true);
          throw new Error('Authentication error: ' + sessionError.message);
        }
        
        if (!session?.session?.user) {
          console.error("No authenticated user found");
          setAuthError(true);
          throw new Error('Not authenticated');
        }
        
        console.log("Fetching staff with auth user:", session.session.user.id);
        
        // Call the edge function to bypass RLS issues
        const response = await supabase.functions.invoke("fetch-staff-members", {
          body: { businessId: session.session.user.id },
          headers: {
            Authorization: `Bearer ${session.session.access_token}`
          }
        });
        
        // Check if response has error
        if (response.error) {
          console.error("Edge function error:", response.error);
          
          // Handle 401 error (unauthorized)
          const statusCode = response.error?.code || 500;
          if (statusCode === 401) {
            console.log("Attempting to refresh auth token...");
            setAuthError(true);
            const { error: refreshError } = await supabase.auth.refreshSession();
            if (refreshError) {
              console.error("Error refreshing token:", refreshError);
            } else {
              console.log("Token refreshed successfully, please try again");
            }
          }
          
          throw new Error(`Edge function error (${statusCode}): ${response.error.message}`);
        }
        
        // Extract data from the response
        const data = response.data;
        
        if (!data?.success) {
          console.error("Error in function response:", data?.error, data?.details);
          throw new Error(data?.error || "Failed to fetch staff members");
        }
        
        console.log("Staff members retrieved:", data.staffMembers?.length);
        setAuthError(false);
        
        return data.staffMembers || [];
      } catch (error: any) {
        console.error("Error in staff query:", error);
        toast({
          title: "Error loading staff members",
          description: error.message || "Failed to fetch staff data",
          variant: "destructive",
        });
        throw error;
      }
    },
    retry: 2,
    refetchOnWindowFocus: false,
  });

  const handleManualRefetch = () => {
    console.log("Manual refresh triggered");
    setRetryCount(prev => prev + 1);
    refetch();
  };

  return {
    staffMembers,
    isLoading,
    error,
    authError,
    refetch,
    handleManualRefetch
  };
};
