import { useMemo } from "react";
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
        width: "100vw",
        py: { xs: 6, md: 10 },
        px: { xs: 2, md: 4 },
        background: "linear-gradient(180deg, #3C1F0E 0%, #6A3A1E 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative background */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `radial-gradient(circle at 20% 30%, rgba(217,167,86,0.1) 0%, transparent 40%),
                           radial-gradient(circle at 80% 70%, rgba(217,167,86,0.08) 0%, transparent 40%)`,
          pointerEvents: "none",
        }}
      />

      {/* Section Header */}
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        sx={{
          textAlign: "center",
          mb: { xs: 4, md: 6 },
          position: "relative",
          zIndex: 1,
        }}
      >
        <Typography
          variant="overline"
          sx={{
            color: "#D9A756",
            letterSpacing: "0.3em",
            fontSize: { xs: "0.75rem", md: "0.85rem" },
            fontFamily: '"Inter", sans-serif',
            mb: 1,
            display: "block",
          }}
        >
          WHAT'S HAPPENING
        </Typography>

        <Typography
          variant="h2"
          sx={{
            fontFamily: '"Cormorant Garamond", Georgia, serif',
            fontSize: { xs: "2.5rem", sm: "3rem", md: "3.5rem" },
            fontWeight: 700,
            color: "#F3E3CC",
            mb: 2,
          }}
        >
          Upcoming Events
        </Typography>

        <Box
          sx={{
            width: 80,
            height: 3,
            background:
              "linear-gradient(90deg, transparent, #D9A756, transparent)",
            mx: "auto",
          }}
        />
      </Box>

      {/* Events Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: displayableEvents.length === 1 ? "1fr" : "repeat(2, 1fr)",
            md:
              displayableEvents.length === 1
                ? "1fr"
                : displayableEvents.length === 2
                ? "repeat(2, 1fr)"
                : "repeat(3, 1fr)",
          },
          gap: { xs: 3, md: 4 },
          maxWidth: "1400px",
          mx: "auto",
          position: "relative",
          zIndex: 1,
        }}
      >
        {displayableEvents.map((event, index) => (
          <Box
            key={event.id}
            component={motion.div}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            sx={{
              background: "rgba(255,255,255,0.05)",
              borderRadius: "16px",
              border: "1px solid rgba(217,167,86,0.2)",
              overflow: "hidden",
              transition: "all 0.3s ease",
              cursor: "pointer",
              "&:hover": {
                transform: "translateY(-8px)",
                boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
                border: "1px solid rgba(217,167,86,0.4)",
              },
            }}
            onClick={() => navigate("/events")}
          >
            {/* Event Image */}
            <Box
              sx={{
                position: "relative",
                height: { xs: 180, md: 200 },
                overflow: "hidden",
              }}
            >
              <Box
                component="img"
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
                  transition: "transform 0.5s ease",
                }}
              />

              {/* Event Type Badge */}
              <Box
                sx={{
                  position: "absolute",
                  top: 12,
                  left: 12,
                  background: "rgba(217,167,86,0.95)",
                  color: "#3C1F0E",
                  px: 2,
                  py: 0.5,
                  borderRadius: "20px",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  fontFamily: '"Inter", sans-serif',
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                {getEventTypeLabel(event.type)}
              </Box>

              {/* Gradient overlay */}
              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: "60%",
                  background:
                    "linear-gradient(to top, rgba(60,31,14,0.95) 0%, transparent 100%)",
                }}
              />
            </Box>

            {/* Event Info */}
            <Box sx={{ p: { xs: 2.5, md: 3 } }}>
              {/* Date and Time */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  mb: 2,
                }}
              >
                {/* Date */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.75,
                    color: "#D9A756",
                    fontSize: "0.85rem",
                    fontFamily: '"Inter", sans-serif',
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  {formatEventDate(event.eventStartDate)}
                </Box>

                {/* Time */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.75,
                    color: "#D9A756",
                    fontSize: "0.85rem",
                    fontFamily: '"Inter", sans-serif',
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12,6 12,12 16,14" />
                  </svg>
                  {formatEventTime(event.eventStartDate)}
                </Box>
              </Box>

              {/* Title */}
              <Typography
                variant="h5"
                sx={{
                  fontFamily: '"Cormorant Garamond", Georgia, serif',
                  fontSize: { xs: "1.3rem", md: "1.5rem" },
                  fontWeight: 600,
                  color: "#F3E3CC",
                  mb: 1.5,
                  lineHeight: 1.3,
                }}
              >
                {event.title}
              </Typography>

              {/* Description */}
              <Typography
                sx={{
                  fontFamily: '"Inter", sans-serif',
                  fontSize: "0.9rem",
                  color: "rgba(243,227,204,0.7)",
                  lineHeight: 1.6,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {event.description}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>

      {/* View All Events Button */}
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
        sx={{
          textAlign: "center",
          mt: { xs: 4, md: 6 },
          position: "relative",
          zIndex: 1,
        }}
      >
        <Button
          onClick={() => navigate("/events")}
          variant="outlined"
          sx={{
            px: 4,
            py: 1.5,
            borderColor: "#D9A756",
            color: "#D9A756",
            fontFamily: '"Cormorant Garamond", Georgia, serif',
            fontSize: "1.1rem",
            fontWeight: 600,
            letterSpacing: "0.05em",
            borderRadius: "30px",
            transition: "all 0.3s ease",
            "&:hover": {
              background: "#D9A756",
              color: "#3C1F0E",
              borderColor: "#D9A756",
              transform: "translateY(-2px)",
            },
          }}
        >
          View All Events
        </Button>
      </Box>
    </Box>
  );
};

export default EventsSection;
