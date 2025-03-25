
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface EmptyJobCardsProps {
  onCreateJobCard: () => void;
  canCreateCard: boolean;
}

const EmptyJobCards: React.FC<EmptyJobCardsProps> = ({ onCreateJobCard, canCreateCard }) => {
  return (
    <div className="text-center p-8 border rounded-lg border-dashed">
      <h3 className="text-lg font-medium mb-2">No job cards found</h3>
      
      {canCreateCard ? (
        <>
          <p className="text-muted-foreground mb-4">
            Create a job card to track completed jobs and payments
          </p>
          <Button onClick={onCreateJobCard}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Create Job Card
          </Button>
        </>
      ) : (
        <Alert variant="warning" className="mt-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You need to start your work day before creating job cards
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default EmptyJobCards;
