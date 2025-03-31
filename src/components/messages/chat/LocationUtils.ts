
export const generateLocationMessage = (locationValue: string, mapsUrl: string): string => {
  return `📍 ${locationValue}\n${mapsUrl}`;
};

export const isLocationMessage = (message: string): boolean => {
  return message.startsWith('📍') && message.includes('maps.google.com');
};

export const parseLocationMessage = (message: string): { locationName: string, mapsUrl: string } | null => {
  const lines = message.split('\n');
  if (lines.length !== 2) return null;
  
  const locationName = lines[0].replace('📍 ', '');
  const mapsUrl = lines[1];
  
  return { locationName, mapsUrl };
};
