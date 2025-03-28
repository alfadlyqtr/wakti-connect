
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { BusinessPage } from "@/types/business.types";
import { useDebounce } from "@/hooks/useDebouncedCallback";

interface GeneralSettingsTabProps {
  businessPage: BusinessPage;
  onUpdate: (values: Partial<BusinessPage>) => void;
}

const GeneralSettingsTab = ({ businessPage, onUpdate }: GeneralSettingsTabProps) => {
  // In a real application, we would validate the slug to ensure it's URL-safe
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onUpdate({ [name]: value });
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    // Create a safe slug - lowercase, remove special chars, replace spaces with hyphens
    const safeSlug = value
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
    
    onUpdate({ page_slug: safeSlug });
  };

  const handleToggleChange = (checked: boolean, field: keyof BusinessPage) => {
    onUpdate({ [field]: checked });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="page_title">Page Title</Label>
          <Input 
            id="page_title"
            name="page_title"
            value={businessPage.page_title || ''}
            onChange={handleChange}
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
              value={businessPage.page_slug || ''}
              onChange={handleSlugChange}
              placeholder="your-business-name"
              className="flex-1"
            />
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            This will be the URL of your business page.
          </p>
        </div>

        <div>
          <Label htmlFor="description">Page Description</Label>
          <Textarea 
            id="description"
            name="description"
            value={businessPage.description || ''}
            onChange={handleChange}
            placeholder="Brief description of your business"
            rows={3}
          />
          <p className="text-sm text-muted-foreground mt-1">
            This will be used for SEO and may appear in search results.
          </p>
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
            checked={businessPage.is_published}
            onCheckedChange={(checked) => handleToggleChange(checked, 'is_published')}
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
            checked={businessPage.show_subscribe_button !== false} // Default to true if undefined
            onCheckedChange={(checked) => handleToggleChange(checked, 'show_subscribe_button')}
          />
        </div>

        {businessPage.show_subscribe_button !== false && (
          <div className="mt-2 pl-4 border-l-2 border-muted">
            <Label htmlFor="subscribe_button_text">Subscribe Button Text</Label>
            <Input 
              id="subscribe_button_text"
              name="subscribe_button_text"
              value={businessPage.subscribe_button_text || 'Subscribe'}
              onChange={handleChange}
              placeholder="Subscribe"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default GeneralSettingsTab;
