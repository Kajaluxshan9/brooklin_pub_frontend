import { Box, Typography, IconButton, Container } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import LocalBarIcon from "@mui/icons-material/LocalBar";
import EventIcon from "@mui/icons-material/Event";
import { Link as RouterLink } from "react-router-dom";
import { motion } from "framer-motion";

const Footer = () => {
  const socialLinks = [
    { Icon: FacebookIcon, url: "https://facebook.com", label: "Facebook" },
    { Icon: InstagramIcon, url: "https://instagram.com", label: "Instagram" },
    { Icon: MusicNoteIcon, url: "#", label: "Music" },
  ];

  const menuLinks = [
    { label: "Main Menu", to: "/menu/main-menu", icon: RestaurantMenuIcon },
    { label: "Drinks", to: "/menu/drink-menu", icon: LocalBarIcon },
    { label: "Daily Specials", to: "/special/daily", icon: EventIcon },
  ];

  return (
    <Box
      component="footer"
      sx={{
        position: "relative",
        bgcolor: "#3C1F0E",
        color: "#F3E3CC",
        overflow: "hidden",
        mt: "auto",
      }}
    >
      {/* Decorative Top Border */}
      <Box
        sx={{
          height: 6,
          background:
            "linear-gradient(90deg, #D9A756 0%, #F3E3CC 50%, #D9A756 100%)",
        }}
      />

      {/* Decorative Pattern Overlay */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.03,
          backgroundImage: `
            repeating-linear-gradient(
              45deg,
              transparent,
              transparent 35px,
              rgba(217,167,86,0.4) 35px,
              rgba(217,167,86,0.4) 70px
            )
          `,
        }}
      />

      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
        {/* Main Footer Content */}
        <Box
          sx={{
            py: { xs: 6, md: 8 },
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "2fr 1.5fr 1.5fr 1.5fr",
            },
            gap: { xs: 5, md: 6 },
          }}
        >
          {/* Brand Section */}
          <Box>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  mb: 3,
                }}
              >
                <Box
                  component="img"
                  src="/brooklinpub-logo.png"
                  alt="Brooklin Pub Logo"
                  sx={{
                    width: { xs: 60, md: 70 },
                    height: { xs: 60, md: 70 },
                    filter: "drop-shadow(0 4px 12px rgba(217,167,86,0.4))",
                  }}
                />
                <Typography
                  variant="h5"
                  sx={{
                    fontFamily: '"Playfair Display", serif',
                    fontWeight: 800,
                    color: "#D9A756",
                  }}
                >
                  Brooklin Pub
                </Typography>
              </Box>

              <Typography
                sx={{
                  fontSize: "0.95rem",
                  lineHeight: 1.8,
                  mb: 3,
                  maxWidth: 350,
                  color: "#F3E3CC",
                  opacity: 0.9,
                }}
              >
                Where exceptional food meets unforgettable atmosphere. Join us
                for craft drinks, live music, and the finest pub dining in
                Whitby.
              </Typography>

              {/* Social Icons */}
              <Box sx={{ display: "flex", gap: 1.5 }}>
                {socialLinks.map(({ Icon, url, label }) => (
                  <IconButton
                    key={label}
                    component="a"
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      bgcolor: "rgba(217,167,86,0.15)",
                      color: "#D9A756",
                      border: "2px solid rgba(217,167,86,0.3)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        bgcolor: "#D9A756",
                        color: "#3C1F0E",
                        transform: "translateY(-3px)",
                        boxShadow: "0 6px 20px rgba(217,167,86,0.4)",
                      },
                    }}
                  >
                    <Icon />
                  </IconButton>
                ))}
              </Box>
            </motion.div>
          </Box>

          {/* Quick Links */}
          <Box>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontFamily: '"Playfair Display", serif',
                  fontWeight: 700,
                  color: "#D9A756",
                  mb: 3,
                }}
              >
                Explore
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {menuLinks.map(({ label, to, icon: Icon }) => (
                  <Box
                    key={label}
                    component={RouterLink}
                    to={to}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      color: "#F3E3CC",
                      textDecoration: "none",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        color: "#D9A756",
                        transform: "translateX(5px)",
                      },
                    }}
                  >
                    <Icon sx={{ fontSize: 20 }} />
                    <Typography sx={{ fontSize: "0.95rem" }}>
                      {label}
                    </Typography>
                  </Box>
                ))}

                <Box
                  component={RouterLink}
                  to="/about"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    color: "#F3E3CC",
                    textDecoration: "none",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      color: "#D9A756",
                      transform: "translateX(5px)",
                    },
                  }}
                >
                  <Typography sx={{ fontSize: "0.95rem" }}>About Us</Typography>
                </Box>

                <Box
                  component={RouterLink}
                  to="/contactus"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    color: "#F3E3CC",
                    textDecoration: "none",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      color: "#D9A756",
                      transform: "translateX(5px)",
                    },
                  }}
                >
                  <Typography sx={{ fontSize: "0.95rem" }}>Contact</Typography>
                </Box>
              </Box>
            </motion.div>
          </Box>

          {/* Contact Info */}
          <Box>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontFamily: '"Playfair Display", serif',
                  fontWeight: 700,
                  color: "#D9A756",
                  mb: 3,
                }}
              >
                Contact Us
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                  <LocationOnIcon
                    sx={{ color: "#D9A756", fontSize: 22, mt: 0.3 }}
                  />
                  <Box>
                    <Typography
                      sx={{ fontSize: "0.95rem", lineHeight: 1.7, mb: 0 }}
                    >
                      15 Baldwin Street
                      <br />
                      Whitby, ON L1M 1A2
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                  <PhoneIcon sx={{ color: "#D9A756", fontSize: 22 }} />
                  <Typography
                    component="a"
                    href="tel:+19056553513"
                    sx={{
                      fontSize: "0.95rem",
                      color: "#F3E3CC",
                      textDecoration: "none",
                      transition: "color 0.3s ease",
                      "&:hover": { color: "#D9A756" },
                    }}
                  >
                    (905) 655-3513
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                  <EmailIcon sx={{ color: "#D9A756", fontSize: 22 }} />
                  <Typography
                    component="a"
                    href="mailto:brooklinpub@gmail.com"
                    sx={{
                      fontSize: "0.95rem",
                      color: "#F3E3CC",
                      textDecoration: "none",
                      transition: "color 0.3s ease",
                      "&:hover": { color: "#D9A756" },
                    }}
                  >
                    brooklinpub@gmail.com
                  </Typography>
                </Box>
              </Box>
            </motion.div>
          </Box>

          {/* Hours */}
          <Box>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontFamily: '"Playfair Display", serif',
                  fontWeight: 700,
                  color: "#D9A756",
                  mb: 3,
                }}
              >
                Hours
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography sx={{ fontSize: "0.95rem", fontWeight: 600 }}>
                    Mon - Thu
                  </Typography>
                  <Typography sx={{ fontSize: "0.9rem", opacity: 0.85 }}>
                    11 AM - 11 PM
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography sx={{ fontSize: "0.95rem", fontWeight: 600 }}>
                    Fri - Sat
                  </Typography>
                  <Typography sx={{ fontSize: "0.9rem", opacity: 0.85 }}>
                    11 AM - 2 AM
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography sx={{ fontSize: "0.95rem", fontWeight: 600 }}>
                    Sunday
                  </Typography>
                  <Typography sx={{ fontSize: "0.9rem", opacity: 0.85 }}>
                    11 AM - 11 PM
                  </Typography>
                </Box>

                <Box
                  sx={{
                    mt: 2,
                    p: 2,
                    bgcolor: "rgba(217,167,86,0.1)",
                    borderRadius: 2,
                    border: "1px solid rgba(217,167,86,0.2)",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "0.85rem",
                      color: "#D9A756",
                      fontWeight: 600,
                    }}
                  >
                    🎵 Live Music Weekends!
                  </Typography>
                </Box>
              </Box>
            </motion.div>
          </Box>
        </Box>

        {/* Bottom Bar */}
        <Box
          sx={{
            borderTop: "1px solid rgba(217,167,86,0.2)",
            py: 3,
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography
            sx={{
              fontSize: "0.85rem",
              opacity: 0.7,
              textAlign: { xs: "center", sm: "left" },
            }}
          >
            © {new Date().getFullYear()} Brooklin Pub & Grill. All rights
            reserved.
          </Typography>

          <Typography
            sx={{
              fontSize: "0.85rem",
              opacity: 0.7,
              textAlign: { xs: "center", sm: "right" },
            }}
          >
            Crafted with love in Whitby
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
