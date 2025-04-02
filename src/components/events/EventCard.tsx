
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  MapPin, 
  ArrowRight, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Trash2, 
  Edit, 
  Eye, 
  Users
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { EventCustomization, Event, EventStatus, BackgroundType, ButtonShape } from '@/types/event.types';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export interface EventCardProps {
  event: Event;
  onCardClick?: () => void;
  onDelete?: (eventId: string) => Promise<void>;
  onEdit?: (event: Event) => void;
  onViewResponses?: (eventId: string) => void;
  onAccept?: (eventId: string) => void;
  onDecline?: (eventId: string) => void;
}

const EventCard: React.FC<EventCardProps> = ({
  event,
  onCardClick,
  onDelete,
  onEdit,
  onViewResponses,
  onAccept,
  onDecline
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  // Default customization values if not provided
  const customization = event.customization || {
    background: { type: 'solid' as BackgroundType, value: '#ffffff' },
    font: { family: 'sans-serif', size: 'medium', color: '#333333', weight: 'normal' },
    buttons: {
      accept: { background: '#4CAF50', color: '#ffffff', shape: 'rounded' as ButtonShape },
      decline: { background: '#f44336', color: '#ffffff', shape: 'rounded' as ButtonShape }
    }
  };
  
  // Destructure font objects with fallbacks
  const headerFont = customization.headerFont || customization.font;
  const descriptionFont = customization.descriptionFont || customization.font;
  const dateTimeFont = customization.dateTimeFont || customization.font;
  
  // Format the date for display
  const formatEventDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "EEEE, MMMM d, yyyy");
    } catch (e) {
      return dateString;
    }
  };
  
  // Format the time for display
  const formatEventTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "h:mm a");
    } catch (e) {
      return "";
    }
  };
  
  // Get background style
  const getBackgroundStyle = () => {
    if (!customization.background) return {};
    
    if (customization.background.type === 'solid') {
      return { backgroundColor: customization.background.value || '#ffffff' };
    } else if (customization.background.type === 'gradient') {
      if (customization?.background?.direction) {
        return { backgroundImage: customization.background.value };
      } else if (customization?.background?.angle !== undefined) {
        return { backgroundImage: customization.background.value };
      }
      return { backgroundImage: customization.background.value || 'linear-gradient(to right, #f7f7f7, #e3e3e3)' };
    } else if (customization.background.type === 'image') {
      return { backgroundImage: `url(${customization.background.value})`, backgroundSize: 'cover', backgroundPosition: 'center' };
    }
    
    return { backgroundColor: '#ffffff' };
  };
  
  // Handle card click
  const handleCardClick = () => {
    if (onCardClick) {
      onCardClick();
    }
  };
  
  // Determine if header should be shown
  const shouldShowHeader = customization?.headerStyle !== 'minimal';
  
  // Get animation class
  const getAnimationClass = (animationType?: string, delay: number = 0) => {
    if (!animationType || animationType === 'none') return '';
    
    const baseClass = animationType === 'fade' ? 'animate-fade-in' : 
                      animationType === 'slide' ? 'animate-slide-in' :
                      animationType === 'pop' ? 'animate-pop-in' : '';
    
    return `${baseClass} ${delay > 0 ? `animation-delay-${delay}` : ''}`;
  };
  
  // Get element animation class
  const getElementAnimation = (element: 'text' | 'buttons' | 'icons') => {
    if (!customization?.elementAnimations) return '';
    return getAnimationClass(customization?.elementAnimations[element], 0);
  };
  
  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all duration-300 h-full flex flex-col",
        onCardClick && "cursor-pointer hover:shadow-md",
        getCardEffectClasses()
      )}
      style={getBackgroundStyle()}
      onClick={handleCardClick}
    >
      {shouldShowHeader && (
        <CardHeader className={cn(
          "relative pt-6",
          customization?.headerStyle === 'banner' && "bg-primary/10 pb-16",
          getElementAnimation('text')
        )}>
          {customization?.headerImage && (
            <div className="absolute inset-0 w-full h-full">
              <img 
                src={customization?.headerImage} 
                alt="Event header" 
                className="w-full h-full object-cover opacity-50"
              />
              <div className="absolute inset-0 bg-black/10"></div>
            </div>
          )}
          
          <CardTitle style={{ 
            fontFamily: headerFont?.family || 'inherit', 
            fontSize: getFontSize(headerFont?.size || 'large'), 
            color: headerFont?.color || '#333333',
            fontWeight: getFontWeight(headerFont?.weight || 'bold'),
            textAlign: customization?.font?.alignment || 'left',
            position: 'relative',
            zIndex: 10
          }}>
            {event.title}
          </CardTitle>
          
          {event.description && (
            <CardDescription style={{ 
              fontFamily: descriptionFont?.family || 'inherit', 
              fontSize: getFontSize(descriptionFont?.size || 'medium'),
              color: descriptionFont?.color || '#666666',
              fontWeight: getFontWeight(descriptionFont?.weight || 'normal'),
              position: 'relative',
              zIndex: 10
            }} className={getElementAnimation('text')}>
              {event.description}
            </CardDescription>
          )}
          
          {customization?.branding && customization?.branding?.logo && (
            <div className="absolute top-2 right-2">
              <img 
                src={customization?.branding?.logo} 
                alt="Branding" 
                className="h-8 w-auto"
              />
            </div>
          )}
        </CardHeader>
      )}
      
      <CardContent className={cn(
        "flex-1 space-y-4 pt-6",
        customization?.headerStyle === 'banner' && "-mt-12 relative z-10 rounded-t-xl bg-card shadow",
        !shouldShowHeader && "pt-6",
        getAnimationClass(customization?.animation)
      )}>
        {!shouldShowHeader && (
          <div className={getElementAnimation('text')}>
            <h3 style={{ 
              fontFamily: headerFont?.family || 'inherit', 
              fontSize: getFontSize(headerFont?.size || 'large'), 
              color: headerFont?.color || '#333333',
              fontWeight: getFontWeight(headerFont?.weight || 'bold')
            }}>
              {event.title}
            </h3>
            
            {event.description && (
              <p style={{ 
                fontFamily: descriptionFont?.family || 'inherit', 
                fontSize: getFontSize(descriptionFont?.size || 'medium'),
                color: descriptionFont?.color || '#666666',
                fontWeight: getFontWeight(descriptionFont?.weight || 'normal')
              }} className="mt-1">
                {event.description}
              </p>
            )}
          </div>
        )}
        
        <div className="space-y-2">
          <div className={cn("flex items-center", getElementAnimation('text'))}>
            <Calendar className={cn("mr-2 h-4 w-4 text-muted-foreground", getElementAnimation('icons'))} />
            <span style={{ 
              fontFamily: dateTimeFont?.family || 'inherit', 
              fontSize: getFontSize(dateTimeFont?.size || 'small'),
              color: dateTimeFont?.color || '#666666',
              fontWeight: getFontWeight(dateTimeFont?.weight || 'normal')
            }}>
              {formatEventDate(event.start_time)}
            </span>
          </div>
          
          {!event.is_all_day && (
            <div className={cn("flex items-center", getElementAnimation('text'))}>
              <Clock className={cn("mr-2 h-4 w-4 text-muted-foreground", getElementAnimation('icons'))} />
              <span style={{ 
                fontFamily: dateTimeFont?.family || 'inherit', 
                fontSize: getFontSize(dateTimeFont?.size || 'small'),
                color: dateTimeFont?.color || '#666666',
                fontWeight: getFontWeight(dateTimeFont?.weight || 'normal')
              }}>
                {formatEventTime(event.start_time)} - {formatEventTime(event.end_time)}
              </span>
            </div>
          )}
          
          {event.location && (
            <div className={cn("flex items-center", getElementAnimation('text'))}>
              <MapPin className={cn("mr-2 h-4 w-4 text-muted-foreground", getElementAnimation('icons'))} />
              <span style={{ 
                fontFamily: customization.font.family || 'inherit', 
                fontSize: getFontSize(customization.font.size || 'small'),
                color: customization.font.color || '#666666',
                fontWeight: getFontWeight(customization.font.weight || 'normal')
              }}>
                {event.location}
              </span>
            </div>
          )}
        </div>
        
        {customization?.enableChatbot && (
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
        "flex flex-wrap gap-2 pt-0 pb-4 px-6",
        customization?.headerStyle === 'banner' && "bg-card",
        getElementAnimation('buttons')
      )}>
        {event.status === "sent" && getResponseButtons()}
        
        {getActionButtons()}
      </CardFooter>
      
      <div className="text-center text-xs text-muted-foreground p-1" style={{ 
        color: customization?.poweredByColor || '#666' 
      }}>
        Powered by WAKTI
      </div>
    </Card>
  );
  
  // Helper function to get response buttons
  function getResponseButtons() {
    if (!customization?.showAcceptDeclineButtons) return null;
    
    if (event.status === "accepted" || event.status === "declined") {
      return (
        <div className="w-full flex items-center justify-center space-x-2">
          <div className={cn(
            "px-3 py-1.5 rounded flex items-center space-x-1",
            event.status === "accepted" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700",
            getElementAnimation('text')
          )}>
            {event.status === "accepted" ? (
              <CheckCircle className={cn("h-4 w-4 mr-1", getElementAnimation('icons'))} />
            ) : (
              <XCircle className={cn("h-4 w-4 mr-1", getElementAnimation('icons'))} />
            )}
            <span>{event.status === "accepted" ? "You've accepted" : "You've declined"}</span>
          </div>
        </div>
      );
    }
    
    return (
      <>
        {onDecline && (
          <Button
            variant="outline"
            className={getElementAnimation('buttons')}
            onClick={(e) => {
              e.stopPropagation();
              onDecline(event.id);
            }}
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
        )}
        
        {onAccept && (
          <Button
            variant="default"
            className={getElementAnimation('buttons')}
            onClick={(e) => {
              e.stopPropagation();
              onAccept(event.id);
            }}
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
        )}
      </>
    );
  }
  
  // Helper function to get action buttons
  function getActionButtons() {
    const actionButtons = [];
    
    if (onEdit) {
      actionButtons.push(
        <Button
          key="edit"
          variant="ghost"
          size="sm"
          className={getElementAnimation('buttons')}
          onClick={(e) => {
            e.stopPropagation();
            onEdit(event);
          }}
        >
          <Edit className={cn("mr-1 h-4 w-4", getElementAnimation('icons'))} />
          Edit
        </Button>
      );
    }
    
    if (onViewResponses) {
      actionButtons.push(
        <Button
          key="responses"
          variant="ghost"
          size="sm"
          className={getElementAnimation('buttons')}
          onClick={(e) => {
            e.stopPropagation();
            onViewResponses(event.id);
          }}
        >
          <Users className={cn("mr-1 h-4 w-4", getElementAnimation('icons'))} />
          Responses
        </Button>
      );
    }
    
    if (onDelete) {
      actionButtons.push(
        <Button
          key="delete"
          variant="ghost"
          size="sm"
          className={getElementAnimation('buttons')}
          onClick={async (e) => {
            e.stopPropagation();
            try {
              setIsLoading(true);
              await onDelete(event.id);
            } finally {
              setIsLoading(false);
            }
          }}
          disabled={isLoading}
        >
          <Trash2 className={cn("mr-1 h-4 w-4", getElementAnimation('icons'))} />
          {isLoading ? "Deleting..." : "Delete"}
        </Button>
      );
    }
    
    return actionButtons.length > 0 ? (
      <div className="w-full flex flex-wrap justify-end gap-2 mt-2">
        {actionButtons}
      </div>
    ) : null;
  }
  
  // Helper function to get card effect classes
  function getCardEffectClasses() {
    if (!customization?.cardEffect) return '';
    
    const classes = [];
    
    // Shadow effect
    if (customization?.cardEffect?.type === 'shadow') {
      classes.push('shadow-md');
    }
    
    // Matte effect
    if (customization?.cardEffect?.type === 'matte') {
      classes.push('bg-opacity-90');
    }
    
    // Gloss effect
    if (customization?.cardEffect?.type === 'gloss') {
      classes.push('backdrop-filter backdrop-blur-sm bg-opacity-80');
    }
    
    // Border radius
    if (customization?.cardEffect?.borderRadius) {
      const radius = {
        'none': 'rounded-none',
        'small': 'rounded-sm',
        'medium': 'rounded-md',
        'large': 'rounded-lg'
      }[customization?.cardEffect?.borderRadius];
      
      if (radius) classes.push(radius);
    }
    
    // Border
    if (customization?.cardEffect?.border) {
      classes.push('border');
      if (customization?.cardEffect?.borderColor) {
        classes.push(`border-[${customization?.cardEffect?.borderColor}]`);
      }
    }
    
    return classes.join(' ');
  }
  
  // Helper functions for font styling
  function getFontSize(size?: string) {
    switch (size) {
      case 'small': return '0.875rem';
      case 'medium': return '1rem';
      case 'large': return '1.25rem';
      case 'xlarge': return '1.5rem';
      default: return '1rem';
    }
  }
  
  function getFontWeight(weight?: string) {
    switch (weight) {
      case 'light': return '300';
      case 'normal': return '400';
      case 'medium': return '500';
      case 'bold': return '700';
      default: return '400';
    }
  }
};

export default EventCard;
