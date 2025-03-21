
import React from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { useStaffSignup, StaffSignupFormValues } from "./useStaffSignup";
import StaffInvitationVerification from "./StaffInvitationVerification";
import StaffSignupFormFields from "./StaffSignupFormFields";

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

const StaffSignupForm: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const businessSlug = searchParams.get("business") || "";
  const acceptedParam = searchParams.get("accepted") || "";
  
  // Only proceed if the invitation has been explicitly accepted
  const wasAccepted = acceptedParam === "true";
  
  const { invitation, status, isSubmitting, onSubmit } = useStaffSignup(wasAccepted ? token : "");
  
  const form = useForm<StaffSignupFormValues>({
    resolver: zodResolver(staffSignupSchema),
    defaultValues: {
      password: "",
      confirmPassword: ""
    },
  });
  
  // Redirect to decision page if not accepted yet
  if (!wasAccepted && token) {
    window.location.href = `/auth/staff-invitation?token=${token}&business=${businessSlug}`;
    return null;
  }
  
  if (status === "loading") {
    return (
      <StaffInvitationVerification 
        isLoading={true} 
        error={null} 
        invitation={null}
        businessName={businessSlug.replace(/-/g, ' ')}
      />
    );
  }
  
  if (status === "invalid") {
    return (
      <StaffInvitationVerification 
        isLoading={false} 
        error="Invalid or expired invitation" 
        invitation={null}
        businessName={businessSlug.replace(/-/g, ' ')}
      />
    );
  }
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Create Your Staff Account</CardTitle>
        <CardDescription>
          Set up your account to join {invitation?.business_name || businessSlug.replace(/-/g, ' ')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="border rounded-md p-4 bg-muted/50 mb-4">
              <h3 className="font-medium mb-2">Your Information</h3>
              <p className="text-sm"><span className="text-muted-foreground">Name:</span> {invitation?.name}</p>
              <p className="text-sm"><span className="text-muted-foreground">Email:</span> {invitation?.email}</p>
              <p className="text-sm"><span className="text-muted-foreground">Role:</span> {invitation?.role}</p>
            </div>
            
            <StaffSignupFormFields form={form} />
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default StaffSignupForm;
