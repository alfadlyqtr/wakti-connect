
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StaffMember } from "@/types/business.types";
import { PermissionLevel } from "@/services/permissions/types";
import { toast } from "@/components/ui/use-toast";

export interface EditStaffDialogProps {
  staff: StaffMember;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: () => void;
}

const EditStaffDialog: React.FC<EditStaffDialogProps> = ({ staff, open, onOpenChange, onSave }) => {
  const [fullName, setFullName] = useState(staff.full_name || "");
  const [position, setPosition] = useState(staff.position || "");
  const [servicePermission, setServicePermission] = useState<PermissionLevel>(staff.permissions?.services || "none");
  const [bookingPermission, setBookingPermission] = useState<PermissionLevel>(staff.permissions?.bookings || "none");
  const [staffPermission, setStaffPermission] = useState<PermissionLevel>(staff.permissions?.staff || "none");
  const [analyticsPermission, setAnalyticsPermission] = useState<PermissionLevel>(staff.permissions?.analytics || "none");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (staff) {
      setFullName(staff.full_name || "");
      setPosition(staff.position || "");
      setServicePermission(staff.permissions?.services || "none");
      setBookingPermission(staff.permissions?.bookings || "none");
      setStaffPermission(staff.permissions?.staff || "none");
      setAnalyticsPermission(staff.permissions?.analytics || "none");
    }
  }, [staff]);
  
  const handleSave = async () => {
    setIsLoading(true);
    
    // Construct the updated permissions object
    const updatedPermissions = {
      ...staff.permissions,
      services: servicePermission,
      bookings: bookingPermission,
      staff: staffPermission,
      analytics: analyticsPermission,
      service_permission: servicePermission,
      booking_permission: bookingPermission,
      staff_permission: staffPermission,
      analytics_permission: analyticsPermission
    };
    
    try {
      const response = await fetch(`/api/staff/${staff.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name: fullName,
          position: position,
          permissions: updatedPermissions
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      toast({
        title: "Staff member updated",
        description: `${fullName} has been updated successfully.`,
      });
      
      onSave();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error updating staff member:", error);
      toast({
        variant: "destructive",
        title: "Error updating staff member",
        description: error.message || "Failed to update staff member. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Helper function to safely handle value changes for permission selects
  const handlePermissionChange = (setter: React.Dispatch<React.SetStateAction<PermissionLevel>>) => {
    return (value: string) => {
      if (value === 'none' || value === 'read' || value === 'write' || value === 'admin') {
        setter(value as PermissionLevel);
      }
    };
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Staff Member</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Full Name
            </Label>
            <Input id="name" value={fullName} onChange={(e) => setFullName(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="position" className="text-right">
              Position
            </Label>
            <Input id="position" value={position} onChange={(e) => setPosition(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="servicePermission" className="text-right">
              Service Permission
            </Label>
            <Select value={servicePermission} onValueChange={handlePermissionChange(setServicePermission)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="read">Read</SelectItem>
                <SelectItem value="write">Write</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="bookingPermission" className="text-right">
              Booking Permission
            </Label>
            <Select value={bookingPermission} onValueChange={handlePermissionChange(setBookingPermission)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="read">Read</SelectItem>
                <SelectItem value="write">Write</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="staffPermission" className="text-right">
              Staff Permission
            </Label>
            <Select value={staffPermission} onValueChange={handlePermissionChange(setStaffPermission)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="read">Read</SelectItem>
                <SelectItem value="write">Write</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="analyticsPermission" className="text-right">
              Analytics Permission
            </Label>
            <Select value={analyticsPermission} onValueChange={handlePermissionChange(setAnalyticsPermission)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="read">Read</SelectItem>
                <SelectItem value="write">Write</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleSave} disabled={isLoading}>
            {isLoading ? (
              <div className="flex items-center gap-2">
                <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Updating...</span>
              </div>
            ) : (
              "Save changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditStaffDialog;
