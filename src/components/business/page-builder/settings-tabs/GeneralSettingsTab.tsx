
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { BusinessPage } from "@/types/business.types";
import { useDebouncedCallback } from "@/hooks/useDebouncedCallback";
import { Button } from "@/components/ui/button";
import { Loader2, Copy, ExternalLink } from "lucide-react";

interface GeneralSettingsTabProps {
  pageData: {
    page_title: string;
    page_slug: string;
    description: string;
    is_published: boolean;
    chatbot_enabled: boolean;
    chatbot_code?: string;
    primary_color: string;
    secondary_color: string;
    logo_url?: string;
    show_subscribe_button?: boolean;
    subscribe_button_text?: string;
  };
  businessId?: string;
  handleInputChangeWithAutoSave: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleToggleWithAutoSave: (name: string, checked: boolean) => void;
  handleLogoUpload: (file: File) => void;
  getPublicPageUrl: () => string;
  uploadingLogo: boolean;
}

const GeneralSettingsTab = ({ 
  pageData, 
  businessId, 
  handleInputChangeWithAutoSave, 
  handleToggleWithAutoSave,
  handleLogoUpload,
  getPublicPageUrl,
  uploadingLogo
}: GeneralSettingsTabProps) => {
  // In a real application, we would validate the slug to ensure it's URL-safe
  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    // Create a safe slug - lowercase, remove special chars, replace spaces with hyphens
    const safeSlug = value
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
    
    const event = {
      ...e,
      target: {
        ...e.target,
        name: 'page_slug',
        value: safeSlug
      }
    };
    
    handleInputChangeWithAutoSave(event);
  };

  const copyPageUrl = () => {
    const url = getPublicPageUrl();
    navigator.clipboard.writeText(url);
    // Could add a toast here
  };
  
  const visitPage = () => {
    const url = getPublicPageUrl();
    window.open(url, '_blank');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleLogoUpload(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="page_title">Page Title</Label>
          <Input 
            id="page_title"
            name="page_title"
            value={pageData.page_title || ''}
            onChange={handleInputChangeWithAutoSave}
            placeholder="Your Business Name"
          />
          <p className="text-sm text-muted-foreground mt-1">
            This will be displayed as the title of your business page.
          </p>
        </div>

        <div>
          <Label htmlFor="page_slug">Page URL</Label>
          <div className="flex items-center">
            <span className="text-muted-foreground mr-1">/business/</span>
            <Input 
              id="page_slug"
              name="page_slug"
              value={pageData.page_slug || ''}
              onChange={handleSlugChange}
              placeholder="your-business-name"
              className="flex-1"
            />
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="text-sm text-muted-foreground">
              This will be the URL of your business page.
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={copyPageUrl}>
                <Copy className="h-4 w-4 mr-1" />
                Copy URL
              </Button>
              <Button variant="outline" size="sm" onClick={visitPage}>
                <ExternalLink className="h-4 w-4 mr-1" />
                Visit
              </Button>
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="description">Page Description</Label>
          <Textarea 
            id="description"
            name="description"
            value={pageData.description || ''}
            onChange={handleInputChangeWithAutoSave}
            placeholder="Brief description of your business"
            rows={3}
          />
          <p className="text-sm text-muted-foreground mt-1">
            This will be used for SEO and may appear in search results.
          </p>
        </div>
        
        <div>
          <Label htmlFor="logo">Business Logo</Label>
          <div className="mt-2 flex items-center space-x-4">
            {pageData.logo_url && (
              <div className="relative w-16 h-16 rounded-md overflow-hidden border">
                <img 
                  src={pageData.logo_url} 
                  alt="Business Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div>
              <Button
                type="button"
                variant="outline"
                disabled={uploadingLogo}
                onClick={() => document.getElementById('logo-upload')?.click()}
              >
                {uploadingLogo ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    {pageData.logo_url ? 'Change Logo' : 'Upload Logo'}
                  </>
                )}
              </Button>
              <input
                id="logo-upload"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Recommended size: 200x200px
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t pt-4 mt-4">
          <div className="space-y-0.5">
            <Label htmlFor="is_published">Publish Page</Label>
            <p className="text-sm text-muted-foreground">
              When enabled, your page will be visible to the public.
            </p>
          </div>
          <Switch
            id="is_published"
            checked={pageData.is_published}
            onCheckedChange={(checked) => handleToggleWithAutoSave('is_published', checked)}
          />
        </div>

        <div className="flex items-center justify-between border-t pt-4 mt-4">
          <div className="space-y-0.5">
            <Label htmlFor="show_subscribe_button">Show Subscribe Button</Label>
            <p className="text-sm text-muted-foreground">
              Allow visitors to subscribe to your business updates.
            </p>
          </div>
          <Switch
            id="show_subscribe_button"
            checked={pageData.show_subscribe_button !== false} // Default to true if undefined
            onCheckedChange={(checked) => handleToggleWithAutoSave('show_subscribe_button', checked)}
          />
        </div>

        {pageData.show_subscribe_button !== false && (
          <div className="mt-2 pl-4 border-l-2 border-muted">
            <Label htmlFor="subscribe_button_text">Subscribe Button Text</Label>
            <Input 
              id="subscribe_button_text"
              name="subscribe_button_text"
              value={pageData.subscribe_button_text || 'Subscribe'}
              onChange={handleInputChangeWithAutoSave}
              placeholder="Subscribe"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default GeneralSettingsTab;
