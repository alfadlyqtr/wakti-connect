
import { User } from "./types";
import { loginOperation, logoutOperation, registerOperation } from "./operations";

export function useAuthOperations(
  setUser: React.Dispatch<React.SetStateAction<User | null>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) {
  const login = async (email: string, password: string) => {
    try {
      const result = await loginOperation(email, password, setIsLoading, setUser);
      return result; // Return the result for components that need it
    } catch (error) {
      // Rethrow the error so it can be caught by callers
      throw error;
    }
  };

  const logout = async () => {
    return logoutOperation(setIsLoading, setUser);
  };

  const register = async (
    email: string, 
    password: string, 
    name: string, 
    accountType: string = 'free', 
    businessName?: string
  ) => {
    return registerOperation(email, password, name, accountType, businessName, setIsLoading, setUser);
  };

  return { login, logout, register };
}
