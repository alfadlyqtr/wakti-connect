
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useStaffInvitations } from "@/hooks/useStaffInvitations";

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

type StaffSignupFormValues = z.infer<typeof staffSignupSchema>;

export const useStaffSignup = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const navigate = useNavigate();
  const { toast } = useToast();
  const { verifyInvitation, acceptInvitation } = useStaffInvitations();
  
  const [invitation, setInvitation] = useState<any>(null);
  const [status, setStatus] = useState<"loading" | "valid" | "invalid">("loading");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<StaffSignupFormValues>({
    resolver: zodResolver(staffSignupSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });
  
  // Verify the invitation token
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setStatus("invalid");
        return;
      }
      
      try {
        const invitation = await verifyInvitation.mutateAsync({ token });
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
    if (!invitation) return;
    
    setIsSubmitting(true);
    
    try {
      // Create user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: invitation.email,
        password: values.password,
        options: {
          data: {
            full_name: invitation.name,
            account_type: 'individual',
          }
        }
      });
      
      if (authError) throw authError;
      
      if (!authData.user) {
        throw new Error("Failed to create user account");
      }
      
      // Accept the invitation and create staff record
      await acceptInvitation.mutateAsync({
        token,
        userId: authData.user.id
      });
      
      toast({
        title: "Account created successfully",
        description: "You can now log in to your staff account",
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
    form,
    invitation,
    status,
    isSubmitting,
    onSubmit
  };
};
