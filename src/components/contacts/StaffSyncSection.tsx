
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RefreshCw, Users, Check, AlertCircle } from "lucide-react";
import { syncStaffBusinessContacts } from "@/services/contacts/contactSync";
import { useToast } from "@/hooks/use-toast";
import AutoAddStaffToggle from "./AutoAddStaffToggle";
import { fetchAutoAddStaffSetting, updateAutoAddStaffSetting } from "@/services/contacts/contactSettings";

interface StaffSyncSectionProps {
  isBusiness: boolean;
  onContactsRefresh: () => void;
}

const StaffSyncSection: React.FC<StaffSyncSectionProps> = ({ isBusiness, onContactsRefresh }) => {
  const { toast } = useToast();
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<{success: boolean; message: string} | null>(null);
  const [autoAddStaff, setAutoAddStaff] = useState(true);
  const [isUpdatingAutoAdd, setIsUpdatingAutoAdd] = useState(false);
  
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const setting = await fetchAutoAddStaffSetting();
        setAutoAddStaff(setting);
      } catch (error) {
        console.error("Error loading auto-add staff setting:", error);
      }
    };
    
    if (isBusiness) {
      loadSettings();
    }
  }, [isBusiness]);
  
  if (!isBusiness) return null;
  
  const handleSync = async () => {
    setIsSyncing(true);
    setSyncResult(null);
    
    try {
      const result = await syncStaffBusinessContacts();
      setSyncResult(result);
      
      if (result.success) {
        toast({
          title: "Success",
          description: "Staff contact synchronization completed successfully.",
        });
        onContactsRefresh();
      } else {
        toast({
          title: "Synchronization Failed",
          description: result.message || "Failed to synchronize staff contacts.",
          variant: "destructive"
        });
      }
    } catch (error) {
      setSyncResult({
        success: false,
        message: error.message || "An unexpected error occurred"
      });
      
      toast({
        title: "Error",
        description: "Failed to synchronize staff contacts.",
        variant: "destructive"
      });
    } finally {
      setIsSyncing(false);
    }
  };
  
  const handleToggleAutoAdd = async () => {
    setIsUpdatingAutoAdd(true);
    try {
      await updateAutoAddStaffSetting(!autoAddStaff);
      setAutoAddStaff(!autoAddStaff);
      
      toast({
        title: "Setting Updated",
        description: !autoAddStaff 
          ? "Staff members will be automatically added to contacts" 
          : "Staff members will need to be manually added to contacts"
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Could not update setting",
        variant: "destructive"
      });
    } finally {
      setIsUpdatingAutoAdd(false);
    }
  };
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Staff Contact Synchronization
        </CardTitle>
        <CardDescription>
          Ensure all your staff members are correctly connected for messaging
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Sync your staff contacts to ensure all team members can communicate with each other.
            </p>
            <AutoAddStaffToggle 
              autoAddStaff={autoAddStaff}
              isUpdating={isUpdatingAutoAdd}
              onToggle={handleToggleAutoAdd}
            />
          </div>
          <Button 
            onClick={handleSync} 
            disabled={isSyncing}
            className="self-end"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Syncing...' : 'Sync Staff Contacts'}
          </Button>
        </div>
        
        {syncResult && (
          <Alert variant={syncResult.success ? "default" : "destructive"}>
            {syncResult.success ? (
              <Check className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertTitle>{syncResult.success ? "Success" : "Error"}</AlertTitle>
            <AlertDescription>{syncResult.message}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default StaffSyncSection;
