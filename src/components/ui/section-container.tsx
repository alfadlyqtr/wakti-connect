
import React from "react";
import { cn } from "@/lib/utils";

interface SectionContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
  fullWidth?: boolean;
}

const SectionContainer = ({
  children,
  className,
  as: Component = "section",
  fullWidth = false,
  ...props
}: SectionContainerProps) => {
  return (
    <Component 
      className={cn("py-16 md:py-24 px-4", className)} 
      {...props}
    >
      <div className={cn(
        fullWidth ? "w-full" : "container mx-auto max-w-5xl",
      )}>
        {children}
      </div>
    </Component>
  );
};

export { SectionContainer };
