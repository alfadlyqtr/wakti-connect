
/// <reference types="vite/client" />

// Google Maps types
declare namespace google {
  namespace maps {
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
