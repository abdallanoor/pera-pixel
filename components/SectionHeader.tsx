"use client";
import { motion } from "framer-motion";
import { SectionTag } from "./SectionTag";

export default function SectionHeader({
  title,
  tag,
}: {
  title: string;
  tag: string;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
      variants={{
        hidden: { opacity: 0, y: 40, scale: 0.95, filter: "blur(6px)" },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          transition: {
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
          },
        },
      }}
      className="text-center flex flex-col gap-4 items-center justify-center"
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.4,
          duration: 0.6,
          ease: "easeOut",
        }}
      >
        <SectionTag
          containerClassName="rounded-full"
          as="button"
          className="section-teg"
        >
          <span>{tag}</span>
        </SectionTag>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.5,
          duration: 0.6,
          ease: "easeOut",
        }}
        className="section-title"
      >
        {title}
      </motion.h2>
    </motion.div>
  );
}
