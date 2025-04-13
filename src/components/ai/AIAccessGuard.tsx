import React from 'react';
import { Navigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import AIUpgradeRequired from './AIUpgradeRequired';

interface AIAccessGuardProps {
  children: React.ReactNode;
}

/**
 * Guard component that prevents staff members from accessing AI features
 */
const AIAccessGuard: React.FC<AIAccessGuardProps> = ({ children }) => {
  const { toast } = useToast();
  const userRole = localStorage.getItem('userRole');
  
  // If user is a staff member, show restricted access message and redirect
  if (userRole === 'staff') {
    toast({
      title: "Access Restricted",
      description: "AI features are not available for staff accounts",
      variant: "destructive",
    });
    
    return <Navigate to="/dashboard" replace />;
  }
  
  // If user has free account, show upgrade required message
  if (userRole === 'free') {
    return <AIUpgradeRequired />;
  }
  
  // Otherwise allow access to AI features
  return <>{children}</>;
};

export default AIAccessGuard;
