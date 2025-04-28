
import { useState, useCallback } from 'react';
import { toast } from '@/components/ui/use-toast';
import { useDebouncedCallback } from '@/hooks/useDebouncedCallback';

interface LocationResult {
  display_name: string;
  lat: number;
  lon: number;
}

export const useLocationSearch = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<LocationResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  const debouncedSearch = useDebouncedCallback(async (query: string) => {
    if (!query?.trim()) {
      setSearchResults([]);
      setError(null);
      return;
    }

    setIsSearching(true);
    setError(null);

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
      
      if (Array.isArray(data)) {
        setSearchResults(
          data.map((item: any) => ({
            display_name: item.display_name,
            lat: parseFloat(item.lat),
            lon: parseFloat(item.lon),
          }))
        );
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error searching location:', error);
      setError('Failed to search location');
      setSearchResults([]);
      toast({
        title: 'Error',
        description: 'Failed to search location. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSearching(false);
    }
  }, 300);

  const searchLocation = useCallback((query: string) => {
    debouncedSearch(query);
  }, [debouncedSearch]);

  return {
    searchLocation,
    searchResults,
    isSearching,
    error
  };
};
