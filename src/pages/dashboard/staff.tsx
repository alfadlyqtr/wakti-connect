
import React, { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, Users, RefreshCcw } from "lucide-react";
import { StaffList } from "@/components/staff/StaffList";
import { StaffDialog } from "@/components/staff/StaffDialog";
import { useToast } from "@/components/ui/use-toast";
import { StaffMember } from "@/types/staff";

export default function StaffPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [staffDialogOpen, setStaffDialogOpen] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  
  // Fetch current user session
  const { data: sessionData } = useQuery({
    queryKey: ['sessionData'],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data;
    }
  });
  
  // Fetch staff members
  const { 
    data: staffMembersData, 
    isLoading, 
    error,
    refetch
  } = useQuery({
    queryKey: ['staffMembers'],
    queryFn: async () => {
      if (!sessionData?.session?.user?.id) {
        throw new Error("Not authenticated");
      }
      
      const businessId = sessionData.session.user.id;
      console.log("Staff page fetching staff for business:", businessId);
      
      const { data, error } = await supabase
        .from('business_staff')
        .select('*')
        .eq('business_id', businessId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching staff:", error);
        throw new Error(error.message || "Failed to fetch staff members");
      }
      
      console.log(`Staff page found ${data?.length || 0} staff members:`, data);
      
      return data || [];
    },
    enabled: !!sessionData?.session?.user?.id,
    refetchOnMount: true,
    refetchOnWindowFocus: true
  });

  // Force refetch when component mounts
  useEffect(() => {
    refetch();
  }, [refetch]);

  // Convert to StaffMember type
  const staffMembers: StaffMember[] = (staffMembersData || []).map(staff => ({
    id: staff.id,
    staff_id: staff.staff_id,
    business_id: staff.business_id,
    name: staff.name,
    email: staff.email,
    position: staff.position || '',
    role: staff.role,
    status: staff.status,
    is_service_provider: !!staff.is_service_provider,
    permissions: typeof staff.permissions === 'string' 
      ? JSON.parse(staff.permissions as string) 
      : staff.permissions || {},
    staff_number: staff.staff_number || '',
    profile_image_url: staff.profile_image_url,
    created_at: staff.created_at
  }));

  // Staff count for checking limits
  const staffCount = staffMembers?.length || 0;
  const canAddMoreStaff = staffCount < 6;

  const handleAddStaff = () => {
    setSelectedStaffId(null);
    setStaffDialogOpen(true);
  };

  const handleEditStaff = (staffId: string) => {
    setSelectedStaffId(staffId);
    setStaffDialogOpen(true);
  };

  const handleStaffCreated = () => {
    toast({
      title: "Success",
      description: selectedStaffId 
        ? "Staff member updated successfully"
        : "Staff member added successfully",
    });
    
    // Force refetch from the server
    queryClient.invalidateQueries({ queryKey: ['staffMembers'] });
    refetch();
    
    setStaffDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">Staff Management</h1>
          <p className="text-muted-foreground">
            Manage your team members and their permissions
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => refetch()}
            title="Refresh"
          >
            <RefreshCcw className="h-4 w-4" />
          </Button>
          
          <Button 
            onClick={handleAddStaff} 
            disabled={!canAddMoreStaff}
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Add Staff Member
          </Button>
        </div>
      </div>
      
      {!canAddMoreStaff && (
        <Card className="p-4 bg-amber-50 border-amber-200">
          <div className="flex items-center gap-2 text-amber-700">
            <Users className="h-5 w-5" />
            <p className="text-sm font-medium">
              Staff limit reached (6/6). Business plan allows up to 6 staff members.
            </p>
          </div>
        </Card>
      )}
      
      <StaffList 
        staffMembers={staffMembers}
        isLoading={isLoading}
        error={error as Error | null}
        onEdit={handleEditStaff}
        onRefresh={refetch}
      />
      
      <StaffDialog
        staffId={selectedStaffId}
        open={staffDialogOpen}
        onOpenChange={setStaffDialogOpen}
        onSuccess={handleStaffCreated}
      />
    </div>
  );
};
