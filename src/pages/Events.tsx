import { useMemo, useState, useRef } from "react";
import { Box, Typography, Chip, Container, IconButton } from "@mui/material";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import Nav from "../components/common/Nav";
import Footer from "../components/common/Footer";
import AnimatedBackground from "../components/common/AnimatedBackground";
import { EventsSEO } from "../config/seo.presets";
import { useApiWithCache } from "../hooks/useApi";
import { eventsService } from "../services/events.service";
import { getImageUrl } from "../services/api";
import type { Event } from "../types/api.types";

// Check if an event should be displayed
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

// Format event date
const formatEventDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

// Format event time
const formatEventTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

// Get event type display name
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

// Get event color
const getEventColor = (type: string): string => {
  const colors: Record<string, string> = {
    live_music: "#D9A756",
    sports_viewing: "#C5933E",
    trivia_night: "#B8923F",
    karaoke: "#D4A857",
    private_party: "#C9984A",
    special_event: "#D9A756",
  };
  return colors[type] || "#D9A756";
};

// Get event gradient
const getEventGradient = (type: string): string => {
  const gradients: Record<string, string> = {
    live_music: "linear-gradient(135deg, #D9A756 0%, #B8923F 100%)",
    sports_viewing: "linear-gradient(135deg, #6A3A1E 0%, #4A2C17 100%)",
    trivia_night: "linear-gradient(135deg, #B8923F 0%, #8B6914 100%)",
    karaoke: "linear-gradient(135deg, #D4A857 0%, #C5933E 100%)",
    private_party: "linear-gradient(135deg, #8B5A2B 0%, #6A3A1E 100%)",
    special_event: "linear-gradient(135deg, #D9A756 0%, #C5933E 100%)",
  };
  return gradients[type] || "linear-gradient(135deg, #D9A756 0%, #B8923F 100%)";
};

// Premium Event Card Component
const EventCard = ({ event, index }: { event: Event; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  const color = getEventColor(event.type);
  const gradient = getEventGradient(event.type);
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <Box
      ref={cardRef}
      component={motion.div}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.7,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        width: "100%",
        mb: { xs: 4, md: 6 },
      }}
    >
      <Box
        component={motion.div}
        animate={{
          y: isHovered ? -8 : 0,
          boxShadow: isHovered
            ? `0 30px 60px -15px rgba(106, 58, 30, 0.3), 0 0 0 1px rgba(217, 167, 86, 0.2)`
            : `0 15px 35px -10px rgba(106, 58, 30, 0.15), 0 0 0 1px rgba(217, 167, 86, 0.1)`,
        }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        sx={{
          background:
            "linear-gradient(145deg, rgba(255,255,255,0.98), rgba(253,248,243,0.95))",
          borderRadius: "28px",
          overflow: "hidden",
          position: "relative",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          minHeight: { xs: "auto", md: "340px" },
        }}
      >
        {/* Image Section */}
        <Box
          sx={{
            width: { xs: "100%", md: "45%" },
            height: { xs: "220px", md: "auto" },
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Box
            component={motion.img}
            animate={{ scale: isHovered ? 1.08 : 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            src={
              event.imageUrls?.[0]
                ? getImageUrl(event.imageUrls[0])
                : "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800&q=80"
            }
            alt={event.title}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
            }}
          />

          {/* Image overlay gradient */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(135deg, ${color}20 0%, transparent 50%), linear-gradient(to right, rgba(0,0,0,0.1) 0%, transparent 30%)`,
              pointerEvents: "none",
            }}
          />

          {/* Event Type Badge - Floating on image */}
          <Chip
            label={getEventTypeLabel(event.type)}
            sx={{
              position: "absolute",
              top: 16,
              left: 16,
              background: gradient,
              color: "#FFFDFB",
              fontFamily: '"Inter", sans-serif',
              fontWeight: 700,
              fontSize: "0.7rem",
              px: 1,
              height: 28,
              borderRadius: "14px",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
              backdropFilter: "blur(8px)",
            }}
          />

          {/* Date badge - Bottom of image */}
          <Box
            sx={{
              position: "absolute",
              bottom: 16,
              left: 16,
              background: "rgba(255,255,255,0.95)",
              backdropFilter: "blur(10px)",
              borderRadius: "16px",
              p: 1.5,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              minWidth: 70,
              boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
            }}
          >
            <Typography
              sx={{
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                fontSize: "1.8rem",
                fontWeight: 700,
                color: "#6A3A1E",
                lineHeight: 1,
              }}
            >
              {new Date(event.eventStartDate).getDate()}
            </Typography>
            <Typography
              sx={{
                fontFamily: '"Inter", sans-serif',
                fontSize: "0.7rem",
                fontWeight: 600,
                color: color,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              {new Date(event.eventStartDate).toLocaleDateString("en-US", {
                month: "short",
              })}
            </Typography>
          </Box>
        </Box>

        {/* Content Section */}
        <Box
          sx={{
            flex: 1,
            p: { xs: 3, md: 4 },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            position: "relative",
          }}
        >
          {/* Decorative accent */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
              width: 120,
              height: 120,
              background: `radial-gradient(circle at top right, ${color}10 0%, transparent 70%)`,
              pointerEvents: "none",
            }}
          />

          {/* Title */}
          <Typography
            variant="h3"
            sx={{
              fontFamily: '"Cormorant Garamond", Georgia, serif',
              fontWeight: 700,
              fontSize: { xs: "1.6rem", md: "2rem" },
              color: "#4A2C17",
              mb: 2,
              lineHeight: 1.2,
              position: "relative",
            }}
          >
            {event.title}
          </Typography>

          {/* Date, Time & Location Info */}
          <Box
            sx={{ display: "flex", flexDirection: "column", gap: 1.5, mb: 3 }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: "10px",
                  background: `${color}15`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CalendarTodayOutlinedIcon
                  sx={{ fontSize: 16, color: color }}
                />
              </Box>
              <Typography
                sx={{
                  fontFamily: '"Inter", sans-serif',
                  fontSize: "0.9rem",
                  color: "#6A3A1E",
                  fontWeight: 500,
                }}
              >
                {formatEventDate(event.eventStartDate)}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: "10px",
                  background: `${color}15`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <AccessTimeOutlinedIcon sx={{ fontSize: 16, color: color }} />
              </Box>
              <Typography
                sx={{
                  fontFamily: '"Inter", sans-serif',
                  fontSize: "0.9rem",
                  color: "#6A3A1E",
                  fontWeight: 500,
                }}
              >
                {formatEventTime(event.eventStartDate)}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: "10px",
                  background: `${color}15`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <LocationOnOutlinedIcon sx={{ fontSize: 16, color: color }} />
              </Box>
              <Typography
                sx={{
                  fontFamily: '"Inter", sans-serif',
                  fontSize: "0.9rem",
                  color: "#6A3A1E",
                  fontWeight: 500,
                }}
              >
                The Brooklin Pub
              </Typography>
            </Box>
          </Box>

          {/* Description */}
          <Typography
            sx={{
              fontFamily: '"Inter", sans-serif',
              color: "rgba(74,44,23,0.8)",
              fontSize: "0.95rem",
              lineHeight: 1.7,
              mb: 3,
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {event.description}
          </Typography>

          {/* Action Button */}
          <Box
            component={motion.div}
            whileHover={{ x: 5 }}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              cursor: "pointer",
              width: "fit-content",
            }}
          >
            <Typography
              sx={{
                fontFamily: '"Inter", sans-serif',
                fontSize: "0.9rem",
                fontWeight: 600,
                color: color,
                letterSpacing: "0.02em",
              }}
            >
              Learn More
            </Typography>
            <IconButton
              size="small"
              sx={{
                width: 32,
                height: 32,
                background: gradient,
                color: "#FFFDFB",
                "&:hover": {
                  background: gradient,
                  transform: "translateX(4px)",
                },
                transition: "transform 0.3s ease",
              }}
            >
              <ArrowForwardIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Box>

          {/* Decorative bottom line */}
          <Box
            component={motion.div}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            sx={{
              position: "absolute",
              bottom: 0,
              left: { xs: 24, md: 32 },
              right: { xs: 24, md: 32 },
              height: 3,
              background: `linear-gradient(90deg, ${color}, transparent)`,
              borderRadius: "3px 3px 0 0",
              transformOrigin: "left",
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

const Events = () => {
  // Fetch events
  const { data: eventsData, loading } = useApiWithCache<Event[]>(
    "all-events-page",
    () => eventsService.getActiveEvents()
  );

  // Parallax for hero
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // Filter and sort events
  const displayableEvents = useMemo((): Event[] => {
    if (!eventsData) return [];

    const filtered = eventsData.filter(shouldDisplayEvent);

    return filtered.sort(
      (a, b) =>
        new Date(a.eventStartDate).getTime() -
        new Date(b.eventStartDate).getTime()
    );
  }, [eventsData]);

  // Group events by month
  const eventsByMonth = useMemo(() => {
    const grouped: { [key: string]: Event[] } = {};
    displayableEvents.forEach((event) => {
      const monthYear = new Date(event.eventStartDate).toLocaleDateString(
        "en-US",
        {
          month: "long",
          year: "numeric",
        }
      );
      if (!grouped[monthYear]) {
        grouped[monthYear] = [];
      }
      grouped[monthYear].push(event);
    });
    return grouped;
  }, [displayableEvents]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#FDF8F3",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <AnimatedBackground variant="subtle" />
      <EventsSEO />
      <Nav />

      {/* Premium Hero Section */}
      <Box
        ref={heroRef}
        sx={{
          minHeight: { xs: "70vh", md: "85vh" },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          background: "linear-gradient(180deg, #FDF8F3 0%, #F5EBE0 100%)",
        }}
      >
        {/* Animated background shapes */}
        <Box
          component={motion.div}
          animate={{
            rotate: [0, 360],
          }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
          sx={{
            position: "absolute",
            top: "-20%",
            right: "-10%",
            width: "60vw",
            height: "60vw",
            maxWidth: 800,
            maxHeight: 800,
            borderRadius: "50%",
            border: "1px solid rgba(217, 167, 86, 0.1)",
            pointerEvents: "none",
          }}
        />
        <Box
          component={motion.div}
          animate={{
            rotate: [360, 0],
          }}
          transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
          sx={{
            position: "absolute",
            bottom: "-30%",
            left: "-15%",
            width: "50vw",
            height: "50vw",
            maxWidth: 600,
            maxHeight: 600,
            borderRadius: "50%",
            border: "1px solid rgba(217, 167, 86, 0.08)",
            pointerEvents: "none",
          }}
        />

        {/* Floating decorative elements */}
        {[...Array(6)].map((_, i) => (
          <Box
            key={i}
            component={motion.div}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeInOut",
            }}
            sx={{
              position: "absolute",
              width: 8 + i * 4,
              height: 8 + i * 4,
              borderRadius: "50%",
              background: `rgba(217, 167, 86, ${0.2 + i * 0.05})`,
              top: `${15 + i * 12}%`,
              left: `${10 + i * 15}%`,
              pointerEvents: "none",
            }}
          />
        ))}

        {/* Hero Content */}
        <Container maxWidth="lg">
          <Box
            component={motion.div}
            style={{ y: heroY, opacity: heroOpacity }}
            sx={{
              textAlign: "center",
              position: "relative",
              zIndex: 2,
            }}
          >
            {/* Overline */}
            <Box
              component={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                mb: 3,
              }}
            >
              <Box
                sx={{
                  width: { xs: 40, md: 60 },
                  height: 1,
                  background: "linear-gradient(90deg, transparent, #D9A756)",
                }}
              />
              <Typography
                sx={{
                  fontFamily: '"Inter", sans-serif',
                  fontSize: { xs: "0.7rem", md: "0.8rem" },
                  fontWeight: 600,
                  color: "#D9A756",
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                }}
              >
                What's Happening
              </Typography>
              <Box
                sx={{
                  width: { xs: 40, md: 60 },
                  height: 1,
                  background: "linear-gradient(90deg, #D9A756, transparent)",
                }}
              />
            </Box>

            {/* Main Title */}
            <Typography
              component={motion.h1}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              sx={{
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                fontSize: { xs: "3rem", sm: "4rem", md: "5.5rem" },
                fontWeight: 700,
                color: "#4A2C17",
                lineHeight: 1.1,
                mb: 3,
                textShadow: "0 4px 30px rgba(74, 44, 23, 0.1)",
              }}
            >
              Upcoming{" "}
              <Box
                component="span"
                sx={{
                  background:
                    "linear-gradient(135deg, #D9A756 0%, #B08030 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  position: "relative",
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    background: "linear-gradient(90deg, #D9A756, transparent)",
                    borderRadius: 2,
                  },
                }}
              >
                Events
              </Box>
            </Typography>

            {/* Subtitle */}
            <Typography
              component={motion.p}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              sx={{
                fontFamily: '"Inter", sans-serif',
                fontSize: { xs: "1rem", md: "1.2rem" },
                color: "#6A3A1E",
                maxWidth: 600,
                mx: "auto",
                lineHeight: 1.8,
                mb: 4,
              }}
            >
              From live music to trivia nights, there's always something
              exciting happening at The Brooklin Pub. Join us for unforgettable
              experiences.
            </Typography>

            {/* Stats/Quick Info */}
            <Box
              component={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: { xs: 3, md: 6 },
                flexWrap: "wrap",
              }}
            >
              {[
                { value: displayableEvents.length, label: "Upcoming Events" },
                { value: "Live", label: "Entertainment" },
                { value: "Free", label: "Entry" },
              ].map((stat, i) => (
                <Box
                  key={i}
                  sx={{
                    textAlign: "center",
                    px: 3,
                    py: 2,
                    background: "rgba(255,255,255,0.6)",
                    backdropFilter: "blur(10px)",
                    borderRadius: "20px",
                    border: "1px solid rgba(217, 167, 86, 0.2)",
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: '"Cormorant Garamond", Georgia, serif',
                      fontSize: { xs: "1.8rem", md: "2.2rem" },
                      fontWeight: 700,
                      color: "#D9A756",
                      lineHeight: 1,
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: '"Inter", sans-serif',
                      fontSize: "0.75rem",
                      color: "#6A3A1E",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      mt: 0.5,
                    }}
                  >
                    {stat.label}
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* Scroll indicator */}
            <Box
              component={motion.div}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, y: [0, 10, 0] }}
              transition={{
                opacity: { delay: 1, duration: 0.6 },
                y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
              }}
              sx={{
                position: "absolute",
                bottom: { xs: -60, md: -80 },
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Typography
                sx={{
                  fontFamily: '"Inter", sans-serif',
                  fontSize: "0.7rem",
                  color: "rgba(106, 58, 30, 0.6)",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                }}
              >
                Explore
              </Typography>
              <Box
                sx={{
                  width: 24,
                  height: 40,
                  borderRadius: 12,
                  border: "2px solid rgba(217, 167, 86, 0.4)",
                  display: "flex",
                  justifyContent: "center",
                  pt: 1,
                }}
              >
                <Box
                  sx={{
                    width: 4,
                    height: 8,
                    borderRadius: 2,
                    background: "#D9A756",
                  }}
                />
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Events List Section */}
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          position: "relative",
        }}
      >
        {/* Section background decoration */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 200,
            background: "linear-gradient(180deg, #F5EBE0 0%, transparent 100%)",
            pointerEvents: "none",
          }}
        />

        <Container maxWidth="lg">
          {loading ? (
            <Box sx={{ textAlign: "center", py: 10 }}>
              <Box
                component={motion.div}
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                sx={{
                  width: 50,
                  height: 50,
                  border: "3px solid rgba(217, 167, 86, 0.2)",
                  borderTopColor: "#D9A756",
                  borderRadius: "50%",
                  mx: "auto",
                  mb: 3,
                }}
              />
              <Typography
                sx={{ color: "#6A3A1E", fontFamily: '"Inter", sans-serif' }}
              >
                Loading events...
              </Typography>
            </Box>
          ) : displayableEvents.length === 0 ? (
            <Box
              component={motion.div}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              sx={{
                textAlign: "center",
                py: 12,
                px: 4,
                background:
                  "linear-gradient(145deg, rgba(255,255,255,0.8), rgba(253,248,243,0.6))",
                borderRadius: "32px",
                border: "2px dashed rgba(217,167,86,0.3)",
                maxWidth: 600,
                mx: "auto",
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg, rgba(217,167,86,0.2), rgba(217,167,86,0.1))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                  mb: 3,
                }}
              >
                <CalendarTodayOutlinedIcon
                  sx={{ fontSize: 36, color: "#D9A756" }}
                />
              </Box>
              <Typography
                variant="h5"
                sx={{
                  fontFamily: '"Cormorant Garamond", Georgia, serif',
                  color: "#6A3A1E",
                  fontSize: "1.8rem",
                  fontWeight: 700,
                  mb: 2,
                }}
              >
                No Upcoming Events
              </Typography>
              <Typography
                sx={{
                  color: "#8B5A2B",
                  fontFamily: '"Inter", sans-serif',
                  fontSize: "1rem",
                  lineHeight: 1.7,
                }}
              >
                We're planning something special! Check back soon for upcoming
                events.
              </Typography>
            </Box>
          ) : (
            <AnimatePresence mode="wait">
              <Box
                component={motion.div}
                key="events-list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                {Object.entries(eventsByMonth).map(
                  ([monthYear, events], groupIndex) => (
                    <Box key={monthYear} sx={{ mb: { xs: 6, md: 10 } }}>
                      {/* Month Header */}
                      <Box
                        component={motion.div}
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 3,
                          mb: 4,
                        }}
                      >
                        <Typography
                          sx={{
                            fontFamily: '"Cormorant Garamond", Georgia, serif',
                            fontSize: { xs: "1.5rem", md: "2rem" },
                            fontWeight: 700,
                            color: "#4A2C17",
                          }}
                        >
                          {monthYear}
                        </Typography>
                        <Box
                          sx={{
                            flex: 1,
                            height: 2,
                            background:
                              "linear-gradient(90deg, rgba(217, 167, 86, 0.3), transparent)",
                            borderRadius: 1,
                          }}
                        />
                        <Chip
                          label={`${events.length} event${
                            events.length > 1 ? "s" : ""
                          }`}
                          size="small"
                          sx={{
                            background: "rgba(217, 167, 86, 0.15)",
                            color: "#6A3A1E",
                            fontFamily: '"Inter", sans-serif',
                            fontWeight: 600,
                            fontSize: "0.75rem",
                          }}
                        />
                      </Box>

                      {/* Events in this month */}
                      {events.map((event, index) => (
                        <EventCard
                          key={event.id}
                          event={event}
                          index={groupIndex * 10 + index}
                        />
                      ))}
                    </Box>
                  )
                )}
              </Box>
            </AnimatePresence>
          )}
        </Container>
      </Box>

      {/* Bottom CTA Section */}
      <Box
        sx={{
          py: { xs: 10, md: 14 },
          background:
            "linear-gradient(180deg, #F5EBE0 0%, #E8D5C4 50%, #DBC7B0 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative background pattern */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            opacity: 0.03,
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236A3A1E' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            pointerEvents: "none",
          }}
        />

        <Container maxWidth="md">
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            sx={{
              textAlign: "center",
              position: "relative",
              zIndex: 1,
            }}
          >
            {/* Decorative element */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mb: 3,
              }}
            >
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg, #6A3A1E 0%, #4A2C17 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 10px 30px rgba(106, 58, 30, 0.3)",
                }}
              >
                <CalendarTodayOutlinedIcon
                  sx={{ fontSize: 28, color: "#FFFDFB" }}
                />
              </Box>
            </Box>

            <Typography
              sx={{
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                fontSize: { xs: "2rem", md: "3rem" },
                fontWeight: 700,
                color: "#4A2C17",
                mb: 2,
                lineHeight: 1.2,
              }}
            >
              Want to Host a{" "}
              <Box component="span" sx={{ color: "#D9A756" }}>
                Private Event?
              </Box>
            </Typography>

            <Typography
              sx={{
                fontFamily: '"Inter", sans-serif',
                fontSize: { xs: "1rem", md: "1.1rem" },
                color: "#6A3A1E",
                mb: 5,
                lineHeight: 1.8,
                maxWidth: 550,
                mx: "auto",
              }}
            >
              The Brooklin Pub is the perfect venue for your next celebration.
              From birthdays to corporate gatherings, we'll make your event
              unforgettable.
            </Typography>

            <Box
              component={motion.a}
              href="/contactus"
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.98 }}
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 2,
                px: 6,
                py: 2.5,
                background: "linear-gradient(135deg, #6A3A1E 0%, #4A2C17 100%)",
                borderRadius: "50px",
                color: "#FFFDFB",
                fontFamily: '"Inter", sans-serif',
                fontSize: "1rem",
                fontWeight: 700,
                textDecoration: "none",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                boxShadow: "0 15px 40px rgba(106,58,30,0.35)",
                transition: "all 0.3s ease",
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
                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
                  transition: "left 0.5s ease",
                },
                "&:hover": {
                  boxShadow: "0 20px 50px rgba(106,58,30,0.4)",
                  "&::before": {
                    left: "100%",
                  },
                },
              }}
            >
              Get In Touch
              <ArrowForwardIcon sx={{ fontSize: 20 }} />
            </Box>
          </Box>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
};

export default Events;
