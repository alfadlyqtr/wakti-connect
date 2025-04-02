
import React from "react";
import { EventCustomization } from "@/types/event.types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Clock, CheckCircle, XCircle, CornerDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface LivePreviewProps {
  customization: EventCustomization;
  title: string;
  description?: string;
  location?: string;
  dateTime?: string;
  viewMode?: 'mobile' | 'desktop';
  onViewModeChange?: (mode: 'mobile' | 'desktop') => void;
}

const LivePreview: React.FC<LivePreviewProps> = ({
  customization,
  title,
  description,
  location,
  dateTime,
  viewMode = 'mobile',
  onViewModeChange
}) => {
  // Get background style based on customization
  const getBackgroundStyle = () => {
    if (!customization.background) {
      return { backgroundColor: '#ffffff' };
    }
    
    if (customization.background.type === 'solid') {
      return { backgroundColor: customization.background.value || '#ffffff' };
    } else if (customization.background.type === 'gradient') {
      // If direction is specified, use direction-based gradient
      if (customization.background.direction) {
        return { backgroundImage: customization.background.value };
      } 
      // If angle is specified, use angle-based gradient
      else if (customization.background.angle !== undefined) {
        return { backgroundImage: customization.background.value };
      }
      return { backgroundImage: customization.background.value || 'linear-gradient(to right, #f7f7f7, #e3e3e3)' };
    } else if (customization.background.type === 'image') {
      return { backgroundImage: `url(${customization.background.value})`, backgroundSize: 'cover', backgroundPosition: 'center' };
    }
    
    return { backgroundColor: '#ffffff' };
  };

  // Get animation class based on type
  const getAnimationClass = (animationType?: string, delay: number = 0) => {
    if (!animationType || animationType === 'none') return '';
    
    const baseClass = animationType === 'fade' ? 'animate-fade-in' : 
                      animationType === 'slide' ? 'animate-slide-in' :
                      animationType === 'pop' ? 'animate-pop-in' : '';
    
    return `${baseClass} ${delay > 0 ? `animation-delay-${delay}` : ''}`;
  };
  
  // Get element animation
  const getElementAnimation = (element: 'text' | 'buttons' | 'icons') => {
    if (!customization.elementAnimations) return '';
    return getAnimationClass(customization.elementAnimations[element], 0);
  };
  
  // Helper functions for font styling
  const getFontSize = (size?: string) => {
    switch (size) {
      case 'small': return '0.875rem';
      case 'medium': return '1rem';
      case 'large': return '1.25rem';
      case 'xlarge': return '1.5rem';
      default: return '1rem';
    }
  };
  
  const getFontWeight = (weight?: string) => {
    switch (weight) {
      case 'light': return '300';
      case 'normal': return '400';
      case 'medium': return '500';
      case 'bold': return '700';
      default: return 'inherit';
    }
  };
  
  // Destructure font objects with fallbacks
  const { 
    headerFont = customization.font, 
    descriptionFont = customization.font, 
    dateTimeFont = customization.font 
  } = customization;

  // Determine if header should be shown
  const shouldShowHeader = customization.headerStyle !== 'minimal';
  
  return (
    <div className="p-4 flex flex-col items-center">
      {/* View mode toggle */}
      {onViewModeChange && (
        <div className="mb-4 flex gap-2">
          <Button 
            variant={viewMode === 'mobile' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => onViewModeChange('mobile')}
          >
            Mobile
          </Button>
          <Button 
            variant={viewMode === 'desktop' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => onViewModeChange('desktop')}
          >
            Desktop
          </Button>
        </div>
      )}
      
      {/* Card preview container with responsive width */}
      <div className={cn(
        "rounded-lg overflow-hidden border border-muted bg-white",
        viewMode === 'mobile' ? 'w-full max-w-xs' : 'w-full'
      )}>
        <Card 
          className={cn(
            "overflow-hidden border-0 h-full flex flex-col",
            getCardEffectClasses()
          )}
          style={getBackgroundStyle()}
        >
          {shouldShowHeader && (
            <CardHeader className={cn(
              "relative pt-6",
              customization.headerStyle === 'banner' && "bg-primary/10 pb-16",
              getElementAnimation('text')
            )}>
              {customization.headerStyle === 'banner' && customization.headerImage && (
                <div className="absolute inset-0 w-full h-full">
                  <img 
                    src={customization.headerImage} 
                    alt="Event header" 
                    className="w-full h-full object-cover opacity-50"
                  />
                  <div className="absolute inset-0 bg-black/10"></div>
                </div>
              )}
              
              <CardTitle style={{ 
                fontFamily: headerFont.family || 'inherit', 
                fontSize: getFontSize(headerFont.size || 'large'), 
                color: headerFont.color || '#333333',
                fontWeight: getFontWeight(headerFont.weight || 'bold'),
                position: 'relative',
                zIndex: 10
              }}>
                {title}
              </CardTitle>
              
              {description && (
                <CardDescription style={{ 
                  fontFamily: descriptionFont.family || 'inherit', 
                  fontSize: getFontSize(descriptionFont.size || 'medium'),
                  color: descriptionFont.color || '#666666',
                  fontWeight: getFontWeight(descriptionFont.weight || 'normal'),
                  position: 'relative',
                  zIndex: 10
                }} className={getElementAnimation('text')}>
                  {description}
                </CardDescription>
              )}
              
              {customization.branding && customization.branding.logo && (
                <div className="absolute top-2 right-2">
                  <img 
                    src={customization.branding.logo} 
                    alt="Branding" 
                    className="h-8 w-auto"
                  />
                </div>
              )}
            </CardHeader>
          )}
          
          <CardContent className={cn(
            "flex-1 space-y-4 pt-6",
            customization.headerStyle === 'banner' && "-mt-12 relative z-10 rounded-t-xl bg-card shadow-md",
            !shouldShowHeader && "pt-6",
            getAnimationClass(customization.animation)
          )}>
            {!shouldShowHeader && (
              <div className={getElementAnimation('text')}>
                <h3 style={{ 
                  fontFamily: headerFont.family || 'inherit', 
                  fontSize: getFontSize(headerFont.size || 'large'), 
                  color: headerFont.color || '#333333',
                  fontWeight: getFontWeight(headerFont.weight || 'bold')
                }}>
                  {title}
                </h3>
                
                {description && (
                  <p style={{ 
                    fontFamily: descriptionFont.family || 'inherit', 
                    fontSize: getFontSize(descriptionFont.size || 'medium'),
                    color: descriptionFont.color || '#666666',
                    fontWeight: getFontWeight(descriptionFont.weight || 'normal')
                  }} className="mt-1">
                    {description}
                  </p>
                )}
              </div>
            )}
            
            <div className="space-y-2">
              <div className={cn("flex items-center", getElementAnimation('text'))}>
                <Calendar className={cn("mr-2 h-4 w-4 text-muted-foreground", getElementAnimation('icons'))} />
                <span style={{ 
                  fontFamily: dateTimeFont.family || 'inherit', 
                  fontSize: getFontSize(dateTimeFont.size || 'small'),
                  color: dateTimeFont.color || '#666666',
                  fontWeight: getFontWeight(dateTimeFont.weight || 'normal')
                }}>
                  {dateTime || "Monday, January 1, 2024 · 9:00 AM - 10:00 AM"}
                </span>
              </div>
              
              {location && (
                <div className={cn("flex items-center", getElementAnimation('text'))}>
                  <MapPin className={cn("mr-2 h-4 w-4 text-muted-foreground", getElementAnimation('icons'))} />
                  <span style={{ 
                    fontFamily: customization.font.family || 'inherit', 
                    fontSize: getFontSize(customization.font.size || 'small'),
                    color: customization.font.color || '#666666',
                    fontWeight: getFontWeight(customization.font.weight || 'normal')
                  }}>
                    {location}
                  </span>
                </div>
              )}
            </div>
            
            {customization.enableChatbot && (
              <div className={cn("mt-4 p-3 bg-primary/5 rounded-md", getElementAnimation('text'))}>
                <p className={cn("text-sm", getElementAnimation('text'))}>
                  AI assistant available to answer questions about this event
                </p>
                <Button variant="ghost" size="sm" className={cn("mt-2", getElementAnimation('buttons'))}>
                  Chat with Assistant
                </Button>
              </div>
            )}
          </CardContent>
          
          <CardFooter className={cn(
            "flex justify-between gap-2 pt-0 pb-4 px-6",
            customization.headerStyle === 'banner' && "bg-card",
            getElementAnimation('buttons')
          )}>
            {customization.showAcceptDeclineButtons !== false && (
              <>
                <Button
                  variant="outline"
                  className={getElementAnimation('buttons')}
                  style={{
                    backgroundColor: customization.buttons.decline.background,
                    color: customization.buttons.decline.color,
                    borderRadius: 
                      customization.buttons.decline.shape === 'rounded' ? '0.375rem' : 
                      customization.buttons.decline.shape === 'pill' ? '9999px' : '0',
                    borderWidth: 0
                  }}
                >
                  <XCircle className={cn("mr-2 h-4 w-4", getElementAnimation('icons'))} />
                  Decline
                </Button>
                
                <Button
                  variant="default"
                  className={getElementAnimation('buttons')}
                  style={{
                    backgroundColor: customization.buttons.accept.background,
                    color: customization.buttons.accept.color,
                    borderRadius: 
                      customization.buttons.accept.shape === 'rounded' ? '0.375rem' : 
                      customization.buttons.accept.shape === 'pill' ? '9999px' : '0',
                    borderWidth: 0
                  }}
                >
                  <CheckCircle className={cn("mr-2 h-4 w-4", getElementAnimation('icons'))} />
                  Accept
                </Button>
              </>
            )}
          </CardFooter>
          
          <div className="text-center text-xs text-muted-foreground p-1" style={{ 
            color: customization.poweredByColor || '#666' 
          }}>
            Powered by WAKTI
          </div>
        </Card>
      </div>
    </div>
  );
  
  // Function to generate card effect classes
  function getCardEffectClasses() {
    if (!customization.cardEffect) return '';
    
    const classes = [];
    
    // Shadow effect
    if (customization.cardEffect.type === 'shadow') {
      classes.push('shadow-md');
    }
    
    // Matte effect
    if (customization.cardEffect.type === 'matte') {
      classes.push('bg-opacity-90');
    }
    
    // Gloss effect
    if (customization.cardEffect.type === 'gloss') {
      classes.push('backdrop-filter backdrop-blur-sm bg-opacity-80');
    }
    
    // Border radius
    if (customization.cardEffect.borderRadius) {
      const radius = {
        'none': 'rounded-none',
        'small': 'rounded-sm',
        'medium': 'rounded-md',
        'large': 'rounded-lg'
      }[customization.cardEffect.borderRadius];
      
      if (radius) classes.push(radius);
    }
    
    // Border
    if (customization.cardEffect.border) {
      classes.push('border');
      if (customization.cardEffect.borderColor) {
        classes.push(`border-[${customization.cardEffect.borderColor}]`);
      }
    }
    
    return classes.join(' ');
  }
};

export default LivePreview;
