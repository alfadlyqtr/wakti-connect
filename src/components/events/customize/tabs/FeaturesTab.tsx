
import React from "react";
import { EventCustomization } from "@/types/event.types";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { ImagePlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

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
    
    // Check file size (max 500KB for logos)
    if (file.size > 500 * 1024) {
      toast({
        title: "Logo image too large",
        description: "Please select an image under 500KB",
        variant: "destructive"
      });
      return;
    }

    // Check file type
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'].includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPG, PNG, SVG or WebP image",
        variant: "destructive"
      });
      return;
    }

    // Create a data URL
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        onBrandingChange('logo', event.target.result as string);
        toast({
          title: "Logo uploaded",
          description: "Your business logo has been added to the event",
          variant: "success"
        });
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="font-medium text-base">Interactive Features</h3>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="enable-chatbot" className="flex-1">Enable AI Chatbot</Label>
          <Switch 
            id="enable-chatbot" 
            checked={customization.enableChatbot || false}
            onCheckedChange={onToggleChatbot}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <Label htmlFor="show-calendar" className="block">Show Add to Calendar</Label>
            <p className="text-xs text-muted-foreground">Allow guests to add this event to their calendar app</p>
          </div>
          <Switch 
            id="show-calendar" 
            checked={customization.showAddToCalendarButton !== false}
            onCheckedChange={onToggleCalendar}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <Label htmlFor="show-buttons" className="block">Show Accept/Decline Buttons</Label>
            <p className="text-xs text-muted-foreground">Allow guests to respond to your invitation</p>
          </div>
          <Switch 
            id="show-buttons" 
            checked={customization.showAcceptDeclineButtons !== false}
            onCheckedChange={onToggleButtons}
          />
        </div>
      </div>
      
      <Separator />
      
      <div className="space-y-4">
        <h3 className="font-medium text-base">Business Branding</h3>
        
        <div className="space-y-3">
          <Label className="block">Business Logo</Label>
          <div className="border-2 border-dashed rounded-md p-4 text-center bg-muted/50">
            <input
              type="file"
              id="logoImage"
              accept="image/jpeg,image/png,image/webp,image/svg+xml"
              onChange={handleLogoUpload}
              className="hidden"
            />
            <Label htmlFor="logoImage" className="cursor-pointer flex flex-col items-center justify-center gap-2">
              <ImagePlus className="h-6 w-6 text-muted-foreground" />
              <span className="text-sm font-medium">Upload Logo (Max 500KB)</span>
              <span className="text-xs text-muted-foreground">JPG, PNG, SVG or WebP</span>
            </Label>
            {customization.branding?.logo && (
              <div className="mt-4 relative">
                <img 
                  src={customization.branding.logo} 
                  alt="Business logo preview" 
                  className="mx-auto h-10 object-contain"
                />
                <Button 
                  variant="destructive" 
                  size="sm" 
                  className="absolute top-0 right-0 w-6 h-6 p-0 rounded-full"
                  onClick={() => onBrandingChange('logo', '')}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        </div>
        
        <div>
          <Label htmlFor="business-slogan" className="block mb-2">Business Slogan/Tagline</Label>
          <Input
            id="business-slogan"
            placeholder="Your business slogan or tagline"
            value={customization.branding?.slogan || ''}
            onChange={(e) => onBrandingChange('slogan', e.target.value)}
          />
        </div>
      </div>
      
      <Separator />
      
      <div className="space-y-4">
        <h3 className="font-medium text-base">Map Display Options</h3>
        
        <RadioGroup 
          value={customization.mapDisplay || 'button'} 
          onValueChange={(value) => onMapDisplayChange(value as 'button' | 'qrcode' | 'both')}
          className="space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="button" id="map-button" />
            <Label htmlFor="map-button">Show Map Button</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="qrcode" id="map-qrcode" />
            <Label htmlFor="map-qrcode">Show QR Code</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="both" id="map-both" />
            <Label htmlFor="map-both">Show Both</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};

export default FeaturesTab;
