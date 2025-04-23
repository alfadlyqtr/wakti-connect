
import { GOOGLE_MAPS_API_KEY } from '@/config/maps';

const validateMapsKey = () => {
  if (!GOOGLE_MAPS_API_KEY) {
    console.warn('Warning: Missing Google Maps API key');
    return false;
  }
  return true;
};

export const getMapThumbnailUrl = async (location: string): Promise<string> => {
  if (!location || !validateMapsKey()) return '';
  
  try {
    // Create Static Maps URL
    return `https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(location)}&zoom=14&size=400x200&key=${GOOGLE_MAPS_API_KEY}&markers=${encodeURIComponent(location)}`;
  } catch (error) {
    console.error('Error generating map thumbnail URL:', error);
    return '';
  }
};

export const getLocationPreviewStyles = () => ({
  width: '300px',
  height: '200px',
  objectFit: 'cover' as const,
  borderRadius: '4px',
  border: '1px solid #e2e8f0'
});
