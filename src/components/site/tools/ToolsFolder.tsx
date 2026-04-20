"use client";

import { forwardRef } from "react";

/**
 * The folder is split into two layered pieces so the WebGL canvas can sit
 * between them (back behind, front above with backdrop-blur). Both pieces
 * share identical positioning and aspect ratio (mirroring `<Folder />`) so
 * they stay aligned when GSAP transforms them together.
 */
// Match the project <Folder /> sizing: capped at 600px, otherwise filling the
// viewport minus the same 4rem horizontal breathing room the project section
// uses (`px-8` = 2rem each side).
const FOLDER_WRAPPER =
  "pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-[8vh] " +
  "w-[min(600px,calc(100vw-4rem))] aspect-848/578 will-change-transform";

const ROUNDED = "rounded-3xl sm:rounded-[36px] md:rounded-[48px]";

interface FolderPieceProps {
  className?: string;
}

export const FolderBack = forwardRef<HTMLDivElement, FolderPieceProps>(
  function FolderBack({ className = "" }, ref) {
    return (
      <div ref={ref} className={`${FOLDER_WRAPPER} ${className}`}>
        <div
          className={`absolute inset-0 ${ROUNDED} bg-white`}
          style={{
            boxShadow:
              "0 8px 16px rgba(0,0,0,0.05), 0 16px 32px rgba(0,0,0,0.1)",
          }}
        />
      </div>
    );
  }
);

export const FolderFront = forwardRef<HTMLDivElement, FolderPieceProps>(
  function FolderFront({ className = "" }, ref) {
    return (
      <div ref={ref} className={`${FOLDER_WRAPPER} ${className}`}>
        <div
          className={`absolute inset-x-0 bottom-0 top-[15%] ${ROUNDED} border-t border-white/80 bg-white/75 backdrop-blur-md`}
          style={{
            boxShadow: [
              "0 -4px 12px rgba(0,0,0,0.06)",
              "0 -1px 3px rgba(0,0,0,0.08)",
              "inset 0 4px 4px rgba(255,255,255,0.3)",
              "inset 0 -4px 4px rgba(0,0,0,0.06)",
              "inset 0 -12px 12px rgba(0,0,0,0.06)",
            ].join(", "),
          }}
        />
      </div>
    );
  }
);
