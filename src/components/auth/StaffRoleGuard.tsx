
import React from 'react';
import { Navigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface StaffRoleGuardProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  fallback?: React.ReactNode;
}

export const StaffRoleGuard: React.FC<StaffRoleGuardProps> = ({ 
  children, 
  allowedRoles = ['admin', 'co-admin'], 
  fallback 
}) => {
  // Mock implementation - always render children
  return <>{children}</>;
};

export default StaffRoleGuard;
