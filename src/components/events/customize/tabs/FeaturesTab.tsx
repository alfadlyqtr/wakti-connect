
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { EventCustomization } from "@/types/event.types";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { ImagePlus } from "lucide-react";

interface FeaturesTabProps {
  customization: EventCustomization;
  onToggleChatbot: (checked: boolean) => void;
  onToggleCalendar: (checked: boolean) => void;
  onToggleButtons: (checked: boolean) => void;
  onBrandingChange: (property: 'logo' | 'slogan', value: string) => void;
  onMapDisplayChange?: (value: 'button' | 'qrcode' | 'both') => void;
  onLogoUpload?: (file: File) => void;
}

const FeaturesTab: React.FC<FeaturesTabProps> = ({
  customization,
  onToggleChatbot,
  onToggleCalendar,
  onToggleButtons,
  onBrandingChange,
  onMapDisplayChange,
  onLogoUpload
}) => {
  const [logoPreview, setLogoPreview] = useState<string | null>(customization.branding?.logo || null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size (max 1MB)
    if (file.size > 1 * 1024 * 1024) {
      return;
    }

    // Check file type
    if (!['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp'].includes(file.type)) {
      return;
    }

    // Create a data URL for preview
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const imageUrl = event.target.result as string;
        setLogoPreview(imageUrl);
        onBrandingChange('logo', imageUrl);
      }
    };
    reader.readAsDataURL(file);
    
    // Pass the file to parent component if needed
    if (onLogoUpload) {
      onLogoUpload(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Label htmlFor="enableChatbot" className="font-medium">Enable TMW Chatbot</Label>
          <p className="text-sm text-muted-foreground">Allow attendees to ask questions about your event</p>
        </div>
        <Switch 
          id="enableChatbot" 
          checked={customization.enableChatbot || false}
          onCheckedChange={onToggleChatbot}
        />
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <Label htmlFor="enableCalendar" className="font-medium">WAKTI Calendar Integration</Label>
          <p className="text-sm text-muted-foreground">Add "Add to WAKTI Calendar" button</p>
        </div>
        <Switch 
          id="enableCalendar" 
          checked={customization.showAddToCalendarButton !== false}
          onCheckedChange={onToggleCalendar}
        />
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <Label htmlFor="enableButtons" className="font-medium">Show Accept/Decline Buttons</Label>
          <p className="text-sm text-muted-foreground">Display response buttons on the event card</p>
        </div>
        <Switch 
          id="enableButtons" 
          checked={customization.showAcceptDeclineButtons !== false}
          onCheckedChange={onToggleButtons}
        />
      </div>
      
      <div className="space-y-3">
        <Label className="font-medium">Google Maps Display</Label>
        <RadioGroup 
          defaultValue={customization.mapDisplay || "button"}
          onValueChange={(value) => onMapDisplayChange && onMapDisplayChange(value as 'button' | 'qrcode' | 'both')}
          className="space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="button" id="map-button" />
            <Label htmlFor="map-button">Show as Button</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="qrcode" id="map-qrcode" />
            <Label htmlFor="map-qrcode">Show as QR Code</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="both" id="map-both" />
            <Label htmlFor="map-both">Show Both</Label>
          </div>
        </RadioGroup>
      </div>
      
      <div>
        <Label className="block mb-2">Business Branding</Label>
        <div className="space-y-3">
          <div>
            <Label htmlFor="businessLogo" className="text-sm mb-2 block">Logo</Label>
            <div className="border-2 border-dashed rounded-md p-4 text-center bg-muted/50">
              <input
                type="file"
                id="businessLogo"
                accept="image/jpeg,image/png,image/svg+xml,image/webp"
                onChange={handleLogoUpload}
                className="hidden"
              />
              <Label htmlFor="businessLogo" className="cursor-pointer flex flex-col items-center justify-center gap-2">
                <ImagePlus className="h-6 w-6 text-muted-foreground" />
                <span className="text-sm font-medium">Upload Logo (Max 1MB)</span>
                <span className="text-xs text-muted-foreground">JPG, PNG, SVG or WebP</span>
              </Label>
              {logoPreview && (
                <div className="mt-4">
                  <img 
                    src={logoPreview} 
                    alt="Business logo preview" 
                    className="mx-auto max-h-16"
                  />
                </div>
              )}
            </div>
          </div>
          
          <div>
            <Label htmlFor="businessSlogan" className="text-sm">Slogan</Label>
            <Input 
              id="businessSlogan"
              value={customization.branding?.slogan || ''}
              onChange={(e) => onBrandingChange('slogan', e.target.value)}
              placeholder="Your business slogan"
            />
          </div>
        </div>
      </div>
      
      <div className="p-3 bg-muted/30 rounded-md text-sm text-muted-foreground">
        <p>All events include a "Powered by WAKTI" badge linked to wakti.qa for brand visibility.</p>
      </div>
    </div>
  );
};

export default FeaturesTab;
