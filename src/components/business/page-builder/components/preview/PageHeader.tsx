
import React from "react";
import { useBusinessPage } from "../../context/BusinessPageContext";

export const PageHeader = () => {
  const { pageData } = useBusinessPage();
  
  // Get business name from pageSetup and ensure it's properly displayed
  const businessName = pageData.pageSetup?.businessName || "My Business";
  const alignment = pageData.pageSetup?.alignment || "center";
  
  // Map alignment to Tailwind classes
  const textAlignClass = {
    left: "text-left",
    center: "text-center",
    right: "text-right"
  }[alignment];

  console.log("PageHeader rendering with data:", {
    businessName,
    alignment,
    pageSetupData: pageData.pageSetup
  });

  return (
    <header className={`${textAlignClass} py-8 px-4`}>
      <h1 className="text-3xl md:text-4xl font-bold">{businessName}</h1>
    </header>
  );
};
