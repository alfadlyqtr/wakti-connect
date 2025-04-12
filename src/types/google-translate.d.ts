
// Type definitions for Google Translate API
interface GoogleTranslateElementInit {
  new (config: GoogleTranslateElementConfig, element: string): void;
}

interface GoogleTranslateElementConfig {
  pageLanguage: string;
  includedLanguages?: string;
  layout?: string;
  autoDisplay?: boolean;
  gaTrack?: boolean;
  gaId?: string;
}

interface GoogleTranslateInterface {
  translate: {
    TranslateElement: GoogleTranslateElementInit;
  };
}

// Extend the global Google namespace
declare namespace google {
  interface google {
    translate: {
      TranslateElement: GoogleTranslateElementInit;
    };
    maps: {
      places: {
        Autocomplete: new (
          input: HTMLInputElement,
          options?: any
        ) => google.maps.places.Autocomplete;
      };
      Map: any;
    };
  }
}

// Extend the Window interface to include Google properties
declare global {
  interface Window {
    google?: {
      translate?: {
        TranslateElement: GoogleTranslateElementInit;
      };
      maps?: {
        places?: {
          Autocomplete: new (
            input: HTMLInputElement,
            options?: any
          ) => google.maps.places.Autocomplete;
        };
        Map?: any;
      };
    };
    googleTranslateElementInit?: () => void;
  }
}

export {};
