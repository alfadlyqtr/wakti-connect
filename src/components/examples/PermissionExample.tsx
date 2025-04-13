import React from 'react';
import PermissionGuard from '@/components/auth/PermissionGuard';
import FeatureGuard from '@/components/auth/FeatureGuard';
import RestrictedAction from '@/components/ui/RestrictedAction';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFeatureAccess } from '@/hooks/useFeatureAccess';
import { UserPlus, Settings, BarChart, Lock } from 'lucide-react';

/**
 * Example component demonstrating different ways to use the permission system
 */
const PermissionExample: React.FC = () => {
  const { handleRestrictedAction } = useFeatureAccess('tasks_management');
  
  const handleRestrictedFeature = () => {
    // This will only execute if the user has access to tasks_management
    // Otherwise, it will show a toast notification
    handleRestrictedAction(() => {
      console.log('Performing restricted action...');
      alert('You have access to tasks management!');
    });
  };
  
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Permission System Examples</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Example 1: Simple PermissionGuard */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Example 1: PermissionGuard</CardTitle>
          </CardHeader>
          <CardContent>
            <PermissionGuard featureKey="staff_management">
              <div className="p-4 bg-primary/10 rounded-md">
                <p className="text-sm">This content is only visible if you have access to staff management.</p>
                <Button className="mt-2" size="sm">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Staff Member
                </Button>
              </div>
            </PermissionGuard>
          </CardContent>
        </Card>
        
        {/* Example 2: FeatureGuard */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Example 2: FeatureGuard</CardTitle>
          </CardHeader>
          <CardContent>
            <FeatureGuard 
              featureKey="business_analytics"
              fallback={
                <div className="p-4 border border-dashed rounded-md bg-muted/50">
                  <Lock className="h-5 w-5 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Analytics require a business account.
                  </p>
                </div>
              }
            >
              <div className="p-4 bg-primary/10 rounded-md">
                <BarChart className="h-16 w-16 text-primary mb-2" />
                <p className="text-sm">You have access to business analytics!</p>
              </div>
            </FeatureGuard>
          </CardContent>
        </Card>
        
        {/* Example 3: RestrictedAction */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Example 3: RestrictedAction</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
              RestrictedAction controls whether buttons/actions are shown:
            </p>
            
            <div>
              <RestrictedAction 
                featureKey="system_configuration"
                showFallback={true}
                fallbackMessage="Only administrators can access system settings"
              >
                <Button variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  System Settings
                </Button>
              </RestrictedAction>
            </div>
            
            {/* This button will be completely hidden if user doesn't have permission */}
            <div>
              <RestrictedAction featureKey="tasks_management">
                <Button variant="secondary">
                  Manage Tasks
                </Button>
              </RestrictedAction>
            </div>
          </CardContent>
        </Card>
        
        {/* Example 4: Using the hook directly */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Example 4: Using the hook</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Using useFeatureAccess hook for imperative permission checks:
            </p>
            
            <Button onClick={handleRestrictedFeature}>
              Test Permission Hook
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PermissionExample;
