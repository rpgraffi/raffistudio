import { cn } from "@/lib/utils";
import Image, { ImageProps } from "next/image";

interface ImageFrameProps extends Omit<ImageProps, "className"> {
  description?: string;
  className?: string;
  imageClassName?: string;
}

export function ImageFrame({
  description,
  className,
  imageClassName,
  alt,
  ...props
}: ImageFrameProps) {
  return (
    <div className={cn("relative inline-block py-4", className)}>
      <Image
        alt={alt}
        className={cn("w-full h-auto block", imageClassName)}
        {...props}
      />

      {/* Optional description */}
      {description && (
        <p className="mt-4 text-sm text-zinc-500 text-center font-mono">
          {description}
        </p>
      )}
    </div>
  );
}
