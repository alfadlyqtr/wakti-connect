
import React from "react";
import { useTranslation } from "react-i18next";

const FeatureHero = () => {
  const { t } = useTranslation();
  
  return (
    <div className="bg-gradient-to-b from-background to-muted py-16 lg:py-24">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          {t("features.title")}
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12">
          {t("features.subtitle")}
        </p>
      </div>
    </div>
  );
};

export default FeatureHero;
