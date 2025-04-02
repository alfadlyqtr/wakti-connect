
import { cn } from "@/lib/utils";
import React from "react";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

const Container = ({
  className,
  children,
  size = "lg",
  ...props
}: ContainerProps) => {
  const sizeClass = {
    "sm": "max-w-3xl",
    "md": "max-w-4xl",
    "lg": "max-w-6xl",
    "xl": "max-w-7xl",
    "full": "max-w-full",
  }[size];

  return (
    <div
      className={cn(
        "mx-auto w-full px-4 sm:px-6",
        sizeClass,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Container;
