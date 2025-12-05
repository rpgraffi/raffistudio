"use client";

import DrawingHeadline from "@/components/natural-ui/DrawingHeadline";
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
        "w-full max-w-site mx-auto px-8 md:px-12 py-24 md:py-32 flex flex-col gap-24 md:gap-32",
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
    <div className={cn("flex flex-col gap-8", className)} {...props}>
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

interface ProjectHeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  animated?: boolean;
  viewThreshold?: number;
}

export function ProjectHeading({
  children,
  className,
  animated = true,
  viewThreshold = 0.2,
  ...props
}: ProjectHeadingProps) {
  if (animated) {
    return (
      <h2
        className={cn(
          "text-4xl md:text-5xl text-zinc-900 font-sentient w-full max-w-text-content mx-auto",
          className
        )}
        {...props}
      >
        <DrawingHeadline
          as="span"
          triggerOnView={true}
          viewThreshold={viewThreshold}
          showGrid={true}
          gridColor="rgba(0,0,0,0.1)"
        >
          {children}
        </DrawingHeadline>
      </h2>
    );
  }

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
