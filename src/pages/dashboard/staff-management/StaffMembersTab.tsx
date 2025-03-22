
import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Users, UserPlus, AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StaffMember } from "./types";
import StaffMemberCard from "./StaffMemberCard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";

interface StaffMembersTabProps {
  onSelectStaff: (staffId: string) => void;
  onOpenCreateDialog: () => void;
}

const StaffMembersTab: React.FC<StaffMembersTabProps> = ({ 
  onSelectStaff, 
  onOpenCreateDialog 
}) => {
  const [retryCount, setRetryCount] = useState(0);
  const [authError, setAuthError] = useState<boolean>(false);

  // Use edge function to get staff members (bypassing RLS issues)
  const { data: staffMembers, isLoading: staffLoading, error: staffError, refetch } = useQuery({
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

  // Refetch when component mounts to ensure we have latest data
  useEffect(() => {
    console.log("StaffMembersTab mounted - refetching data");
    refetch();
  }, [refetch]);

  const handleManualRefetch = () => {
    console.log("Manual refresh triggered");
    setRetryCount(prev => prev + 1);
    refetch();
  };

  const handleSelectStaffMember = (staffId: string) => {
    console.log("Staff selected in tab component:", staffId);
    onSelectStaff(staffId);
  };

  if (staffLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((idx) => (
          <Card key={idx} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="flex gap-2">
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>
                </div>
                
                <Skeleton className="h-6 w-36 mt-4" />
                <Skeleton className="h-4 w-24 mt-2" />
                
                <div className="mt-4 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <div className="flex flex-wrap gap-1 mt-2">
                    <Skeleton className="h-4 w-14 rounded-full" />
                    <Skeleton className="h-4 w-14 rounded-full" />
                    <Skeleton className="h-4 w-14 rounded-full" />
                  </div>
                </div>
                
                <Skeleton className="h-9 w-full mt-4" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (staffError || authError) {
    return (
      <Card className="col-span-full p-8">
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error loading staff</AlertTitle>
          <AlertDescription className="space-y-2">
            <p>{staffError instanceof Error ? staffError.message : "Failed to load staff members"}</p>
            {authError && (
              <p className="font-semibold">There appears to be an authentication issue. Please try refreshing the page or signing in again.</p>
            )}
          </AlertDescription>
        </Alert>
        <div className="flex justify-center mt-4">
          <Button onClick={handleManualRefetch} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
        </div>
      </Card>
    );
  }

  if (!staffMembers || staffMembers.length === 0) {
    return (
      <Card className="col-span-full p-8">
        <div className="text-center">
          <Users className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Staff Members Yet</h3>
          <p className="text-muted-foreground mb-4">Add new staff members to your business.</p>
          <Button onClick={onOpenCreateDialog}>
            <UserPlus className="mr-2 h-4 w-4" />
            Create Staff Account
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleManualRefetch}
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staffMembers.map((member) => (
          <StaffMemberCard 
            key={member.id} 
            member={member} 
            onSelectStaff={handleSelectStaffMember} 
          />
        ))}
      </div>
    </>
  );
};

export default StaffMembersTab;
