
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Users, UserPlus, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StaffMember } from "./types";
import StaffMemberCard from "./StaffMemberCard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface StaffMembersTabProps {
  onSelectStaff: (staffId: string) => void;
  onOpenCreateDialog: () => void;
}

const StaffMembersTab: React.FC<StaffMembersTabProps> = ({ 
  onSelectStaff, 
  onOpenCreateDialog 
}) => {
  // Use a different approach that doesn't trigger RLS recursion
  const { data: staffMembers, isLoading: staffLoading, error: staffError, refetch } = useQuery({
    queryKey: ['businessStaff'],
    queryFn: async () => {
      try {
        const { data: session } = await supabase.auth.getSession();
        
        if (!session?.session?.user) {
          throw new Error('Not authenticated');
        }
        
        console.log("Fetching staff with auth user:", session.session.user.id);
        
        // Call the edge function to bypass RLS issues
        const { data, error } = await supabase.functions.invoke("fetch-staff-members", {
          body: { businessId: session.session.user.id },
          headers: {
            Authorization: `Bearer ${session.session.access_token}`
          }
        });
        
        if (error) {
          console.error("Error calling fetch-staff-members:", error);
          throw new Error(error.message || "Failed to fetch staff members");
        }
        
        if (!data?.success) {
          throw new Error(data?.error || "Failed to fetch staff members");
        }
        
        console.log("Staff members retrieved:", data.staffMembers?.length);
        
        return data.staffMembers || [];
      } catch (error: any) {
        console.error("Error in staff query:", error);
        throw error;
      }
    },
    retry: 1,
    refetchOnWindowFocus: false,
  });

  // Refetch when component mounts to ensure we have latest data
  React.useEffect(() => {
    refetch();
  }, [refetch]);

  const handleSelectStaffMember = (staffId: string) => {
    console.log("Staff selected in tab component:", staffId);
    onSelectStaff(staffId);
  };

  if (staffLoading) {
    return (
      <Card className="col-span-full flex justify-center p-8">
        <div className="h-8 w-8 border-4 border-t-transparent border-primary rounded-full animate-spin"></div>
      </Card>
    );
  }

  if (staffError) {
    return (
      <Card className="col-span-full p-8">
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error loading staff</AlertTitle>
          <AlertDescription>
            {staffError instanceof Error ? staffError.message : "Failed to load staff members"}
          </AlertDescription>
        </Alert>
        <div className="flex justify-center mt-4">
          <Button onClick={() => refetch()}>Try Again</Button>
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {staffMembers.map((member) => (
        <StaffMemberCard 
          key={member.id} 
          member={member} 
          onSelectStaff={handleSelectStaffMember} 
        />
      ))}
    </div>
  );
};

export default StaffMembersTab;
