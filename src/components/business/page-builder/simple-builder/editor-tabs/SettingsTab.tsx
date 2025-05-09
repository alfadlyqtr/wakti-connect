import React from "react";
import { PageSettings } from "../types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { generateSlug } from "@/utils/string-utils";

interface SettingsTabProps {
  pageSettings: PageSettings;
  setPageSettings: (settings: PageSettings) => void;
}

const SettingsTab: React.FC<SettingsTabProps> = ({ pageSettings, setPageSettings }) => {
  const updateSettings = (key: string, value: any) => {
    setPageSettings({
      ...pageSettings,
      [key]: value
    });
  };

  const updateContactInfo = (key: string, value: string) => {
    setPageSettings({
      ...pageSettings,
      contactInfo: {
        ...pageSettings.contactInfo,
        [key]: value
      }
    });
  };

  const updateSocialLink = (key: string, value: string) => {
    setPageSettings({
      ...pageSettings,
      socialLinks: {
        ...pageSettings.socialLinks,
        [key]: value
      }
    });
  };

  const updateBusinessHour = (index: number, key: string, value: any) => {
    const newHours = [...pageSettings.businessHours];
    newHours[index] = {
      ...newHours[index],
      [key]: value
    };
    
    updateSettings('businessHours', newHours);
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Auto-generate a slug from the input, ensuring it's URL-safe
    const rawValue = e.target.value;
    const safeSlug = generateSlug(rawValue);
    updateSettings('slug', safeSlug);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-2">Basic Information</h3>
        <div className="space-y-3">
          <div>
            <Label htmlFor="page-title">Page Title</Label>
            <Input
              id="page-title"
              value={pageSettings.title}
              onChange={(e) => updateSettings('title', e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="page-slug">
              URL Slug
              <span className="text-xs text-gray-500 ml-2">
                (Your page will be accessible at wakti.qa/your-slug)
              </span>
            </Label>
            <div className="flex items-center mt-1">
              <div className="bg-gray-100 px-3 py-2 text-gray-500 rounded-l-md border-y border-l">
                wakti.qa/
              </div>
              <Input
                id="page-slug"
                value={pageSettings.slug || ''}
                onChange={handleSlugChange}
                placeholder="your-business-name"
                className="rounded-l-none"
              />
            </div>
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-sm font-medium mb-2">Contact Information</h3>
        <div className="space-y-3">
          <div>
            <Label htmlFor="contact-email">Email</Label>
            <Input
              id="contact-email"
              type="email"
              value={pageSettings.contactInfo.email}
              onChange={(e) => updateContactInfo('email', e.target.value)}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="contact-phone">Phone</Label>
            <Input
              id="contact-phone"
              type="tel"
              value={pageSettings.contactInfo.phone}
              onChange={(e) => updateContactInfo('phone', e.target.value)}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="contact-address">Address</Label>
            <Textarea
              id="contact-address"
              value={pageSettings.contactInfo.address}
              onChange={(e) => updateContactInfo('address', e.target.value)}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="contact-whatsapp">WhatsApp (optional)</Label>
            <Input
              id="contact-whatsapp"
              type="tel"
              value={pageSettings.contactInfo.whatsapp}
              onChange={(e) => updateContactInfo('whatsapp', e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-sm font-medium mb-2">Social Media Links</h3>
        <div className="space-y-3">
          <div>
            <Label htmlFor="social-instagram">Instagram</Label>
            <Input
              id="social-instagram"
              value={pageSettings.socialLinks.instagram}
              onChange={(e) => updateSocialLink('instagram', e.target.value)}
              className="mt-1"
              placeholder="https://instagram.com/yourbusiness"
            />
          </div>
          
          <div>
            <Label htmlFor="social-facebook">Facebook</Label>
            <Input
              id="social-facebook"
              value={pageSettings.socialLinks.facebook}
              onChange={(e) => updateSocialLink('facebook', e.target.value)}
              className="mt-1"
              placeholder="https://facebook.com/yourbusiness"
            />
          </div>
          
          <div>
            <Label htmlFor="social-twitter">Twitter</Label>
            <Input
              id="social-twitter"
              value={pageSettings.socialLinks.twitter}
              onChange={(e) => updateSocialLink('twitter', e.target.value)}
              className="mt-1"
              placeholder="https://twitter.com/yourbusiness"
            />
          </div>
          
          <div>
            <Label htmlFor="social-linkedin">LinkedIn</Label>
            <Input
              id="social-linkedin"
              value={pageSettings.socialLinks.linkedin}
              onChange={(e) => updateSocialLink('linkedin', e.target.value)}
              className="mt-1"
              placeholder="https://linkedin.com/company/yourbusiness"
            />
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-sm font-medium mb-2">Business Hours</h3>
        <div className="space-y-3">
          {pageSettings.businessHours.map((day, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="w-1/3">
                <Label>{day.day}</Label>
              </div>
              <div className="w-1/2">
                <Input
                  value={day.hours}
                  onChange={(e) => updateBusinessHour(index, 'hours', e.target.value)}
                  disabled={!day.isOpen}
                />
              </div>
              <div className="flex items-center ml-2">
                <Switch
                  checked={day.isOpen}
                  onCheckedChange={(checked) => updateBusinessHour(index, 'isOpen', checked)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-sm font-medium mb-2">Maps Link</h3>
        <div>
          <Label htmlFor="google-maps">Google Maps URL</Label>
          <Input
            id="google-maps"
            value={pageSettings.googleMapsUrl}
            onChange={(e) => updateSettings('googleMapsUrl', e.target.value)}
            className="mt-1"
            placeholder="https://goo.gl/maps/yourbusiness"
          />
          <p className="text-xs text-gray-500 mt-1">
            Enter the link to your business on Google Maps
          </p>
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;
