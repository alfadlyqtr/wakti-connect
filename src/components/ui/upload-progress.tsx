
import * as React from "react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";

interface UploadProgressProps {
  progress: number;
  isUploading: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const UploadProgress = React.forwardRef<
  HTMLDivElement,
  UploadProgressProps
>(({ progress, isUploading, className, size = "md" }, ref) => {
  const heightClass = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3"
  }[size];

  if (!isUploading) return null;

  return (
    <div 
      ref={ref} 
      className={cn("space-y-1 w-full", className)}
    >
      {progress < 100 ? (
        <>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Uploading...</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className={cn(heightClass)} />
        </>
      ) : (
        <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
          <Loader2 className="h-3 w-3 animate-spin" />
          <span>Processing...</span>
        </div>
      )}
    </div>
  );
});

UploadProgress.displayName = "UploadProgress";
