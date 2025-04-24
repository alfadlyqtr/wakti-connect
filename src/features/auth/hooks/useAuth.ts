
// Re-export the auth hook from the original location
// This allows us to migrate gradually without breaking existing code
export { useAuth } from "@/hooks/auth";
export type { User, AuthContextType } from "@/hooks/auth/types";
