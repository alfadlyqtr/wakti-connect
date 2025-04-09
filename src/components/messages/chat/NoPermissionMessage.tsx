
import React from "react";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const NoPermissionMessage: React.FC = () => {
  return (
    <div className="p-4 flex items-center justify-center h-full">
      <Alert variant="destructive" className="max-w-md">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>No Messaging Permission</AlertTitle>
        <AlertDescription>
          You don't have permission to message this user. They may need to accept your contact request first.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default NoPermissionMessage;
