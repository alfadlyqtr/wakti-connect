
import React, { useEffect } from 'react';
import { AlertCircle, X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface AuthenticationAlertProps {
  visible: boolean;
  onDismiss: () => void;
}

const AuthenticationAlert: React.FC<AuthenticationAlertProps> = ({ 
  visible, 
  onDismiss 
}) => {
  const navigate = useNavigate();
  
  useEffect(() => {
    if (visible) {
      // Auto-dismiss after 10 seconds
      const timer = setTimeout(() => {
        onDismiss();
      }, 10000);
      
      return () => clearTimeout(timer);
    }
  }, [visible, onDismiss]);
  
  if (!visible) return null;
  
  return (
    <Alert 
      className="mb-6 bg-primary/10 border-primary/30 relative animate-fade-in"
      variant="default"
    >
      <AlertCircle className="h-4 w-4 text-primary" />
      <AlertDescription className="text-sm ml-2">
        <span className="block sm:inline">
          You need to be logged in to subscribe to this business.
        </span>
        <div className="mt-2 flex gap-2">
          <Button 
            size="sm" 
            onClick={() => {
              navigate('/auth/login');
            }}
          >
            Log in
          </Button>
          <Button 
            size="sm"
            variant="outline"
            onClick={() => {
              navigate('/auth/register');
            }}
          >
            Sign up
          </Button>
        </div>
      </AlertDescription>
      
      <Button 
        size="sm" 
        variant="ghost" 
        className="absolute top-2 right-2 h-6 w-6 p-0" 
        onClick={onDismiss}
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </Button>
    </Alert>
  );
};

export default AuthenticationAlert;
