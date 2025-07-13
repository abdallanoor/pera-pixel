"use client";

import { memo, useEffect, useRef, useState, useCallback } from "react";
import SectionHeader from "@/components/SectionHeader";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import Image from "next/image";
import ShareButton from "@/components/ShareButton";

// Optimized Info component
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
      <ShareButton icon={true} label="Get in Touch" link="contact" />
    </div>
  )
);

Info.displayName = "Info";

// Optimized video component with lazy loading
const PortfolioVideo = memo(
  ({ src, isHorizontal = true }: { src: string; isHorizontal?: boolean }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isIntersecting, setIsIntersecting] = useState(false);

    const handleLoadedData = useCallback(() => {
      if (videoRef.current && isIntersecting) {
        videoRef.current.play().catch(() => {
          // Autoplay failed, which is expected in some browsers
        });
      }
    }, [isIntersecting]);

    useEffect(() => {
      const video = videoRef.current;
      if (!video) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsIntersecting(true);
              video.play().catch(() => {
                // Autoplay failed, which is expected in some browsers
              });
            } else {
              setIsIntersecting(false);
              video.pause();
            }
          });
        },
        { threshold: 0.5 }
      );

      observer.observe(video);
      return () => observer.disconnect();
    }, []);

    const containerClass = isHorizontal
      ? "w-full mr-4 md:mr-0 md:w-full md:snap-start"
      : "relative w-full aspect-[9/19] mx-auto mr-4 md:mr-0 md:w-auto";

    const videoClass = isHorizontal
      ? "relative aspect-video rounded-lg shadow-2xl"
      : "relative w-[93%] h-[95%] top-[2.5%] left-[3.5%] rounded-[50px] lg:rounded-[35px]";

    return (
      <div className={`group flex-none snap-start ${containerClass}`}>
        {!isHorizontal && (
          <div className="absolute inset-0 pointer-events-none z-20">
            <Image
              src="/Phonevertical.png"
              alt="Phone Frame"
              className="w-full h-full object-contain"
              width={497}
              height={1024}
              loading="lazy"
              quality={80}
            />
          </div>
        )}
        <div className={`${videoClass} z-10 overflow-hidden bg-background`}>
          <video
            ref={videoRef}
            preload="metadata"
            playsInline
            loop
            muted
            autoPlay
            controls={false}
            poster="/loading-video.gif"
            className="object-cover w-full h-full"
            onLoadedData={handleLoadedData}
          >
            <source src={src} type="video/mp4" />
          </video>
        </div>
      </div>
    );
  }
);

PortfolioVideo.displayName = "PortfolioVideo";

// Optimized scrollable section
const ScrollableVideoSection = memo(
  ({
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

    const handleScroll = useCallback(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        onScroll(scrollLeft, scrollWidth, clientWidth);
      }
    }, [onScroll]);

    useEffect(() => {
      const el = scrollRef.current;
      if (el) {
        el.addEventListener("scroll", handleScroll, { passive: true });
        return () => el.removeEventListener("scroll", handleScroll);
      }
    }, [handleScroll]);

    return (
      <div
        ref={scrollRef}
        className={`flex overflow-x-auto snap-x snap-mandatory max-sm:pb-4 no-scrollbar md:grid md:gap-4 ${
          isHorizontal ? "" : "max-md:mx-8 md:grid-cols-2"
        }`}
      >
        <div className="flex-none pl-4 md:hidden" />
        {videos.map((video, i) => (
          <PortfolioVideo
            key={`${isHorizontal ? "h" : "v"}-${i}`}
            src={video.src}
            isHorizontal={isHorizontal}
          />
        ))}
        <div className="flex-none pr-5 md:hidden" />
      </div>
    );
  }
);

ScrollableVideoSection.displayName = "ScrollableVideoSection";

const ParallaxHorizontalVideos = memo(
  ({
    videos,
    onVideoChange,
  }: {
    videos: { src: string }[];
    onVideoChange: (index: number) => void;
  }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

    const { scrollYProgress } = useScroll({
      target: containerRef,
      offset: ["start start", "end end"],
    });

    const videoIndex = useTransform(
      scrollYProgress,
      videos.map((_, i) => i / (videos.length - 1)),
      videos.map((_, i) => i)
    );

    useEffect(() => {
      const unsubscribe = videoIndex.on("change", (latest) => {
        const rounded = Math.round(latest);
        if (
          rounded !== currentVideoIndex &&
          rounded >= 0 &&
          rounded < videos.length
        ) {
          setCurrentVideoIndex(rounded);
          onVideoChange(rounded);
        }
      });
      return unsubscribe;
    }, [videoIndex, currentVideoIndex, onVideoChange, videos.length]);

    return (
      <div
        ref={containerRef}
        className="relative hidden md:block"
        style={{ height: `${videos.length * 100}vh` }}
      >
        <div className="sticky md:top-[22%] lg:top-1/3 xl:top-[28%]">
          <div className="relative w-full max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentVideoIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                style={{
                  willChange: "opacity, transform",
                }}
              >
                <PortfolioVideo src={videos[currentVideoIndex].src} />
              </motion.div>
            </AnimatePresence>
            {/* Progress indicator */}
            {/* <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-20">
              {videos.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 rounded-full transition-all duration-300 ${
                    i === currentVideoIndex ? "bg-white h-6" : "bg-white/30 h-2"
                  }`}
                />
              ))}
            </div> */}
            {/* Scroll progress bar */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-white rounded-full shadow-2xs"
                style={{
                  scaleX: scrollYProgress,
                  transformOrigin: "left",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
);

ParallaxHorizontalVideos.displayName = "ParallaxHorizontalVideos";

// Scroll indicators component
const ScrollIndicators = memo(
  ({
    videos,
    activeIndex,
  }: {
    videos: { src: string }[];
    activeIndex: number;
  }) => (
    <div className="flex justify-center mt-2 space-x-2">
      {videos.map((_, i) => (
        <div
          key={i}
          className={`w-2 h-2 rounded-full transition-all duration-300 ${
            i === activeIndex ? "bg-foreground w-6" : "bg-muted-foreground/30"
          }`}
        />
      ))}
    </div>
  )
);

ScrollIndicators.displayName = "ScrollIndicators";

const motionProps = {
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

  const handleHorizontalScroll = useCallback(
    (scrollLeft: number, scrollWidth: number, clientWidth: number) => {
      const itemWidth = (scrollWidth - clientWidth) / (videos.length - 1);
      const newIndex = Math.round(scrollLeft / itemWidth);
      setHorizontalActiveIndex(
        Math.min(Math.max(newIndex, 0), videos.length - 1)
      );
    },
    [videos.length]
  );

  const handleVerticalScroll = useCallback(
    (scrollLeft: number, scrollWidth: number, clientWidth: number) => {
      const itemWidth = (scrollWidth - clientWidth) / (videos.length - 1);
      const newIndex = Math.round(scrollLeft / itemWidth);
      setVerticalActiveIndex(
        Math.min(Math.max(newIndex, 0), videos.length - 1)
      );
    },
    [videos.length]
  );

  return (
    <section id="portfolio" className="relative py-14 container">
      <SectionHeader tag="Portfolio" title="Cinematic Visual Experiences" />

      {/* Horizontal Videos */}
      <motion.div
        {...motionProps}
        className="grid lg:grid-cols-2 gap-10 items-start py-12 lg:py-10"
      >
        <div className="order-2 lg:order-1">
          <div className="md:hidden">
            <ScrollableVideoSection
              videos={videos}
              isHorizontal={true}
              onScroll={handleHorizontalScroll}
            />
            <ScrollIndicators
              videos={videos}
              activeIndex={horizontalActiveIndex}
            />
          </div>
          <ParallaxHorizontalVideos
            videos={videos}
            onVideoChange={setHorizontalActiveIndex}
          />
        </div>
        <Info
          className="lg:sticky lg:top-2/6 order-1 lg:order-2"
          title="Horizontal Videos"
          description="Craft an immersive journey, inviting your audience to authentically connect with your brand, captivating them with the distinctive style it exudes."
        />
      </motion.div>

      {/* Vertical Reels */}
      <motion.div
        {...motionProps}
        className="grid lg:grid-cols-2 gap-10 items-start"
      >
        <Info
          className="lg:sticky lg:top-2/6"
          title="Vertical reels"
          description="Elevate your brand with captivating short-form video content tailored for discerning clients, reflecting your distinctive personality and style."
        />
        <div>
          <ScrollableVideoSection
            videos={videos}
            isHorizontal={false}
            onScroll={handleVerticalScroll}
          />
          <div className="md:hidden">
            <ScrollIndicators
              videos={videos}
              activeIndex={verticalActiveIndex}
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
