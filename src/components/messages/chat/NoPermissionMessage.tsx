
import React from "react";
import { AlertTriangle } from "lucide-react";

const NoPermissionMessage: React.FC = () => {
  return (
    <div className="border-t p-4 bg-amber-50">
      <div className="flex items-center text-amber-600 mb-2">
        <AlertTriangle className="h-4 w-4 mr-2" />
        <p className="font-medium">Can't send messages</p>
      </div>
      <p className="text-sm text-muted-foreground">
        You don't have permission to message this user. This might be because:
      </p>
      <ul className="text-sm text-muted-foreground mt-1 list-disc pl-4">
        <li>You have a free account</li>
        <li>This user is not in your contacts</li>
        <li>You're not subscribed to this business</li>
      </ul>
    </div>
  );
};

export default NoPermissionMessage;
