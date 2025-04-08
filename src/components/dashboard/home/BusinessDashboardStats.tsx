
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { useTranslation } from "react-i18next";

export const BusinessDashboardStats = () => {
  const { t } = useTranslation();
  
  return (
    <>
      <SectionHeading 
        title={t('dashboard.businessAnalytics')} 
        centered={false}
        className="mt-8 mb-4"
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('sidebar.subscribers')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold"></div>
            <p className="text-xs text-muted-foreground">
              {t('dashboard.totalSubscribers')}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('sidebar.staff')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold"></div>
            <p className="text-xs text-muted-foreground">
              {t('dashboard.activeStaff')}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('sidebar.services')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold"></div>
            <p className="text-xs text-muted-foreground">
              {t('dashboard.businessServices')}
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
