"use client";

import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import React from "react";
import { IPhoneFrame } from "./IPhoneFrame";

interface IPhoneCarouselProps {
  images: { src: string; alt: string }[];
  className?: string;
  phoneClassName?: string;
}

export const IPhoneCarousel: React.FC<IPhoneCarouselProps> = ({
  images,
  className = "",
  phoneClassName = "",
}) => {
  const [emblaRef] = useEmblaCarousel(
    {
      align: "center",
      dragFree: true,
      skipSnaps: false,
      loop: true,
    },
    [Autoplay({ delay: 3000, stopOnInteraction: false })]
  );

  return (
    <div className={`w-full ${className}`}>
      <div
        className="overflow-hidden h-[55vh] md:h-auto [mask-image:linear-gradient(to_bottom,black_60%,transparent)] md:[mask-image:none]"
        ref={emblaRef}
      >
        <div className="flex items-start md:items-center">
          {images.map((image, index) => (
            <div
              key={index}
              className="shrink-0 grow-0 basis-[70%] md:basis-auto pl-4 md:pl-8 min-w-0"
            >
              <IPhoneFrame
                src={image.src}
                alt={image.alt}
                className={`w-full h-auto md:w-auto md:h-[500px] ${phoneClassName}`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
