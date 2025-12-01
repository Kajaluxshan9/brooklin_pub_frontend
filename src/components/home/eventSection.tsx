import { useState, useMemo, useRef, useEffect } from "react";
import { Box, Typography, Button, useMediaQuery, useTheme } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useApiWithCache } from "../../hooks/useApi";
import { eventsService } from "../../services/events.service";
import { getImageUrl } from "../../services/api";
import type { Event } from "../../types/api.types";

// --- Utility Functions ---

const shouldDisplayEvent = (event: Event): boolean => {
  if (!event.isActive) return false;
  const now = new Date();
  if (event.displayStartDate && event.displayEndDate) {
    const displayStart = new Date(event.displayStartDate);
    const displayEnd = new Date(event.displayEndDate);
    return now >= displayStart && now <= displayEnd;
  }
  return true;
};

const formatEventDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
};

const formatEventTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const getEventTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    live_music: "Live Music",
    sports_viewing: "Sports",
    trivia_night: "Trivia Night",
    karaoke: "Karaoke",
    private_party: "Private Event",
    special_event: "Special Event",
  };
  return labels[type] || "Event";
};

// --- Components ---

const EventsSection = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [activeIndex, setActiveIndex] = useState<number>(0);

  // Fetch active events
  const { data: eventsData, loading } = useApiWithCache<Event[]>(
    "active-events-home-slices",
    () => eventsService.getActiveEvents()
  );

  // Filter and sort events, taking up to 5
  const displayableEvents = useMemo((): Event[] => {
    if (!eventsData || eventsData.length === 0) return [];
    return eventsData
      .filter(shouldDisplayEvent)
      .sort(
        (a, b) =>
          new Date(a.eventStartDate).getTime() -
          new Date(b.eventStartDate).getTime()
      )
      .slice(0, 5);
  }, [eventsData]);

  if (loading || displayableEvents.length === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "auto",
        background:
          "linear-gradient(180deg, #FDF8F3 0%, #F5EBE0 30%, #E8D5C4 60%, #F5EBE0 85%, #FDF8F3 100%)",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
        py: { xs: 6, md: 8 },
      }}
    >
      {/* Background Decorative Elements */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        <Box
          component={motion.div}
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: "linear",
          }}
          sx={{
            position: "absolute",
            top: "-20%",
            right: "-10%",
            width: "600px",
            height: "600px",
            border: "1px solid rgba(217,167,86,0.1)",
            borderRadius: "50%",
          }}
        />
        <Box
          component={motion.div}
          animate={{
            scale: [1, 1.05, 1],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 50,
            repeat: Infinity,
            ease: "linear",
          }}
          sx={{
            position: "absolute",
            bottom: "-15%",
            left: "-8%",
            width: "500px",
            height: "500px",
            border: "1px solid rgba(217,167,86,0.08)",
            borderRadius: "50%",
          }}
        />
      </Box>

      {/* Header Section */}
      <Box
        sx={{
          textAlign: "center",
          position: "relative",
          width: "100%",
          maxWidth: "1200px",
          px: 3,
          mx: "auto",
          zIndex: 1,
          mb: 4,
        }}
      >
        {/* Animated Top Accent */}
        <Box
          component={motion.div}
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          sx={{
            width: 100,
            height: 3,
            background:
              "linear-gradient(90deg, transparent, #D9A756, transparent)",
            mx: "auto",
            mb: 2,
            position: "relative",
            "&::before, &::after": {
              content: '""',
              position: "absolute",
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: "#D9A756",
              top: "50%",
              transform: "translateY(-50%)",
              boxShadow: "0 0 10px rgba(217,167,86,0.5)",
            },
            "&::before": { left: -5 },
            "&::after": { right: -5 },
          }}
        />

        <Typography
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          variant="overline"
          sx={{
            color: "#D9A756",
            letterSpacing: "0.5em",
            fontSize: { xs: "0.75rem", md: "0.9rem" },
            fontFamily: '"Inter", sans-serif',
            fontWeight: 700,
            mb: 1,
            display: "block",
            textTransform: "uppercase",
            position: "relative",
            "&::before, &::after": {
              content: '"◆"',
              position: "relative",
              mx: 2,
              opacity: 0.5,
              fontSize: "0.6em",
            },
          }}
        >
          What's Happening
        </Typography>

        <Typography
          component={motion.h2}
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          sx={{
            fontFamily: '"Cormorant Garamond", Georgia, serif',
            fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4rem" },
            fontWeight: 700,
            color: "#4A2C17",
            mb: 2,
            textShadow: "0 4px 30px rgba(106,58,30,0.15)",
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
            background: "linear-gradient(180deg, #4A2C17 0%, #6A3A1E 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Upcoming Events
        </Typography>

        <Typography
          component={motion.p}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          sx={{
            fontFamily: '"Inter", sans-serif',
            fontSize: { xs: "0.95rem", md: "1.05rem" },
            color: "#6A3A1E",
            maxWidth: 650,
            mx: "auto",
            lineHeight: 1.8,
            fontWeight: 400,
            px: 3,
            mb: 3,
          }}
        >
          Unforgettable experiences, live entertainment, and celebrations that
          bring our community together
        </Typography>
      </Box>

      {/* Accordion Container */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          width: "100%",
          maxWidth: "1200px",
          mx: "auto",
          height: { xs: "auto", md: "450px" },
          minHeight: { xs: "500px", md: "450px" },
          px: { xs: 2, md: 4 },
          pb: { xs: 4, md: 4 },
          gap: { xs: 1, md: 2 },
          zIndex: 2,
        }}
      >
        {displayableEvents.map((event, index) => {
          const isActive = index === activeIndex;
          const imageUrl = event.imageUrls?.[0]
            ? getImageUrl(event.imageUrls[0])
            : "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800&q=80";

          return (
            <Box
              key={event.id}
              component={motion.div}
              layout
              onClick={() => setActiveIndex(index)}
              onHoverStart={() => !isMobile && setActiveIndex(index)}
              initial={false}
              animate={{
                flex: isActive ? (isMobile ? 3 : 3.5) : 1,
                opacity: 1,
              }}
              transition={{ type: "spring", stiffness: 200, damping: 30 }}
              sx={{
                position: "relative",
                borderRadius: { xs: "20px", md: "25px" },
                overflow: "hidden",
                cursor: "pointer",
                minHeight: { xs: isActive ? "280px" : "60px", md: "auto" },
                boxShadow: isActive
                  ? "0 15px 40px rgba(106,58,30,0.3)"
                  : "0 4px 10px rgba(106,58,30,0.1)",
                border: isActive
                  ? "1px solid rgba(217,167,86,0.8)"
                  : "1px solid rgba(217,167,86,0.3)",
              }}
            >
              {/* Background Image Layer (Blurred for Fill) */}
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage: `url(${imageUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  filter: "blur(20px) brightness(0.5)",
                  opacity: 0.8,
                }}
              />

              {/* Main Image (Fully Visible) */}
              <Box
                component={motion.div}
                animate={{
                  scale: isActive ? 1 : 1.05,
                  filter: isActive
                    ? "brightness(1)"
                    : "brightness(0.6) grayscale(0.2)",
                }}
                transition={{ duration: 0.8 }}
                sx={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage: `url(${imageUrl})`,
                  backgroundSize: isActive ? "contain" : "cover",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                  zIndex: 1,
                }}
              />

              {/* Gradient Overlay */}
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  background: isActive
                    ? "linear-gradient(0deg, rgba(74,44,23,0.9) 0%, rgba(74,44,23,0.3) 50%, transparent 100%)"
                    : "linear-gradient(0deg, rgba(74,44,23,0.8) 0%, rgba(74,44,23,0.4) 100%)",
                  transition: "background 0.5s",
                  zIndex: 2,
                }}
              />

              {/* Vertical Text (Desktop Inactive State) */}
              {!isMobile && !isActive && (
                <Box
                  component={motion.div}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.2 }}
                  sx={{
                    position: "absolute",
                    bottom: 30,
                    left: "50%",
                    transform: "translateX(-50%)",
                    writingMode: "vertical-rl",
                    textOrientation: "mixed",
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    whiteSpace: "nowrap",
                    zIndex: 3,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      color: "rgba(255,253,251,0.8)",
                      fontFamily: '"Inter", sans-serif',
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      fontSize: "0.8rem",
                    }}
                  >
                    {formatEventDate(event.eventStartDate)}
                  </Typography>
                  <Box
                    sx={{ width: "1px", height: "30px", bgcolor: "#D9A756" }}
                  />
                  <Typography
                    variant="h5"
                    sx={{
                      color: "#FFFDFB",
                      fontFamily: '"Cormorant Garamond", serif',
                      fontWeight: 600,
                      fontSize: "1.2rem",
                    }}
                  >
                    {event.title}
                  </Typography>
                </Box>
              )}

              {/* Content (Active State) */}
              <AnimatePresence>
                {isActive && (
                  <Box
                    component={motion.div}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      p: { xs: 3, md: 4 },
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      gap: 1.5,
                      zIndex: 3,
                    }}
                  >
                    {/* Badge */}
                    <Box
                      sx={{
                        px: 1.5,
                        py: 0.5,
                        borderRadius: "20px",
                        background: "rgba(255,253,251,0.15)",
                        border: "1px solid rgba(255,253,251,0.3)",
                        backdropFilter: "blur(4px)",
                      }}
                    >
                      <Typography
                        sx={{
                          color: "#D9A756",
                          fontSize: "0.7rem",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                        }}
                      >
                        {getEventTypeLabel(event.type)}
                      </Typography>
                    </Box>

                    {/* Title */}
                    <Typography
                      variant="h3"
                      sx={{
                        fontFamily: '"Cormorant Garamond", serif',
                        color: "#FFFDFB",
                        fontSize: { xs: "1.8rem", md: "2.8rem" },
                        fontWeight: 700,
                        lineHeight: 1.1,
                        maxWidth: "800px",
                        textShadow: "0 2px 10px rgba(0,0,0,0.3)",
                      }}
                    >
                      {event.title}
                    </Typography>

                    {/* Date & Time */}
                    <Typography
                      sx={{
                        color: "rgba(255,255,255,0.9)",
                        fontFamily: '"Inter", sans-serif',
                        fontSize: "1rem",
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <span style={{ color: "#D9A756" }}>📅</span>{" "}
                      {formatEventDate(event.eventStartDate)}
                      <span
                        style={{
                          margin: "0 10px",
                          color: "rgba(255,255,255,0.3)",
                        }}
                      >
                        |
                      </span>
                      <span style={{ color: "#D9A756" }}>⏰</span>{" "}
                      {formatEventTime(event.eventStartDate)}
                    </Typography>

                    {/* Description */}
                    <Typography
                      sx={{
                        color: "rgba(255,255,255,0.8)",
                        maxWidth: "500px",
                        lineHeight: 1.5,
                        fontSize: "0.9rem",
                        display: { xs: "none", sm: "block" },
                      }}
                    >
                      {event.description}
                    </Typography>

                    {/* Action Button */}
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate("/events");
                      }}
                      sx={{
                        mt: 1,
                        background: "linear-gradient(135deg, #D9A756 0%, #B08030 100%)",
                        color: "#FFF",
                        px: 3,
                        py: 1,
                        borderRadius: "50px",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        fontSize: "0.75rem",
                        boxShadow: "0 10px 20px rgba(217,167,86,0.3)",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: "0 15px 30px rgba(217,167,86,0.4)",
                        },
                      }}
                    >
                      View Details
                    </Button>
                  </Box>
                )}
              </AnimatePresence>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default EventsSection;