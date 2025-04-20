
import { supabase } from '@/integrations/supabase/client';

const validateMapsKey = () => {
  const key = import.meta.env.VITE_TOMTOM_API_KEY;
  if (!key) {
    console.warn('Warning: Missing TomTom Maps API key');
    return false;
  }
  return true;
};

export const getMapThumbnailUrl = async (location: string): Promise<string> => {
  if (!location || !validateMapsKey()) return '';
  
  try {
    // Get coordinates from TomTom API
    const { data, error } = await supabase.functions.invoke('tomtom-geocode', {
      body: { query: location }
    });

    if (error || !data?.coordinates) {
      console.error('Error getting coordinates:', error);
      return '';
    }

    const { lat, lon } = data.coordinates;
    
    // Generate TomTom static map URL
    return `https://api.tomtom.com/map/1/staticimage?key=${import.meta.env.VITE_TOMTOM_API_KEY}&center=${lon},${lat}&zoom=15&width=300&height=200&format=png&layer=basic&style=main&marker=color:red|${lon},${lat}`;
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
