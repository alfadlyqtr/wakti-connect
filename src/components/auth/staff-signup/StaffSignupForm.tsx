
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useStaffSignup } from "./useStaffSignup";
import StaffSignupFormFields from "./StaffSignupFormFields";
import StaffInvitationVerification from "./StaffInvitationVerification";

// Define the schema for the form
const staffSignupSchema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type FormValues = z.infer<typeof staffSignupSchema>;

const StaffSignupForm: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || undefined;
  const { invitation, status, isSubmitting, onSubmit } = useStaffSignup(token);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(staffSignupSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });
  
  // If we're loading or the invitation is invalid, show the verification component
  if (status !== "valid") {
    return (
      <StaffInvitationVerification 
        isLoading={status === "loading"}
        error={status === "invalid" ? "Invalid or expired invitation" : null}
        invitation={invitation}
      />
    );
  }
  
  const handleSubmit = (values: FormValues) => {
    onSubmit(values);
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Create Your Staff Account</CardTitle>
        <CardDescription>
          Set your password to complete your account setup for {invitation?.name}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <StaffSignupFormFields form={form} />
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default StaffSignupForm;
