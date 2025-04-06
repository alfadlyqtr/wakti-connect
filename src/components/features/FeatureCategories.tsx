
import React from "react";
import { ClipboardCheck, Calendar, LayoutDashboard } from "lucide-react";
import { SectionContainer } from "@/components/ui/section-container";
import FeatureDetail from "./FeatureDetail";
import { useTranslation } from "react-i18next";

const FeatureCategories = () => {
  const { t } = useTranslation();

  // Using translation keys instead of direct strings
  const taskManagementFeatures = [
    "features.taskManagement.dailyWeeklyViews",
    "features.taskManagement.dragDropSorting",
    "features.taskManagement.priorityColors",
    "features.taskManagement.toDoList",
    "features.taskManagement.teamTaskAssignment",
    "features.taskManagement.taskHistory"
  ];

  const appointmentFeatures = [
    "features.appointment.createManageServices",
    "features.appointment.shareableBookingPages",
    "features.appointment.manageAssignAppointments",
    "features.appointment.automaticReminders"
  ];

  const dashboardFeatures = [
    "features.dashboard.summaryView",
    "features.dashboard.userRoleManagement",
    "features.dashboard.darkMode",
    "features.dashboard.bilingualSupport"
  ];

  return (
    <SectionContainer className="bg-muted/30 mb-12">
      <h2 className="text-3xl font-bold mb-8">{t("features.featurePage.coreFeatures")}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-wakti-blue/10 p-3 rounded-full text-wakti-blue">
              <ClipboardCheck size={28} />
            </div>
            <h2 className="text-2xl font-bold">{t("features.featurePage.taskManagement")}</h2>
          </div>
          <FeatureDetail features={taskManagementFeatures} />
        </div>
        
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-green-500/10 p-3 rounded-full text-green-500">
              <Calendar size={28} />
            </div>
            <h2 className="text-2xl font-bold">{t("features.featurePage.appointmentScheduling")}</h2>
          </div>
          <FeatureDetail features={appointmentFeatures} />
        </div>
        
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-purple-500/10 p-3 rounded-full text-purple-500">
              <LayoutDashboard size={28} />
            </div>
            <h2 className="text-2xl font-bold">{t("features.featurePage.dashboardUserManagement")}</h2>
          </div>
          <FeatureDetail features={dashboardFeatures} />
        </div>
      </div>
    </SectionContainer>
  );
};

export default FeatureCategories;
