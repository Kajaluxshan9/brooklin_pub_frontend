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
        py: { xs: 8, md: 12 },
        px: { xs: 2, md: 4 },
        background:
          "linear-gradient(135deg, #1a0d0a 0%, #2a1410 25%, #3C1F0E 50%, #2a1410 75%, #1a0d0a 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated Floating Particles */}
      <style>
        {`
          @keyframes float-particle {
            0%, 100% { 
              transform: translate(0, 0) scale(1);
              opacity: 0.3;
            }
            25% { 
              transform: translate(20px, -30px) scale(1.2);
              opacity: 0.6;
            }
            50% { 
              transform: translate(-15px, -60px) scale(0.8);
              opacity: 0.4;
            }
            75% { 
              transform: translate(30px, -40px) scale(1.1);
              opacity: 0.5;
            }
          }
          
          @keyframes glow-pulse {
            0%, 100% { 
              filter: brightness(1) blur(20px);
              opacity: 0.4;
            }
            50% { 
              filter: brightness(1.5) blur(30px);
              opacity: 0.7;
            }
          }

          @keyframes shimmer {
            0% { background-position: -1000px 0; }
            100% { background-position: 1000px 0; }
          }
        `}
      </style>

      {/* Floating Particles Effect */}
      {[...Array(12)].map((_, i) => (
        <Box
          key={i}
          sx={{
            position: "absolute",
            width: `${Math.random() * 6 + 3}px`,
            height: `${Math.random() * 6 + 3}px`,
            borderRadius: "50%",
            background: "#D9A756",
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animation: `float-particle ${Math.random() * 10 + 15}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`,
            pointerEvents: "none",
            zIndex: 1,
          }}
        />
      ))}

      {/* Parallax Glow Orbs */}
      <Box
        component={motion.div}
        sx={{
          position: "absolute",
          top: "15%",
          left: "10%",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(217,167,86,0.3) 0%, transparent 70%)",
          animation: "glow-pulse 8s ease-in-out infinite",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <Box
        component={motion.div}
        sx={{
          position: "absolute",
          bottom: "20%",
          right: "15%",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(106,58,30,0.25) 0%, transparent 70%)",
          animation: "glow-pulse 10s ease-in-out infinite",
          animationDelay: "2s",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Mesh Gradient Background */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            radial-gradient(at 20% 30%, rgba(217,167,86,0.15) 0%, transparent 50%),
            radial-gradient(at 80% 70%, rgba(139,38,53,0.12) 0%, transparent 50%),
            radial-gradient(at 50% 50%, rgba(106,58,30,0.1) 0%, transparent 60%)
          `,
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* Section Header with Reveal Animation */}
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        sx={{
          textAlign: "center",
          mb: { xs: 6, md: 10 },
          position: "relative",
          zIndex: 2,
        }}
      >
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
            fontSize: { xs: "3rem", sm: "4rem", md: "5rem" },
            fontWeight: 800,
            background:
              "linear-gradient(135deg, #F3E3CC 0%, #D9A756 50%, #F3E3CC 100%)",
            backgroundSize: "200% auto",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            mb: 3,
            textShadow: "0 0 40px rgba(217,167,86,0.3)",
            letterSpacing: "0.02em",
            animation: "shimmer 3s linear infinite",
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
            fontSize: { xs: "1rem", md: "1.15rem" },
            color: "rgba(243,227,204,0.85)",
            maxWidth: 700,
            mx: "auto",
            lineHeight: 1.8,
            fontWeight: 300,
          }}
        >
          Unforgettable experiences, live entertainment, and celebrations that
          bring our community together
        </Typography>
      </Box>

      {/* Innovative 3D Card Stack Layout */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md:
              displayableEvents.length === 1
                ? "1fr"
                : displayableEvents.length === 2
                  ? "repeat(2, 1fr)"
                  : "repeat(3, 1fr)",
          },
          gap: { xs: 4, md: 5 },
          maxWidth: "1400px",
          mx: "auto",
          position: "relative",
          zIndex: 2,
          perspective: "2000px",
        }}
      >
        {displayableEvents.map((event, index) => (
          <Box
            key={event.id}
            component={motion.div}
            initial={{ opacity: 0, y: 100, rotateX: -15 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{
              duration: 0.8,
              delay: index * 0.2,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            whileHover={{
              y: -20,
              rotateY: 5,
              rotateX: 5,
              scale: 1.05,
              transition: { duration: 0.4 },
            }}
            sx={{
              position: "relative",
              transformStyle: "preserve-3d",
              cursor: "pointer",
              "&:hover .event-card-inner": {
                transform: "rotateY(180deg)",
              },
            }}
            onClick={() => navigate("/events")}
          >
            {/* Card Inner Container for Flip Effect */}
            <Box
              className="event-card-inner"
              sx={{
                position: "relative",
                width: "100%",
                height: { xs: "450px", md: "500px" },
                transformStyle: "preserve-3d",
                transition: "transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              {/* Front of Card */}
              <Box
                sx={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  backfaceVisibility: "hidden",
                  background:
                    "linear-gradient(145deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
                  backdropFilter: "blur(20px)",
                  borderRadius: "24px",
                  border: "2px solid rgba(217,167,86,0.3)",
                  overflow: "hidden",
                  boxShadow:
                    "0 20px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: "-100%",
                    width: "100%",
                    height: "100%",
                    background:
                      "linear-gradient(90deg, transparent, rgba(217,167,86,0.1), transparent)",
                    transition: "left 0.6s",
                  },
                  "&:hover::before": {
                    left: "100%",
                  },
                }}
              >
                {/* Image with Parallax Effect */}
                <Box
                  sx={{
                    position: "relative",
                    height: "60%",
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
                      height: "120%",
                      objectFit: "cover",
                      transition: "transform 0.6s ease-out",
                      ".event-card-inner:hover &": {
                        transform: "scale(1.15) translateY(-10px)",
                      },
                    }}
                  />

                  {/* Gradient Overlay */}
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(to bottom, transparent 0%, rgba(26,13,10,0.7) 60%, rgba(26,13,10,0.95) 100%)",
                    }}
                  />

                  {/* Floating Badge */}
                  <Box
                    component={motion.div}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    sx={{
                      position: "absolute",
                      top: 20,
                      right: 20,
                      background:
                        "linear-gradient(135deg, #D9A756 0%, #C5933E 100%)",
                      color: "#1a0d0a",
                      px: 3,
                      py: 1,
                      borderRadius: "30px",
                      fontSize: "0.75rem",
                      fontWeight: 800,
                      fontFamily: '"Inter", sans-serif',
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      boxShadow:
                        "0 8px 20px rgba(217,167,86,0.4), inset 0 1px 0 rgba(255,255,255,0.3)",
                      border: "1px solid rgba(255,255,255,0.2)",
                    }}
                  >
                    {getEventTypeLabel(event.type)}
                  </Box>
                </Box>

                {/* Content Section */}
                <Box sx={{ p: 3.5, position: "relative" }}>
                  {/* Date & Time Pills */}
                  <Box
                    sx={{
                      display: "flex",
                      gap: 1.5,
                      mb: 2.5,
                      flexWrap: "wrap",
                    }}
                  >
                    <Box
                      component={motion.div}
                      whileHover={{ scale: 1.05, x: 5 }}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        background:
                          "linear-gradient(135deg, rgba(217,167,86,0.2) 0%, rgba(217,167,86,0.1) 100%)",
                        border: "1px solid rgba(217,167,86,0.4)",
                        borderRadius: "16px",
                        px: 2,
                        py: 1,
                        color: "#D9A756",
                        fontSize: "0.85rem",
                        fontFamily: '"Inter", sans-serif',
                        fontWeight: 700,
                        boxShadow: "0 4px 12px rgba(217,167,86,0.15)",
                      }}
                    >
                      <svg
                        width="16"
                        height="16"
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
                      whileHover={{ scale: 1.05, x: 5 }}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        background:
                          "linear-gradient(135deg, rgba(217,167,86,0.2) 0%, rgba(217,167,86,0.1) 100%)",
                        border: "1px solid rgba(217,167,86,0.4)",
                        borderRadius: "16px",
                        px: 2,
                        py: 1,
                        color: "#D9A756",
                        fontSize: "0.85rem",
                        fontFamily: '"Inter", sans-serif',
                        fontWeight: 700,
                        boxShadow: "0 4px 12px rgba(217,167,86,0.15)",
                      }}
                    >
                      <svg
                        width="16"
                        height="16"
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

                  {/* Title */}
                  <Typography
                    sx={{
                      fontFamily: '"Cormorant Garamond", Georgia, serif',
                      fontSize: { xs: "1.6rem", md: "1.85rem" },
                      fontWeight: 800,
                      color: "#F3E3CC",
                      mb: 1.5,
                      lineHeight: 1.2,
                      letterSpacing: "0.01em",
                      textShadow: "0 2px 10px rgba(0,0,0,0.3)",
                    }}
                  >
                    {event.title}
                  </Typography>

                  {/* Description Preview */}
                  <Typography
                    sx={{
                      fontFamily: '"Inter", sans-serif',
                      fontSize: "0.95rem",
                      color: "rgba(243,227,204,0.75)",
                      lineHeight: 1.6,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {event.description}
                  </Typography>

                  {/* Hover Hint */}
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 16,
                      right: 16,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      color: "#D9A756",
                      fontSize: "0.85rem",
                      fontFamily: '"Inter", sans-serif',
                      fontWeight: 600,
                      opacity: 0.7,
                    }}
                  >
                    <span>Flip for details</span>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                      <path d="M21 3v5h-5" />
                      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                      <path d="M3 21v-5h5" />
                    </svg>
                  </Box>
                </Box>
              </Box>

              {/* Back of Card */}
              <Box
                sx={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                  background:
                    "linear-gradient(135deg, rgba(217,167,86,0.15) 0%, rgba(60,31,14,0.95) 100%)",
                  backdropFilter: "blur(20px)",
                  borderRadius: "24px",
                  border: "2px solid rgba(217,167,86,0.5)",
                  p: 4,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: '"Cormorant Garamond", Georgia, serif',
                    fontSize: { xs: "2rem", md: "2.5rem" },
                    fontWeight: 800,
                    color: "#D9A756",
                    mb: 3,
                    textAlign: "center",
                  }}
                >
                  {event.title}
                </Typography>

                <Typography
                  sx={{
                    fontFamily: '"Inter", sans-serif',
                    fontSize: "1rem",
                    color: "#F3E3CC",
                    lineHeight: 1.8,
                    mb: 3,
                    textAlign: "center",
                  }}
                >
                  {event.description}
                </Typography>

                <Box
                  component={motion.button}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    navigate("/events");
                  }}
                  sx={{
                    background:
                      "linear-gradient(135deg, #D9A756 0%, #C5933E 100%)",
                    color: "#1a0d0a",
                    border: "none",
                    borderRadius: "30px",
                    px: 4,
                    py: 2,
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    fontFamily: '"Cormorant Garamond", Georgia, serif',
                    cursor: "pointer",
                    boxShadow: "0 8px 24px rgba(217,167,86,0.4)",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                  }}
                >
                  View Event Details
                </Box>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>

      {/* Call to Action Button */}
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.6 }}
        sx={{
          textAlign: "center",
          mt: { xs: 8, md: 12 },
          position: "relative",
          zIndex: 2,
        }}
      >
        <Button
          component={motion.button}
          whileHover={{ scale: 1.08, y: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/events")}
          sx={{
            px: 6,
            py: 2.5,
            background:
              "linear-gradient(135deg, transparent 0%, rgba(217,167,86,0.1) 100%)",
            border: "3px solid #D9A756",
            borderRadius: "50px",
            color: "#D9A756",
            fontFamily: '"Cormorant Garamond", Georgia, serif',
            fontSize: "1.3rem",
            fontWeight: 800,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            position: "relative",
            overflow: "hidden",
            boxShadow:
              "0 0 30px rgba(217,167,86,0.3), inset 0 0 20px rgba(217,167,86,0.1)",
            transition: "all 0.4s ease",
            "&::before": {
              content: '""',
              position: "absolute",
              top: "50%",
              left: "50%",
              width: "0",
              height: "0",
              borderRadius: "50%",
              background: "#D9A756",
              transform: "translate(-50%, -50%)",
              transition: "width 0.6s, height 0.6s",
              zIndex: -1,
            },
            "&:hover": {
              color: "#1a0d0a",
              borderColor: "#E8B76A",
              boxShadow: "0 0 50px rgba(217,167,86,0.6)",
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
