
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Users, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StaffMember } from "./types";
import StaffMemberCard from "./StaffMemberCard";

interface StaffMembersTabProps {
  onSelectStaff: (staffId: string) => void;
  onOpenCreateDialog: () => void;
}

const StaffMembersTab: React.FC<StaffMembersTabProps> = ({ 
  onSelectStaff, 
  onOpenCreateDialog 
}) => {
  // Fetch staff members
  const { data: staffMembers, isLoading: staffLoading, error: staffError, refetch } = useQuery({
    queryKey: ['businessStaff'],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session?.user) {
        throw new Error('Not authenticated');
      }
      
      // First fetch the business staff records
      const { data: staffData, error: staffError } = await supabase
        .from('business_staff')
        .select('*')
        .eq('business_id', session.session.user.id)
        .neq('status', 'deleted');
        
      if (staffError) throw staffError;
      
      // Now fetch profile data for each staff member
      const staffWithProfiles = await Promise.all(
        staffData.map(async (staff) => {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('full_name, avatar_url')
            .eq('id', staff.staff_id)
            .single();
            
          return {
            ...staff,
            profile: profileError ? { 
              full_name: staff.name, 
              avatar_url: staff.profile_image_url || null 
            } : {
              ...profileData,
              avatar_url: profileData?.avatar_url || staff.profile_image_url || null
            }
          } as StaffMember;
        })
      );
      
      return staffWithProfiles;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Refetch when component mounts to ensure we have latest data
  React.useEffect(() => {
    refetch();
  }, [refetch]);

  if (staffLoading) {
    return (
      <Card className="col-span-full flex justify-center p-8">
        <div className="h-8 w-8 border-4 border-t-transparent border-wakti-blue rounded-full animate-spin"></div>
      </Card>
    );
  }

  if (staffError) {
    return (
      <Card className="col-span-full p-8">
        <p className="text-center text-destructive">Error loading staff members</p>
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
          onSelectStaff={onSelectStaff} 
        />
      ))}
    </div>
  );
};

export default StaffMembersTab;
