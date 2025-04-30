
import { EventCustomization } from "@/types/event.types";
import { 
  createBackgroundHandlers,
  createButtonHandlers,
  createFontHandlers,
  createHeaderHandlers,
  createFeatureHandlers,
  createEffectHandlers
} from "./handlers";

export const createCustomizationHandlers = (
  customization: EventCustomization,
  onCustomizationChange: (customization: EventCustomization) => void
) => {
  // Get handlers from each specialized category
  const backgroundHandlers = createBackgroundHandlers(customization, onCustomizationChange);
  const buttonHandlers = createButtonHandlers(customization, onCustomizationChange);
  const fontHandlers = createFontHandlers(customization, onCustomizationChange);
  const headerHandlers = createHeaderHandlers(customization, onCustomizationChange);
  const featureHandlers = createFeatureHandlers(customization, onCustomizationChange);
  const effectHandlers = createEffectHandlers(customization, onCustomizationChange);

  // Return all handlers combined into a single object
  return {
    ...backgroundHandlers,
    ...buttonHandlers,
    ...fontHandlers,
    ...headerHandlers,
    ...featureHandlers,
    ...effectHandlers
  };
};
