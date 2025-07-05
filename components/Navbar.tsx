"use client";

import { useState, useEffect } from "react";
import { motion, type Variants } from "framer-motion";

type NavItem = {
  id: number;
  title: string;
  href: string;
};

const NAV_ITEMS: NavItem[] = [
  { id: 1, title: "Home", href: "#home" },
  { id: 2, title: "About", href: "#about" },
  { id: 3, title: "Portfolio", href: "#portfolio" },
  { id: 4, title: "Services", href: "#services" },
  { id: 5, title: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Smooth animation variants
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
      {/* Main Navbar */}
      {!isOpen && (
        <motion.nav
          className="fixed top-6 left-1/2 w-[90%] -translate-x-1/2 z-50 px-6 py-4 bg-black/80 backdrop-blur-md border border-white/10 rounded-full"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="flex items-center justify-between gap-8">
            <motion.div
              className="text-white font-bold text-lg"
              whileHover={{ scale: 1.05 }}
            >
              Perapixel
            </motion.div>

            <motion.button
              onClick={() => setIsOpen(true)}
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-sm font-medium">Menu</span>
              <div className="flex flex-col gap-1">
                <div className="w-4 h-0.5 bg-white rounded-full" />
                <div className="w-4 h-0.5 bg-white rounded-full" />
              </div>
            </motion.button>
          </div>
        </motion.nav>
      )}

      {/* Full Screen Menu */}
      <motion.div
        className="fixed inset-0 z-40 bg-black"
        variants={menuVariants}
        initial="closed"
        animate={isOpen ? "open" : "closed"}
      >
        {/* Close Button */}
        <motion.button
          onClick={() => setIsOpen(false)}
          className="absolute top-8 right-8 z-50 w-12 h-12 flex items-center justify-center text-white hover:bg-white/10 rounded-full transition-colors"
          initial={{ opacity: 0, rotate: -90 }}
          animate={
            isOpen ? { opacity: 1, rotate: 0 } : { opacity: 0, rotate: -90 }
          }
          transition={{ delay: isOpen ? 0.3 : 0, duration: 0.3 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path
              d="M15 5L5 15M5 5l10 10"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </motion.button>

        {/* Menu Content */}
        <div className="h-full flex flex-col items-center justify-center">
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
                onClick={() => handleNavClick(item.href)}
              >
                <div className="flex items-center gap-6">
                  {/* Number */}
                  <motion.span className="text-2xl font-light text-white/40 tabular-nums min-w-[3rem]">
                    {item.id.toString().padStart(2, "0")}
                  </motion.span>

                  {/* Simple Text */}
                  <h2 className="text-5xl md:text-7xl font-bold text-white uppercase tracking-tight">
                    {item.title}
                  </h2>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}
