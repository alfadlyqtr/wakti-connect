
import { authService } from "../../domain/services/authService";
import { User } from "../../domain/types";

export function useAuthOperations(
  setUser: React.Dispatch<React.SetStateAction<User | null>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) {
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { user, error } = await authService.login(email, password);
      
      if (!error && user) {
        setUser(user);
      }
      
      return { error, data: user };
    } catch (error: any) {
      // Ensure we're no longer in loading state if there's an error
      setIsLoading(false);
      // Return the error in the expected format
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      const { error } = await authService.logout();
      
      if (!error) {
        setUser(null);
      } else {
        throw error;
      }
    } catch (error) {
      // Ensure we're no longer in loading state if there's an error
      setIsLoading(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    email: string, 
    password: string, 
    name?: string, 
    accountType: string = 'individual', 
    businessName?: string
  ) => {
    try {
      setIsLoading(true);
      const { user, error } = await authService.register(
        email, 
        password, 
        name || "", 
        accountType, 
        businessName
      );
      
      if (!error && user) {
        setUser(user);
      }
      
      return { error, data: user };
    } catch (error: any) {
      // Ensure we're no longer in loading state if there's an error
      setIsLoading(false);
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  return { login, logout, register };
}
