
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FileUploader } from "@/components/ui/file-uploader";

interface CreateStaffDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  position: z.string().min(2, "Position must be at least 2 characters"),
  role: z.enum(["staff", "co-admin"]),
  is_service_provider: z.boolean().default(false),
  can_track_hours: z.boolean().default(true),
  can_message_staff: z.boolean().default(true),
  can_create_job_cards: z.boolean().default(true),
  can_view_own_analytics: z.boolean().default(true),
  profile_image_url: z.string().optional(),
});

const CreateStaffDialog: React.FC<CreateStaffDialogProps> = ({ open, onOpenChange }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const queryClient = useQueryClient();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      name: "",
      position: "Staff Member",
      role: "staff",
      is_service_provider: false,
      can_track_hours: true,
      can_message_staff: true,
      can_create_job_cards: true,
      can_view_own_analytics: true,
    },
  });
  
  // Check if co-admin limit has been reached
  const { data: existingCoAdmins } = useQuery({
    queryKey: ['coAdminCheck'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('business_staff')
        .select('id')
        .eq('role', 'co-admin')
        .eq('status', 'active');
        
      if (error) throw error;
      return (data || []).length;
    },
    enabled: open
  });
  
  const handleFileUpload = async (file: File) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Authentication required");
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}-${Date.now()}.${fileExt}`;
      const filePath = `public/staff_profile_images/${fileName}`;
      
      // Create a random filename with the original extension
      const { error: uploadError, data } = await supabase.storage
        .from('images')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);
        
      setUploadedImageUrl(urlData.publicUrl);
      form.setValue('profile_image_url', urlData.publicUrl);
      
    } catch (error: any) {
      console.error("Error uploading file:", error);
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: error.message || "Failed to upload profile image",
      });
    }
  };
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!uploadedImageUrl) {
      toast({
        variant: "destructive",
        title: "Profile Image Required",
        description: "Please upload a profile image for the staff member",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Authentication required");
      
      // Create permissions object
      const permissions = {
        can_track_hours: values.can_track_hours,
        can_message_staff: values.can_message_staff,
        can_create_job_cards: values.can_create_job_cards,
        can_view_own_analytics: values.can_view_own_analytics,
      };
      
      // Create staff member in business_staff table
      const { data, error } = await supabase
        .from('business_staff')
        .insert({
          business_id: user.id,
          email: values.email,
          name: values.name,
          position: values.position,
          role: values.role,
          staff_id: null, // Will be set when user registers
          is_service_provider: values.is_service_provider,
          permissions,
          profile_image_url: uploadedImageUrl,
        })
        .select();
        
      if (error) throw error;
      
      toast({
        title: "Staff Created",
        description: `${values.name} has been added as a staff member. Staff Number: ${data[0].staff_number}`,
      });
      
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['businessStaff'] });
      queryClient.invalidateQueries({ queryKey: ['coAdminCheck'] });
      
      // Close the dialog
      onOpenChange(false);
      
      // Reset the form
      form.reset();
      setUploadedImageUrl(null);
      
    } catch (error: any) {
      console.error("Error creating staff:", error);
      toast({
        variant: "destructive",
        title: "Staff Creation Failed",
        description: error.message || "Failed to create staff member",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Staff Member</DialogTitle>
          <DialogDescription>
            Create a new staff member for your business. They'll be sent an invitation to join.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex justify-center mb-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={uploadedImageUrl || ""} />
                <AvatarFallback className="text-lg">
                  {form.watch("name") ? form.watch("name").substring(0, 2).toUpperCase() : "ST"}
                </AvatarFallback>
              </Avatar>
            </div>
            
            <FormField
              control={form.control}
              name="profile_image_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profile Picture</FormLabel>
                  <FormControl>
                    <FileUploader
                      onFileUpload={handleFileUpload}
                      acceptedFileTypes="image/*"
                      maxFileSize={5}
                    />
                  </FormControl>
                  <FormDescription>
                    Upload a profile picture (required)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
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
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position</FormLabel>
                    <FormControl>
                      <Input placeholder="Staff Position" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      disabled={field.value === "co-admin" && existingCoAdmins && existingCoAdmins > 0}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="staff">Staff</SelectItem>
                        <SelectItem 
                          value="co-admin"
                          disabled={existingCoAdmins && existingCoAdmins > 0}
                        >
                          Co-Admin {existingCoAdmins && existingCoAdmins > 0 ? "(Limit Reached)" : ""}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      {existingCoAdmins && existingCoAdmins > 0 
                        ? "You can only have one Co-Admin" 
                        : "Co-Admins have additional privileges"}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="is_service_provider"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Service Provider</FormLabel>
                    <FormDescription>
                      Mark as a service provider who can be booked for appointments
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Staff Permissions</h3>
              
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="can_track_hours"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Track Working Hours</FormLabel>
                        <FormDescription>
                          Staff can track their working hours
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="can_message_staff"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Message Staff</FormLabel>
                        <FormDescription>
                          Staff can message other staff members
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="can_create_job_cards"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Create Job Cards</FormLabel>
                        <FormDescription>
                          Staff can create job cards to track completed jobs
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="can_view_own_analytics"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>View Analytics</FormLabel>
                        <FormDescription>
                          Staff can view their own performance analytics
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Staff Member"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateStaffDialog;
