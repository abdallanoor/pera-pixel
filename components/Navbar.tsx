"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import { DATA } from "@/data/content";
import ThemeToggle from "./theme-toggle";
import MobileNav from "./MobileNav";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("up");

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const updateScrollDirection = () => {
      const currentScrollY = window.scrollY;
      const direction = currentScrollY > lastScrollY ? "down" : "up";
      if (
        direction !== scrollDirection &&
        Math.abs(currentScrollY - lastScrollY) > 10
      ) {
        setScrollDirection(direction);
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", updateScrollDirection);
    return () => window.removeEventListener("scroll", updateScrollDirection);
  }, [scrollDirection]);

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    setTimeout(() => {
      const element = document.querySelector(href);
      element?.scrollIntoView({ behavior: "smooth" });
    }, 300);
  };

  return (
    <>
      <motion.header
        className="container fixed top-4 px-5 py-3 inset-x-0 w-[95%] bg-background backdrop-blur-md border border-foreground/10  rounded-full z-50"
        initial={{ y: -100 }}
        animate={
          isOpen
            ? { y: -100 }
            : scrollDirection === "down"
              ? { y: -100 }
              : { y: 0 }
        }
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <nav
          className="flex items-center justify-between gap-8"
          aria-label="Main Navigation"
        >
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              const element = document.querySelector("#hero");
              element?.scrollIntoView({ behavior: "smooth" });
            }}
            className="text-foreground font-bold text-lg flex-1"
          >
            <h1 className="sr-only">Perapixel</h1>
            Perapixel
          </a>

          <ul className="flex items-center gap-2 max-sm:hidden">
            {DATA.navbar.map((link, index) => (
              <li key={index}>
                <a
                  href={link.href}
                  className="text-muted-foreground hover:text-foreground transition-all p-1 font-medium"
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

          <div className="flex gap-2 items-center flex-1 justify-end">
            <ThemeToggle />
            <button
              aria-label="Explore Our Projects"
              className="max-sm:hidden bg-slate-800 no-underline group cursor-pointer relative shadow-2xl rounded-full p-1 text-sm font-semibold leading-6 text-white inline-block"
              onClick={(e) => {
                e.preventDefault();
                const element = document.querySelector("#contact");
                element?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <span className="absolute inset-0 overflow-hidden rounded-full">
                <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>
              </span>
              <div className="relative flex space-x-2 items-center z-10 rounded-full bg-zinc-950 py-1 px-6 ring-1 ring-white/10 ">
                <span>{`Contact`}</span>
              </div>
              <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-blue-500/0 via-blue-500/90 to-blue-500/0 transition-opacity duration-500 group-hover:opacity-40"></span>
            </button>
            <motion.button
              onClick={() => setIsOpen(true)}
              className="flex items-center gap-2 text-foreground transition-colors sm:hidden"
              aria-label="Open Menu"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Menu className="w-6 h-6" />
            </motion.button>
          </div>
        </nav>
      </motion.header>

      <MobileNav
        handleNavClick={handleNavClick}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
    </>
  );
}
