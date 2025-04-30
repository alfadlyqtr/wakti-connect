
import React from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  subtitle: string;
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  centered?: boolean;
}

export function SectionHeading({
  title,
  subtitle,
  className,
  titleClassName,
  subtitleClassName,
  centered = true,
}: SectionHeadingProps) {
  return (
    <div className={cn(
      "mb-10",
      centered && "text-center",
      className
    )}>
      <h2 className={cn(
        "text-3xl font-bold tracking-tight mb-3",
        titleClassName
      )}>
        {title}
      </h2>
      <p className={cn(
        "text-muted-foreground text-lg max-w-3xl",
        centered && "mx-auto",
        subtitleClassName
      )}>
        {subtitle}
      </p>
    </div>
  );
}
