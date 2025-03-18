
import React, { useState } from "react";
import { EventCustomization } from "@/types/event.types";
import { Button } from "@/components/ui/button";
import { Check, X, MapPin, QrCode, Calendar } from "lucide-react";
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
  const [showQrCode, setShowQrCode] = useState(false);
  const [cardEffect, setCardEffect] = useState<'shadow' | 'matte' | 'gloss'>(
    customization.cardEffect?.type || 'shadow'
  );
  
  // Compute background style based on customization
  const getBackgroundStyle = () => {
    const { background } = customization;
    
    if (background.type === 'color') {
      return { backgroundColor: background.value };
    } else if (background.type === 'gradient') {
      const direction = background.direction || 'to-right';
      const directionValue = direction.replace('to-', 'to ');
      const angle = background.angle !== undefined ? `${background.angle}deg` : '90deg';
      
      // Use either the predefined value or construct a new one from angle and direction
      if (background.value.includes('linear-gradient')) {
        return { backgroundImage: background.value };
      } else {
        return { 
          backgroundImage: `linear-gradient(${angle}, ${background.value})` 
        };
      }
    } else if (background.type === 'image') {
      return { 
        backgroundImage: `url(${background.value})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      };
    }
    return {};
  };
  
  // Compute text style based on customization for general text
  const getTextStyle = (type?: 'header' | 'description' | 'datetime') => {
    const { font, headerFont, descriptionFont, dateTimeFont } = customization;
    
    let specificFont;
    if (type === 'header' && headerFont) {
      specificFont = headerFont;
    } else if (type === 'description' && descriptionFont) {
      specificFont = descriptionFont;
    } else if (type === 'datetime' && dateTimeFont) {
      specificFont = dateTimeFont;
    }
    
    const baseFont = {
      fontFamily: font.family,
      color: font.color,
      fontSize: font.size === 'small' ? '0.875rem' : 
               font.size === 'medium' ? '1rem' : '1.25rem',
      fontWeight: font.weight === 'bold' ? 'bold' : 
                 font.weight === 'medium' ? '500' : 'normal',
      textAlign: font.alignment as any
    };
    
    if (!specificFont) return baseFont;
    
    return {
      ...baseFont,
      fontFamily: specificFont.family || baseFont.fontFamily,
      color: specificFont.color || baseFont.color,
      fontSize: specificFont.size === 'small' ? '0.875rem' : 
                specificFont.size === 'medium' ? '1rem' : 
                specificFont.size === 'large' ? '1.25rem' : baseFont.fontSize,
      fontWeight: specificFont.weight === 'bold' ? 'bold' : 
                 specificFont.weight === 'medium' ? '500' : 
                 specificFont.weight === 'normal' ? 'normal' : baseFont.fontWeight
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
        return 'animate-slide-in';
      case 'pop':
        return 'animate-scale-in';
      default:
        return '';
    }
  };

  // Element animation classes
  const getElementAnimationClass = (type: 'text' | 'buttons' | 'icons') => {
    if (!customization.elementAnimations) return '';
    
    const animation = customization.elementAnimations[type];
    if (!animation || animation === 'none') return '';
    
    switch (animation) {
      case 'fade':
        return 'animate-fade-in';
      case 'slide':
        return 'animate-slide-in';
      case 'pop':
        return 'animate-scale-in';
      default:
        return '';
    }
  };

  // Card effect class
  const getCardEffectClass = () => {
    const effectType = customization.cardEffect?.type || cardEffect;
    
    switch (effectType) {
      case 'shadow':
        return 'shadow-lg';
      case 'matte':
        return 'shadow-sm bg-opacity-90';
      case 'gloss':
        return 'shadow-lg bg-opacity-95 backdrop-blur-sm';
      default:
        return 'shadow-md';
    }
  };
  
  // Border radius based on card effect settings
  const getBorderRadiusClass = () => {
    const radius = customization.cardEffect?.borderRadius || 'medium';
    
    switch (radius) {
      case 'none':
        return 'rounded-none';
      case 'small':
        return 'rounded-sm';
      case 'medium':
        return 'rounded-md';
      case 'large':
        return 'rounded-lg';
      default:
        return 'rounded-lg';
    }
  };
  
  // Border style if enabled
  const getBorderStyle = () => {
    if (customization.cardEffect?.border) {
      return {
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: customization.cardEffect.borderColor || '#e2e8f0'
      };
    }
    return {};
  };
  
  // Header based on headerStyle
  const renderHeader = () => {
    const { headerStyle, headerImage } = customization;
    const headerTextStyle = getTextStyle('header');
    
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
              <h2 className={`text-xl font-bold text-white ${getElementAnimationClass('text')}`}>{title}</h2>
            </div>
          </div>
        );
      case 'simple':
        return (
          <div className="p-4 border-b">
            <h2 
              className={`text-xl font-bold text-center ${getElementAnimationClass('text')}`}
              style={headerTextStyle}
            >
              {title}
            </h2>
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
            <h2 
              className={`text-lg font-medium ${getElementAnimationClass('text')}`}
              style={headerTextStyle}
            >
              {title}
            </h2>
          </div>
        );
      default:
        return (
          <h2 
            className={`text-xl font-bold p-4 ${getElementAnimationClass('text')}`}
            style={headerTextStyle}
          >
            {title}
          </h2>
        );
    }
  };
  
  // Business branding if available
  const renderBranding = () => {
    const { branding } = customization;
    
    if (!branding?.logo && !branding?.slogan) return null;
    
    return (
      <div className={`flex flex-col items-center mt-4 mb-2 ${getElementAnimationClass('text')}`}>
        {branding.logo && (
          <img src={branding.logo} alt="Business logo" className="h-8 mb-1 object-contain" />
        )}
        {branding.slogan && (
          <p className="text-xs text-muted-foreground">{branding.slogan}</p>
        )}
      </div>
    );
  };

  // QR Code Flip Card
  const renderQrCodeFlip = () => {
    if (!showQrCode) return null;

    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
        <div 
          className={`relative w-[320px] h-[320px] bg-white rounded-lg ${
            showQrCode ? 'animate-flip' : 'animate-flip-back'
          }`}
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
            <div className="w-full h-full flex flex-col items-center justify-center">
              <div className="w-48 h-48 bg-gray-200 flex items-center justify-center mb-4">
                <QrCode size={140} />
              </div>
              <p className="text-center text-sm">Scan to view event</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-4"
                onClick={() => setShowQrCode(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
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

      <div className="flex justify-between items-center mb-4">
        <Label htmlFor="card-effect" className="text-sm">Card Effect:</Label>
        <div className="flex space-x-2">
          <Button 
            variant={cardEffect === 'shadow' ? "default" : "outline"} 
            size="sm"
            onClick={() => setCardEffect('shadow')}
          >
            Shadow
          </Button>
          <Button 
            variant={cardEffect === 'matte' ? "default" : "outline"} 
            size="sm"
            onClick={() => setCardEffect('matte')}
          >
            Matte
          </Button>
          <Button 
            variant={cardEffect === 'gloss' ? "default" : "outline"} 
            size="sm"
            onClick={() => setCardEffect('gloss')}
          >
            Gloss
          </Button>
        </div>
      </div>
      
      <div 
        className={`border overflow-hidden ${getAnimationClass()} ${getCardEffectClass()} ${getBorderRadiusClass()} mx-auto transition-all`}
        style={{
          width: viewMode === 'mobile' ? '320px' : '500px',
          maxWidth: '100%',
          ...getBackgroundStyle(),
          ...getBorderStyle()
        }}
      >
        {renderHeader()}
        
        <div className="p-4" style={getTextStyle()}>
          {description && (
            <p 
              className={`mb-4 ${getElementAnimationClass('text')}`}
              style={getTextStyle('description')}
            >
              {description}
            </p>
          )}
          
          {dateTime && (
            <p 
              className={`mb-2 flex items-center ${getElementAnimationClass('text')}`}
              style={getTextStyle('datetime')}
            >
              <span className={`mr-2 ${getElementAnimationClass('icons')}`}>📅</span> {dateTime}
            </p>
          )}
          
          {location && (
            <p 
              className={`mb-4 flex items-center ${getElementAnimationClass('text')}`}
            >
              <span className={`mr-2 ${getElementAnimationClass('icons')}`}>📍</span> {location}
            </p>
          )}
          
          {customization.enableChatbot && (
            <div className={`mb-4 p-2 border rounded-md bg-background/50 ${getElementAnimationClass('text')}`}>
              <p className="text-sm">Ask me about this event! (Chatbot enabled)</p>
            </div>
          )}
          
          {(location && customization.buttons.accept.background !== '#ffffff' && customization.showAcceptDeclineButtons !== false) && (
            <div className={`flex justify-center gap-3 mt-6 mb-3 ${getElementAnimationClass('buttons')}`}>
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
            <div className={`grid grid-cols-3 gap-2 mt-4 ${getElementAnimationClass('buttons')}`}>
              {customization.showAddToCalendarButton !== false && (
                <Button variant="outline" size="sm" className="text-xs flex items-center justify-center gap-1">
                  <Calendar className={`h-3 w-3 ${getElementAnimationClass('icons')}`} /> Calendar
                </Button>
              )}
              
              <Button variant="outline" size="sm" className="text-xs flex items-center justify-center gap-1">
                <MapPin className={`h-3 w-3 ${getElementAnimationClass('icons')}`} /> Map
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs flex items-center justify-center gap-1"
                onClick={() => setShowQrCode(true)}
              >
                <QrCode className={`h-3 w-3 ${getElementAnimationClass('icons')}`} /> QR Code
              </Button>
            </div>
          )}
          
          {renderBranding()}
          
          <div className="text-center text-xs text-muted-foreground mt-4">
            <a 
              href="https://wakti.qa" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:underline"
            >
              Powered by WAKTI
            </a>
          </div>
        </div>
      </div>

      {renderQrCodeFlip()}
    </div>
  );
};

export default LivePreview;
