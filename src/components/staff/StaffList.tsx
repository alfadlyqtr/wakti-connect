import React, { useState } from "react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, UserPlus, RefreshCw } from "lucide-react";
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
import { StaffMemberCard } from "./StaffMemberCard";
import { StaffMember } from "@/types/staff";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface StaffListProps {
  staffMembers: StaffMember[];
  staffData?: any[]; // For backwards compatibility
  isLoading: boolean;
  error: Error | null;
  onEdit: (staffId: string) => void;
  onRefresh: () => void;
}

interface EmptyStaffStateProps {
  onAddStaffClick: () => void;
  onSyncStaffClick?: () => void;
  isSyncing?: boolean;
}

const EmptyStaffState: React.FC<EmptyStaffStateProps> = ({ 
  onAddStaffClick, 
  onSyncStaffClick,
  isSyncing = false 
}) => (
  <Card className="text-center p-6">
    <div className="flex flex-col items-center justify-center">
      <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-6">
        <UserPlus className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-medium mb-2">No staff members yet</h3>
      <p className="text-muted-foreground max-w-sm mb-6">
        Add staff members to your business to help manage tasks, appointments, and services.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Button onClick={onAddStaffClick}>
          <UserPlus className="h-4 w-4 mr-2" />
          Add Staff Member
        </Button>
        {onSyncStaffClick && (
          <Button variant="outline" onClick={onSyncStaffClick} disabled={isSyncing}>
            {isSyncing ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            {isSyncing ? "Syncing..." : "Sync Staff Records"}
          </Button>
        )}
      </div>
    </div>
  </Card>
);

export const StaffList: React.FC<StaffListProps> = ({
  staffMembers,
  staffData,
  isLoading,
  error,
  onEdit,
  onRefresh,
}) => {
  const displayStaff = staffData || staffMembers;
  const { toast } = useToast();
  
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [toggleStatusConfirmOpen, setToggleStatusConfirmOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleDeleteClick = (staff: StaffMember) => {
    setSelectedStaff(staff);
    setDeleteConfirmOpen(true);
  };

  const handleToggleStatusClick = (staff: StaffMember) => {
    setSelectedStaff(staff);
    setToggleStatusConfirmOpen(true);
  };
  
  const syncStaffRecords = async () => {
    try {
      setIsSyncing(true);
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session) {
        toast({
          title: "Error",
          description: "You must be signed in to sync staff records",
          variant: "destructive"
        });
        return;
      }
      
      const { data, error } = await supabase.functions.invoke("sync-staff-records", {
        headers: {
          Authorization: `Bearer ${session.session.access_token}`
        }
      });
      
      if (error) {
        console.error("Error syncing staff records:", error);
        toast({
          title: "Sync Failed",
          description: error.message || "Failed to sync staff records",
          variant: "destructive"
        });
        return;
      }
      
      if (data.success) {
        console.log("Sync successful:", data);
        const syncedCount = data.data.synced.length;
        const errorCount = data.data.errors.length;
        
        toast({
          title: "Staff Records Synced",
          description: `Successfully synced ${syncedCount} staff records${errorCount > 0 ? `, with ${errorCount} errors` : ''}.`,
          variant: "default"
        });
        
        onRefresh();
      } else {
        toast({
          title: "Sync Failed",
          description: data.error || "Failed to sync staff records",
          variant: "destructive"
        });
      }
    } catch (err) {
      console.error("Error in sync operation:", err);
      toast({
        title: "Sync Error",
        description: "An unexpected error occurred during sync",
        variant: "destructive"
      });
    } finally {
      setIsSyncing(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center">
          <RefreshCw className="h-5 w-5 animate-spin mr-2" />
          <p>Loading staff members...</p>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="flex items-center text-destructive space-x-2 mb-4">
          <AlertCircle className="h-5 w-5" />
          <p className="font-medium">Failed to load staff members</p>
        </div>
        <p className="text-sm text-muted-foreground mb-4">{error.message}</p>
        <div className="flex gap-2">
          <Button size="sm" onClick={onRefresh}>Retry</Button>
          <Button size="sm" variant="outline" onClick={syncStaffRecords} disabled={isSyncing}>
            {isSyncing ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            {isSyncing ? "Syncing..." : "Sync Staff Records"}
          </Button>
        </div>
      </Card>
    );
  }

  if (!displayStaff || displayStaff.length === 0) {
    return <EmptyStaffState 
      onAddStaffClick={() => onEdit("")} 
      onSyncStaffClick={syncStaffRecords}
      isSyncing={isSyncing}
    />;
  }

  console.log("Rendering staff list with members:", displayStaff);

  return (
    <div className="space-y-4">
      <div className="flex justify-end mb-2">
        <Button size="sm" variant="outline" onClick={syncStaffRecords} disabled={isSyncing}>
          {isSyncing ? (
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          {isSyncing ? "Syncing..." : "Sync Staff Records"}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayStaff.map((staff) => (
          <StaffMemberCard
            key={staff.id}
            staff={staff}
            onEdit={() => onEdit(staff.id)}
            onDelete={() => handleDeleteClick(staff)} 
            onToggleStatus={() => handleToggleStatusClick(staff)}
          />
        ))}
      </div>

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Staff Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedStaff?.name}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setDeleteConfirmOpen(false);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={toggleStatusConfirmOpen} onOpenChange={setToggleStatusConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {selectedStaff?.status === 'active' ? 'Suspend' : 'Activate'} Staff Member
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to {selectedStaff?.status === 'active' ? 'suspend' : 'activate'} {selectedStaff?.name}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setToggleStatusConfirmOpen(false);
              }}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default StaffList;
