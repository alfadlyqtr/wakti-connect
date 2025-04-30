
import React from "react";
import { cn } from "@/lib/utils";

interface SectionContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  noPadding?: boolean;
}

export const SectionContainer = ({
  children,
  className,
  noPadding = false,
  ...props
}: SectionContainerProps) => {
  return (
    <section
      className={cn("w-full", className)}
      {...props}
    >
      <div className={cn(
        "container mx-auto",
        !noPadding && "px-4 md:px-6 lg:px-8",
        "max-w-7xl"
      )}>
        {children}
      </div>
    </section>
  );
};

export default SectionContainer;
