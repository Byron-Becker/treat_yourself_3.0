import { useState, useEffect, useCallback, useRef } from 'react';

interface ViewportBounds {
  top: number;
  bottom: number;
}

interface SlidePosition {
  slideId: string;
  bounds: ViewportBounds;
  isActive: boolean;
}

const HEADER_HEIGHT = 72; // Adjust this value based on the actual height of your fixed header

export function useViewportScroll() {
  const [slidePositions, setSlidePositions] = useState<Map<string, SlidePosition>>(new Map());
  const [activeSlideId, setActiveSlideId] = useState<string | null>(null);
  const [lastScrollPosition, setLastScrollPosition] = useState<number>(0);
  const lastScrollPositionRef = useRef<number>(0);

  const updateSlidePosition = useCallback((slideId: string, bounds: ViewportBounds) => {
    setSlidePositions(prev => {
      const newPositions = new Map(prev);
      newPositions.set(slideId, { slideId, bounds, isActive: false });
      return newPositions;
    });
  }, []);

  const scrollToSlide = useCallback((index: number) => {
    const slides = document.querySelectorAll('.slide-item');
    const targetSlide = slides[index];
    
    if (!targetSlide) return;

    const slideRect = targetSlide.getBoundingClientRect();
    const scrollPosition = slideRect.top + window.scrollY - HEADER_HEIGHT; // Adjusted for header height

    lastScrollPositionRef.current = scrollPosition;
    setLastScrollPosition(scrollPosition);

    window.scrollTo({
      top: Math.max(0, scrollPosition),
      behavior: 'smooth'
    });

    const verifyScroll = () => {
      const currentPosition = window.scrollY;
      if (Math.abs(currentPosition - lastScrollPositionRef.current) > 2) {
        window.scrollTo(0, lastScrollPositionRef.current);
      }
    };

    setTimeout(verifyScroll, 1000);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setLastScrollPosition(scrollPosition);

      slidePositions.forEach((position, slideId) => {
        const isVisible =
          position.bounds.bottom >= scrollPosition &&
          position.bounds.top <= scrollPosition + window.innerHeight;

        if (isVisible && activeSlideId !== slideId) {
          setActiveSlideId(slideId);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [slidePositions, activeSlideId]);

  return {
    updateSlidePosition,
    scrollToSlide,
    activeSlideId,
    lastScrollPosition,
  };
}