
// Staff limits placeholder - functionality removed
export const STAFF_PLAN_LIMITS = {
  free: 0,
  individual: 0,
  business: 0
};

export const CO_ADMIN_LIMIT = 0;

export async function checkStaffLimits(): Promise<{ canAdd: boolean; message?: string }> {
  return { canAdd: false, message: "Staff management has been removed" };
}

export async function checkCoAdminLimit(): Promise<boolean> {
  return false;
}
