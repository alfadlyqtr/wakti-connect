
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { EventCustomization } from "@/types/event.types";

interface FeaturesTabProps {
  customization: EventCustomization;
  onToggleChatbot: (checked: boolean) => void;
  onToggleCalendar: (checked: boolean) => void;
  onBrandingChange: (property: 'logo' | 'slogan', value: string) => void;
}

const FeaturesTab: React.FC<FeaturesTabProps> = ({
  customization,
  onToggleChatbot,
  onToggleCalendar,
  onBrandingChange
}) => {
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
          checked={customization.enableAddToCalendar || false}
          onCheckedChange={onToggleCalendar}
        />
      </div>
      
      <div className="p-3 bg-muted/30 rounded-md text-sm text-muted-foreground">
        <p>All events include a small "Powered by WAKTI" badge for brand visibility.</p>
      </div>
      
      <div>
        <Label className="block mb-2">Business Branding</Label>
        <div className="space-y-3">
          <div>
            <Label htmlFor="businessLogo" className="text-sm">Logo URL</Label>
            <Input 
              id="businessLogo"
              value={customization.branding?.logo || ''}
              onChange={(e) => onBrandingChange('logo', e.target.value)}
              placeholder="https://example.com/logo.png"
            />
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
    </div>
  );
};

export default FeaturesTab;
