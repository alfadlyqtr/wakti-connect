
import React from "react";
import { useBusinessPage } from "../../context/BusinessPageContext";

export const PageHeader = () => {
  const { pageData } = useBusinessPage();
  const { businessName, alignment } = pageData.pageSetup;
  
  const textAlignClass = {
    left: "text-left",
    center: "text-center",
    right: "text-right"
  }[alignment];

  return (
    <header className={`${textAlignClass} py-4`}>
      <h1 className="text-3xl font-bold">{businessName || "My Business"}</h1>
    </header>
  );
};
