
/// <reference types="vite/client" />

// Google Maps types
declare namespace google {
  namespace maps {
    namespace places {
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
        };
      }
    }
  }
}
