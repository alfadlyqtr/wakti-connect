
import React from "react";
import { Shield } from "lucide-react";

const NoPermissionMessage: React.FC = () => {
  return (
    <div className="p-4 border-t flex flex-col items-center text-center gap-2">
      <Shield className="h-8 w-8 text-muted-foreground" />
      <h3 className="font-medium">No Permission to Message</h3>
      <p className="text-sm text-muted-foreground max-w-md">
        You don't have permission to message this user. This may be because:
      </p>
      <ul className="text-sm text-muted-foreground list-disc pl-6 text-left">
        <li>You're using a free account</li>
        <li>They are not in your contacts</li>
        <li>You are not subscribed to their business</li>
      </ul>
    </div>
  );
};

export default NoPermissionMessage;
