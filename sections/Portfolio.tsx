"use client";

import { memo, useCallback, useState } from "react";
import SectionHeader from "@/components/SectionHeader";
import { DATA } from "@/data/content";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useCarouselNavigation } from "@/hooks/use-carousel-navigation";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { AlertCircle, Play } from "lucide-react";
import { motion } from "framer-motion";
import {
  NavigationDotsProps,
  SectionInfoProps,
  Video,
  VideoCarouselProps,
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
    <div ref={ref} className={`w-full h-full ${className}`}>
      {!hasIntersected ? (
        <div className="w-full h-full flex items-center justify-center bg-muted/50 rounded-lg">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-2 bg-muted/70 rounded-full flex items-center justify-center">
              <Play size={24} className="text-muted-foreground" />
            </div>
          </div>
        </div>
      ) : (
        <div className="relative w-full h-full">
          {isLoading && (
            <div className="w-full h-full flex items-center justify-center bg-muted/50 backdrop-blur-sm rounded-lg">
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            </div>
          )}
          {hasError ? (
            <div className="w-full h-full flex items-center justify-center bg-muted/50 rounded-lg">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-2 bg-destructive/20 rounded-full flex items-center justify-center">
                  <AlertCircle size={24} className="text-destructive" />
                </div>
                <span className="text-xs text-destructive">
                  Failed to load video
                </span>
              </div>
            </div>
          ) : (
            <iframe
              src={iframeSrc}
              className={`w-full h-full border-0 rounded-lg ${isLoading ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}
              allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
              allowFullScreen
              loading="lazy"
              title="Video content"
              onLoad={handleLoad}
              onError={handleError}
              sandbox="allow-scripts allow-same-origin allow-presentation"
            />
          )}
        </div>
      )}
    </div>
  );
});

VideoIframe.displayName = "VideoIframe";

const VideoCarousel = memo<VideoCarouselProps>(
  ({ videos, itemClassName = "", showDots = true, type }) => {
    const { currentIndex, setApi, goToSlide } = useCarouselNavigation();

    const handleDotClick = useCallback(
      (index: number) => {
        goToSlide(index);
      },
      [goToSlide]
    );

    const aspectRatioClass =
      type === "horizontal" ? "aspect-video" : "aspect-[9/16]";

    return (
      <>
        <Carousel
          className="w-full"
          setApi={setApi}
          opts={{ align: "center", loop: false }}
        >
          <CarouselContent>
            {videos.map((video, index) => (
              <CarouselItem key={index} className={itemClassName}>
                <div className={`${aspectRatioClass} w-full`}>
                  <VideoIframe src={video.src} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="justify-center mt-4 gap-3 hidden lg:flex">
            <CarouselPrevious />
            <CarouselNext />
          </div>
        </Carousel>

        {showDots && (
          <NavigationDots
            total={videos.length}
            currentIndex={currentIndex}
            onDotClick={handleDotClick}
          />
        )}
      </>
    );
  }
);

VideoCarousel.displayName = "VideoCarousel";

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
        discription="Here’s a look at some of our recent work. Each video is done to suit the space, with natural flow and clean visuals."
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
            <VideoCarousel
              type="horizontal"
              itemClassName="max-md:basis-[85%]"
              videos={horizontalVideos}
            />
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
            <VideoCarousel
              type="vertical"
              videos={verticalVideos}
              itemClassName="basis-[85%]"
            />
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
