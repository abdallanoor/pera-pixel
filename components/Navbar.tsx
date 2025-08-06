"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import { DATA } from "@/data/content";
import ThemeToggle from "./theme-toggle";
import MobileNav from "./MobileNav";
import { Button } from "./ui/button";
import { handleNavClick } from "@/lib/utils";
import Image from "next/image";

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

  return (
    <>
      <motion.header
        className="container fixed top-4 px-5 py-3.5 inset-x-0 w-[95%] bg-background backdrop-blur-md border border-foreground/10 rounded-full z-40 dark:bg-background/70"
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
              handleNavClick("#hero");
            }}
            className="text-lg flex-1"
          >
            <h1 className="sr-only">Perapixel</h1>
            <Image
              src="/perapixel logo.png"
              alt="Perapixel Logo"
              width={100}
              height={30}
              className="h-auto w-[100px]"
              priority
              draggable={false}
              fetchPriority="high"
            />
          </a>

          <ul className="flex items-center gap-2 max-md:hidden">
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
            <div className="max-md:hidden">
              <Button
                onClick={() => handleNavClick("#contact")}
                className="bg-blue-600 text-white rounded-full py-1 px-6 h-9 hover:bg-blue-700 cursor-pointer"
              >
                Contact
              </Button>
            </div>
            <motion.button
              onClick={() => setIsOpen(true)}
              className="flex items-center gap-2 text-foreground transition-colors md:hidden"
              aria-label="Open Menu"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Menu className="w-6 h-6" />
            </motion.button>
          </div>
        </nav>
      </motion.header>

      <MobileNav isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
}
