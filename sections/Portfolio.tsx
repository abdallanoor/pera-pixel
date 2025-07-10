"use client";

import { memo, useEffect, useRef, useState } from "react";
import SectionHeader from "@/components/SectionHeader";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

const Info = memo(
  ({
    title,
    description,
    className,
  }: {
    title: string;
    description: string;
    className?: string;
  }) => (
    <div className={`space-y-6 ${className} max-lg:text-center`}>
      <h3 className="text-2xl lg:text-4xl tracking-tighter font-medium mb-4">
        {title}
      </h3>
      <p className="text-muted-foreground md:text-lg mb-8 max-lg:max-w-lg max-lg:mx-auto">
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
    </div>
  )
);

Info.displayName = "Info";

const PortfolioVideo = ({
  src,
  poster,
  type,
  isHorizontal = true,
}: {
  src: string;
  poster: string;
  type: string;
  isHorizontal?: boolean;
}) => {
  return (
    <div
      className={`group flex-none snap-start ${
        isHorizontal
          ? "w-full mr-4 md:mr-0 md:w-full"
          : "relative w-full aspect-[9/19] mx-auto mr-4 md:mr-0 md:w-auto"
      }`}
    >
      {!isHorizontal && (
        <div className="absolute inset-0 pointer-events-none z-20">
          <Image
            src="/Phonevertical.png"
            alt="Phone Frame"
            className="w-full h-full object-contain"
            width={497}
            height={1024}
            priority={false}
            quality={80}
          />
        </div>
      )}
      <div
        className={`${
          isHorizontal
            ? "relative aspect-video rounded-lg"
            : "relative w-[93%] h-[95%] top-[2.5%] left-[3.5%] rounded-[50px] lg:rounded-[35px]"
        } z-10 overflow-hidden bg-black`}
      >
        <video
          preload="metadata"
          playsInline
          loop
          muted
          autoPlay
          controls={false}
          poster={poster}
          className="object-cover w-full h-full"
        >
          <source src={src} type={type} />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>
    </div>
  );
};

PortfolioVideo.displayName = "PortfolioVideo";

const ScrollableVideoSection = ({
  videos,
  isHorizontal,
  onScroll,
}: {
  videos: { src: string }[];
  isHorizontal: boolean;
  onScroll: (
    scrollLeft: number,
    scrollWidth: number,
    clientWidth: number
  ) => void;
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        onScroll(scrollLeft, scrollWidth, clientWidth);
      }
    };

    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener("scroll", handleScroll);
      return () => scrollElement.removeEventListener("scroll", handleScroll);
    }
  }, [onScroll]);

  return (
    <div
      ref={scrollRef}
      className={`flex overflow-x-auto snap-x snap-mandatory max-sm:pb-4 no-scrollbar md:grid md:gap-4 ${
        isHorizontal ? "" : "max-md:mx-8 md:grid-cols-2"
      }`}
    >
      <div className="flex-none pl-4 md:hidden"></div>
      {videos.map((video, index) => (
        <PortfolioVideo
          key={`${isHorizontal ? "horizontal" : "vertical"}-video-${index}`}
          src={video.src}
          poster="/loading-video.gif"
          type="video/mp4"
          isHorizontal={isHorizontal}
        />
      ))}
      <div className="flex-none pr-5 md:hidden"></div>
    </div>
  );
};

const commonMotionProps = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true },
  transition: { duration: 0.3, delay: 0.4 },
};

export default function Portfolio() {
  const [horizontalActiveIndex, setHorizontalActiveIndex] = useState(0);
  const [verticalActiveIndex, setVerticalActiveIndex] = useState(0);

  const videos = [
    { src: "/video.mp4" },
    { src: "/video.mp4" },
    { src: "/video.mp4" },
    { src: "/video.mp4" },
  ];

  const handleHorizontalScroll = (
    scrollLeft: number,
    scrollWidth: number,
    clientWidth: number
  ) => {
    const itemWidth = (scrollWidth - clientWidth) / (videos.length - 1);
    const newIndex = Math.round(scrollLeft / itemWidth);
    setHorizontalActiveIndex(
      Math.min(Math.max(newIndex, 0), videos.length - 1)
    );
  };

  const handleVerticalScroll = (
    scrollLeft: number,
    scrollWidth: number,
    clientWidth: number
  ) => {
    const itemWidth = (scrollWidth - clientWidth) / (videos.length - 1);
    const newIndex = Math.round(scrollLeft / itemWidth);
    setVerticalActiveIndex(Math.min(Math.max(newIndex, 0), videos.length - 1));
  };

  return (
    <section id="portfolio" className="relative py-14 container">
      <SectionHeader tag="Portfolio" title="Cinematic Visual Experiences" />

      {/* Horizontal Videos Section */}
      <motion.div
        {...commonMotionProps}
        className="grid lg:grid-cols-2 gap-10 items-start py-6 md:py-10"
      >
        <div className="order-2 lg:order-1">
          <ScrollableVideoSection
            videos={videos}
            isHorizontal={true}
            onScroll={handleHorizontalScroll}
          />
          {/* Mobile scroll indicators */}
          <div className="flex justify-center mt-2 space-x-2 md:hidden">
            {videos.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === horizontalActiveIndex
                    ? "bg-foreground w-6"
                    : "bg-muted-foreground/30"
                }`}
              />
            ))}
          </div>
        </div>

        <Info
          className="lg:sticky lg:top-24 order-1 lg:order-2"
          title="Horizontal Videos"
          description="Craft an immersive journey, inviting your audience to authentically connect with your brand, captivating them with the distinctive style it exudes."
        />
      </motion.div>

      {/* Vertical Reels Section */}
      <motion.div
        {...commonMotionProps}
        className="grid lg:grid-cols-2 gap-10 items-start"
      >
        <Info
          className="lg:sticky lg:top-24"
          title="Vertical reels"
          description="Elevate your brand with captivating short-form video content tailored for discerning clients, reflecting your distinctive personality and style."
        />
        <div>
          <ScrollableVideoSection
            videos={videos}
            isHorizontal={false}
            onScroll={handleVerticalScroll}
          />
          {/* Mobile scroll indicators */}
          <div className="flex justify-center mt-2 space-x-2 md:hidden">
            {videos.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === verticalActiveIndex
                    ? "bg-foreground w-6"
                    : "bg-muted-foreground/30"
                }`}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
