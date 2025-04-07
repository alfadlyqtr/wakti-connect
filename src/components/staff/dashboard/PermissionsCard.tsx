
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

interface PermissionsCardProps {
  permissions: Record<string, boolean | undefined>;
}

const PermissionsCard: React.FC<PermissionsCardProps> = ({ permissions }) => {
  const { t } = useTranslation();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("staff.permissions")}</CardTitle>
        <CardDescription>{t("staff.permissionsDesc")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {Object.entries(permissions)
            .filter(([_, value]) => value)
            .map(([key]) => (
              <div key={key} className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-wakti-blue"></div>
                <span className="text-sm">
                  {key.replace('can_', '').replace(/_/g, ' ')}
                </span>
              </div>
            ))
          }
        </div>
      </CardContent>
    </Card>
  );
};

export default PermissionsCard;
