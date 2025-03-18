
import { useRtl } from "@/hooks/useRtl";

/**
 * Helper function to get the correct order based on the current text direction
 * @param field The field to order by
 * @param ltrOrder The order to use in LTR mode ('asc' or 'desc')
 * @returns The order object to use in Supabase queries
 */
export function getRtlAwareOrder(field: string, ltrOrder: 'asc' | 'desc' = 'asc') {
  const isRtl = document.documentElement.dir === 'rtl';
  const rtlOrder = ltrOrder === 'asc' ? 'desc' : 'asc';
  
  return { [field]: isRtl ? rtlOrder : ltrOrder };
}

/**
 * React hook version of getRtlAwareOrder
 * @param field The field to order by
 * @param ltrOrder The order to use in LTR mode ('asc' or 'desc')
 * @returns The order object to use in Supabase queries
 */
export function useRtlAwareOrder(field: string, ltrOrder: 'asc' | 'desc' = 'asc') {
  const isRtl = useRtl();
  const rtlOrder = ltrOrder === 'asc' ? 'desc' : 'asc';
  
  return { [field]: isRtl ? rtlOrder : ltrOrder };
}

/**
 * Helper function to RTL-aware text alignment
 * @returns CSS class for text alignment based on current direction
 */
export function getTextAlignClass() {
  return document.documentElement.dir === 'rtl' ? 'text-right' : 'text-left';
}

/**
 * Helper to get RTL-aware positioning classes
 */
export function getRtlPositionClasses() {
  const isRtl = document.documentElement.dir === 'rtl';
  
  return {
    left: isRtl ? 'right' : 'left',
    right: isRtl ? 'left' : 'right',
    start: isRtl ? 'end' : 'start',
    end: isRtl ? 'start' : 'end',
    marginLeft: isRtl ? 'mr' : 'ml',
    marginRight: isRtl ? 'ml' : 'mr',
    paddingLeft: isRtl ? 'pr' : 'pl',
    paddingRight: isRtl ? 'pl' : 'pr',
  };
}
