
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { User, UserIcon, Trash2, AlertTriangle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import PermissionGroups from "./fields/PermissionGroups";
import { staffFormSchema } from "./StaffFormSchema";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";

interface StaffDetailsDialogProps {
  staffId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Simplified schema for editing existing staff
const editStaffSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  position: z.string().optional(),
  isServiceProvider: z.boolean().default(false),
  isCoAdmin: z.boolean().default(false),
  permissions: z.object({
    can_view_tasks: z.boolean().default(true),
    can_manage_tasks: z.boolean().default(false),
    can_message_staff: z.boolean().default(true),
    can_manage_bookings: z.boolean().default(false),
    can_create_job_cards: z.boolean().default(false),
    can_track_hours: z.boolean().default(true),
    can_log_earnings: z.boolean().default(false),
    can_edit_profile: z.boolean().default(true),
    can_view_customer_bookings: z.boolean().default(false),
    can_view_analytics: z.boolean().default(false)
  }).default({
    can_view_tasks: true,
    can_manage_tasks: false,
    can_message_staff: true,
    can_manage_bookings: false,
    can_create_job_cards: false,
    can_track_hours: true,
    can_log_earnings: false,
    can_edit_profile: true,
    can_view_customer_bookings: false,
    can_view_analytics: false
  })
});

type EditStaffFormValues = z.infer<typeof editStaffSchema>;

// Define an interface for the profile data
interface ProfileData {
  full_name?: string;
  avatar_url?: string;
  email?: string;
  [key: string]: any;
}

// Define an interface for the staff relation data to ensure type safety
interface StaffRelationData {
  id: string;
  staff_id: string;
  business_id: string;
  name?: string;
  email?: string;
  position?: string;
  role: string;
  is_service_provider: boolean;
  status: string;
  staff_number?: string;
  permissions: any;
  profiles?: ProfileData;
  profile_image_url?: string;
  [key: string]: any;
}

const StaffDetailsDialog: React.FC<StaffDetailsDialogProps> = ({
  staffId,
  open,
  onOpenChange,
}) => {
  const [activeTab, setActiveTab] = useState("details");
  const [loading, setLoading] = useState(false);
  const [staffData, setStaffData] = useState<StaffRelationData | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const queryClient = useQueryClient();
  
  const form = useForm<EditStaffFormValues>({
    resolver: zodResolver(editStaffSchema),
    defaultValues: {
      fullName: "",
      email: "",
      position: "",
      isServiceProvider: false,
      isCoAdmin: false,
      permissions: {
        can_view_tasks: true,
        can_manage_tasks: false,
        can_message_staff: true,
        can_manage_bookings: false,
        can_create_job_cards: false,
        can_track_hours: true,
        can_log_earnings: false,
        can_edit_profile: true,
        can_view_customer_bookings: false,
        can_view_analytics: false
      }
    }
  });

  // Fetch staff details when dialog opens
  useEffect(() => {
    if (open && staffId) {
      console.log("Fetching staff details for ID:", staffId);
      fetchStaffDetails(staffId);
    } else {
      // Reset form when dialog closes
      form.reset();
      setActiveTab("details");
    }
  }, [open, staffId, form]);

  const fetchStaffDetails = async (id: string) => {
    setLoading(true);
    try {
      console.log("Fetching details for staff ID:", id);
      
      // Fetch staff details from business_staff table
      const { data: staffRelation, error: staffError } = await supabase
        .from("business_staff")
        .select(`
          *,
          profiles:staff_id (
            full_name,
            avatar_url,
            email
          )
        `)
        .eq("id", id)
        .single();

      if (staffError) {
        console.error("Error fetching staff relation:", staffError);
        throw staffError;
      }
      
      console.log("Staff relation data:", staffRelation);
      
      if (staffRelation) {
        setStaffData(staffRelation as StaffRelationData);
        
        // Parse permissions if it's a string
        const permissions = typeof staffRelation.permissions === 'string' 
          ? JSON.parse(staffRelation.permissions) 
          : staffRelation.permissions;
        
        // Get profile data safely with optional chaining
        const profileData: ProfileData = staffRelation.profiles || {};

        console.log("Setting form values:", {
          fullName: staffRelation.name || profileData.full_name || "",
          email: staffRelation.email || profileData.email || "",
          position: staffRelation.position || "",
          isServiceProvider: staffRelation.is_service_provider || false,
          isCoAdmin: staffRelation.role === "co-admin",
        });

        // Set form values
        form.reset({
          fullName: staffRelation.name || profileData.full_name || "",
          email: staffRelation.email || profileData.email || "",
          position: staffRelation.position || "",
          isServiceProvider: staffRelation.is_service_provider || false,
          isCoAdmin: staffRelation.role === "co-admin",
          permissions: {
            can_view_tasks: permissions?.can_view_tasks ?? true,
            can_manage_tasks: permissions?.can_manage_tasks ?? false,
            can_message_staff: permissions?.can_message_staff ?? true,
            can_manage_bookings: permissions?.can_manage_bookings ?? false,
            can_create_job_cards: permissions?.can_create_job_cards ?? false,
            can_track_hours: permissions?.can_track_hours ?? true,
            can_log_earnings: permissions?.can_log_earnings ?? false,
            can_edit_profile: permissions?.can_edit_profile ?? true,
            can_view_customer_bookings: permissions?.can_view_customer_bookings ?? false,
            can_view_analytics: permissions?.can_view_analytics ?? false
          }
        });
      }
    } catch (error) {
      console.error("Error fetching staff details:", error);
      toast({
        title: "Error",
        description: "Failed to load staff details. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveChanges = async (data: EditStaffFormValues) => {
    if (!staffId || !staffData) return;
    
    setLoading(true);
    try {
      console.log("Saving changes for staff ID:", staffId, data);
      
      // Update permissions and staff info in the staff relation
      const { error: updateError } = await supabase
        .from("business_staff")
        .update({
          name: data.fullName,
          position: data.position,
          role: data.isCoAdmin ? "co-admin" : "staff",
          is_service_provider: data.isServiceProvider,
          permissions: data.permissions,
        })
        .eq("id", staffId);

      if (updateError) throw updateError;

      // If we have a staff_id, also update the user's profile
      if (staffData.staff_id) {
        const { error: profileError } = await supabase
          .from("profiles")
          .update({
            full_name: data.fullName,
          })
          .eq("id", staffData.staff_id);

        if (profileError) {
          console.error("Warning: Could not update profile:", profileError);
          // Continue even if profile update fails
        }
      }

      toast({
        title: "Staff Updated",
        description: "Staff member details have been updated successfully.",
        variant: "success",
      });

      // Refresh staff list data
      queryClient.invalidateQueries({ queryKey: ["staffMembers"] });
      queryClient.invalidateQueries({ queryKey: ["businessStaff"] });
      
      // Close the dialog after successful update
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating staff:", error);
      toast({
        title: "Update Failed",
        description: "There was an error updating the staff member. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStaff = async () => {
    if (!staffId || !staffData) return;
    
    setIsDeleting(true);
    try {
      console.log("Deleting staff ID:", staffId);
      
      // Update status to deleted in business_staff table
      const { error: deleteError } = await supabase
        .from("business_staff")
        .update({ status: "deleted" })
        .eq("id", staffId);

      if (deleteError) throw deleteError;

      toast({
        title: "Staff Deleted",
        description: "Staff member has been successfully removed.",
        variant: "success",
      });

      // Refresh staff list
      queryClient.invalidateQueries({ queryKey: ["staffMembers"] });
      queryClient.invalidateQueries({ queryKey: ["businessStaff"] });
      
      // Close dialogs
      setConfirmDeleteOpen(false);
      onOpenChange(false);
    } catch (error) {
      console.error("Error deleting staff:", error);
      toast({
        title: "Deletion Failed",
        description: "There was an error removing the staff member. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Generate initials for avatar
  const getInitials = () => {
    const name = staffData?.name || (staffData?.profiles?.full_name || "");
    return name
      .split(" ")
      .map(part => part.charAt(0))
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

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
            <div className="flex justify-center p-6">
              <div className="h-8 w-8 border-4 border-t-transparent border-primary rounded-full animate-spin"></div>
            </div>
          ) : staffData ? (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="permissions">Permissions</TabsTrigger>
              </TabsList>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSaveChanges)}>
                  <TabsContent value="details" className="space-y-4 py-4">
                    <div className="flex flex-col md:flex-row items-start gap-6">
                      <div className="flex flex-col items-center space-y-2">
                        <Avatar className="h-24 w-24">
                          <AvatarImage 
                            src={staffData.profiles?.avatar_url} 
                            alt={staffData.name || "Staff Member"} 
                          />
                          <AvatarFallback className="text-lg">
                            {getInitials()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-wrap gap-2 mt-2 justify-center">
                          {staffData.role === "co-admin" && (
                            <Badge variant="secondary">Co-Admin</Badge>
                          )}
                          {staffData.is_service_provider && (
                            <Badge variant="outline">Service Provider</Badge>
                          )}
                          {staffData.status !== "active" && (
                            <Badge variant="destructive">{staffData.status}</Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex-1 space-y-4">
                        <FormField
                          control={form.control}
                          name="fullName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter full name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Address</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Enter email" 
                                  {...field} 
                                  disabled
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="position"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Position</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="e.g. Manager, Receptionist" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        {staffData.staff_number && (
                          <div className="space-y-1">
                            <p className="text-sm font-medium">Staff Number</p>
                            <p className="text-sm font-mono bg-muted p-2 rounded">
                              {staffData.staff_number}
                            </p>
                          </div>
                        )}
                        
                        <div className="flex flex-col space-y-2">
                          <FormField
                            control={form.control}
                            name="isServiceProvider"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between p-3 rounded-lg border space-y-0">
                                <div className="space-y-0.5">
                                  <FormLabel>Service Provider</FormLabel>
                                  <p className="text-xs text-muted-foreground">
                                    Can be assigned to services and bookings
                                  </p>
                                </div>
                                <FormControl>
                                  <input
                                    type="checkbox"
                                    checked={field.value}
                                    onChange={field.onChange}
                                    className="h-4 w-4"
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="isCoAdmin"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between p-3 rounded-lg border space-y-0">
                                <div className="space-y-0.5">
                                  <FormLabel>Co-Admin</FormLabel>
                                  <p className="text-xs text-muted-foreground">
                                    Has higher permissions to manage the business
                                  </p>
                                </div>
                                <FormControl>
                                  <input
                                    type="checkbox"
                                    checked={field.value}
                                    onChange={field.onChange}
                                    className="h-4 w-4"
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="permissions" className="space-y-4 py-4">
                    <PermissionGroups form={form} />
                  </TabsContent>
                  
                  <Separator className="my-4" />
                  
                  <DialogFooter className="flex justify-between">
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => setConfirmDeleteOpen(true)}
                      className="flex items-center gap-1"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete Staff Member
                    </Button>
                    <div className="flex gap-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => onOpenChange(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={loading}
                      >
                        {loading ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                  </DialogFooter>
                </form>
              </Form>
            </Tabs>
          ) : (
            <div className="flex flex-col items-center justify-center p-6">
              <AlertTriangle className="h-10 w-10 text-destructive mb-2" />
              <p className="text-center">
                Staff member not found or could not be loaded.
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog for Deleting Staff */}
      <ConfirmationDialog
        title="Delete Staff Member?"
        description={`This will remove "${staffData?.name || 'this staff member'}" from your business. This action cannot be undone.`}
        open={confirmDeleteOpen}
        onOpenChange={setConfirmDeleteOpen}
        onConfirm={handleDeleteStaff}
        isLoading={isDeleting}
        confirmLabel="Delete"
        cancelLabel="Cancel"
      />
    </>
  );
};

export default StaffDetailsDialog;
