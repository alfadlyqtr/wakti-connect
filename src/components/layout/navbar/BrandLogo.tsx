
import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const BrandLogo = () => {
  const { t } = useTranslation();
  
  return (
    <Link to="/" className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-md bg-wakti-blue flex items-center justify-center">
        <span className="text-white font-bold">W</span>
      </div>
      <span className="font-bold text-lg hidden md:block">{t('common.wakti')}</span>
    </Link>
  );
};

export default BrandLogo;
