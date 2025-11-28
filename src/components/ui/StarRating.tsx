import { cn } from "@/lib/utils";
import Image from "next/image";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  className?: string;
}

// Deterministic rotations for the 5 stars to ensure consistent rendering
const ROTATIONS = [12, -8, 5, 10, -15, 8];

export function StarRating({
  rating,
  maxRating = 5,
  className,
}: StarRatingProps) {
  return (
    <div className={cn("flex items-center", className)}>
      {Array.from({ length: maxRating }).map((_, index) => {
        // Calculate how much of this star should be filled (0 to 1)
        const fill = Math.max(0, Math.min(1, rating - index));

        const rotation = ROTATIONS[index % ROTATIONS.length];

        return (
          <div
            key={index}
            className="relative aspect-square w-full -ml-[3%] first:ml-0"
          >
            {/* Ghost Star (Background) */}
            <div
              className="absolute inset-0 opacity-20 grayscale"
              style={{ transform: `rotate(${rotation}deg)` }}
            >
              <Image
                src="/images/texture-icons/star.webp"
                alt=""
                fill
                className="object-contain py-[10%]"
                sizes="(max-width: 768px) 10vw, 5vw"
              />
            </div>

            {/* Filled Star (Foreground) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${fill * 100}%` }}
            >
              <div className="relative w-full h-full">
                <div
                  className="absolute top-0 left-0 h-full"
                  style={{
                    width: fill === 0 ? "100%" : `${(1 / fill) * 100}%`,
                    transform: `rotate(${rotation}deg)`,
                  }}
                >
                  <Image
                    src="/images/texture-icons/star.webp"
                    alt="Star"
                    fill
                    className="object-contain py-[10%]"
                  />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
