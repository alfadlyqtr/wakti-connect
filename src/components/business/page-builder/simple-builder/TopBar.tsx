
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Copy, Eye, Globe, Save, Loader2 } from "lucide-react";
import { PageSettings } from "./types";

interface TopBarProps {
  pageUrl: string;
  onPreview: () => void;
  onPublish: () => void;
  onSave: () => void;
  isEditMode: boolean;
  setEditMode: (isEdit: boolean) => void;
  pageSettings: PageSettings;
  isSaving?: boolean;
  isPublishing?: boolean;
}

const TopBar: React.FC<TopBarProps> = ({ 
  pageUrl, 
  onPreview, 
  onPublish, 
  onSave,
  isEditMode,
  setEditMode,
  pageSettings,
  isSaving = false,
  isPublishing = false
}) => {
  const copyToClipboard = () => {
    if (pageUrl && pageUrl !== '#') {
      navigator.clipboard.writeText(pageUrl);
      toast({
        title: "URL copied to clipboard",
        description: "You can now paste it anywhere.",
      });
    } else {
      toast({
        title: "No URL available",
        description: "Create and publish your page first to get a URL.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-white border-b p-3 flex items-center justify-between">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold mr-6">Business Landing Page Builder</h1>
        <div className="flex items-center bg-gray-100 rounded-md max-w-md">
          <Globe className="mx-2 h-4 w-4 text-gray-500" />
          <Input 
            value={pageUrl !== '#' ? pageUrl : 'No URL available yet'} 
            readOnly
            className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={copyToClipboard}
            disabled={pageUrl === '#'}
            className="mr-1"
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          onClick={onSave} 
          className="gap-1"
          disabled={isSaving}
        >
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin mr-1" />
          ) : (
            <Save className="h-4 w-4 mr-1" />
          )}
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
        
        <Button 
          variant="outline" 
          onClick={onPreview} 
          className="gap-1"
        >
          <Eye className="h-4 w-4 mr-1" />
          Preview
        </Button>
        
        <Button 
          variant="default" 
          onClick={onPublish} 
          className="bg-wakti-navy"
          disabled={isPublishing}
        >
          {isPublishing ? (
            <Loader2 className="h-4 w-4 animate-spin mr-1" />
          ) : null}
          {isPublishing ? 'Publishing...' : 'Publish'}
        </Button>
      </div>
    </div>
  );
};

export default TopBar;
