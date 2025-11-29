import Nav from "../components/common/Nav";
import AdditionalSpecial from "../components/special/AdditionalSpecial";
import LandingPage from "../components/home/LandingPage";
import EventsSection from "../components/home/EventsSection";
import Footer from "../components/common/Footer";
import { Box, Typography } from "@mui/material";
import BgImage from "../assets/images/hero-bg.jpg";
import Callicon from "../components/icons/CalendarIcon";
import SocialMedia from "../components/common/SocialFloatingMenu";
import { useEffect, useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
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

// Get current day of week in lowercase
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
  return days[new Date().getDay()];
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

const Home = () => {
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
    <div>
      <Nav />
      {showSlideshow &&
        popupCards.length > 0 &&
        createPortal(
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                background:
                  "linear-gradient(135deg, rgba(253,248,243,0.97) 0%, rgba(245,235,224,0.95) 50%, rgba(232,213,196,0.97) 100%)",
                backdropFilter: "blur(8px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 999999999,
              }}
              onClick={() => setShowSlideshow(false)}
            >
              {/* Decorative elements */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundImage: `radial-gradient(circle at 20% 30%, rgba(217,167,86,0.2) 0%, transparent 40%),
                                  radial-gradient(circle at 80% 70%, rgba(139,90,43,0.15) 0%, transparent 40%)`,
                  pointerEvents: "none",
                }}
              />

              <motion.div
                onClick={(e) => e.stopPropagation()}
                initial={{ scale: 0.85, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.85, opacity: 0, y: 30 }}
                transition={{ type: "spring", stiffness: 100, damping: 18 }}
                style={{
                  position: "relative",
                  width: "min(1000px, 92vw)",
                  maxHeight: "90vh",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  background:
                    "linear-gradient(180deg, #FFFDFB 0%, #FAF7F2 100%)",
                  borderRadius: "24px",
                  border: "2px solid rgba(217,167,86,0.4)",
                  padding: "20px",
                  boxShadow:
                    "0 24px 80px rgba(106,58,30,0.25), 0 8px 32px rgba(0,0,0,0.15)",
                }}
              >
                {/* Close button - top right corner */}
                <button
                  onClick={() => setShowSlideshow(false)}
                  aria-label="Close popup"
                  style={{
                    position: "absolute",
                    top: "12px",
                    right: "12px",
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    background: "rgba(106,58,30,0.1)",
                    border: "1px solid rgba(106,58,30,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    zIndex: 10,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(106,58,30,0.2)";
                    e.currentTarget.style.transform = "rotate(90deg)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(106,58,30,0.1)";
                    e.currentTarget.style.transform = "rotate(0deg)";
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#6A3A1E"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  >
                    <path d="M18 6L6 18" />
                    <path d="M6 6l12 12" />
                  </svg>
                </button>

                {/* Image container - takes up most of the space */}
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    flex: 1,
                    minHeight: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "8px",
                  }}
                >
                  <img
                    src={popupCards[slideshowIndex].popupImg}
                    alt={popupCards[slideshowIndex].title}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "calc(90vh - 140px)",
                      objectFit: "contain",
                      borderRadius: "16px",
                      boxShadow: "0 8px 32px rgba(106,58,30,0.2)",
                    }}
                  />
                </div>

                {/* Card info and navigation */}
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "12px",
                    paddingTop: "12px",
                    borderTop: "1px solid rgba(217,167,86,0.25)",
                  }}
                >
                  {/* Left arrow */}
                  <button
                    aria-label="Previous slide"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSlideshowIndex(
                        (i) => (i - 1 + popupCards.length) % popupCards.length
                      );
                    }}
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "12px",
                      background: "rgba(217,167,86,0.15)",
                      border: "1px solid rgba(217,167,86,0.3)",
                      color: "#6A3A1E",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(217,167,86,0.3)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background =
                        "rgba(217,167,86,0.15)";
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
                      <path d="M15 18l-6-6 6-6" />
                    </svg>
                  </button>

                  {/* Title and dots */}
                  <div
                    style={{
                      textAlign: "center",
                      flex: 1,
                      padding: "0 16px",
                    }}
                  >
                    <h3
                      style={{
                        margin: "0 0 8px 0",
                        fontFamily: '"Cormorant Garamond", Georgia, serif',
                        fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)",
                        fontWeight: 700,
                        color: "#4A2C17",
                      }}
                    >
                      {popupCards[slideshowIndex].title}
                    </h3>

                    {/* Pagination dots */}
                    {popupCards.length > 1 && (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          gap: "8px",
                        }}
                      >
                        {popupCards.map((_, idx) => (
                          <button
                            key={idx}
                            aria-label={`Go to slide ${idx + 1}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSlideshowIndex(idx);
                            }}
                            style={{
                              width: idx === slideshowIndex ? "24px" : "8px",
                              height: "8px",
                              borderRadius: "4px",
                              background:
                                idx === slideshowIndex
                                  ? "#D9A756"
                                  : "rgba(106,58,30,0.25)",
                              border: "none",
                              cursor: "pointer",
                              transition: "all 0.3s ease",
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right arrow */}
                  <button
                    aria-label="Next slide"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSlideshowIndex((i) => (i + 1) % popupCards.length);
                    }}
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "12px",
                      background: "rgba(217,167,86,0.15)",
                      border: "1px solid rgba(217,167,86,0.3)",
                      color: "#6A3A1E",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(217,167,86,0.3)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background =
                        "rgba(217,167,86,0.15)";
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
                      <path d="M9 6l6 6-6 6" />
                    </svg>
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>,
          document.body
        )}{" "}
      <LandingPage />
      <Callicon />
      <SocialMedia />
      <Box
        sx={{
          minHeight: { xs: "60vh", sm: "70vh", md: "80vh" },
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
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "linear-gradient(135deg, rgba(26,13,10,0.85) 0%, rgba(60,31,14,0.75) 50%, rgba(26,13,10,0.85) 100%)",
          },
        }}
      >
        <Typography
          variant="h3"
          fontWeight={700}
          sx={{
            fontSize: { xs: "1.8rem", sm: "2.5rem", md: "3rem" },
            color: "#F3E3CC",
            textShadow: "2px 2px 8px rgba(0,0,0,0.5)",
            position: "relative",
            zIndex: 1,
            fontFamily: '"Cormorant Garamond", serif',
          }}
          gutterBottom
        >
          A Local Favorite Since 1985
        </Typography>

        <Typography
          variant="body1"
          sx={{
            maxWidth: "700px",
            fontSize: { xs: "1rem", sm: "1.1rem", md: "1.2rem" },
            color: "rgba(243,227,204,0.9)",
            textShadow: "1px 1px 4px rgba(0,0,0,0.5)",
            position: "relative",
            zIndex: 1,
          }}
        >
          Experience the warmth of our classic pub atmosphere, where great food,
          cold drinks, and unforgettable moments come together.
        </Typography>
      </Box>
      <EventsSection />
      <AdditionalSpecial />
      <Footer />
    </div>
  );
};

export default Home;
