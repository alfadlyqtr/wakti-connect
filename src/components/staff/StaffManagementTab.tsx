
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  UserPlus, 
  BriefcaseBusiness, 
  Calendar, 
  MessageSquare, 
  FileCheck, 
  ChartBar,
  UserCog,
  Ban,
  PowerOff,
  Check,
  X,
  AlertTriangle
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
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
import { toast } from "@/components/ui/use-toast";
import CreateStaffDialog from "./CreateStaffDialog";
import EditStaffDialog from "./EditStaffDialog";
import StaffPermissionsDisplay from "./StaffPermissionsDisplay";

interface StaffMember {
  id: string;
  name: string;
  email: string | null;
  role: string;
  position: string;
  created_at: string;
  staff_number: string;
  is_service_provider: boolean;
  status: 'active' | 'suspended' | 'deleted';
  profile_image_url: string | null;
  permissions: {
    can_track_hours: boolean;
    can_message_staff: boolean;
    can_create_job_cards: boolean;
    can_view_own_analytics: boolean;
  };
}

const StaffManagementTab = () => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [suspendingStaff, setSuspendingStaff] = useState<StaffMember | null>(null);
  const [deletingStaff, setDeletingStaff] = useState<StaffMember | null>(null);
  const [reactivatingStaff, setReactivatingStaff] = useState<StaffMember | null>(null);

  // Fetch staff members
  const { data: staffMembers, isLoading: staffLoading, error: staffError, refetch } = useQuery({
    queryKey: ['businessStaff'],
    queryFn: async () => {
      const { data: staffData, error: staffError } = await supabase
        .from('business_staff')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (staffError) throw staffError;
      return staffData as StaffMember[];
    }
  });

  const handleStatusChange = async (staff: StaffMember, newStatus: 'active' | 'suspended' | 'deleted') => {
    try {
      const { error } = await supabase
        .from('business_staff')
        .update({ status: newStatus })
        .eq('id', staff.id);
        
      if (error) throw error;
      
      let message = '';
      switch (newStatus) {
        case 'active':
          message = `${staff.name} has been reactivated`;
          break;
        case 'suspended':
          message = `${staff.name} has been suspended`;
          break;
        case 'deleted':
          message = `${staff.name} has been deleted`;
          break;
      }
      
      toast({
        title: "Staff status updated",
        description: message,
      });
      
      refetch();
    } catch (error) {
      console.error("Error updating staff status:", error);
      toast({
        title: "Error",
        description: "Failed to update staff member status",
        variant: "destructive"
      });
    } finally {
      setSuspendingStaff(null);
      setDeletingStaff(null);
      setReactivatingStaff(null);
    }
  };

  const getStatusBadge = (status: 'active' | 'suspended' | 'deleted') => {
    switch (status) {
      case 'active':
        return <Badge variant="success" className="bg-green-500">Active</Badge>;
      case 'suspended':
        return <Badge variant="outline" className="bg-amber-500 text-white">Suspended</Badge>;
      case 'deleted':
        return <Badge variant="destructive">Deleted</Badge>;
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Staff Members</h2>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Staff Member
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staffLoading ? (
          <Card className="col-span-full flex justify-center p-8">
            <div className="h-8 w-8 border-4 border-t-transparent border-wakti-blue rounded-full animate-spin"></div>
          </Card>
        ) : staffError ? (
          <Card className="col-span-full p-8">
            <p className="text-center text-destructive">Error loading staff members</p>
          </Card>
        ) : !staffMembers || staffMembers.length === 0 ? (
          <Card className="col-span-full p-8">
            <div className="text-center">
              <UserPlus className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Staff Members Yet</h3>
              <p className="text-muted-foreground mb-4">Add staff members to your business.</p>
              <Button onClick={() => setCreateDialogOpen(true)}>
                <UserPlus className="mr-2 h-4 w-4" />
                Add Staff Member
              </Button>
            </div>
          </Card>
        ) : (
          staffMembers.map((member) => (
            <Card key={member.id} className={`overflow-hidden ${member.status !== 'active' ? 'opacity-75' : ''}`}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <Avatar className="h-14 w-14">
                    <AvatarImage src={member.profile_image_url || ""} alt={member.name} />
                    <AvatarFallback>
                      {member.name ? member.name.substring(0, 2).toUpperCase() : "ST"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-end gap-1">
                    <Badge variant={member.role === "co-admin" ? "secondary" : "outline"}>
                      {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                    </Badge>
                    {getStatusBadge(member.status)}
                    {member.is_service_provider && (
                      <Badge variant="outline" className="border-wakti-blue text-wakti-blue">
                        Service Provider
                      </Badge>
                    )}
                  </div>
                </div>
                <CardTitle className="mt-2">{member.name || "Unnamed Staff"}</CardTitle>
                <CardDescription>{member.position || "Staff Member"}</CardDescription>
                <CardDescription className="text-xs mb-1">
                  {member.staff_number}
                </CardDescription>
                {member.email && (
                  <CardDescription className="text-xs break-all">
                    {member.email}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="pb-2">
                <StaffPermissionsDisplay permissions={member.permissions} />
              </CardContent>
              <CardFooter className="pt-2 flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setEditingStaff(member)}
                  disabled={member.status === 'deleted'}
                >
                  <UserCog className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="secondary" size="icon">
                      <span className="sr-only">Open menu</span>
                      <div className="h-4 w-4 flex items-center justify-center">
                        <span className="h-0.5 w-0.5 rounded-full bg-current" />
                        <span className="h-0.5 w-0.5 rounded-full bg-current mx-0.5" />
                        <span className="h-0.5 w-0.5 rounded-full bg-current" />
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[200px]">
                    <DropdownMenuLabel>Manage Staff</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    
                    {member.status === 'active' && (
                      <DropdownMenuItem 
                        className="text-amber-500 focus:text-amber-500"
                        onClick={() => setSuspendingStaff(member)}
                      >
                        <Ban className="h-4 w-4 mr-2" />
                        Suspend Account
                      </DropdownMenuItem>
                    )}
                    
                    {member.status === 'suspended' && (
                      <DropdownMenuItem 
                        className="text-green-500 focus:text-green-500"
                        onClick={() => setReactivatingStaff(member)}
                      >
                        <PowerOff className="h-4 w-4 mr-2" />
                        Reactivate Account
                      </DropdownMenuItem>
                    )}
                    
                    {member.status !== 'deleted' && (
                      <DropdownMenuItem 
                        className="text-destructive focus:text-destructive"
                        onClick={() => setDeletingStaff(member)}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Delete Staff Member
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
      
      <CreateStaffDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
      
      {editingStaff && (
        <EditStaffDialog
          staff={editingStaff}
          open={!!editingStaff}
          onOpenChange={(open) => {
            if (!open) setEditingStaff(null);
          }}
          onSave={() => {
            refetch();
            setEditingStaff(null);
          }}
        />
      )}
      
      {/* Suspend Staff Dialog */}
      <AlertDialog open={!!suspendingStaff} onOpenChange={(open) => !open && setSuspendingStaff(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Suspend Staff Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to suspend {suspendingStaff?.name}? They won't be able to access your business account while suspended.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-amber-500 hover:bg-amber-600"
              onClick={() => suspendingStaff && handleStatusChange(suspendingStaff, 'suspended')}
            >
              <Ban className="h-4 w-4 mr-2" />
              Suspend
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Delete Staff Dialog */}
      <AlertDialog open={!!deletingStaff} onOpenChange={(open) => !open && setDeletingStaff(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Staff Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {deletingStaff?.name}? This action marks the staff account as deleted but keeps the historical data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              onClick={() => deletingStaff && handleStatusChange(deletingStaff, 'deleted')}
            >
              <X className="h-4 w-4 mr-2" />
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Reactivate Staff Dialog */}
      <AlertDialog open={!!reactivatingStaff} onOpenChange={(open) => !open && setReactivatingStaff(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reactivate Staff Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reactivate {reactivatingStaff?.name}? They will regain access to your business account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-green-500 hover:bg-green-600"
              onClick={() => reactivatingStaff && handleStatusChange(reactivatingStaff, 'active')}
            >
              <Check className="h-4 w-4 mr-2" />
              Reactivate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default StaffManagementTab;
