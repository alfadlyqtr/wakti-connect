
import React, { createContext, useContext, useReducer, useMemo, useCallback, ReactNode } from 'react';
import { EventCustomization } from '@/types/event.types';
import { 
  CustomizationAction, 
  CustomizationActionType, 
  BackgroundConfig, 
  FontConfig,
  ButtonConfig,
  CardEffectConfig
} from '@/types/eventCustomization';

// Default customization values
const defaultCustomization: EventCustomization = {
  background: {
    type: 'solid',
    value: '#ffffff',
  },
  font: {
    family: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    size: 'medium',
    color: '#333333',
  },
  buttons: {
    accept: {
      background: '#4CAF50',
      color: '#ffffff',
      shape: 'rounded',
    },
    decline: {
      background: '#f44336',
      color: '#ffffff',
      shape: 'rounded',
    }
  },
  headerStyle: 'simple',
  animation: 'fade',
  cardEffect: {
    type: 'shadow',
    borderRadius: 'medium',
    border: false
  },
  showAcceptDeclineButtons: true,
  showAddToCalendarButton: true
};

// Reducer for managing customization state
function customizationReducer(state: EventCustomization, action: CustomizationAction): EventCustomization {
  switch (action.type) {
    case CustomizationActionType.SET_BACKGROUND:
      return { ...state, background: action.payload };
      
    case CustomizationActionType.SET_FONT:
      const { key, value } = action.payload;
      if (key === 'font') {
        return { ...state, font: { ...state.font, ...value } };
      } else if (key === 'headerFont') {
        return { 
          ...state, 
          headerFont: { ...state.headerFont || { ...state.font }, ...value } 
        };
      } else if (key === 'descriptionFont') {
        return { 
          ...state, 
          descriptionFont: { ...state.descriptionFont || { ...state.font }, ...value } 
        };
      } else if (key === 'dateTimeFont') {
        return { 
          ...state, 
          dateTimeFont: { ...state.dateTimeFont || { ...state.font }, ...value } 
        };
      }
      return state;
      
    case CustomizationActionType.SET_BUTTON_CONFIG:
      return {
        ...state,
        buttons: {
          ...state.buttons,
          [action.payload.key]: {
            ...state.buttons[action.payload.key],
            ...action.payload.value
          }
        }
      };
      
    case CustomizationActionType.SET_HEADER_STYLE:
      return { ...state, headerStyle: action.payload };
      
    case CustomizationActionType.SET_CARD_EFFECT:
      return { 
        ...state, 
        cardEffect: { 
          ...state.cardEffect || { 
            type: 'shadow',
            borderRadius: 'medium' 
          }, 
          ...action.payload 
        } 
      };
      
    case CustomizationActionType.SET_ANIMATION:
      return { ...state, animation: action.payload };
      
    case CustomizationActionType.SET_FEATURE_FLAG:
      return { ...state, [action.payload.key]: action.payload.value };
      
    case CustomizationActionType.RESET:
      return defaultCustomization;
      
    default:
      return state;
  }
}

// Context interface
interface EventCustomizationContextType {
  customization: EventCustomization;
  setCustomization: (customization: EventCustomization) => void;
  dispatch: React.Dispatch<CustomizationAction>;
  
  // Background handlers
  setBackground: (type: 'solid' | 'image', value: string) => void;
  
  // Font handlers
  setFontFamily: (family: string) => void;
  setFontColor: (color: string) => void;
  setFontSize: (size: string) => void;
  setFontAlignment: (alignment: 'left' | 'center' | 'right' | 'justify') => void;
  setHeaderFontSettings: (settings: Partial<FontConfig>) => void;
  setDescriptionFontSettings: (settings: Partial<FontConfig>) => void;
  setDateTimeFontSettings: (settings: Partial<FontConfig>) => void;
  
  // Button handlers
  setAcceptButtonSettings: (settings: Partial<ButtonConfig>) => void;
  setDeclineButtonSettings: (settings: Partial<ButtonConfig>) => void;
  
  // Header style handlers
  setHeaderStyle: (style: string) => void;
  
  // Card effect handlers
  setCardEffect: (settings: Partial<CardEffectConfig>) => void;
  
  // Animation handlers
  setAnimation: (animation: 'fade' | 'slide' | 'pop' | 'none') => void;
  
  // Feature flag handlers
  toggleFeature: (key: string, value: boolean) => void;
  
  // Reset handler
  resetCustomization: () => void;
}

// Create the context with a default value
const EventCustomizationContext = createContext<EventCustomizationContextType | undefined>(undefined);

// Provider component
export const EventCustomizationProvider: React.FC<{
  children: ReactNode;
  initialCustomization?: EventCustomization;
  onCustomizationChange?: (customization: EventCustomization) => void;
}> = ({ children, initialCustomization, onCustomizationChange }) => {
  // Use the reducer for state management
  const [customization, dispatch] = useReducer(
    customizationReducer,
    initialCustomization || defaultCustomization
  );
  
  // Call the onCustomizationChange callback when customization changes
  React.useEffect(() => {
    if (onCustomizationChange) {
      onCustomizationChange(customization);
    }
  }, [customization, onCustomizationChange]);
  
  // Explicit setter for the entire customization object
  const setCustomization = useCallback((newCustomization: EventCustomization) => {
    // Instead of using a custom action, we'll reset and then apply the new customization
    dispatch({ type: CustomizationActionType.RESET });
    
    // Apply background
    dispatch({ 
      type: CustomizationActionType.SET_BACKGROUND, 
      payload: newCustomization.background 
    });
    
    // Apply font settings
    dispatch({ 
      type: CustomizationActionType.SET_FONT, 
      payload: { key: 'font', value: newCustomization.font } 
    });
    
    if (newCustomization.headerFont) {
      dispatch({ 
        type: CustomizationActionType.SET_FONT, 
        payload: { key: 'headerFont', value: newCustomization.headerFont } 
      });
    }
    
    if (newCustomization.descriptionFont) {
      dispatch({ 
        type: CustomizationActionType.SET_FONT, 
        payload: { key: 'descriptionFont', value: newCustomization.descriptionFont } 
      });
    }
    
    if (newCustomization.dateTimeFont) {
      dispatch({ 
        type: CustomizationActionType.SET_FONT, 
        payload: { key: 'dateTimeFont', value: newCustomization.dateTimeFont } 
      });
    }
    
    // Apply button settings
    dispatch({ 
      type: CustomizationActionType.SET_BUTTON_CONFIG, 
      payload: { key: 'accept', value: newCustomization.buttons.accept } 
    });
    
    dispatch({ 
      type: CustomizationActionType.SET_BUTTON_CONFIG, 
      payload: { key: 'decline', value: newCustomization.buttons.decline } 
    });
    
    // Apply header style
    if (newCustomization.headerStyle) {
      dispatch({ 
        type: CustomizationActionType.SET_HEADER_STYLE, 
        payload: newCustomization.headerStyle 
      });
    }
    
    // Apply card effect
    if (newCustomization.cardEffect) {
      dispatch({ 
        type: CustomizationActionType.SET_CARD_EFFECT, 
        payload: newCustomization.cardEffect 
      });
    }
    
    // Apply animation
    if (newCustomization.animation) {
      dispatch({ 
        type: CustomizationActionType.SET_ANIMATION, 
        payload: newCustomization.animation 
      });
    }
    
    // Apply feature flags
    if (newCustomization.showAcceptDeclineButtons !== undefined) {
      dispatch({ 
        type: CustomizationActionType.SET_FEATURE_FLAG, 
        payload: { key: 'showAcceptDeclineButtons', value: newCustomization.showAcceptDeclineButtons } 
      });
    }
    
    if (newCustomization.showAddToCalendarButton !== undefined) {
      dispatch({ 
        type: CustomizationActionType.SET_FEATURE_FLAG, 
        payload: { key: 'showAddToCalendarButton', value: newCustomization.showAddToCalendarButton } 
      });
    }
  }, []);
  
  // Background handlers
  const setBackground = useCallback((type: 'solid' | 'image', value: string) => {
    dispatch({ 
      type: CustomizationActionType.SET_BACKGROUND, 
      payload: { type, value } 
    });
  }, []);
  
  // Font handlers
  const setFontFamily = useCallback((family: string) => {
    dispatch({ 
      type: CustomizationActionType.SET_FONT, 
      payload: { key: 'font', value: { family } } 
    });
  }, []);
  
  const setFontColor = useCallback((color: string) => {
    dispatch({ 
      type: CustomizationActionType.SET_FONT, 
      payload: { key: 'font', value: { color } } 
    });
  }, []);
  
  const setFontSize = useCallback((size: string) => {
    dispatch({ 
      type: CustomizationActionType.SET_FONT, 
      payload: { key: 'font', value: { size } } 
    });
  }, []);
  
  const setFontAlignment = useCallback((alignment: 'left' | 'center' | 'right' | 'justify') => {
    dispatch({ 
      type: CustomizationActionType.SET_FONT, 
      payload: { key: 'font', value: { alignment } } 
    });
  }, []);
  
  const setHeaderFontSettings = useCallback((settings: Partial<FontConfig>) => {
    dispatch({ 
      type: CustomizationActionType.SET_FONT, 
      payload: { key: 'headerFont', value: settings } 
    });
  }, []);
  
  const setDescriptionFontSettings = useCallback((settings: Partial<FontConfig>) => {
    dispatch({ 
      type: CustomizationActionType.SET_FONT, 
      payload: { key: 'descriptionFont', value: settings } 
    });
  }, []);
  
  const setDateTimeFontSettings = useCallback((settings: Partial<FontConfig>) => {
    dispatch({ 
      type: CustomizationActionType.SET_FONT, 
      payload: { key: 'dateTimeFont', value: settings } 
    });
  }, []);
  
  // Button handlers
  const setAcceptButtonSettings = useCallback((settings: Partial<ButtonConfig>) => {
    dispatch({ 
      type: CustomizationActionType.SET_BUTTON_CONFIG, 
      payload: { key: 'accept', value: settings } 
    });
  }, []);
  
  const setDeclineButtonSettings = useCallback((settings: Partial<ButtonConfig>) => {
    dispatch({ 
      type: CustomizationActionType.SET_BUTTON_CONFIG, 
      payload: { key: 'decline', value: settings } 
    });
  }, []);
  
  // Header style handler
  const setHeaderStyle = useCallback((style: string) => {
    dispatch({ 
      type: CustomizationActionType.SET_HEADER_STYLE, 
      payload: style 
    });
  }, []);
  
  // Card effect handler
  const setCardEffect = useCallback((settings: Partial<CardEffectConfig>) => {
    dispatch({ 
      type: CustomizationActionType.SET_CARD_EFFECT, 
      payload: settings 
    });
  }, []);
  
  // Animation handler
  const setAnimation = useCallback((animation: 'fade' | 'slide' | 'pop' | 'none') => {
    dispatch({ 
      type: CustomizationActionType.SET_ANIMATION, 
      payload: animation 
    });
  }, []);
  
  // Feature flag handler
  const toggleFeature = useCallback((key: string, value: boolean) => {
    dispatch({ 
      type: CustomizationActionType.SET_FEATURE_FLAG, 
      payload: { key, value } 
    });
  }, []);
  
  // Reset handler
  const resetCustomization = useCallback(() => {
    dispatch({ type: CustomizationActionType.RESET });
  }, []);
  
  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      customization,
      setCustomization,
      dispatch,
      setBackground,
      setFontFamily,
      setFontColor,
      setFontSize,
      setFontAlignment,
      setHeaderFontSettings,
      setDescriptionFontSettings,
      setDateTimeFontSettings,
      setAcceptButtonSettings,
      setDeclineButtonSettings,
      setHeaderStyle,
      setCardEffect,
      setAnimation,
      toggleFeature,
      resetCustomization
    }),
    [
      customization,
      setCustomization,
      dispatch,
      setBackground,
      setFontFamily,
      setFontColor,
      setFontSize,
      setFontAlignment,
      setHeaderFontSettings,
      setDescriptionFontSettings,
      setDateTimeFontSettings,
      setAcceptButtonSettings,
      setDeclineButtonSettings,
      setHeaderStyle,
      setCardEffect,
      setAnimation,
      toggleFeature,
      resetCustomization
    ]
  );
  
  return (
    <EventCustomizationContext.Provider value={contextValue}>
      {children}
    </EventCustomizationContext.Provider>
  );
};

// Custom hook for using the context
export const useEventCustomization = () => {
  const context = useContext(EventCustomizationContext);
  
  if (context === undefined) {
    throw new Error('useEventCustomization must be used within an EventCustomizationProvider');
  }
  
  return context;
};

// Export default customization for resets
export { defaultCustomization };
