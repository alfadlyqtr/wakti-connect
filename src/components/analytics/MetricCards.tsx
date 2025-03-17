
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Clock, AlertTriangle, Users } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  label, 
  value, 
  icon, 
  change, 
  changeType = "neutral" 
}) => {
  const changeColorClass = {
    positive: "text-green-500",
    negative: "text-red-500",
    neutral: "text-slate-500"
  }[changeType];
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-x-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
            {icon}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <h3 className="text-2xl font-bold">{value}</h3>
            {change && (
              <p className={`text-xs ${changeColorClass}`}>
                {change}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const MetricCards: React.FC = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard 
        label="Total Tasks" 
        value="127" 
        icon={<Clock className="h-6 w-6 text-primary" />}
        change="+12% from last month"
        changeType="positive"
      />
      <MetricCard 
        label="Completed Tasks" 
        value="82" 
        icon={<Check className="h-6 w-6 text-primary" />}
        change="65% completion rate"
        changeType="positive"
      />
      <MetricCard 
        label="Overdue Tasks" 
        value="8" 
        icon={<AlertTriangle className="h-6 w-6 text-primary" />}
        change="-3% from last month"
        changeType="positive"
      />
      <MetricCard 
        label="Team Members" 
        value="6" 
        icon={<Users className="h-6 w-6 text-primary" />}
      />
    </div>
  );
};
