import { useMemo, useState } from "react";
import {
  Box,
  Typography,
  Chip,
  Card,
  CardMedia,
  CardContent,
  Container,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import Nav from "../components/common/Nav";
import Footer from "../components/common/Footer";
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

// Get unique event types from events
const getEventTypes = (events: Event[]): string[] => {
  const types = new Set(events.map((e) => e.type));
  return ["all", ...Array.from(types)];
};

// Event Card Component
const EventCard = ({ event, index }: { event: Event; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  const color = getEventColor(event.type);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <Card
        component={motion.div}
        whileHover={{ y: -10, scale: 1.02 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          borderRadius: { xs: "16px", md: "24px" },
          overflow: "hidden",
          background: "linear-gradient(135deg, #FFFDFB 0%, #FAF7F2 100%)",
          border: `2px solid ${isHovered ? color : "rgba(217,167,86,0.3)"}`,
          boxShadow: isHovered
            ? `0 20px 60px ${color}40, 0 0 0 2px ${color}20`
            : "0 8px 32px rgba(106,58,30,0.12)",
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          cursor: "pointer",
        }}
      >
        {/* Image Section */}
        <Box
          sx={{
            position: "relative",
            height: { xs: 180, sm: 220, md: 260 },
            overflow: "hidden",
          }}
        >
          <CardMedia
            component={motion.div}
            animate={{ scale: isHovered ? 1.1 : 1 }}
            transition={{ duration: 0.6 }}
            sx={{
              height: "100%",
              backgroundImage: `url(${
                event.imageUrls?.[0]
                  ? getImageUrl(event.imageUrls[0])
                  : "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800&q=80"
              })`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />

          {/* Gradient Overlay */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(180deg, transparent 40%, rgba(26,13,10,0.85) 100%)`,
            }}
          />

          {/* Event Type Badge */}
          <Chip
            label={getEventTypeLabel(event.type)}
            component={motion.div}
            whileHover={{ scale: 1.1 }}
            sx={{
              position: "absolute",
              top: { xs: 12, md: 16 },
              right: { xs: 12, md: 16 },
              background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
              color: "#FFFDFB",
              fontFamily: '"Inter", sans-serif',
              fontWeight: 700,
              fontSize: { xs: "0.7rem", md: "0.8rem" },
              px: 1,
              height: { xs: 28, md: 32 },
              borderRadius: "20px",
              border: "2px solid rgba(255,255,255,0.3)",
              boxShadow: `0 4px 15px ${color}50`,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          />

          {/* Date Badge */}
          <Box
            sx={{
              position: "absolute",
              bottom: { xs: 12, md: 16 },
              left: { xs: 12, md: 16 },
              display: "flex",
              gap: 1,
            }}
          >
            <Chip
              icon={
                <svg
                  width="14"
                  height="14"
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
              }
              label={formatEventDate(event.eventStartDate).split(",")[0]}
              sx={{
                background: "rgba(255,255,255,0.95)",
                color: "#4A2C17",
                fontFamily: '"Inter", sans-serif',
                fontWeight: 600,
                fontSize: { xs: "0.7rem", md: "0.8rem" },
                height: { xs: 26, md: 30 },
                "& .MuiChip-icon": { color: color, ml: 0.5 },
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              }}
            />
          </Box>
        </Box>

        {/* Content Section */}
        <CardContent
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            p: { xs: 2, md: 3 },
          }}
        >
          {/* Title */}
          <Typography
            variant="h5"
            sx={{
              fontFamily: '"Cormorant Garamond", Georgia, serif',
              fontWeight: 700,
              color: "#4A2C17",
              fontSize: { xs: "1.3rem", sm: "1.5rem", md: "1.75rem" },
              mb: 1,
              lineHeight: 1.2,
            }}
          >
            {event.title}
          </Typography>

          {/* Date & Time */}
          <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                color: "#6A3A1E",
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
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <Typography
                variant="body2"
                sx={{
                  fontFamily: '"Inter", sans-serif',
                  fontSize: { xs: "0.8rem", md: "0.9rem" },
                }}
              >
                {formatEventDate(event.eventStartDate)}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                color: "#6A3A1E",
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
              <Typography
                variant="body2"
                sx={{
                  fontFamily: '"Inter", sans-serif',
                  fontSize: { xs: "0.8rem", md: "0.9rem" },
                }}
              >
                {formatEventTime(event.eventStartDate)}
              </Typography>
            </Box>
          </Box>

          {/* Description */}
          <Typography
            variant="body2"
            sx={{
              fontFamily: '"Inter", sans-serif',
              color: "rgba(74,44,23,0.85)",
              fontSize: { xs: "0.85rem", md: "0.95rem" },
              lineHeight: 1.7,
              flex: 1,
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {event.description}
          </Typography>

          {/* Bottom Accent Line */}
          <Box
            component={motion.div}
            animate={{ scaleX: isHovered ? 1 : 0.3 }}
            transition={{ duration: 0.3 }}
            sx={{
              height: 3,
              background: `linear-gradient(90deg, ${color} 0%, transparent 100%)`,
              mt: 2,
              borderRadius: 2,
              transformOrigin: "left",
            }}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
};

const Events = () => {
  const [selectedType, setSelectedType] = useState("all");

  // Fetch events
  const { data: eventsData, loading } = useApiWithCache<Event[]>(
    "all-events-page",
    () => eventsService.getActiveEvents()
  );

  // Filter and sort events
  const displayableEvents = useMemo((): Event[] => {
    if (!eventsData) return [];

    let filtered = eventsData.filter(shouldDisplayEvent);

    if (selectedType !== "all") {
      filtered = filtered.filter((e) => e.type === selectedType);
    }

    return filtered.sort(
      (a, b) =>
        new Date(a.eventStartDate).getTime() -
        new Date(b.eventStartDate).getTime()
    );
  }, [eventsData, selectedType]);

  const eventTypes = useMemo(
    () =>
      eventsData
        ? getEventTypes(eventsData.filter(shouldDisplayEvent))
        : ["all"],
    [eventsData]
  );

  return (
    <Box sx={{ minHeight: "100vh", background: "#FDF8F3" }}>
      <Nav />

      {/* Hero Section */}
      <Box
        sx={{
          pt: { xs: 14, md: 16 },
          pb: { xs: 8, md: 10 },
          minHeight: { xs: "55vh", sm: "50vh" },
          background:
            "linear-gradient(135deg, #FDF8F3 0%, #F5EBE0 50%, #E8D5C4 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative Elements */}
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
              width: `${30 + i * 15}px`,
              height: `${30 + i * 15}px`,
              border: "2px solid #D9A756",
              borderRadius: i % 2 === 0 ? "50%" : "0%",
              top: `${15 + i * 12}%`,
              left: `${5 + i * 15}%`,
              opacity: 0.15,
              pointerEvents: "none",
            }}
          />
        ))}

        <Container maxWidth="lg">
          {/* Header */}
          <Box sx={{ textAlign: "center", position: "relative", zIndex: 2 }}>
            {/* Decorative Line */}
            <Box
              component={motion.div}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1 }}
              sx={{
                width: 80,
                height: 3,
                background:
                  "linear-gradient(90deg, transparent, #D9A756, transparent)",
                mx: "auto",
                mb: 2,
              }}
            />

            <Typography
              component={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              variant="overline"
              sx={{
                color: "#D9A756",
                letterSpacing: "0.4em",
                fontSize: { xs: "0.75rem", md: "0.9rem" },
                fontFamily: '"Inter", sans-serif',
                fontWeight: 700,
                mb: 2,
                display: "block",
              }}
            >
              ✦ DISCOVER WHAT'S HAPPENING ✦
            </Typography>

            <Typography
              component={motion.h1}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              sx={{
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                fontSize: { xs: "2.5rem", sm: "3.5rem", md: "5rem" },
                fontWeight: 800,
                color: "#4A2C17",
                mb: 2,
                textShadow: "0 0 40px rgba(106,58,30,0.15)",
                letterSpacing: "-0.02em",
              }}
            >
              Upcoming Events
            </Typography>

            <Typography
              component={motion.p}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              sx={{
                fontFamily: '"Inter", sans-serif',
                fontSize: { xs: "0.95rem", md: "1.15rem" },
                color: "#6A3A1E",
                maxWidth: 600,
                mx: "auto",
                lineHeight: 1.8,
                px: 2,
              }}
            >
              From live music to trivia nights, there's always something
              exciting at The Brooklin Pub
            </Typography>
          </Box>

          {/* Filter Chips */}
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            sx={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: { xs: 1, md: 1.5 },
              mt: { xs: 4, md: 6 },
            }}
          >
            {eventTypes.map((type) => (
              <Chip
                key={type}
                label={type === "all" ? "All Events" : getEventTypeLabel(type)}
                onClick={() => setSelectedType(type)}
                component={motion.div}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                sx={{
                  px: { xs: 1.5, md: 2.5 },
                  py: { xs: 2, md: 2.5 },
                  height: "auto",
                  background:
                    selectedType === type
                      ? "linear-gradient(135deg, #D9A756 0%, #C5933E 100%)"
                      : "rgba(255,255,255,0.9)",
                  color: selectedType === type ? "#FFFDFB" : "#6A3A1E",
                  fontFamily: '"Inter", sans-serif',
                  fontWeight: 600,
                  fontSize: { xs: "0.8rem", md: "0.9rem" },
                  borderRadius: "25px",
                  border: `2px solid ${
                    selectedType === type ? "#D9A756" : "rgba(106,58,30,0.2)"
                  }`,
                  boxShadow:
                    selectedType === type
                      ? "0 8px 25px rgba(217,167,86,0.4)"
                      : "0 2px 8px rgba(106,58,30,0.1)",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  textTransform: "capitalize",
                  "&:hover": {
                    borderColor: "#D9A756",
                    boxShadow: "0 4px 15px rgba(217,167,86,0.3)",
                  },
                }}
              />
            ))}
          </Box>
        </Container>
      </Box>

      {/* Events Grid */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
        {loading ? (
          <Box sx={{ textAlign: "center", py: 10 }}>
            <Typography
              sx={{ color: "#6A3A1E", fontFamily: '"Inter", sans-serif' }}
            >
              Loading events...
            </Typography>
          </Box>
        ) : displayableEvents.length === 0 ? (
          <Box
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            sx={{
              textAlign: "center",
              py: 10,
              px: 3,
              background: "rgba(217,167,86,0.1)",
              borderRadius: "24px",
              border: "2px dashed rgba(217,167,86,0.3)",
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                color: "#6A3A1E",
                mb: 2,
              }}
            >
              No Events Found
            </Typography>
            <Typography
              sx={{ color: "#8B5A2B", fontFamily: '"Inter", sans-serif' }}
            >
              {selectedType === "all"
                ? "Check back soon for upcoming events!"
                : `No ${getEventTypeLabel(
                    selectedType
                  )} events scheduled. Try another category.`}
            </Typography>
          </Box>
        ) : (
          <AnimatePresence mode="wait">
            <Box
              component={motion.div}
              key={selectedType}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  lg: "repeat(3, 1fr)",
                },
                gap: { xs: 2, sm: 3, md: 4 },
              }}
            >
              {displayableEvents.map((event, index) => (
                <Box key={event.id}>
                  <EventCard event={event} index={index} />
                </Box>
              ))}
            </Box>
          </AnimatePresence>
        )}
      </Container>

      {/* Bottom CTA Section */}
      <Box
        sx={{
          py: { xs: 6, md: 10 },
          background: "linear-gradient(135deg, #F5EBE0 0%, #E8D5C4 100%)",
          textAlign: "center",
        }}
      >
        <Container maxWidth="md">
          <Typography
            component={motion.h3}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            sx={{
              fontFamily: '"Cormorant Garamond", Georgia, serif',
              fontSize: { xs: "1.8rem", md: "2.5rem" },
              fontWeight: 700,
              color: "#4A2C17",
              mb: 2,
            }}
          >
            Want to Host a Private Event?
          </Typography>
          <Typography
            component={motion.p}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            sx={{
              fontFamily: '"Inter", sans-serif',
              fontSize: { xs: "0.95rem", md: "1.1rem" },
              color: "#6A3A1E",
              mb: 4,
              lineHeight: 1.8,
            }}
          >
            The Brooklin Pub is the perfect venue for your next celebration.
            Contact us to learn more about our private event options.
          </Typography>
          <Box
            component={motion.a}
            href="/contactus"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.95 }}
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1.5,
              px: 5,
              py: 2,
              background: "linear-gradient(135deg, #6A3A1E 0%, #4A2C17 100%)",
              borderRadius: "50px",
              color: "#FFFDFB",
              fontFamily: '"Inter", sans-serif',
              fontSize: "1rem",
              fontWeight: 700,
              textDecoration: "none",
              boxShadow: "0 10px 30px rgba(106,58,30,0.3)",
              transition: "all 0.3s ease",
              "&:hover": {
                boxShadow: "0 15px 40px rgba(106,58,30,0.4)",
              },
            }}
          >
            Contact Us
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M5 12h14" />
              <path d="M12 5l7 7-7 7" />
            </svg>
          </Box>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
};

export default Events;
