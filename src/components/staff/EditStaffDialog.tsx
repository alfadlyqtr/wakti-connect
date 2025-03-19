import React, { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Staff } from "@/types/business.types";
import { PermissionLevel, StaffPermissions } from "@/services/permissions/types";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { normalizePermissions, createDefaultPermissions } from "@/services/permissions/staffPermissions";

interface EditStaffDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedStaff: Staff | null;
  onSave: (staff: Staff) => void;
  onDelete: (staffId: string) => void;
}

const EditStaffDialog: React.FC<EditStaffDialogProps> = ({
  open,
  setOpen,
  selectedStaff,
  onSave,
  onDelete,
}) => {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<string>("staff");
  const [permissions, setPermissions] = useState<StaffPermissions>(createDefaultPermissions());
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  useEffect(() => {
    if (selectedStaff) {
      setName(selectedStaff.full_name || "");
      setEmail(selectedStaff.email || "");
      setRole(selectedStaff.role || "staff");
    } else {
      setName("");
      setEmail("");
      setRole("staff");
    }
  }, [selectedStaff]);

  // Fix this function that updates permissions
  const updatePermissionState = (oldPermissions: any, field: string, value: PermissionLevel) => {
  // Create a normalized version of the permissions to ensure it has all required fields
  const normalizedPermissions = normalizePermissions(oldPermissions);
  
  // Update both the new and legacy field names
  if (field === 'services') {
    normalizedPermissions.services = value;
    normalizedPermissions.service_permission = value;
  } else if (field === 'bookings') {
    normalizedPermissions.bookings = value;
    normalizedPermissions.booking_permission = value;
  } else if (field === 'staff') {
    normalizedPermissions.staff = value;
    normalizedPermissions.staff_permission = value;
  } else if (field === 'analytics') {
    normalizedPermissions.analytics = value;
    normalizedPermissions.analytics_permission = value;
  } else {
    // For new fields that don't have legacy equivalents
    normalizedPermissions[field as keyof StaffPermissions] = value;
  }
  
  return normalizedPermissions;
};

  const handlePermissionChange = (field: string, value: PermissionLevel) => {
    setPermissions((prevPermissions) => {
      return updatePermissionState(prevPermissions, field, value);
    });
  };

  const handleSave = () => {
    if (!selectedStaff) return;

    const updatedStaff: Staff = {
      ...selectedStaff,
      full_name: name,
      email: email,
      role: role,
      permissions: permissions,
    };

    onSave(updatedStaff);
    toast({
      title: "Staff member updated",
      description: `${name} has been updated successfully.`,
    });
    setOpen(false);
  };

  const handleDelete = () => {
    if (!selectedStaff) return;

    onDelete(selectedStaff.id);
    toast({
      title: "Staff member deleted",
      description: `${name} has been deleted successfully.`,
    });
    setOpen(false);
    setIsDeleteOpen(false);
  };

  // Fix this useEffect that initializes permissions
useEffect(() => {
  if (selectedStaff) {
    const normalizedPermissions = normalizePermissions(selectedStaff.permissions || {});
    setPermissions(normalizedPermissions);
  } else {
    setPermissions(createDefaultPermissions());
  }
}, [selectedStaff]);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Edit Staff</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Edit Staff Member</AlertDialogTitle>
          <AlertDialogDescription>
            Make changes to the staff member's details here.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role" className="text-right">
              Role
            </Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="staff">Staff</SelectItem>
                <SelectItem value="co-admin">Co-Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="services" className="text-right">
              Services
            </Label>
            <Select
              value={permissions?.services || "none"}
              onValueChange={(value) => handlePermissionChange("services", value as PermissionLevel)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a permission" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="write">Write</SelectItem>
                <SelectItem value="read">Read</SelectItem>
                <SelectItem value="none">None</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="bookings" className="text-right">
              Bookings
            </Label>
            <Select
              value={permissions?.bookings || "none"}
              onValueChange={(value) => handlePermissionChange("bookings", value as PermissionLevel)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a permission" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="write">Write</SelectItem>
                <SelectItem value="read">Read</SelectItem>
                <SelectItem value="none">None</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="staff" className="text-right">
              Staff
            </Label>
            <Select
              value={permissions?.staff || "none"}
              onValueChange={(value) => handlePermissionChange("staff", value as PermissionLevel)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a permission" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="write">Write</SelectItem>
                <SelectItem value="read">Read</SelectItem>
                <SelectItem value="none">None</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="analytics" className="text-right">
              Analytics
            </Label>
            <Select
              value={permissions?.analytics || "none"}
              onValueChange={(value) => handlePermissionChange("analytics", value as PermissionLevel)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a permission" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="write">Write</SelectItem>
                <SelectItem value="read">Read</SelectItem>
                <SelectItem value="none">None</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button type="submit" onClick={handleSave}>
            Save changes
          </Button>
          <AlertDialog
            open={isDeleteOpen}
            onOpenChange={setIsDeleteOpen}
          >
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Delete</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  the staff member from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default EditStaffDialog;
