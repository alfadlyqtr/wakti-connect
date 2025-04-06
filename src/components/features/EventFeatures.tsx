
import React from "react";
import { SectionContainer } from "@/components/ui/section-container";
import { Calendar, Mail, Share2, Users } from "lucide-react";
import { useTranslation } from "react-i18next";

const EventFeatures = () => {
  const { t } = useTranslation();
  
  return (
    <SectionContainer className="py-16 bg-muted/30">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-6">{t("features.featurePage.eventSendingInvitations")}</h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          {t("features.featurePage.invitationDescription")}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-background p-6 rounded-lg border shadow-sm">
          <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mb-4">
            <Calendar className="text-blue-500 h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold mb-2">{t("features.featurePage.customizableEvents")}</h3>
          <p className="text-muted-foreground">
            {t("features.featurePage.customizableEventsDescription", "Create beautiful and unique event invitations with customizable colors, fonts, and images.")}
          </p>
        </div>
        
        <div className="bg-background p-6 rounded-lg border shadow-sm">
          <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
            <Share2 className="text-green-500 h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold mb-2">{t("features.featurePage.multipleSharing")}</h3>
          <p className="text-muted-foreground">
            {t("features.featurePage.multipleSharingDescription", "Share event invitations via WhatsApp, Email, SMS, or generate a direct link to send anywhere.")}
          </p>
        </div>
        
        <div className="bg-background p-6 rounded-lg border shadow-sm">
          <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center mb-4">
            <Users className="text-purple-500 h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold mb-2">{t("features.featurePage.networkGrowth")}</h3>
          <p className="text-muted-foreground">
            {t("features.featurePage.networkGrowthDescription", "Public event pages encourage sign-ups, helping you grow your network naturally with every invitation.")}
          </p>
        </div>
        
        <div className="bg-background p-6 rounded-lg border shadow-sm">
          <div className="w-12 h-12 bg-orange-500/10 rounded-full flex items-center justify-center mb-4">
            <Mail className="text-orange-500 h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold mb-2">{t("features.featurePage.realTimeResponses")}</h3>
          <p className="text-muted-foreground">
            {t("features.featurePage.realTimeResponsesDescription", "Get immediate notifications when invitations are viewed and accepted, helping you plan efficiently.")}
          </p>
        </div>
      </div>
    </SectionContainer>
  );
};

export default EventFeatures;
