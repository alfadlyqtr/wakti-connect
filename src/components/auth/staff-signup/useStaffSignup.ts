
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useStaffInvitations } from "@/hooks/staff/useStaffInvitations";
import { z } from "zod";

// Form validation schema
const staffSignupSchema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
})
.refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type StaffSignupFormValues = z.infer<typeof staffSignupSchema>;

export const useStaffSignup = (token?: string) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { verifyInvitation, acceptInvitation } = useStaffInvitations();
  
  const [invitation, setInvitation] = useState<any>(null);
  const [status, setStatus] = useState<"loading" | "valid" | "invalid">("loading");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Verify the invitation token
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setStatus("invalid");
        return;
      }
      
      try {
        console.log("Verifying invitation token:", token);
        const invitation = await verifyInvitation.mutateAsync({ token });
        console.log("Invitation verified:", invitation);
        setInvitation(invitation);
        setStatus("valid");
      } catch (error) {
        console.error("Error verifying invitation:", error);
        setStatus("invalid");
      }
    };
    
    verifyToken();
  }, [token, verifyInvitation]);
  
  const onSubmit = async (values: StaffSignupFormValues) => {
    if (!invitation || !token) return;
    
    setIsSubmitting(true);
    
    try {
      console.log("Creating staff account for:", invitation);
      
      // Create user account - set account_type to 'staff'
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: invitation.email,
        password: values.password,
        options: {
          data: {
            full_name: invitation.name,
            account_type: 'staff', // Correctly set as staff
            display_name: invitation.name
          }
        }
      });
      
      if (authError) throw authError;
      
      if (!authData.user) {
        throw new Error("Failed to create user account");
      }
      
      console.log("User account created:", authData.user.id);
      
      // Accept the invitation and create staff record
      await acceptInvitation.mutateAsync({
        token,
        userId: authData.user.id
      });
      
      console.log("Invitation accepted and staff record created");
      
      toast({
        title: "Account created successfully",
        description: `You can now log in to your staff account with ${invitation.business_name}`,
      });
      
      // Navigate to login
      navigate("/auth");
    } catch (error) {
      console.error("Error creating staff account:", error);
      toast({
        title: "Error creating account",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    invitation,
    status,
    isSubmitting,
    onSubmit
  };
};
