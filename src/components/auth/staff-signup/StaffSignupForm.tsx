
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * This component has been deprecated since staff accounts are now created directly 
 * by business owners rather than through invitations.
 */
const StaffSignupForm: React.FC = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Staff Sign Up</CardTitle>
        <CardDescription>
          Staff accounts are now created directly by business owners.
          Please contact your business administrator for access.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>This page has been deprecated.</p>
      </CardContent>
    </Card>
  );
};

export default StaffSignupForm;
