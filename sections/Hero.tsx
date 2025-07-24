"use client";

import { Button } from "@/components/ui/button";
import { DATA } from "@/data/content";
import { heroContainer, heroItem } from "@/lib/motionVariants";
import { handleNavClick } from "@/lib/utils";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function Hero() {
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
      <div className="absolute inset-0 bg-black/60" />

      <motion.div
        className="container relative z-10 flex h-full flex-col items-center gap-6 justify-center text-center text-white px-4 md:px-6"
        variants={heroContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20"
          variants={heroItem}
        >
          <Sparkles size={16} />
          <span className="text-sm font-medium text-white/90">
            Premium Video Solutions
          </span>
        </motion.div>

        <motion.h1
          variants={heroItem}
          className="mx-auto max-w-4xl text-center text-3xl font-bold md:text-4xl lg:text-7xl text-white"
        >
          Elevate Your{" "}
          <span className="relative inline-block">
            <span className="bg-gradient-to-b from-blue-400 to-blue-700 bg-clip-text text-transparent">
              Real Estate
            </span>
            <svg
              className="absolute -bottom-2 lg:-bottom-3 left-0 w-full h-4 lg:h-6"
              viewBox="0 0 200 20"
              preserveAspectRatio="none"
            >
              <path
                d="M10,15 Q100,5 190,15"
                stroke="#3b82f6"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                className="animate-drawLine"
              />
            </svg>
          </span>{" "}
          with Stunning Videos
        </motion.h1>

        <motion.p
          variants={heroItem}
          className="max-w-4xl text-base sm:text-lg md:text-xl text-gray-200 leading-relaxed"
        >
          {DATA.hero.subtitle}
        </motion.p>
        <motion.div
          className="mt-2 flex gap-4 max-md:flex-col"
          variants={heroItem}
        >
          <Button
            className="bg-blue-600 text-white rounded-full  p-6 hover:bg-blue-700 cursor-pointer"
            onClick={() => handleNavClick("#portfolio")}
          >
            Explore Our Projects
          </Button>
          <Button
            className="rounded-full p-6 bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 cursor-pointer"
            onClick={() => handleNavClick("#contact")}
          >
            Get Started
          </Button>
        </motion.div>
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5, duration: 0.8 }}
          onClick={() => handleNavClick("#companies")}
        >
          <motion.div
            className="flex flex-col items-center gap-3 cursor-pointer group"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-white/60 text-sm font-medium group-hover:text-white/80 transition-colors">
              Scroll to discover
            </span>
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center group-hover:border-white/60 transition-colors">
              <motion.div
                className="w-1 h-3 bg-white/60 rounded-full mt-2 group-hover:bg-white/80"
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              />
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
