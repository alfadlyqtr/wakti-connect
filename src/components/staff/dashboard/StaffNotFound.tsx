
import React from "react";
import { Card } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

const StaffNotFound: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <Card className="p-8 text-center">
      <div className="flex flex-col items-center justify-center">
        <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-2xl font-medium">{t("staff.notFound")}</h3>
        <p className="text-muted-foreground mt-2 max-w-md mx-auto">
          {t("staff.notFoundDesc")}
        </p>
      </div>
    </Card>
  );
};

export default StaffNotFound;
