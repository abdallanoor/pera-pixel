export interface Video {
  src: string;
}

export interface NavigationDotsProps {
  total: number;
  currentIndex: number;
  onDotClick: (index: number) => void;
}

export interface VideoIframeProps {
  src: string;
  className?: string;
  isVisible?: boolean;
}

export interface ScrollCarouselProps {
  videos: Video[];
  itemClassName?: string;
  showDots?: boolean;
  type: "horizontal" | "vertical";
}

export interface SectionInfoProps {
  title: string;
  description?: string;
  id?: string
}
