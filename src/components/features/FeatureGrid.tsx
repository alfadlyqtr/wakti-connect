
import React from "react";
import FeatureCard from "./FeatureCard";
import { Calendar, Clock, Users, BarChart, MessageSquare, Bot } from "lucide-react";
import { useTranslation } from "react-i18next";

const FeatureGrid = () => {
  const { t } = useTranslation();
  
  const features = [
    {
      icon: <Calendar className="h-6 w-6" />,
      title: t("features.taskManagement.title"),
      description: t("features.taskManagement.description"),
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: t("features.teamCollaboration.title"),
      description: t("features.teamCollaboration.description"),
    },
    {
      icon: <MessageSquare className="h-6 w-6" />,
      title: t("features.messaging.title"),
      description: t("features.messaging.description"),
    },
    {
      icon: <BarChart className="h-6 w-6" />,
      title: t("features.analytics.title"),
      description: t("features.analytics.description"),
    },
    {
      icon: <Bot className="h-6 w-6" />,
      title: t("features.aiIntegration.title"),
      description: t("features.aiIntegration.description"),
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: t("features.appointmentBooking.title"),
      description: t("features.appointmentBooking.description"),
    }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureGrid;
