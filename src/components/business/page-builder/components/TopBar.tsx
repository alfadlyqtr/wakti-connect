import React, { useState } from "react";
import { Settings, Globe, Copy, ExternalLink, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BusinessPageData } from "../context/BusinessPageContext";
import { useBusinessPage } from "../context/BusinessPageContext";
import { generateSlug } from "@/utils/string-utils";
import { toast } from "@/components/ui/use-toast";
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TopBarProps {
  onSettingsClick: () => void;
  pageData: BusinessPageData;
  businessName?: string | null;
}

export const TopBar = ({ onSettingsClick, pageData, businessName }: TopBarProps) => {
  const { handleSave, saveStatus } = useBusinessPage();
  const [showURLInfo, setShowURLInfo] = useState(false);
  
  // Generate a properly formatted URL based on the business name from user profile settings
  const getPreviewUrl = () => {
    // Return URL based on businessName from user's profile settings if available
    if (businessName) {
      const slug = generateSlug(businessName);
      return `www.wakti.qa/${slug}`;
    }
    // Otherwise show a placeholder
    return `www.wakti.qa/your-business-name`;
  };
  
  // Copy URL to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(getPreviewUrl());
    toast({
      title: "URL copied to clipboard",
      description: "You can now paste it anywhere.",
    });
  };
  
  // Open URL in new tab
  const openUrl = () => {
    window.open(`https://${getPreviewUrl()}`, '_blank');
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

      <div className="flex items-center gap-2">
        <div className="flex items-center border rounded-md px-2 py-1 bg-gray-50">
          <Globe className="h-4 w-4 text-gray-500 mr-2" />
          <span className="font-mono text-sm">{getPreviewUrl()}</span>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 w-6 p-0 ml-2"
            onClick={copyToClipboard}
          >
            <Copy className="h-3 w-3" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 w-6 p-0"
            onClick={openUrl}
          >
            <ExternalLink className="h-3 w-3" />
          </Button>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
              >
                <Info className="h-3 w-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p className="text-xs">
                Your URL is based on your business name from your account settings.
                Once published, URL changes require a special request.
              </p>
            </TooltipContent>
          </Tooltip>
        </div>
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
