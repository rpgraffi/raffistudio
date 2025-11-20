"use client";

import React from "react";
import { lightShadows } from "../../app/styles/shadows";

export function InsetFrame({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded-2xl bg-zinc-200 overflow-hidden"
      style={
        {
          // Dynamic Inset Shadow
          boxShadow: lightShadows.insetDeep,
        } as React.CSSProperties
      }
    >
      <div
        className="rounded-2xl relative h-full w-full"
        style={{
          boxShadow: lightShadows.insetHighlight,
        }}
      >
        {children}
      </div>
    </div>
  );
}
