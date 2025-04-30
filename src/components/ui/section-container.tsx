
import React from "react";
import { cn } from "@/lib/utils";

interface SectionContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
  fullWidth?: boolean;
  noPadding?: boolean;
}

const SectionContainer = ({
  children,
  className,
  as: Component = "section",
  fullWidth = false,
  noPadding = false,
  ...props
}: SectionContainerProps) => {
  return (
    <Component 
      className={cn(
        noPadding ? "" : "py-8 sm:py-12 md:py-16 px-4", 
        className
      )} 
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
