
import React, { Component, ErrorInfo, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({
      errorInfo
    });
    
    // Log auth status for debugging
    this.checkAuthStatus().catch(console.error);
  }
  
  private async checkAuthStatus() {
    try {
      const { data } = await supabase.auth.getSession();
      console.log("Auth status during error:", data.session ? "Logged in" : "Not logged in");
    } catch (e) {
      console.error("Failed to check auth status:", e);
    }
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback || (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
          <h2 className="text-2xl font-bold text-destructive mb-4">Something went wrong</h2>
          <p className="text-muted-foreground mb-4">
            The application encountered an error. Please try refreshing the page.
          </p>
          <pre className="bg-muted p-4 rounded-md overflow-auto max-w-full max-h-[200px] text-sm">
            {this.state.error?.toString()}
          </pre>
          {this.state.errorInfo && (
            <details className="mt-2 text-sm">
              <summary className="cursor-pointer text-muted-foreground">Component Stack</summary>
              <pre className="bg-muted p-4 rounded-md overflow-auto max-w-full max-h-[200px] mt-2">
                {this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
          <div className="flex gap-4 mt-4">
            <button
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </button>
            <button
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md"
              onClick={() => window.location.href = "/auth/login"}
            >
              Return to Login
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
