import { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useApiWithCache } from "../../hooks/useApi";
import { eventsService } from "../../services/events.service";
import { getImageUrl } from "../../services/api";
import type { Event } from "../../types/api.types";
import MenuBackground from "../menu/MenuBackground";

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
          "linear-gradient(180deg, #FDF8F3 0%, #FAF7F2 50%, #FDF8F3 100%)",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
        py: { xs: 8, md: 12 },
      }}
    >
      {/* Premium Animated Background */}
      <MenuBackground />

      {/* Floating Accent Elements */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          overflow: "hidden",
          zIndex: 0,
        }}
      >
        {/* Large rotating ring */}
        <Box
          component={motion.div}
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 60,
            repeat: Infinity,
            ease: "linear",
          }}
          sx={{
            position: "absolute",
            top: "-15%",
            right: "-10%",
            width: "500px",
            height: "500px",
            border: "1px solid rgba(217,167,86,0.15)",
            borderRadius: "50%",
            "&::before": {
              content: '""',
              position: "absolute",
              inset: 40,
              border: "1px dashed rgba(217,167,86,0.1)",
              borderRadius: "50%",
            },
          }}
        />
        {/* Bottom decorative circle */}
        <Box
          component={motion.div}
          animate={{
            rotate: [360, 0],
          }}
          transition={{
            duration: 80,
            repeat: Infinity,
            ease: "linear",
          }}
          sx={{
            position: "absolute",
            bottom: "-10%",
            left: "-8%",
            width: "400px",
            height: "400px",
            border: "1px solid rgba(217,167,86,0.1)",
            borderRadius: "50%",
          }}
        />
        {/* Floating gold particles */}
        {[...Array(8)].map((_, i) => (
          <Box
            key={i}
            component={motion.div}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.4,
              ease: "easeInOut",
            }}
            sx={{
              position: "absolute",
              width: 6 + (i % 3) * 2,
              height: 6 + (i % 3) * 2,
              borderRadius: "50%",
              background: "rgba(217,167,86,0.4)",
              top: `${15 + ((i * 12) % 70)}%`,
              left: `${5 + ((i * 13) % 90)}%`,
              boxShadow: "0 0 10px rgba(217,167,86,0.3)",
            }}
          />
        ))}
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
          zIndex: 2,
          mb: { xs: 5, md: 6 },
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
            width: 80,
            height: 3,
            background:
              "linear-gradient(90deg, transparent, #D9A756, transparent)",
            mx: "auto",
            mb: 3,
            position: "relative",
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

        <Typography
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          sx={{
            color: "#D9A756",
            letterSpacing: "0.3em",
            fontSize: { xs: "0.7rem", sm: "0.8rem" },
            fontFamily: '"Inter", sans-serif',
            fontWeight: 700,
            mb: 2,
            display: "block",
            textTransform: "uppercase",
          }}
        >
          ◆ What's Happening ◆
        </Typography>

        <Typography
          component={motion.h2}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          sx={{
            fontFamily: '"Cormorant Garamond", Georgia, serif',
            fontSize: { xs: "2rem", sm: "2.5rem", md: "3.5rem" },
            fontWeight: 700,
            color: "#3C1F0E",
            mb: 2,
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
          }}
        >
          Upcoming{" "}
          <Box
            component="span"
            sx={{
              background: "linear-gradient(135deg, #D9A756 0%, #B08030 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Events
          </Box>
        </Typography>

        <Typography
          component={motion.p}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          sx={{
            fontFamily: '"Inter", sans-serif',
            fontSize: { xs: "1rem", md: "1.1rem" },
            color: "rgba(60,31,14,0.8)",
            maxWidth: 700,
            mx: "auto",
            lineHeight: 1.8,
            mb: 3,
          }}
        >
          Unforgettable experiences, live entertainment, and celebrations that
          bring our community together
        </Typography>

        {/* Decorative bottom line */}
        <Box
          component={motion.div}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          sx={{
            width: { xs: 100, md: 150 },
            height: 1,
            background:
              "linear-gradient(90deg, transparent, rgba(217,167,86,0.5), transparent)",
            mx: "auto",
          }}
        />
      </Box>

      {/* Premium Accordion Container */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          width: "100%",
          maxWidth: "1100px",
          mx: "auto",
          height: { xs: "auto", md: "500px" },
          minHeight: { xs: "550px", md: "500px" },
          px: { xs: 2, md: 4 },
          pb: { xs: 4, md: 4 },
          gap: { xs: 1.5, md: 2.5 },
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
                flex: isActive ? (isMobile ? 3.5 : 4) : 1,
                opacity: 1,
              }}
              transition={{ type: "spring", stiffness: 180, damping: 25 }}
              sx={{
                position: "relative",
                borderRadius: { xs: "24px", md: "28px" },
                overflow: "hidden",
                cursor: "pointer",
                minHeight: { xs: isActive ? "300px" : "70px", md: "auto" },
                boxShadow: isActive
                  ? "0 25px 60px rgba(106,58,30,0.35), 0 0 0 1px rgba(217,167,86,0.4)"
                  : "0 8px 25px rgba(106,58,30,0.15)",
                border: "none",
                transform: isActive ? "translateY(-4px)" : "translateY(0)",
                transition: "transform 0.4s ease, box-shadow 0.4s ease",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  inset: 0,
                  borderRadius: "inherit",
                  padding: "2px",
                  background: isActive
                    ? "linear-gradient(135deg, rgba(217,167,86,0.8) 0%, rgba(176,128,48,0.6) 50%, rgba(217,167,86,0.8) 100%)"
                    : "linear-gradient(135deg, rgba(217,167,86,0.3) 0%, rgba(217,167,86,0.1) 100%)",
                  WebkitMask:
                    "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  WebkitMaskComposite: "xor",
                  maskComposite: "exclude",
                  zIndex: 0,
                  transition: "background 0.4s ease",
                },
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
                  filter: "blur(25px) brightness(0.4) saturate(1.2)",
                  opacity: 0.9,
                  transform: "scale(1.1)",
                }}
              />

              {/* Main Image (Fully Visible) - show full image without cropping */}
              <Box
                component={motion.div}
                animate={{
                  scale: isActive ? 1 : 1.02,
                  filter: isActive
                    ? "brightness(1.05) saturate(1.1)"
                    : "brightness(0.6) grayscale(0.2)",
                }}
                transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
                sx={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage: `url(${imageUrl})`,
                  backgroundSize: "contain",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                  backgroundColor: "#F5F0EC",
                  zIndex: 1,
                }}
              />

              {/* Premium Gradient Overlay */}
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  background: isActive
                    ? "linear-gradient(0deg, rgba(60,31,14,0.95) 0%, rgba(60,31,14,0.5) 40%, rgba(60,31,14,0.1) 70%, transparent 100%)"
                    : "linear-gradient(0deg, rgba(60,31,14,0.85) 0%, rgba(60,31,14,0.6) 50%, rgba(60,31,14,0.4) 100%)",
                  transition: "background 0.5s ease",
                  zIndex: 2,
                }}
              />

              {/* Decorative gold accent line at top */}
              {isActive && (
                <Box
                  component={motion.div}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "60%",
                    height: 3,
                    background:
                      "linear-gradient(90deg, transparent, #D9A756, transparent)",
                    zIndex: 10,
                  }}
                />
              )}

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
                    bottom: 40,
                    left: "50%",
                    transform: "translateX(-50%)",
                    writingMode: "vertical-rl",
                    textOrientation: "mixed",
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    whiteSpace: "nowrap",
                    zIndex: 3,
                  }}
                >
                  <Typography
                    sx={{
                      color: "rgba(217,167,86,0.9)",
                      fontFamily: '"Inter", sans-serif',
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      fontSize: "0.7rem",
                      fontWeight: 600,
                    }}
                  >
                    {formatEventDate(event.eventStartDate)}
                  </Typography>
                  <Box
                    sx={{
                      width: "2px",
                      height: "40px",
                      background:
                        "linear-gradient(180deg, #D9A756, rgba(217,167,86,0.3))",
                      borderRadius: 1,
                    }}
                  />
                  <Typography
                    sx={{
                      color: "#FFFDFB",
                      fontFamily: '"Cormorant Garamond", serif',
                      fontWeight: 700,
                      fontSize: "1.3rem",
                      textShadow: "0 2px 10px rgba(0,0,0,0.3)",
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
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      p: { xs: 3, md: 5 },
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      gap: 2,
                      zIndex: 3,
                    }}
                  >
                    {/* Premium Badge */}
                    <Box
                      component={motion.div}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      sx={{
                        px: 2.5,
                        py: 0.75,
                        borderRadius: "30px",
                        background:
                          "linear-gradient(135deg, rgba(217,167,86,0.2) 0%, rgba(176,128,48,0.15) 100%)",
                        border: "1px solid rgba(217,167,86,0.5)",
                        backdropFilter: "blur(10px)",
                      }}
                    >
                      <Typography
                        sx={{
                          // color: "#D9A756",
                          color:"white",
                          fontSize: "0.7rem",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.15em",
                        }}
                      >
                        {getEventTypeLabel(event.type)}
                      </Typography>
                    </Box>

                    {/* Title */}
                    <Typography
                      component={motion.h3}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35 }}
                      sx={{
                        fontFamily: '"Cormorant Garamond", serif',
                        color: "#FFFDFB",
                        fontSize: { xs: "2rem", md: "2.8rem" },
                        fontWeight: 700,
                        lineHeight: 1.15,
                        maxWidth: "700px",
                        textShadow: "0 4px 20px rgba(0,0,0,0.4)",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {event.title}
                    </Typography>

                    {/* Date & Time with enhanced styling */}
                    <Box
                      component={motion.div}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        flexWrap: "wrap",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          px: 2,
                          py: 0.75,
                          background: "rgba(255,255,255,0.1)",
                          borderRadius: "20px",
                          backdropFilter: "blur(5px)",
                        }}
                      >
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            background: "#D9A756",
                          }}
                        />
                        <Typography
                          sx={{
                            color: "#FFFDFB",
                            fontFamily: '"Inter", sans-serif',
                            fontSize: "0.85rem",
                            fontWeight: 500,
                          }}
                        >
                          {formatEventDate(event.eventStartDate)}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          px: 2,
                          py: 0.75,
                          background: "rgba(255,255,255,0.1)",
                          borderRadius: "20px",
                          backdropFilter: "blur(5px)",
                        }}
                      >
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            background: "#D9A756",
                          }}
                        />
                        <Typography
                          sx={{
                            color: "#FFFDFB",
                            fontFamily: '"Inter", sans-serif',
                            fontSize: "0.85rem",
                            fontWeight: 500,
                          }}
                        >
                          {formatEventTime(event.eventStartDate)}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Description */}
                    <Typography
                      component={motion.p}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.45 }}
                      sx={{
                        color: "rgba(255,255,255,0.85)",
                        maxWidth: "550px",
                        lineHeight: 1.7,
                        fontSize: "0.95rem",
                        display: { xs: "none", sm: "block" },
                        fontFamily: '"Inter", sans-serif',
                      }}
                    >
                      {/* {event.description} */}
                    </Typography>

                    {/* Premium Action Button */}
                    <Button
                      component={motion.button}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate("/events");
                      }}
                      sx={{
                        mt: 1,
                        background: "linear-gradient(135deg, #D9A756 0%, #B08030 100%)",
                        color: "#FFFDFB",
                        px: 4,
                        py: 1.5,
                        borderRadius: "50px",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.15em",
                        fontSize: "0.75rem",
                        fontFamily: '"Inter", sans-serif',
                        boxShadow: "0 10px 30px rgba(217,167,86,0.35)",
                        border: "1px solid rgba(255,255,255,0.2)",
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
                            "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                          transition: "left 0.5s ease",
                        },
                        "&:hover": {
                          transform: "translateY(-3px)",
                          boxShadow: "0 15px 40px rgba(217,167,86,0.45)",
                          "&::before": {
                            left: "100%",
                          },
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
