
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useTranslation } from "react-i18next";

interface EmptyJobCardsProps {
  onCreateJobCard: () => void;
  canCreateCard: boolean;
}

const EmptyJobCards: React.FC<EmptyJobCardsProps> = ({ onCreateJobCard, canCreateCard }) => {
  const { t } = useTranslation();
  
  return (
    <div className="text-center p-8 border rounded-lg border-dashed">
      <h3 className="text-lg font-medium mb-2">{t("jobCards.noJobCards")}</h3>
      
      {canCreateCard ? (
        <>
          <p className="text-muted-foreground mb-4">
            {t("jobCards.createJobCard")}
          </p>
          <Button onClick={onCreateJobCard}>
            <PlusCircle className="h-4 w-4 mr-2" />
            {t("task.createTask")}
          </Button>
        </>
      ) : (
        <Alert variant="destructive" className="mt-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {t("jobCards.needWorkDay")}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default EmptyJobCards;
