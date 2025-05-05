
import { User } from "../types";
import { loginOperation, logoutOperation, registerOperation } from "../operations";

export function useAuthOperations(
  setUser: React.Dispatch<React.SetStateAction<User | null>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) {
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const result = await loginOperation(email, password, setIsLoading, setUser);
      return { error: null, ...result };
    } catch (error: any) {
      // Ensure we're no longer in loading state if there's an error
      setIsLoading(false);
      // Return the error in the expected format
      return { error };
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await logoutOperation(setIsLoading, setUser);
    } catch (error) {
      // Ensure we're no longer in loading state if there's an error
      setIsLoading(false);
      throw error;
    }
  };

  const register = async (
    email: string, 
    password: string, 
    name?: string, 
    accountType: "free" | "individual" | "business" | "staff" | "super-admin" = 'free', 
    businessName?: string
  ) => {
    try {
      setIsLoading(true);
      const result = await registerOperation(email, password, name || "", accountType, businessName, setIsLoading, setUser);
      return { error: null, data: result };
    } catch (error: any) {
      // Ensure we're no longer in loading state if there's an error
      setIsLoading(false);
      return { error };
    }
  };

  return { login, logout, register };
}
