"use client";

import { memo, useRef, useState, useCallback, useMemo, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import SectionHeader from "@/components/SectionHeader";
import ShareButton from "@/components/ShareButton";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { useFullscreen } from "@/hooks/useFullscreen";
import { DATA } from "@/data/content";

// Types
interface VimeoVideo {
  src: string;
  id: string;
}

interface VideoSectionProps {
  videos: VimeoVideo[];
  isHorizontal: boolean;
  onActiveChange: (index: number) => void;
}

// Constants
const VIMEO_PARAMS = {
  autoplay: "0",
  loop: "0",
  muted: "0",
  controls: "1",
  portrait: "0",
  title: "0",
  byline: "0",
  background: "0",
  responsive: "1",
  quality: "360p",
  playsinline: "1",
  fullscreen: "1",
} as const;

const MOTION_CONFIG = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true },
  transition: { duration: 0.3, delay: 0.4 },
} as const;

// Utilities
const buildVimeoUrl = (src: string): string => {
  const url = new URL(src);
  const params = new URLSearchParams(VIMEO_PARAMS);
  return `${url.origin}${url.pathname}?${params}`;
};

const calculateActiveIndex = (
  scrollLeft: number,
  scrollWidth: number,
  clientWidth: number,
  totalItems: number
): number => {
  const itemWidth = (scrollWidth - clientWidth) / (totalItems - 1);
  return Math.max(
    0,
    Math.min(Math.round(scrollLeft / itemWidth), totalItems - 1)
  );
};

// Loading Spinner Component
const LoadingSpinner = memo(() => (
  <div className="absolute inset-0 flex items-center justify-center bg-muted/50 backdrop-blur-sm">
    <div className="relative">
      <div className="w-8 h-8 border-2 border-muted-foreground/20 rounded-full animate-spin border-t-foreground"></div>
    </div>
  </div>
));

LoadingSpinner.displayName = "LoadingSpinner";

// Components
const Info = memo<{
  title: string;
  description: string;
  className?: string;
}>(({ title, description, className = "" }) => (
  <div className={`space-y-6 ${className} max-lg:text-center`}>
    <h3 className="text-2xl lg:text-4xl tracking-tighter font-medium mb-4">
      {title}
    </h3>
    <p className="text-muted-foreground md:text-lg mb-8 max-lg:max-w-lg max-lg:mx-auto lg:max-w-2xl mx-auto">
      {description}
    </p>
    <ShareButton icon label="Get in Touch" link="contact" />
  </div>
));

Info.displayName = "Info";

const VimeoPlayer = memo<{
  video: VimeoVideo;
  isHorizontal: boolean;
}>(({ video, isHorizontal }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isIntersecting = useIntersectionObserver(containerRef, {
    threshold: 0.1,
    rootMargin: "50px",
  });
  const isFullscreen = useFullscreen();

  const embedUrl = useMemo(() => buildVimeoUrl(video.src), [video.src]);

  const containerClass = useMemo(
    () =>
      isHorizontal
        ? "w-full mr-4 md:mr-0 md:w-full md:snap-start"
        : "relative w-full aspect-[9/16] mx-auto mr-4 md:mr-0 md:w-auto",
    [isHorizontal]
  );

  const videoClass = useMemo(
    () =>
      isHorizontal
        ? "relative aspect-video rounded-lg"
        : "relative w-full h-full rounded-lg",
    [isHorizontal]
  );

  const handleLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  // Reset loading state when video changes
  useEffect(() => {
    if (isIntersecting) {
      setIsLoading(true);
    }
  }, [video.id, isIntersecting]);

  return (
    <div
      ref={containerRef}
      className={`group flex-none snap-start ${containerClass} ${isFullscreen ? "fullscreen-active" : ""}`}
    >
      <div
        className={`${videoClass} z-10 overflow-hidden bg-background relative`}
      >
        {isIntersecting && (
          <>
            {isLoading && <LoadingSpinner />}
            <iframe
              src={embedUrl}
              title={`Vimeo video ${video.id}`}
              className="w-full h-full border-0"
              allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
              allowFullScreen
              loading="lazy"
              onLoad={handleLoad}
            />
          </>
        )}
      </div>
    </div>
  );
});

VimeoPlayer.displayName = "VimeoPlayer";

const ScrollableSection = memo<VideoSectionProps>(
  ({ videos, isHorizontal, onActiveChange }) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    const handleScroll = useCallback(() => {
      const el = scrollRef.current;
      if (!el) return;

      const { scrollLeft, scrollWidth, clientWidth } = el;
      const activeIndex = calculateActiveIndex(
        scrollLeft,
        scrollWidth,
        clientWidth,
        videos.length
      );
      onActiveChange(activeIndex);
    }, [videos.length, onActiveChange]);

    return (
      <div
        ref={scrollRef}
        className={`flex overflow-x-auto snap-x snap-mandatory max-sm:pb-4 no-scrollbar md:grid md:gap-4 ${
          isHorizontal ? "" : "max-md:mx-8 md:grid-cols-2"
        }`}
        onScroll={handleScroll}
      >
        <div className="flex-none pl-4 md:hidden" />
        {videos.map((video) => (
          <VimeoPlayer
            key={video.id}
            video={video}
            isHorizontal={isHorizontal}
          />
        ))}
        <div className="flex-none pr-5 md:hidden" />
      </div>
    );
  }
);

ScrollableSection.displayName = "ScrollableSection";

const ParallaxSection = memo<{
  videos: VimeoVideo[];
  onVideoChange: (index: number) => void;
}>(({ videos, onVideoChange }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const isFullscreen = useFullscreen();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const videoIndex = useTransform(
    scrollYProgress,
    videos.map((_, i) => i / (videos.length - 1)),
    videos.map((_, i) => i)
  );

  // Subscribe to video index changes
  useMemo(() => {
    if (isFullscreen) return;

    return videoIndex.on("change", (latest) => {
      const rounded = Math.round(latest);
      if (rounded !== currentIndex && rounded >= 0 && rounded < videos.length) {
        setCurrentIndex(rounded);
        onVideoChange(rounded);
      }
    });
  }, [videoIndex, currentIndex, onVideoChange, videos.length, isFullscreen]);

  return (
    <div
      ref={containerRef}
      className="relative hidden md:block"
      style={{ height: `${videos.length * 100}vh` }}
    >
      <div className="sticky md:top-1/6">
        <div className="relative w-full max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{
                opacity: 1,
                scale: 1,
                transition: {
                  duration: isFullscreen ? 0 : 0.4,
                  ease: "easeInOut",
                },
              }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{
                duration: isFullscreen ? 0 : 0.4,
                ease: "easeInOut",
              }}
            >
              <VimeoPlayer video={videos[currentIndex]} isHorizontal />
            </motion.div>
          </AnimatePresence>

          {!isFullscreen && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-20">
              {videos.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 rounded-full transition-all duration-300 ${
                    i === currentIndex ? "bg-white h-6" : "bg-white/30 h-2"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

ParallaxSection.displayName = "ParallaxSection";

const ScrollIndicators = memo<{
  videos: VimeoVideo[];
  activeIndex: number;
}>(({ videos, activeIndex }) => (
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
));

ScrollIndicators.displayName = "ScrollIndicators";

// Main Component
export default function Portfolio() {
  const [horizontalActiveIndex, setHorizontalActiveIndex] = useState(0);
  const [verticalActiveIndex, setVerticalActiveIndex] = useState(0);

  // Video data
  const horizontalVideos: VimeoVideo[] = useMemo(
    () => DATA.portfolio.horizontalVideos,
    []
  );

  const verticalVideos: VimeoVideo[] = useMemo(
    () => DATA.portfolio.verticalVideos,
    []
  );

  return (
    <section id="portfolio" className="relative py-14 container">
      <SectionHeader tag="Portfolio" title="Cinematic Visual Experiences" />

      {/* Horizontal Videos */}
      <motion.div
        {...MOTION_CONFIG}
        className="grid lg:grid-cols-1 gap-10 py-12 lg:py-10"
      >
        <div className="order-1 md:order-2">
          <div className="md:hidden">
            <ScrollableSection
              videos={horizontalVideos}
              isHorizontal
              onActiveChange={setHorizontalActiveIndex}
            />
            <ScrollIndicators
              videos={horizontalVideos}
              activeIndex={horizontalActiveIndex}
            />
          </div>
          <ParallaxSection
            videos={horizontalVideos}
            onVideoChange={setHorizontalActiveIndex}
          />
        </div>
        <Info
          className="order-1 md:order-1 text-center"
          title="Horizontal Videos"
          description="Craft an immersive journey, inviting your audience to authentically connect with your brand, captivating them with the distinctive style it exudes."
        />
      </motion.div>

      {/* Vertical Reels */}
      <motion.div
        {...MOTION_CONFIG}
        className="grid lg:grid-cols-2 gap-10 items-start"
      >
        <Info
          className="lg:sticky lg:top-2/6"
          title="Vertical reels"
          description="Elevate your brand with captivating short-form video content tailored for discerning clients, reflecting your distinctive personality and style."
        />
        <div>
          <ScrollableSection
            videos={verticalVideos}
            isHorizontal={false}
            onActiveChange={setVerticalActiveIndex}
          />
          <div className="md:hidden">
            <ScrollIndicators
              videos={verticalVideos}
              activeIndex={verticalActiveIndex}
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
