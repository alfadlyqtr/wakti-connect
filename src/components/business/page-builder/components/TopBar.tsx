
import React from "react";
import { Settings, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BusinessPageData } from "../context/BusinessPageContext";
import { useBusinessPage } from "../context/BusinessPageContext";
import { generateSlug } from "@/utils/string-utils";

interface TopBarProps {
  onSettingsClick: () => void;
  pageData: BusinessPageData;
}

export const TopBar = ({ onSettingsClick, pageData }: TopBarProps) => {
  const { handleSave, saveStatus } = useBusinessPage();
  
  // Generate a properly formatted URL based on the page title
  const getPreviewUrl = () => {
    // Use the page title or fall back to business name if needed
    const pageTitle = pageData.pageSetup.businessName || 'your-landing-page';
    const slug = generateSlug(pageTitle);
    return `${window.location.origin}/${slug}`;
  };

  return (
    <div className="border-b bg-card shadow-sm p-2 flex items-center justify-between">
      <Button 
        onClick={onSettingsClick}
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
      >
        <Settings className="h-4 w-4" />
        <span>Landing Page Settings</span>
      </Button>

      <div className="flex items-center gap-1 text-sm text-muted-foreground">
        <Globe className="h-4 w-4" />
        <span className="font-mono">{getPreviewUrl()}</span>
      </div>

      <div className="flex items-center gap-2">
        <div className="text-xs text-muted-foreground">
          {saveStatus === "saved" ? "All changes saved" : 
           saveStatus === "saving" ? "Saving..." : 
           "You have unsaved changes"}
        </div>
        <Button
          onClick={handleSave}
          disabled={saveStatus === "saved" || saveStatus === "saving"}
          variant="default"
          size="sm"
        >
          {saveStatus === "saving" ? "Saving..." : "Publish"}
        </Button>
      </div>
    </div>
  );
};
