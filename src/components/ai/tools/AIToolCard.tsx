
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

interface AIToolCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  iconColor?: string;
  logoSrc?: string;
  children: React.ReactNode;
}

export const AIToolCard: React.FC<AIToolCardProps> = ({
  icon: Icon,
  title,
  description,
  iconColor = "text-blue-600",
  logoSrc,
  children,
}) => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className={`text-lg flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
          {logoSrc ? (
            <img src={logoSrc} alt={title} className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
          ) : (
            <Icon className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'} ${iconColor}`} />
          )}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-3">
          {description}
        </p>
        {children}
      </CardContent>
    </Card>
  );
};
