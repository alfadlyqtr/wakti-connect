import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
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
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LoadingSpinner } from "./LoadingSpinner";
import { ErrorState } from "./ErrorState";
import { SkeletonPlaceholder } from "./SkeletonPlaceholder";

interface StaffDetailsDialogProps {
  staffId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const StaffDetailsHeader: React.FC = () => {
  return (
    <DialogHeader>
      <div className="flex items-center gap-2">
        <UserIcon className="h-5 w-5 text-primary" />
        <DialogTitle>Staff Details</DialogTitle>
      </div>
    </DialogHeader>
  );
};

const StaffDetailsDialog: React.FC<StaffDetailsDialogProps> = ({
  staffId,
  open,
  onOpenChange,
}) => {
  const [activeTab, setActiveTab] = useState("details");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const queryClient = useQueryClient();
  
  const {
    form,
    staffData,
    setStaffData,
    fetchStaffDetails,
    handleSaveChanges,
    handleDeleteStaff,
  } = useStaffDetailsForm({ staffId, queryClient, onOpenChange });

  useEffect(() => {
    if (open && staffId) {
      console.log("Fetching staff details for ID:", staffId);
      setInitialLoading(true);
      setLoadError(null);
      
      fetchStaffDetails(staffId)
        .then(() => {
          setLoadError(null);
        })
        .catch((error) => {
          console.error("Error in fetchStaffDetails:", error);
          setLoadError(error?.message || "Failed to load staff details");
        })
        .finally(() => {
          setInitialLoading(false);
        });
    } else {
      form.reset();
      setActiveTab("details");
      setLoadError(null);
    }
  }, [open, staffId, form, fetchStaffDetails]);

  const handleRetry = () => {
    if (staffId) {
      setInitialLoading(true);
      setLoadError(null);
      
      fetchStaffDetails(staffId)
        .then(() => {
          setLoadError(null);
        })
        .catch((error) => {
          setLoadError(error?.message || "Failed to load staff details");
        })
        .finally(() => {
          setInitialLoading(false);
        });
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <StaffDetailsHeader />

          {initialLoading ? (
            <SkeletonPlaceholder activeTab={activeTab} />
          ) : loadError ? (
            <ErrorState 
              errorMessage={loadError} 
              onRetry={handleRetry} 
            />
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
                handleSaveChanges={(data) => {
                  setLoading(true);
                  handleSaveChanges(data)
                    .finally(() => setLoading(false));
                }}
              />
            </Tabs>
          ) : (
            <ErrorState 
              errorMessage="Staff member not found" 
              onRetry={handleRetry} 
            />
          )}
        </DialogContent>
      </Dialog>

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
