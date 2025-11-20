"use client";

import React, {
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

interface PencilStrokeProps {
  className?: string;
  width?: number;
  height?: number;
  color?: string;
  strokeWidth?: number;
  deviation?: number;
  frequency?: number;
  opacity?: number;
  seed?: number;
  as?: React.ElementType;
}

// Simple Linear Congruential Generator for stable random numbers
const createLCG = (seed: number) => {
  const m = 2147483648;
  const a = 1103515245;
  const c = 12345;
  let state = seed;

  return () => {
    state = (a * state + c) % m;
    return state / m;
  };
};

const stringToSeed = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
};

// Dumb SVG component that just renders the stroke for a given width
const PencilStrokeRenderer: React.FC<PencilStrokeProps & { id: string }> = ({
  width = 200,
  height = 10,
  color = "currentColor",
  strokeWidth = 2,
  deviation = 1,
  frequency = 0.05,
  opacity = 0.8,
  seed,
  id,
  className,
  as: Component = "span",
  ...props
}) => {
  const effectiveSeed = useMemo(() => {
    return seed ?? stringToSeed(id);
  }, [seed, id]);

  const pathD = useMemo(() => {
    if (width <= 0) return "";
    const segments = Math.max(2, Math.floor(width * frequency));
    const points: [number, number][] = [];

    const random = createLCG(effectiveSeed);

    const centerY = height / 2;

    points.push([0, centerY]);

    for (let i = 1; i < segments; i++) {
      const x = (i / segments) * width;
      const yOffset = (random() - 0.5) * 2 * deviation;
      points.push([x, centerY + yOffset]);
    }

    points.push([width, centerY]);

    let d = `M ${points[0][0]} ${points[0][1]}`;

    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];

      const cp1x = prev[0] + (curr[0] - prev[0]) / 3;
      const cp1y = prev[1];
      const cp2x = prev[0] + (2 * (curr[0] - prev[0])) / 3;
      const cp2y = curr[1];

      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr[0]} ${curr[1]}`;
    }

    return d;
  }, [width, height, deviation, frequency, effectiveSeed]);

  if (width <= 0) return null;

  return (
    <Component
      className={className}
      style={{
        width,
        height,
        display: "inline-flex",
        alignItems: "center",
        overflow: "visible",
        verticalAlign: "middle",
        ...(props as any).style,
      }}
    >
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: "visible", display: "block" }}
      >
        <defs>
          <filter
            id={`${id}-pencil`}
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.8"
              numOctaves="3"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="2"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>

        <path
          d={pathD}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          filter={`url(#${id}-pencil)`}
          opacity={opacity}
        />

        <path
          d={pathD}
          stroke={color}
          strokeWidth={strokeWidth * 0.6}
          strokeLinecap="round"
          strokeLinejoin="round"
          filter={`url(#${id}-pencil)`}
          opacity={opacity * 0.6}
          style={{ transform: "translateY(0.5px)" }}
        />
      </svg>
    </Component>
  );
};

// Smart wrapper that handles responsive width if width prop is missing
export const PencilStroke: React.FC<PencilStrokeProps> = (props) => {
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);
  const [measuredWidth, setMeasuredWidth] = useState(props.width ?? 0);

  useEffect(() => {
    if (props.width !== undefined) return;

    const element = ref.current;
    if (!element) return;

    // Initial measure
    setMeasuredWidth(element.getBoundingClientRect().width);

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setMeasuredWidth(entry.contentRect.width);
      }
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, [props.width]);

  // If fixed width provided, render directly
  if (props.width !== undefined) {
    return <PencilStrokeRenderer id={id} {...props} />;
  }

  // If dynamic, render wrapper to measure, then render SVG
  const Component = props.as || "div"; // Default to div for responsive containers usually

  return (
    <Component ref={ref} className={`w-full ${props.className || ""}`}>
      {measuredWidth > 0 && (
        <PencilStrokeRenderer
          id={id}
          {...props}
          width={measuredWidth}
          // Avoid passing "as" to renderer so it doesn't create nested blocks unnecessarily
          // or let renderer simply be a span/div inside
          as="span"
        />
      )}
    </Component>
  );
};

interface PencilUnderlineProps {
  children: React.ReactNode;
  color?: string;
  thickness?: number;
  className?: string;
  href?: string;
  as?: any;
  hover?: boolean;
  deviation?: number;
  frequency?: number;
  seed?: number;
  opacity?: number;
}

export const PencilUnderline: React.FC<PencilUnderlineProps> = ({
  children,
  color,
  thickness = 1.5,
  className = "",
  href,
  as: Component = "span",
  ...props
}) => {
  const id = useId();
  const ref = useRef<HTMLElement>(null);
  const [rects, setRects] = useState<DOMRect[]>([]);

  // Use useLayoutEffect to measure immediately after render to avoid flash
  // but must be isomorphic safe (useEffect on server)
  const useIsomorphicLayoutEffect =
    typeof window !== "undefined" ? useLayoutEffect : useEffect;

  const measure = () => {
    if (!ref.current) return;
    // Get all line boxes
    const clientRects = ref.current.getClientRects();
    // Convert to array and filter empty rects
    const rectArray = Array.from(clientRects).filter(
      (r) => r.width > 0 && r.height > 0
    );

    // To position the strokes absolutely relative to the *first* rect (or the container),
    // we need a stable coordinate system.
    // However, since the wrapper is `relative`, `absolute` children are positioned relative to it.
    // But for `inline` elements, the "containing block" is complicated.

    // Let's calculate relative to the first rect (top-left corner).
    // Actually, if we just use the first rect as the origin (0,0) for our strokes container?
    // No, we can just store the raw rects, and render a fixed overlay?
    // No, simpler: Store relative coordinates.

    if (rectArray.length === 0) return;

    // We will render the strokes in a container that is positioned relative to the first rect.
    // Or just relative to the wrapper.
    // If the wrapper is `inline`, `getClientRects` gives us viewport coords.
    // The `absolute` child's origin depends on browser implementation of `inline-block` vs `inline`.

    // Let's store the rects relative to the *element's bounding client rect*.
    const bounding = ref.current.getBoundingClientRect();

    // Actually, `getBoundingClientRect` is the union of all `getClientRects`.
    // So `bounding.left` is the min left, `bounding.top` is min top.

    // If we put an absolute container at `left: 0; top: 0` of a `relative inline` element,
    // it usually aligns with the first line box's top-left content edge.

    // To be robust, let's just save the rects relative to the bounding rect.
    const relativeRects = rectArray.map((r) => ({
      width: r.width,
      height: r.height,
      left: r.left - bounding.left,
      top: r.top - bounding.top,
    }));

    // Check if changed deeply to avoid loops? React state usually handles ref equality.
    // Just set it.
    setRects(rectArray);
  };

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [children]);

  // We render the strokes in a portal-like way? No.
  // We render them inside the wrapper.
  // We need a container that covers the entire bounding box of the text.

  // If we use `display: inline` for the wrapper, `position: relative`.
  // Then we place a `span` inside that is `absolute`.
  // We need to offset the strokes based on where the wrapper thinks (0,0) is vs where the rects are.

  const strokes = rects.length > 0 && (
    <span
      className="absolute top-0 left-0 pointer-events-none w-full h-full block"
      aria-hidden="true"
    >
      {rects.map((r, i) => {
        // We need to calculate the position of this specific line rect relative to the container's origin.
        // The container is the `absolute` span above.
        // Its origin is... tricky with inline parents.

        // Robust Hack:
        // Instead of guessing where the `absolute` container is,
        // We render the container `fixed` or use the `boundingClientRect` as the reference frame
        // if we could.

        // Let's try the offset strategy:
        // The wrapper's bounding rect top-left is our reference frame if we set the absolute container there?

        // Better:
        // Just use `transform` to place strokes.
        // If the wrapper is `relative`, and we have a child `absolute left-0 top-0`,
        // that child is at the start of the first line box.
        // So we calculate offset from the first rect.

        const firstRect = rects[0];
        const leftOffset = r.left - firstRect.left;
        const topOffset = r.top - firstRect.top;

        return (
          <span
            key={i}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              transform: `translate(${leftOffset}px, ${
                topOffset + r.height - 12
              }px)`, // Align to bottom
              width: r.width,
              height: 10,
            }}
          >
            <PencilStrokeRenderer
              id={`${id}-${i}`}
              width={r.width}
              height={10}
              color={color}
              strokeWidth={thickness}
              {...props}
              // Use a unique seed based on index if not provided, to vary lines
              seed={props.seed ? props.seed + i : undefined}
            />
          </span>
        );
      })}
    </span>
  );

  const content = (
    <>
      {children}
      {strokes}
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        ref={ref as any}
        className={`relative inline group no-underline ${className}`}
        style={{ textDecoration: "none" }}
      >
        {content}
      </a>
    );
  }

  return (
    <Component ref={ref} className={`relative inline ${className}`}>
      {content}
    </Component>
  );
};
