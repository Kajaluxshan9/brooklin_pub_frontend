import { useMemo, useState, useRef } from "react";
import { Box, Typography, Chip, Container } from "@mui/material";
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
import MenuBackground from "../components/menu/MenuBackground";
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

// 🎨 PREMIUM DIAGONAL ZIGZAG EVENT LAYOUT - Alternating Left/Right with Elegant Styling
const DiagonalEventItem = ({
  event,
  index,
}: {
  event: Event;
  index: number;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const color = getEventColor(event.type);
  const gradient = getEventGradient(event.type);
  const isEven = index % 2 === 0;

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, x: isEven ? -80 : 80, y: 40 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: 0.9,
        delay: 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        display: "flex",
        flexDirection: {
          xs: "column",
          md: isEven ? "row" : "row-reverse",
        },
        alignItems: "center",
        gap: { xs: 4, md: 6, lg: 8 },
        mb: { xs: 8, md: 0 },
        position: "relative",
      }}
    >
      {/* Image Section */}
      <Box
        component={motion.div}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        sx={{
          position: "relative",
          width: { xs: "100%", md: "50%" },
          maxWidth: { xs: "100%", sm: "450px", md: "none" },
          mx: { xs: "auto", md: 0 },
          px: { xs: 1, sm: 0 },
        }}
      >
        {/* Decorative Frame */}
        <Box
          sx={{
            display: { xs: "none", sm: "block" },
            position: "absolute",
            top: { sm: -12, md: -16 },
            left: isEven ? { sm: -12, md: -16 } : "auto",
            right: isEven ? "auto" : { sm: -12, md: -16 },
            width: { sm: "70%", md: "85%" },
            height: { sm: "70%", md: "85%" },
            border: "2px solid",
            borderColor: isHovered
              ? "rgba(217,167,86,0.6)"
              : "rgba(217,167,86,0.25)",
            transition: "all 0.5s ease",
            zIndex: 0,
          }}
        />

        {/* Main Image Container */}
        <Box
          sx={{
            position: "relative",
            aspectRatio: "4/5",
            overflow: "hidden",
            zIndex: 1,
            boxShadow: isHovered
              ? "0 30px 70px rgba(106,58,30,0.35)"
              : "0 15px 40px rgba(106,58,30,0.2)",
            transition: "box-shadow 0.5s ease",
            "&::before": {
              content: '""',
              position: "absolute",
              inset: 0,
              background: isHovered
                ? "linear-gradient(180deg, transparent 40%, rgba(60,31,14,0.6) 100%)"
                : "linear-gradient(180deg, transparent 50%, rgba(60,31,14,0.4) 100%)",
              zIndex: 2,
              transition: "all 0.5s ease",
              pointerEvents: "none",
            },
          }}
        >
          <Box
            component={motion.img}
            src={
              event.imageUrls?.[0]
                ? getImageUrl(event.imageUrls[0])
                : "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800&q=80"
            }
            alt={event.title}
            animate={{
              scale: isHovered ? 1.08 : 1,
            }}
            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: isHovered
                ? "brightness(1.05) saturate(1.1)"
                : "brightness(1)",
              transition: "filter 0.5s ease",
            }}
          />

          {/* Event Type Badge on Image */}
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            sx={{
              position: "absolute",
              top: 20,
              left: isEven ? 20 : "auto",
              right: isEven ? "auto" : 20,
              px: 2.5,
              py: 1,
              background: gradient,
              color: "#FFFDFB",
              fontFamily: '"Inter", sans-serif',
              fontSize: "0.7rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              borderRadius: "4px",
              boxShadow: `0 8px 25px ${color}60`,
              zIndex: 5,
            }}
          >
            {getEventTypeLabel(event.type)}
          </Box>

          {/* Gold Accent Corner - Decorative */}
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: isEven ? 0 : "auto",
              right: isEven ? "auto" : 0,
              width: { xs: 50, md: 65 },
              height: { xs: 50, md: 65 },
              background: gradient,
              clipPath: isEven
                ? "polygon(0 100%, 0 0, 100% 100%)"
                : "polygon(100% 100%, 100% 0, 0 100%)",
              zIndex: 3,
              opacity: isHovered ? 1 : 0.85,
              transition: "opacity 0.4s ease",
            }}
          />
        </Box>

        {/* Decorative Dot Pattern */}
        <Box
          sx={{
            position: "absolute",
            bottom: { sm: -20, md: -30 },
            left: isEven ? "auto" : { sm: -20, md: -30 },
            right: isEven ? { sm: -20, md: -30 } : "auto",
            display: { xs: "none", sm: "grid" },
            gridTemplateColumns: "repeat(3, 8px)",
            gap: "8px",
            opacity: isHovered ? 1 : 0.4,
            transition: "opacity 0.4s ease",
          }}
        >
          {[...Array(9)].map((_, i) => (
            <Box
              key={i}
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: color,
                opacity: ((i % 3) + i / 3) % 2 === 0 ? 1 : 0.4,
              }}
            />
          ))}
        </Box>

        {/* Date Circle Badge */}
        <Box
          component={motion.div}
          animate={{
            rotate: isHovered ? 0 : -12,
            scale: isHovered ? 1.1 : 1,
          }}
          transition={{ duration: 0.4 }}
          sx={{
            position: "absolute",
            bottom: { xs: 15, sm: 20, md: 40 },
            left: isEven ? "auto" : { xs: 10, sm: 20, md: -35 },
            right: isEven ? { xs: 10, sm: 20, md: -35 } : "auto",
            width: { xs: 60, sm: 70, md: 85 },
            height: { xs: 60, sm: 70, md: 85 },
            borderRadius: "50%",
            background: `linear-gradient(145deg, ${color} 0%, ${color}DD 100%)`,
            border: "4px solid #FFFDFB",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 15px 40px ${color}50`,
            zIndex: 10,
          }}
        >
          <Typography
            sx={{
              fontFamily: '"Cormorant Garamond", Georgia, serif',
              fontSize: { xs: "1.6rem", md: "2rem" },
              fontWeight: 700,
              color: "#FFFDFB",
              lineHeight: 1,
            }}
          >
            {new Date(event.eventStartDate).getDate()}
          </Typography>
          <Typography
            sx={{
              fontFamily: '"Inter", sans-serif',
              fontSize: { xs: "0.6rem", md: "0.7rem" },
              fontWeight: 700,
              color: "#FFFDFB",
              textTransform: "uppercase",
              mt: 0.3,
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
          width: { xs: "100%", md: "50%" },
          textAlign: { xs: "center", md: isEven ? "left" : "right" },
          px: { xs: 1, sm: 2, md: 0 },
        }}
      >
        {/* Decorative Line */}
        <Box
          component={motion.div}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          sx={{
            width: { xs: 60, md: 80 },
            height: 3,
            background: gradient,
            mb: 3,
            mx: { xs: "auto", md: isEven ? 0 : "auto" },
            mr: { md: isEven ? "auto" : 0 },
            transformOrigin: isEven ? "left" : "right",
          }}
        />

        {/* Event Title */}
        <Typography
          component={motion.h3}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          sx={{
            fontSize: { xs: "1.4rem", sm: "1.8rem", md: "2.5rem" },
            fontFamily: '"Cormorant Garamond", Georgia, serif',
            fontWeight: 700,
            color: "#3C1F0E",
            mb: { xs: 1.5, md: 2 },
            lineHeight: 1.2,
          }}
        >
          {event.title}
        </Typography>

        {/* Event Details - Date & Time */}
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: { xs: 1, sm: 2 },
            mb: { xs: 2, md: 3 },
            justifyContent: {
              xs: "center",
              md: isEven ? "flex-start" : "flex-end",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 0.75, md: 1 },
              px: { xs: 1.5, md: 2 },
              py: { xs: 0.5, md: 0.75 },
              background: "rgba(217,167,86,0.12)",
              borderRadius: "20px",
              border: "1px solid rgba(217,167,86,0.25)",
            }}
          >
            <CalendarTodayOutlinedIcon
              sx={{ fontSize: { xs: 14, md: 16 }, color: color }}
            />
            <Typography
              sx={{
                fontFamily: '"Inter", sans-serif',
                fontSize: { xs: "0.7rem", md: "0.8rem" },
                color: "#6A3A1E",
                fontWeight: 600,
              }}
            >
              {new Date(event.eventStartDate).toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 0.75, md: 1 },
              px: { xs: 1.5, md: 2 },
              py: { xs: 0.5, md: 0.75 },
              background: "rgba(217,167,86,0.12)",
              borderRadius: "20px",
              border: "1px solid rgba(217,167,86,0.25)",
            }}
          >
            <AccessTimeOutlinedIcon
              sx={{ fontSize: { xs: 14, md: 16 }, color: color }}
            />
            <Typography
              sx={{
                fontFamily: '"Inter", sans-serif',
                fontSize: { xs: "0.7rem", md: "0.8rem" },
                color: "#6A3A1E",
                fontWeight: 600,
              }}
            >
              {formatEventTime(event.eventStartDate)}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 0.75, md: 1 },
              px: { xs: 1.5, md: 2 },
              py: { xs: 0.5, md: 0.75 },
              background: "rgba(217,167,86,0.12)",
              borderRadius: "20px",
              border: "1px solid rgba(217,167,86,0.25)",
            }}
          >
            <LocationOnOutlinedIcon
              sx={{ fontSize: { xs: 14, md: 16 }, color: color }}
            />
            <Typography
              sx={{
                fontFamily: '"Inter", sans-serif',
                fontSize: { xs: "0.7rem", md: "0.8rem" },
                color: "#6A3A1E",
                fontWeight: 600,
              }}
            >
              Brooklin Pub
            </Typography>
          </Box>
        </Box>

        {/* Description */}
        <Typography
          component={motion.p}
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          sx={{
            fontSize: { xs: "0.95rem", md: "1rem" },
            fontFamily: '"Inter", sans-serif',
            color: "rgba(60,31,14,0.75)",
            lineHeight: 1.8,
            maxWidth: { xs: "none", md: "450px" },
            mx: { xs: "auto", md: isEven ? 0 : "auto" },
            ml: { md: isEven ? 0 : "auto" },
            mb: 3,
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {event.description}
        </Typography>

        {/* CTA Button */}
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.7 }}
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.98 }}
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: { xs: 1, md: 1.5 },
            px: { xs: 3, md: 4 },
            py: { xs: 1.25, md: 1.5 },
            background: gradient,
            borderRadius: "50px",
            color: "#FFFDFB",
            fontFamily: '"Inter", sans-serif',
            fontSize: "0.8rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            cursor: "pointer",
            boxShadow: `0 10px 30px ${color}40`,
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
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)",
              transition: "left 0.5s ease",
            },
            "&:hover": {
              boxShadow: `0 15px 40px ${color}50`,
              "&::before": {
                left: "100%",
              },
            },
          }}
        >
          Learn More
          <ArrowForwardIcon sx={{ fontSize: 16 }} />
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
          minHeight: { xs: "60vh", sm: "70vh", md: "85vh" },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          background: "linear-gradient(180deg, #FDF8F3 0%, #F5EBE0 100%)",
          pt: { xs: 10, sm: 8, md: 0 },
          pb: { xs: 6, sm: 4, md: 0 },
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
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
          <Box
            component={motion.div}
            style={{ y: heroY, opacity: heroOpacity }}
            sx={{
              textAlign: "center",
              position: "relative",
              zIndex: 2,
              px: { xs: 1, sm: 2, md: 0 },
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
                fontSize: { xs: "2.2rem", sm: "3.5rem", md: "5.5rem" },
                fontWeight: 700,
                color: "#4A2C17",
                lineHeight: 1.1,
                mb: { xs: 2, md: 3 },
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
                fontSize: { xs: "0.9rem", sm: "1rem", md: "1.2rem" },
                color: "#6A3A1E",
                maxWidth: 600,
                mx: "auto",
                lineHeight: 1.7,
                mb: { xs: 3, md: 4 },
                px: { xs: 1, sm: 0 },
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
                gap: { xs: 2, sm: 3, md: 6 },
                flexWrap: "wrap",
              }}
            >
              {[
                { value: displayableEvents.length, label: "Upcoming Events" },
                { value: "Live", label: "Entertainment" },
              ].map((stat, i) => (
                <Box
                  key={i}
                  sx={{
                    textAlign: "center",
                    px: { xs: 2, sm: 3 },
                    py: { xs: 1.5, sm: 2 },
                    background: "rgba(255,255,255,0.6)",
                    backdropFilter: "blur(10px)",
                    borderRadius: { xs: "16px", md: "20px" },
                    border: "1px solid rgba(217, 167, 86, 0.2)",
                    minWidth: { xs: "120px", sm: "auto" },
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
                display: { xs: "none", sm: "flex" },
                position: "absolute",
                bottom: { sm: -60, md: -80 },
                left: "50%",
                transform: "translateX(-50%)",
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
          py: { xs: 10, md: 14 },
          position: "relative",
          background:
            "linear-gradient(180deg, #FDF8F3 0%, #FAF7F2 50%, #FDF8F3 100%)",
        }}
      >
        {/* Premium Background */}
        <MenuBackground />

        {/* Section Header */}
        <Container
          maxWidth="lg"
          sx={{ position: "relative", zIndex: 2, mb: { xs: 6, md: 8 } }}
        >
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            sx={{
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Box
              sx={{
                width: 80,
                height: 3,
                background:
                  "linear-gradient(90deg, transparent, #D9A756, transparent)",
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
              sx={{
                color: "#D9A756",
                letterSpacing: "0.3em",
                fontSize: { xs: "0.7rem", sm: "0.8rem" },
                fontFamily: '"Inter", sans-serif',
                fontWeight: 700,
                textTransform: "uppercase",
              }}
            >
              ◆ Mark Your Calendar ◆
            </Typography>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
                color: "#3C1F0E",
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                fontWeight: 700,
                letterSpacing: "-0.02em",
                lineHeight: 1.2,
              }}
            >
              Featured{" "}
              <Box
                component="span"
                sx={{
                  background:
                    "linear-gradient(135deg, #D9A756 0%, #B08030 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Experiences
              </Box>
            </Typography>
            <Box
              sx={{
                width: { xs: 100, md: 150 },
                height: 1,
                background:
                  "linear-gradient(90deg, transparent, rgba(217,167,86,0.5), transparent)",
              }}
            />
          </Box>
        </Container>

        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
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
                    <Box key={monthYear} sx={{ mb: { xs: 8, md: 12 } }}>
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
                          mb: { xs: 6, md: 8 },
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
                              "linear-gradient(90deg, rgba(217, 167, 86, 0.4), transparent)",
                            borderRadius: 1,
                          }}
                        />
                        <Chip
                          label={`${events.length} event${
                            events.length > 1 ? "s" : ""
                          }`}
                          size="small"
                          sx={{
                            background:
                              "linear-gradient(135deg, rgba(217, 167, 86, 0.2), rgba(217, 167, 86, 0.1))",
                            color: "#6A3A1E",
                            fontFamily: '"Inter", sans-serif',
                            fontWeight: 700,
                            fontSize: "0.75rem",
                            border: "1px solid rgba(217,167,86,0.3)",
                          }}
                        />
                      </Box>

                      {/* Diagonal Zigzag Events Layout */}
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: { xs: 6, md: 10 },
                        }}
                      >
                        {events.map((event, index) => (
                          <DiagonalEventItem
                            key={event.id}
                            event={event}
                            index={groupIndex * 10 + index}
                          />
                        ))}
                      </Box>
                    </Box>
                  )
                )}
              </Box>
            </AnimatePresence>
          )}
        </Container>

        {/* Bottom decorative element */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            mt: { xs: 8, md: 12 },
            position: "relative",
            zIndex: 2,
          }}
        >
          <Box
            sx={{
              width: { xs: 30, md: 60 },
              height: 1,
              background:
                "linear-gradient(90deg, transparent, rgba(217,167,86,0.5))",
            }}
          />
          <Box
            sx={{
              width: 12,
              height: 12,
              border: "2px solid #D9A756",
              transform: "rotate(45deg)",
              opacity: 0.6,
            }}
          />
          <Typography
            sx={{
              color: "rgba(217,167,86,0.8)",
              fontSize: { xs: "0.7rem", md: "0.8rem" },
              fontFamily: '"Inter", sans-serif',
              fontWeight: 600,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              px: 2,
            }}
          >
            More Events Coming Soon
          </Typography>
          <Box
            sx={{
              width: 12,
              height: 12,
              border: "2px solid #D9A756",
              transform: "rotate(45deg)",
              opacity: 0.6,
            }}
          />
          <Box
            sx={{
              width: { xs: 30, md: 60 },
              height: 1,
              background:
                "linear-gradient(90deg, rgba(217,167,86,0.5), transparent)",
            }}
          />
        </Box>
      </Box>

      {/* Host Your Event Section */}
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

        <Container maxWidth="lg">
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            sx={{
              position: "relative",
              zIndex: 1,
            }}
          >
            {/* Section Header */}
            <Box sx={{ textAlign: "center", mb: { xs: 5, md: 6 } }}>
              <Typography
                sx={{
                  color: "#D9A756",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  mb: 2,
                }}
              >
                ◆ Book Brooklin Pub ◆
              </Typography>
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
                Host Your Next{" "}
                <Box component="span" sx={{ color: "#D9A756" }}>
                  Celebration
                </Box>
              </Typography>
              <Typography
                sx={{
                  fontFamily: '"Inter", sans-serif',
                  fontSize: { xs: "1rem", md: "1.1rem" },
                  color: "#6A3A1E",
                  lineHeight: 1.8,
                  maxWidth: 600,
                  mx: "auto",
                }}
              >
                From milestone birthdays to corporate team building, we've got
                the space, the food, and the atmosphere to make your event
                unforgettable.
              </Typography>
            </Box>

            {/* Event Types Grid */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(4, 1fr)",
                },
                gap: 3,
                mb: { xs: 5, md: 6 },
              }}
            >
              {[
                {
                  icon: "🎂",
                  title: "Birthday Parties",
                  desc: "Make it a birthday to remember",
                },
                {
                  icon: "🎓",
                  title: "Graduations",
                  desc: "Celebrate their achievement",
                },
                {
                  icon: "💼",
                  title: "Corporate Events",
                  desc: "Team building & client entertainment",
                },
                {
                  icon: "🎉",
                  title: "Special Occasions",
                  desc: "Anniversaries, reunions & more",
                },
              ].map((item, i) => (
                <Box
                  key={i}
                  component={motion.div}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  sx={{
                    p: 3,
                    borderRadius: "20px",
                    background: "rgba(255,255,255,0.8)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(217,167,86,0.2)",
                    textAlign: "center",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                    "&:hover": {
                      boxShadow: "0 15px 40px rgba(106,58,30,0.15)",
                      borderColor: "rgba(217,167,86,0.4)",
                    },
                  }}
                >
                  <Typography sx={{ fontSize: "2.5rem", mb: 1.5 }}>
                    {item.icon}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: '"Cormorant Garamond", Georgia, serif',
                      fontSize: "1.2rem",
                      fontWeight: 700,
                      color: "#3C1F0E",
                      mb: 0.5,
                    }}
                  >
                    {item.title}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: '"Inter", sans-serif',
                      fontSize: "0.85rem",
                      color: "#6A3A1E",
                    }}
                  >
                    {item.desc}
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* Features & CTA */}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                alignItems: "center",
                justifyContent: "center",
                gap: { xs: 4, md: 6 },
                p: { xs: 3, md: 5 },
                borderRadius: "24px",
                background:
                  "linear-gradient(145deg, rgba(255,255,255,0.9), rgba(253,248,243,0.8))",
                border: "2px solid rgba(217,167,86,0.3)",
                boxShadow: "0 20px 60px rgba(106,58,30,0.1)",
              }}
            >
              {/* What We Offer */}
              <Box sx={{ flex: 1 }}>
                <Typography
                  sx={{
                    fontFamily: '"Cormorant Garamond", Georgia, serif',
                    fontSize: { xs: "1.5rem", md: "1.8rem" },
                    fontWeight: 700,
                    color: "#3C1F0E",
                    mb: 2,
                  }}
                >
                  What We Offer
                </Typography>
                <Box
                  sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
                >
                  {[
                    "Private & semi-private spaces for 20-100 guests",
                    "Customizable food & drink packages",
                    "AV equipment for presentations",
                    "Dedicated event coordinator",
                    "Flexible booking times",
                  ].map((feature, i) => (
                    <Box
                      key={i}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                      }}
                    >
                      <Box
                        sx={{
                          width: 20,
                          height: 20,
                          borderRadius: "50%",
                          background:
                            "linear-gradient(135deg, #D9A756, #B08030)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <Typography
                          sx={{
                            color: "#fff",
                            fontSize: "0.7rem",
                            fontWeight: 700,
                          }}
                        >
                          ✓
                        </Typography>
                      </Box>
                      <Typography
                        sx={{
                          fontFamily: '"Inter", sans-serif',
                          fontSize: "0.95rem",
                          color: "#4A2C17",
                        }}
                      >
                        {feature}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>

              {/* CTA Box */}
              <Box
                sx={{
                  flex: { md: "0 0 auto" },
                  textAlign: "center",
                  p: { xs: 3, md: 4 },
                  borderRadius: "20px",
                  background:
                    "linear-gradient(135deg, #6A3A1E 0%, #4A2C17 100%)",
                  boxShadow: "0 15px 40px rgba(106,58,30,0.35)",
                  minWidth: { md: 280 },
                }}
              >
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    background: "rgba(217,167,86,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mx: "auto",
                    mb: 2,
                  }}
                >
                  <CalendarTodayOutlinedIcon
                    sx={{ fontSize: 28, color: "#D9A756" }}
                  />
                </Box>
                <Typography
                  sx={{
                    fontFamily: '"Cormorant Garamond", Georgia, serif',
                    fontSize: "1.4rem",
                    fontWeight: 700,
                    color: "#FFFDFB",
                    mb: 1,
                  }}
                >
                  Ready to Plan?
                </Typography>
                <Typography
                  sx={{
                    fontFamily: '"Inter", sans-serif',
                    fontSize: "0.9rem",
                    color: "rgba(255,253,251,0.8)",
                    mb: 3,
                  }}
                >
                  Let's make your event special
                </Typography>
                <Box
                  component={motion.a}
                  href="/contactus?subject=event"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 1.5,
                    px: 4,
                    py: 1.5,
                    background:
                      "linear-gradient(135deg, #D9A756 0%, #B08030 100%)",
                    borderRadius: "50px",
                    color: "#FFFDFB",
                    fontFamily: '"Inter", sans-serif',
                    fontSize: "0.9rem",
                    fontWeight: 700,
                    textDecoration: "none",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    boxShadow: "0 8px 25px rgba(217,167,86,0.4)",
                    transition: "all 0.3s ease",
                  }}
                >
                  Book Your Event
                  <ArrowForwardIcon sx={{ fontSize: 18 }} />
                </Box>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
};

export default Events;
