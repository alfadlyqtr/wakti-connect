
// Global type declarations
interface Window {
  WAKTI_DEBUG: boolean;
  google?: {
    maps?: {
      places?: {
        Autocomplete: new (
          input: HTMLInputElement,
          options?: any
        ) => google.maps.places.Autocomplete;
      };
      Map?: any;
    };
    translate?: {
      TranslateElement: any;
    };
  };
  googleTranslateElementInit?: () => void;
}

// This helps avoid conflicts with LocationPicker and other components
interface GoogleMapsPlaceAutocomplete {
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
    url?: string;
  };
}

// Make google namespace available globally for Maps components
declare namespace google {
  namespace maps {
    namespace places {
      interface Autocomplete extends GoogleMapsPlaceAutocomplete {}
    }
  }
}
