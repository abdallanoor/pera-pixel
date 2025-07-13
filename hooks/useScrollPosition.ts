import { useEffect, useState, RefObject } from 'react';

interface ScrollPosition {
  scrollLeft: number;
  scrollWidth: number;
  clientWidth: number;
}

export function useScrollPosition(
  ref: RefObject<HTMLElement | null>,
  callback?: (position: ScrollPosition) => void
): ScrollPosition {
  const [scrollPosition, setScrollPosition] = useState<ScrollPosition>({
    scrollLeft: 0,
    scrollWidth: 0,
    clientWidth: 0,
  });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleScroll = () => {
      const { scrollLeft, scrollWidth, clientWidth } = element;
      const position = { scrollLeft, scrollWidth, clientWidth };

      setScrollPosition(position);
      callback?.(position);
    };

    element.addEventListener('scroll', handleScroll, { passive: true });

    // Initial position
    handleScroll();

    return () => element.removeEventListener('scroll', handleScroll);
  }, [ref, callback]);

  return scrollPosition;
}