import { useState, useEffect } from "react";
import { Box, Typography, useMediaQuery } from "@mui/material";
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
    links: ["/christmas", "/orange", "/cat", "/shoe-flower"],
  },
  {
    id: 2,
    color: "#F3E3CC",
    layout: "story",
    title: "Our Story",
    subtitle: `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.
Excepteur sint occaecat cupidatat non proident, sunt in culpa.
Curabitur pretium tincidunt lacus. Nulla gravida orci a odio.
In hac habitasse platea dictumst. Etiam faucibus cursus urna.
Suspendisse potenti. Sed dignissim odio a lorem malesuada.
`,
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

  const imageVariants = {
    hidden: { opacity: 0, x: -200 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.25,
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
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
        position: "relative",
        backgroundColor: currentPage.color,
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
            backgroundColor: currentPage.color,
            display: "flex",
            flexDirection:
              currentPage.id === 2 ? (isMobile ? "column" : "row") : "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: isMobile
              ? "center"
              : currentPage.id === 2
              ? "left"
              : "center",
            padding: isMobile ? "20px" : "60px",
          }}
        >
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 1 }}
            style={{
              flex: currentPage.id === 2 ? 1 : undefined,
              marginRight: currentPage.id === 2 && !isMobile ? "40px" : 0,
            }}
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

          {/* Page 2 Image */}
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
                alt="story-img"
                style={{
                  width: isMobile ? "80%" : "100%",
                  maxWidth: "500px",
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
                maxWidth: "1200px",
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                alignItems: "center",
                gap: { xs: 1.5, sm: 2, md: 3 },
                mt: isMobile ? 3 : 5,
              }}
            >
              {currentPage.images.map((src, idx) => {
                const isClickable =
                  currentPage.id === 1 && currentPage.links?.[idx];

                return (
                  <Link
                    key={idx}
                    to={isClickable ? currentPage.links[idx] : "#"}
                  >
                    <motion.img
                      src={src}
                      custom={idx}
                      variants={imageVariants}
                      initial="hidden"
                      animate="visible"
                      whileHover={{ scale: 1.08 }}
                      style={{
                        width: "clamp(70px, 22vw, 180px)",
                        height: "clamp(70px, 22vw, 180px)",
                        objectFit: "contain",
                        cursor: isClickable ? "pointer" : "default",
                      }}
                    />
                  </Link>
                );
              })}
            </Box>
          )}
        </motion.div>
      </AnimatePresence>
    </Box>
  );
}
