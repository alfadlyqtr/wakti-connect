
import React from "react";
import { CheckCircle, Calendar, Users, MessageSquare, BarChart4, Sparkles } from "lucide-react";
import FeatureCard from "./FeatureCard";
import FeaturesHeading from "./FeaturesHeading";
import { useTranslation } from "@/components/mocks/translationMock";

const Features = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  
  const features = [
    {
      icon: <CheckCircle className="h-6 w-6 text-primary" />,
      title: String(t('features.taskManagement.title')),
      description: String(t('features.taskManagement.description')),
      delay: "0ms"
    },
    {
      icon: <Calendar className="h-6 w-6 text-wakti-gold" />,
      title: String(t('features.appointmentBooking.title')),
      description: String(t('features.appointmentBooking.description')),
      delay: "100ms"
    },
    {
      icon: <Users className="h-6 w-6 text-green-500" />,
      title: String(t('features.teamCollaboration.title')),
      description: String(t('features.teamCollaboration.description')),
      delay: "200ms"
    },
    {
      icon: <MessageSquare className="h-6 w-6 text-wakti-blue" />,
      title: String(t('features.messaging.title')),
      description: String(t('features.messaging.description')),
      delay: "300ms"
    },
    {
      icon: <BarChart4 className="h-6 w-6 text-purple-500" />,
      title: String(t('features.analytics.title')),
      description: String(t('features.analytics.description')),
      delay: "400ms"
    },
    {
      icon: <Sparkles className="h-6 w-6 text-amber-500" />,
      title: String(t('features.aiIntegration.title')),
      description: String(t('features.aiIntegration.description')),
      delay: "500ms"
    }
  ];

  return (
    <section id="features" className="py-16 md:py-24 px-4 bg-muted/30">
      <div className="container mx-auto max-w-5xl">
        <FeaturesHeading 
          title={String(t('features.title'))}
          subtitle={String(t('features.subtitle'))}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={feature.delay}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
