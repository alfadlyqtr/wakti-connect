
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { useTranslation } from "react-i18next";

const StaffStatusMessage: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <Card>
      <CardContent className="p-6 text-center">
        <div className="mx-auto w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center mb-4">
          <AlertCircle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
        </div>
        <h3 className="text-lg font-medium mb-2">{t("jobCards.staffRequired")}</h3>
        <p className="text-muted-foreground mb-2">
          {t("jobCards.staffRequiredDesc")}
        </p>
      </CardContent>
    </Card>
  );
};

export default StaffStatusMessage;
