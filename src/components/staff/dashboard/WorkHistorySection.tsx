
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import WorkHistory from "@/components/staff/WorkHistory";
import { useTranslation } from "react-i18next";

interface WorkHistorySectionProps {
  staffRelationId: string;
}

const WorkHistorySection: React.FC<WorkHistorySectionProps> = ({ staffRelationId }) => {
  const { t } = useTranslation();
  
  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-3">{t("staff.recentWorkHistory")}</h2>
      <Card>
        <CardContent className="p-6">
          <WorkHistory staffRelationId={staffRelationId} limit={5} />
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkHistorySection;
