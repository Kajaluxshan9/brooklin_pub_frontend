import React, { useState, useEffect } from "react";
import { Box, Typography, Stack } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";


const pages = [
  {
    id: 1,
    color: "#D9A756",
    title: "MAKE YOURSELF HOME!",
    subtitle: "Different ambiances, different moods.",
    images: [
      "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
      "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/beside-and-next-to/next-to-and-beside/clip-art-orange.png",
      "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/beside-and-next-to/next-to-and-beside/clip-art-cat.png",
      "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-shoe-flower.png",
    ],
links: ["/christmas", "/orange", "/cat", "/shoe-flower"]

  },
  {
    id: 2,
    color: "#F3E3CC",
    layout: "story",
    title: "Our Story",
    subtitle: `Nestled in the heart of Whitby at 15 Baldwin Street...`,
    image: "./brooklinpub-logo.png",
  },
  
  {
    id: 5,
    color: "#7C8B48",
    title: "FRESHLY BREWED MOMENTS",
    subtitle: "Enjoy every sip, every bite, every vibe.",
  },
  {
    id: 3,
    color: "#8A2A2A",
    title: "COZY SPACES",
    subtitle: "Designed for comfort, inspired by warmth.",
  },
  {
    id: 4,
    color: "#c08a6aff",
    title: "VISIT US TODAY",
    subtitle: "Where great coffee meets great company.",
  },
];

export default function App() {
  const [pageIndex, setPageIndex] = useState(0);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [direction, setDirection] = useState("left");

  const randomDirection = () => {
    const dirs = ["left", "right", "top", "bottom"];
    return dirs[Math.floor(Math.random() * dirs.length)];
  };

  useEffect(() => {
    const handleWheel = (e) => {
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

  const getVariants = (dir) => {
    switch (dir) {
      case "left":
        return { initial: { x: "-100%" }, animate: { x: 0 }, exit: { x: "100%" } };
      case "right":
        return { initial: { x: "100%" }, animate: { x: 0 }, exit: { x: "-100%" } };
      case "top":
        return { initial: { y: "-100%" }, animate: { y: 0 }, exit: { y: "100%" } };
      case "bottom":
        return { initial: { y: "100%" }, animate: { y: 0 }, exit: { y: "-100%" } };
      default:
        return {};
    }
  };

  const imageVariants = {
    hidden: { opacity: 0, x: -200 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.25,
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1],
      },
    }),
  };

  const currentPage = pages[pageIndex];

  return (
<Box
  sx={{
    height: "100vh",
    width: "100%",
    overflow: "hidden",
    overflowX: "hidden",
    position: "relative",
    backgroundColor: currentPage.color,
  }}
>

      {/* Pagination Dots */}
      <Box
        sx={{
          position: "absolute",
          right: 20,
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
              width: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor: idx === pageIndex ? "white" : "rgba(255,255,255,0.5)",
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
  transition={{ duration: 1, ease: [0.76, 0, 0.24, 1], when: "beforeChildren" }}
  style={{
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",   // full viewport width
    height: "100vh",  // full viewport height
    backgroundColor: currentPage.color,
    display: "flex",
    flexDirection: currentPage.id === 2 ? "row" : "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: currentPage.id === 2 ? "left" : "center",
    boxSizing: "border-box",
    overflow: "hidden", // ensure no scrollbars appear
  }}
>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 1 }}
            style={{
              flex: currentPage.id === 2 ? 1 : "unset",
              mr: currentPage.id === 2 ? 4 : 0,
              textAlign: currentPage.id === 2 ? "left" : "center",
              color: currentPage.id === 2 ? "brown" : undefined,
            }}
          >
            <Typography
              variant="h3"
              sx={{
                fontWeight: 300,
                letterSpacing: "0.25em",
                mb: 4,
                fontFamily: "Montserrat, sans-serif",
                textTransform: "uppercase",
                color: currentPage.id === 2 ? "brown" : undefined,
                wordWrap: "break-word",
                fontSize: "clamp(1.5rem, 5vw, 3rem)", // Responsive heading
              }}
            >
              {currentPage.title}
            </Typography>

            <Typography
              variant="body2"
              sx={{
                letterSpacing: "0.05em",
                fontFamily: "Roboto, sans-serif",
                color: currentPage.id === 2 ? "brown" : "rgba(255,255,255,0.8)",
                fontSize: "clamp(0.9rem, 2.5vw, 1.2rem)", // Responsive subtitle
              }}
            >
              {currentPage.subtitle}
            </Typography>
          </motion.div>

          {/* Image for Page 2 */}
          {currentPage.id === 2 && currentPage.image && (
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 1 }}
              style={{ flex: 1, display: "flex", justifyContent: "center" }}
            >
<img
  src={currentPage.image}
  alt="story-image"
  style={{
    width: "100%",
    maxWidth: "600px",
    height: "auto",
    objectFit: "contain",
  }}
/>

            </motion.div>
          )}

{/* Multiple images */}
{currentPage.images && currentPage.id !== 2 && (
  <Box
    sx={{
      width: "100%",
      maxWidth: "1200px", // Fixed container width
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center",
      alignItems: "center",
      margin: "0 auto",
      gap: 2,
      padding: 2,
    }}
  >
{currentPage.images.map((src, idx) => {
  const isClickable = currentPage.id === 1 && currentPage.links?.[idx];

  // Calculate size based on number of images
  const imgSize = Math.min(200, Math.max(80, 1200 / currentPage.images.length - 16));

  const img = (
    <motion.img
      key={idx}
      src={src}
      alt={`item-${idx}`}
      custom={idx}
      variants={imageVariants}
      initial="hidden"
      animate="visible"
      style={{
        width: imgSize,
        height: imgSize,
        objectFit: "contain",
        pointerEvents: isClickable ? "auto" : "none",
        cursor: isClickable ? "pointer" : "default",
      }}
      whileHover={{
        scale: 1.1,
        transition: { duration: 0.3 },
      }}
    />
  );

  return isClickable ? (
    <Link key={idx} to={currentPage.links[idx]} style={{ textDecoration: "none" }}>
      {img}
    </Link>
  ) : (
    img
  );
})}
  </Box>
)}
        </motion.div>
      </AnimatePresence>
    </Box>
  );
}
