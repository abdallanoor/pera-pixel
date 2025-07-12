import { DATA } from "@/data/content";
import { motion, type Variants } from "framer-motion";
import { X } from "lucide-react";

type MobileNavProps = {
  handleNavClick: (href: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

export default function MobileNav({
  handleNavClick,
  isOpen,
  setIsOpen,
}: MobileNavProps) {
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
  return (
    <motion.div
      className="fixed inset-0 z-40"
      variants={menuVariants}
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
          {[...DATA.navbar, { title: "Contact", href: "#contact" }].map(
            (item, index) => (
              <motion.div
                key={index}
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
                  <motion.span className="text-2xl font-light text-muted-foreground tabular-nums min-w-[3rem]">
                    {(index + 1).toString().padStart(2, "0")}
                  </motion.span>

                  <h2 className="text-5xl md:text-7xl font-bold text-foreground uppercase tracking-tight">
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
