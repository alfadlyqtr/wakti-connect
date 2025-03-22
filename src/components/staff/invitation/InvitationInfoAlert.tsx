
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const InvitationInfoAlert = () => {
  return (
    <Alert className="mb-4">
      <AlertTitle>About Staff Invitations</AlertTitle>
      <AlertDescription>
        <p className="mb-2">
          Invitations are valid for 48 hours. Share the invitation link with your staff members 
          by copying it or opening it directly in a new tab.
        </p>
        <p>
          <strong>Note:</strong> We've simplified the process to use invitation links only, 
          without sending emails directly from the system.
        </p>
      </AlertDescription>
    </Alert>
  );
};

export default InvitationInfoAlert;
