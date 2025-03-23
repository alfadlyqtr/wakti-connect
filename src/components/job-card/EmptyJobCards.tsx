
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, PlusCircle } from 'lucide-react';

interface EmptyJobCardsProps {
  onCreateJobCard: () => void;
  canCreateCard: boolean;
}

const EmptyJobCards: React.FC<EmptyJobCardsProps> = ({ 
  onCreateJobCard,
  canCreateCard
}) => {
  return (
    <Card>
      <CardContent className="p-6 text-center">
        <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
          <FileText className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium mb-2">No Job Cards Yet</h3>
        <p className="text-muted-foreground mb-4">
          {canCreateCard 
            ? "Start recording your completed jobs" 
            : "Start your work day to begin recording jobs"}
        </p>
        <Button 
          onClick={onCreateJobCard}
          disabled={!canCreateCard}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Create Job Card
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmptyJobCards;
