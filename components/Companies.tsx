import { DATA } from "@/data/content";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Companies({ isInView }: { isInView?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.3, delay: 1.4 }}
      className="container mb-16"
    >
      <div className="flex overflow-hidden w-4/5 mx-auto [mask-image:linear-gradient(to_right,transparent,black,transparent)]">
        <motion.div
          animate={{
            translateX: "-50%",
          }}
          transition={{
            duration: 25,
            ease: "linear",
            repeat: Infinity,
            repeatType: "loop",
          }}
          className="flex gap-10 flex-none"
        >
          {DATA.hero.logos.map((logo, i) => (
            <Image
              key={`first-${i}`}
              src={logo.image}
              width={100}
              height={38}
              alt={logo.title}
              className="w-auto h-8 invert"
            />
          ))}

          {/* Second set of logos for animation */}

          {DATA.hero.logos.map((logo, i) => (
            <Image
              key={`second-${i}`}
              src={logo.image}
              width={100}
              height={38}
              alt={logo.title}
              className="w-auto h-8 invert"
            />
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
