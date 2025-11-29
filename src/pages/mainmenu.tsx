import { useState, useEffect } from "react";
import Nav from "../components/common/Nav";
import MainMenu from "../components/menu/MainMenu";
import Footer from "../components/common/Footer";
import InitialPage from "../components/home/InitialPage";
import Callicon from "../components/icons/CalendarIcon";
import SocialMedia from "../components/common/SocialFloatingMenu";
import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";

const Special = () => {
  const [isMobile, setIsMobile] = useState<boolean>(
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div>
      <Nav />
      <Callicon />
      <SocialMedia />
      <InitialPage
        line1="Welcome to Brooklin Pub"
        line2="Experience the finest dining and drinks in a cozy atmosphere."
      />

      {/* Menu Header Section with Light Brown Transparent Background */}
      <Box
        sx={{
          background:
            "linear-gradient(180deg, rgba(139, 69, 19, 0.85) 0%, rgba(92, 47, 13, 0.9) 100%)",
          position: "relative",
          overflow: "hidden",
          py: { xs: 4, md: 6 },
        }}
      >
        {/* Decorative overlay pattern */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.05) 0%, transparent 50%),
                              radial-gradient(circle at 80% 50%, rgba(255,255,255,0.03) 0%, transparent 50%)`,
            pointerEvents: "none",
          }}
        />

        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Decorative line above */}
          <Box
            component={motion.div}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            sx={{
              width: 80,
              height: 2,
              backgroundColor: "rgba(255, 215, 0, 0.6)",
              mb: 2,
            }}
          />

          <Typography
            component={motion.h2}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            sx={{
              margin: 0,
              color: "#FAF7F2",
              fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4rem" },
              letterSpacing: { xs: 2, md: 4 },
              textTransform: "uppercase",
              fontWeight: 700,
              fontFamily: "'Playfair Display', 'Georgia', serif",
              textShadow: "2px 2px 8px rgba(0,0,0,0.3)",
              lineHeight: 1.2,
            }}
          >
            Our Menu
          </Typography>

          <Typography
            component={motion.p}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            sx={{
              mt: 1.5,
              color: "rgba(250, 247, 242, 0.8)",
              fontSize: { xs: "0.95rem", md: "1.1rem" },
              fontFamily: "'Lato', 'Roboto', sans-serif",
              fontWeight: 400,
              letterSpacing: 1,
              maxWidth: 500,
              px: 2,
            }}
          >
            Fresh ingredients, timeless recipes, unforgettable flavors
          </Typography>

          {/* Decorative line below */}
          <Box
            component={motion.div}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            sx={{
              width: 120,
              height: 2,
              backgroundColor: "rgba(255, 215, 0, 0.6)",
              mt: 2.5,
            }}
          />
        </Box>
      </Box>

      <MainMenu />
      <div
        style={{
          height: isMobile ? 180 : 50,
          backgroundColor: "var(--wine-red)",
        }}
      ></div>
      <Footer />
    </div>
  );
};

export default Special;
