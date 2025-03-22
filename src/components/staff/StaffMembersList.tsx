import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, AlertCircle, CheckCircle2, Ban } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { StaffMember } from "@/pages/dashboard/staff-management/types";

interface StaffMembersListProps {
  onEditStaff: (staffId: string) => void;
}

const StaffMembersList: React.FC<StaffMembersListProps> = ({ onEditStaff }) => {
  const queryClient = useQueryClient();
  const [staffToDelete, setStaffToDelete] = React.useState<StaffMember | null>(null);
  const [staffToToggleStatus, setStaffToToggleStatus] = React.useState<StaffMember | null>(null);
  
  // Fetch staff members
  const { data: staffMembers, isLoading } = useQuery({
    queryKey: ['staffMembers'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");
      
      const { data, error } = await supabase
        .from('business_staff')
        .select(`
          *,
          profiles:staff_id (
            avatar_url,
            full_name
          )
        `)
        .eq('business_id', session.user.id)
        .neq('status', 'deleted')
        .order('created_at', { ascending: false });
        
      if (error) throw error;

      // Map the data to match our StaffMember interface
      return (data as any[]).map(staff => {
        const profileData = staff.profiles ? {
          avatar_url: staff.profiles.avatar_url,
          full_name: staff.profiles.full_name
        } : null;

        return {
          ...staff,
          permissions: typeof staff.permissions === 'string' 
            ? JSON.parse(staff.permissions) 
            : staff.permissions,
          profile: profileData
        } as StaffMember;
      });
    }
  });
  
  // Delete staff mutation
  const deleteStaff = useMutation({
    mutationFn: async (staffId: string) => {
      const { error } = await supabase
        .from('business_staff')
        .update({ status: 'deleted' })
        .eq('id', staffId);
        
      if (error) throw error;
      return staffId;
    },
    onSuccess: () => {
      toast({
        title: "Staff Deleted",
        description: "Staff member has been deleted successfully."
      });
      queryClient.invalidateQueries({ queryKey: ['staffMembers'] });
      setStaffToDelete(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "An error occurred while deleting staff",
        variant: "destructive"
      });
    }
  });
  
  // Toggle staff status mutation
  const toggleStaffStatus = useMutation({
    mutationFn: async ({ staffId, newStatus }: { staffId: string; newStatus: string }) => {
      const { error } = await supabase
        .from('business_staff')
        .update({ status: newStatus })
        .eq('id', staffId);
        
      if (error) throw error;
      return { staffId, newStatus };
    },
    onSuccess: (data) => {
      toast({
        title: data.newStatus === 'active' ? "Staff Activated" : "Staff Suspended",
        description: `Staff member has been ${data.newStatus === 'active' ? 'activated' : 'suspended'} successfully.`
      });
      queryClient.invalidateQueries({ queryKey: ['staffMembers'] });
      setStaffToToggleStatus(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "An error occurred while updating staff status",
        variant: "destructive"
      });
    }
  });
  
  if (isLoading) {
    return <div className="py-8 text-center">Loading staff members...</div>;
  }
  
  if (!staffMembers || staffMembers.length === 0) {
    return (
      <Card className="text-center p-8">
        <div className="flex flex-col items-center justify-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No Staff Members</h3>
          <p className="text-muted-foreground mt-2 mb-6">
            You haven't created any staff accounts yet.
          </p>
        </div>
      </Card>
    );
  }
  
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {staffMembers.map((staff) => {
          const fullName = staff.profile?.full_name || staff.name;
          const avatarUrl = staff.profile?.avatar_url || null;
          const isActive = staff.status === 'active';
          
          return (
            <Card key={staff.id} className={isActive ? "" : "opacity-75"}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={avatarUrl || ""} />
                    <AvatarFallback>
                      {fullName ? fullName.substring(0, 2).toUpperCase() : "ST"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex gap-2">
                    <Badge variant={
                      staff.role === 'co-admin' 
                        ? "secondary" 
                        : staff.is_service_provider 
                          ? "outline" 
                          : "secondary"
                    }>
                      {staff.role === 'co-admin' 
                        ? "Co-Admin" 
                        : staff.is_service_provider 
                          ? "Service Provider" 
                          : "Staff"
                      }
                    </Badge>
                    {!isActive && (
                      <Badge variant="destructive">Suspended</Badge>
                    )}
                  </div>
                </div>
                <CardTitle className="mt-2 text-lg">{fullName}</CardTitle>
                <CardDescription>
                  {staff.position || "Staff Member"}
                  {staff.staff_number && (
                    <div className="mt-1 text-xs font-mono">{staff.staff_number}</div>
                  )}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="text-sm">
                <p className="text-muted-foreground">{staff.email}</p>
                
                <div className="mt-4 space-y-1">
                  <p className="text-xs text-muted-foreground font-medium">Permissions:</p>
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(staff.permissions || {})
                      .filter(([_, value]) => value)
                      .map(([key]) => (
                        <Badge key={key} variant="outline" className="text-[9px]">
                          {key.replace('can_', '').replace(/_/g, ' ')}
                        </Badge>
                      ))
                    }
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEditStaff(staff.id)}
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant={isActive ? "destructive" : "outline"}
                    size="sm"
                    onClick={() => setStaffToToggleStatus(staff)}
                  >
                    {isActive ? (
                      <>
                        <Ban className="h-3 w-3 mr-1" />
                        Suspend
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Activate
                      </>
                    )}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setStaffToDelete(staff)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          );
        })}
      </div>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!staffToDelete} onOpenChange={(open) => !open && setStaffToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Staff Member?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the staff member "{staffToDelete?.profile?.full_name || staffToDelete?.name}".
              They will no longer be able to access your business dashboard.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => staffToDelete && deleteStaff.mutate(staffToDelete.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Toggle Status Confirmation Dialog */}
      <AlertDialog 
        open={!!staffToToggleStatus} 
        onOpenChange={(open) => !open && setStaffToToggleStatus(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {staffToToggleStatus?.status === 'active' ? 'Suspend' : 'Activate'} Staff Member?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {staffToToggleStatus?.status === 'active' 
                ? `This will suspend access for "${staffToToggleStatus?.profile?.full_name || staffToToggleStatus?.name}". They will not be able to log in until reactivated.`
                : `This will restore access for "${staffToToggleStatus?.profile?.full_name || staffToToggleStatus?.name}". They will be able to log in again.`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => staffToToggleStatus && toggleStaffStatus.mutate({
                staffId: staffToToggleStatus.id,
                newStatus: staffToToggleStatus.status === 'active' ? 'suspended' : 'active'
              })}
              className={staffToToggleStatus?.status === 'active' 
                ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                : ""
              }
            >
              {staffToToggleStatus?.status === 'active' ? 'Suspend' : 'Activate'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default StaffMembersList;
