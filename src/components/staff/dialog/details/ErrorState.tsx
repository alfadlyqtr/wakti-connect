
import React from "react";
import { AlertTriangle } from "lucide-react";

export const ErrorState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-6">
      <AlertTriangle className="h-10 w-10 text-destructive mb-2" />
      <p className="text-center">
        Staff member not found or could not be loaded.
      </p>
    </div>
  );
};
