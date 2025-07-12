"use client";

import { DATA } from "@/data/content";
import { motion, type Variants } from "framer-motion";
import { ChevronRight } from "lucide-react";

export default function Hero2() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.7,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Video */}
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src="/video.mp4"
        autoPlay
        loop
        muted
        playsInline
      >
        {"Your browser does not support the video tag."}
      </video>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <motion.div
        className="container relative z-10 flex h-full flex-col items-center justify-center text-center text-white px-4 md:px-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <h1 className="mx-auto max-w-4xl text-center text-3xl font-bold md:text-4xl lg:text-7xl">
          {"Elevate Your".split(" ").map((word, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
              animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              transition={{
                duration: 0.3,
                delay: index * 0.1,
                ease: "easeInOut",
              }}
              className="mr-2 inline-block"
            >
              {word}
            </motion.span>
          ))}

          <motion.span
            initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            transition={{
              duration: 0.3,
              delay: 0.3,
              ease: "easeInOut",
            }}
            className="mr-2 inline-block bg-gradient-to-b from-blue-300 to-blue-500 bg-clip-text text-transparent"
          >
            Real Estate
          </motion.span>

          {"with Stunning Videos".split(" ").map((word, index) => (
            <motion.span
              key={`after-${index}`}
              initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
              animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              transition={{
                duration: 0.3,
                delay: 0.5 + index * 0.1,
                ease: "easeInOut",
              }}
              className="mr-2 inline-block"
            >
              {word}
            </motion.span>
          ))}
        </h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.8 }}
          className="mt-6 max-w-4xl text-base sm:text-lg md:text-xl text-gray-300 leading-relaxed"
        >
          {DATA.hero.subtitle}
        </motion.p>
        <motion.div className="mt-8 flex gap-4" variants={itemVariants}>
          <button
            aria-label="Explore Our Projects"
            className="bg-slate-800 no-underline group cursor-pointer relative shadow-2xl rounded-full p-1 text-sm font-semibold leading-6 text-white inline-block"
            onClick={(e) => {
              e.preventDefault();
              const element = document.querySelector("#portfolio");
              element?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <span className="absolute inset-0 overflow-hidden rounded-full">
              <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>
            </span>
            <div className="relative flex space-x-2 items-center z-10 rounded-full bg-zinc-950 py-1 px-6 ring-1 ring-white/10 ">
              <span>{`Explore Our Projects`}</span>
              <ChevronRight className="w-3 h-3" />
            </div>
            <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-blue-500/0 via-blue-500/90 to-blue-500/0 transition-opacity duration-500 group-hover:opacity-40"></span>
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
}
