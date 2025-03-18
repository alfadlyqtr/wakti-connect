
import React, { Component, ErrorInfo, ReactNode } from "react";

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
          <details className="mb-4 w-full max-w-3xl">
            <summary className="cursor-pointer font-medium">View Error Details</summary>
            <pre className="mt-2 bg-muted p-4 rounded-md overflow-auto max-w-full text-sm">
              {this.state.error?.toString()}
            </pre>
            {this.state.errorInfo && (
              <pre className="mt-2 bg-muted p-4 rounded-md overflow-auto max-w-full text-sm">
                {this.state.errorInfo.componentStack}
              </pre>
            )}
          </details>
          <button
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md"
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
