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
      initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true }}
      transition={{ duration: 1, delay: 0.2 }}
      className="text-center flex flex-col gap-4 items-center justify-center"
    >
      <SectionTag
        containerClassName="rounded-full"
        as="button"
        className="section-teg"
      >
        <span>{tag}</span>
      </SectionTag>
      <h2 className="section-title">{title}</h2>
    </motion.div>
  );
}
