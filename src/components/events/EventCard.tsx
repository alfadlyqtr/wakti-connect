
import React, { useState } from 'react';
import { Event, EventCustomization } from '@/types/event.types';
import { format } from 'date-fns';
import { useRouter } from 'next/router';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, Check, X } from 'lucide-react';
import { useEvents } from '@/hooks/useEvents';

interface EventCardProps {
  event: Event;
  isPreview?: boolean;
  onResponse?: (status: 'accepted' | 'declined') => void;
}

const EventCard: React.FC<EventCardProps> = ({ 
  event, 
  isPreview = false,
  onResponse
}) => {
  const router = useRouter();
  const { respondToInvitation } = useEvents();
  const [isLoading, setIsLoading] = useState(false);

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return format(date, 'EEEE, MMMM d, yyyy');
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  const formatTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return format(date, 'h:mm a');
    } catch (error) {
      console.error('Error formatting time:', error);
      return 'Invalid time';
    }
  };

  const handleResponse = async (status: 'accepted' | 'declined') => {
    if (isPreview || isLoading) return;
    
    try {
      setIsLoading(true);
      await respondToInvitation(event.id, status);
      if (onResponse) {
        onResponse(status);
      }
    } catch (error) {
      console.error('Error responding to invitation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Apply default customization if needed
  const customization: EventCustomization = event.customization || {
    background: {
      type: 'solid',
      value: '#ffffff'
    },
    font: {
      family: 'system-ui, sans-serif',
      size: 'medium',
      color: '#333333'
    },
    buttons: {
      accept: {
        background: '#4CAF50',
        color: '#ffffff',
        shape: 'rounded'
      },
      decline: {
        background: '#f44336',
        color: '#ffffff',
        shape: 'rounded'
      }
    },
    animation: 'fade'
  };

  // Use specific font settings or fall back to the general font settings
  const headerFont = customization.headerFont || customization.font;
  const descriptionFont = customization.descriptionFont || customization.font;
  const dateTimeFont = customization.dateTimeFont || customization.font;

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

  // Generate card header based on header style
  const renderHeader = () => {
    const headerStyle = customization.headerStyle || 'simple';
    const hasHeaderImage = customization.headerImage && customization.headerImage.length > 0;
    
    // Animation classes
    const textAnimation = customization.elementAnimations?.text || 'fade';
    const animationClass = textAnimation === 'fade' ? 'animate-fade-in' :
                         textAnimation === 'slide' ? 'animate-slide-in' :
                         textAnimation === 'pop' ? 'animate-scale-in' : '';
    
    if (headerStyle === 'banner' && hasHeaderImage) {
      return (
        <CardHeader 
          className="p-0 overflow-hidden" 
          style={{ 
            backgroundImage: `url(${customization.headerImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: '120px'
          }}
        >
          <div className={`bg-black/50 p-6 text-white ${animationClass}`}>
            <h3 className="text-2xl font-semibold" style={{
              fontFamily: headerFont?.family,
              fontSize: getFontSize(headerFont?.size, 'large'),
              color: headerFont?.color || 'white',
              fontWeight: headerFont?.weight || 'bold'
            }}>
              {event.title}
            </h3>
            {event.status === 'accepted' || event.status === 'declined' ? (
              <div className="mt-2 text-sm">
                Status: <span className={`font-medium ${event.status === 'accepted' ? 'text-green-300' : 'text-red-300'}`}>
                  {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                </span>
              </div>
            ) : null}
          </div>
        </CardHeader>
      );
    } else {
      // Simple or minimal header
      return (
        <CardHeader>
          <h3 className={`text-2xl font-semibold ${animationClass}`} style={{
            fontFamily: headerFont?.family,
            fontSize: getFontSize(headerFont?.size, 'large'),
            color: headerFont?.color || '#333333',
            fontWeight: headerFont?.weight || 'bold'
          }}>
            {event.title}
          </h3>
          {hasHeaderImage && (
            <div className="mt-4 rounded-md overflow-hidden">
              <img 
                src={customization.headerImage} 
                alt={event.title} 
                className="w-full h-auto object-cover"
              />
            </div>
          )}
          {event.status === 'accepted' || event.status === 'declined' ? (
            <div className={`mt-2 text-sm ${animationClass}`}>
              Status: <span className={`font-medium ${event.status === 'accepted' ? 'text-green-600' : 'text-red-600'}`}>
                {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
              </span>
            </div>
          ) : null}
        </CardHeader>
      );
    }
  };

  // Function to get branding footer
  const renderBranding = () => {
    if (customization.branding && 
        (customization.branding.logo || customization.branding.slogan)) {
      const textAnimation = customization.elementAnimations?.text || 'fade';
      const animationClass = textAnimation === 'fade' ? 'animate-fade-in' :
                           textAnimation === 'slide' ? 'animate-slide-in' :
                           textAnimation === 'pop' ? 'animate-scale-in' : '';
      
      return (
        <div className={`text-center text-sm mt-4 pt-4 border-t ${animationClass}`}>
          <div className="flex flex-col items-center space-y-2">
            {customization.branding.logo && (
              <img 
                src={customization.branding.logo} 
                alt="Brand" 
                className="h-8 w-auto"
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

  // Main card render
  return (
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
        {/* Event description */}
        {event.description && (
          <div className="mb-4">
            <p style={{
              fontFamily: descriptionFont?.family,
              fontSize: getFontSize(descriptionFont?.size),
              color: descriptionFont?.color || '#4b5563',
              fontWeight: descriptionFont?.weight || 'normal',
              textAlign: (descriptionFont?.alignment || 'left') as any
            }} className={`${customization.elementAnimations?.text === 'fade' ? 'animate-fade-in' : 
                         customization.elementAnimations?.text === 'slide' ? 'animate-slide-in' : 
                         customization.elementAnimations?.text === 'pop' ? 'animate-scale-in' : ''}`}>
              {event.description}
            </p>
          </div>
        )}
        
        {/* Date and time info */}
        <div className="space-y-3 mt-4">
          <div className={`flex items-center space-x-2 ${
            customization.elementAnimations?.text === 'fade' ? 'animate-fade-in delay-75' : 
            customization.elementAnimations?.text === 'slide' ? 'animate-slide-in delay-75' : 
            customization.elementAnimations?.text === 'pop' ? 'animate-scale-in delay-75' : ''
          }`}>
            <Calendar className={`h-5 w-5 ${
              customization.elementAnimations?.icons === 'fade' ? 'animate-fade-in delay-150' : 
              customization.elementAnimations?.icons === 'slide' ? 'animate-slide-in delay-150' : 
              customization.elementAnimations?.icons === 'pop' ? 'animate-scale-in delay-150' : ''
            }`} style={{ color: dateTimeFont?.color || '#4b5563' }} />
            <span style={{
              fontFamily: dateTimeFont?.family,
              fontSize: getFontSize(dateTimeFont?.size, 'medium'),
              color: dateTimeFont?.color || '#4b5563',
              fontWeight: dateTimeFont?.weight || 'normal'
            }}>
              {formatDate(event.start_time)}
            </span>
          </div>
          
          {!event.is_all_day && (
            <div className={`flex items-center space-x-2 ${
              customization.elementAnimations?.text === 'fade' ? 'animate-fade-in delay-100' : 
              customization.elementAnimations?.text === 'slide' ? 'animate-slide-in delay-100' : 
              customization.elementAnimations?.text === 'pop' ? 'animate-scale-in delay-100' : ''
            }`}>
              <Clock className={`h-5 w-5 ${
                customization.elementAnimations?.icons === 'fade' ? 'animate-fade-in delay-200' : 
                customization.elementAnimations?.icons === 'slide' ? 'animate-slide-in delay-200' : 
                customization.elementAnimations?.icons === 'pop' ? 'animate-scale-in delay-200' : ''
              }`} style={{ color: dateTimeFont?.color || '#4b5563' }} />
              <span style={{
                fontFamily: dateTimeFont?.family,
                fontSize: getFontSize(dateTimeFont?.size, 'medium'),
                color: dateTimeFont?.color || '#4b5563',
                fontWeight: dateTimeFont?.weight || 'normal'
              }}>
                {formatTime(event.start_time)} - {formatTime(event.end_time)}
              </span>
            </div>
          )}
          
          {event.location && (
            <div className={`flex items-center space-x-2 ${
              customization.elementAnimations?.text === 'fade' ? 'animate-fade-in delay-150' : 
              customization.elementAnimations?.text === 'slide' ? 'animate-slide-in delay-150' : 
              customization.elementAnimations?.text === 'pop' ? 'animate-scale-in delay-150' : ''
            }`}>
              <MapPin className={`h-5 w-5 ${
                customization.elementAnimations?.icons === 'fade' ? 'animate-fade-in delay-300' : 
                customization.elementAnimations?.icons === 'slide' ? 'animate-slide-in delay-300' : 
                customization.elementAnimations?.icons === 'pop' ? 'animate-scale-in delay-300' : ''
              }`} style={{ color: dateTimeFont?.color || '#4b5563' }} />
              <span style={{
                fontFamily: dateTimeFont?.family,
                fontSize: getFontSize(dateTimeFont?.size, 'medium'),
                color: dateTimeFont?.color || '#4b5563',
                fontWeight: dateTimeFont?.weight || 'normal'
              }}>
                {event.location}
              </span>
            </div>
          )}
        </div>

        {/* Chatbot section */}
        {customization.enableChatbot && (
          <div className={`mt-6 p-4 bg-gray-50 rounded-lg ${
            customization.elementAnimations?.text === 'fade' ? 'animate-fade-in delay-200' : 
            customization.elementAnimations?.text === 'slide' ? 'animate-slide-in delay-200' : 
            customization.elementAnimations?.text === 'pop' ? 'animate-scale-in delay-200' : ''
          }`}>
            <h4 className="text-sm font-medium mb-2">Have questions?</h4>
            <Button 
              variant="outline" 
              className={`w-full ${
                customization.elementAnimations?.buttons === 'fade' ? 'animate-fade-in delay-250' : 
                customization.elementAnimations?.buttons === 'slide' ? 'animate-slide-in delay-250' : 
                customization.elementAnimations?.buttons === 'pop' ? 'animate-scale-in delay-250' : ''
              }`}
              onClick={() => {/* Implement chatbot open */}}
            >
              Chat with Event Assistant
            </Button>
          </div>
        )}
        
        {renderBranding()}
      </CardContent>
      
      <CardFooter className="flex flex-col gap-4">
        {/* Calendar and map buttons */}
        <div className={`w-full flex flex-wrap gap-2 justify-center ${
          customization.elementAnimations?.buttons === 'fade' ? 'animate-fade-in delay-300' : 
          customization.elementAnimations?.buttons === 'slide' ? 'animate-slide-in delay-300' : 
          customization.elementAnimations?.buttons === 'pop' ? 'animate-scale-in delay-300' : ''
        }`}>
          <Button 
            variant="outline" 
            size="sm"
            className="flex-1"
            style={getUtilityButtonStyle('calendar')}
            onClick={() => {/* Add to calendar functionality */}}
          >
            <Calendar className="mr-2 h-4 w-4" /> Add to Calendar
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            style={getUtilityButtonStyle('map')}
            onClick={() => {/* Open map functionality */}}
          >
            <MapPin className="mr-2 h-4 w-4" /> View on Map
          </Button>
        </div>
        
        {/* Accept/Decline buttons */}
        {(customization.showAcceptDeclineButtons !== false) && 
         !isPreview && 
         (event.status !== 'accepted' && event.status !== 'declined') && (
          <div className={`w-full flex gap-3 mt-2 ${
            customization.elementAnimations?.buttons === 'fade' ? 'animate-fade-in delay-400' : 
            customization.elementAnimations?.buttons === 'slide' ? 'animate-slide-in delay-400' : 
            customization.elementAnimations?.buttons === 'pop' ? 'animate-scale-in delay-400' : ''
          }`}>
            <Button
              className="flex-1"
              style={{
                backgroundColor: customization.buttons.decline?.background || '#f44336',
                color: customization.buttons.decline?.color || '#ffffff',
                borderRadius: 
                  customization.buttons.decline?.shape === 'pill' ? '9999px' :
                  customization.buttons.decline?.shape === 'rounded' ? '0.375rem' : 
                  '0'
              }}
              onClick={() => handleResponse('declined')}
              disabled={isLoading}
            >
              <X className="mr-2 h-4 w-4" /> Decline
            </Button>
            
            <Button
              className="flex-1"
              style={{
                backgroundColor: customization.buttons.accept?.background || '#4CAF50',
                color: customization.buttons.accept?.color || '#ffffff',
                borderRadius: 
                  customization.buttons.accept?.shape === 'pill' ? '9999px' :
                  customization.buttons.accept?.shape === 'rounded' ? '0.375rem' : 
                  '0'
              }}
              onClick={() => handleResponse('accepted')}
              disabled={isLoading}
            >
              <Check className="mr-2 h-4 w-4" /> Accept
            </Button>
          </div>
        )}
      </CardFooter>
      
      {/* Powered by footer */}
      <div className="text-center text-xs opacity-60 py-2" 
        style={{ color: customization.poweredByColor || '#666666' }}>
        Powered by WAKTI
      </div>
    </Card>
  );
};

export default EventCard;
