import { Box, Typography, Link as MUILink, Container, IconButton } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useApiWithCache } from "../../hooks/useApi";
import { openingHoursService } from "../../services/opening-hours.service";
import type { OpeningHours } from "../../types/api.types";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const Footer = () => {
  const quickLinks = [
    { label: "Home", to: "/" },
    { label: "About", to: "/about" },
    { label: "Menu", to: "/menu" },
    { label: "Specials", to: "/special/daily" },
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

    const dayOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const dayAbbr: Record<string, string> = {
      monday: 'Mon', tuesday: 'Tue', wednesday: 'Wed', thursday: 'Thu',
      friday: 'Fri', saturday: 'Sat', sunday: 'Sun'
    };

    const sorted = [...hours].sort((a, b) =>
      dayOrder.indexOf(a.dayOfWeek.toLowerCase()) - dayOrder.indexOf(b.dayOfWeek.toLowerCase())
    );

    return sorted.map(h => {
      const day = dayAbbr[h.dayOfWeek.toLowerCase()] || h.dayOfWeek.slice(0, 3);
      return h.isClosed ? `${day}: Closed` : `${day}: ${h.openTime} – ${h.closeTime}`;
    });
  };

  const displayHours = formatOpeningHours(openingHoursData);

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "#1a1a1a",
        color: "#fff",
        pt: { xs: 6, md: 8 },
        pb: { xs: 4, md: 6 },
        mt: "auto"
      }}
    >
      <Container maxWidth="lg">
        {/* Main Footer Content */}
        <Box sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1.2fr 1fr 1fr 1.2fr" },
          gap: { xs: 4, md: 6 },
          mb: 6
        }}>
          {/* Brand Section */}
          <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
            <Box
              component="img"
              src="/brooklinpub-logo.png"
              alt="Brooklin Pub"
              sx={{
                width: 80,
                height: "auto",
                mb: 2,
                filter: "brightness(1.1)"
              }}
            />
            <Typography
              variant="h6"
              sx={{
                fontFamily: '"Playfair Display", serif',
                fontWeight: 700,
                letterSpacing: 1,
                mb: 1
              }}
            >
              BROOKLIN PUB
            </Typography>
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.8 }}>
              Your neighborhood pub & grill serving great food and drinks in a warm, welcoming atmosphere.
            </Typography>
          </Box>

          {/* Quick Links */}
          <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
            <Typography
              variant="overline"
              sx={{
                fontWeight: 700,
                letterSpacing: 2,
                color: "#b87333",
                display: "block",
                mb: 2
              }}
            >
              Quick Links
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {quickLinks.map(link => (
                <MUILink
                  key={link.to}
                  component={RouterLink}
                  to={link.to}
                  underline="none"
                  sx={{
                    color: "rgba(255,255,255,0.7)",
                    fontSize: "0.9rem",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      color: "#b87333",
                      pl: 0.5
                    }
                  }}
                >
                  {link.label}
                </MUILink>
              ))}
            </Box>
          </Box>

          {/* Opening Hours */}
          <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
            <Typography
              variant="overline"
              sx={{
                fontWeight: 700,
                letterSpacing: 2,
                color: "#b87333",
                display: "flex",
                alignItems: "center",
                justifyContent: { xs: "center", md: "flex-start" },
                gap: 1,
                mb: 2
              }}
            >
              <AccessTimeIcon sx={{ fontSize: 18 }} />
              Hours
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
              {displayHours.map((line, i) => (
                <Typography
                  key={i}
                  variant="body2"
                  sx={{
                    color: "rgba(255,255,255,0.7)",
                    fontSize: "0.85rem"
                  }}
                >
                  {line}
                </Typography>
              ))}
            </Box>
          </Box>

          {/* Contact Info */}
          <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
            <Typography
              variant="overline"
              sx={{
                fontWeight: 700,
                letterSpacing: 2,
                color: "#b87333",
                display: "block",
                mb: 2
              }}
            >
              Contact Us
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, justifyContent: { xs: "center", md: "flex-start" } }}>
                <IconButton
                  size="small"
                  sx={{
                    bgcolor: "rgba(184, 115, 51, 0.15)",
                    color: "#b87333",
                    "&:hover": { bgcolor: "rgba(184, 115, 51, 0.25)" }
                  }}
                >
                  <LocationOnIcon sx={{ fontSize: 18 }} />
                </IconButton>
                <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }}>
                  15 Baldwin St, Whitby, ON L1M 1A2
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, justifyContent: { xs: "center", md: "flex-start" } }}>
                <IconButton
                  size="small"
                  component="a"
                  href="tel:+19054253055"
                  sx={{
                    bgcolor: "rgba(184, 115, 51, 0.15)",
                    color: "#b87333",
                    "&:hover": { bgcolor: "rgba(184, 115, 51, 0.25)" }
                  }}
                >
                  <PhoneIcon sx={{ fontSize: 18 }} />
                </IconButton>
                <MUILink
                  href="tel:+19054253055"
                  underline="none"
                  sx={{
                    color: "rgba(255,255,255,0.7)",
                    "&:hover": { color: "#b87333" }
                  }}
                >
                  +1 905-425-3055
                </MUILink>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, justifyContent: { xs: "center", md: "flex-start" } }}>
                <IconButton
                  size="small"
                  component="a"
                  href="mailto:brooklinpub@gmail.com"
                  sx={{
                    bgcolor: "rgba(184, 115, 51, 0.15)",
                    color: "#b87333",
                    "&:hover": { bgcolor: "rgba(184, 115, 51, 0.25)" }
                  }}
                >
                  <EmailIcon sx={{ fontSize: 18 }} />
                </IconButton>
                <MUILink
                  href="mailto:brooklinpub@gmail.com"
                  underline="none"
                  sx={{
                    color: "rgba(255,255,255,0.7)",
                    "&:hover": { color: "#b87333" }
                  }}
                >
                  brooklinpub@gmail.com
                </MUILink>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Divider */}
        <Box sx={{
          height: 1,
          bgcolor: "rgba(255,255,255,0.1)",
          mb: 4
        }} />

        {/* Copyright */}
        <Box sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
          textAlign: "center"
        }}>
          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.5)" }}>
            © {new Date().getFullYear()} Brooklin Pub & Grill. All rights reserved.
          </Typography>
          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.4)" }}>
            Designed by{" "}
            <MUILink
              href="#"
              underline="hover"
              sx={{ color: "#b87333" }}
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
