"use client";

import { PencilUnderline } from "@/components/natural-ui/PencilStroke";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="absolute top-0 left-0 w-full z-60">
      <div className="max-w-site mx-auto flex justify-between items-start p-8 md:p-12 text-lg">
        <nav className="flex gap-4">
          <Link href="/">
            <Image
              src="/images/exit.svg"
              alt="Exit"
              width={100}
              height={100}
              style={{ display: "block" }}
            />
          </Link>
        </nav>
        <PencilUnderline
          href="mailto:me@raffi.studio"
          hoverMode="appear"
          className="text-zinc-600"
        >
          Say Hello
        </PencilUnderline>
      </div>
    </header>
  );
}
