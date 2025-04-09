
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

const StaffStatusMessage: React.FC = () => {
  return (
    <Card>
      <CardContent className="p-6 text-center">
        <div className="mx-auto w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center mb-4">
          <AlertCircle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
        </div>
        <h3 className="text-lg font-medium mb-2">Staff Required</h3>
        <p className="text-muted-foreground mb-2">
          You need to add staff members to your business before creating job cards.
        </p>
      </CardContent>
    </Card>
  );
};

export default StaffStatusMessage;
