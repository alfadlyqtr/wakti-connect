
// Basic auth hook to provide user information
// This is a temporary solution until proper auth is implemented
export const useAuth = () => {
  // Mock user data for development purposes
  const user = { id: 'current-user-id', name: 'Current User' };
  
  return {
    user,
    isAuthenticated: true,
    isLoading: false,
    isLoggedIn: true // Add this property for backward compatibility
  };
};
