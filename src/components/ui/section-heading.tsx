
import React from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
  subtitleClassName?: string;
}

const SectionHeading = ({
  title,
  subtitle,
  centered = true,
  className,
  subtitleClassName,
}: SectionHeadingProps) => {
  return (
    <div className={cn(
      "mb-8 sm:mb-12",
      centered && "text-center",
      "animate-fade-in",
      className
    )}>
      <h2 className={cn(
        "text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-4",
        centered && "mx-auto max-w-3xl"
      )}>
        {title}
      </h2>
      {subtitle && (
        <p className={cn(
          "text-base sm:text-lg text-muted-foreground",
          centered && "max-w-2xl mx-auto",
          subtitleClassName
        )}>
          {subtitle}
        </p>
      )}
    </div>
  );
};

export { SectionHeading };
