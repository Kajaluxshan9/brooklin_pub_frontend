import { useMemo, useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import { motion } from "framer-motion";
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

// Expandable Card Component
const EventCard = ({ event }: { event: Event }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const color = getEventColor(event.type);

  return (
    <>
      {/* Desktop Version - Hover to Expand */}
      <Box
        sx={{
          display: { xs: "none", sm: "flex" },
          position: "relative",
          cursor: "pointer",
          width: "300px",
          flexDirection: "column",
        }}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        {/* Event Image */}
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: "300px",
            borderRadius: "10px",
            overflow: "hidden",
            boxShadow: "0 10px 30px rgba(106,58,30,0.2)",
            transition: "all 0.4s ease",
            ...(isExpanded && {
              boxShadow: "0 15px 40px rgba(106,58,30,0.3)",
              transform: "translateY(-5px)",
            }),
          }}
        >
          {/* Event Image Background */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${event.imageUrls?.[0]
                ? getImageUrl(event.imageUrls[0])
                : "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=400&q=80"
                })`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              backgroundColor: "rgba(245,245,245,0.6)",
              transition: "transform 0.4s ease",
              transform: isExpanded ? "scale(1.05)" : "scale(1)",
            }}
          />

          {/* Gradient Overlay */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(135deg, 
                ${color}20 0%, 
                ${color}40 100%)`,
              opacity: isExpanded ? 0.6 : 0.3,
              transition: "opacity 0.4s",
            }}
          />
        </Box>

        {/* Details Container - Expands on Hover */}
        <Box
          component={motion.div}
          animate={{
            height: isExpanded ? "auto" : "0px",
            opacity: isExpanded ? 1 : 0,
          }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          sx={{
            overflow: "hidden",
            background: "linear-gradient(135deg, #FDF8F3 0%, #F5EBE0 100%)",
            borderRadius: "0 0 10px 10px",
            boxShadow: "0 10px 30px rgba(106,58,30,0.2)",
            mt: isExpanded ? 1 : 0,
            transition: "margin-top 0.4s ease",
          }}
        >
          <Box
            sx={{
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {/* Date & Time */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Typography
                sx={{
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  color: "#6A3A1E",
                  fontFamily: '"Inter", sans-serif',
                }}
              >
                📅 {formatEventDate(event.eventStartDate)}
              </Typography>
              <Typography
                sx={{
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  color: "#6A3A1E",
                  fontFamily: '"Inter", sans-serif',
                }}
              >
                🕐 {formatEventTime(event.eventStartDate)}
              </Typography>
            </Box>

            {/* Title */}
            <Typography
              sx={{
                fontSize: "1.2rem",
                fontWeight: 800,
                color: "#4A2C17",
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                lineHeight: 1.2,
              }}
            >
              {event.title}
            </Typography>

            {/* Description */}
            <Typography
              sx={{
                margin: 0,
                padding: 0,
                fontSize: "0.9rem",
                color: "#6A3A1E",
                fontFamily: '"Inter", sans-serif',
                lineHeight: 1.5,
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
                marginTop: "10px",
                display: "inline-block",
                textDecoration: "none",
                fontWeight: 700,
                color: "#FFFDFB",
                padding: "10px 20px",
                border: "none",
                fontFamily: '"Inter", sans-serif',
                fontSize: "0.85rem",
                textTransform: "uppercase",
                background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
                borderRadius: "30px",
                transition: "all 0.3s",
                boxShadow: `0 5px 15px ${color}40`,
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: `0 8px 20px ${color}60`,
                },
              }}
            >
              Read More
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Mobile Version - All Details Visible */}
      <Box
        sx={{
          display: { xs: "flex", sm: "none" },
          flexDirection: "column",
          width: "100%",
          maxWidth: "400px",
          background: "linear-gradient(135deg, #FFFDFB 0%, #FDF8F3 100%)",
          borderRadius: "15px",
          overflow: "hidden",
          boxShadow: "0 15px 40px rgba(106,58,30,0.25)",
          border: "1px solid rgba(217,167,86,0.2)",
        }}
      >
        {/* Event Image */}
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: "220px",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${event.imageUrls?.[0]
                ? getImageUrl(event.imageUrls[0])
                : "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=400&q=80"
                })`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              backgroundColor: "rgba(245,245,245,0.6)",
            }}
          />

          {/* Gradient Overlay */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(135deg, 
                ${color}15 0%, 
                ${color}30 100%)`,
            }}
          />

          {/* Event Type Badge */}
          <Box
            sx={{
              position: "absolute",
              top: 15,
              right: 15,
              background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
              color: "#FFFDFB",
              padding: "6px 14px",
              borderRadius: "20px",
              fontFamily: '"Inter", sans-serif',
              fontSize: "0.75rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              boxShadow: `0 4px 12px ${color}50`,
            }}
          >
            {getEventTypeLabel(event.type)}
          </Box>
        </Box>

        {/* Event Details */}
        <Box
          sx={{
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {/* Title */}
          <Typography
            sx={{
              fontSize: "1.4rem",
              fontWeight: 800,
              color: "#4A2C17",
              fontFamily: '"Cormorant Garamond", Georgia, serif',
              lineHeight: 1.2,
              mb: 1,
            }}
          >
            {event.title}
          </Typography>

          {/* Date & Time Row */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexWrap: "wrap",
              pb: 1,
              borderBottom: `2px solid ${color}30`,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Typography
                sx={{
                  fontSize: "0.9rem",
                  fontWeight: 700,
                  color: color,
                  fontFamily: '"Inter", sans-serif',
                }}
              >
                📅 {formatEventDate(event.eventStartDate)}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Typography
                sx={{
                  fontSize: "0.9rem",
                  fontWeight: 700,
                  color: color,
                  fontFamily: '"Inter", sans-serif',
                }}
              >
                🕐 {formatEventTime(event.eventStartDate)}
              </Typography>
            </Box>
          </Box>

          {/* Description */}
          <Typography
            sx={{
              fontSize: "0.95rem",
              color: "#6A3A1E",
              fontFamily: '"Inter", sans-serif',
              lineHeight: 1.6,
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 4,
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
              width: "100%",
              fontWeight: 700,
              color: "#FFFDFB",
              padding: "12px 24px",
              border: "none",
              fontFamily: '"Inter", sans-serif',
              fontSize: "0.9rem",
              textTransform: "uppercase",
              background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
              borderRadius: "30px",
              transition: "all 0.3s",
              boxShadow: `0 6px 18px ${color}40`,
              "&:active": {
                transform: "scale(0.98)",
                boxShadow: `0 4px 12px ${color}50`,
              },
            }}
          >
            View Details
          </Button>
        </Box>
      </Box>
    </>
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
    <Box
      sx={{
        margin: 0,
        padding: 0,
        minHeight: "100vh",
        background: "linear-gradient(135deg, #FDF8F3 0%, #F5EBE0 50%, #FDF8F3 100%)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: '"Inter", sans-serif',
        py: { xs: 8, md: 12 },
      }}
    >
      {/* Section Header */}
      <Box
        sx={{
          py: { xs: 4, md: 6 },
          textAlign: "center",
          position: "relative",
          width: "100%",
          maxWidth: "1200px",
          px: 3,
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
            mb: 6,
          }}
        >
          Unforgettable experiences, live entertainment, and celebrations that
          bring our community together
        </Typography>
      </Box>

      {/* Cards Container */}
      <Box
        sx={{
          width: "100%",
          maxWidth: "1000px",
          position: "relative",
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: { xs: 4, sm: 3 },
          px: { xs: 2, sm: 3 },
          mb: { xs: 6, md: 10 },
          alignItems: "center",
          flexDirection: { xs: "column", sm: "row" },
        }}
      >
        {displayableEvents.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </Box>

      {/* Call to Action */}
      <Box
        sx={{
          py: { xs: 6, md: 8 },
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
            background: "linear-gradient(135deg, #D9A756 0%, #C5933E 100%)",
            border: "none",
            borderRadius: "50px",
            color: "#FFFDFB",
            fontFamily: '"Cormorant Garamond", Georgia, serif',
            fontSize: "1.3rem",
            fontWeight: 800,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 10px 30px rgba(217,167,86,0.4)",
            transition: "all 0.4s ease",
            "&:hover": {
              boxShadow: "0 15px 40px rgba(217,167,86,0.6)",
              transform: "translateY(-5px)",
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
