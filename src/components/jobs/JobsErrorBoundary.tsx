
import React, { ErrorInfo, Component, ReactNode } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallbackComponent?: ReactNode;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class JobsErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Job cards error caught by boundary:", error);
    console.error("Component stack:", errorInfo.componentStack);
  }

  resetErrorBoundary = (): void => {
    if (this.props.onReset) {
      this.props.onReset();
    }
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallbackComponent) {
        return this.props.fallbackComponent;
      }

      return (
        <div className="p-4 border rounded-md">
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Something went wrong in the job cards system</AlertTitle>
            <AlertDescription>
              {this.state.error?.message || "An unexpected error occurred"}
            </AlertDescription>
          </Alert>
          <div className="flex justify-center">
            <Button onClick={this.resetErrorBoundary} variant="outline">
              Try again
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default JobsErrorBoundary;
