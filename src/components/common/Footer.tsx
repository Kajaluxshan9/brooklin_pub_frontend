import { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  Link as MUILink,
  Container,
  IconButton,
  Divider,
} from "@mui/material";
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
import ArrowOutwardRoundedIcon from "@mui/icons-material/ArrowOutwardRounded";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { Link, useLocation } from "react-router-dom";
import NewsletterSection from "./NewsletterSection";

dayjs.extend(utc);
dayjs.extend(timezone);

const TIMEZONE = "America/Toronto";

const TikTokIcon = () => (
  <SvgIcon viewBox="0 0 24 24" sx={{ fontSize: 18 }}>
    <path
      d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"
      fill="currentColor"
    />
  </SvgIcon>
);

const Footer = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const quickLinks = [
    { label: "Home", to: "/" },
    { label: "Our Story", to: "/about" },
    { label: "Menu", to: "/menu" },
    { label: "Daily Specials", to: "/special/daily" },
    { label: "Events", to: "/events" },
    { label: "Contact Us", to: "/contactus" },
  ];

  const menuPdfUrl = "/menu/Main Menu - Brooklin Pub.pdf";
  const drinksPdfUrl = "/menu/Drinks Menu - Brooklin Pub.pdf";

  const { data: openingHoursData } = useApiWithCache<OpeningHours[]>(
    "opening-hours",
    () => openingHoursService.getAllOpeningHours()
  );

  const [, setTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 60000);
    return () => clearInterval(interval);
  }, []);

  const dayOrder = [
    "monday", "tuesday", "wednesday", "thursday",
    "friday", "saturday", "sunday",
  ];

  const dayAbbr: Record<string, string> = {
    monday: "Mon", tuesday: "Tue", wednesday: "Wed", thursday: "Thu",
    friday: "Fri", saturday: "Sat", sunday: "Sun",
  };

  const formatTime = (time: string) => {
    const m = time.match(/(\d{1,2}):?(\d{2})?\s*(am|pm|AM|PM)?/i);
    if (!m) return time.toUpperCase();
    let h = parseInt(m[1]);
    const min = m[2] || "00";
    let p = m[3]?.toUpperCase() || "";
    if (!p) {
      p = h >= 12 ? "PM" : "AM";
      if (h > 12) h -= 12;
      if (h === 0) h = 12;
    }
    return min === "00" ? `${h} ${p}` : `${h}:${min} ${p}`;
  };

  const sortedHours = openingHoursData
    ? [...openingHoursData].sort(
        (a, b) =>
          dayOrder.indexOf(a.dayOfWeek.toLowerCase()) -
          dayOrder.indexOf(b.dayOfWeek.toLowerCase())
      )
    : [];

  const isToday = (dow: string) =>
    dayjs().tz(TIMEZONE).format("dddd").toLowerCase() === dow.toLowerCase();

  const isOvernightHours = (h: OpeningHours): boolean => {
    if (h.isClosedNextDay) return true;
    if (!h.openTime || !h.closeTime) return false;
    return h.closeTime < h.openTime;
  };

  const currentStatus = useMemo(() => {
    if (!openingHoursData || openingHoursData.length === 0)
      return { isOpen: false, message: "" };

    const now = dayjs().tz(TIMEZONE);
    const currentDay = now.format("dddd").toLowerCase();
    const currentTime = now.format("HH:mm");

    const todayHours = openingHoursData.find(
      (oh) => oh.dayOfWeek.toLowerCase() === currentDay
    );

    if (
      todayHours?.isActive && todayHours?.isOpen &&
      todayHours?.openTime && todayHours?.closeTime
    ) {
      if (isOvernightHours(todayHours)) {
        if (currentTime >= todayHours.openTime || currentTime <= todayHours.closeTime)
          return { isOpen: true, message: `Open until ${dayjs(todayHours.closeTime, "HH:mm").format("h:mm A")}` };
      } else {
        if (currentTime >= todayHours.openTime && currentTime <= todayHours.closeTime)
          return { isOpen: true, message: `Open until ${dayjs(todayHours.closeTime, "HH:mm").format("h:mm A")}` };
      }
    }

    const prevDay = now.subtract(1, "day").format("dddd").toLowerCase();
    const prevHours = openingHoursData.find(
      (oh) => oh.dayOfWeek.toLowerCase() === prevDay
    );
    if (
      prevHours?.isActive && prevHours?.isOpen &&
      prevHours?.openTime && prevHours?.closeTime &&
      isOvernightHours(prevHours) && currentTime <= prevHours.closeTime
    ) {
      return { isOpen: true, message: `Open until ${dayjs(prevHours.closeTime, "HH:mm").format("h:mm A")}` };
    }

    return { isOpen: false, message: "Currently closed" };
  }, [openingHoursData]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.07, delayChildren: 0.15 },
    },
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" as const },
    },
  } as const;

  const socialLinks = [
    { href: "https://www.facebook.com/brooklinpub", label: "Facebook", icon: <FacebookIcon sx={{ fontSize: 18 }} /> },
    { href: "https://www.instagram.com/brooklinpubngrill/", label: "Instagram", icon: <InstagramIcon sx={{ fontSize: 18 }} /> },
    { href: "https://www.tiktok.com/@brooklinpubngrill", label: "TikTok", icon: <TikTokIcon /> },
  ];

  return (
    <Box
      component="footer"
      sx={{
        position: "relative",
        overflow: "hidden",
        mt: "auto",
      }}
    >
      {/* ══════ NEWSLETTER — only on home page ══════ */}
      {isHomePage && (
        <Box
          sx={{
            background: "linear-gradient(180deg, #FDF8F3 0%, #F0E4D3 100%)",
            py: { xs: 5, md: 7 },
            px: 2,
          }}
        >
          <Container maxWidth="md">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55 }}
            >
              <NewsletterSection />
            </motion.div>
          </Container>
        </Box>
      )}

      {/* ══════ MAIN FOOTER — Warm Dark Brown ══════ */}
      <Box
        sx={{
          background: "linear-gradient(180deg, #88502f 0%, #3d1f09 100%)",
          color: "#F5EFE6",
          position: "relative",
        }}
      >
        {/* Decorative top gold bar */}
        <Box
          sx={{
            height: 2,
            background:
              "linear-gradient(90deg, transparent 5%, #D9A756 30%, #C87941 70%, transparent 95%)",
            opacity: 0.5,
          }}
        />

        <Container
          maxWidth="lg"
          sx={{
            pt: { xs: 5, md: 6 },
            pb: { xs: 3, md: 4 },
            mb: { xs: "calc(80px + env(safe-area-inset-bottom, 0px))", md: 0 },
          }}
        >
          {/* ── Top section: Logo + Socials ── */}
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: { xs: "center", md: "flex-end" },
              justifyContent: "space-between",
              gap: { xs: 2.5, md: 0 },
              mb: { xs: 4, md: 5 },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
              }}
            >
              <Box
                component="img"
                src="/brooklinpub-logo.png"
                alt="Brooklin Pub"
                sx={{ width: 48, height: "auto" }}
              />
              <Box>
                <Typography
                  sx={{
                    fontFamily: '"Cormorant Garamond", Georgia, serif',
                    fontWeight: 700,
                    fontSize: "1.3rem",
                    color: "#F5EFE6",
                    letterSpacing: "0.08em",
                    lineHeight: 1.1,
                  }}
                >
                  BROOKLIN PUB
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.6rem",
                    color: "#D9A756",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    fontWeight: 600,
                    mt: 0.2,
                  }}
                >
                  Neighbourhood Pub &amp; Grill
                </Typography>
              </Box>
            </Box>

            {/* Social row */}
            <Box sx={{ display: "flex", gap: 0.8 }}>
              {socialLinks.map((s) => (
                <IconButton
                  key={s.label}
                  component="a"
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: "10px",
                    bgcolor: "rgba(217,167,86,0.1)",
                    color: "rgba(245,239,230,0.45)",
                    border: "1px solid rgba(217,167,86,0.15)",
                    transition: "all 0.25s ease",
                    "&:hover": {
                      bgcolor: "#D9A756",
                      color: "#fff",
                      borderColor: "#D9A756",
                      transform: "translateY(-2px)",
                      boxShadow: "0 4px 16px rgba(217,167,86,0.3)",
                    },
                  }}
                >
                  {s.icon}
                </IconButton>
              ))}
            </Box>
          </Box>

          <Divider sx={{ borderColor: "rgba(245,239,230,0.08)", mb: { xs: 4, md: 5 } }} />

          {/* ── 4-Column Grid ── */}
          <Box
            component={motion.div}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr 1fr",
                md: "1fr 1fr 1fr 1fr",
              },
              gap: { xs: 3.5, md: 5 },
            }}
          >
            {/* ── Explore ── */}
            <Box component={motion.div} variants={itemVariants}>
              <Typography
                sx={{
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  color: "#D9A756",
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  mb: 2,
                }}
              >
                Explore
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                {quickLinks.map((link) => (
                  <MUILink
                    key={link.to}
                    component={Link}
                    to={link.to}
                    underline="none"
                    sx={{
                      color: "rgba(245,239,230,0.5)",
                      fontSize: "0.84rem",
                      fontWeight: 500,
                      py: 0.35,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 0.5,
                      transition: "all 0.2s ease",
                      "&:hover": {
                        color: "#F5EFE6",
                        "& .link-arrow": { opacity: 1, transform: "translate(2px, -2px)" },
                      },
                    }}
                  >
                    {link.label}
                    <ArrowOutwardRoundedIcon
                      className="link-arrow"
                      sx={{
                        fontSize: 12,
                        opacity: 0,
                        transition: "all 0.2s ease",
                        color: "#D9A756",
                      }}
                    />
                  </MUILink>
                ))}
              </Box>
            </Box>

            {/* ── Hours ── */}
            <Box component={motion.div} variants={itemVariants}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.8,
                  mb: 2,
                }}
              >
                <AccessTimeIcon
                  sx={{ fontSize: 14, color: "#D9A756" }}
                />
                <Typography
                  sx={{
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    color: "#D9A756",
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                  }}
                >
                  Hours
                </Typography>
              </Box>

              {/* Status pill */}
              {openingHoursData && openingHoursData.length > 0 && (
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 0.6,
                    px: 1.2,
                    py: 0.35,
                    borderRadius: "6px",
                    bgcolor: currentStatus.isOpen
                      ? "rgba(34,197,94,0.12)"
                      : "rgba(239,68,68,0.12)",
                    mb: 1.2,
                  }}
                >
                  <Box
                    sx={{
                      width: 5,
                      height: 5,
                      borderRadius: "50%",
                      bgcolor: currentStatus.isOpen ? "#16A34A" : "#DC2626",
                      ...(currentStatus.isOpen && {
                        boxShadow: "0 0 6px rgba(34,197,94,0.5)",
                      }),
                    }}
                  />
                  <Typography
                    sx={{
                      fontSize: "0.68rem",
                      fontWeight: 700,
                      color: currentStatus.isOpen ? "#16A34A" : "#DC2626",
                      textTransform: "uppercase",
                      letterSpacing: "0.03em",
                    }}
                  >
                    {currentStatus.isOpen ? "Open" : "Closed"}
                  </Typography>
                </Box>
              )}

              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.15 }}>
                {sortedHours.length > 0 ? (
                  sortedHours.map((hours, i) => {
                    const today = isToday(hours.dayOfWeek);
                    const dayName =
                      dayAbbr[hours.dayOfWeek.toLowerCase()] ||
                      hours.dayOfWeek.slice(0, 3);
                    const closed =
                      !hours.isOpen || !hours.isActive ||
                      !hours.openTime || !hours.closeTime;
                    const timeStr = closed
                      ? "Closed"
                      : `${formatTime(hours.openTime!)} – ${formatTime(hours.closeTime!)}`;

                    return (
                      <Box
                        key={hours.id || i}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          py: 0.3,
                          px: today ? 0.8 : 0,
                          borderRadius: "4px",
                          bgcolor: today
                            ? "rgba(217,167,86,0.1)"
                            : "transparent",
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: "0.78rem",
                            fontWeight: today ? 700 : 400,
                            color: today
                              ? "#D9A756"
                              : "rgba(245,239,230,0.4)",
                            minWidth: 30,
                          }}
                        >
                          {dayName}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "0.78rem",
                            fontWeight: today ? 600 : 400,
                            color: closed
                              ? "rgba(220,38,38,0.7)"
                              : today
                              ? "#F5EFE6"
                              : "rgba(245,239,230,0.4)",
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
                      color: "rgba(245,239,230,0.3)",
                      fontSize: "0.8rem",
                    }}
                  >
                    Hours coming soon
                  </Typography>
                )}
              </Box>
            </Box>

            {/* ── Contact ── */}
            <Box component={motion.div} variants={itemVariants}>
              <Typography
                sx={{
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  color: "#D9A756",
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  mb: 2,
                }}
              >
                Contact
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.8 }}>
                <Box
                  component="a"
                  href="https://maps.google.com/?q=15+Baldwin+St,+Whitby,+ON+L1M+1A2"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 1,
                    textDecoration: "none",
                    transition: "all 0.2s ease",
                    "&:hover .c-text": { color: "#F5EFE6" },
                    "&:hover .c-icon": { color: "#D9A756" },
                  }}
                >
                  <LocationOnIcon
                    className="c-icon"
                    sx={{
                      fontSize: 16,
                      color: "rgba(245,239,230,0.3)",
                      mt: 0.15,
                      transition: "color 0.2s",
                    }}
                  />
                  <Box>
                    <Typography
                      className="c-text"
                      sx={{
                        color: "rgba(245,239,230,0.55)",
                        fontSize: "0.84rem",
                        fontWeight: 500,
                        transition: "color 0.2s",
                        lineHeight: 1.4,
                      }}
                    >
                      15 Baldwin St
                    </Typography>
                    <Typography
                      sx={{
                        color: "rgba(245,239,230,0.3)",
                        fontSize: "0.78rem",
                      }}
                    >
                      Whitby, ON L1M 1A2
                    </Typography>
                  </Box>
                </Box>

                <Box
                  component="a"
                  href="tel:+19054253055"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    textDecoration: "none",
                    "&:hover .c-text": { color: "#F5EFE6" },
                    "&:hover .c-icon": { color: "#D9A756" },
                  }}
                >
                  <PhoneIcon
                    className="c-icon"
                    sx={{
                      fontSize: 16,
                      color: "rgba(245,239,230,0.3)",
                      transition: "color 0.2s",
                    }}
                  />
                  <Typography
                    className="c-text"
                    sx={{
                      color: "rgba(245,239,230,0.55)",
                      fontSize: "0.84rem",
                      fontWeight: 500,
                      transition: "color 0.2s",
                    }}
                  >
                    (905) 425-3055
                  </Typography>
                </Box>

                <Box
                  component="a"
                  href="mailto:brooklinpub@gmail.com"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    textDecoration: "none",
                    "&:hover .c-text": { color: "#F5EFE6" },
                    "&:hover .c-icon": { color: "#D9A756" },
                  }}
                >
                  <EmailIcon
                    className="c-icon"
                    sx={{
                      fontSize: 16,
                      color: "rgba(245,239,230,0.3)",
                      transition: "color 0.2s",
                    }}
                  />
                  <Typography
                    className="c-text"
                    sx={{
                      color: "rgba(245,239,230,0.55)",
                      fontSize: "0.84rem",
                      fontWeight: 500,
                      transition: "color 0.2s",
                    }}
                  >
                    brooklinpub@gmail.com
                  </Typography>
                </Box>

                <Box
                  component="a"
                  href="mailto:brooklinpubevents@gmail.com"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    textDecoration: "none",
                    "&:hover .c-text": { color: "#F5EFE6" },
                    "&:hover .c-icon": { color: "#D9A756" },
                  }}
                >
                  <EmailIcon
                    className="c-icon"
                    sx={{
                      fontSize: 16,
                      color: "rgba(245,239,230,0.3)",
                      transition: "color 0.2s",
                    }}
                  />
                  <Box>
                    <Typography
                      className="c-text"
                      sx={{
                        color: "rgba(245,239,230,0.55)",
                        fontSize: "0.84rem",
                        fontWeight: 500,
                        transition: "color 0.2s",
                      }}
                    >
                      brooklinpubevents@gmail.com
                    </Typography>
                    <Typography
                      sx={{
                        color: "rgba(245,239,230,0.25)",
                        fontSize: "0.7rem",
                      }}
                    >
                      Events &amp; Bookings
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* ── Menus ── */}
            <Box component={motion.div} variants={itemVariants}>
              <Typography
                sx={{
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  color: "#D9A756",
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  mb: 2,
                }}
              >
                Our Menus
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {[
                  { url: menuPdfUrl, label: "Main Menu" },
                  { url: drinksPdfUrl, label: "Drinks Menu" },
                ].map((pdf) => (
                  <MUILink
                    key={pdf.label}
                    href={pdf.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    underline="none"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 1,
                      fontSize: "0.84rem",
                      fontWeight: 600,
                      color: "rgba(245,239,230,0.55)",
                      px: 1.5,
                      py: 1,
                      borderRadius: "10px",
                      bgcolor: "rgba(245,239,230,0.06)",
                      border: "1px solid rgba(245,239,230,0.08)",
                      transition: "all 0.25s ease",
                      "&:hover": {
                        bgcolor: "rgba(217,167,86,0.15)",
                        borderColor: "rgba(217,167,86,0.3)",
                        color: "#F5EFE6",
                        "& .dl-arrow": { opacity: 1, color: "#D9A756" },
                      },
                    }}
                  >
                    {pdf.label}
                    <ArrowOutwardRoundedIcon
                      className="dl-arrow"
                      sx={{
                        fontSize: 14,
                        opacity: 0.3,
                        transition: "all 0.2s",
                      }}
                    />
                  </MUILink>
                ))}
              </Box>

              <Typography
                sx={{
                  color: "rgba(245,239,230,0.25)",
                  fontSize: "0.78rem",
                  mt: 3,
                  lineHeight: 1.7,
                  maxWidth: 220,
                }}
              >
                Great food, cold beer, and the kind of atmosphere where
                everyone feels at home.
              </Typography>
            </Box>
          </Box>

          {/* ── Bottom bar ── */}
          <Divider
            sx={{
              mt: { xs: 4, md: 5 },
              mb: { xs: 2.5, md: 3 },
              borderColor: "rgba(245,239,230,0.08)",
            }}
          />

          <Box
            component={motion.div}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography
              sx={{
                color: "rgba(245,239,230,0.3)",
                fontSize: "0.72rem",
                letterSpacing: "0.02em",
              }}
            >
              &copy; {new Date().getFullYear()} Brooklin Pub &amp; Grill. All
              rights reserved.
            </Typography>
            <Typography
              sx={{
                color: "rgba(245,239,230,0.2)",
                fontSize: "0.68rem",
                fontWeight: 500,
              }}
            >
              Crafted by{" "}
              <MUILink
                href="https://www.akvisionsystems.com/"
                target="_blank"
                rel="noopener noreferrer"
                underline="hover"
                sx={{
                  color: "#D9A756",
                  fontWeight: 600,
                  "&:hover": { color: "#E8BD6A" },
                }}
              >
                AK Vision Systems
              </MUILink>
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Footer;
