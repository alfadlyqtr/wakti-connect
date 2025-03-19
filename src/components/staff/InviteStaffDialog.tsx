
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
import { toast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { createStaffInvitation } from "@/services/staff/staffInvitationService";

interface InviteStaffDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInvited?: () => void;
}

// Form schema for staff invitation
const inviteFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  position: z.string().optional(),
  role: z.string().min(1, "Role is required"),
});

type InviteFormValues = z.infer<typeof inviteFormSchema>;

const InviteStaffDialog: React.FC<InviteStaffDialogProps> = ({
  open,
  onOpenChange,
  onInvited
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<InviteFormValues>({
    resolver: zodResolver(inviteFormSchema),
    defaultValues: {
      name: "",
      email: "",
      position: "Staff Member",
      role: "staff",
    }
  });

  const onSubmit = async (data: InviteFormValues) => {
    setIsLoading(true);

    try {
      await createStaffInvitation({
        name: data.name,
        email: data.email,
        position: data.position,
        role: data.role,
      });

      toast({
        title: "Invitation sent",
        description: `An invitation has been sent to ${data.email}.`,
      });

      form.reset();
      onOpenChange(false);
      if (onInvited) onInvited();
    } catch (error: any) {
      console.error("Error inviting staff:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to send invitation",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Invite Staff Member</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Staff member name" />
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
                    <Input {...field} type="email" placeholder="staff@example.com" />
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
                    <Input {...field} placeholder="e.g. Sales Representative" />
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
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="staff">Staff</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="co-admin">Co-Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  {field.value === 'co-admin' && (
                    <p className="text-xs text-amber-500">
                      Note: Only one Co-Admin is allowed per business.
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            
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
                    Sending Invitation...
                  </span>
                ) : (
                  'Send Invitation'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default InviteStaffDialog;
