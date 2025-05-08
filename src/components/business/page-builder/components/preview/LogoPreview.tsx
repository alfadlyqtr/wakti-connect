
import React from "react";
import { useBusinessPage } from "../../context/BusinessPageContext";

export const LogoPreview = () => {
  const { pageData } = useBusinessPage();
  const { url, shape, alignment } = pageData.logo;
  
  if (!url) {
    return (
      <div className="h-20 flex items-center justify-center bg-muted/20 rounded border border-dashed">
        <span className="text-sm text-muted-foreground">Logo will appear here</span>
      </div>
    );
  }
  
  const alignmentClass = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end"
  }[alignment];
  
  const shapeClass = shape === "circle" ? "rounded-full" : "rounded";
  
  return (
    <div className={`flex ${alignmentClass} py-4`}>
      <img 
        src={url} 
        alt="Business Logo" 
        className={`h-20 max-w-[200px] object-contain ${shapeClass}`}
      />
    </div>
  );
};
