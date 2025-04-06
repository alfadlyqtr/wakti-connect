
import React from "react";
import { Image } from "lucide-react";
import { AIToolCard } from "./AIToolCard";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

export const ImageAnalysisToolCard: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <AIToolCard
      icon={Image}
      title={t("ai.tools.image.title")}
      description={t("ai.tools.document.uploadDescription")}
      iconColor="text-green-500"
    >
      <Button disabled className="w-full">
        {t("common.loading")}
      </Button>
    </AIToolCard>
  );
};
