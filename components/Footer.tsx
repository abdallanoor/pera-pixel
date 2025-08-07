"use client";

import { DATA } from "@/data/content";
import { handleNavClick } from "@/lib/utils";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="container py-10">
      <div className="flex items-center justify-between gap-4 flex-col lg:flex-row py-10">
        <div className="flex-1">
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick("#hero");
            }}
          >
            <Image
              src="/perapixel-logo.png"
              alt="Perapixel Logo"
              className="filter grayscale"
              width={100}
              height={30}
              priority
              draggable={false}
              fetchPriority="high"
            />
          </a>
        </div>
        <ul className="flex items-center gap-2">
          {DATA.navbar.map((link, index) => (
            <li key={index}>
              <a
                href={link.href}
                className="text-muted-foreground hover:text-foreground transition-all p-1"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
              >
                {link.title}
              </a>
            </li>
          ))}
        </ul>
        <p className="flex-1 flex justify-end text-muted-foreground">
          © 2025 Perapixel Production
        </p>
      </div>

      <p className="text-center text-5xl md:text-[9rem] lg:text-[11rem] xl:text-[13rem] font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 dark:from-neutral-950 to-neutral-200 dark:to-neutral-800 inset-x-0">
        PERAPIXEL
      </p>
    </footer>
  );
}
