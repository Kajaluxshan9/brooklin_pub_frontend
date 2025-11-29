import { useMemo, useRef, useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useApiWithCache } from "../../hooks/useApi";
import { eventsService } from "../../services/events.service";
import { getImageUrl } from "../../services/api";
import type { Event } from "../../types/api.types";

// Check if an event should be displayed based on displayStartDate and displayEndDate
const shouldDisplayEvent = (event: Event): boolean => {
  if (!event.isActive) return false;

  const now = new Date();

  // Check display date range
  if (event.displayStartDate && event.displayEndDate) {
    const displayStart = new Date(event.displayStartDate);
    const displayEnd = new Date(event.displayEndDate);
    return now >= displayStart && now <= displayEnd;
  }

  return true;
};

// Format event date for display
const formatEventDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
};

// Format event time for display
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

// Event color based on type
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

// Single Event Section Component with Scroll Effects
const EventSection = ({ event, index }: { event: Event; index: number }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const color = getEventColor(event.type);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Smooth spring animations
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // 3D rotation effect based on scroll
  const rotateX = useTransform(smoothProgress, [0, 0.5, 1], [15, 0, -15]);
  const rotateY = useTransform(
    smoothProgress,
    [0, 0.5, 1],
    index % 2 === 0 ? [-10, 0, 10] : [10, 0, -10]
  );

  // Scale and opacity
  const scale = useTransform(
    smoothProgress,
    [0, 0.3, 0.7, 1],
    [0.8, 1, 1, 0.8]
  );
  const opacity = useTransform(smoothProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  // Image zoom effect
  const imageScale = useTransform(smoothProgress, [0, 0.5, 1], [1.2, 1, 1.2]);

  // Text reveal animations
  const textY = useTransform(
    smoothProgress,
    [0, 0.3, 0.7, 1],
    [100, 0, 0, -100]
  );
  const textOpacity = useTransform(
    smoothProgress,
    [0, 0.3, 0.7, 1],
    [0, 1, 1, 0]
  );

  const isEven = index % 2 === 0;

  return (
    <Box
      ref={sectionRef}
      sx={{
        minHeight: { xs: "auto", md: "100vh" },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        py: { xs: 6, sm: 8, md: 12 },
        px: { xs: 2, sm: 3, md: 4 },
        background: `linear-gradient(135deg,
          ${isEven ? "#FDF8F3" : "#F5EBE0"} 0%,
          ${isEven ? "#F5EBE0" : "#E8D5C4"} 50%,
          ${isEven ? "#FDF8F3" : "#F5EBE0"} 100%)`,
      }}
    >
      {/* Animated mesh gradient background */}
      <Box
        component={motion.div}
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%"],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "linear",
        }}
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            radial-gradient(at 20% 30%, ${color}15 0%, transparent 50%),
            radial-gradient(at 80% 70%, ${color}10 0%, transparent 50%),
            radial-gradient(at 50% 50%, rgba(106,58,30,0.08) 0%, transparent 60%)
          `,
          backgroundSize: "200% 200%",
          pointerEvents: "none",
        }}
      />

      {/* Floating geometric shapes */}
      {[...Array(6)].map((_, i) => (
        <Box
          key={i}
          component={motion.div}
          animate={{
            y: [0, -30, 0],
            rotate: [0, 180, 360],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 10 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5,
          }}
          sx={{
            position: "absolute",
            width: `${40 + i * 20}px`,
            height: `${40 + i * 20}px`,
            border: `2px solid ${color}`,
            borderRadius: i % 2 === 0 ? "50%" : "0%",
            top: `${10 + i * 15}%`,
            left: `${5 + i * 15}%`,
            opacity: 0.1,
            pointerEvents: "none",
          }}
        />
      ))}

      {/* Main content container with 3D effect */}
      <Box
        component={motion.div}
        style={{
          rotateX,
          rotateY,
          scale,
          opacity,
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        sx={{
          maxWidth: "1400px",
          width: "100%",
          perspective: "2000px",
          transformStyle: "preserve-3d",
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: { xs: 4, md: 6 },
            alignItems: "center",
          }}
        >
          {/* Image Section with Magnetic Effect */}
          <Box
            component={motion.div}
            whileHover={{ scale: 1.02 }}
            onClick={() => navigate("/events")}
            sx={{
              order: { xs: 1, md: isEven ? 1 : 2 },
              position: "relative",
              height: { xs: "280px", sm: "350px", md: "600px" },
              borderRadius: { xs: "20px", md: "30px" },
              overflow: "hidden",
              boxShadow: `0 30px 80px rgba(106,58,30,0.25),
                         0 0 0 1px ${color}40,
                         inset 0 0 100px rgba(0,0,0,0.15)`,
              transform: isHovered ? "translateZ(50px)" : "translateZ(0px)",
              transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
              cursor: "pointer",
            }}
          >
            {/* Layered image with parallax */}
            <Box
              component={motion.div}
              style={{ scale: imageScale }}
              sx={{
                position: "absolute",
                inset: 0,
                backgroundImage: `url(${
                  event.imageUrls?.[0]
                    ? getImageUrl(event.imageUrls[0])
                    : "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=1200&q=80"
                })`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                filter: isHovered ? "brightness(1.1)" : "brightness(0.9)",
                transition: "filter 0.6s ease",
              }}
            />

            {/* Gradient overlay with animated border */}
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                background: `linear-gradient(135deg,
                  transparent 0%,
                  ${color}20 50%,
                  transparent 100%)`,
                opacity: isHovered ? 0.6 : 0.3,
                transition: "opacity 0.6s ease",
              }}
            />

            {/* Animated corner accents */}
            <Box
              component={motion.div}
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 2, delay: 0.5 }}
              sx={{
                position: "absolute",
                top: 20,
                left: 20,
                width: 80,
                height: 80,
                border: `3px solid ${color}`,
                borderRight: "none",
                borderBottom: "none",
                opacity: 0.8,
              }}
            />
            <Box
              component={motion.div}
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 2, delay: 0.7 }}
              sx={{
                position: "absolute",
                bottom: 20,
                right: 20,
                width: 80,
                height: 80,
                border: `3px solid ${color}`,
                borderLeft: "none",
                borderTop: "none",
                opacity: 0.8,
              }}
            />

            {/* Event Type Badge */}
            <Box
              component={motion.div}
              whileHover={{ scale: 1.15, rotate: 360 }}
              transition={{ duration: 0.6 }}
              sx={{
                position: "absolute",
                top: { xs: -12, md: -20 },
                right: { xs: -12, md: -20 },
                width: { xs: 80, sm: 90, md: 120 },
                height: { xs: 80, sm: 90, md: 120 },
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: '"Inter", sans-serif',
                fontSize: { xs: "0.6rem", sm: "0.7rem", md: "0.8rem" },
                fontWeight: 700,
                color: "#FFFDFB",
                boxShadow: `0 10px 40px ${color}60, inset 0 2px 0 rgba(255,255,255,0.3)`,
                border: "4px solid rgba(255,255,255,0.2)",
                cursor: "pointer",
                textAlign: "center",
                px: 1,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              {getEventTypeLabel(event.type)}
            </Box>

            {/* Shimmer effect */}
            <Box
              component={motion.div}
              animate={{
                x: ["-100%", "200%"],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatDelay: 2,
                ease: "easeInOut",
              }}
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: `linear-gradient(90deg,
                  transparent 0%,
                  rgba(255,255,255,0.1) 50%,
                  transparent 100%)`,
                transform: "skewX(-20deg)",
                pointerEvents: "none",
              }}
            />
          </Box>

          {/* Text Content Section */}
          <Box
            component={motion.div}
            style={{ y: textY, opacity: textOpacity }}
            sx={{
              order: { xs: 2, md: isEven ? 2 : 1 },
              position: "relative",
              zIndex: 2,
            }}
          >
            {/* Date & Time Pills */}
            <Box sx={{ mb: 3, display: "flex", gap: 2, flexWrap: "wrap" }}>
              <Box
                component={motion.div}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  background: `${color}15`,
                  border: `2px solid ${color}40`,
                  borderRadius: "30px",
                  px: 2.5,
                  py: 1,
                  color: "#6A3A1E",
                  fontSize: { xs: "0.85rem", md: "0.95rem" },
                  fontFamily: '"Inter", sans-serif',
                  fontWeight: 700,
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                {formatEventDate(event.eventStartDate)}
              </Box>

              <Box
                component={motion.div}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  background: `${color}15`,
                  border: `2px solid ${color}40`,
                  borderRadius: "30px",
                  px: 2.5,
                  py: 1,
                  color: "#6A3A1E",
                  fontSize: { xs: "0.85rem", md: "0.95rem" },
                  fontFamily: '"Inter", sans-serif',
                  fontWeight: 700,
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12,6 12,12 16,14" />
                </svg>
                {formatEventTime(event.eventStartDate)}
              </Box>
            </Box>

            {/* Animated Underline */}
            <Box
              component={motion.div}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              sx={{
                height: 3,
                width: 120,
                background: `linear-gradient(90deg, ${color} 0%, transparent 100%)`,
                transformOrigin: "left",
                mb: 3,
              }}
            />

            {/* Main title with split text animation */}
            <Typography
              component={motion.h2}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              sx={{
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                fontSize: { xs: "2rem", sm: "3rem", md: "4rem", lg: "5rem" },
                fontWeight: 800,
                lineHeight: 1,
                mb: { xs: 2, md: 4 },
                color: "#4A2C17",
                textShadow: `0 2px 10px rgba(255,255,255,0.5), 0 0 40px ${color}25`,
                letterSpacing: "-0.02em",
                position: "relative",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  bottom: { xs: -6, md: -10 },
                  left: 0,
                  width: "60%",
                  height: { xs: 1.5, md: 2 },
                  background: `linear-gradient(90deg, ${color} 0%, transparent 100%)`,
                },
              }}
            >
              {event.title}
            </Typography>

            {/* Description with stagger effect */}
            <Typography
              component={motion.p}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}
              sx={{
                fontFamily: '"Inter", sans-serif',
                fontSize: { xs: "0.95rem", sm: "1rem", md: "1.25rem" },
                lineHeight: { xs: 1.7, md: 1.9 },
                color: "rgba(74,44,23,0.9)",
                mb: { xs: 3, md: 5 },
                maxWidth: "90%",
                textShadow: "0 1px 2px rgba(255,255,255,0.3)",
              }}
            >
              {event.description}
            </Typography>

            {/* View Details Button */}
            <Button
              component={motion.button}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.7 }}
              whileHover={{ scale: 1.05, x: 10 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/events")}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                px: 4,
                py: 1.5,
                background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
                border: "none",
                borderRadius: "50px",
                color: "#FFFDFB",
                fontFamily: '"Inter", sans-serif',
                fontSize: { xs: "0.9rem", md: "1rem" },
                fontWeight: 700,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                boxShadow: `0 10px 30px ${color}40`,
                transition: "all 0.3s ease",
                "&:hover": {
                  boxShadow: `0 15px 40px ${color}60`,
                },
              }}
            >
              View Details
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="M12 5l7 7-7 7" />
              </svg>
            </Button>

            {/* Decorative elements */}
            <Box
              sx={{
                display: "flex",
                gap: 2,
                alignItems: "center",
                mt: 4,
              }}
            >
              {[...Array(3)].map((_, i) => (
                <Box
                  key={i}
                  component={motion.div}
                  initial={{ scale: 0, rotate: -180 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.6,
                    delay: 0.9 + i * 0.1,
                    type: "spring",
                  }}
                  sx={{
                    width: 12,
                    height: 12,
                    background: color,
                    transform: "rotate(45deg)",
                    opacity: 1 - i * 0.3,
                  }}
                />
              ))}
            </Box>

            {/* Large decorative quote mark */}
            <Box
              component={motion.div}
              initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
              whileInView={{ opacity: 0.08, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.8 }}
              sx={{
                position: "absolute",
                bottom: { xs: -80, md: -120 },
                right: { xs: -40, md: -60 },
                fontSize: { xs: "15rem", md: "20rem" },
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                fontWeight: 700,
                color: color,
                lineHeight: 1,
                pointerEvents: "none",
                userSelect: "none",
              }}
            >
              ✦
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

const EventsSection = () => {
  const navigate = useNavigate();

  // Fetch active events from backend
  const { data: eventsData, loading } = useApiWithCache<Event[]>(
    "active-events-home",
    () => eventsService.getActiveEvents()
  );

  // Filter events to show only those within display date range
  const displayableEvents = useMemo((): Event[] => {
    if (!eventsData || eventsData.length === 0) return [];

    return eventsData
      .filter(shouldDisplayEvent)
      .sort(
        (a, b) =>
          new Date(a.eventStartDate).getTime() -
          new Date(b.eventStartDate).getTime()
      )
      .slice(0, 3); // Show max 3 events on home page
  }, [eventsData]);

  // Don't render if no displayable events
  if (loading || displayableEvents.length === 0) {
    return null;
  }

  return (
    <Box sx={{ margin: 0, padding: 0, overflow: "hidden" }}>
      {/* Section Header */}
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          background: "linear-gradient(135deg, #FDF8F3 0%, #F5EBE0 100%)",
          textAlign: "center",
          position: "relative",
        }}
      >
        {/* Floating particles */}
        {[...Array(8)].map((_, i) => (
          <Box
            key={i}
            component={motion.div}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 5 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3,
            }}
            sx={{
              position: "absolute",
              width: `${4 + i * 2}px`,
              height: `${4 + i * 2}px`,
              borderRadius: "50%",
              background: "#D9A756",
              top: `${20 + i * 10}%`,
              left: `${10 + i * 12}%`,
              pointerEvents: "none",
            }}
          />
        ))}

        {/* Animated Top Accent */}
        <Box
          component={motion.div}
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3 }}
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
          transition={{ duration: 0.6, delay: 0.4 }}
          variant="overline"
          sx={{
            color: "#D9A756",
            letterSpacing: "0.4em",
            fontSize: { xs: "0.8rem", md: "0.95rem" },
            fontFamily: '"Inter", sans-serif',
            fontWeight: 700,
            mb: 2,
            display: "block",
            textTransform: "uppercase",
            position: "relative",
            "&::before, &::after": {
              content: '"✦"',
              position: "relative",
              mx: 2,
              opacity: 0.6,
            },
          }}
        >
          What's Happening
        </Typography>

        <Typography
          component={motion.h2}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.5 }}
          sx={{
            fontFamily: '"Cormorant Garamond", Georgia, serif',
            fontSize: { xs: "3rem", sm: "4rem", md: "5.5rem" },
            fontWeight: 800,
            color: "#4A2C17",
            mb: 3,
            textShadow: "0 0 40px rgba(106,58,30,0.15)",
            letterSpacing: "-0.02em",
          }}
        >
          Upcoming Events
        </Typography>

        <Typography
          component={motion.p}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          sx={{
            fontFamily: '"Inter", sans-serif',
            fontSize: { xs: "1rem", md: "1.2rem" },
            color: "#6A3A1E",
            maxWidth: 700,
            mx: "auto",
            lineHeight: 1.8,
            fontWeight: 400,
            px: 3,
          }}
        >
          Unforgettable experiences, live entertainment, and celebrations that
          bring our community together
        </Typography>
      </Box>

      {/* Event Sections */}
      {displayableEvents.map((event, index) => (
        <EventSection key={event.id} event={event} index={index} />
      ))}

      {/* Call to Action */}
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          background: "linear-gradient(135deg, #F5EBE0 0%, #FDF8F3 100%)",
          textAlign: "center",
          position: "relative",
        }}
      >
        <Button
          component={motion.button}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          whileHover={{ scale: 1.08, y: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/events")}
          sx={{
            px: 6,
            py: 2.5,
            background:
              "linear-gradient(135deg, transparent 0%, rgba(106,58,30,0.08) 100%)",
            border: "3px solid #6A3A1E",
            borderRadius: "50px",
            color: "#6A3A1E",
            fontFamily: '"Cormorant Garamond", Georgia, serif',
            fontSize: "1.3rem",
            fontWeight: 800,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            position: "relative",
            overflow: "hidden",
            boxShadow:
              "0 0 30px rgba(106,58,30,0.15), inset 0 0 20px rgba(106,58,30,0.05)",
            transition: "all 0.4s ease",
            "&::before": {
              content: '""',
              position: "absolute",
              top: "50%",
              left: "50%",
              width: "0",
              height: "0",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #D9A756 0%, #C5933E 100%)",
              transform: "translate(-50%, -50%)",
              transition: "width 0.6s, height 0.6s",
              zIndex: -1,
            },
            "&:hover": {
              color: "#FFFDFB",
              borderColor: "#D9A756",
              boxShadow: "0 0 50px rgba(217,167,86,0.4)",
              "&::before": {
                width: "400px",
                height: "400px",
              },
            },
          }}
        >
          Explore All Events
        </Button>
      </Box>
    </Box>
  );
};

export default EventsSection;
