
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useStaffSignup } from "./useStaffSignup";
import { StaffInvitationVerification } from "./index";
import StaffSignupFormFields from "./StaffSignupFormFields";

const StaffSignupForm = () => {
  const { form, invitation, status, isSubmitting, onSubmit } = useStaffSignup();
  
  // Show verification UI while checking invitation status
  if (status === "loading" || status === "invalid") {
    return <StaffInvitationVerification status={status} invitation={invitation} />;
  }
  
  // Valid token, show signup form
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Staff Signup</CardTitle>
          <Badge className="bg-green-100 text-green-700 border-green-200">
            Invitation Valid
          </Badge>
        </div>
        <CardDescription>
          Complete your staff account registration
        </CardDescription>
      </CardHeader>
      <CardContent>
        <StaffSignupFormFields 
          form={form} 
          invitation={invitation} 
          isSubmitting={isSubmitting} 
          onSubmit={onSubmit} 
        />
      </CardContent>
    </Card>
  );
};

export default StaffSignupForm;
