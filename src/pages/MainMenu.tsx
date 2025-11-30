import Nav from "../components/common/Nav";
import MainMenu from "../components/menu/MainMenu";
import Footer from "../components/common/Footer";
import Callicon from "../components/icons/CalendarIcon";
import SocialMedia from "../components/common/SocialFloatingMenu";
import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";
import BgImage from "../assets/images/hero-bg.jpg";
import { useLocation } from "react-router-dom";
import { useMemo } from "react";
import { useApiWithCache } from "../hooks/useApi";
import { menuService } from "../services/menu.service";
import type { PrimaryCategory } from "../types/api.types";

const MainMenuPage = () => {
  const location = useLocation();

  // Fetch primary categories from backend
  const { data: primaryCategories } = useApiWithCache<PrimaryCategory[]>(
    "primary-categories",
    () => menuService.getPrimaryCategories()
  );

  // Get selected category from URL
  const selectedCategoryId = useMemo(() => {
    try {
      const params = new URLSearchParams(location.search);
      return params.get("category");
    } catch {
      return null;
    }
  }, [location.search]);

  // Find the selected category name
  const categoryName = useMemo(() => {
    if (!selectedCategoryId || !primaryCategories) {
      return "Our Menu";
    }
    const category = primaryCategories.find((pc) => pc.id === selectedCategoryId);
    return category ? category.name : "Our Menu";
  }, [selectedCategoryId, primaryCategories]);

  // Dynamic subtitle based on category
  const subtitle = useMemo(() => {
    if (selectedCategoryId && categoryName !== "Our Menu") {
      return `Explore our ${categoryName.toLowerCase()} selection`;
    }
    return "Fresh ingredients, timeless recipes, unforgettable flavors";
  }, [selectedCategoryId, categoryName]);

  return (
    <div>
      <Nav />
      <Callicon />
      <SocialMedia />

      {/* Hero Section - consistent with Landing Page */}
      <Box
        sx={{
          minHeight: { xs: "55vh", sm: "55vh", md: "60vh" },
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          px: { xs: 2, sm: 4 },
          pt: { xs: 10, sm: 6, md: 0 },
          backgroundImage: `url(${BgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "linear-gradient(180deg, rgba(60,31,14,0.7) 0%, rgba(106,58,30,0.6) 100%)",
          },
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
            backgroundImage: `radial-gradient(circle at 20% 50%, rgba(217,167,86,0.1) 0%, transparent 50%),
                              radial-gradient(circle at 80% 50%, rgba(217,167,86,0.08) 0%, transparent 50%)`,
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
              backgroundColor: "#D9A756",
              mb: 2,
            }}
          />

          <Typography
            component={motion.h1}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            key={categoryName} // Re-animate when category changes
            sx={{
              margin: 0,
              color: "#F3E3CC",
              fontSize: { xs: "2rem", sm: "3rem", md: "4rem" },
              letterSpacing: { xs: 1, sm: 2, md: 4 },
              textTransform: "uppercase",
              fontWeight: 700,
              fontFamily: "'Cormorant Garamond', 'Georgia', serif",
              textShadow: "2px 2px 12px rgba(0,0,0,0.4)",
              lineHeight: 1.2,
            }}
          >
            {categoryName}
          </Typography>

          <Typography
            component={motion.p}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            key={subtitle} // Re-animate when subtitle changes
            sx={{
              mt: { xs: 1.5, md: 2 },
              color: "rgba(243, 227, 204, 0.9)",
              fontSize: { xs: "0.9rem", sm: "1rem", md: "1.2rem" },
              fontFamily: "'Inter', sans-serif",
              fontWeight: 400,
              letterSpacing: { xs: 0.5, md: 1 },
              maxWidth: { xs: "90%", md: 600 },
              px: 2,
              textShadow: "1px 1px 4px rgba(0,0,0,0.3)",
            }}
          >
            {subtitle}
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
              backgroundColor: "#D9A756",
              mt: 3,
            }}
          />
        </Box>
      </Box>

      <MainMenu />
      {/* <div
        style={{
          height: isMobile ? 180 : 50,
          backgroundColor: "var(--wine-red)",
        }}
      ></div> */}
      <Footer />
    </div>
  );
};

export default MainMenuPage;
