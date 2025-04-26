
import React from "react";
import { Loader2 } from "lucide-react";

/**
 * Component to display while authentication processes are loading
 */
const AuthLoadingState: React.FC = () => {
  return (
    <div className="flex min-h-[200px] items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
        <p className="text-muted-foreground">Authenticating...</p>
      </div>
    </div>
  );
};

export default AuthLoadingState;
