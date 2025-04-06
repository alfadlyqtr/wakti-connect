
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const FeatureCallToAction = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  return (
    <section className="bg-wakti-blue py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          {t("cta.title")}
        </h2>
        <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
          {t("cta.description")}
        </p>
        <Button 
          variant="secondary" 
          size="lg"
          onClick={() => navigate("/signup")}
          className="text-wakti-blue font-medium"
        >
          {t("cta.button")}
        </Button>
      </div>
    </section>
  );
};

export default FeatureCallToAction;
