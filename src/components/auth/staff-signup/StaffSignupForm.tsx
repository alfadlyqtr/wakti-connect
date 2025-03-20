
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import { StaffSignupFormFields } from "./StaffSignupFormFields";
import { StaffInvitationVerification } from "./StaffInvitationVerification";
import { useStaffSignup } from "./useStaffSignup";

// Define schema for staff signup
const staffSignupSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type FormValues = z.infer<typeof staffSignupSchema>;

export function StaffSignupForm() {
  const { token } = useParams<{ token: string }>();
  const { invitation, isLoading, error, handleSignup } = useStaffSignup(token);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(staffSignupSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });
  
  // Handle form submission
  const onSubmit = (values: FormValues) => {
    if (invitation && token) {
      handleSignup(values.password, token, invitation);
    }
  };

  // If still loading or there's an error, show the verification component
  if (isLoading || error || !invitation) {
    return <StaffInvitationVerification isLoading={isLoading} error={error} invitation={invitation} />;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Create Your Account</h2>
          <p className="text-muted-foreground">
            You've been invited to join {invitation.name}'s team as a {invitation.role}.
            Set up your password to accept the invitation.
          </p>
        </div>

        <StaffSignupFormFields form={form} />

        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Creating Account..." : "Create Account"}
        </Button>
      </form>
    </Form>
  );
}

export default StaffSignupForm;
