"use client";
import Nav from "../components/common/Nav";
import AdditionalSpecial from "../components/special/additionalSpecial";
import LandingPage from "../components/home/LandingPage";
import Footer from "../components/common/Footer";
import { Box, Typography } from "@mui/material";
import BgImage from "../assets/components/image-2.jpg";
import Callicon from "../components/icons/CalendarIcon";
import SocialMedia from "../components/common/SocialFloatingMenu";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { exportedDailySpecials } from "../components/special/SpecialDisplay";

const Home = () => {
  useEffect(() => {
    // Home no longer handles global specials loading or notifications;
    // that logic runs at the app level so the floating badge appears on every page.
  }, []);

  // Slideshow for new specials on Home page
  const newCards = exportedDailySpecials?.filter((c) => c.status === "new") || [];
  const [showSlideshow, setShowSlideshow] = useState(false);
  const [slideshowIndex, setSlideshowIndex] = useState(0);

  useEffect(() => {
    if (newCards.length > 0) {
      setShowSlideshow(true);
      setSlideshowIndex(0);
    }
  }, []);

  useEffect(() => {
    if (!showSlideshow || newCards.length <= 1) return;
    const t = setInterval(() => setSlideshowIndex((i) => (i + 1) % newCards.length), 3000);
    return () => clearInterval(t);
  }, [showSlideshow, newCards.length]);

  return (
    <div>
      <Nav />
      {showSlideshow && newCards.length > 0 &&
        createPortal(
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                background: "rgba(0,0,0,0.9)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 999999999,
              }}
              onClick={() => setShowSlideshow(false)}
            >
              <motion.div
                onClick={(e) => e.stopPropagation()}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", stiffness: 110, damping: 14 }}
                style={{
                  position: "relative",
                  width: "min(1100px, 92vw)",
                  height: "min(760px, 86vh)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                  <style>{`.slideshow-arrow { top: auto !important; bottom: 18px !important; transform: none !important; }`}</style>
                <button
                  onClick={() => setShowSlideshow(false)}
                  style={{
                    position: "absolute",
                    top: "20px",
                    right: "20px",
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    backdropFilter: "blur(10px)",
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M18 6L6 18" />
                    <path d="M6 6l12 12" />
                  </svg>
                </button>

                <button
                  onClick={(e) => { e.stopPropagation(); setSlideshowIndex((i) => (i - 1 + newCards.length) % newCards.length); }}
                  style={{
                    position: "absolute",
                    left: "18px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "56px",
                    height: "56px",
                    borderRadius: "8px",
                    background: "rgba(0,0,0,0.35)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "white",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  className="slideshow-arrow left"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>

                <button
                  onClick={(e) => { e.stopPropagation(); setSlideshowIndex((i) => (i + 1) % newCards.length); }}
                  style={{
                    position: "absolute",
                    right: "18px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "56px",
                    height: "56px",
                    borderRadius: "8px",
                    background: "rgba(0,0,0,0.35)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "white",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  className="slideshow-arrow right"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M9 6l6 6-6 6" />
                  </svg>
                </button>

                <img
                  src={newCards[slideshowIndex].popupImg}
                  alt={newCards[slideshowIndex].title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    borderRadius: "12px",
                    boxShadow: "0 18px 60px rgba(0,0,0,0.6)",
                  }}
                />
              </motion.div>
            </motion.div>
          </AnimatePresence>,
          document.body
        )}

      <LandingPage />
      <Callicon />
      <SocialMedia />

      <Box
        sx={{
          minHeight: { xs: "60vh", sm: "70vh", md: "80vh" }, // responsive height
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          px: { xs: 2, sm: 4 },
          backgroundImage: `url(${BgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <Typography
          variant="h3"
          fontWeight={700}
          sx={{
            fontSize: { xs: "1.8rem", sm: "2.5rem", md: "3rem" }, // responsive title
          }}
          gutterBottom
        >
          Your Title Text Here
        </Typography>

        <Typography
          variant="body1"
          sx={{
            maxWidth: "700px",
            fontSize: { xs: "1rem", sm: "1.1rem", md: "1.2rem" }, // responsive paragraph
          }}
        >
          Your description paragraph or message goes here. This text will resize
          smoothly across mobile, tablet, and desktop screens.
        </Typography>
      </Box>

      <AdditionalSpecial />
      <Footer />
    </div>
  );
};

export default Home;
