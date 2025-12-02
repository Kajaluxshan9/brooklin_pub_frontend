import { useState, useRef, useEffect } from "react";
import { Box, Typography, useMediaQuery } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";

// Real content for the About section
const pages = [
  {
    id: 1,
    title: "Our Story",
    subtitle:
      "Serving Brooklin since 2014 with passion, pride, and great food.",
    image:
      "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1200&q=80",
  },
  {
    id: 2,
    title: "The Pub",
    subtitle:
      "A welcoming neighborhood gathering place for friends and family.",
    image:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&q=80",
  },
  {
    id: 3,
    title: "Our Kitchen",
    subtitle: "Fresh ingredients, homemade recipes, and dishes made with love.",
    image:
      "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=1200&q=80",
  },
  {
    id: 4,
    title: "Community",
    subtitle: "More than a pub – we're part of the Brooklin family.",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80",
  },
];

export default function AboutUs() {
  const [pageIndex, setPageIndex] = useState(0);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [direction, setDirection] = useState("left");
  const isMobile = useMediaQuery("(max-width: 768px)");
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  // Track which pages have been viewed
  const [viewedPages, setViewedPages] = useState<Set<number>>(new Set([0]));
  const [allPagesViewed, setAllPagesViewed] = useState(false);

  // Track if component is fully visible in viewport
  const [isFullyVisible, setIsFullyVisible] = useState(false);

  // Intersection Observer to detect when component is fully visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Use lower threshold on mobile for better UX
        const visibilityThreshold = isMobile ? 0.8 : 0.95;
        setIsFullyVisible(entry.intersectionRatio >= visibilityThreshold);
      },
      {
        threshold: [0, 0.25, 0.5, 0.75, 0.8, 0.95, 1],
        rootMargin: "0px",
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [isMobile]);

  // Update viewed pages when pageIndex changes
  useEffect(() => {
    setViewedPages((prev) => {
      const newSet = new Set(prev);
      newSet.add(pageIndex);
      return newSet;
    });
  }, [pageIndex]);

  // Check if all pages have been viewed
  useEffect(() => {
    if (viewedPages.size === pages.length && !allPagesViewed) {
      setAllPagesViewed(true);
    }
  }, [viewedPages, allPagesViewed]);

  // Prevent page scrolling ONLY when component is fully visible AND not all slides viewed
  useEffect(() => {
    // On mobile, be less aggressive with scroll locking to avoid confusion
    const shouldLockScroll = isFullyVisible && !allPagesViewed && !isMobile;

    if (shouldLockScroll) {
      // Lock body scroll when component is visible and slides not complete (desktop only)
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      // Allow body scroll otherwise
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [isFullyVisible, allPagesViewed, isMobile]);

  const randomDirection = () => {
    const dirs = ["left", "right", "top", "bottom"];
    return dirs[Math.floor(Math.random() * dirs.length)];
  };

  // Handle wheel event only when container is hovered (for desktop)
  // We'll attach native (non-passive) listeners to the container element below

  const getVariants = (dir: string) => {
    switch (dir) {
      case "left":
        return {
          initial: { x: "-100%" },
          animate: { x: 0 },
          exit: { x: "100%" },
        };
      case "right":
        return {
          initial: { x: "100%" },
          animate: { x: 0 },
          exit: { x: "-100%" },
        };
      case "top":
        return {
          initial: { y: "-100%" },
          animate: { y: 0 },
          exit: { y: "100%" },
        };
      case "bottom":
        return {
          initial: { y: "100%" },
          animate: { y: 0 },
          exit: { y: "-100%" },
        };
      default:
        return { initial: { x: 0 }, animate: { x: 0 }, exit: { x: 0 } };
    }
  };

  const currentPage = pages[pageIndex];

  // Touch swipe handling for mobile
  const touchStartY = useRef<number | null>(null);
  // We'll attach native touch handlers to the container element below

  // Refs to hold latest state for native listeners
  const isFullyVisibleRef = useRef(isFullyVisible);
  const allPagesViewedRef = useRef(allPagesViewed);
  const scrollEnabledRef = useRef(scrollEnabled);
  const isHoveringRef = useRef(isHovering);
  const isMobileRef = useRef(isMobile);

  useEffect(() => {
    isFullyVisibleRef.current = isFullyVisible;
  }, [isFullyVisible]);
  useEffect(() => {
    allPagesViewedRef.current = allPagesViewed;
  }, [allPagesViewed]);
  useEffect(() => {
    scrollEnabledRef.current = scrollEnabled;
  }, [scrollEnabled]);
  useEffect(() => {
    isHoveringRef.current = isHovering;
  }, [isHovering]);
  useEffect(() => {
    isMobileRef.current = isMobile;
  }, [isMobile]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const wheelHandler = (e: WheelEvent) => {
      if (isFullyVisibleRef.current && !allPagesViewedRef.current) {
        e.preventDefault();
        e.stopPropagation();

        if (!scrollEnabledRef.current || !isHoveringRef.current) return;

        setScrollEnabled(false);
        setDirection(randomDirection());

        if (e.deltaY > 0) {
          setPageIndex((prev) => (prev + 1) % pages.length);
        } else {
          setPageIndex((prev) => (prev === 0 ? pages.length - 1 : prev - 1));
        }

        setTimeout(() => setScrollEnabled(true), 1000);
      }
    };

    const touchStartHandler = (e: TouchEvent) => {
      // On mobile, only prevent default if within the component
      // Don't prevent default to allow users to scroll past the section
      touchStartY.current = e.touches[0]?.clientY ?? null;
    };

    const touchMoveHandler = (e: TouchEvent) => {
      // Only prevent scroll if we're in swipe mode and slides not complete
      if (
        isMobileRef.current &&
        isFullyVisibleRef.current &&
        !allPagesViewedRef.current &&
        touchStartY.current !== null
      ) {
        const currentY = e.touches[0]?.clientY ?? null;
        if (currentY === null) return;
        const diff = Math.abs(touchStartY.current - currentY);
        // Only prevent if it's a significant vertical swipe
        if (diff > 10) {
          e.preventDefault();
        }
      }
    };

    const touchEndHandler = (e: TouchEvent) => {
      if (touchStartY.current === null) return;

      const touchEndY = e.changedTouches[0]?.clientY ?? null;
      if (touchEndY === null) {
        touchStartY.current = null;
        return;
      }

      const diff = touchStartY.current - touchEndY;

      // Only change slides if swipe is significant enough
      if (Math.abs(diff) > 60 && scrollEnabledRef.current) {
        setScrollEnabled(false);
        setDirection(randomDirection());

        if (diff > 0) {
          setPageIndex((prev) => (prev + 1) % pages.length);
        } else {
          setPageIndex((prev) => (prev === 0 ? pages.length - 1 : prev - 1));
        }

        setTimeout(() => setScrollEnabled(true), 800);
      }

      touchStartY.current = null;
    };

    el.addEventListener("wheel", wheelHandler, { passive: false });
    el.addEventListener("touchstart", touchStartHandler, { passive: true });
    el.addEventListener("touchmove", touchMoveHandler, { passive: false });
    el.addEventListener("touchend", touchEndHandler, { passive: true });

    return () => {
      el.removeEventListener("wheel", wheelHandler);
      el.removeEventListener("touchstart", touchStartHandler);
      el.removeEventListener("touchmove", touchMoveHandler);
      el.removeEventListener("touchend", touchEndHandler);
    };
    // Intentionally do not include refs in deps — handlers read latest via refs
  }, [pages.length]);

  return (
    <Box
      ref={containerRef}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      sx={{
        height: { xs: "70vh", md: "80vh" },
        width: "100%",
        overflow: "hidden",
        position: "relative",
        backgroundColor: "transparent",
        cursor: isHovering && !isMobile ? "ns-resize" : "default",
        // Prevent overscroll effects on iOS
        WebkitOverflowScrolling: "touch",
        touchAction: allPagesViewed ? "auto" : "pan-x",
      }}
    >
      {/* Mobile swipe hint - show until user has swiped */}
      {isMobile && !allPagesViewed && pageIndex === 0 && (
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          sx={{
            position: "absolute",
            bottom: 100,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 15,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 0.5,
          }}
        >
          <Box
            component={motion.div}
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            sx={{
              width: 24,
              height: 40,
              borderRadius: 12,
              border: "2px solid rgba(255,253,251,0.6)",
              display: "flex",
              justifyContent: "center",
              paddingTop: "8px",
            }}
          >
            <Box
              sx={{
                width: 4,
                height: 8,
                borderRadius: 2,
                backgroundColor: "rgba(255,253,251,0.8)",
              }}
            />
          </Box>
          <Typography
            sx={{
              fontFamily: '"Inter", sans-serif',
              fontSize: "0.7rem",
              color: "rgba(255,253,251,0.7)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Swipe
          </Typography>
        </Box>
      )}
      {/* Pagination dots */}
      <Box
        sx={{
          position: "absolute",
          // On mobile, position further from edge to avoid accidental taps near screen edge
          right: isMobile ? 16 : 20,
          top: "50%",
          transform: "translateY(-50%)",
          display: "flex",
          flexDirection: "column",
          gap: isMobile ? 1.5 : 1,
          zIndex: 10,
          // Add touch-friendly padding on mobile
          padding: isMobile ? "8px" : 0,
        }}
      >
        {pages.map((_, idx) => (
          <Box
            key={idx}
            onClick={() => {
              if (!scrollEnabled) return;
              setScrollEnabled(false);
              setDirection(randomDirection());
              setPageIndex(idx);
              setTimeout(() => setScrollEnabled(true), 800);
            }}
            sx={{
              // Larger touch targets on mobile
              width: isMobile ? 12 : 12,
              height: isMobile ? 12 : 12,
              borderRadius: "50%",
              backgroundColor:
                idx === pageIndex ? "#FFFDFB" : "rgba(255,253,251,0.6)",
              cursor: "pointer",
              border: "1px solid rgba(106,58,30,0.3)",
              boxShadow:
                idx === pageIndex ? "0 2px 8px rgba(106,58,30,0.3)" : "none",
              transition: "all 0.3s ease",
              // Add minimum touch area via pseudo-element
              position: "relative",
              "&::before": {
                content: '""',
                position: "absolute",
                top: "-8px",
                left: "-8px",
                right: "-8px",
                bottom: "-8px",
              },
            }}
          />
        ))}
      </Box>

      <AnimatePresence mode="popLayout">
        <motion.div
          key={pageIndex}
          variants={getVariants(direction)}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 1 }}
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            background: currentPage.image
              ? `linear-gradient(rgba(60,31,14,0.55), rgba(106,58,30,0.45)), url(${currentPage.image})`
              : "linear-gradient(135deg, #6A3A1E 0%, #3C1F0E 100%)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: isMobile ? "20px" : "60px",
          }}
        >
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 1 }}
          >
            <Typography
              sx={{
                fontWeight: 600,
                letterSpacing: "0.15em",
                mb: 3,
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                textTransform: "uppercase",
                fontSize: "clamp(1.8rem, 4vw, 3.5rem)",
                color: "#F3E3CC",
                textShadow: "0 2px 12px rgba(60,31,14,0.4)",
              }}
            >
              {currentPage.title}
            </Typography>
            <Typography
              sx={{
                fontFamily: '"Inter", sans-serif',
                fontSize: "clamp(1rem, 2.5vw, 1.3rem)",
                color: "rgba(243,227,204,0.9)",
                maxWidth: "600px",
                lineHeight: 1.6,
              }}
            >
              {currentPage.subtitle}
            </Typography>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </Box>
  );
}
