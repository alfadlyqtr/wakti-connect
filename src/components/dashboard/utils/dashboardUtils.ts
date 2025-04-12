
import { UserRole } from "@/types/user";

/**
 * Maps the user role for components that don't yet support super-admin
 */
export function mapRoleForCompatibility(role: UserRole): "free" | "individual" | "business" | "staff" {
  if (role === 'super-admin') return 'business';
  return role as "free" | "individual" | "business" | "staff";
}

/**
 * Determines if the upgrade banner should be shown based on user role
 */
export function shouldShowUpgradeBanner(
  accountType: string | undefined,
  isStaff: boolean,
  userRoleValue: UserRole
): boolean {
  return accountType === 'free' && !isStaff && userRoleValue !== 'business' && userRoleValue !== 'super-admin';
}
