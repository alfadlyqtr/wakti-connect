
import React from "react";
import { Loader2, AlertCircle, Building2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { StaffInvitation } from "@/hooks/staff/types";

interface StaffInvitationVerificationProps {
  isLoading: boolean;
  error: string | null;
  invitation: StaffInvitation | null;
  businessName?: string;
}

const StaffInvitationVerification: React.FC<StaffInvitationVerificationProps> = ({ 
  isLoading, 
  error, 
  invitation,
  businessName 
}) => {
  const navigate = useNavigate();

  // Loading state
  if (isLoading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-10">
            <Loader2 className="h-8 w-8 text-wakti-blue animate-spin mb-4" />
            <p className="text-center text-muted-foreground">
              {businessName ? 
                `Verifying your invitation to join ${businessName}...` : 
                "Verifying your invitation..."}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Invalid token state
  if (error || !invitation) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Invalid Invitation</CardTitle>
          <CardDescription>
            This invitation link is invalid or has expired
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error || "The staff invitation link you used is invalid or has expired. Please contact your business administrator for a new invitation."}
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={() => navigate("/auth")}>
            Go to Login
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  return null;
};

export default StaffInvitationVerification;
