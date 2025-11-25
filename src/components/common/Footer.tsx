import { Box, Typography, Link as MUILink, Container, Divider } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useApiWithCache } from "../../hooks/useApi";
import { openingHoursService } from "../../services/opening-hours.service";
import type { OpeningHours } from "../../types/api.types";

const Footer = () => {
  const quickLinks = [
    { label: "Home", to: "/" },
    { label: "About", to: "/about" },
    { label: "Menu", to: "/menu" },
    { label: "Specials", to: "/special/today" },
    { label: "Contact", to: "/contactus" },
  ];

  // Fetch opening hours from backend
  const { data: openingHoursData } = useApiWithCache<OpeningHours[]>(
    "opening-hours",
    () => openingHoursService.getAllOpeningHours()
  );

  // Format opening hours for display
  const formatOpeningHours = (hours: OpeningHours[] | null) => {
    if (!hours || hours.length === 0) {
      return ["Sun – Thu: 11 AM – 11 PM", "Fri – Sat: 11 AM – 1 AM"];
    }

    // Group by similar times
    const daysMap = new Map<string, string[]>();
    hours.forEach((h) => {
      const timeStr = h.isClosed ? "Closed" : `${h.openTime} – ${h.closeTime}`;
      const existing = daysMap.get(timeStr) || [];
      existing.push(h.dayOfWeek.slice(0, 3)); // Mon -> Mon, Tuesday -> Tue
      daysMap.set(timeStr, existing);
    });

    // Format grouped hours
    const formatted: string[] = [];
    daysMap.forEach((days, time) => {
      if (days.length > 1) {
        formatted.push(`${days[0]} – ${days[days.length - 1]}: ${time}`);
      } else {
        formatted.push(`${days[0]}: ${time}`);
      }
    });

    return formatted;
  };

  const displayHours = formatOpeningHours(openingHoursData);

  return (
    <Box component="footer" sx={{ bgcolor: "#fff", color: "#2c2c2c", py: 8, borderTop: "1px solid #f0f0f0", mt: "auto" }}>
      <Container maxWidth="lg">
        <Box sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "center", md: "flex-start" },
            justifyContent: "space-between",
            textAlign: { xs: "center", md: "left" },
            gap: 4
        }}>
            {/* Left: Contact */}
            <Box sx={{ flex: 1, textAlign: { xs: "center", md: "right" }, order: { xs: 2, md: 1 } }}>
                 <Typography variant="overline" sx={{ fontWeight: 700, letterSpacing: 1, color: "#b87333" }}>Visit Us</Typography>
                 <Typography variant="body2" sx={{ mt: 2, lineHeight: 1.8 }}>
                    15 Baldwin St<br/>Whitby, ON L1M 1A2
                 </Typography>
                 <Typography variant="body2" sx={{ mt: 1 }}>
                    <MUILink href="tel:+19054253055" color="inherit" underline="none" sx={{ '&:hover': { color: "#b87333" } }}>+1 905-425-3055</MUILink>
                 </Typography>
                 <Typography variant="body2">
                    <MUILink href="mailto:brooklinpub@gmail.com" color="inherit" underline="none" sx={{ '&:hover': { color: "#b87333" } }}>brooklinpub@gmail.com</MUILink>
                 </Typography>
            </Box>

            {/* Center: Logo */}
            <Box sx={{ flex: 0.8, display: "flex", flexDirection: "column", alignItems: "center", order: { xs: 1, md: 2 } }}>
                <Box component="img" src="/brooklinpub-logo.png" alt="Brooklin Pub" sx={{ width: 100, height: "auto", mb: 2 }} />
                <Typography variant="h6" sx={{ fontFamily: '"Playfair Display", serif', fontWeight: 700, letterSpacing: 0.5 }}>
                    BROOKLIN PUB
                </Typography>
                <Typography variant="caption" sx={{ color: "#888", letterSpacing: 2, textTransform: "uppercase", mt: 0.5 }}>
                    Est. 2024
                </Typography>
            </Box>

            {/* Right: Hours */}
            <Box sx={{ flex: 1, textAlign: { xs: "center", md: "left" }, order: { xs: 3, md: 3 } }}>
                <Typography variant="overline" sx={{ fontWeight: 700, letterSpacing: 1, color: "#b87333" }}>Opening Hours</Typography>
                <Box sx={{ mt: 2 }}>
                    {displayHours.map((line, i) => (
                        <Typography key={i} variant="body2" sx={{ lineHeight: 1.8 }}>{line}</Typography>
                    ))}
                </Box>
            </Box>
        </Box>

        {/* Navigation Links - Horizontal */}
        <Box sx={{ mt: 8, mb: 4, display: "flex", justifyContent: "center", gap: { xs: 3, md: 6 }, flexWrap: "wrap" }}>
            {quickLinks.map(link => (
                <MUILink
                    key={link.to}
                    component={RouterLink}
                    to={link.to}
                    color="text.primary"
                    underline="none"
                    sx={{
                        fontSize: "0.9rem",
                        fontWeight: 500,
                        textTransform: "uppercase",
                        letterSpacing: 1,
                        transition: "color 0.2s",
                        "&:hover": { color: "#b87333" }
                    }}
                >
                    {link.label}
                </MUILink>
            ))}
        </Box>

        <Divider sx={{ opacity: 0.5 }} />

        {/* Copyright */}
        <Box sx={{ mt: 4, textAlign: "center" }}>
             <Typography variant="caption" color="text.secondary">
                © {new Date().getFullYear()} Brooklin Pub & Grill. All rights reserved.
             </Typography>
             <Typography variant="caption" display="block" color="text.disabled" sx={{ mt: 0.5 }}>
                Designed by <MUILink href="#" color="inherit" underline="hover">AK Vision Systems</MUILink>
             </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
