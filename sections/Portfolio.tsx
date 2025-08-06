"use client";

import { memo, useCallback, useState, useRef, useEffect } from "react";
import SectionHeader from "@/components/SectionHeader";
import { DATA } from "@/data/content";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { AlertCircle, Play, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import {
  NavigationDotsProps,
  ScrollCarouselProps,
  SectionInfoProps,
  Video,
  VideoIframeProps,
} from "@/types/video";

const NavigationDots = memo<NavigationDotsProps>(
  ({ total, currentIndex, onDotClick }) => (
    <div className="justify-center gap-2 mt-4 flex lg:hidden">
      {Array.from({ length: total }, (_, index) => (
        <button
          key={index}
          onClick={() => onDotClick(index)}
          className={`w-2 h-2 rounded-full transition-all duration-300 ${
            index === currentIndex
              ? "bg-primary w-5"
              : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
          }`}
          aria-label={`Go to slide ${index + 1}`}
        />
      ))}
    </div>
  )
);

NavigationDots.displayName = "NavigationDots";

const VideoIframe = memo<VideoIframeProps>(({ src, className = "" }) => {
  const { ref, hasIntersected } = useIntersectionObserver();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const iframeSrc = `${src}?autoplay=0&loop=0&muted=0&controls=1&portrait=0&title=0&byline=0&background=0&responsive=1&quality=360p&playsinline=1&cast=0&chromecast=0`;

  const handleLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
  }, []);

  return (
    <div ref={ref} className={`relative w-full h-full ${className}`}>
      {/* Fixed height container to prevent layout shift */}
      <div className="absolute inset-0 w-full h-full">
        {!hasIntersected ? (
          <div className="w-full h-full flex items-center justify-center bg-muted/50 rounded-lg">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-2 bg-muted/70 rounded-full flex items-center justify-center">
                <Play size={24} className="text-muted-foreground" />
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Loading overlay */}
            {isLoading && (
              <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-muted/50 backdrop-blur-sm rounded-lg z-10">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              </div>
            )}

            {/* Error overlay */}
            {hasError && (
              <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-muted/50 rounded-lg z-10">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-2 bg-destructive/20 rounded-full flex items-center justify-center">
                    <AlertCircle size={24} className="text-destructive" />
                  </div>
                  <span className="text-xs text-destructive">
                    Failed to load video
                  </span>
                </div>
              </div>
            )}

            {/* Iframe - always rendered to maintain layout */}
            <iframe
              src={iframeSrc}
              className={`absolute inset-0 w-full h-full border-0 rounded-lg transition-opacity duration-500 ${
                isLoading || hasError ? "opacity-0" : "opacity-100"
              } scheme-normal!`}
              allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
              allowFullScreen
              loading="lazy"
              title="Video content"
              onLoad={handleLoad}
              onError={handleError}
              sandbox="allow-scripts allow-same-origin allow-presentation"
            />
          </>
        )}
      </div>
    </div>
  );
});

VideoIframe.displayName = "VideoIframe";

const ScrollCarousel = memo<ScrollCarouselProps>(
  ({ videos, showDots = true, type }) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const aspectRatioClass =
      type === "horizontal" ? "aspect-video" : "aspect-[9/16]";

    // Update scroll state
    const updateScrollState = useCallback(() => {
      if (!scrollContainerRef.current) return;

      const container = scrollContainerRef.current;
      const { scrollLeft, scrollWidth, clientWidth } = container;

      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);

      const itemWidth = container.children[0]?.clientWidth || 0;
      const gap = 16; // gap-4 = 16px
      const newIndex = Math.round(scrollLeft / (itemWidth + gap));
      setCurrentIndex(Math.min(newIndex, videos.length - 1));
    }, [videos.length]);

    const scrollToIndex = useCallback((index: number) => {
      if (!scrollContainerRef.current) return;

      const container = scrollContainerRef.current;
      const itemWidth = container.children[0]?.clientWidth || 0;
      const gap = 16; // gap-4 = 16px
      const scrollPosition = index * (itemWidth + gap);

      container.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
    }, []);

    const scrollLeft = useCallback(() => {
      const newIndex = Math.max(currentIndex - 1, 0);
      scrollToIndex(newIndex);
    }, [currentIndex, scrollToIndex]);

    const scrollRight = useCallback(() => {
      const newIndex = Math.min(currentIndex + 1, videos.length - 1);
      scrollToIndex(newIndex);
    }, [currentIndex, videos.length, scrollToIndex]);

    const handleDotClick = useCallback(
      (index: number) => {
        scrollToIndex(index);
      },
      [scrollToIndex]
    );

    useEffect(() => {
      const container = scrollContainerRef.current;
      if (!container) return;

      updateScrollState();
      container.addEventListener("scroll", updateScrollState);
      window.addEventListener("resize", updateScrollState);

      return () => {
        container.removeEventListener("scroll", updateScrollState);
        window.removeEventListener("resize", updateScrollState);
      };
    }, [updateScrollState]);

    return (
      <>
        <div className="relative">
          {/* Scroll Container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
            style={{
              scrollSnapType: "x mandatory",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {videos.map((video, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-full"
                style={{
                  scrollSnapAlign: "center",
                }}
              >
                <div className={`${aspectRatioClass} w-full`}>
                  <VideoIframe src={video.src} />
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Navigation Buttons */}
          <div className="hidden lg:flex justify-center mt-4 gap-3">
            <button
              onClick={scrollLeft}
              disabled={!canScrollLeft}
              className={`p-2 rounded-full border transition-all duration-300 ${
                canScrollLeft
                  ? "bg-background border-border hover:bg-muted"
                  : "bg-muted border-muted-foreground/20 cursor-not-allowed"
              }`}
              aria-label="Previous video"
            >
              <ChevronLeft
                size={20}
                className={
                  canScrollLeft ? "text-foreground" : "text-muted-foreground"
                }
              />
            </button>
            <button
              onClick={scrollRight}
              disabled={!canScrollRight}
              className={`p-2 rounded-full border transition-all duration-300 ${
                canScrollRight
                  ? "bg-background border-border hover:bg-muted"
                  : "bg-muted border-muted-foreground/20 cursor-not-allowed"
              }`}
              aria-label="Next video"
            >
              <ChevronRight
                size={20}
                className={
                  canScrollRight ? "text-foreground" : "text-muted-foreground"
                }
              />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dots */}
        {showDots && (
          <NavigationDots
            total={videos.length}
            currentIndex={currentIndex}
            onDotClick={handleDotClick}
          />
        )}

        <style jsx>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </>
    );
  }
);

ScrollCarousel.displayName = "ScrollCarousel";

const VideoGridItem = memo<{ video: Video; index: number }>(
  ({ video, index }) => (
    <div key={index} className="aspect-[9/16] w-full">
      <VideoIframe src={video.src} />
    </div>
  )
);

VideoGridItem.displayName = "VideoGridItem";

const SectionInfo = memo<SectionInfoProps>(({ title, description, id }) => (
  <div className="text-start max-md:max-w-2xl max-md:mx-auto py-6">
    <h3 className="text-2xl lg:text-4xl tracking-tighter font-medium mb-2">
      <span className="text-muted-foreground">{id}</span> {title}
    </h3>
    {description && (
      <p className="text-muted-foreground lg:max-w-2xl">{description}</p>
    )}
  </div>
));

SectionInfo.displayName = "SectionInfo";

export default function Portfolio() {
  const { horizontalVideos, verticalVideos } = DATA.portfolio;

  return (
    <section id="portfolio" className="container py-12">
      <SectionHeader
        tag="Portfolio"
        title="Cinematic Visual Experiences"
        discription="Here's a look at some of our recent work. Each video is done to suit the space, with natural flow and clean visuals."
      />

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        {/* Horizontal Videos Section */}
        <div>
          <SectionInfo
            id="01"
            title="Horizontal Videos"
            description="Craft an immersive journey, inviting your audience to authentically connect with your brand, captivating them with the distinctive style it exudes."
          />
          <div className="mt-2">
            <ScrollCarousel type="horizontal" videos={horizontalVideos} />
          </div>
        </div>

        {/* Vertical Videos Section */}
        <div className="mt-6">
          <SectionInfo
            id="02"
            title="Vertical reels"
            description="Elevate your brand with captivating short-form video content tailored for discerning clients, reflecting your distinctive personality and style."
          />
          {/* Mobile Carousel */}
          <div className="md:hidden mt-2">
            <ScrollCarousel type="vertical" videos={verticalVideos} />
          </div>
          {/* Desktop Grid */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
            {verticalVideos.map((video, index) => (
              <VideoGridItem key={index} video={video} index={index} />
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
