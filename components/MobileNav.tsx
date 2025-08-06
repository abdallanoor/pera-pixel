import { DATA } from "@/data/content";
import {
  mobileNavContainer,
  mobileNavItem,
  mobileNavMenu,
} from "@/lib/motionVariants";
import { handleNavClick } from "@/lib/utils";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";

type MobileNavProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

export default function MobileNav({ isOpen, setIsOpen }: MobileNavProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50"
      variants={mobileNavMenu}
      initial="closed"
      animate={isOpen ? "open" : "closed"}
    >
      <motion.button
        onClick={() => setIsOpen(false)}
        className="absolute top-8 right-8 z-50 w-12 h-12 flex items-center justify-center text-foreground hover:bg-foreground/10 rounded-full transition-colors"
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

      <a
        href="#hero"
        onClick={(e) => {
          e.preventDefault();
          handleNavClick("#hero", true, setIsOpen);
        }}
        className="absolute top-10 left-8 z-50"
      >
        <Image
          src="/perapixel logo.png"
          alt="Perapixel Logo"
          className="filter grayscale"
          width={100}
          height={30}
          priority
          draggable={false}
          fetchPriority="high"
        />
      </a>

      <nav
        className="h-full flex flex-col items-center justify-center bg-background"
        aria-label="Full Screen Navigation"
      >
        <motion.div
          variants={mobileNavContainer}
          initial="closed"
          animate={isOpen ? "open" : "closed"}
          className="space-y-8"
        >
          {[...DATA.navbar, { title: "Contact", href: "#contact" }].map(
            (item, index) => (
              <motion.div
                key={index}
                variants={mobileNavItem}
                className="group cursor-pointer"
              >
                <a
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.href, true, setIsOpen);
                  }}
                  className="flex items-center gap-2"
                >
                  <motion.span className="text-2xl font-light text-muted-foreground tabular-nums min-w-[3rem]">
                    {(index + 1).toString().padStart(2, "0")}
                  </motion.span>

                  <h2 className="text-[2.50rem] leading-none md:text-6xl font-bold text-foreground uppercase tracking-tight">
                    {item.title}
                  </h2>
                </a>
              </motion.div>
            )
          )}
        </motion.div>
      </nav>
    </motion.div>
  );
}
