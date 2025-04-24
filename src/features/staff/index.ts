
// Staff management feature barrel export
export { default as StaffDialog } from "@/components/staff/StaffDialog";
export { default as StaffSignupForm } from "./components/StaffSignupForm";
export { useStaffDialog } from "./hooks/useStaffDialog";

// Re-export inner components for cleaner imports
export * from "./components/dialog-fields";
export * from "./components/list";
