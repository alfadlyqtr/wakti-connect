
import React from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface AuthenticationAlertProps {
  visible: boolean;
  onDismiss: () => void;
}

const AuthenticationAlert: React.FC<AuthenticationAlertProps> = ({ 
  visible, 
  onDismiss 
}) => {
  if (!visible) return null;
  
  return (
    <div className="container mx-auto px-4 pt-4 z-30 sticky top-0">
      <Alert variant="warning">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Authentication Required</AlertTitle>
        <AlertDescription>
          You need to create an account or log in to subscribe to this business.
        </AlertDescription>
        <div className="mt-2 flex justify-end">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onDismiss}
          >
            Dismiss
          </Button>
        </div>
      </Alert>
    </div>
  );
};

export default AuthenticationAlert;
