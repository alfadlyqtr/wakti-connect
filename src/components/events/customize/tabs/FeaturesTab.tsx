
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { EventCustomization } from "@/types/event.types";
import { ImagePlus } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface FeaturesTabProps {
  customization: EventCustomization;
  onToggleChatbot: (checked: boolean) => void;
  onToggleCalendar: (checked: boolean) => void;
  onToggleButtons: (checked: boolean) => void;
  onBrandingChange: (property: 'logo' | 'slogan', value: string) => void;
  onMapDisplayChange: (value: 'button' | 'qrcode' | 'both') => void;
}

const FeaturesTab: React.FC<FeaturesTabProps> = ({
  customization,
  onToggleChatbot,
  onToggleCalendar,
  onToggleButtons,
  onBrandingChange,
  onMapDisplayChange
}) => {
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "Logo image too large",
        description: "Please select an image under 2MB",
        variant: "destructive"
      });
      return;
    }

    // Check file type
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'].includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPG, PNG, WebP or SVG image",
        variant: "destructive"
      });
      return;
    }

    // Create a data URL
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        onBrandingChange('logo', event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Business Branding</h3>
        
        <div className="space-y-2">
          <Label className="block">Company Logo</Label>
          <div className="border-2 border-dashed rounded-md p-4 text-center bg-muted/50">
            <input
              type="file"
              id="companyLogo"
              accept="image/jpeg,image/png,image/webp,image/svg+xml"
              onChange={handleLogoUpload}
              className="hidden"
            />
            <Label htmlFor="companyLogo" className="cursor-pointer flex flex-col items-center justify-center gap-2">
              <ImagePlus className="h-8 w-8 text-muted-foreground" />
              <span className="text-sm font-medium">Upload Company Logo (Max 2MB)</span>
              <span className="text-xs text-muted-foreground">JPG, PNG, WebP or SVG</span>
            </Label>
            {customization.branding?.logo && (
              <div className="mt-4">
                <img 
                  src={customization.branding.logo} 
                  alt="Company logo preview" 
                  className="mx-auto max-h-12 object-contain"
                />
              </div>
            )}
          </div>
        </div>
        
        <div>
          <Label htmlFor="company-slogan">Company Slogan/Tagline</Label>
          <Input 
            id="company-slogan"
            value={customization.branding?.slogan || ''}
            onChange={(e) => onBrandingChange('slogan', e.target.value)}
            placeholder="Enter your company slogan"
            className="mt-1"
          />
        </div>
      </div>
      
      <div className="space-y-4 pt-4 border-t">
        <h3 className="text-lg font-medium">Card Features</h3>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="toggle-chatbot">Enable Chatbot</Label>
          <Switch 
            id="toggle-chatbot" 
            checked={customization.enableChatbot || false}
            onCheckedChange={onToggleChatbot}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="toggle-calendar">Show Add to Calendar Button</Label>
          <Switch 
            id="toggle-calendar" 
            checked={customization.showAddToCalendarButton !== false}
            onCheckedChange={onToggleCalendar}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="toggle-accept-decline">Show Accept/Decline Buttons</Label>
          <Switch 
            id="toggle-accept-decline" 
            checked={customization.showAcceptDeclineButtons !== false}
            onCheckedChange={onToggleButtons}
          />
        </div>
      </div>
      
      <div className="space-y-4 pt-4 border-t">
        <h3 className="text-lg font-medium">Map Display Options</h3>
        
        <RadioGroup 
          value={customization.mapDisplay || 'button'} 
          onValueChange={(value) => onMapDisplayChange(value as 'button' | 'qrcode' | 'both')}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="button" id="map-button" />
            <Label htmlFor="map-button">Button Only</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="qrcode" id="map-qrcode" />
            <Label htmlFor="map-qrcode">QR Code Only</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="both" id="map-both" />
            <Label htmlFor="map-both">Both Button and QR Code</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};

export default FeaturesTab;
