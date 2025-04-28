
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';

interface LocationResult {
  display_name: string;
  lat: number;
  lon: number;
}

export const useLocationSearch = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<LocationResult[]>([]);

  const searchLocation = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&limit=5`,
        {
          headers: {
            'Accept-Language': 'en',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch location data');
      }

      const data = await response.json();
      setSearchResults(
        data.map((item: any) => ({
          display_name: item.display_name,
          lat: parseFloat(item.lat),
          lon: parseFloat(item.lon),
        }))
      );
    } catch (error) {
      console.error('Error searching location:', error);
      toast({
        title: 'Error',
        description: 'Failed to search location. Please try again.',
        variant: 'destructive',
      });
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  return {
    searchLocation,
    searchResults,
    isSearching,
  };
};
