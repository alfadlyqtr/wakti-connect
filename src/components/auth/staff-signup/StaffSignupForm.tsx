
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Link } from "react-router-dom";

const StaffSignupForm = () => {
  return (
    <Card className="max-w-md w-full mx-auto">
      <CardHeader>
        <CardTitle>Staff Signup</CardTitle>
        <CardDescription>
          Staff accounts are now managed directly by business owners
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Staff management system updated</AlertTitle>
          <AlertDescription>
            The staff invitation system has been replaced. Business owners now create 
            staff accounts directly from their dashboard.
          </AlertDescription>
        </Alert>
        <p className="text-muted-foreground mb-6">
          If you are a staff member, please contact your business administrator to set up your account.
          They can create your account with full access permissions from their Staff Management panel.
        </p>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link to="/login">Return to Login</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default StaffSignupForm;
