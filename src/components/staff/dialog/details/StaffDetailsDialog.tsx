
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { UserIcon, AlertTriangle } from "lucide-react";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { useStaffDetailsForm } from "./hooks/useStaffDetailsForm";
import { StaffDetailsTabs } from "./StaffDetailsTabs";
import { StaffDetailsFooter } from "./StaffDetailsFooter";
import { StaffDetailsHeader } from "./StaffDetailsHeader";
import { LoadingSpinner } from "./LoadingSpinner";
import { ErrorState } from "./ErrorState";

interface StaffDetailsDialogProps {
  staffId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const StaffDetailsDialog: React.FC<StaffDetailsDialogProps> = ({
  staffId,
  open,
  onOpenChange,
}) => {
  const [activeTab, setActiveTab] = useState("details");
  const [loading, setLoading] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const queryClient = useQueryClient();
  
  const {
    form,
    staffData,
    setStaffData,
    fetchStaffDetails,
    handleSaveChanges,
    handleDeleteStaff,
  } = useStaffDetailsForm({ staffId, queryClient, onOpenChange });

  // Fetch staff details when dialog opens
  useEffect(() => {
    if (open && staffId) {
      console.log("Fetching staff details for ID:", staffId);
      setLoading(true);
      fetchStaffDetails(staffId)
        .finally(() => setLoading(false));
    } else {
      // Reset form when dialog closes
      form.reset();
      setActiveTab("details");
    }
  }, [open, staffId, form, fetchStaffDetails]);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <UserIcon className="h-5 w-5 text-primary" />
              <DialogTitle>Staff Details</DialogTitle>
            </div>
          </DialogHeader>

          {loading && !staffData ? (
            <LoadingSpinner />
          ) : staffData ? (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="permissions">Permissions</TabsTrigger>
              </TabsList>
              
              <StaffDetailsTabs 
                form={form} 
                staffData={staffData} 
                activeTab={activeTab} 
              />
              
              <StaffDetailsFooter 
                loading={loading}
                onDelete={() => setConfirmDeleteOpen(true)}
                onCancel={() => onOpenChange(false)}
                form={form}
                handleSaveChanges={handleSaveChanges}
              />
            </Tabs>
          ) : (
            <ErrorState />
          )}
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog for Deleting Staff */}
      <ConfirmationDialog
        title="Delete Staff Member?"
        description={`This will remove "${staffData?.name || 'this staff member'}" from your business. This action cannot be undone.`}
        open={confirmDeleteOpen}
        onOpenChange={setConfirmDeleteOpen}
        onConfirm={() => {
          setIsDeleting(true);
          handleDeleteStaff()
            .finally(() => setIsDeleting(false));
        }}
        isLoading={isDeleting}
        confirmLabel="Delete"
        cancelLabel="Cancel"
      />
    </>
  );
};

export default StaffDetailsDialog;
