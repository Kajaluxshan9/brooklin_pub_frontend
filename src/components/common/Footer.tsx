import {
  Box,
  Typography,
  Link as MUILink,
  IconButton,
  Divider,
} from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import { Link as RouterLink } from "react-router-dom";
import { keyframes } from "@mui/system";

const Footer = () => {
  const socialIcons = [FacebookIcon, InstagramIcon, MusicNoteIcon];
  const quickLinks = [
    { label: "Home", to: "/" },
    { label: "About Us", to: "/about" },
    { label: "Menu", to: "/menu" },
    { label: "Specials", to: "/special/today" },
    { label: "Contact", to: "/contactus" },
  ];

  // Wave animation
  const waveAnimation = keyframes`
    0% { transform: translateX(0); }
    50% { transform: translateX(-25px); }
    100% { transform: translateX(0); }
  `;

  return (
    <Box
      component="footer"
      sx={{
        position: "relative",
        overflow: "hidden",
        bgcolor: "rgba(255,250,245,0.9)",
        backdropFilter: "blur(8px)",
        color: "#2c1810",
        px: { xs: 3, sm: 6, md: 8 },
        pt: { xs: 6, sm: 8, md: 10 },
        pb: { xs: 4, sm: 5 },
        mt: 8,
        backgroundImage:
          "linear-gradient(180deg, rgba(255,247,235,0.9), rgba(243,227,204,0.7))",
      }}
    >
      {/* --- Animated Top Wave --- */}
      <Box
        component="svg"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "200%",
          height: { xs: 80, sm: 120 },
          zIndex: 1,
          animation: `${waveAnimation} 8s ease-in-out infinite`,
          transform: "translateY(-99%)", // makes the wave topmost (no straight line)
        }}
      >
        <path
          fill="#fffaf0"
          fillOpacity="1"
          d="M0,192L80,170.7C160,149,320,107,480,106.7C640,107,800,149,960,160C1120,171,1280,149,1360,138.7L1440,128L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"
        />
      </Box>

      {/* --- Top CTA --- */}
      <Box sx={{ textAlign: "center", mb: { xs: 6, md: 8 }, position: "relative", zIndex: 2 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            fontFamily: '"Playfair Display", serif',
            color: "#5a321a",
            letterSpacing: 0.5,
            mb: 1,
            fontSize: { xs: "1.8rem", sm: "2.2rem", md: "2.5rem" },
          }}
        >
          Ready to Dine in Style?
        </Typography>
        <Typography
          sx={{
            maxWidth: 580,
            mx: "auto",
            fontSize: { xs: "0.9rem", sm: "1rem" },
            lineHeight: 1.6,
            opacity: 0.85,
          }}
        >
          Visit us at <strong>15 Baldwin St, Whitby</strong> or order online for
          pickup & delivery. Enjoy the perfect mix of great taste and warm
          atmosphere.
        </Typography>

        <Box
          component={RouterLink}
          to="/menu"
          sx={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            mt: 3,
            px: 4,
            py: 1.2,
            borderRadius: "50px",
            fontWeight: 700,
            fontSize: { xs: "0.9rem", sm: "1rem" },
            color: "#fff",
            background:
              "linear-gradient(135deg, #b87333 0%, #c48a3a 45%, #ffd700 100%)",
            textDecoration: "none",
            boxShadow: "0 5px 15px rgba(184,115,51,0.35)",
            transition: "all 0.35s ease",
            "&:hover": {
              transform: "translateY(-3px)",
              boxShadow: "0 10px 25px rgba(184,115,51,0.45)",
            },
          }}
        >
          Explore Menu
        </Box>
      </Box>

      {/* --- Bottom Grid Section --- */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "1.5fr 1fr 1fr 1fr",
          },
          gap: { xs: 4, sm: 5, md: 6 },
          textAlign: { xs: "center", sm: "left" },
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* --- Brand --- */}
        <Box>
          <Box
            component="img"
            src="/brooklinpub-logo.png"
            alt="Brooklin Logo"
            sx={{
              width: 75,
              mb: 2,
              mx: { xs: "auto", sm: 0 },
              filter: "drop-shadow(0 4px 8px rgba(106,58,30,0.3))",
            }}
          />
          <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
            Brooklin Pub & Grill
          </Typography>
          <Typography
            sx={{
              fontSize: "0.9rem",
              lineHeight: 1.6,
              opacity: 0.85,
              maxWidth: 300,
              mx: { xs: "auto", sm: 0 },
            }}
          >
            Great food. Vibrant vibes. Live music. Experience the best of Whitby
            nightlife.
          </Typography>

          <Box sx={{ mt: 1.5 }}>
            {socialIcons.map((Icon, i) => (
              <IconButton
                key={i}
                sx={{
                  color: "#8B4513",
                  "&:hover": {
                    color: "#c48a3a",
                    transform: "scale(1.15)",
                  },
                  transition: "all 0.25s ease",
                }}
              >
                <Icon />
              </IconButton>
            ))}
          </Box>
        </Box>

        {/* --- Contact Info --- */}
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.2 }}>
            Contact
          </Typography>
          <Typography sx={{ fontSize: "0.9rem", opacity: 0.9 }}>
            15 Baldwin St<br />
            Whitby, ON L1M 1A2
          </Typography>
          <Typography sx={{ fontSize: "0.9rem", mt: 1 }}>
            +1 905-425-3055
          </Typography>
          <Typography sx={{ fontSize: "0.9rem", mt: 0.5 }}>
            brooklinpub@gmail.com
          </Typography>
        </Box>

        {/* --- Opening Hours --- */}
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.2 }}>
            Hours
          </Typography>
          <Typography sx={{ fontSize: "0.9rem", opacity: 0.9 }}>
            Sun – Thu: 11 AM – 11 PM
            <br />
            Fri – Sat: 11 AM – 1 AM
          </Typography>
        </Box>

        {/* --- Quick Links --- */}
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.2 }}>
            Quick Links
          </Typography>
          <Box sx={{ display: "grid", gap: 0.5 }}>
            {quickLinks.map((l) => (
              <MUILink
                key={l.to}
                component={RouterLink}
                to={l.to}
                underline="none"
                color="inherit"
                sx={{
                  fontSize: "0.9rem",
                  opacity: 0.8,
                  position: "relative",
                  transition: "color 0.3s, opacity 0.3s",
                  "&:hover": {
                    color: "#b87333",
                    opacity: 1,
                  },
                }}
              >
                {l.label}
              </MUILink>
            ))}
          </Box>
        </Box>
      </Box>

      {/* --- Footer Bottom --- */}
      <Box
        sx={{
          textAlign: "center",
          mt: { xs: 5, sm: 7 },
          pt: 3,
          fontSize: "0.8rem",
          color: "rgba(44,24,16,0.7)",
          position: "relative",
          zIndex: 2,
        }}
      >
        <Divider sx={{ mb: 2, background: "rgba(44,24,16,0.2)" }} />
        © {new Date().getFullYear()} BROOKLINPUB — All Rights Reserved
        <br />
        <MUILink
          href="#"
          underline="hover"
          sx={{
            color: "#b87333",
            fontWeight: 600,
            "&:hover": { color: "#d19c46" },
          }}
        >
          AK Vision Systems
        </MUILink>
      </Box>
    </Box>
  );
};

export default Footer;
