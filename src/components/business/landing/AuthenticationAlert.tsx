
import React from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface AuthenticationAlertProps {
  visible: boolean;
  onDismiss: () => void;
  redirectToSignup?: () => void;
}

const AuthenticationAlert: React.FC<AuthenticationAlertProps> = ({ 
  visible, 
  onDismiss,
  redirectToSignup
}) => {
  if (!visible) return null;
  
  return (
    <div className="container mx-auto px-4 pt-4 z-50 sticky top-0 animate-fade-in">
      <Alert variant="warning" className="border-amber-400 bg-amber-50 shadow-md">
        <AlertCircle className="h-5 w-5 text-amber-500" />
        <AlertTitle className="text-amber-700 font-semibold">Authentication Required</AlertTitle>
        <AlertDescription className="text-amber-600">
          You need to create an account or log in to subscribe to this business.
        </AlertDescription>
        <div className="mt-3 flex justify-end gap-2">
          {redirectToSignup && (
            <Button 
              variant="default" 
              size="sm"
              className="bg-amber-500 hover:bg-amber-600 text-white border-none"
              onClick={redirectToSignup}
            >
              Sign Up / Login
            </Button>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onDismiss}
            className="border-amber-300 text-amber-700 hover:bg-amber-100"
          >
            Dismiss
          </Button>
        </div>
      </Alert>
    </div>
  );
};

export default AuthenticationAlert;
