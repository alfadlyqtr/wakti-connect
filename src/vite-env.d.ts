
/// <reference types="vite/client" />

// Google Maps types
declare namespace google {
  namespace maps {
    class Geocoder {
      geocode(
        request: GeocodeRequest,
        callback: (results: GeocoderResult[] | null, status: GeocoderStatus) => void
      ): void;
    }

    interface GeocodeRequest {
      location?: { lat: number; lng: number };
      address?: string;
    }

    interface GeocoderResult {
      formatted_address: string;
      geometry: {
        location: {
          lat(): number;
          lng(): number;
        };
      };
      address_components?: AddressComponent[];
      place_id?: string;
    }

    interface AddressComponent {
      long_name: string;
      short_name: string;
      types: string[];
    }

    type GeocoderStatus = 'OK' | 'ZERO_RESULTS' | 'OVER_QUERY_LIMIT' | 'REQUEST_DENIED' | 'INVALID_REQUEST' | 'UNKNOWN_ERROR';

    namespace places {
      interface AutocompleteOptions {
        fields?: string[];
        types?: string[];
        componentRestrictions?: {
          country: string | string[];
        };
      }
      
      interface Autocomplete {
        addListener: (event: string, callback: () => void) => void;
        getPlace: () => {
          formatted_address?: string;
          geometry?: {
            location?: {
              lat: () => number;
              lng: () => number;
            };
          };
          name?: string;
          place_id?: string;
        };
      }
    }
  }
}

// Add proper typing for import.meta.env
interface ImportMeta {
  readonly env: {
    readonly VITE_GOOGLE_MAPS_API_KEY: string;
    readonly [key: string]: string;
  };
}
