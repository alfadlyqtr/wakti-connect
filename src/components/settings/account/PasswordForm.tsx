
import React from "react";
import { useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface PasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const PasswordForm: React.FC = () => {
  const passwordForm = useForm<PasswordFormValues>({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });

  const updatePassword = async (data: PasswordFormValues) => {
    if (data.newPassword !== data.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your new passwords match.",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: data.newPassword
      });

      if (error) throw error;

      toast({
        title: "Password updated",
        description: "Your password has been changed successfully."
      });
      
      // Reset password fields
      passwordForm.reset({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error("Error updating password:", error);
      toast({
        title: "Password update failed",
        description: "There was a problem updating your password.",
        variant: "destructive"
      });
    }
  };

  return (
    <form onSubmit={passwordForm.handleSubmit(updatePassword)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="currentPassword">Current Password</Label>
        <Input 
          id="currentPassword" 
          type="password" 
          {...passwordForm.register("currentPassword")} 
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="newPassword">New Password</Label>
        <Input 
          id="newPassword" 
          type="password"
          {...passwordForm.register("newPassword")}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm New Password</Label>
        <Input 
          id="confirmPassword" 
          type="password"
          {...passwordForm.register("confirmPassword")}
        />
      </div>
      <Button 
        type="submit" 
        className="w-full sm:w-auto"
        disabled={passwordForm.formState.isSubmitting}
      >
        {passwordForm.formState.isSubmitting ? "Updating..." : "Update Password"}
      </Button>
    </form>
  );
};

export default PasswordForm;
