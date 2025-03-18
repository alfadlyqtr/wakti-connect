
import { useTranslation } from 'react-i18next';

/**
 * Hook to determine if the current language direction is RTL
 * @returns {boolean} True if the current language is RTL
 */
export function useRtl(): boolean {
  const { i18n } = useTranslation();
  return i18n.language === 'ar';
}

/**
 * Hook to get the current text direction
 * @returns {'rtl' | 'ltr'} Current text direction
 */
export function useDirection(): 'rtl' | 'ltr' {
  const { i18n } = useTranslation();
  return i18n.language === 'ar' ? 'rtl' : 'ltr';
}

/**
 * Hook to get directionally-aware class names
 * @returns Object with helper functions
 */
export function useRtlHelper() {
  const isRtl = useRtl();
  
  return {
    /**
     * Returns a different class based on direction
     * @param ltrClass - Class to use in LTR mode
     * @param rtlClass - Class to use in RTL mode
     */
    class: (ltrClass: string, rtlClass: string) => isRtl ? rtlClass : ltrClass,
    
    /**
     * Returns a different value based on direction
     * @param ltrValue - Value to use in LTR mode
     * @param rtlValue - Value to use in RTL mode
     */
    value: <T>(ltrValue: T, rtlValue: T) => isRtl ? rtlValue : ltrValue,
    
    /**
     * Returns the base direction string
     */
    dir: isRtl ? 'rtl' : 'ltr',
    
    /**
     * Returns whether the current language is RTL
     */
    isRtl
  };
}
