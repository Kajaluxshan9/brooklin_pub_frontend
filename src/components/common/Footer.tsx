import { useState, useEffect, useMemo, useRef } from "react";
import {
  Box,
  Typography,
  Link as MUILink,
  Container,
  IconButton,
  Button,
  Divider,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useApiWithCache } from "../../hooks/useApi";
import { openingHoursService } from "../../services/opening-hours.service";
import type { OpeningHours } from "../../types/api.types";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import { SvgIcon } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { Link } from "react-router-dom";
import gsap from "gsap";

// Extend dayjs with timezone support
dayjs.extend(utc);
dayjs.extend(timezone);

// Toronto timezone for accurate open/close status
const TIMEZONE = "America/Toronto";

// TikTok Icon Component
const TikTokIcon = () => (
  <SvgIcon viewBox="0 0 24 24" sx={{ fontSize: 22 }}>
    <path
      d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"
      fill="currentColor"
    />
  </SvgIcon>
);

const Footer = () => {
  const bgRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Animate background shapes - disable on mobile for performance
  useEffect(() => {
    if (!bgRef.current || isMobile) return;

    const ctx = gsap.context(() => {
      const shapes = bgRef.current?.querySelectorAll(".footer-bg-shape");

      if (shapes) {
        shapes.forEach((shape, i) => {
          // Floating movement
          gsap.to(shape, {
            x: "random(-50, 50)",
            y: "random(-50, 50)",
            rotation: "random(-90, 90)",
            duration: "random(10, 18)",
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });

          // Pulsing opacity
          gsap.to(shape, {
            opacity: "random(0.03, 0.08)",
            duration: "random(4, 8)",
            repeat: -1,
            yoyo: true,
            ease: "power1.inOut",
            delay: i * 0.3,
          });
        });
      }
    }, bgRef);

    return () => ctx.revert();
  }, [isMobile]);

  // Geometric shapes for footer background
  const footerShapes = [
    {
      size: 180,
      top: "5%",
      left: "3%",
      rotation: 45,
      type: "square",
      color: "#D9A756",
    },
    {
      size: 120,
      top: "60%",
      left: "90%",
      rotation: 0,
      type: "circle",
      color: "#B08030",
    },
    {
      size: 150,
      top: "25%",
      left: "80%",
      rotation: 30,
      type: "square",
      color: "#D9A756",
    },
    {
      size: 100,
      top: "75%",
      left: "10%",
      rotation: 60,
      type: "circle",
      color: "#B08030",
    },
    {
      size: 140,
      top: "45%",
      left: "95%",
      rotation: 15,
      type: "square",
      color: "#D9A756",
    },
    {
      size: 90,
      top: "10%",
      left: "60%",
      rotation: 75,
      type: "circle",
      color: "#B08030",
    },
  ];

  const quickLinks = [
    { label: "Home", to: "/", icon: "→" },
    { label: "Our Story", to: "/about", icon: "→" },
    { label: "Menu", to: "/menu", icon: "→" },
    { label: "Daily Specials", to: "/special/daily", icon: "→" },
    { label: "Events", to: "/events", icon: "→" },
    { label: "Contact Us", to: "/contactus", icon: "→" },
  ];

  // Menu PDF download link
  const menuPdfUrl = "/menu/Main Menu - Brooklin Pub.pdf";

  // Fetch opening hours from backend (cached for 5 mins)
  const { data: openingHoursData } = useApiWithCache<OpeningHours[]>(
    "opening-hours",
    () => openingHoursService.getAllOpeningHours()
  );

  // State to trigger re-render for status updates
  const [, setTick] = useState(0);

  // Re-render every minute to update status
  useEffect(() => {
    const interval = setInterval(() => {
      setTick((t) => t + 1);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Day order for sorting
  const dayOrder = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  const dayAbbr: Record<string, string> = {
    monday: "MON",
    tuesday: "TUE",
    wednesday: "WED",
    thursday: "THU",
    friday: "FRI",
    saturday: "SAT",
    sunday: "SUN",
  };

  // Helper to format time to uppercase A.M./P.M. format
  const formatTime = (time: string) => {
    const timeMatch = time.match(/(\d{1,2}):?(\d{2})?\s*(am|pm|AM|PM)?/i);
    if (!timeMatch) return time.toUpperCase();

    let hours = parseInt(timeMatch[1]);
    const minutes = timeMatch[2] || "00";
    let period = timeMatch[3]?.toUpperCase() || "";

    if (!period) {
      if (hours >= 12) {
        period = "P.M.";
        if (hours > 12) hours -= 12;
      } else {
        period = "A.M.";
        if (hours === 0) hours = 12;
      }
    } else {
      period = period.replace("AM", "A.M.").replace("PM", "P.M.");
    }

    if (minutes === "00") {
      return `${hours} ${period}`;
    }
    return `${hours}:${minutes} ${period}`;
  };

  // Get sorted hours
  const sortedHours = openingHoursData
    ? [...openingHoursData].sort(
        (a, b) =>
          dayOrder.indexOf(a.dayOfWeek.toLowerCase()) -
          dayOrder.indexOf(b.dayOfWeek.toLowerCase())
      )
    : [];

  // Check if a specific day is today (using Toronto timezone)
  const isToday = (dayOfWeek: string) => {
    const today = dayjs().tz(TIMEZONE).format("dddd").toLowerCase();
    return dayOfWeek.toLowerCase() === today;
  };

  // Helper to check if hours are overnight (close time is before open time or isClosedNextDay flag)
  const isOvernightHours = (hours: OpeningHours): boolean => {
    if (hours.isClosedNextDay) return true;
    if (!hours.openTime || !hours.closeTime) return false;
    return hours.closeTime < hours.openTime;
  };

  // Calculate current open status locally (like admin panel)
  const currentStatus = useMemo(() => {
    if (!openingHoursData || openingHoursData.length === 0) {
      return { isOpen: false, message: "" };
    }

    const now = dayjs().tz(TIMEZONE);
    const currentDay = now.format("dddd").toLowerCase();
    const currentTime = now.format("HH:mm");

    // Find today's hours
    const todayHours = openingHoursData.find(
      (oh) => oh.dayOfWeek.toLowerCase() === currentDay
    );

    // Check if currently open based on today's hours
    if (
      todayHours &&
      todayHours.isActive &&
      todayHours.isOpen &&
      todayHours.openTime &&
      todayHours.closeTime
    ) {
      const openTime = todayHours.openTime;
      const closeTime = todayHours.closeTime;

      // Handle overnight hours (close time is before open time OR isClosedNextDay flag)
      if (isOvernightHours(todayHours)) {
        // Business closes next day - we're open if we're past opening time OR before close time
        if (currentTime >= openTime || currentTime <= closeTime) {
          return {
            isOpen: true,
            message: `Open until ${dayjs(closeTime, "HH:mm").format(
              "h:mm A"
            )} (overnight)`,
          };
        }
      } else {
        // Same day close
        if (currentTime >= openTime && currentTime <= closeTime) {
          return {
            isOpen: true,
            message: `Open until ${dayjs(closeTime, "HH:mm").format("h:mm A")}`,
          };
        }
      }
    }

    // Check if we're in overnight hours from previous day
    const previousDay = now.subtract(1, "day");
    const previousDayName = previousDay.format("dddd").toLowerCase();
    const previousDayHours = openingHoursData.find(
      (oh) => oh.dayOfWeek.toLowerCase() === previousDayName
    );

    if (
      previousDayHours &&
      previousDayHours.isActive &&
      previousDayHours.isOpen &&
      previousDayHours.openTime &&
      previousDayHours.closeTime
    ) {
      // Check if previous day has overnight hours
      if (
        isOvernightHours(previousDayHours) &&
        currentTime <= previousDayHours.closeTime
      ) {
        return {
          isOpen: true,
          message: `Open until ${dayjs(
            previousDayHours.closeTime,
            "HH:mm"
          ).format("h:mm A")}`,
        };
      }
    }

    // Currently closed - find next opening
    return { isOpen: false, message: "Currently closed" };
  }, [openingHoursData]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" as const },
    },
  } as const;

  return (
    <Box
      component="footer"
      sx={{
        background: "linear-gradient(180deg, #6A3A1E 0%, #4A2C17 100%)",
        color: "#F5EFE6",
        mt: "auto",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated Geometric Background - hide on mobile for performance */}
      {!isMobile && (
        <Box
          ref={bgRef}
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            overflow: "hidden",
            pointerEvents: "none",
          }}
        >
          {footerShapes.map((shape, i) => (
            <Box
              key={`footer-shape-${i}`}
              className="footer-bg-shape"
              sx={{
                position: "absolute",
                width: shape.size,
                height: shape.size,
                top: shape.top,
                left: shape.left,
                borderRadius: shape.type === "circle" ? "50%" : "20%",
                border: `2px solid ${shape.color}`,
                background: `${shape.color}10`,
                transform: `rotate(${shape.rotation}deg)`,
                opacity: 0.05,
              }}
            />
          ))}
        </Box>
      )}

      {/* Main Footer Content */}
      <Container
        maxWidth="lg"
        sx={{
          pt: { xs: 4, md: 6 },
          pb: { xs: 3, md: 5 },
          // Account for bottom nav on mobile
          mb: { xs: "calc(80px + env(safe-area-inset-bottom, 0px))", md: 0 },
        }}
      >
        <Box
          component={motion.div}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-30px" }}
          sx={{
            display: "grid",
            // On mobile, stack in 2 columns for better spacing
            gridTemplateColumns: {
              xs: "1fr 1fr",
              sm: "1fr 1fr",
              lg: "1.2fr 1fr 1fr 1fr",
            },
            gap: { xs: 3, sm: 4, md: 5 },
          }}
        >
          {/* Brand Section - full width on mobile */}
          <Box
            component={motion.div}
            variants={itemVariants}
            sx={{
              textAlign: { xs: "center", lg: "left" },
              gridColumn: { xs: "1 / -1", sm: "auto" }, // Full width on xs
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                justifyContent: { xs: "center", lg: "flex-start" },
                mb: 2.5,
              }}
            >
              <Box
                component={motion.img}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
                src="/brooklinpub-logo.png"
                alt="Brooklin Pub"
                sx={{
                  width: 70,
                  height: "auto",
                  filter: "brightness(1.1)",
                }}
              />
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: '"Cormorant Garamond", Georgia, serif',
                    fontWeight: 700,
                    letterSpacing: 1,
                    color: "#F5EFE6",
                    fontSize: "1.3rem",
                    lineHeight: 1.2,
                  }}
                >
                  BROOKLIN PUB
                </Typography>
              </Box>
            </Box>

            <Typography
              sx={{
                color: "rgba(245, 239, 230, 0.8)",
                fontSize: { xs: "0.85rem", sm: "0.9rem" },
                lineHeight: 1.8,
                letterSpacing: "0.01em",
                mb: 2.5,
                maxWidth: { xs: "100%", sm: 280 },
                mx: { xs: "auto", lg: 0 },
              }}
            >
              Brooklin's neighbourhood pub since 2014. Great food, cold beer,
              and the kind of atmosphere where everyone feels at home.
            </Typography>

            {/* Social Icons - larger touch targets */}
            <Box
              sx={{
                display: "flex",
                gap: { xs: 2, sm: 1.5 },
                justifyContent: { xs: "center", lg: "flex-start" },
              }}
            >
              <IconButton
                component={motion.a}
                href="https://www.facebook.com/brooklinpub"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit our Facebook page"
                whileHover={{ scale: 1.15, y: -3 }}
                whileTap={{ scale: 0.95 }}
                sx={{
                  bgcolor: "rgba(217, 167, 86, 0.15)",
                  color: "#D9A756",
                  width: { xs: 48, sm: 44 },
                  height: { xs: 48, sm: 44 },
                  border: "1px solid rgba(217, 167, 86, 0.3)",
                  "&:hover": {
                    bgcolor: "#D9A756",
                    color: "#3C1F0E",
                  },
                }}
              >
                <FacebookIcon sx={{ fontSize: { xs: 24, sm: 22 } }} />
              </IconButton>
              <IconButton
                component={motion.a}
                href="https://www.instagram.com/brooklinpubngrill/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit our Instagram page"
                whileHover={{ scale: 1.15, y: -3 }}
                whileTap={{ scale: 0.95 }}
                sx={{
                  bgcolor: "rgba(217, 167, 86, 0.15)",
                  color: "#D9A756",
                  width: { xs: 48, sm: 44 },
                  height: { xs: 48, sm: 44 },
                  border: "1px solid rgba(217, 167, 86, 0.3)",
                  "&:hover": {
                    bgcolor: "#D9A756",
                    color: "#3C1F0E",
                  },
                }}
              >
                <InstagramIcon sx={{ fontSize: { xs: 24, sm: 22 } }} />
              </IconButton>
              <IconButton
                component={motion.a}
                href="https://www.tiktok.com/@brooklinpubngrill"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit our TikTok page"
                whileHover={{ scale: 1.15, y: -3 }}
                whileTap={{ scale: 0.95 }}
                sx={{
                  bgcolor: "rgba(217, 167, 86, 0.15)",
                  color: "#D9A756",
                  width: { xs: 48, sm: 44 },
                  height: { xs: 48, sm: 44 },
                  border: "1px solid rgba(217, 167, 86, 0.3)",
                  "&:hover": {
                    bgcolor: "#D9A756",
                    color: "#3C1F0E",
                  },
                }}
              >
                <TikTokIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Quick Links Section */}
          <Box
            component={motion.div}
            variants={itemVariants}
            sx={{ textAlign: { xs: "left", sm: "left" } }}
          >
            <Typography
              sx={{
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                fontWeight: 700,
                fontSize: { xs: "1rem", sm: "1.15rem" },
                color: "#D9A756",
                mb: { xs: 1.5, sm: 2.5 },
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Explore
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: { xs: 1, sm: 1.3 },
                alignItems: { xs: "flex-start", sm: "flex-start" },
              }}
            >
              {quickLinks.map((link) => (
                <MUILink
                  key={link.to}
                  component={Link}
                  to={link.to}
                  underline="none"
                  sx={{
                    color: "rgba(245, 239, 230, 0.85)",
                    fontSize: { xs: "0.9rem", sm: "0.95rem" },
                    fontWeight: 500,
                    transition: "all 0.2s ease",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 1,
                    py: { xs: 0.3, sm: 0 }, // Extra padding for touch on mobile
                    "&:hover": {
                      color: "#D9A756",
                      transform: "translateX(5px)",
                    },
                    "&:active": {
                      color: "#D9A756",
                    },
                  }}
                >
                  <Box component="span" sx={{ fontSize: "0.85rem" }}>
                    {link.icon}
                  </Box>
                  {link.label}
                </MUILink>
              ))}
            </Box>

            {/* Download Menu PDF */}
            <Typography
              sx={{
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                fontWeight: 700,
                fontSize: { xs: "0.9rem", sm: "1rem" },
                color: "#D9A756",
                mt: { xs: 2, sm: 3 },
                mb: { xs: 1, sm: 1.5 },
                letterSpacing: 1,
                textTransform: "uppercase",
                opacity: 0.9,
              }}
            >
              Download Menu
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1.2,
                alignItems: { xs: "flex-start", sm: "flex-start" },
              }}
            >
              <MUILink
                href={menuPdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                download="Main Menu - Brooklin Pub.pdf"
                underline="none"
                sx={{
                  color: "rgba(245, 239, 230, 0.95)",
                  fontSize: { xs: "0.85rem", sm: "0.9rem" },
                  fontWeight: 600,
                  transition: "all 0.2s ease",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 1.5,
                  px: { xs: 1.5, sm: 2 },
                  py: { xs: 0.8, sm: 1 },
                  borderRadius: "8px",
                  background: "rgba(217, 167, 86, 0.15)",
                  border: "1px solid rgba(217, 167, 86, 0.3)",
                  "&:hover, &:active": {
                    color: "#FFFDFB",
                    background: "rgba(217, 167, 86, 0.3)",
                    transform: "translateX(5px)",
                    borderColor: "#D9A756",
                  },
                }}
              >
                <Box component="span" sx={{ fontSize: "1rem" }}>
                  📄
                </Box>
                Menu (PDF)
              </MUILink>
            </Box>
          </Box>

          {/* Opening Hours Section */}
          <Box
            component={motion.div}
            variants={itemVariants}
            sx={{ textAlign: { xs: "left", sm: "left" } }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: { xs: 1.5, sm: 2.5 },
                justifyContent: { xs: "flex-start", sm: "flex-start" },
              }}
            >
              <AccessTimeIcon
                sx={{ fontSize: { xs: 18, sm: 20 }, color: "#D9A756" }}
              />
              <Typography
                sx={{
                  fontFamily: '"Cormorant Garamond", Georgia, serif',
                  fontWeight: 700,
                  fontSize: { xs: "1rem", sm: "1.15rem" },
                  color: "#D9A756",
                  letterSpacing: 1,
                  textTransform: "uppercase",
                }}
              >
                Hours
              </Typography>
            </Box>

            {/* Open/Closed Status Badge */}
            {openingHoursData && openingHoursData.length > 0 && (
              <Box
                component={motion.div}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.8,
                  px: 2,
                  py: 0.6,
                  borderRadius: "20px",
                  bgcolor: currentStatus.isOpen
                    ? "rgba(34, 197, 94, 0.15)"
                    : "rgba(239, 68, 68, 0.15)",
                  border: `1px solid ${
                    currentStatus.isOpen
                      ? "rgba(34, 197, 94, 0.4)"
                      : "rgba(239, 68, 68, 0.4)"
                  }`,
                  mb: 2,
                }}
              >
                <motion.div
                  animate={{
                    scale: currentStatus.isOpen ? [1, 1.3, 1] : 1,
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: currentStatus.isOpen ? Infinity : 0,
                    ease: "easeInOut",
                  }}
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor: currentStatus.isOpen
                      ? "#22C55E"
                      : "#EF4444",
                  }}
                />
                <Typography
                  sx={{
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    color: currentStatus.isOpen ? "#22C55E" : "#EF4444",
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                  }}
                >
                  {currentStatus.isOpen ? "Open Now" : "Closed"}
                </Typography>
              </Box>
            )}

            {/* Hours List - Compact */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: { xs: 0.4, sm: 0.6 },
              }}
            >
              {sortedHours.length > 0 ? (
                sortedHours.map((hours, index) => {
                  const isTodayRow = isToday(hours.dayOfWeek);
                  const dayName =
                    dayAbbr[hours.dayOfWeek.toLowerCase()] ||
                    hours.dayOfWeek.slice(0, 3).toUpperCase();
                  const isClosed =
                    !hours.isOpen ||
                    !hours.isActive ||
                    !hours.openTime ||
                    !hours.closeTime;
                  const timeStr = isClosed
                    ? "Closed"
                    : `${formatTime(hours.openTime!)} - ${formatTime(
                        hours.closeTime!
                      )}`;

                  return (
                    <Box
                      key={hours.id || index}
                      sx={{
                        display: "flex",
                        justifyContent: { xs: "flex-start", sm: "flex-start" },
                        gap: { xs: 1.5, sm: 2 },
                        py: 0.4,
                        px: isTodayRow ? 1 : 0,
                        borderRadius: "6px",
                        bgcolor: isTodayRow
                          ? "rgba(217, 167, 86, 0.1)"
                          : "transparent",
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: { xs: "0.8rem", sm: "0.85rem" },
                          fontWeight: isTodayRow ? 700 : 500,
                          color: isTodayRow
                            ? "#D9A756"
                            : "rgba(245, 239, 230, 0.7)",
                          minWidth: { xs: 32, sm: 40 },
                        }}
                      >
                        {dayName}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: { xs: "0.8rem", sm: "0.85rem" },
                          fontWeight: isTodayRow ? 600 : 400,
                          color: isClosed
                            ? "rgba(239, 68, 68, 0.8)"
                            : isTodayRow
                            ? "#F5EFE6"
                            : "rgba(245, 239, 230, 0.7)",
                        }}
                      >
                        {timeStr}
                      </Typography>
                    </Box>
                  );
                })
              ) : (
                <Typography
                  sx={{
                    color: "rgba(245, 239, 230, 0.6)",
                    fontSize: { xs: "0.8rem", sm: "0.85rem" },
                  }}
                >
                  Hours coming soon
                </Typography>
              )}
            </Box>
          </Box>

          {/* Contact Section - full width on mobile for better tap targets */}
          <Box
            component={motion.div}
            variants={itemVariants}
            sx={{
              textAlign: { xs: "center", sm: "left" },
              gridColumn: { xs: "1 / -1", sm: "auto" },
            }}
          >
            <Typography
              sx={{
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                fontWeight: 700,
                fontSize: { xs: "1rem", sm: "1.15rem" },
                color: "#D9A756",
                mb: { xs: 1.5, sm: 2.5 },
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Get in Touch
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: { xs: 1.5, sm: 2 },
              }}
            >
              <Box
                component={motion.a}
                href="https://maps.google.com/?q=15+Baldwin+St,+Whitby,+ON+L1M+1A2"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ x: 5 }}
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 1.5,
                  justifyContent: { xs: "center", sm: "flex-start" },
                  textDecoration: "none",
                  cursor: "pointer",
                }}
              >
                <LocationOnIcon
                  sx={{ fontSize: 20, color: "#D9A756", mt: 0.3 }}
                />
                <Box>
                  <Typography
                    sx={{
                      color: "rgba(245, 239, 230, 0.9)",
                      fontSize: "0.9rem",
                      fontWeight: 500,
                      "&:hover": { color: "#D9A756" },
                    }}
                  >
                    15 Baldwin St
                  </Typography>
                  <Typography
                    sx={{
                      color: "rgba(245, 239, 230, 0.6)",
                      fontSize: "0.85rem",
                    }}
                  >
                    Whitby, ON L1M 1A2
                  </Typography>
                </Box>
              </Box>

              <Box
                component={motion.a}
                href="tel:+19054253055"
                whileHover={{ x: 5 }}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  justifyContent: { xs: "center", sm: "flex-start" },
                  textDecoration: "none",
                  cursor: "pointer",
                }}
              >
                <PhoneIcon sx={{ fontSize: 20, color: "#D9A756" }} />
                <Typography
                  sx={{
                    color: "rgba(245, 239, 230, 0.9)",
                    fontSize: "0.9rem",
                    fontWeight: 500,
                    "&:hover": { color: "#D9A756" },
                  }}
                >
                  (905) 425-3055
                </Typography>
              </Box>

              <Box
                component={motion.a}
                href="mailto:brooklinpub@gmail.com"
                whileHover={{ x: 5 }}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  justifyContent: { xs: "center", sm: "flex-start" },
                  textDecoration: "none",
                  cursor: "pointer",
                }}
              >
                <EmailIcon sx={{ fontSize: 20, color: "#D9A756" }} />
                <Typography
                  sx={{
                    color: "rgba(245, 239, 230, 0.9)",
                    fontSize: "0.9rem",
                    fontWeight: 500,
                    "&:hover": { color: "#D9A756" },
                  }}
                >
                  brooklinpub@gmail.com
                </Typography>
              </Box>
            </Box>

            {/* CTA Button */}
            <Button
              component={Link}
              to="/contactus"
              variant="outlined"
              endIcon={<ArrowForwardIcon />}
              sx={{
                mt: 3,
                borderColor: "#D9A756",
                color: "#D9A756",
                borderRadius: "8px",
                px: 2.5,
                py: 1,
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.9rem",
                "&:hover": {
                  bgcolor: "#D9A756",
                  color: "#3C1F0E",
                  borderColor: "#D9A756",
                },
              }}
            >
              Contact Us
            </Button>
          </Box>
        </Box>

        {/* Bottom Section with Divider */}
        <Divider
          sx={{
            my: 4,
            borderColor: "rgba(217, 167, 86, 0.2)",
          }}
        />

        {/* Copyright & Credits */}
        <Box
          component={motion.div}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              component="img"
              src="/brooklinpub-logo.png"
              alt=""
              sx={{ width: 24, height: "auto", opacity: 0.5 }}
            />
            <Typography
              sx={{ color: "rgba(245, 239, 230, 0.5)", fontSize: "0.85rem" }}
            >
              © {new Date().getFullYear()} Brooklin Pub. All rights reserved.
            </Typography>
          </Box>
          <Typography
            sx={{
              color: "rgba(245, 239, 230, 0.4)",
              fontSize: "0.8rem",
              fontFamily: '"Inter", sans-serif',
              fontWeight: 500,
            }}
          >
            Brought to life by{" "}
            <MUILink
              href="https://www.akvisionsystems.com/"
              target="_blank"
              rel="noopener noreferrer"
              underline="hover"
              sx={{
                color: "#D9A756",
                fontWeight: 600,
                fontFamily: '"Inter", sans-serif',
              }}
            >
              AK Vision Systems
            </MUILink>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
