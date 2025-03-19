
import React, { useState } from "react";
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
import { PermissionLevel, StaffPermissions } from "@/services/permissions/accessControlService";

interface CreateStaffDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: () => void;
}

const CreateStaffDialog: React.FC<CreateStaffDialogProps> = ({
  open,
  onOpenChange,
  onCreated
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [position, setPosition] = useState("Staff Member");
  const [role, setRole] = useState<string>("staff");
  const [isServiceProvider, setIsServiceProvider] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [permissions, setPermissions] = useState<StaffPermissions>({
    service_permission: 'none' as PermissionLevel,
    booking_permission: 'none' as PermissionLevel,
    staff_permission: 'none' as PermissionLevel,
    analytics_permission: 'none' as PermissionLevel
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Check if a co-admin already exists
      if (role === 'co-admin') {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) throw new Error("No active session");
        
        const { data: existingCoAdmin, error: coAdminError } = await supabase
          .from('business_staff')
          .select('id')
          .eq('business_id', session.user.id)
          .eq('role', 'co-admin')
          .eq('status', 'active')
          .maybeSingle();
        
        if (coAdminError) throw coAdminError;
        
        if (existingCoAdmin) {
          throw new Error("You already have a Co-Admin. Only one Co-Admin is allowed per business.");
        }
      }

      // Create the staff member
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Unable to get current user");
      
      // Set default permissions based on role
      let staffPermissions: Record<string, any> = {};
      if (role === 'co-admin') {
        staffPermissions = {
          service_permission: 'admin',
          booking_permission: 'admin',
          staff_permission: 'admin',
          analytics_permission: 'admin'
        };
      } else if (role === 'admin') {
        staffPermissions = {
          service_permission: 'admin',
          booking_permission: 'admin',
          staff_permission: 'write',
          analytics_permission: 'admin'
        };
      } else {
        // Regular staff gets custom permissions
        staffPermissions = {
          service_permission: permissions.service_permission,
          booking_permission: permissions.booking_permission,
          staff_permission: permissions.staff_permission,
          analytics_permission: permissions.analytics_permission
        };
      }
      
      // Generate a staff ID - in a real system this would be more sophisticated
      const staffId = crypto.randomUUID();
      
      const { data: staff, error } = await supabase
        .from('business_staff')
        .insert({
          business_id: user.id,
          name,
          email: email || null,
          position,
          role,
          is_service_provider: isServiceProvider,
          permissions: staffPermissions,
          staff_id: staffId, // Use generated ID instead of business owner's ID
          status: 'active'
        })
        .select()
        .single();

      if (error) throw error;

      // Run populate access control
      await supabase.rpc('populate_access_control');

      toast({
        title: "Staff added",
        description: `${name} has been added to your team.`,
      });

      // Reset form
      setName("");
      setEmail("");
      setPosition("Staff Member");
      setRole("staff");
      setIsServiceProvider(false);
      setPermissions({
        service_permission: 'none',
        booking_permission: 'none',
        staff_permission: 'none',
        analytics_permission: 'none'
      });

      onOpenChange(false);
      if (onCreated) onCreated();
    } catch (error: any) {
      console.error("Error creating staff:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add staff member",
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

  // Update permissions based on role
  const handleRoleChange = (newRole: string) => {
    setRole(newRole);
    
    if (newRole === 'co-admin') {
      setPermissions({
        service_permission: 'admin',
        booking_permission: 'admin',
        staff_permission: 'admin',
        analytics_permission: 'admin'
      });
    } else if (newRole === 'admin') {
      setPermissions({
        service_permission: 'admin',
        booking_permission: 'admin',
        staff_permission: 'write',
        analytics_permission: 'admin'
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Staff Member</DialogTitle>
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
            <p className="text-xs text-muted-foreground">
              Optional. Used only for identification.
            </p>
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
              onValueChange={handleRoleChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="staff">Staff</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="co-admin">Co-Admin</SelectItem>
              </SelectContent>
            </Select>
            {role === 'co-admin' && (
              <p className="text-xs text-amber-500">
                Note: Only one Co-Admin is allowed per business.
              </p>
            )}
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
          
          {role === 'staff' && (
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
          )}
          
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
                  Creating...
                </span>
              ) : (
                'Create Staff Member'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateStaffDialog;
