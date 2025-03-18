
import React, { useState } from "react";
import { EventCustomization } from "@/types/event.types";
import { Button } from "@/components/ui/button";
import { Check, X, MapPin, QrCode } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface LivePreviewProps {
  customization: EventCustomization;
  title: string;
  description?: string;
  location?: string;
  dateTime?: string;
  viewMode: 'mobile' | 'desktop';
  onViewModeChange: (mode: 'mobile' | 'desktop') => void;
}

const LivePreview: React.FC<LivePreviewProps> = ({
  customization,
  title,
  description,
  location,
  dateTime,
  viewMode,
  onViewModeChange
}) => {
  const [showMap, setShowMap] = useState(false);
  
  // Compute background style based on customization
  const getBackgroundStyle = () => {
    const { background } = customization;
    
    if (background.type === 'color') {
      return { backgroundColor: background.value };
    } else if (background.type === 'gradient') {
      return { backgroundImage: background.value };
    } else if (background.type === 'image') {
      return { 
        backgroundImage: `url(${background.value})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      };
    }
    return {};
  };
  
  // Compute text style based on customization
  const getTextStyle = () => {
    const { font } = customization;
    return {
      fontFamily: font.family,
      color: font.color,
      fontSize: font.size === 'small' ? '0.875rem' : 
               font.size === 'medium' ? '1rem' : '1.25rem'
    };
  };
  
  // Compute button style based on customization
  const getButtonStyle = (type: 'accept' | 'decline') => {
    const button = customization.buttons[type];
    return {
      backgroundColor: button.background,
      color: button.color,
      borderRadius: button.shape === 'rounded' ? '0.375rem' : 
                   button.shape === 'pill' ? '9999px' : '0'
    };
  };
  
  // Animation class based on customization
  const getAnimationClass = () => {
    if (!customization.animation) return '';
    
    switch (customization.animation) {
      case 'fade':
        return 'animate-fade-in';
      case 'slide':
        return 'animate-slide-in-right';
      case 'pop':
        return 'animate-scale-in';
      default:
        return '';
    }
  };
  
  // Header based on headerStyle
  const renderHeader = () => {
    const { headerStyle, headerImage } = customization;
    
    switch (headerStyle) {
      case 'banner':
        return (
          <div className="w-full h-24 relative overflow-hidden rounded-t-lg">
            {headerImage ? (
              <img src={headerImage} alt="Header" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-purple-400 to-pink-500"></div>
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <h2 className="text-xl font-bold text-white">{title}</h2>
            </div>
          </div>
        );
      case 'simple':
        return (
          <div className="p-4 border-b">
            <h2 className="text-xl font-bold text-center">{title}</h2>
          </div>
        );
      case 'minimal':
        return (
          <div className="flex flex-col items-center p-4">
            {headerImage ? (
              <img src={headerImage} alt="Header" className="w-16 h-16 rounded-full object-cover mb-2" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-primary mb-2"></div>
            )}
            <h2 className="text-lg font-medium">{title}</h2>
          </div>
        );
      default:
        return <h2 className="text-xl font-bold p-4">{title}</h2>;
    }
  };
  
  // Business branding if available
  const renderBranding = () => {
    const { branding } = customization;
    
    if (!branding?.logo && !branding?.slogan) return null;
    
    return (
      <div className="flex flex-col items-center mt-4 mb-2">
        {branding.logo && (
          <img src={branding.logo} alt="Business logo" className="h-8 mb-1" />
        )}
        {branding.slogan && (
          <p className="text-xs text-muted-foreground">{branding.slogan}</p>
        )}
      </div>
    );
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-base font-medium">Live Preview</h3>
        <div className="flex items-center space-x-2">
          <Label htmlFor="view-mode" className="text-sm">
            {viewMode === 'mobile' ? 'Mobile View' : 'Desktop View'}
          </Label>
          <Switch
            id="view-mode"
            checked={viewMode === 'desktop'}
            onCheckedChange={(checked) => onViewModeChange(checked ? 'desktop' : 'mobile')}
          />
        </div>
      </div>
      
      <div className={`border rounded-lg overflow-hidden ${getAnimationClass()} mx-auto transition-all`}
        style={{
          width: viewMode === 'mobile' ? '320px' : '500px',
          maxWidth: '100%',
          ...getBackgroundStyle()
        }}
      >
        {renderHeader()}
        
        <div className="p-4" style={getTextStyle()}>
          {description && (
            <p className="mb-4">{description}</p>
          )}
          
          {dateTime && (
            <p className="mb-2 flex items-center">
              <span className="mr-2">📅</span> {dateTime}
            </p>
          )}
          
          {location && (
            <p className="mb-4 flex items-center">
              <span className="mr-2">📍</span> {location}
            </p>
          )}
          
          {customization.enableChatbot && (
            <div className="mb-4 p-2 border rounded-md bg-background/50">
              <p className="text-sm">Ask me about this event! (Chatbot enabled)</p>
            </div>
          )}
          
          {(location && customization.buttons.accept.background !== '#ffffff') && (
            <div className="flex justify-center gap-3 mt-6 mb-3">
              <button 
                className="py-2 px-4 flex items-center gap-1"
                style={getButtonStyle('accept')}
              >
                <Check className="w-4 h-4" /> Accept
              </button>
              
              <button
                className="py-2 px-4 flex items-center gap-1"
                style={getButtonStyle('decline')}
              >
                <X className="w-4 h-4" /> Decline
              </button>
            </div>
          )}
          
          {location && (
            <div className="flex justify-center gap-2 mt-3">
              {customization.enableAddToCalendar && (
                <Button variant="outline" size="sm" className="text-xs">
                  Add to Calendar
                </Button>
              )}
              
              <Button variant="outline" size="sm" className="text-xs flex items-center gap-1">
                <MapPin className="h-3 w-3" /> View Map
              </Button>
              
              <Button variant="outline" size="sm" className="text-xs flex items-center gap-1">
                <QrCode className="h-3 w-3" /> QR Code
              </Button>
            </div>
          )}
          
          {renderBranding()}
          
          <div className="text-center text-xs text-muted-foreground mt-4">
            Powered by WAKTI
          </div>
        </div>
      </div>
    </div>
  );
};

export default LivePreview;
