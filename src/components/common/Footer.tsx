import { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  Link as MUILink,
  Container,
  IconButton,
} from "@mui/material";
import { useApiWithCache } from "../../hooks/useApi";
import { openingHoursService } from "../../services/opening-hours.service";
import type { OpeningHours } from "../../types/api.types";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import { motion } from "framer-motion";
import moment from "moment-timezone";

// Toronto timezone for accurate open/close status
const TIMEZONE = "America/Toronto";

const Footer = () => {
  const quickLinks = [
    { label: "Home", to: "/" },
    { label: "About", to: "/about" },
    { label: "Menu", to: "/menu" },
    { label: "Specials", to: "/special/daily" },
    { label: "Contact", to: "/contactus" },
  ];

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
    const today = moment().tz(TIMEZONE).format("dddd").toLowerCase();
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

    const now = moment().tz(TIMEZONE);
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
            message: `Open until ${moment(closeTime, "HH:mm").format(
              "h:mm A"
            )} (overnight)`,
          };
        }
      } else {
        // Same day close
        if (currentTime >= openTime && currentTime <= closeTime) {
          return {
            isOpen: true,
            message: `Open until ${moment(closeTime, "HH:mm").format(
              "h:mm A"
            )}`,
          };
        }
      }
    }

    // Check if we're in overnight hours from previous day
    const previousDay = now.clone().subtract(1, "day");
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
          message: `Open until ${moment(
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
        background: "linear-gradient(180deg, #FAF7F2 0%, #F5EFE6 100%)",
        color: "#3D2914",
        pt: { xs: 5, md: 6 },
        pb: { xs: 3, md: 4 },
        mt: "auto",
      }}
    >
      <Container maxWidth="lg">
        {/* Main Footer Content */}
        <Box
          component={motion.div}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-30px" }}
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
              md: "1fr 1.5fr 1fr",
            },
            gap: { xs: 4, md: 5 },
            mb: 4,
          }}
        >
          {/* Brand + Contact Section */}
          <Box
            component={motion.div}
            variants={itemVariants}
            sx={{ textAlign: { xs: "center", md: "left" } }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                justifyContent: { xs: "center", md: "flex-start" },
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
                  width: 60,
                  height: "auto",
                }}
              />
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: '"Cormorant Garamond", Georgia, serif',
                    fontWeight: 700,
                    letterSpacing: 0.5,
                    color: "#3C1F0E",
                    fontSize: "1.1rem",
                    lineHeight: 1.2,
                  }}
                >
                  BROOKLIN PUB
                </Typography>
                <Typography
                  sx={{
                    color: "#D9A756",
                    fontSize: "0.7rem",
                    fontWeight: 600,
                    letterSpacing: 1.5,
                    textTransform: "uppercase",
                  }}
                >
                  & Grill
                </Typography>
              </Box>
            </Box>

            {/* Contact Info */}
            <Typography
              sx={{
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                fontWeight: 700,
                fontSize: "1.1rem",
                color: "#3C1F0E",
                mb: 1.5,
                mt: 2,
                letterSpacing: 0.5,
              }}
            >
              CONTACT US
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              <Box
                component={motion.a}
                href="https://maps.google.com/?q=15+Baldwin+St,+Whitby,+ON+L1M+1A2"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ x: 3 }}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  justifyContent: { xs: "center", md: "flex-start" },
                  textDecoration: "none",
                  cursor: "pointer",
                }}
              >
                <LocationOnIcon sx={{ fontSize: 16, color: "#D9A756" }} />
                <Typography
                  sx={{
                    color: "#6A3A1E",
                    fontSize: "0.85rem",
                    fontWeight: 500,
                    "&:hover": { color: "#D9A756" },
                  }}
                >
                  15 Baldwin St, Whitby, ON
                </Typography>
              </Box>

              <Box
                component={motion.a}
                href="tel:+19054253055"
                whileHover={{ x: 3 }}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  justifyContent: { xs: "center", md: "flex-start" },
                  textDecoration: "none",
                  cursor: "pointer",
                }}
              >
                <PhoneIcon sx={{ fontSize: 16, color: "#D9A756" }} />
                <Typography
                  sx={{
                    color: "#6A3A1E",
                    fontSize: "0.85rem",
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
                whileHover={{ x: 3 }}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  justifyContent: { xs: "center", md: "flex-start" },
                  textDecoration: "none",
                  cursor: "pointer",
                }}
              >
                <EmailIcon sx={{ fontSize: 16, color: "#D9A756" }} />
                <Typography
                  sx={{
                    color: "#6A3A1E",
                    fontSize: "0.85rem",
                    fontWeight: 500,
                    "&:hover": { color: "#D9A756" },
                  }}
                >
                  brooklinpub@gmail.com
                </Typography>
              </Box>
            </Box>

            {/* Social Icons */}
            <Box
              sx={{
                display: "flex",
                gap: 1,
                mt: 2.5,
                justifyContent: { xs: "center", md: "flex-start" },
              }}
            >
              <IconButton
                component={motion.a}
                href="https://facebook.com"
                target="_blank"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                sx={{
                  bgcolor: "#D9A756",
                  color: "#fff",
                  width: 36,
                  height: 36,
                  "&:hover": { bgcolor: "#6B3410" },
                }}
              >
                <FacebookIcon sx={{ fontSize: 18 }} />
              </IconButton>
              <IconButton
                component={motion.a}
                href="https://instagram.com"
                target="_blank"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                sx={{
                  bgcolor: "#D9A756",
                  color: "#fff",
                  width: 36,
                  height: 36,
                  "&:hover": { bgcolor: "#6B3410" },
                }}
              >
                <InstagramIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Box>
          </Box>

          {/* Opening Hours Section - Center */}
          <Box
            component={motion.div}
            variants={itemVariants}
            sx={{
              textAlign: "center",
              px: { xs: 0, md: 3 },
            }}
          >
            <Typography
              sx={{
                fontFamily: '"Cormorant Garamond", serif',
                fontWeight: 700,
                fontSize: "1.1rem",
                color: "#3C1F0E",
                mb: 0.5,
                letterSpacing: 0.5,
              }}
            >
              OPENING HOURS
            </Typography>

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
                  py: 0.5,
                  borderRadius: "20px",
                  bgcolor: currentStatus.isOpen
                    ? "rgba(34, 139, 34, 0.1)"
                    : "rgba(180, 83, 9, 0.1)",
                  border: `1px solid ${
                    currentStatus.isOpen
                      ? "rgba(34, 139, 34, 0.3)"
                      : "rgba(180, 83, 9, 0.3)"
                  }`,
                  mb: 2,
                }}
              >
                <motion.div
                  animate={{
                    scale: currentStatus.isOpen ? [1, 1.2, 1] : 1,
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
                      ? "#228B22"
                      : "#B45309",
                    boxShadow: currentStatus.isOpen
                      ? "0 0 8px rgba(34, 139, 34, 0.5)"
                      : "0 0 8px rgba(180, 83, 9, 0.5)",
                  }}
                />
                <Typography
                  sx={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    color: currentStatus.isOpen ? "#228B22" : "#B45309",
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                  }}
                >
                  {currentStatus.isOpen ? "Open Now" : "Closed"}
                </Typography>
              </Box>
            )}

            {/* Hours List */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 0.8,
                maxWidth: 320,
                mx: "auto",
              }}
            >
              {sortedHours.length > 0 ? (
                sortedHours.map((hours, index) => {
                  const isTodayRow = isToday(hours.dayOfWeek);
                  const dayName =
                    dayAbbr[hours.dayOfWeek.toLowerCase()] ||
                    hours.dayOfWeek.slice(0, 3).toUpperCase();
                  // Check if day is closed (isOpen=false or isActive=false or no times set)
                  const isClosed =
                    !hours.isOpen ||
                    !hours.isActive ||
                    !hours.openTime ||
                    !hours.closeTime;
                  // Check if overnight hours (logic available but hidden on public UI)
                  const timeStr = isClosed
                    ? "CLOSED"
                    : `${formatTime(hours.openTime!)} - ${formatTime(
                        hours.closeTime!
                      )}`;

                  return (
                    <Box
                      key={hours.id || index}
                      component={motion.div}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      viewport={{ once: true }}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        py: 0.6,
                        px: 1.5,
                        borderRadius: "8px",
                        bgcolor: isTodayRow
                          ? "rgba(139, 69, 19, 0.08)"
                          : "transparent",
                        border: isTodayRow
                          ? "1px solid rgba(139, 69, 19, 0.15)"
                          : "1px solid transparent",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                      >
                        <Typography
                          sx={{
                            fontSize: "0.85rem",
                            fontWeight: isTodayRow ? 700 : 600,
                            color: isTodayRow ? "#D9A756" : "#6A3A1E",
                            minWidth: 40,
                            letterSpacing: 0.5,
                          }}
                        >
                          {dayName}
                        </Typography>
                        {isTodayRow && currentStatus.isOpen && (
                          <Box
                            component="span"
                            sx={{
                              fontSize: "0.65rem",
                              fontWeight: 700,
                              color: "#228B22",
                              bgcolor: "rgba(34, 139, 34, 0.1)",
                              px: 0.8,
                              py: 0.2,
                              borderRadius: "4px",
                              textTransform: "uppercase",
                            }}
                          >
                            Today
                          </Box>
                        )}
                        {isTodayRow && !currentStatus.isOpen && (
                          <Box
                            component="span"
                            sx={{
                              fontSize: "0.65rem",
                              fontWeight: 700,
                              color: "#B45309",
                              bgcolor: "rgba(180, 83, 9, 0.1)",
                              px: 0.8,
                              py: 0.2,
                              borderRadius: "4px",
                              textTransform: "uppercase",
                            }}
                          >
                            Today
                          </Box>
                        )}
                      </Box>
                      <Typography
                        sx={{
                          fontSize: "0.85rem",
                          fontWeight: isTodayRow ? 600 : 500,
                          color: isClosed
                            ? "#B45309"
                            : isTodayRow
                            ? "#3C1F0E"
                            : "#6A3A1E",
                          letterSpacing: 0.3,
                        }}
                      >
                        {timeStr}
                      </Typography>
                    </Box>
                  );
                })
              ) : (
                // Fallback hours
                <>
                  {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map(
                    (day) => (
                      <Box
                        key={day}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          py: 0.5,
                          px: 1.5,
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: "0.85rem",
                            fontWeight: 600,
                            color: "#6A3A1E",
                          }}
                        >
                          {day}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "0.85rem",
                            fontWeight: 500,
                            color: "#6A3A1E",
                          }}
                        >
                          11 A.M. - 11 P.M.
                        </Typography>
                      </Box>
                    )
                  )}
                </>
              )}
            </Box>
          </Box>

          {/* Quick Links Section */}
          <Box
            component={motion.div}
            variants={itemVariants}
            sx={{ textAlign: { xs: "center", md: "right" } }}
          >
            <Typography
              sx={{
                fontFamily: '"Cormorant Garamond", serif',
                fontWeight: 700,
                fontSize: "1.1rem",
                color: "#3C1F0E",
                mb: 2,
                letterSpacing: 0.5,
              }}
            >
              QUICK LINKS
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1.2,
                alignItems: { xs: "center", md: "flex-end" },
              }}
            >
              {quickLinks.map((link, index) => (
                <MUILink
                  key={link.to}
                  component={motion.a}
                  {...({
                    initial: { x: 10, opacity: 0 },
                    whileInView: { x: 0, opacity: 1 },
                    transition: { delay: index * 0.08 },
                    whileHover: { x: -5 },
                    viewport: { once: true },
                  } as Record<string, unknown>)}
                  href={link.to}
                  onClick={(e: React.MouseEvent) => {
                    e.preventDefault();
                    window.location.href = link.to;
                  }}
                  underline="none"
                  sx={{
                    color: "#6A3A1E",
                    fontSize: "0.9rem",
                    fontWeight: 500,
                    transition: "all 0.2s ease",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 0.5,
                    "&:hover": {
                      color: "#D9A756",
                    },
                    "&::before": {
                      content: '""',
                      width: 0,
                      height: "2px",
                      bgcolor: "#D9A756",
                      transition: "width 0.2s ease",
                      display: { xs: "none", md: "block" },
                    },
                    "&:hover::before": {
                      width: 15,
                      mr: 0.5,
                    },
                  }}
                >
                  {link.label}
                </MUILink>
              ))}
            </Box>
          </Box>
        </Box>

        {/* Decorative Divider */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            my: 3,
          }}
        >
          <Box
            sx={{ flex: 1, height: "1px", bgcolor: "rgba(139, 69, 19, 0.2)" }}
          />
          <Box
            component="img"
            src="/brooklinpub-logo.png"
            alt=""
            sx={{ width: 30, height: "auto", opacity: 0.3 }}
          />
          <Box
            sx={{ flex: 1, height: "1px", bgcolor: "rgba(139, 69, 19, 0.2)" }}
          />
        </Box>

        {/* Copyright */}
        <Box
          component={motion.div}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 1.5,
            textAlign: "center",
          }}
        >
          <Typography
            variant="caption"
            sx={{ color: "#8B7355", fontWeight: 500, fontSize: "0.75rem" }}
          >
            © {new Date().getFullYear()} Brooklin Pub & Grill. All rights
            reserved.
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: "#A69583", fontSize: "0.75rem" }}
          >
            Designed by{" "}
            <MUILink
              href="#"
              underline="hover"
              sx={{ color: "#D9A756", fontWeight: 600 }}
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
