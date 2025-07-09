"use client";
import SectionHeader from "@/components/SectionHeader";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Portfolio() {
  const Info = ({
    title,
    description,
    className,
  }: {
    title: string;
    description: string;
    className?: string;
  }) => (
    <motion.div
      className={`space-y-6 ${className}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: 0.1 }}
    >
      <h3 className="text-4xl lg:text-6xl tracking-tighter mb-4">{title}</h3>
      <p className="text-muted-foreground text-lg mb-8 max-w-lg">
        {description}
      </p>
      <button
        aria-label="Get in Touch"
        className="bg-slate-800 no-underline group cursor-pointer relative shadow-2xl shadow-zinc-900 rounded-full p-1 text-sm font-semibold leading-6 text-white inline-block"
      >
        <span className="absolute inset-0 overflow-hidden rounded-full">
          <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>
        </span>
        <div className="relative flex space-x-2 items-center z-10 rounded-full bg-zinc-950 py-1 px-6 ring-1 ring-white/10">
          <span>Get in Touch</span>
          <ChevronRight className="w-3 h-3" />
        </div>
        <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-blue-500/0 via-blue-500/90 to-blue-500/0 transition-opacity duration-500 group-hover:opacity-40"></span>
      </button>
    </motion.div>
  );

  return (
    <section id="portfolio" className="relative my-14 container">
      <SectionHeader tag="Portfolio" title="Cinematic Visual Experiences" />
      {/* Horizontal Videos Section */}
      <div className="grid lg:grid-cols-2 gap-14 items-start py-14">
        <div className="space-y-6 order-2 lg:order-1">
          {[1, 2, 3, 4].map((video, index) => (
            <motion.div
              key={video}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.15 }}
              className="group"
            >
              <div className="relative aspect-video rounded-lg overflow-hidden">
                <video
                  src="/video.mp4"
                  className="object-cover w-full h-full"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
            </motion.div>
          ))}
        </div>

        <Info
          className="lg:sticky lg:top-24 order-1 lg:order-2"
          title="Horizontal Videos"
          description="Craft an immersive journey, inviting your audience to authentically connect with your brand, captivating them with the distinctive style it exudes."
        />
      </div>

      {/* Vertical Reels Section */}

      <div className="grid lg:grid-cols-2 gap-14 items-start py-14">
        <Info
          className="lg:sticky lg:top-24"
          title="Vertical reels"
          description="Elevate your brand with captivating short-form video content tailored for discerning clients, reflecting your distinctive personality and style."
        />

        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((video, index) => (
            <motion.div
              key={video}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.15 }}
              className="relative w-full max-w-sm aspect-[9/19] mx-auto"
            >
              <div className="absolute inset-0 pointer-events-none z-20">
                <Image
                  src="/Phonevertical.png"
                  alt="Phone Frame"
                  className="w-full h-full object-contain "
                  width={497}
                  height={1024}
                />
              </div>

              <div className="relative w-[93%] h-[95%] top-[2%] left-[3.5%] z-10 rounded-[30px] md:rounded-[40px] overflow-hidden bg-black">
                <video
                  src="/video.mp4"
                  className="object-cover w-full h-full"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
