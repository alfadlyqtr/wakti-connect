
import { supabase } from "@/integrations/supabase/client";
import { AuthUser } from "../types";
import { UserRole } from "@/types/roles";

export interface AuthRepositoryResult<T> {
  data: T | null;
  error: Error | null;
}

/**
 * Repository for authentication operations
 * Encapsulates all interactions with the authentication provider
 */
export class AuthRepository {
  /**
   * Authenticates a user with email and password
   */
  async login(email: string, password: string): Promise<AuthRepositoryResult<AuthUser>> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        return { data: null, error: new Error(error.message) };
      }

      return { 
        data: data.user as unknown as AuthUser, 
        error: null 
      };
    } catch (error: any) {
      return { data: null, error };
    }
  }

  /**
   * Signs out the current user
   */
  async logout(): Promise<AuthRepositoryResult<null>> {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        return { data: null, error: new Error(error.message) };
      }
      
      return { data: null, error: null };
    } catch (error: any) {
      return { data: null, error };
    }
  }

  /**
   * Registers a new user
   */
  async register(
    email: string, 
    password: string, 
    name: string = "", 
    accountType: string = 'individual',
    businessName?: string
  ): Promise<AuthRepositoryResult<AuthUser>> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            account_type: accountType,
            business_name: businessName || null
          }
        }
      });

      if (error) {
        return { data: null, error: new Error(error.message) };
      }

      return { 
        data: data.user as unknown as AuthUser, 
        error: null 
      };
    } catch (error: any) {
      return { data: null, error };
    }
  }

  /**
   * Gets the current session
   */
  async getSession(): Promise<AuthRepositoryResult<{user: AuthUser | null, session: any}>> {
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        return { data: null, error: new Error(error.message) };
      }
      
      return { 
        data: {
          user: data.session?.user as unknown as AuthUser || null,
          session: data.session
        }, 
        error: null 
      };
    } catch (error: any) {
      return { data: null, error };
    }
  }
  
  /**
   * Determines the effective role of a user
   */
  async determineEffectiveRole(
    userId: string,
    accountType?: string | null
  ): Promise<AuthRepositoryResult<UserRole>> {
    try {
      // Check if superadmin
      if (localStorage.getItem('isSuperAdmin') === 'true') {
        return { data: 'superadmin', error: null };
      }
      
      // Check in database if user is superadmin
      const { data: superAdminData } = await supabase
        .from('super_admins')
        .select('id')
        .eq('id', userId)
        .maybeSingle();
      
      if (superAdminData) {
        localStorage.setItem('isSuperAdmin', 'true');
        return { data: 'superadmin', error: null };
      } else {
        localStorage.setItem('isSuperAdmin', 'false');
      }
      
      // Check if staff
      const { data: staffData } = await supabase
        .from('business_staff')
        .select('id, permissions, business_id, role')
        .eq('staff_id', userId)
        .eq('status', 'active')
        .maybeSingle();
      
      if (staffData) {
        return { data: 'staff', error: null };
      }
      
      // If not staff or superadmin, use account type
      if (accountType === 'business') {
        return { data: 'business', error: null };
      } else {
        // Default to individual
        return { data: 'individual', error: null };
      }
    } catch (error: any) {
      return { data: 'individual', error }; // Default to individual role on error
    }
  }
}

export const authRepository = new AuthRepository();
