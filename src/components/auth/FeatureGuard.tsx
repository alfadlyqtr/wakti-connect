
import React from 'react';
import { useFeatureAccess } from '@/hooks/useFeatureAccess';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, ShieldAlert } from 'lucide-react';

interface FeatureGuardProps {
  featureKey: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const FeatureGuard: React.FC<FeatureGuardProps> = ({ 
  featureKey, 
  children, 
  fallback 
}) => {
  const { hasAccess, isLoading } = useFeatureAccess(featureKey);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!hasAccess) {
    if (fallback) {
      return <>{fallback}</>;
    }
    
    return (
      <Card className="border border-destructive/20 bg-destructive/5">
        <CardContent className="pt-6 pb-4">
          <div className="flex items-start gap-3">
            <ShieldAlert className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <div className="font-medium text-destructive mb-1">Access Restricted</div>
              <p className="text-muted-foreground">
                You don't have permission to access this feature.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return <>{children}</>;
};

export default FeatureGuard;
