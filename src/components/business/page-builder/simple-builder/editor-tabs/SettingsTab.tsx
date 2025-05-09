
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BusinessPageData } from "../types";
import { generateSlug } from "@/utils/string-utils";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface SettingsTabProps {
  pageSettings: any;
  setPageSettings: (settings: any) => void;
  pageData?: BusinessPageData;
}

const SettingsTab: React.FC<SettingsTabProps> = ({ 
  pageSettings, 
  setPageSettings,
  pageData
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPageSettings({
      ...pageSettings,
      [name]: value
    });
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    // Generate valid slug format from input
    value = generateSlug(value);
    
    setPageSettings({
      ...pageSettings,
      slug: value
    });
  };

  const copyToClipboard = () => {
    if (!pageSettings.slug) {
      toast({
        title: "No URL available",
        description: "Please set a URL slug first.",
        variant: "destructive"
      });
      return;
    }
    
    const fullUrl = `wakti.qa/${pageSettings.slug}`;
    navigator.clipboard.writeText(fullUrl);
    toast({
      title: "URL copied to clipboard",
      description: "You can now paste it anywhere.",
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Page Title</Label>
        <Input
          id="title"
          name="title"
          value={pageSettings.title || ''}
          onChange={handleChange}
          placeholder="My Business Page"
        />
      </div>
      
      <div>
        <Label htmlFor="slug">URL Slug</Label>
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center bg-gray-100 rounded-md">
            <span className="text-gray-500 pl-3 pr-0">wakti.qa/</span>
            <Input
              id="slug"
              name="slug"
              value={pageSettings.slug || ''}
              onChange={handleSlugChange}
              placeholder="my-business"
              className="border-0 bg-transparent focus-visible:ring-0"
            />
          </div>
          <Button variant="outline" size="icon" onClick={copyToClipboard}>
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          This is the URL where people will find your page
        </p>
      </div>
      
      <div>
        <Label htmlFor="description">Page Description</Label>
        <Input
          id="description"
          name="description"
          value={pageSettings.description || ''}
          onChange={handleChange}
          placeholder="A short description of your page"
        />
      </div>
      
      <div>
        <Label htmlFor="fontFamily">Font Family</Label>
        <select
          id="fontFamily"
          name="fontFamily"
          value={pageSettings.fontFamily || 'system-ui'}
          onChange={(e) => handleChange(e as any)}
          className="w-full border border-gray-300 rounded-md p-2"
        >
          <option value="system-ui">System UI</option>
          <option value="Arial, sans-serif">Arial</option>
          <option value="'Times New Roman', serif">Times New Roman</option>
          <option value="'Courier New', monospace">Courier New</option>
          <option value="Georgia, serif">Georgia</option>
          <option value="'Segoe UI', sans-serif">Segoe UI</option>
        </select>
      </div>
    </div>
  );
};

export default SettingsTab;
