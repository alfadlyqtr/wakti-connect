
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import { fetchAutoAddStaffSetting, updateAutoAddStaffSetting } from "@/services/contacts/contactSettings";
import AutoAddStaffToggle from "./AutoAddStaffToggle";
import { useToast } from "@/hooks/use-toast";

interface StaffSyncSectionProps {
  isBusiness: boolean;
  onContactsRefresh: () => void;
}

const StaffSyncSection: React.FC<StaffSyncSectionProps> = ({ isBusiness, onContactsRefresh }) => {
  const { toast } = useToast();
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
          Staff Communication
        </CardTitle>
        <CardDescription>
          Your staff members are automatically connected for messaging
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            All your staff members can message you and each other directly without needing to be added as contacts.
            Staff messaging is handled automatically as part of your business account.
          </p>
          <AutoAddStaffToggle 
            autoAddStaff={autoAddStaff}
            isUpdating={isUpdatingAutoAdd}
            onToggle={handleToggleAutoAdd}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default StaffSyncSection;
