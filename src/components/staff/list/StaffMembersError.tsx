
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

export interface StaffMembersErrorProps {
  errorMessage: string;
  onRetry: () => void;
}

const StaffMembersError: React.FC<StaffMembersErrorProps> = ({ errorMessage, onRetry }) => {
  const { t } = useTranslation();
  
  return (
    <Card className="col-span-full p-6">
      <div className="flex items-center text-destructive space-x-2 mb-4">
        <AlertCircle className="h-5 w-5" />
        <p className="font-medium">{t("staff.loadFailed")}</p>
      </div>
      <p className="text-sm text-muted-foreground mb-4">{errorMessage}</p>
      <Button size="sm" onClick={onRetry}>{t("common.cancel")}</Button>
    </Card>
  );
};

export default StaffMembersError;
