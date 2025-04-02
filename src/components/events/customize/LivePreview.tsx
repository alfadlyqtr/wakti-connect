
import React from 'react';
import { EventCustomization } from '@/types/event.types';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Calendar, Clock, MapPin, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Smartphone, Monitor } from 'lucide-react';

interface LivePreviewProps {
  customization: EventCustomization;
  title: string;
  description?: string;
  location?: string;
  dateTime: string;
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
  // Helper to get font size from string
  const getFontSize = (size?: string, fallback = 'medium') => {
    switch (size || fallback) {
      case 'small':
        return '0.875rem';
      case 'medium':
        return '1rem';
      case 'large':
        return '1.25rem';
      case 'xlarge':
        return '1.5rem';
      default:
        return '1rem';
    }
  };

  // Generate styles for background
  const getBackgroundStyle = () => {
    const bg = customization.background || {};
    
    if (!bg.type || !bg.value) {
      return { backgroundColor: '#ffffff' };
    }

    // Convert 'color' to 'solid' for backwards compatibility
    const bgType = bg.type === 'color' ? 'solid' : bg.type;
    
    switch (bgType) {
      case 'solid':
        return { backgroundColor: bg.value };
      case 'gradient':
        if (bg.direction) {
          return { backgroundImage: `linear-gradient(${bg.direction}, ${bg.value})` };
        } else if (bg.angle !== undefined) {
          return { backgroundImage: `linear-gradient(${bg.angle}deg, ${bg.value})` };
        }
        return { backgroundImage: bg.value };
      case 'image':
        return { 
          backgroundImage: `url(${bg.value})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        };
      default:
        return { backgroundColor: '#ffffff' };
    }
  };

  // Use specific font settings or fall back to the general font settings
  const headerFont = customization.headerFont || customization.font;
  const descriptionFont = customization.descriptionFont || customization.font;
  const dateTimeFont = customization.dateTimeFont || customization.font;

  // Generate text styles
  const getTextStyles = () => {
    return {
      fontFamily: customization.font?.family || 'system-ui, sans-serif',
      fontSize: getFontSize(customization.font?.size),
      color: customization.font?.color || '#333333',
      fontWeight: customization.font?.weight || 'normal',
      textAlign: (customization.font?.alignment || 'left') as any
    };
  };

  // Define animation class based on animation setting
  const getAnimationClass = () => {
    const animationType = customization.animation || 'fade';
    
    switch (animationType) {
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

  // Get animation class for elements
  const getElementAnimationClass = (elementType: 'text' | 'buttons' | 'icons', delay = '') => {
    const animationType = customization.elementAnimations?.[elementType] || 'none';
    
    switch (animationType) {
      case 'fade':
        return `animate-fade-in ${delay}`;
      case 'slide':
        return `animate-slide-in ${delay}`;
      case 'pop':
        return `animate-scale-in ${delay}`;
      default:
        return '';
    }
  };

  // Define card effect styles
  const getCardEffectStyles = () => {
    const cardEffect = customization.cardEffect || { 
      type: 'shadow',
      borderRadius: 'medium'
    };
    
    let styles: React.CSSProperties = {};
    
    // Border radius
    switch (cardEffect.borderRadius) {
      case 'none':
        styles.borderRadius = '0';
        break;
      case 'small':
        styles.borderRadius = '0.25rem';
        break;
      case 'medium':
        styles.borderRadius = '0.5rem';
        break;
      case 'large':
        styles.borderRadius = '1rem';
        break;
      default:
        styles.borderRadius = '0.5rem';
    }
    
    // Card effect type
    switch (cardEffect.type) {
      case 'shadow':
        styles.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
        break;
      case 'matte':
        styles.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
        styles.background = 'rgba(255, 255, 255, 0.9)';
        break;
      case 'gloss':
        styles.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
        styles.background = 'rgba(255, 255, 255, 0.95)';
        styles.backdropFilter = 'blur(10px)';
        break;
    }
    
    // Border
    if (cardEffect.border) {
      styles.border = `1px solid ${cardEffect.borderColor || '#e2e8f0'}`;
    }
    
    return styles;
  };

  // Utility button style (for map buttons etc)
  const getUtilityButtonStyle = (buttonType: 'calendar' | 'map' | 'qr') => {
    const defaultStyle = {
      background: '#f1f5f9',
      color: '#475569',
      shape: 'rounded'
    };
    
    const buttonStyle = customization.utilityButtons?.[buttonType] || defaultStyle;
    
    return {
      backgroundColor: buttonStyle.background,
      color: buttonStyle.color,
      borderRadius: 
        buttonStyle.shape === 'pill' ? '9999px' :
        buttonStyle.shape === 'rounded' ? '0.375rem' : 
        '0'
    };
  };

  // Header content based on header style
  const renderHeader = () => {
    if (customization.headerStyle === 'banner' && customization.headerImage) {
      return (
        <CardHeader 
          className="p-0 overflow-hidden" 
          style={{ 
            backgroundImage: `url(${customization.headerImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: '100px'
          }}
        >
          <div className="bg-black/50 p-4 text-white">
            <h3 className="text-xl font-semibold" style={{
              fontFamily: headerFont?.family,
              fontSize: getFontSize(headerFont?.size, 'large'),
              color: 'white',
            }}>
              {title}
            </h3>
          </div>
        </CardHeader>
      );
    } 
    
    return (
      <CardHeader>
        <h3 className="text-xl font-semibold" style={{
          fontFamily: headerFont?.family,
          fontSize: getFontSize(headerFont?.size, 'large'),
          color: headerFont?.color || '#333333',
        }}>
          {title}
        </h3>
        {customization.headerImage && (
          <div className="mt-2 rounded-md overflow-hidden">
            <img 
              src={customization.headerImage} 
              alt={title} 
              className="w-full h-auto object-cover max-h-32"
            />
          </div>
        )}
      </CardHeader>
    );
  };

  // Branding footer
  const renderBranding = () => {
    if (customization.branding && 
        (customization.branding.logo || customization.branding.slogan)) {
      return (
        <div className="text-center text-sm mt-2 pt-2 border-t">
          <div className="flex flex-col items-center space-y-1">
            {customization.branding.logo && (
              <img 
                src={customization.branding.logo} 
                alt="Brand" 
                className="h-6 w-auto"
              />
            )}
            {customization.branding.slogan && (
              <p className="opacity-70" style={{ color: customization.font?.color || '#666666' }}>
                {customization.branding.slogan}
              </p>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      <div className="mb-2 flex justify-end">
        <Tabs value={viewMode} onValueChange={(v) => onViewModeChange(v as 'mobile' | 'desktop')}>
          <TabsList className="grid w-[180px] grid-cols-2">
            <TabsTrigger value="mobile">
              <Smartphone className="h-4 w-4 mr-1" /> Mobile
            </TabsTrigger>
            <TabsTrigger value="desktop">
              <Monitor className="h-4 w-4 mr-1" /> Desktop
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className={`mx-auto ${viewMode === 'mobile' ? 'max-w-xs' : 'max-w-2xl'}`}>
        <Card 
          className={`overflow-hidden ${getAnimationClass()}`}
          style={{
            ...getBackgroundStyle(),
            ...getCardEffectStyles(),
            fontFamily: customization.font?.family || 'system-ui, sans-serif'
          }}
        >
          {renderHeader()}
          
          <CardContent className="pt-6">
            {/* Description */}
            {description && (
              <div className="mb-3">
                <p 
                  className={getElementAnimationClass('text')} 
                  style={{
                    fontFamily: descriptionFont?.family,
                    fontSize: getFontSize(descriptionFont?.size),
                    color: descriptionFont?.color || '#4b5563',
                  }}
                >
                  {description}
                </p>
              </div>
            )}
            
            {/* Date and Time */}
            <div className="space-y-2 mt-3">
              <div className={`flex items-center space-x-2 ${getElementAnimationClass('text', 'delay-75')}`}>
                <Calendar 
                  className={`h-4 w-4 ${getElementAnimationClass('icons', 'delay-100')}`}
                  style={{ color: dateTimeFont?.color || '#4b5563' }} 
                />
                <span style={{
                  fontFamily: dateTimeFont?.family,
                  fontSize: getFontSize(dateTimeFont?.size, 'small'),
                  color: dateTimeFont?.color || '#4b5563',
                }}>
                  {dateTime}
                </span>
              </div>
              
              {location && (
                <div className={`flex items-center space-x-2 ${getElementAnimationClass('text', 'delay-100')}`}>
                  <MapPin 
                    className={`h-4 w-4 ${getElementAnimationClass('icons', 'delay-150')}`}
                    style={{ color: dateTimeFont?.color || '#4b5563' }} 
                  />
                  <span style={{
                    fontFamily: dateTimeFont?.family,
                    fontSize: getFontSize(dateTimeFont?.size, 'small'),
                    color: dateTimeFont?.color || '#4b5563',
                  }}>
                    {location}
                  </span>
                </div>
              )}
            </div>
            
            {/* Chatbot (if enabled) */}
            {customization.enableChatbot && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <h4 className="text-xs font-medium mb-2">Have questions?</h4>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-xs h-8 w-full"
                >
                  Chat with Event Assistant
                </Button>
              </div>
            )}
            
            {renderBranding()}
          </CardContent>
          
          <CardFooter className="flex flex-col gap-3 pb-2">
            {/* Calendar and Map buttons */}
            <div className="w-full flex flex-wrap gap-2 justify-center">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-xs h-8"
                style={getUtilityButtonStyle('calendar')}
              >
                <Calendar className="mr-1 h-3 w-3" /> Add to Calendar
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-xs h-8"
                style={getUtilityButtonStyle('map')}
              >
                <MapPin className="mr-1 h-3 w-3" /> View Map
              </Button>
            </div>
            
            {/* Accept/Decline buttons */}
            {customization.showAcceptDeclineButtons !== false && (
              <div className="w-full flex gap-2 mt-1">
                <Button
                  size="sm"
                  className="flex-1 text-xs h-8"
                  style={{
                    backgroundColor: customization.buttons.decline?.background || '#f44336',
                    color: customization.buttons.decline?.color || '#ffffff',
                    borderRadius: 
                      customization.buttons.decline?.shape === 'pill' ? '9999px' :
                      customization.buttons.decline?.shape === 'rounded' ? '0.375rem' : 
                      '0'
                  }}
                >
                  <X className="mr-1 h-3 w-3" /> Decline
                </Button>
                
                <Button
                  size="sm"
                  className="flex-1 text-xs h-8"
                  style={{
                    backgroundColor: customization.buttons.accept?.background || '#4CAF50',
                    color: customization.buttons.accept?.color || '#ffffff',
                    borderRadius: 
                      customization.buttons.accept?.shape === 'pill' ? '9999px' :
                      customization.buttons.accept?.shape === 'rounded' ? '0.375rem' : 
                      '0'
                  }}
                >
                  <Check className="mr-1 h-3 w-3" /> Accept
                </Button>
              </div>
            )}
          </CardFooter>
          
          {/* Powered by */}
          <div className="text-center text-[10px] opacity-60 py-1" 
            style={{ color: customization.poweredByColor || '#666666' }}>
            Powered by WAKTI
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LivePreview;
