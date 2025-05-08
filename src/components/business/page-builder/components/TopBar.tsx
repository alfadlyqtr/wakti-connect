
import React, { useState } from "react";
import { Settings, Globe, Copy, ExternalLink, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BusinessPageData } from "../context/BusinessPageContext";
import { useBusinessPage } from "../context/BusinessPageContext";
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
  onPublish: () => void;
  pageUrl: string;
}

export const TopBar = ({ onSettingsClick, pageData, businessName, onPublish, pageUrl }: TopBarProps) => {
  const { handleSave, saveStatus } = useBusinessPage();
  const [showURLInfo, setShowURLInfo] = useState(false);
  
  // Helper function to generate URL from business name
  const generatePageUrl = (name: string): string => {
    if (!name) return "";
    // Convert to lowercase, replace spaces with hyphens, remove special chars
    const slug = name.toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
    return `${slug}.wakti.app`;
  };
  
  // Generate URL display - ensure we're using the correct data path
  const displayUrl = pageData.pageSetup?.businessName ? 
    `${generatePageUrl(pageData.pageSetup.businessName)}` : 
    (pageUrl || "No URL yet");
  
  // Copy URL to clipboard
  const copyToClipboard = () => {
    if (!displayUrl || displayUrl === "No URL yet") {
      toast({
        title: "No URL available",
        description: "Save and publish your page first to get a URL.",
      });
      return;
    }
    
    navigator.clipboard.writeText(`https://${displayUrl}`);
    toast({
      title: "URL copied to clipboard",
      description: "You can now paste it anywhere.",
    });
  };
  
  // Open URL in new tab
  const openUrl = () => {
    if (!displayUrl || displayUrl === "No URL yet") {
      toast({
        title: "No URL available", 
        description: "Save and publish your page first to get a URL."
      });
      return;
    }
    window.open(`https://${displayUrl}`, '_blank');
  };

  // Display title from the page data
  const displayTitle = pageData.pageSetup.businessName || businessName || "My Business";

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
          <span className="font-mono text-sm">{displayUrl ? `https://${displayUrl}` : "No URL yet"}</span>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 w-6 p-0 ml-2"
            onClick={copyToClipboard}
            disabled={!displayUrl || displayUrl === "No URL yet"}
          >
            <Copy className="h-3 w-3" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 w-6 p-0"
            onClick={openUrl}
            disabled={!displayUrl || displayUrl === "No URL yet"}
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
          variant="outline"
          size="sm"
        >
          {saveStatus === "saving" ? "Saving..." : "Save"}
        </Button>
        
        <Button
          onClick={onPublish}
          variant={pageData.published ? "destructive" : "default"}
          size="sm"
        >
          {pageData.published ? "Unpublish" : "Publish"}
        </Button>
      </div>
    </div>
  );
};
