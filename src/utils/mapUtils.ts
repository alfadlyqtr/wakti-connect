
const validateMapsKey = () => {
  const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  if (!key) {
    console.warn('Warning: Missing Google Maps API key');
    return false;
  }
  return true;
};

export const getMapThumbnailUrl = (location: string): string => {
  if (!location || !validateMapsKey()) return '';
  
  try {
    const encodedLocation = encodeURIComponent(location);
    return `https://maps.googleapis.com/maps/api/staticmap?center=${encodedLocation}&zoom=15&size=300x200&scale=2&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&markers=color:red%7C${encodedLocation}&style=feature:all|element:labels|visibility:on`;
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
