
// Event customization types with stricter typing for better stability
import { BackgroundType, ButtonShape, TextAlign, CardEffectType, AnimationType, AnimationDelay } from './event.types';

// Background configuration interface
export interface BackgroundConfig {
  type: BackgroundType;
  value: string;
}

// Font configuration interface
export interface FontConfig {
  family: string;
  size: string;
  color: string;
  weight?: string;
  alignment?: TextAlign;
}

// Button style configuration interface
export interface ButtonConfig {
  background: string;
  color: string;
  shape: ButtonShape;
}

// Card effect configuration interface
export interface CardEffectConfig {
  type: CardEffectType;
  borderRadius?: "none" | "small" | "medium" | "large";
  border?: boolean;
  borderColor?: string;
}

// Element animations configuration interface
export interface ElementAnimationsConfig {
  text?: AnimationType;
  buttons?: AnimationType;
  icons?: AnimationType;
  delay?: AnimationDelay;
}

// Event card dimensions in various units for consistency
export const EVENT_CARD_DIMENSIONS = {
  // Physical dimensions in inches
  PHYSICAL: {
    WIDTH: 5.78,
    HEIGHT: 2.82,
    ASPECT_RATIO: 5.78 / 2.82
  },
  // Default pixel dimensions at 96 DPI
  PIXELS: {
    WIDTH: 555,
    HEIGHT: 271,
    ASPECT_RATIO: 555 / 271
  }
};

// Customization action types for reducers
export enum CustomizationActionType {
  SET_BACKGROUND = 'SET_BACKGROUND',
  SET_FONT = 'SET_FONT',
  SET_BUTTON_CONFIG = 'SET_BUTTON_CONFIG',
  SET_HEADER_STYLE = 'SET_HEADER_STYLE',
  SET_CARD_EFFECT = 'SET_CARD_EFFECT',
  SET_ANIMATION = 'SET_ANIMATION',
  SET_FEATURE_FLAG = 'SET_FEATURE_FLAG',
  RESET = 'RESET'
}

// Customization action interfaces for reducer
export type CustomizationAction =
  | { type: CustomizationActionType.SET_BACKGROUND; payload: BackgroundConfig }
  | { type: CustomizationActionType.SET_FONT; payload: { key: string; value: Partial<FontConfig> } }
  | { type: CustomizationActionType.SET_BUTTON_CONFIG; payload: { key: 'accept' | 'decline'; value: Partial<ButtonConfig> } }
  | { type: CustomizationActionType.SET_HEADER_STYLE; payload: string }
  | { type: CustomizationActionType.SET_CARD_EFFECT; payload: Partial<CardEffectConfig> }
  | { type: CustomizationActionType.SET_ANIMATION; payload: AnimationType }
  | { type: CustomizationActionType.SET_FEATURE_FLAG; payload: { key: string; value: boolean } }
  | { type: CustomizationActionType.RESET };
