
import React from "react";
import { useTranslation } from "react-i18next";

interface BusinessPageNotFoundProps {
  slug?: string;
}

const BusinessPageNotFound: React.FC<BusinessPageNotFoundProps> = ({ slug }) => {
  const { t } = useTranslation();
  
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-3xl font-bold mb-4">{t("business.notFoundPage")}</h1>
      <p className="text-muted-foreground">
        {slug 
          ? t("business.specificNotExist", { slug })
          : t("business.notExist")
        }
      </p>
    </div>
  );
};

export default BusinessPageNotFound;
