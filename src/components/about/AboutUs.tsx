import { useState, useRef, useCallback } from "react";
import { Box, Typography, useMediaQuery } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";

// Real content for the About section
const pages = [
  {
    id: 1,
    title: "Our Story",
    subtitle:
      "Serving Brooklin since 1985 with passion, pride, and great food.",
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

  const randomDirection = () => {
    const dirs = ["left", "right", "top", "bottom"];
    return dirs[Math.floor(Math.random() * dirs.length)];
  };

  // Handle wheel event only when container is hovered (for desktop)
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (!scrollEnabled || !isHovering) return;

      setScrollEnabled(false);
      setDirection(randomDirection());

      if (e.deltaY > 0) {
        setPageIndex((prev) => (prev + 1) % pages.length);
      } else {
        setPageIndex((prev) => (prev === 0 ? pages.length - 1 : prev - 1));
      }

      setTimeout(() => setScrollEnabled(true), 1000);
    },
    [scrollEnabled, isHovering]
  );

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

  // imageVariants removed — no image grid in this layout

  const currentPage = pages[pageIndex];

  // Touch swipe handling for mobile
  const touchStartY = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!scrollEnabled || touchStartY.current === null) return;

    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY.current - touchEndY;

    // Require minimum swipe distance (50px)
    if (Math.abs(diff) > 50) {
      setScrollEnabled(false);
      setDirection(randomDirection());

      if (diff > 0) {
        // Swiped up - next page
        setPageIndex((prev) => (prev + 1) % pages.length);
      } else {
        // Swiped down - previous page
        setPageIndex((prev) => (prev === 0 ? pages.length - 1 : prev - 1));
      }

      setTimeout(() => setScrollEnabled(true), 1000);
    }

    touchStartY.current = null;
  };

  return (
    <Box
      ref={containerRef}
      onWheel={handleWheel}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      sx={{
        height: "100vh",
        width: "100%",
        overflow: "hidden",
        position: "relative",
        backgroundColor: "transparent",
        cursor: isHovering ? "ns-resize" : "default",
      }}
    >
      {/* Pagination dots */}
      <Box
        sx={{
          position: "absolute",
          right: isMobile ? 10 : 20,
          top: "50%",
          transform: "translateY(-50%)",
          display: "flex",
          flexDirection: "column",
          gap: 1,
          zIndex: 10,
        }}
      >
        {pages.map((_, idx) => (
          <Box
            key={idx}
            onClick={() => setPageIndex(idx)}
            sx={{
              width: isMobile ? 8 : 12,
              height: isMobile ? 8 : 12,
              borderRadius: "50%",
              backgroundColor:
                idx === pageIndex ? "white" : "rgba(255,255,255,0.5)",
              cursor: "pointer",
              border: "1px solid rgba(0,0,0,0.2)",
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

          {/* (Background image is shown via container style; no image grid) */}
        </motion.div>
      </AnimatePresence>
    </Box>
  );
}
