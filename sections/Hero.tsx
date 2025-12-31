"use client";

import { Button } from "@/components/ui/button";
// import { DATA } from "@/data/content";
import { heroContainer, heroItem } from "@/lib/motionVariants";
import { handleNavClick } from "@/lib/utils";
import { motion } from "framer-motion";

export default function Hero() {
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section id="hero" className="relative h-screen w-full overflow-hidden">
      {/* Background Video */}
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src="/video.mp4"
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
      >
        {"Your browser does not support the video tag."}
      </video>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/70" />

      <motion.div
        className="container relative z-10 flex h-full flex-col items-center justify-center text-center text-white px-4 md:px-6"
        variants={heroContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          variants={fadeUp}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-7xl lg:text-8xl font-bold text-center mb-6 tracking-tight bg-gradient-to-b from-primary to-primary/70 bg-clip-text text-transparent"
        >
          PeraPixel Production
        </motion.h1>

        <motion.p
          variants={fadeUp}
          transition={{ duration: 0.7 }}
          className="relative text-lg md:text-xl lg:text-2xl text-white/80 text-center font-light leading-relaxed max-w-2xl mb-10"
        >
          Bringing your vision to life
          <svg
            className="absolute -bottom-3 left-0 w-full"
            viewBox="0 0 200 20"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <path
              d="M5,12 Q25,5 45,10 T85,12 Q125,8 165,11 T195,10"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
              className="opacity-70 animate-drawLine"
            />
          </svg>
        </motion.p>
        <motion.div
          className="mt-2 flex gap-4 max-md:flex-col"
          variants={heroItem}
        >
          <Button size="lg" onClick={() => handleNavClick("#portfolio")}>
            Explore Our Projects
          </Button>
          <Button
            size="lg"
            className="bg-white/15 text-white hover:bg-white/20"
            onClick={() => handleNavClick("#contact")}
          >
            Get Started
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
