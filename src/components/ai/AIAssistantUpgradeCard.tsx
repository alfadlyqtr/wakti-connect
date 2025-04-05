
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export function AIAssistantUpgradeCard() {
  const { t } = useTranslation();
  
  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-wakti-blue" />
          <span>{t("ai.assistant")}</span>
          <Lock className="h-4 w-4 text-muted-foreground" />
        </CardTitle>
        <CardDescription>
          {t("ai.unlockFeatures")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg bg-muted p-4">
          <h3 className="font-medium mb-2">{t("ai.benefits")}</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <div className="h-5 w-5 rounded-full bg-wakti-blue/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-wakti-blue text-xs">✓</span>
              </div>
              <span>{t("ai.features.taskScheduling")}</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="h-5 w-5 rounded-full bg-wakti-blue/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-wakti-blue text-xs">✓</span>
              </div>
              <span>{t("ai.features.eventPlanning")}</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="h-5 w-5 rounded-full bg-wakti-blue/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-wakti-blue text-xs">✓</span>
              </div>
              <span>{t("ai.features.staffManagement")}</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="h-5 w-5 rounded-full bg-wakti-blue/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-wakti-blue text-xs">✓</span>
              </div>
              <span>{t("ai.features.analyticsInsights")}</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="h-5 w-5 rounded-full bg-wakti-blue/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-wakti-blue text-xs">✓</span>
              </div>
              <span>{t("ai.features.customizablePersonality")}</span>
            </li>
          </ul>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link to="/dashboard/settings">
            {t("ai.upgradePlan")}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
