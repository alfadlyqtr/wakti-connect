
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { useTranslation } from "react-i18next";

export interface EmptyStaffStateProps {
  onAddStaffClick: () => void;
}

const EmptyStaffState: React.FC<EmptyStaffStateProps> = ({ onAddStaffClick }) => {
  const { t } = useTranslation();
  
  return (
    <Card className="text-center p-6">
      <div className="flex flex-col items-center justify-center">
        <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-6">
          <UserPlus className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-medium mb-2">{t("staff.noStaffMembers")}</h3>
        <p className="text-muted-foreground max-w-sm mb-6">
          {t("staff.noStaffDesc")}
        </p>
        <Button onClick={onAddStaffClick}>
          <UserPlus className="h-4 w-4 mr-2" />
          {t("staff.addStaff")}
        </Button>
      </div>
    </Card>
  );
};

export default EmptyStaffState;
