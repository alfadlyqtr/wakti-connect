
import React, { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  PermissionLevel, 
  StaffPermissions, 
  updateStaffPermissions 
} from "@/services/permissions/accessControlService";

interface StaffMember {
  id: string;
  name: string;
  email: string | null;
  role: string;
  position: string;
  is_service_provider: boolean;
  service_permission: PermissionLevel;
  booking_permission: PermissionLevel;
  staff_permission: PermissionLevel;
  analytics_permission: PermissionLevel;
}

interface EditStaffDialogProps {
  staff: StaffMember;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: () => void;
}

const EditStaffDialog: React.FC<EditStaffDialogProps> = ({
  staff,
  open,
  onOpenChange,
  onSave
}) => {
  const [name, setName] = useState(staff.name);
  const [email, setEmail] = useState(staff.email || "");
  const [position, setPosition] = useState(staff.position);
  const [role, setRole] = useState<string>(staff.role);
  const [isServiceProvider, setIsServiceProvider] = useState(staff.is_service_provider);
  const [isLoading, setIsLoading] = useState(false);
  const [permissions, setPermissions] = useState<StaffPermissions>({
    service_permission: staff.service_permission || 'none',
    booking_permission: staff.booking_permission || 'none',
    staff_permission: staff.staff_permission || 'none',
    analytics_permission: staff.analytics_permission || 'none'
  });

  // Reset form when staff changes
  useEffect(() => {
    setName(staff.name);
    setEmail(staff.email || "");
    setPosition(staff.position);
    setRole(staff.role);
    setIsServiceProvider(staff.is_service_provider);
    setPermissions({
      service_permission: staff.service_permission || 'none',
      booking_permission: staff.booking_permission || 'none',
      staff_permission: staff.staff_permission || 'none',
      analytics_permission: staff.analytics_permission || 'none'
    });
  }, [staff]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Update the staff member
      const { error } = await supabase
        .from('business_staff')
        .update({
          name,
          email: email || null,
          position,
          role,
          is_service_provider: isServiceProvider,
          service_permission: permissions.service_permission,
          booking_permission: permissions.booking_permission,
          staff_permission: permissions.staff_permission,
          analytics_permission: permissions.analytics_permission
        })
        .eq('id', staff.id);

      if (error) throw error;

      toast({
        title: "Staff updated",
        description: `${name} has been updated successfully.`,
      });

      onSave();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error updating staff:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update staff member",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePermissionChange = (type: keyof StaffPermissions, value: PermissionLevel) => {
    setPermissions(prev => ({
      ...prev,
      [type]: value
    }));
  };

  // Role options based on current staff role
  const canAssignCoAdmin = role !== 'co-admin'; // Only one co-admin allowed

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Staff Member</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="position">Position</Label>
            <Input 
              id="position" 
              value={position} 
              onChange={(e) => setPosition(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select 
              value={role}
              onValueChange={setRole}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="staff">Staff</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                {canAssignCoAdmin && (
                  <SelectItem value="co-admin">Co-Admin</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="isServiceProvider" 
              checked={isServiceProvider}
              onCheckedChange={(checked) => setIsServiceProvider(!!checked)}
            />
            <Label 
              htmlFor="isServiceProvider"
              className="font-normal text-sm"
            >
              Is Service Provider
            </Label>
          </div>
          
          <div className="space-y-4 border p-4 rounded-md">
            <h3 className="font-medium">Permissions</h3>
            
            <div className="space-y-2">
              <Label>Services Permission</Label>
              <Select 
                value={permissions.service_permission}
                onValueChange={(value) => handlePermissionChange('service_permission', value as PermissionLevel)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="read">Read</SelectItem>
                  <SelectItem value="write">Write</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Bookings Permission</Label>
              <Select 
                value={permissions.booking_permission}
                onValueChange={(value) => handlePermissionChange('booking_permission', value as PermissionLevel)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="read">Read</SelectItem>
                  <SelectItem value="write">Write</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Staff Management Permission</Label>
              <Select 
                value={permissions.staff_permission}
                onValueChange={(value) => handlePermissionChange('staff_permission', value as PermissionLevel)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="read">Read</SelectItem>
                  <SelectItem value="write">Write</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Analytics Permission</Label>
              <Select 
                value={permissions.analytics_permission}
                onValueChange={(value) => handlePermissionChange('analytics_permission', value as PermissionLevel)}
              >
                <SelectTrigger>
                  <SelectValue />
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
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center">
                  <span className="h-4 w-4 mr-2 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
                  Saving...
                </span>
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditStaffDialog;
