
import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { User, AuthContextType } from "./types";
import { useAuthOperations } from "./useAuthOperations";
import { supabase } from "@/integrations/supabase/client";
import AuthLoadingState from "@/components/auth/AuthLoadingState";
import AuthErrorState from "@/components/auth/AuthErrorState";

// Debounce function to limit rapid auth state changes
const debounce = (func: Function, wait: number) => {
  let timeout: number | null = null;
  return (...args: any[]) => {
    if (timeout) {
      window.clearTimeout(timeout);
    }
    timeout = window.setTimeout(() => {
      func(...args);
    }, wait);
  };
};

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => { return { error: new Error("Auth context not initialized") }; },
  logout: async () => { throw new Error("Auth context not initialized"); },
  register: async () => { return { error: new Error("Auth context not initialized") }; },
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  
  // Track the last auth state change
  const lastAuthUpdateRef = useRef<number>(0);
  // Use a flag to track initial setup
  const isInitializedRef = useRef<boolean>(false);
  
  // Set up authentication on mount
  useEffect(() => {
    let isMounted = true;
    
    const initialize = async () => {
      try {
        console.log("Initializing auth context");
        
        // Create a debounced user update function to prevent rapid state changes
        const debouncedSetUser = debounce((newUser: User | null, event: string) => {
          if (!isMounted) return;
          
          console.log(`Debounced auth state update (${event}):`, {
            hasUser: !!newUser,
            userId: newUser?.id || 'none',
            timeSinceLastUpdate: Date.now() - lastAuthUpdateRef.current
          });
          
          // Update last change timestamp
          lastAuthUpdateRef.current = Date.now();
          
          // Skip setting user to null if we're already loading
          if (!newUser && isLoading && !isInitializedRef.current) {
            console.log("Skipping null user update during initial loading");
            return;
          }
          
          setUser(newUser);
        }, 300); // 300ms debounce to avoid rapid state changes
        
        // First set up the auth listener to catch any auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, session) => {
            if (!isMounted) return;
            
            console.log("Auth state changed:", event, {
              hasSession: !!session,
              userId: session?.user?.id || 'none'
            });
            
            if (session) {
              debouncedSetUser({
                ...session.user,
                name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || '',
                displayName: session.user.user_metadata?.display_name || session.user.user_metadata?.full_name || '',
                plan: session.user.user_metadata?.account_type || 'free'
              }, event);
            } else if (event === 'SIGNED_OUT') {
              debouncedSetUser(null, event);
            }
            
            // Don't set loading false on every auth change, only on SIGNED_OUT or INITIAL_SESSION
            if (event === 'SIGNED_OUT' || event === 'INITIAL_SESSION') {
              setIsLoading(false);
            }
          }
        );
        
        // Then check for existing session
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session check error:", error);
          setAuthError(error.message);
          setIsLoading(false);
          return;
        }
        
        if (data?.session) {
          console.log("Found existing session for user:", data.session.user.id);
          debouncedSetUser({
            ...data.session.user,
            name: data.session.user.user_metadata?.full_name || data.session.user.email?.split('@')[0] || '',
            displayName: data.session.user.user_metadata?.display_name || data.session.user.user_metadata?.full_name || '',
            plan: data.session.user.user_metadata?.account_type || 'free'
          }, 'INITIAL_SESSION');
        } else {
          console.log("No session found");
        }
        
        // Always set loading to false to not block rendering
        setIsLoading(false);
        isInitializedRef.current = true;
        
        return () => {
          isMounted = false;
          subscription.unsubscribe();
        };
      } catch (error: any) {
        console.error("Unexpected error initializing auth:", error);
        if (isMounted) {
          setAuthError(error.message || "Failed to initialize authentication");
          setIsLoading(false);
        }
      }
    };
    
    initialize();
    
    return () => {
      isMounted = false;
    };
  }, [isLoading]);
  
  // Use the auth operations hook for login, logout, register functions
  const { login, logout, register } = useAuthOperations(setUser, setIsLoading);

  // Show loading state while initializing
  if (isLoading && !isInitializedRef.current) {
    return <AuthLoadingState authError={authError} />;
  }
  
  // Show error state if initialization failed
  if (authError) {
    return <AuthErrorState authError={authError} />;
  }
  
  // Provide the auth context value
  const contextValue: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    register,
  };

  // Render children without blocking, even when auth is still loading
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    console.error("useAuth must be used within an AuthProvider");
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
