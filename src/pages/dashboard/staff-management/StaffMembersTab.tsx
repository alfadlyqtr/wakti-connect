
import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RefreshCcw, UserPlus, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import StaffMemberCard from "./StaffMemberCard";
import { StaffMember } from "./types"; // Import the local types

interface StaffMembersTabProps {
  onSelectStaff: (staffId: string | null) => void;
  onOpenCreateDialog: () => void;
}

const StaffMembersTab: React.FC<StaffMembersTabProps> = ({ 
  onSelectStaff,
  onOpenCreateDialog
}) => {
  // Session and business ID
  const [businessId, setBusinessId] = useState<string | null>(null);
  
  // Get the current session to check the business ID
  const { data: session, isLoading: isSessionLoading } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user?.id) {
        setBusinessId(data.session.user.id);
      }
      return data.session;
    },
  });
  
  // Fetch staff members directly from the database
  const { 
    data: staffMembers, 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['staffMembers', businessId],
    queryFn: async () => {
      if (!businessId) throw new Error("Business ID not available");
      
      const { data, error } = await supabase
        .from('business_staff')
        .select('*')
        .eq('business_id', businessId)
        .order('created_at', { ascending: false });
        
      if (error) throw new Error(error.message);
      
      // Convert permissions from JSON if needed and ensure we have proper types
      return data.map(staff => ({
        ...staff,
        permissions: typeof staff.permissions === 'string' 
          ? JSON.parse(staff.permissions) 
          : staff.permissions,
        // Ensure email is always populated (required by the local StaffMember type)
        email: staff.email || '',
      })) as StaffMember[];
    },
    enabled: !!businessId,
  });

  // Staff count for checking limits
  const staffCount = staffMembers?.length || 0;
  const canAddMoreStaff = staffCount < 6;
  
  // Show loading state while fetching session
  if (isSessionLoading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">Loading session data...</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Handle no session case
  if (!session) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Authentication Error</AlertTitle>
        <AlertDescription>
          You need to be logged in to view staff members.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-medium">Staff Members ({staffCount}/6)</h3>
          <p className="text-sm text-muted-foreground">
            Manage your team members and their permissions
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => refetch()}
            title="Refresh staff list"
          >
            <RefreshCcw className="h-4 w-4" />
          </Button>
          
          <Button 
            onClick={onOpenCreateDialog} 
            disabled={!canAddMoreStaff}
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Add Staff
          </Button>
        </div>
      </div>
      
      {!canAddMoreStaff && (
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-amber-700">
              <Users className="h-5 w-5" />
              <p className="text-sm font-medium">
                Staff limit reached (6/6). Business plan allows up to 6 staff members.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
      
      {isLoading ? (
        <p className="text-center text-muted-foreground py-8">Loading staff members...</p>
      ) : error ? (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error instanceof Error ? error.message : "Failed to load staff members"}
          </AlertDescription>
        </Alert>
      ) : staffMembers?.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">No staff members found. Add your first staff member to get started.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {staffMembers?.map((member) => (
            <StaffMemberCard
              key={member.id}
              member={member}
              onSelectStaff={() => onSelectStaff(member.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default StaffMembersTab;
