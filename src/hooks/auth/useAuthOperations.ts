
import { User } from "./types";
import { loginOperation, logoutOperation, registerOperation } from "./operations";

export function useAuthOperations(
  setUser: React.Dispatch<React.SetStateAction<User | null>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) {
  const login = async (email: string, password: string) => {
    return loginOperation(email, password, setIsLoading, setUser);
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
