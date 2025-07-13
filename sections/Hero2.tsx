"use client";

import ShareButton from "@/components/ShareButton";
import { DATA } from "@/data/content";
import { motion, type Variants } from "framer-motion";

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
          <ShareButton
            icon={true}
            label="Explore Our Projects"
            link="portfolio"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
