import { useMemo, useState, useRef, useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import { motion, useInView } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
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

// Expandable Card Component
const EventCard = ({ event, index }: { event: Event; index: number }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const color = getEventColor(event.type);
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView && cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        {
          opacity: 0,
          y: 60,
          rotateY: -15,
          scale: 0.9,
        },
        {
          opacity: 1,
          y: 0,
          rotateY: 0,
          scale: 1,
          duration: 0.8,
          delay: index * 0.15,
          ease: "power3.out",
        }
      );
    }
  }, [isInView, index]);

  return (
    <>
      {/* Desktop Version - Hover to Expand */}
      <Box
        ref={cardRef}
        sx={{
          display: { xs: "none", sm: "flex" },
          position: "relative",
          cursor: "pointer",
          width: "320px",
          flexDirection: "column",
          perspective: "1000px",
          opacity: 0,
        }}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        {/* Glow Effect Behind Card */}
        <Box
          sx={{
            position: "absolute",
            top: "10%",
            left: "5%",
            right: "5%",
            bottom: "0%",
            background: `radial-gradient(ellipse at center, ${color}30 0%, transparent 70%)`,
            filter: "blur(30px)",
            opacity: isExpanded ? 0.8 : 0.4,
            transition: "opacity 0.5s ease",
            pointerEvents: "none",
            zIndex: -1,
          }}
        />

        {/* Event Image */}
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: "340px",
            borderRadius: "20px",
            overflow: "hidden",
            boxShadow: `0 15px 40px rgba(106,58,30,0.2), 0 5px 15px ${color}20`,
            transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
            border: `1px solid ${color}20`,
            ...(isExpanded && {
              boxShadow: `0 25px 60px rgba(106,58,30,0.35), 0 10px 25px ${color}30`,
              transform: "translateY(-8px) scale(1.02)",
            }),
          }}
        >
          {/* Event Image Background */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${
                event.imageUrls?.[0]
                  ? getImageUrl(event.imageUrls[0])
                  : "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=400&q=80"
              })`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
              transform: isExpanded ? "scale(1.1)" : "scale(1)",
            }}
          />

          {/* Gradient Overlay */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(180deg,
                transparent 0%,
                ${color}10 40%,
                rgba(74,44,23,0.85) 100%)`,
              opacity: isExpanded ? 1 : 0.9,
              transition: "opacity 0.5s",
            }}
          />

          {/* Event Type Badge - Floating */}
          <Box
            component={motion.div}
            animate={{
              y: isExpanded ? -5 : 0,
              scale: isExpanded ? 1.05 : 1,
            }}
            sx={{
              position: "absolute",
              top: 20,
              right: 20,
              background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
              color: "#FFFDFB",
              padding: "8px 18px",
              borderRadius: "25px",
              fontFamily: '"Inter", sans-serif',
              fontSize: "0.7rem",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              boxShadow: `0 8px 20px ${color}50`,
              backdropFilter: "blur(10px)",
              border: `1px solid ${color}60`,
            }}
          >
            {getEventTypeLabel(event.type)}
          </Box>

          {/* Bottom Content Overlay */}
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              padding: "25px",
              background:
                "linear-gradient(0deg, rgba(74,44,23,0.95) 0%, transparent 100%)",
            }}
          >
            {/* Date Badge */}
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                background: "rgba(255,253,251,0.15)",
                backdropFilter: "blur(10px)",
                padding: "6px 14px",
                borderRadius: "20px",
                mb: 2,
                border: "1px solid rgba(255,253,251,0.2)",
              }}
            >
              <Typography
                sx={{
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: "#FFFDFB",
                  fontFamily: '"Inter", sans-serif',
                  letterSpacing: "0.03em",
                }}
              >
                📅 {formatEventDate(event.eventStartDate)} •{" "}
                {formatEventTime(event.eventStartDate)}
              </Typography>
            </Box>

            {/* Title */}
            <Typography
              sx={{
                fontSize: "1.4rem",
                fontWeight: 800,
                color: "#FFFDFB",
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                lineHeight: 1.2,
                textShadow: "0 2px 10px rgba(0,0,0,0.3)",
              }}
            >
              {event.title}
            </Typography>
          </Box>
        </Box>

        {/* Details Container - Expands on Hover */}
        <Box
          component={motion.div}
          animate={{
            height: isExpanded ? "auto" : "0px",
            opacity: isExpanded ? 1 : 0,
          }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          sx={{
            overflow: "hidden",
            background: "linear-gradient(135deg, #FFFDFB 0%, #FDF8F3 100%)",
            borderRadius: "0 0 20px 20px",
            boxShadow: "0 15px 40px rgba(106,58,30,0.2)",
            mt: isExpanded ? 1 : 0,
            transition: "margin-top 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
            border: `1px solid ${color}15`,
            borderTop: "none",
          }}
        >
          <Box
            sx={{
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {/* Description */}
            <Typography
              sx={{
                margin: 0,
                padding: 0,
                fontSize: "0.95rem",
                color: "#6A3A1E",
                fontFamily: '"Inter", sans-serif',
                lineHeight: 1.7,
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
              }}
            >
              {event.description}
            </Typography>

            {/* Read More Button */}
            <Button
              onClick={() => navigate("/events")}
              sx={{
                marginTop: "8px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                textDecoration: "none",
                fontWeight: 700,
                color: "#FFFDFB",
                padding: "12px 28px",
                border: "none",
                fontFamily: '"Inter", sans-serif',
                fontSize: "0.85rem",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
                borderRadius: "30px",
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: `0 8px 20px ${color}40`,
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
                  transition: "left 0.5s",
                },
                "&:hover": {
                  transform: "translateY(-3px)",
                  boxShadow: `0 12px 30px ${color}60`,
                  "&::before": {
                    left: "100%",
                  },
                },
              }}
            >
              Learn More →
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Mobile Version - All Details Visible */}
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        sx={{
          display: { xs: "flex", sm: "none" },
          flexDirection: "column",
          width: "100%",
          maxWidth: "400px",
          background: "linear-gradient(145deg, #FFFDFB 0%, #FDF8F3 100%)",
          borderRadius: "24px",
          overflow: "hidden",
          boxShadow: `0 20px 50px rgba(106,58,30,0.2), 0 10px 25px ${color}15`,
          border: `1px solid ${color}20`,
          position: "relative",
        }}
      >
        {/* Decorative Corner Accent */}
        <Box
          sx={{
            position: "absolute",
            top: -30,
            right: -30,
            width: "100px",
            height: "100px",
            background: `radial-gradient(circle, ${color}20 0%, transparent 70%)`,
            pointerEvents: "none",
          }}
        />

        {/* Event Image */}
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: "240px",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${
                event.imageUrls?.[0]
                  ? getImageUrl(event.imageUrls[0])
                  : "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=400&q=80"
              })`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
          />

          {/* Gradient Overlay */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(180deg,
                transparent 0%,
                ${color}10 50%,
                rgba(74,44,23,0.7) 100%)`,
            }}
          />

          {/* Event Type Badge */}
          <Box
            sx={{
              position: "absolute",
              top: 18,
              right: 18,
              background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
              color: "#FFFDFB",
              padding: "8px 16px",
              borderRadius: "25px",
              fontFamily: '"Inter", sans-serif',
              fontSize: "0.7rem",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              boxShadow: `0 6px 15px ${color}50`,
            }}
          >
            {getEventTypeLabel(event.type)}
          </Box>

          {/* Date Overlay at Bottom */}
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              padding: "20px",
              background:
                "linear-gradient(0deg, rgba(74,44,23,0.9) 0%, transparent 100%)",
            }}
          >
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                background: "rgba(255,253,251,0.15)",
                backdropFilter: "blur(10px)",
                padding: "8px 16px",
                borderRadius: "20px",
                border: "1px solid rgba(255,253,251,0.2)",
              }}
            >
              <Typography
                sx={{
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  color: "#FFFDFB",
                  fontFamily: '"Inter", sans-serif',
                }}
              >
                📅 {formatEventDate(event.eventStartDate)} • 🕐{" "}
                {formatEventTime(event.eventStartDate)}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Event Details */}
        <Box
          sx={{
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {/* Title */}
          <Typography
            sx={{
              fontSize: "1.5rem",
              fontWeight: 800,
              color: "#4A2C17",
              fontFamily: '"Cormorant Garamond", Georgia, serif',
              lineHeight: 1.2,
            }}
          >
            {event.title}
          </Typography>

          {/* Decorative Divider */}
          <Box
            sx={{
              width: "60px",
              height: "3px",
              background: `linear-gradient(90deg, ${color}, transparent)`,
              borderRadius: "2px",
            }}
          />

          {/* Description */}
          <Typography
            sx={{
              fontSize: "0.95rem",
              color: "#6A3A1E",
              fontFamily: '"Inter", sans-serif',
              lineHeight: 1.7,
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
            }}
          >
            {event.description}
          </Typography>

          {/* Read More Button */}
          <Button
            onClick={() => navigate("/events")}
            sx={{
              marginTop: "12px",
              width: "100%",
              fontWeight: 700,
              color: "#FFFDFB",
              padding: "14px 28px",
              border: "none",
              fontFamily: '"Inter", sans-serif',
              fontSize: "0.9rem",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
              borderRadius: "30px",
              transition: "all 0.4s ease",
              boxShadow: `0 10px 25px ${color}40`,
              "&:active": {
                transform: "scale(0.97)",
                boxShadow: `0 6px 15px ${color}50`,
              },
            }}
          >
            View Details →
          </Button>
        </Box>
      </Box>
    </>
  );
};
const EventsSection = () => {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLDivElement>(null);

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
    <Box
      ref={sectionRef}
      sx={{
        margin: 0,
        padding: 0,
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #FDF8F3 0%, #F5EBE0 30%, #E8D5C4 60%, #F5EBE0 85%, #FDF8F3 100%)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: '"Inter", sans-serif',
        py: { xs: 10, md: 14 },
        position: "relative",
        overflow: "hidden",
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
        {/* Large Decorative Circle */}
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

        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <Box
            key={i}
            component={motion.div}
            animate={{
              y: [0, -30, 0],
              x: [0, i % 2 === 0 ? 10 : -10, 0],
              opacity: [0.1, 0.4, 0.1],
            }}
            transition={{
              duration: 6 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.2,
            }}
            sx={{
              position: "absolute",
              width: `${3 + (i % 4) * 2}px`,
              height: `${3 + (i % 4) * 2}px`,
              borderRadius: "50%",
              background: i % 3 === 0 ? "#D9A756" : "rgba(106,58,30,0.3)",
              top: `${5 + i * 4.5}%`,
              left: `${5 + i * 4.8}%`,
            }}
          />
        ))}
      </Box>

      {/* Section Header */}
      <Box
        sx={{
          py: { xs: 4, md: 6 },
          textAlign: "center",
          position: "relative",
          width: "100%",
          maxWidth: "1200px",
          px: 3,
          zIndex: 1,
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
            mb: 3,
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
            mb: 2,
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
            fontSize: { xs: "2.8rem", sm: "4rem", md: "5rem" },
            fontWeight: 700,
            color: "#4A2C17",
            mb: 3,
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
            fontSize: { xs: "1rem", md: "1.15rem" },
            color: "#6A3A1E",
            maxWidth: 650,
            mx: "auto",
            lineHeight: 1.9,
            fontWeight: 400,
            px: 3,
            mb: 4,
          }}
        >
          Unforgettable experiences, live entertainment, and celebrations that
          bring our community together
        </Typography>

        {/* Decorative Divider */}
        <Box
          component={motion.div}
          initial={{ width: 0 }}
          whileInView={{ width: "180px" }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          sx={{
            height: "1px",
            background:
              "linear-gradient(90deg, transparent, rgba(217,167,86,0.5), transparent)",
            mx: "auto",
            mb: 6,
          }}
        />
      </Box>

      {/* Cards Container */}
      <Box
        sx={{
          width: "100%",
          maxWidth: "1100px",
          position: "relative",
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: { xs: 5, sm: 4, md: 5 },
          px: { xs: 3, sm: 4 },
          mb: { xs: 8, md: 12 },
          alignItems: "flex-start",
          flexDirection: { xs: "column", sm: "row" },
          zIndex: 1,
        }}
      >
        {displayableEvents.map((event, index) => (
          <EventCard key={event.id} event={event} index={index} />
        ))}
      </Box>

      {/* Call to Action */}
      <Box
        sx={{
          py: { xs: 4, md: 6 },
          textAlign: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Button
          component={motion.button}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          whileHover={{ scale: 1.05, y: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/events")}
          sx={{
            px: { xs: 5, md: 7 },
            py: { xs: 2, md: 2.5 },
            background: "linear-gradient(135deg, #D9A756 0%, #B08030 100%)",
            border: "none",
            borderRadius: "50px",
            color: "#FFFDFB",
            fontFamily: '"Cormorant Garamond", Georgia, serif',
            fontSize: { xs: "1.1rem", md: "1.3rem" },
            fontWeight: 700,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            position: "relative",
            overflow: "hidden",
            boxShadow:
              "0 15px 40px rgba(217,167,86,0.4), 0 5px 15px rgba(106,58,30,0.2)",
            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: "-100%",
              width: "100%",
              height: "100%",
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)",
              transition: "left 0.6s",
            },
            "&:hover": {
              boxShadow:
                "0 20px 50px rgba(217,167,86,0.5), 0 10px 25px rgba(106,58,30,0.25)",
              "&::before": {
                left: "100%",
              },
            },
          }}
        >
          Explore All Events →
        </Button>
      </Box>
    </Box>
  );
};

export default EventsSection;
