import { useState, useEffect } from "react";
import { Box, Typography, useMediaQuery } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";

const pages = [
  { id: 1, title: "hgtfuhvguy", subtitle: "nkjhjh", image: "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png" },
  { id: 2, title: "", subtitle: "", image: "./brooklinpub-logo.png" },
  { id: 5, title: "", subtitle: "", image: "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-shoe-flower.png" },
  { id: 3, title: "", subtitle: "", image: "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/beside-and-next-to/next-to-and-beside/clip-art-cat.png" },
  { id: 4, title: "", subtitle: "", image: "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/beside-and-next-to/next-to-and-beside/clip-art-orange.png" },
];

export default function App() {
  const [pageIndex, setPageIndex] = useState(0);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [direction, setDirection] = useState("left");
  const isMobile = useMediaQuery("(max-width: 768px)");

  const randomDirection = () => {
    const dirs = ["left", "right", "top", "bottom"];
    return dirs[Math.floor(Math.random() * dirs.length)];
  };

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!scrollEnabled) return;
      setScrollEnabled(false);
      setDirection(randomDirection());

      if (e.deltaY > 0) {
        setPageIndex((prev) => (prev + 1) % pages.length);
      } else {
        setPageIndex((prev) => (prev === 0 ? pages.length - 1 : prev - 1));
      }

      setTimeout(() => setScrollEnabled(true), 1000);
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [scrollEnabled]);

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

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100%",
        overflow: "hidden",
        position: "relative",
        backgroundColor: "transparent",
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
                ? `linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.35)), url(${currentPage.image})`
                : "transparent",
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
                fontWeight: 300,
                letterSpacing: "0.25em",
                mb: 3,
                fontFamily: "Montserrat, sans-serif",
                textTransform: "uppercase",
                fontSize: "clamp(1.4rem, 4vw, 3rem)",
                color: currentPage.id === 2 ? "brown" : "white",
              }}
            >
              {currentPage.title}
            </Typography>
            <Typography
              sx={{
                fontFamily: "Roboto, sans-serif",
                fontSize: "clamp(0.9rem, 2.5vw, 1.2rem)",
                color:
                  currentPage.id === 2 ? "brown" : "rgba(255,255,255,0.85)",
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
