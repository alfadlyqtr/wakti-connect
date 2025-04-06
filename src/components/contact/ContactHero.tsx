
import React from "react";
import { useTranslation } from "react-i18next";

const ContactHero = () => {
  const { t } = useTranslation();
  
  return (
    <div className="text-center mb-16">
      <h1 className="text-4xl md:text-5xl font-bold mb-4">{t("contact.getInTouch")}</h1>
      <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
        {t("contact.hereToHelp")}
      </p>
    </div>
  );
};

export default ContactHero;
