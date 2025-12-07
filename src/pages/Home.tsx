import Nav from "../components/common/Nav";
import LandingPage from "../components/home/LandingPage";
import EventsSection from "../components/home/eventSection";
import TeamSection from "../components/home/TeamSection";
import Footer from "../components/common/Footer";
import { HomeSEO } from "../config/seo.presets";
import {
  Box,
  Typography,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import BgImage from "../assets/images/hero-bg.jpg";
import Callicon from "../components/icons/CalendarIcon";
import SocialMedia from "../components/common/SocialFloatingMenu";
import { useEffect, useState, useMemo, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { useApiWithCache } from "../hooks/useApi";
import { specialsService } from "../services/specials.service";
import { getImageUrl } from "../services/api";
import type { Special, DayOfWeek } from "../types/api.types";

// Transform Special to popup card format
interface PopupCard {
  title: string;
  popupImg: string;
  type: string;
}

// Session storage key for popup visibility
const POPUP_SESSION_KEY = "brooklin_popup_shown";

// Get current day of week in lowercase (based on Canadian EST timezone)
const getCurrentDayOfWeek = (): DayOfWeek => {
  const days: DayOfWeek[] = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ] as DayOfWeek[];
  // Use Canadian timezone to get the correct day
  const now = new Date();
  const canadaDay = new Date(
    now.toLocaleString("en-US", { timeZone: "America/Toronto" })
  );
  return days[canadaDay.getDay()];
};

// Check if a special should be shown in the popup
// Only show: seasonal, game_time, chef, and current day's daily special
const shouldShowInPopup = (special: Special): boolean => {
  if (!special.isActive) return false;

  const now = new Date();

  // For specials with display date range, check if within range
  if (special.displayStartDate && special.displayEndDate) {
    const startDate = new Date(special.displayStartDate);
    const endDate = new Date(special.displayEndDate);
    if (now < startDate || now > endDate) return false;
  }

  // Show seasonal, game_time, and chef specials
  if (
    special.type === "seasonal" ||
    special.type === "game_time" ||
    special.type === "chef"
  ) {
    return true;
  }

  // For daily specials, only show if it matches current day
  if (special.type === "daily" && special.dayOfWeek) {
    const currentDay = getCurrentDayOfWeek();
    return special.dayOfWeek.toLowerCase() === currentDay;
  }

  return false;
};

// Premium Hero Middle Section Component
const HeroMiddleSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Reduce particle count on mobile for performance
  const particleCount = isMobile ? 8 : 20;

  useEffect(() => {
    if (isInView && contentRef.current) {
      const elements = contentRef.current.querySelectorAll(".hero-animate");
      gsap.fromTo(
        elements,
        {
          opacity: 0,
          y: 50,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
        }
      );
    }
  }, [isInView]);

  return (
    <Box
      ref={sectionRef}
      sx={{
        minHeight: { xs: "70vh", sm: "80vh", md: "90vh" },
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        px: { xs: 3, sm: 5 },
        py: { xs: 10, md: 12 },
        backgroundImage: `url(${BgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        // Fixed attachment doesn't work on iOS Safari, use scroll on mobile
        backgroundAttachment: { xs: "scroll", md: "fixed" },
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "linear-gradient(180deg, rgba(26,13,10,0.9) 0%, rgba(60,31,14,0.75) 30%, rgba(74,44,23,0.7) 50%, rgba(60,31,14,0.75) 70%, rgba(26,13,10,0.9) 100%)",
          zIndex: 1,
        },
      }}
    >
      {/* Decorative floating particles - reduced on mobile */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        {[...Array(particleCount)].map((_, i) => (
          <Box
            key={i}
            component={motion.div}
            animate={{
              y: [0, -40, 0],
              x: [0, i % 2 === 0 ? 15 : -15, 0],
              opacity: [0.1, 0.4, 0.1],
            }}
            transition={{
              duration: 6 + i * 0.3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.2,
            }}
            sx={{
              position: "absolute",
              width: `${3 + (i % 4) * 2}px`,
              height: `${3 + (i % 4) * 2}px`,
              borderRadius: "50%",
              background: i % 3 === 0 ? "#D9A756" : "rgba(255,253,251,0.4)",
              top: `${5 + i * (isMobile ? 10 : 4.5)}%`,
              left: `${3 + i * (isMobile ? 10 : 5)}%`,
            }}
          />
        ))}
      </Box>

      {/* Decorative Rings - hide on mobile for performance */}
      {!isMobile && (
        <>
          <Box
            component={motion.div}
            animate={{ rotate: 360 }}
            transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
            sx={{
              position: "absolute",
              width: { xs: "300px", md: "500px" },
              height: { xs: "300px", md: "500px" },
              border: "1px solid rgba(217,167,86,0.15)",
              borderRadius: "50%",
              zIndex: 2,
              pointerEvents: "none",
            }}
          />
          <Box
            component={motion.div}
            animate={{ rotate: -360 }}
            transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
            sx={{
              position: "absolute",
              width: { xs: "350px", md: "600px" },
              height: { xs: "350px", md: "600px" },
              border: "1px solid rgba(217,167,86,0.08)",
              borderRadius: "50%",
              zIndex: 2,
              pointerEvents: "none",
            }}
          />
        </>
      )}

      {/* Content */}
      <Box
        ref={contentRef}
        sx={{
          position: "relative",
          zIndex: 3,
          maxWidth: "900px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: { xs: 3, md: 4 },
        }}
      >
        {/* Decorative Top Element */}
        <Box
          className="hero-animate"
          sx={{
            width: 80,
            height: 3,
            background:
              "linear-gradient(90deg, transparent, #D9A756, transparent)",
            position: "relative",
            opacity: 0,
            "&::before, &::after": {
              content: '""',
              position: "absolute",
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#D9A756",
              top: "50%",
              transform: "translateY(-50%)",
              boxShadow: "0 0 15px rgba(217,167,86,0.6)",
            },
            "&::before": { left: -4 },
            "&::after": { right: -4 },
          }}
        />

        {/* Subtitle */}
        <Typography
          className="hero-animate"
          sx={{
            color: "#D9A756",
            letterSpacing: "0.35em",
            fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.85rem" },
            fontFamily: '"Inter", sans-serif',
            fontWeight: 600,
            textTransform: "uppercase",
            opacity: 0,
            "&::before, &::after": {
              content: '"◆"',
              position: "relative",
              mx: 2,
              opacity: 0.6,
              fontSize: "0.5em",
            },
          }}
        >
          Est. 2014
        </Typography>

        {/* Main Title */}
        <Typography
          className="hero-animate"
          variant="h2"
          sx={{
            fontSize: { xs: "2.2rem", sm: "3rem", md: "4rem", lg: "4.5rem" },
            color: "#FFFDFB",
            textShadow: "0 4px 30px rgba(0,0,0,0.4)",
            fontFamily: '"Cormorant Garamond", Georgia, serif',
            fontWeight: 700,
            letterSpacing: "-0.025em",
            lineHeight: 1.1,
            opacity: 0,
          }}
        >
          A Local Favorite for
          <Box
            component="span"
            sx={{
              display: "block",
              background:
                "linear-gradient(135deg, #D9A756 0%, #F5D699 50%, #D9A756 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Over a Decade
          </Box>
        </Typography>

        {/* Decorative Divider */}
        <Box
          className="hero-animate"
          sx={{
            width: { xs: 100, md: 150 },
            height: 1,
            background:
              "linear-gradient(90deg, transparent, rgba(217,167,86,0.5), transparent)",
            opacity: 0,
          }}
        />

        {/* Description */}
        <Typography
          className="hero-animate"
          sx={{
            maxWidth: "650px",
            fontSize: { xs: "1rem", sm: "1.1rem", md: "1.15rem" },
            color: "rgba(255,253,251,0.9)",
            textShadow: "0 2px 10px rgba(0,0,0,0.3)",
            fontFamily: '"Inter", sans-serif',
            lineHeight: 1.85,
            fontWeight: 400,
            letterSpacing: "0.01em",
            px: { xs: 2, md: 0 },
            opacity: 0,
          }}
        >
          Experience the warmth of our classic pub atmosphere, where great food,
          cold drinks, and unforgettable moments come together. A place where
          neighbors become friends and every visit feels like coming home.
        </Typography>

        {/* CTA Buttons */}
        <Box
          className="hero-animate"
          sx={{
            display: "flex",
            gap: { xs: 2, md: 3 },
            flexWrap: "wrap",
            justifyContent: "center",
            mt: 2,
            opacity: 0,
          }}
        >
          <Button
            component={motion.button}
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/menu")}
            sx={{
              px: { xs: 4, md: 5 },
              py: { xs: 1.75, md: 2 },
              minHeight: { xs: 52, md: "auto" }, // Touch-friendly height
              background: "linear-gradient(135deg, #D9A756 0%, #B08030 100%)",
              border: "none",
              borderRadius: "50px",
              color: "#FFFDFB",
              fontFamily: '"Inter", sans-serif',
              fontSize: { xs: "0.9rem", md: "0.95rem" },
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              boxShadow: "0 10px 30px rgba(217,167,86,0.4)",
              transition: "all 0.4s ease",
              position: "relative",
              overflow: "hidden",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: "-100%",
                width: "100%",
                height: "100%",
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)",
                transition: "left 0.5s",
              },
              "&:hover": {
                boxShadow: "0 15px 40px rgba(217,167,86,0.5)",
                "&::before": {
                  left: "100%",
                },
              },
              "&:active": {
                boxShadow: "0 5px 20px rgba(217,167,86,0.4)",
              },
            }}
          >
            Explore Menu
          </Button>

          <Button
            component={motion.button}
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/about")}
            sx={{
              px: { xs: 4, md: 5 },
              py: { xs: 1.75, md: 2 },
              minHeight: { xs: 52, md: "auto" }, // Touch-friendly height
              background: "transparent",
              border: "2px solid rgba(217,167,86,0.6)",
              borderRadius: "50px",
              color: "#D9A756",
              fontFamily: '"Inter", sans-serif',
              fontSize: { xs: "0.9rem", md: "0.95rem" },
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              transition: "all 0.4s ease",
              backdropFilter: "blur(10px)",
              "&:hover": {
                background: "rgba(217,167,86,0.15)",
                borderColor: "#D9A756",
                boxShadow: "0 8px 25px rgba(217,167,86,0.2)",
              },
              "&:active": {
                background: "rgba(217,167,86,0.25)",
              },
            }}
          >
            Our Story
          </Button>
        </Box>

        {/* Bottom Decorative Element */}
        <Box
          className="hero-animate"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mt: 4,
            opacity: 0,
          }}
        >
          <Box
            sx={{ width: 30, height: 1, background: "rgba(217,167,86,0.4)" }}
          />
          <Typography
            sx={{
              color: "rgba(217,167,86,0.7)",
              fontSize: "0.75rem",
              fontFamily: '"Inter", sans-serif',
              fontWeight: 600,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}
          >
            Brooklin, Ontario
          </Typography>
          <Box
            sx={{ width: 30, height: 1, background: "rgba(217,167,86,0.4)" }}
          />
        </Box>
      </Box>
    </Box>
  );
};

const Home = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Reduce popup particle count on mobile for performance
  const popupParticleCount = isMobile ? 6 : 15;

  // Fetch active specials from backend
  const { data: specialsData } = useApiWithCache<Special[]>(
    "active-specials-popup",
    () => specialsService.getActiveSpecials()
  );

  // Filter specials for popup display
  const popupCards = useMemo((): PopupCard[] => {
    if (!specialsData || specialsData.length === 0) return [];

    return specialsData.filter(shouldShowInPopup).map((special) => ({
      title: special.title,
      popupImg:
        getImageUrl(special.imageUrls?.[1]) ||
        getImageUrl(special.imageUrls?.[0]) ||
        "https://images.template.net/278326/Restaurant-Menu-Template-edit-online.png",
      type: special.type,
    }));
  }, [specialsData]);

  const [showSlideshow, setShowSlideshow] = useState(false);
  const [slideshowIndex, setSlideshowIndex] = useState(0);
  const hasCheckedSession = useRef(false);

  // Show popup only once per session (on page refresh)
  useEffect(() => {
    // Only check once to prevent multiple triggers
    if (hasCheckedSession.current) return;

    if (popupCards.length > 0) {
      // Check if popup was already shown in this session
      const popupAlreadyShown = sessionStorage.getItem(POPUP_SESSION_KEY);

      if (!popupAlreadyShown) {
        setShowSlideshow(true);
        setSlideshowIndex(0);
        // Mark popup as shown for this session
        sessionStorage.setItem(POPUP_SESSION_KEY, "true");
      }
      hasCheckedSession.current = true;
    }
  }, [popupCards.length]);

  useEffect(() => {
    if (!showSlideshow || popupCards.length <= 1) return;
    const t = setInterval(
      () => setSlideshowIndex((i) => (i + 1) % popupCards.length),
      4000
    );
    return () => clearInterval(t);
  }, [showSlideshow, popupCards.length]);

  return (
    <Box sx={{ minHeight: "100vh", background: "transparent" }}>
      <HomeSEO />
      <Nav />
      {showSlideshow &&
        popupCards.length > 0 &&
        createPortal(
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
                style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100dvh", // Use dvh for better mobile viewport handling
                background: "transparent",
                backdropFilter: "blur(20px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 999999999,
                padding: isMobile ? "16px" : "24px",
              }}
              onClick={() => setShowSlideshow(false)}
            >
              {/* Animated background elements - reduced on mobile */}
              {!isMobile && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    pointerEvents: "none",
                    overflow: "hidden",
                  }}
                >
                  {/* Floating gold particles */}
                  {[...Array(popupParticleCount)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        y: [0, -30, 0],
                        x: [0, i % 2 === 0 ? 15 : -15, 0],
                        opacity: [0.1, 0.4, 0.1],
                      }}
                      transition={{
                        duration: 4 + i * 0.3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.15,
                      }}
                      style={{
                        position: "absolute",
                        width: `${4 + (i % 3) * 2}px`,
                        height: `${4 + (i % 3) * 2}px`,
                        borderRadius: "50%",
                        background: "#D9A756",
                        top: `${8 + i * 6}%`,
                        left: `${5 + i * 6}%`,
                        boxShadow: "0 0 10px rgba(217,167,86,0.5)",
                      }}
                    />
                  ))}

                  {/* Large ambient glow */}
                  <div
                    style={{
                      position: "absolute",
                      top: "20%",
                      left: "10%",
                      width: "400px",
                      height: "400px",
                      background:
                        "radial-gradient(circle, rgba(217,167,86,0.15) 0%, transparent 70%)",
                      borderRadius: "50%",
                      filter: "blur(60px)",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      bottom: "10%",
                      right: "10%",
                      width: "350px",
                      height: "350px",
                      background:
                        "radial-gradient(circle, rgba(139,90,43,0.12) 0%, transparent 70%)",
                      borderRadius: "50%",
                      filter: "blur(60px)",
                    }}
                  />
                </motion.div>
              )}

              <motion.div
                onClick={(e) => e.stopPropagation()}
                initial={{ scale: 0.8, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 50 }}
                transition={{ type: "spring", stiffness: 120, damping: 20 }}
                style={{
                  position: "relative",
                  width: isMobile ? "calc(100% - 24px)" : "min(900px, 90vw)",
                  maxWidth: isMobile ? "95vw" : "900px",
                  height: "auto",
                  maxHeight: isMobile ? "calc(100dvh - 48px)" : "90vh",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  background: "transparent",
                  borderRadius: isMobile ? "20px" : "32px",
                  padding: isMobile ? "12px" : "24px",
                  boxShadow:
                    "0 40px 100px rgba(0,0,0,0.4), 0 0 0 1px rgba(217,167,86,0.3), inset 0 1px 0 rgba(255,255,255,0.8)",
                  overflow: "hidden",
                }}
              >
                {/* Top decorative accent */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "150px",
                    height: "4px",
                    background:
                      "linear-gradient(90deg, transparent, #D9A756, transparent)",
                    borderRadius: "0 0 4px 4px",
                  }}
                />

                {/* Corner decorations - hide on mobile */}
                {!isMobile && (
                  <>
                    <div
                      style={{
                        position: "absolute",
                        top: "16px",
                        left: "16px",
                        width: "40px",
                        height: "40px",
                        borderLeft: "2px solid rgba(217,167,86,0.4)",
                        borderTop: "2px solid rgba(217,167,86,0.4)",
                        borderRadius: "8px 0 0 0",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        top: "16px",
                        right: "16px",
                        width: "40px",
                        height: "40px",
                        borderRight: "2px solid rgba(217,167,86,0.4)",
                        borderTop: "2px solid rgba(217,167,86,0.4)",
                        borderRadius: "0 8px 0 0",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        bottom: "16px",
                        left: "16px",
                        width: "40px",
                        height: "40px",
                        borderLeft: "2px solid rgba(217,167,86,0.4)",
                        borderBottom: "2px solid rgba(217,167,86,0.4)",
                        borderRadius: "0 0 0 8px",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        bottom: "16px",
                        right: "16px",
                        width: "40px",
                        height: "40px",
                        borderRight: "2px solid rgba(217,167,86,0.4)",
                        borderBottom: "2px solid rgba(217,167,86,0.4)",
                        borderRadius: "0 0 8px 0",
                      }}
                    />
                  </>
                )}

                {/* Close button - premium style with larger touch target on mobile */}
                <motion.button
                  onClick={() => setShowSlideshow(false)}
                  aria-label="Close popup"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  style={{
                    position: "absolute",
                    top: isMobile ? "12px" : "20px",
                    right: isMobile ? "12px" : "20px",
                    width: isMobile ? "48px" : "44px",
                    height: isMobile ? "48px" : "44px",
                    borderRadius: "50%",
                    background:
                      "linear-gradient(135deg, rgba(106,58,30,0.1) 0%, rgba(106,58,30,0.05) 100%)",
                    border: "1px solid rgba(106,58,30,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    zIndex: 10,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  }}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#6A3A1E"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  >
                    <path d="M18 6L6 18" />
                    <path d="M6 6l12 12" />
                  </svg>
                </motion.button>

                {/* Header badge */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "16px",
                    marginTop: "8px",
                  }}
                >
                  <div
                    style={{
                      width: "30px",
                      height: "1px",
                      background:
                        "linear-gradient(90deg, transparent, #D9A756)",
                    }}
                  />
                  <span
                    style={{
                      fontFamily: '"Inter", sans-serif',
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      letterSpacing: "0.25em",
                      textTransform: "uppercase",
                      color: "#D9A756",
                    }}
                  >
                    ✦ Specials ✦
                  </span>
                  <div
                    style={{
                      width: "30px",
                      height: "1px",
                      background:
                        "linear-gradient(90deg, #D9A756, transparent)",
                    }}
                  />
                </motion.div>

                {/* Image container with premium frame */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  style={{
                    position: "relative",
                    width: "100%",
                    flex: 1,
                    minHeight: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: isMobile ? "8px" : "12px",
                  }}
                >
                  {/* Stack all images and crossfade between them - no close/open effect */}
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {popupCards.map((card, idx) => (
                      <motion.img
                        key={idx}
                        src={card.popupImg}
                        alt={card.title}
                        initial={false}
                        animate={{
                          opacity: idx === slideshowIndex ? 1 : 0,
                          scale: idx === slideshowIndex ? 1 : 0.98,
                        }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        style={{
                          position: idx === 0 ? "relative" : "absolute",
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                          borderRadius: isMobile ? "12px" : "20px",
                          boxShadow:
                            idx === slideshowIndex
                              ? "0 20px 60px rgba(106,58,30,0.25), 0 0 0 1px rgba(217,167,86,0.2)"
                              : "none",
                          pointerEvents:
                            idx === slideshowIndex ? "auto" : "none",
                        }}
                      />
                    ))}
                  </div>

                  {/* Image glow effect - hide on mobile */}
                  {!isMobile && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: "0",
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: "60%",
                        height: "40px",
                        background:
                          "radial-gradient(ellipse, rgba(217,167,86,0.2) 0%, transparent 70%)",
                        filter: "blur(15px)",
                        pointerEvents: "none",
                      }}
                    />
                  )}
                </motion.div>

                {/* Card info and navigation - premium style */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: isMobile ? "12px" : "16px",
                    paddingTop: isMobile ? "12px" : "16px",
                    borderTop: "1px solid rgba(217,167,86,0.2)",
                  }}
                >
                  {/* Left arrow - premium with larger touch target on mobile */}
                  <motion.button
                    aria-label="Previous slide"
                    whileHover={{ scale: 1.1, x: -3 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSlideshowIndex(
                        (i) => (i - 1 + popupCards.length) % popupCards.length
                      );
                    }}
                    style={{
                      width: isMobile ? "52px" : "50px",
                      height: isMobile ? "52px" : "50px",
                      borderRadius: "50%",
                      background:
                        "linear-gradient(135deg, #D9A756 0%, #B08030 100%)",
                      border: "none",
                      color: "#FFFDFB",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 8px 24px rgba(217,167,86,0.35)",
                      flexShrink: 0,
                    }}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    >
                      <path d="M15 18l-6-6 6-6" />
                    </svg>
                  </motion.button>

                  {/* Title and dots */}
                  <div
                    style={{
                      textAlign: "center",
                      flex: 1,
                      padding: isMobile ? "0 12px" : "0 20px",
                      minWidth: 0,
                    }}
                  >
                    <AnimatePresence mode="wait">
                      <motion.h3
                        key={slideshowIndex}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        style={{
                          margin: "0 0 12px 0",
                          fontFamily: '"Cormorant Garamond", Georgia, serif',
                          fontSize: isMobile
                            ? "clamp(1.1rem, 4vw, 1.4rem)"
                            : "clamp(1.3rem, 3vw, 1.8rem)",
                          fontWeight: 700,
                          color: "#3C1F0E",
                          letterSpacing: "-0.01em",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {popupCards[slideshowIndex].title}
                      </motion.h3>
                    </AnimatePresence>

                    {/* Premium pagination dots */}
                    {popupCards.length > 1 && (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          gap: isMobile ? "8px" : "10px",
                          alignItems: "center",
                        }}
                      >
                        {popupCards.map((_, idx) => (
                          <motion.button
                            key={idx}
                            aria-label={`Go to slide ${idx + 1}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSlideshowIndex(idx);
                            }}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            animate={{
                              width:
                                idx === slideshowIndex
                                  ? isMobile
                                    ? 24
                                    : 28
                                  : isMobile
                                  ? 12
                                  : 10,
                              background:
                                idx === slideshowIndex
                                  ? "linear-gradient(90deg, #D9A756, #B08030)"
                                  : "rgba(106,58,30,0.2)",
                            }}
                            transition={{ duration: 0.3 }}
                            style={{
                              height: isMobile ? "12px" : "10px",
                              borderRadius: "6px",
                              border: "none",
                              cursor: "pointer",
                              boxShadow:
                                idx === slideshowIndex
                                  ? "0 2px 8px rgba(217,167,86,0.4)"
                                  : "none",
                              // Larger touch target with padding
                              padding: isMobile ? "4px" : 0,
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right arrow - premium with larger touch target on mobile */}
                  <motion.button
                    aria-label="Next slide"
                    whileHover={{ scale: 1.1, x: 3 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSlideshowIndex((i) => (i + 1) % popupCards.length);
                    }}
                    style={{
                      width: isMobile ? "52px" : "50px",
                      height: isMobile ? "52px" : "50px",
                      borderRadius: "50%",
                      background:
                        "linear-gradient(135deg, #D9A756 0%, #B08030 100%)",
                      border: "none",
                      color: "#FFFDFB",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 8px 24px rgba(217,167,86,0.35)",
                      flexShrink: 0,
                    }}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    >
                      <path d="M9 6l6 6-6 6" />
                    </svg>
                  </motion.button>
                </motion.div>

                {/* Bottom CTA */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  style={{
                    marginTop: isMobile ? "12px" : "16px",
                    textAlign: "center",
                    paddingBottom: isMobile ? "env(safe-area-inset-bottom)" : 0,
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      fontFamily: '"Inter", sans-serif',
                      fontSize: isMobile ? "0.75rem" : "0.8rem",
                      color: "rgba(106,58,30,0.6)",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {isMobile
                      ? "Tap anywhere to continue"
                      : "Click anywhere to continue"}
                  </p>
                </motion.div>
              </motion.div>
            </motion.div>
          </AnimatePresence>,
          document.body
        )}{" "}
      <LandingPage />
      <Callicon />
      <SocialMedia />
      <HeroMiddleSection />
      <EventsSection />
      <TeamSection />
      <Footer />
    </Box>
  );
};

export default Home;
