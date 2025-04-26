
import { authRepository, AuthRepository } from "../repositories/authRepository";
import { AuthUser, User } from "../types";
import { UserRole } from "@/types/roles";

/**
 * Service layer for authentication operations
 * Contains business logic related to authentication
 */
export class AuthService {
  private repository: AuthRepository;
  
  constructor(repository: AuthRepository) {
    this.repository = repository;
  }
  
  /**
   * Authenticates a user with email and password
   */
  async login(email: string, password: string): Promise<{ user: AuthUser | null; error: Error | null }> {
    const { data, error } = await this.repository.login(email, password);
    return { user: data, error };
  }
  
  /**
   * Signs out the current user
   */
  async logout(): Promise<{ error: Error | null }> {
    const { error } = await this.repository.logout();
    return { error };
  }
  
  /**
   * Registers a new user
   */
  async register(
    email: string, 
    password: string, 
    name?: string, 
    accountType: string = 'individual',
    businessName?: string
  ): Promise<{ user: AuthUser | null; error: Error | null }> {
    const { data, error } = await this.repository.register(email, password, name || "", accountType, businessName);
    return { user: data, error };
  }
  
  /**
   * Gets the current session
   */
  async getSession(): Promise<{ user: AuthUser | null; session: any; error: Error | null }> {
    const { data, error } = await this.repository.getSession();
    return { user: data?.user || null, session: data?.session || null, error };
  }
  
  /**
   * Determines if a user has a specific role
   */
  hasRole(user: AuthUser | null, role: UserRole): boolean {
    if (!user) return false;
    return user.effectiveRole === role;
  }
  
  /**
   * Determines if a user has access based on required roles
   */
  hasAccess(user: AuthUser | null, requiredRoles: UserRole[]): boolean {
    if (!user || !user.effectiveRole) return false;
    return requiredRoles.includes(user.effectiveRole);
  }
  
  /**
   * Gets the effective role for a user
   */
  async getEffectiveRole(userId: string, accountType?: string | null): Promise<UserRole> {
    const { data, error } = await this.repository.determineEffectiveRole(userId, accountType);
    if (error) {
      console.error("Error determining effective role:", error);
    }
    return data || "individual";
  }
}

export const authService = new AuthService(authRepository);
