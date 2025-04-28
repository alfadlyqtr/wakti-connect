
import { GOOGLE_MAPS_API_KEY } from '@/config/maps';

export const getMapThumbnailUrl = (location: string): string => {
  if (!location || !GOOGLE_MAPS_API_KEY) return '';
  
  return `https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(location)}&zoom=14&size=400x200&key=${GOOGLE_MAPS_API_KEY}&markers=${encodeURIComponent(location)}`;
};

export const getLocationPreviewStyles = () => ({
  width: '300px',
  height: '200px',
  objectFit: 'cover' as const,
  borderRadius: '4px',
  border: '1px solid #e2e8f0'
});

export const handleMapsError = (error: any): string => {
  console.error('Maps error:', error);
  return "An error occurred while accessing location services. Please try again.";
};
