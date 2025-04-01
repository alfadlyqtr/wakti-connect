
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SubscribeButtonAppearanceProps {
  buttonStyle: string;
  buttonSize: string;
  primaryColor: string;
  secondaryColor: string;
  buttonText: string;
  handleSelectChange: (name: string, value: string) => void;
  getButtonPreviewStyles: () => React.CSSProperties;
}

const SubscribeButtonAppearance: React.FC<SubscribeButtonAppearanceProps> = ({
  buttonStyle,
  buttonSize,
  buttonText,
  handleSelectChange,
  getButtonPreviewStyles
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="subscribe_button_style">Button Style</Label>
        <Select 
          value={buttonStyle || 'gradient'} 
          onValueChange={(value) => handleSelectChange('subscribe_button_style', value)}
        >
          <SelectTrigger id="subscribe_button_style">
            <SelectValue placeholder="Select style" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gradient">Gradient</SelectItem>
            <SelectItem value="default">Solid</SelectItem>
            <SelectItem value="outline">Outline</SelectItem>
            <SelectItem value="minimal">Minimal</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="subscribe_button_size">Button Size</Label>
        <Select 
          value={buttonSize || 'default'} 
          onValueChange={(value) => handleSelectChange('subscribe_button_size', value)}
        >
          <SelectTrigger id="subscribe_button_size">
            <SelectValue placeholder="Select size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="small">Small</SelectItem>
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="large">Large</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label>Button Preview</Label>
        <div className="p-4 border rounded-md flex items-center justify-center">
          <div style={getButtonPreviewStyles()}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            {buttonText || "Subscribe"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscribeButtonAppearance;
