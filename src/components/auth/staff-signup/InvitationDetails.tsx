
import React from "react";
import { AlertCircle } from "lucide-react";
import { StaffInvitation } from "@/hooks/staff/types";

interface InvitationDetailsProps {
  invitation: StaffInvitation;
}

const InvitationDetails: React.FC<InvitationDetailsProps> = ({ invitation }) => {
  return (
    <div className="space-y-4">
      <div className="border rounded-md p-4 bg-muted/50">
        <h3 className="font-medium mb-2">Invitation Details</h3>
        <p className="text-sm">
          <span className="text-muted-foreground">Name:</span> {invitation.name}
        </p>
        <p className="text-sm">
          <span className="text-muted-foreground">Email:</span> {invitation.email}
        </p>
        <p className="text-sm">
          <span className="text-muted-foreground">Role:</span> {invitation.role.charAt(0).toUpperCase() + invitation.role.slice(1)}
        </p>
        {invitation.position && (
          <p className="text-sm">
            <span className="text-muted-foreground">Position:</span> {invitation.position}
          </p>
        )}
      </div>
      
      <div className="rounded-md border p-4 bg-amber-50 dark:bg-amber-950/30">
        <div className="flex gap-3">
          <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-500" />
          <div>
            <h3 className="font-medium text-amber-800 dark:text-amber-400">How would you like to proceed?</h3>
            <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
              Accepting will create your staff account. Declining will reject the invitation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvitationDetails;
