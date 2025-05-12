
import { EventCustomization } from '@/types/event.types';

export const initialCustomization: EventCustomization = {
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
};

export default initialCustomization;
