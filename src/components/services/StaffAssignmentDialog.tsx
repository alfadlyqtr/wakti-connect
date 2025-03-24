
import React, { useEffect } from "react";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import StaffAssignmentSection from "./StaffAssignmentSection";
import { useServiceStaffAssignments } from "@/hooks/useServiceStaffAssignments";
import { useStaffData } from "@/hooks/useStaffData";
import { Button } from "@/components/ui/button";
import { AlertCircle, Loader2, RefreshCw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface StaffAssignmentDialogProps {
  serviceId: string;
  serviceName: string;
}

const StaffAssignmentDialog: React.FC<StaffAssignmentDialogProps> = ({ 
  serviceId, 
  serviceName 
}) => {
  const { data: allStaffData, isLoading: isStaffLoading, refetch: refetchStaff } = useStaffData();
  const { 
    selectedStaffIds,
    handleStaffChange,
    handleSave,
    handleCancel,
    handleRetry,
    isPending,
    isLoading: isAssignmentsLoading,
    initialAssignmentsDone,
    error
  } = useServiceStaffAssignments(serviceId);

  // Only show staff members who are service providers
  const serviceProviderStaff = allStaffData?.filter(staff => staff.is_service_provider) || [];
  
  useEffect(() => {
    if (serviceProviderStaff.length > 0) {
      console.log("Available staff for service assignment:", 
        serviceProviderStaff.map(s => ({ id: s.id, name: s.name }))
      );
    }
    console.log("Selected staff IDs:", selectedStaffIds);
  }, [serviceProviderStaff, selectedStaffIds]);
  
  const isLoading = isStaffLoading || isAssignmentsLoading || !initialAssignmentsDone;
  const hasServiceProviders = serviceProviderStaff.length > 0;
  
  const handleRefreshData = () => {
    refetchStaff();
    handleRetry();
  };

  return (
    <DialogContent className="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle className="flex items-center justify-between">
          <span>Assign Staff to {serviceName}</span>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleRefreshData} 
            disabled={isLoading || isPending}
            title="Refresh data"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </DialogTitle>
      </DialogHeader>
      
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error.message}
            <Button variant="link" className="p-0 h-auto ml-2" onClick={handleRetry}>
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      {!hasServiceProviders && !isLoading && (
        <Alert variant="default" className="mb-4 border-amber-200 bg-amber-50 text-amber-800">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You need to mark staff members as service providers in the Staff Management section
            before they can be assigned to services.
          </AlertDescription>
        </Alert>
      )}
      
      <StaffAssignmentSection
        selectedStaff={selectedStaffIds}
        onStaffChange={handleStaffChange}
        staffData={serviceProviderStaff}
        isStaffLoading={isLoading}
      />
      
      <div className="flex justify-end gap-2 mt-4 pt-2 border-t">
        <Button 
          variant="outline" 
          onClick={handleCancel}
          disabled={isPending || isLoading}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSave}
          disabled={isPending || isLoading || !hasServiceProviders}
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Assignments'
          )}
        </Button>
      </div>
    </DialogContent>
  );
};

export default StaffAssignmentDialog;
