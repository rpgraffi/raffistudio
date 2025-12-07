import Image from "next/image";

interface IPhoneFrameProps {
  src: string;
  alt: string;
  className?: string;
}

export function IPhoneFrame({ src, alt, className = "" }: IPhoneFrameProps) {
  return (
    <div
      className={`relative h-full w-auto aspect-430/932 rounded-[52px] border-4 border-zinc-700 overflow-hidden ${className}`}
      style={{
        // @ts-expect-error -- corner-shape is not yet in CSSProperties
        cornerShape: "superellipse(1.6)",
      }}
    >
      {/* Dynamic Island */}
      <div className="absolute top-2.5 inset-x-0 flex justify-center z-10 pointer-events-none">
        <div className="w-[72px] h-[22px] bg-zinc-800 rounded-full" />
      </div>

      {/* Screen Image */}
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 50vw, 33vw"
      />

      {/* Home Indicator */}
      <div className="absolute bottom-2 inset-x-0 flex justify-center z-10 pointer-events-none">
        <div className="w-[80px] h-[3px] bg-zinc-800/80 rounded-full" />
      </div>
    </div>
  );
}
