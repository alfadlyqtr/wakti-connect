
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const NotificationError: React.FC = () => {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        There was an error loading the notification. Please try again later.
      </AlertDescription>
    </Alert>
  );
};
