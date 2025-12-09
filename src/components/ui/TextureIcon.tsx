import Image from "next/image";

interface TextureIconProps {
  /** The URL/path to the icon image */
  src: string;
  /** Alt text for the icon */
  alt?: string;
  /** Optional className for additional styling */
  className?: string;
  /** Size multiplier relative to font size (default: 1) */
  scale?: number;
}

/**
 * Inline icon that scales with the font size.
 * Wrapped in a span so it can be used inline with text.
 *
 * @example
 * <p>Built with <TextureIcon src="/images/texture-icons/react.webp" /> React</p>
 */
export function TextureIcon({
  src,
  alt = "",
  className = "",
  scale = 1.1,
}: TextureIconProps) {
  return (
    <span
      className={`inline-flex items-center justify-center align-middle ${className}`}
      style={{
        width: `${scale}em`,
        height: `${scale}em`,
        position: "relative",
        verticalAlign: "middle",
      }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-contain"
        sizes={`${scale}em`}
      />
    </span>
  );
}

export default TextureIcon;
