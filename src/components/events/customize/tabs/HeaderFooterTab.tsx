
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ColorPickerInput } from "../inputs/ColorPickerInput";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TextAlign } from "@/types/event.types";
import { Switch } from "@/components/ui/switch";

interface HeaderFooterTabProps {
  // Header props
  headerStyle: 'banner' | 'simple' | 'minimal' | 'custom';
  headerImage?: string;
  headerHeight?: string;
  headerAlignment?: TextAlign;
  
  // Footer props
  footerStyle?: 'simple' | 'detailed' | 'minimal' | 'none';
  footerText?: string;
  footerBackground?: string;
  footerTextColor?: string;
  
  // Branding props
  branding?: {
    logo?: string;
    slogan?: string;
  };
  
  // Event handlers
  onHeaderStyleChange: (style: 'banner' | 'simple' | 'minimal' | 'custom') => void;
  onHeaderImageChange: (image: string) => void;
  onHeaderHeightChange: (height: string) => void;
  onHeaderAlignmentChange: (alignment: TextAlign) => void;
  
  onFooterStyleChange: (style: 'simple' | 'detailed' | 'minimal' | 'none') => void;
  onFooterTextChange: (text: string) => void;
  onFooterBackgroundChange: (color: string) => void;
  onFooterTextColorChange: (color: string) => void;
  
  onBrandingLogoChange: (logo: string) => void;
  onBrandingSloganChange: (slogan: string) => void;
  showPoweredBy: boolean;
  onShowPoweredByChange: (value: boolean) => void;
  poweredByColor: string;
  onPoweredByColorChange: (color: string) => void;
}

const headerStyleOptions = [
  { id: "banner", label: "Banner" },
  { id: "simple", label: "Simple" },
  { id: "minimal", label: "Minimal" },
  { id: "custom", label: "Custom" },
];

const footerStyleOptions = [
  { id: "simple", label: "Simple" },
  { id: "detailed", label: "Detailed" },
  { id: "minimal", label: "Minimal" },
  { id: "none", label: "None" },
];

const textAlignmentOptions = [
  { id: "left", label: "Left" },
  { id: "center", label: "Center" },
  { id: "right", label: "Right" },
];

const HeaderFooterTab: React.FC<HeaderFooterTabProps> = ({
  headerStyle,
  headerImage,
  headerHeight,
  headerAlignment = 'center',
  
  footerStyle = 'simple',
  footerText,
  footerBackground,
  footerTextColor,
  
  branding,
  
  onHeaderStyleChange,
  onHeaderImageChange,
  onHeaderHeightChange,
  onHeaderAlignmentChange,
  
  onFooterStyleChange,
  onFooterTextChange,
  onFooterBackgroundChange,
  onFooterTextColorChange,
  
  onBrandingLogoChange,
  onBrandingSloganChange,
  showPoweredBy,
  onShowPoweredByChange,
  poweredByColor,
  onPoweredByColorChange
}) => {
  return (
    <div className="space-y-8">
      {/* Header Customization */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Header Style</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Customize the header of your event card
        </p>
        
        <RadioGroup
          value={headerStyle}
          onValueChange={(value) => onHeaderStyleChange(value as 'banner' | 'simple' | 'minimal' | 'custom')}
          className="grid grid-cols-2 gap-4"
        >
          {headerStyleOptions.map((option) => (
            <div key={option.id} className="flex items-center space-x-2">
              <RadioGroupItem value={option.id} id={`header-style-${option.id}`} />
              <Label htmlFor={`header-style-${option.id}`}>{option.label}</Label>
            </div>
          ))}
        </RadioGroup>
        
        {headerStyle === 'banner' || headerStyle === 'custom' ? (
          <>
            <div className="space-y-2">
              <Label>Header Image URL</Label>
              <Input
                value={headerImage || ''}
                onChange={(e) => onHeaderImageChange(e.target.value)}
                placeholder="Enter header image URL"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Header Height</Label>
              <Select 
                value={headerHeight || '120px'} 
                onValueChange={onHeaderHeightChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select header height" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="80px">Small (80px)</SelectItem>
                  <SelectItem value="120px">Medium (120px)</SelectItem>
                  <SelectItem value="180px">Large (180px)</SelectItem>
                  <SelectItem value="240px">Extra Large (240px)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        ) : null}
        
        <div className="space-y-2">
          <Label>Text Alignment</Label>
          <RadioGroup
            value={headerAlignment}
            onValueChange={(value) => onHeaderAlignmentChange(value as TextAlign)}
            className="grid grid-cols-3 gap-4"
          >
            {textAlignmentOptions.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <RadioGroupItem value={option.id} id={`text-align-${option.id}`} />
                <Label htmlFor={`text-align-${option.id}`}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </div>
      
      {/* Footer Customization */}
      <div className="space-y-4 pt-4 border-t">
        <h3 className="text-lg font-medium">Footer Style</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Customize the footer of your event card
        </p>
        
        <RadioGroup
          value={footerStyle}
          onValueChange={(value) => onFooterStyleChange(value as 'simple' | 'detailed' | 'minimal' | 'none')}
          className="grid grid-cols-2 gap-4"
        >
          {footerStyleOptions.map((option) => (
            <div key={option.id} className="flex items-center space-x-2">
              <RadioGroupItem value={option.id} id={`footer-style-${option.id}`} />
              <Label htmlFor={`footer-style-${option.id}`}>{option.label}</Label>
            </div>
          ))}
        </RadioGroup>
        
        {footerStyle !== 'none' && (
          <>
            <div className="space-y-2">
              <Label>Footer Text (Optional)</Label>
              <Input
                value={footerText || ''}
                onChange={(e) => onFooterTextChange(e.target.value)}
                placeholder="Enter footer text"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Footer Background</Label>
                <ColorPickerInput
                  value={footerBackground || '#f9fafb'}
                  onChange={onFooterBackgroundChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Footer Text Color</Label>
                <ColorPickerInput
                  value={footerTextColor || '#6b7280'}
                  onChange={onFooterTextColorChange}
                />
              </div>
            </div>
          </>
        )}
      </div>
      
      {/* Branding */}
      <div className="space-y-4 pt-4 border-t">
        <h3 className="text-lg font-medium">Branding</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Add your brand to the event card
        </p>
        
        <div className="space-y-2">
          <Label>Logo URL (Optional)</Label>
          <Input
            value={branding?.logo || ''}
            onChange={(e) => onBrandingLogoChange(e.target.value)}
            placeholder="Enter logo URL"
          />
        </div>
        
        <div className="space-y-2">
          <Label>Slogan/Tagline (Optional)</Label>
          <Input
            value={branding?.slogan || ''}
            onChange={(e) => onBrandingSloganChange(e.target.value)}
            placeholder="Enter slogan or tagline"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="show-powered-by"
            checked={showPoweredBy}
            onCheckedChange={onShowPoweredByChange}
          />
          <Label htmlFor="show-powered-by">Show "Powered by" text</Label>
        </div>
        
        {showPoweredBy && (
          <div className="space-y-2">
            <Label>"Powered by" Text Color</Label>
            <ColorPickerInput
              value={poweredByColor || '#6b7280'}
              onChange={onPoweredByColorChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default HeaderFooterTab;
