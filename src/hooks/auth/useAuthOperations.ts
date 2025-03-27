
import { User } from "./types";
import { loginOperation, logoutOperation, registerOperation } from "./operations";

export function useAuthOperations(
  setUser: React.Dispatch<React.SetStateAction<User | null>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) {
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const result = await loginOperation(email, password, setIsLoading, setUser);
      return result; // Return the result for components that need it
    } catch (error) {
      // Ensure we're no longer in loading state if there's an error
      setIsLoading(false);
      // Rethrow the error so it can be caught by callers
      throw error;
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
    name: string, 
    accountType: string = 'free', 
    businessName?: string
  ) => {
    try {
      setIsLoading(true);
      await registerOperation(email, password, name, accountType, businessName, setIsLoading, setUser);
    } catch (error) {
      // Ensure we're no longer in loading state if there's an error
      setIsLoading(false);
      throw error;
    }
  };

  return { login, logout, register };
}
