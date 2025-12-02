import { useState, useEffect } from "react";
import { Box, Typography, useMediaQuery } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import FrontView from "../../assets/images/Story/Brookli-pub-front-view.jpg";
import DancingInFunction from "../../assets/images/Story/brooklin-pub-dancing-in-function 1.jpg";
import ShowCase from "../../assets/images/Story/brooklin-pub-show-case.jpg";
import BrooklinPubPillers from "../../assets/images/Story/brooklin-pub-eligent.jpg";
import IndoorView from "../../assets/images/Story/brooklin-pub-indoor-view.jpg";


// Real content for the About section
const pages = [
  {
    id: 1,
    title: "Our Story",
    subtitle:
      "Serving Brooklin since 2014 with passion, pride, and great food.",
    image: FrontView,
  },
  {
    id: 2,
    title: "The Pub",
    subtitle:
      "A welcoming neighborhood gathering place for friends and family.",
    image: DancingInFunction,
  },
  {
    id: 3,
    title: "Our Kitchen",
    subtitle: "Fresh ingredients, homemade recipes, and dishes made with love.",
    image: ShowCase,
  },
  {
    id: 4,
    title: "Community",
    subtitle: "More than a pub – we're part of the Brooklin family.",
    image: BrooklinPubPillers,
  },
  {
    id: 5,
    title: "Community",
    subtitle: "More than a pub – we're part of the Brooklin family.",
    image: IndoorView,
  },
];

export default function AboutUs() {
  const [pageIndex, setPageIndex] = useState(0);
  const [direction, setDirection] = useState("left");
  const isMobile = useMediaQuery("(max-width: 768px)");

  const randomDirection = () => {
    const dirs = ["left", "right", "top", "bottom"];
    return dirs[Math.floor(Math.random() * dirs.length)];
  };

  // Auto-change slides every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(randomDirection());
      setPageIndex((prev) => (prev + 1) % pages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

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

  return (
    <Box
      sx={{
        height: { xs: "auto", md: "100vh" },
        width: "100%",
        overflowY: { xs: "auto", md: "hidden" },
        position: "relative",
        backgroundColor: "transparent",
        // hide native scrollbars but keep scrolling functional (mobile)
        scrollbarWidth: "none",
        "-ms-overflow-style": "none",
        "&::-webkit-scrollbar": {
          display: "none",
        },
      }}
    >
      {/* Simple Pagination Dots */}
      <Box
        sx={{
          position: "absolute",
          right: isMobile ? 16 : 24,
          top: "50%",
          transform: "translateY(-50%)",
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
          zIndex: 10,
        }}
      >
        {pages.map((_, idx) => (
          <Box
            key={idx}
            onClick={() => {
              setDirection(randomDirection());
              setPageIndex(idx);
            }}
            sx={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor:
                idx === pageIndex ? "#D9A756" : "rgba(255, 253, 251, 0.5)",
              cursor: "pointer",
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: idx === pageIndex ? "#D9A756" : "rgba(255, 253, 251, 0.8)",
                transform: "scale(1.2)",
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
            position: isMobile ? "relative" : "absolute",
            width: "100%",
            height: isMobile ? "auto" : "100%",
            background: !isMobile && currentPage.image
              ? `linear-gradient(rgba(60,31,14,0.55), rgba(106,58,30,0.45)), url(${currentPage.image})`
              : undefined,
            backgroundSize: !isMobile ? "cover" : undefined,
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: isMobile ? "0px" : "32px",
            gap: isMobile ? 2 : 0,
          }}
        >
          {/* On mobile render the image as an actual <img> with elegant styling */}
          {isMobile && currentPage.image && (
            <Box
              component={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              sx={{
                width: "100%",
                padding: "20px",
                position: "relative",
              }}
            >
              {/* Decorative gradient border container */}
              <Box
                sx={{
                  position: "relative",
                  borderRadius: "24px",
                  padding: "3px",
                  background:
                    "linear-gradient(135deg, rgba(217, 167, 86, 0.6) 0%, rgba(106, 58, 30, 0.4) 50%, rgba(217, 167, 86, 0.6) 100%)",
                  boxShadow:
                    "0 20px 60px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)",
                }}
              >
                <Box
                  component="img"
                  src={currentPage.image}
                  alt={currentPage.title}
                  sx={{
                    width: "100%",
                    height: "auto",
                    objectFit: "cover",
                    borderRadius: "21px",
                    display: "block",
                    backgroundColor: "#1a1a1a",
                  }}
                />
              </Box>
              {/* Subtle glow effect behind image */}
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "90%",
                  height: "90%",
                  background:
                    "radial-gradient(circle, rgba(217, 167, 86, 0.15) 0%, transparent 70%)",
                  borderRadius: "24px",
                  filter: "blur(30px)",
                  zIndex: -1,
                }}
              />
            </Box>
          )}

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 1 }}
            style={{ width: isMobile ? "100%" : undefined }}
          >
            <Typography
              sx={{
                fontWeight: 600,
                letterSpacing: "0.15em",
                mb: 3,
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                textTransform: "uppercase",
                fontSize: "clamp(1.8rem, 4vw, 3.5rem)",
                // Use darker, high-contrast color on mobile where background is light
                color: isMobile ? "#3C1F0E" : "#F3E3CC",
                textShadow: isMobile ? "none" : "0 2px 12px rgba(60,31,14,0.4)",
              }}
            >
              {currentPage.title}
            </Typography>
            <Typography
              sx={{
                fontFamily: '"Inter", sans-serif',
                fontSize: "clamp(1rem, 2.5vw, 1.3rem)",
                color: isMobile ? "#4A2C17" : "rgba(243,227,204,0.9)",
                maxWidth: "600px",
                lineHeight: 1.6,
                mx: "auto",
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
