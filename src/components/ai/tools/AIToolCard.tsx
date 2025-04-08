
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

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
  return (
    <Card>
      <CardHeader className="pb-1 sm:pb-2">
        <CardTitle className="text-base sm:text-lg flex items-center">
          {logoSrc ? (
            <img src={logoSrc} alt={title} className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
          ) : (
            <Icon className={`h-4 w-4 sm:h-5 sm:w-5 mr-2 ${iconColor}`} />
          )}
          <span className="truncate">{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs sm:text-sm text-muted-foreground mb-3 line-clamp-2 sm:line-clamp-none">
          {description}
        </p>
        {children}
      </CardContent>
    </Card>
  );
};
