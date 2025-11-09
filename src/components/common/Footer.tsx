import { Box, Typography, Link as MUILink, IconButton, Divider } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import { Link as RouterLink } from "react-router-dom";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "var(--cream-light, #F3E3CC)",
        color: "#3e2723",
        pt: 8,
        px: { xs: 2.5, sm: 5 },
        pb: 5,
        position: "relative",
        mt: 8,
        backgroundImage: "radial-gradient(circle at 15% 25%, rgba(217,167,86,0.25), transparent 60%)",
        "&:before": {
          content: '""',
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to bottom, rgba(255,255,255,0.5), rgba(255,255,255,0) 35%)",
          pointerEvents: "none",
        },
        borderTop: "4px solid #8B4513",
      }}
    >
      {/* Top CTA */}
      <Box sx={{ textAlign: "center", mb: 6 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            fontFamily: '"Playfair Display", serif',
            color: "#6A3A1E",
            letterSpacing: 1,
          }}
        >
          Ready to Dine?
        </Typography>
        <Typography sx={{ mt: 1.2, fontSize: { xs: "0.95rem", sm: "1.05rem" }, opacity: 0.9, maxWidth: 640, mx: "auto", lineHeight: 1.5 }}>
          Visit us at 15 Baldwin St, Whitby or order online for pickup & delivery. Great food, great atmosphere, unforgettable nights.
        </Typography>
        <Box
          component={RouterLink}
          to="/menu"
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 1,
            background: "linear-gradient(135deg, #8B4513 0%, #a5642f 60%, #d4af37 100%)",
            color: "#fff",
            textDecoration: "none",
            px: 3.5,
            py: 1.1,
            borderRadius: 40,
            mt: 3,
            fontWeight: 700,
            fontSize: "0.95rem",
            boxShadow: "0 6px 18px -4px rgba(139,69,19,0.45)",
            position: "relative",
            overflow: "hidden",
            "&:before": {
              content: '""',
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(120deg, rgba(255,255,255,0.6), rgba(255,255,255,0) 40%)",
              opacity: 0,
              transition: "opacity .4s",
            },
            "&:hover:before": { opacity: 0.3 },
            "&:hover": { transform: "translateY(-2px)" },
            transition: "transform .35s cubic-bezier(.4,0,.2,1)",
          }}
        >
          Order Online
        </Box>
      </Box>

      {/* Bottom Section */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1.4fr 1fr 1fr 1fr" },
          gap: { xs: 4, md: 5 },
          position: "relative",
        }}
      >
        {/* Brand */}
        <Box>
          <Box component="img" src="/brooklinpub-logo.png" alt="Brooklin Logo" sx={{ width: 82, mb: 1.5, filter: "drop-shadow(0 4px 8px rgba(106,58,30,0.4))" }} />
          <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: .5 }}>
            Brooklin Pub & Grill
          </Typography>
          <Typography sx={{ mt: 1.2, fontSize: "0.92rem", lineHeight: 1.55, opacity: 0.85, maxWidth: 320 }}>
            Experience the best pub dining in Whitby. Great food, unforgettable atmosphere, and vibrant community vibes.
          </Typography>
          <Typography sx={{ mt: 1.2, fontSize: "0.85rem", fontStyle: "italic", opacity: 0.75 }}>
            Happy hour • Craft bites • Live music
          </Typography>
          <Box sx={{ mt: 1 }}>
            <IconButton sx={{ color: "#8B4513", '&:hover': { color: '#b86b35' } }} aria-label="Facebook"><FacebookIcon /></IconButton>
            <IconButton sx={{ color: "#8B4513", '&:hover': { color: '#b86b35' } }} aria-label="Instagram"><InstagramIcon /></IconButton>
            <IconButton sx={{ color: "#8B4513", '&:hover': { color: '#b86b35' } }} aria-label="Live Music"><MusicNoteIcon /></IconButton>
          </Box>
        </Box>

        {/* Contact Info */}
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.2 }}>
            Contact
          </Typography>
          <Typography sx={{ fontSize: "0.9rem", opacity: 0.9 }}>
            15 Baldwin St<br/>Whitby, ON L1M 1A2
          </Typography>
          <Typography sx={{ fontSize: "0.9rem", mt: 1 }}>+1 905-425-3055</Typography>
          <Typography sx={{ fontSize: "0.9rem", mt: 0.5 }}>brooklinpub@gmail.com</Typography>
        </Box>

        {/* Opening Hours */}
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.2 }}>
            Hours
          </Typography>
          <Typography sx={{ fontSize: "0.88rem", opacity: 0.9 }}>
            Sun – Thu: 11 AM – 11 PM<br/>Fri – Sat: 11 AM – 1 AM
          </Typography>
        </Box>

        {/* Quick Links */}
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.2 }}>
            Navigate
          </Typography>
          <Box sx={{ mt: 0.5, display: "grid", gap: 0.4 }}>
            {[
              { label: "Home", to: "/" },
              { label: "About Us", to: "/about" },
              { label: "Menu", to: "/menu" },
              { label: "Specials", to: "/special/today" },
              { label: "Contact", to: "/contactus" },
            ].map((l) => (
              <MUILink
                key={l.to}
                component={RouterLink}
                to={l.to}
                underline="none"
                color="inherit"
                sx={{
                  fontSize: "0.88rem",
                  position: "relative",
                  opacity: 0.85,
                  transition: "color .3s, opacity .3s",
                  "&:hover": { color: "#8B4513", opacity: 1 },
                }}
              >
                {l.label}
              </MUILink>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Footer Bottom */}
      <Box
        sx={{
          textAlign: "center",
          mt: 6,
          pt: 3,
          fontSize: "0.75rem",
          letterSpacing: .5,
          color: "rgba(62,39,35,0.7)",
        }}
      >
        <Divider sx={{ mb: 2, background: "rgba(62,39,35,0.25)" }} />
        © 2025 BROOKLINPUB. ALL RIGHTS RESERVED<br />
        Website design by{" "}
        <MUILink href="#" underline="hover" sx={{ color: "#8B4513", fontWeight: 600 }}>
          AK Vision Systems
        </MUILink>
      </Box>
    </Box>
  );
};

export default Footer;
