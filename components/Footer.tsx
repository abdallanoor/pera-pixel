"use client";

import { DATA } from "@/data/content";
// import { Instagram, Mail } from "lucide-react";

export default function Footer() {
  const handleNavClick = (href: string) => {
    setTimeout(() => {
      const element = document.querySelector(href);
      element?.scrollIntoView({ behavior: "smooth" });
    }, 300);
  };
  return (
    <footer className="container py-10">
      <div className="flex items-center justify-between gap-4 flex-col lg:flex-row py-10">
        <div className="flex-1">
          <p className="font-medium">LOGO</p>
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
        {/* <div className="flex gap-2"> 
          <a
            href="https://www.instagram.com/perapixel"
            target="_blank"
            className="text-muted-foreground hover:text-foreground transition-all"
          >
            <Instagram size={20} />
          </a>
          <a
            href="mailto:perapixel@gmail.com"
            target="_blank"
            className="text-muted-foreground hover:text-foreground transition-all"
          >
            <Mail size={20} />
          </a>
        </div> */}
        <p className="flex-1 flex justify-end text-muted-foreground">
          © 2025 Perapixel Agency
        </p>
      </div>

      <p className="text-center text-5xl md:text-[9rem] lg:text-[11rem] xl:text-[13rem] font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 dark:from-neutral-950 to-neutral-200 dark:to-neutral-800 inset-x-0">
        PERAPIXEL
      </p>
    </footer>
  );
}
