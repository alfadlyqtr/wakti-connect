
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SubscribeButtonGeneralProps {
  showSubscribeButton: boolean;
  buttonText: string;
  buttonPosition: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleToggleChange: (name: string, checked: boolean) => void;
  handleSelectChange: (name: string, value: string) => void;
}

const SubscribeButtonGeneral: React.FC<SubscribeButtonGeneralProps> = ({
  showSubscribeButton,
  buttonText,
  buttonPosition,
  handleInputChange,
  handleToggleChange,
  handleSelectChange
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="show_subscribe_button">Show Subscribe Button</Label>
          <p className="text-sm text-muted-foreground">
            When enabled, visitors can subscribe to your business updates
          </p>
        </div>
        <Switch
          id="show_subscribe_button"
          checked={showSubscribeButton !== false}
          onCheckedChange={(checked) => handleToggleChange('show_subscribe_button', checked)}
        />
      </div>
      
      {showSubscribeButton !== false && (
        <>
          <div className="space-y-2">
            <Label htmlFor="subscribe_button_text">Button Text</Label>
            <Input
              id="subscribe_button_text"
              name="subscribe_button_text"
              value={buttonText || "Subscribe"}
              onChange={handleInputChange}
              placeholder="Subscribe"
            />
            <p className="text-xs text-muted-foreground">
              Customize what text appears on the subscribe button
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="subscribe_button_position">Button Position</Label>
            <Select 
              value={buttonPosition || 'both'} 
              onValueChange={(value) => handleSelectChange('subscribe_button_position', value)}
            >
              <SelectTrigger id="subscribe_button_position">
                <SelectValue placeholder="Select position" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="top">Top Only</SelectItem>
                <SelectItem value="floating">Floating Only</SelectItem>
                <SelectItem value="both">Both (Top & Floating)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Choose where to display the subscribe button on your page
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default SubscribeButtonGeneral;
