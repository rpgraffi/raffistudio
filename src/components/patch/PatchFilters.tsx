"use client";

import { useEffect, useRef } from "react";

export const PatchFilters = () => {
  const bgLightRef = useRef<SVGFEDistantLightElement>(null);
  const contentLightRef = useRef<SVGFEDistantLightElement>(null);

  useEffect(() => {
    let animationFrameId: number;

    const updateLight = () => {
      const rootStyle = getComputedStyle(document.documentElement);
      const mouseX = parseFloat(rootStyle.getPropertyValue("--mouse-x")) || 0;
      const mouseY = parseFloat(rootStyle.getPropertyValue("--mouse-y")) || 0;

      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      // Reuse the logic but read from the shared source of truth (CSS vars set by LightProvider)
      const dx = mouseX - centerX;
      // Fix light Y position to be "above" the center (Top) to satisfy "light from top"
      // We use a fixed negative offset so the light behaves as if it's hovering above the viewport top edge
      const dy = -centerY * 1.5;

      const azimuth = (Math.atan2(dy, dx) * 180) / Math.PI;

      // Keep elevation lower (grazing) to avoid "lit up" flat look in the middle
      // Constant elevation ensures consistent texture depth
      const elevation = 45;

      if (bgLightRef.current) {
        bgLightRef.current.setAttribute("azimuth", `${azimuth}`);
        bgLightRef.current.setAttribute("elevation", `${elevation}`);
      }
      if (contentLightRef.current) {
        contentLightRef.current.setAttribute("azimuth", `${azimuth}`);
        contentLightRef.current.setAttribute("elevation", `${elevation}`);
      }

      animationFrameId = requestAnimationFrame(updateLight);
    };

    updateLight();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
      <defs>
        {/* Patch Generator Filter with Dynamic Distant Light */}
        <filter
          id="patch-generation"
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
          colorInterpolationFilters="sRGB"
        >
          {/* --- STEP A: Create the Patch Shape (Sticker Background) --- */}
          {/* Dilate Alpha to create the backing shape */}
          <feMorphology
            in="SourceAlpha"
            operator="dilate"
            radius="12"
            result="dilatedAlpha"
          />

          {/* Rough up the edges of the backing shape using the same thread noise */}
          <feTurbulence
            type="fractalNoise"
            baseFrequency="1.5"
            numOctaves="2"
            result="threadNoise"
          />
          <feDisplacementMap
            in="dilatedAlpha"
            in2="threadNoise"
            scale="2"
            xChannelSelector="R"
            yChannelSelector="G"
            result="roughDilatedAlpha"
          />

          {/* Create a soft bevel for the background edge */}
          <feGaussianBlur
            in="roughDilatedAlpha"
            stdDeviation="2"
            result="softDilated"
          />

          {/* Texture the background */}
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="3"
            stitchTiles="stitch"
            result="fabricNoise"
          />
          <feColorMatrix
            type="saturate"
            values="0"
            in="fabricNoise"
            result="bwNoise"
          />
          <feComponentTransfer in="bwNoise" result="contrastNoise">
            <feFuncA type="linear" slope="0.2" />
          </feComponentTransfer>

          {/* Darken the base shape to be a dark grey patch/backing */}
          <feFlood floodColor="#cccccc" result="baseColor" />
          <feComposite
            in="baseColor"
            in2="roughDilatedAlpha"
            operator="in"
            result="coloredBase"
          />

          {/* Add Noise to Base */}
          <feBlend
            in="contrastNoise"
            in2="coloredBase"
            mode="multiply"
            result="texturedBaseUnclipped"
          />
          <feComposite
            in="texturedBaseUnclipped"
            in2="roughDilatedAlpha"
            operator="in"
            result="texturedBase"
          />

          {/* --- STEP B: Lighting for Background --- */}
          {/* Using Distant Light for global consistency */}
          <feSpecularLighting
            in="softDilated"
            surfaceScale="2"
            specularConstant="0.4"
            specularExponent="10"
            lightingColor="#ffffff"
            result="bgSpecular"
          >
            <feDistantLight ref={bgLightRef} azimuth="45" elevation="60" />
          </feSpecularLighting>

          <feComposite
            in="bgSpecular"
            in2="roughDilatedAlpha"
            operator="in"
            result="bgSpecularClipped"
          />
          <feComposite
            in="bgSpecularClipped"
            in2="texturedBase"
            operator="arithmetic"
            k1="0"
            k2="1"
            k3="1"
            k4="0"
            result="litBackground"
          />

          {/* --- STEP C: The Content (Thread Effect) --- */}
          {/* Displace the content to look like thread */}
          {/* Reuse threadNoise from earlier */}
          <feDisplacementMap
            in="SourceGraphic"
            in2="threadNoise"
            scale="1"
            xChannelSelector="R"
            yChannelSelector="G"
            result="displacedContent"
          />

          {/* Bevel the content */}
          <feGaussianBlur
            in="SourceAlpha"
            stdDeviation="1"
            result="contentBlur"
          />
          <feSpecularLighting
            in="contentBlur"
            surfaceScale="1.5"
            specularConstant="0.6"
            specularExponent="20"
            lightingColor="#ffffff"
            result="contentSpecular"
          >
            <feDistantLight ref={contentLightRef} azimuth="45" elevation="60" />
          </feSpecularLighting>

          <feComposite
            in="contentSpecular"
            in2="SourceAlpha"
            operator="in"
            result="contentSpecularClipped"
          />
          <feComposite
            in="displacedContent"
            in2="contentSpecularClipped"
            operator="arithmetic"
            k1="0"
            k2="1"
            k3="1"
            k4="0"
            result="litContent"
          />

          {/* Drop Shadow from Content to Background */}
          <feDropShadow
            dx="0"
            dy="1"
            stdDeviation="0.5"
            floodOpacity="0.5"
            in="litContent"
            result="shadowedContent"
          />

          {/* --- STEP D: Combine --- */}
          <feMerge>
            <feMergeNode in="litBackground" />
            <feMergeNode in="shadowedContent" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  );
};
