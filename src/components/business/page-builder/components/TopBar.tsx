
import React, { useState, useEffect } from "react";
import { Settings, Globe, Copy, ExternalLink, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BusinessPageData } from "../context/BusinessPageContext";
import { useBusinessPage } from "../context/BusinessPageContext";
import { toast } from "@/components/ui/use-toast";
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface TopBarProps {
  onSettingsClick: () => void;
  pageData: BusinessPageData;
  businessName?: string | null;
  onPublish: () => void;
  pageUrl: string;
}

export const TopBar = ({ onSettingsClick, pageData, businessName, onPublish, pageUrl }: TopBarProps) => {
  const { handleSave, saveStatus, updatePageData } = useBusinessPage();
  const [showURLInfo, setShowURLInfo] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [businessNameInput, setBusinessNameInput] = useState(pageData.pageSetup?.businessName || businessName || "");
  const [showNameAlert, setShowNameAlert] = useState(false);
  
  useEffect(() => {
    // Initialize from pageData or businessName prop if not already set
    if (!businessNameInput && (pageData.pageSetup?.businessName || businessName)) {
      setBusinessNameInput(pageData.pageSetup?.businessName || businessName || "");
    }
  }, [pageData.pageSetup?.businessName, businessName, businessNameInput]);
  
  // Helper function to generate URL slug from business name
  const generatePageSlug = (name: string): string => {
    if (!name) return "";
    // Convert to lowercase, replace spaces with hyphens, remove special chars
    const slug = name.toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
    return slug;
  };
  
  // Generate URL display with correct format (wakti.qa/business-name)
  const businessSlug = pageData.pageSetup?.businessName ? 
    generatePageSlug(pageData.pageSetup.businessName) : 
    generatePageSlug(businessName || "");

  const displayUrl = businessSlug ? 
    `wakti.qa/${businessSlug}` : 
    "No URL yet";
  
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

  // Handle business name change
  const handleBusinessNameChange = () => {
    if (pageData.published) {
      toast({
        title: "Cannot change URL",
        description: "Your page is already published. Business name cannot be changed after publishing.",
        variant: "destructive"
      });
      setBusinessNameInput(pageData.pageSetup?.businessName || "");
      return;
    }
    
    if (businessNameInput && businessNameInput !== pageData.pageSetup?.businessName) {
      setShowNameAlert(true);
    }
  };

  // Confirm business name change
  const confirmBusinessNameChange = () => {
    updatePageData({
      pageSetup: {
        ...pageData.pageSetup,
        businessName: businessNameInput
      }
    });
    
    toast({
      title: "Business name updated",
      description: "Your business name and URL have been updated. Remember, this cannot be changed after publishing.",
    });
    
    setIsEditing(false);
    setShowNameAlert(false);
    handleSave();
  };

  // Display title from the page data
  const displayTitle = pageData.pageSetup?.businessName || businessName || "My Business";

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
        <div className="flex flex-col">
          {!isEditing ? (
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
                    Your URL is based on your business name.
                    <strong className="text-amber-600 block mt-1">
                      Once published, your URL cannot be changed.
                    </strong>
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
          ) : (
            <div className="flex items-center border rounded-md px-2 py-1 bg-gray-50">
              <Globe className="h-4 w-4 text-gray-500 mr-2" />
              <span className="font-mono text-sm">https://wakti.qa/</span>
              <Input 
                value={businessNameInput}
                onChange={(e) => setBusinessNameInput(e.target.value)}
                onBlur={handleBusinessNameChange}
                className="h-6 px-2 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 w-40"
                disabled={pageData.published}
              />
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0 ml-2"
                onClick={() => {
                  setIsEditing(false);
                  handleBusinessNameChange();
                }}
                disabled={pageData.published}
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          )}
          <div className="text-xs text-amber-600 mt-1 text-center">
            {!pageData.published && "URL cannot be changed after publishing"}
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsEditing(!isEditing)}
          disabled={pageData.published}
          className="ml-2"
        >
          {isEditing ? "Done" : "Edit URL"}
        </Button>
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

      {/* Alert Dialog for Business Name Change */}
      <AlertDialog open={showNameAlert} onOpenChange={setShowNameAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Change Business Name?</AlertDialogTitle>
            <AlertDialogDescription>
              This will change your page URL to:<br/>
              <span className="font-mono font-bold">https://wakti.qa/{generatePageSlug(businessNameInput)}</span>
              <br/><br/>
              <span className="text-amber-600 font-bold">
                WARNING: Once your page is published, the URL cannot be changed.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setBusinessNameInput(pageData.pageSetup?.businessName || "");
              setShowNameAlert(false);
            }}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmBusinessNameChange}>
              Confirm Change
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
