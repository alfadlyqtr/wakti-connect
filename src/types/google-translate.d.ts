
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

declare global {
  interface Window {
    google?: {
      translate: {
        TranslateElement: GoogleTranslateElementInit;
      };
    };
    googleTranslateElementInit?: () => void;
  }
}

export {};
