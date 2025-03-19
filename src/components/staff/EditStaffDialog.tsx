
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Upload, Save, User, Camera } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { uploadBusinessImage } from "@/services/profile/updateProfileService";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const staffEditFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email").optional().or(z.literal('')),
  position: z.string().optional(),
  is_service_provider: z.boolean().default(false),
  permissions: z.object({
    can_track_hours: z.boolean().default(true),
    can_message_staff: z.boolean().default(true),
    can_create_job_cards: z.boolean().default(true),
    can_view_own_analytics: z.boolean().default(true)
  }).default({
    can_track_hours: true,
    can_message_staff: true,
    can_create_job_cards: true,
    can_view_own_analytics: true
  })
});

type StaffEditFormValues = z.infer<typeof staffEditFormSchema>;

interface StaffMember {
  id: string;
  name: string;
  email: string | null;
  role: string;
  position: string;
  created_at: string;
  staff_number: string;
  is_service_provider: boolean;
  status: 'active' | 'suspended' | 'deleted';
  profile_image_url: string | null;
  permissions: {
    can_track_hours: boolean;
    can_message_staff: boolean;
    can_create_job_cards: boolean;
    can_view_own_analytics: boolean;
  };
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
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(staff.profile_image_url);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  
  const form = useForm<StaffEditFormValues>({
    resolver: zodResolver(staffEditFormSchema),
    defaultValues: {
      name: staff.name,
      email: staff.email || "",
      position: staff.position || "",
      is_service_provider: staff.is_service_provider,
      permissions: staff.permissions || {
        can_track_hours: true,
        can_message_staff: true,
        can_create_job_cards: true,
        can_view_own_analytics: true
      }
    }
  });
  
  // Update form when staff changes
  useEffect(() => {
    form.reset({
      name: staff.name,
      email: staff.email || "",
      position: staff.position || "",
      is_service_provider: staff.is_service_provider,
      permissions: staff.permissions || {
        can_track_hours: true,
        can_message_staff: true,
        can_create_job_cards: true,
        can_view_own_analytics: true
      }
    });
    setImagePreview(staff.profile_image_url);
  }, [staff, form]);
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: "File too large",
          description: "Image size should be less than 5MB",
          variant: "destructive"
        });
        return;
      }
      
      // Validate file type
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Only JPG, PNG and WebP formats are accepted",
          variant: "destructive"
        });
        return;
      }
      
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };
  
  const onSubmit = async (values: StaffEditFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Get the current user's ID (the business ID)
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session?.user) {
        throw new Error('Not authenticated');
      }
      
      let updateData: any = {
        name: values.name,
        email: values.email || null,
        position: values.position || staff.position,
        is_service_provider: values.is_service_provider,
        permissions: values.permissions
      };
      
      // Upload new profile image if changed
      if (selectedImage) {
        const businessId = session.session.user.id;
        const profile_image_url = await uploadBusinessImage(
          businessId,
          selectedImage,
          'staff-profiles'
        );
        updateData.profile_image_url = profile_image_url;
      }
      
      // Update staff member
      const { error } = await supabase
        .from('business_staff')
        .update(updateData)
        .eq('id', staff.id);
        
      if (error) throw error;
      
      toast({
        title: "Staff member updated",
        description: `${values.name}'s information has been updated successfully`
      });
      
      onSave();
    } catch (error) {
      console.error("Error updating staff:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update staff member",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={(open) => {
      if (!open) {
        setSelectedImage(null);
      }
      onOpenChange(open);
    }}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Staff Member</DialogTitle>
          <DialogDescription>
            Update information for {staff.name}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">Staff Details</TabsTrigger>
                <TabsTrigger value="permissions">Permissions</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-4 pt-4">
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative">
                    <Avatar className="h-20 w-20 border-2 border-border">
                      {imagePreview ? (
                        <AvatarImage src={imagePreview} alt="Profile preview" />
                      ) : (
                        <AvatarFallback className="bg-muted">
                          <User className="h-8 w-8 text-muted-foreground" />
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      className="absolute bottom-0 right-0 rounded-full h-8 w-8"
                      onClick={() => document.getElementById('profile-upload-edit')?.click()}
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                    <input 
                      id="profile-upload-edit"
                      type="file"
                      accept="image/png, image/jpeg, image/jpg, image/webp"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </div>
                  
                  <div>
                    <h3 className="font-medium">{staff.staff_number}</h3>
                    <p className="text-sm text-muted-foreground">Staff ID</p>
                    <p className="text-sm mt-1">
                      <span className="font-medium">Role:</span> {staff.role}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="Enter staff name" {...field} />
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
                          <Input type="email" placeholder="staff@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Position</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Manager, Receptionist" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="is_service_provider"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>This staff member is a Service Provider</FormLabel>
                        <FormDescription>
                          Service providers appear in the business's booking system for client appointments
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-between pt-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => onOpenChange(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="button" 
                    onClick={() => setActiveTab("permissions")}
                  >
                    Next: Update Permissions
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="permissions" className="space-y-4 pt-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Staff Permissions</h3>
                  <p className="text-sm text-muted-foreground">
                    Set what this staff member can access in your business account
                  </p>
                  
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="permissions.can_track_hours"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Work Hours Tracking</FormLabel>
                            <FormDescription>
                              Allow staff to use check-in/check-out system to track working hours
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="permissions.can_message_staff"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Internal Messaging</FormLabel>
                            <FormDescription>
                              Allow staff to message other staff members (staff cannot message customers)
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="permissions.can_create_job_cards"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Job Cards Management</FormLabel>
                            <FormDescription>
                              Allow staff to create and close job cards (staff cannot edit job cards)
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="permissions.can_view_own_analytics"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>View Personal Analytics</FormLabel>
                            <FormDescription>
                              Allow staff to view their own job completion history and performance
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <div className="flex justify-between pt-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setActiveTab("details")}
                  >
                    Back to Details
                  </Button>
                  <Button 
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></span>
                        Saving Changes...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditStaffDialog;
