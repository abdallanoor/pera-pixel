"use client";

import { useState, useEffect } from "react";
import { motion, type Variants } from "framer-motion";
import { Menu, X } from "lucide-react";

type NavItem = {
  id: number;
  title: string;
  href: string;
};

const NAV_ITEMS: NavItem[] = [
  { id: 1, title: "Home", href: "#hero" },
  { id: 2, title: "About", href: "#about" },
  { id: 3, title: "Portfolio", href: "#portfolio" },
  { id: 4, title: "Services", href: "#services" },
  { id: 5, title: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const menuVariants: Variants = {
    closed: {
      clipPath: "circle(0% at 100% 0%)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40,
      },
    },
    open: {
      clipPath: "circle(150% at 100% 0%)",
      transition: {
        type: "spring",
        stiffness: 20,
        restDelta: 2,
      },
    },
  };

  const itemVariants: Variants = {
    closed: {
      y: 80,
      opacity: 0,
    },
    open: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  };

  const containerVariants: Variants = {
    closed: {},
    open: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

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
        className="container fixed top-4 px-6 py-4 inset-x-0 w-[95%] bg-background/20 backdrop-blur-md border border-foreground/10 rounded-full z-30"
        initial={{ y: -100, opacity: 0 }}
        animate={isOpen ? { y: -100, opacity: 0 } : { y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        <nav
          className="flex items-center justify-between gap-8"
          aria-label="Main Navigation"
        >
          <motion.a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              const element = document.querySelector("#hero");
              element?.scrollIntoView({ behavior: "smooth" });
            }}
            className="text-white font-bold text-lg"
            whileHover={{ scale: 1.05 }}
          >
            <h1 className="sr-only">Perapixel</h1>
            Perapixel
          </motion.a>

          <motion.button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
            aria-label="Open Menu"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Menu className="w-6 h-6" />
          </motion.button>
        </nav>
      </motion.header>

      <motion.div
        className="fixed inset-0 z-40"
        variants={menuVariants}
        initial="closed"
        animate={isOpen ? "open" : "closed"}
      >
        <motion.button
          onClick={() => setIsOpen(false)}
          className="absolute top-8 right-8 z-50 w-12 h-12 flex items-center justify-center text-white hover:bg-white/10 rounded-full transition-colors"
          aria-label="Close Menu"
          initial={{ opacity: 0, rotate: -90 }}
          animate={
            isOpen ? { opacity: 1, rotate: 0 } : { opacity: 0, rotate: -90 }
          }
          transition={{ delay: isOpen ? 0.3 : 0, duration: 0.3 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <X className="w-5 h-5" />
        </motion.button>

        <nav
          className="h-full flex flex-col items-center justify-center bg-background"
          aria-label="Full Screen Navigation"
        >
          <motion.div
            variants={containerVariants}
            initial="closed"
            animate={isOpen ? "open" : "closed"}
            className="space-y-8"
          >
            {NAV_ITEMS.map((item) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                className="group cursor-pointer"
              >
                <a
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.href);
                  }}
                  className="flex items-center gap-6"
                >
                  <motion.span className="text-2xl font-light text-white/40 tabular-nums min-w-[3rem]">
                    {item.id.toString().padStart(2, "0")}
                  </motion.span>

                  <h2 className="text-5xl md:text-7xl font-bold text-white uppercase tracking-tight">
                    {item.title}
                  </h2>
                </a>
              </motion.div>
            ))}
          </motion.div>
        </nav>
      </motion.div>
    </>
  );
}
