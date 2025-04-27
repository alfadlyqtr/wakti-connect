
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: React.ReactNode;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  gradient?: "purple" | "blue" | "gold" | "green";
}

export const StatsCard = ({ 
  title, 
  value, 
  icon: Icon, 
  subtitle, 
  iconColor = "text-blue-500",
  gradient = "blue"
}: StatsCardProps) => {
  const gradientClasses = {
    purple: "from-[#9b87f5]/10 via-white/80 to-[#D6BCFA]/10",
    blue: "from-[#60A5FA]/10 via-white/80 to-[#93C5FD]/10",
    gold: "from-[#FCD34D]/10 via-white/80 to-[#FBBF24]/10",
    green: "from-[#34D399]/10 via-white/80 to-[#6EE7B7]/10"
  };

  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02]",
      "bg-gradient-to-br border border-gray-200/50 dark:border-gray-700/50",
      gradientClasses[gradient]
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 py-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Icon className={cn("h-5 w-5", iconColor)} />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-3 py-1.5">
        <div className="text-2xl font-bold">{value}</div>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  );
};
