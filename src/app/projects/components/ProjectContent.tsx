import { cn } from "@/lib/utils";
import React from "react";

interface ProjectContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function ProjectContent({
  children,
  className,
  ...props
}: ProjectContentProps) {
  return (
    <div
      className={cn(
        "w-full max-w-site mx-auto px-8 md:px-12 py-24 md:py-32 flex flex-col gap-32 md:gap-48",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function ProjectSection({
  children,
  className,
  ...props
}: ProjectContentProps) {
  return (
    <div className={cn("flex flex-col gap-12", className)} {...props}>
      {children}
    </div>
  );
}

export function ProjectSectionContent({
  children,
  className,
  ...props
}: ProjectContentProps) {
  return (
    <div className={cn("flex flex-col gap-12", className)} {...props}>
      {children}
    </div>
  );
}

export function ProjectTextBlock({
  children,
  className,
  ...props
}: ProjectContentProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 w-full max-w-text-content mx-auto",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function ProjectHeading({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn(
        "text-4xl md:text-5xl text-zinc-900 font-sentient w-full max-w-text-content mx-auto",
        className
      )}
      {...props}
    >
      {children}
    </h2>
  );
}

export function ProjectSubHeading({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "text-xl font-semibold text-zinc-900 w-full max-w-text-content mx-auto",
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

export function ProjectText({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        "text-xl leading-relaxed text-zinc-700 w-full max-w-text-content mx-auto",
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
}
