
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb } from "lucide-react";

interface HelpPlatformInfoProps {
  accountType: "free" | "individual" | "business";
}

export const HelpPlatformInfo = ({ accountType }: HelpPlatformInfoProps) => {
  return (
    <Card>
      <CardContent className="pt-6 flex flex-col sm:flex-row gap-4 items-start">
        <Lightbulb className="h-8 w-8 text-yellow-500 shrink-0" />
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-medium">Welcome to WAKTI Help Center</h3>
            <Badge variant="outline" className="capitalize">
              {accountType} Plan
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            WAKTI is an all-in-one productivity and business management platform with task management, 
            appointment booking, messaging, and {accountType === 'business' ? 'advanced business management features' : 'more'}.
          </p>
          <p className="text-sm text-muted-foreground">
            Help content is tailored to your <strong className="capitalize">{accountType}</strong> plan. 
            {accountType !== 'business' && " Upgrade your plan to unlock more features and capabilities."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
