import Nav from "../components/common/Nav";
import MainMenu from "../components/menu/MainMenu";
import Footer from "../components/common/Footer";
import Callicon from "../components/icons/CalendarIcon";
import SocialMedia from "../components/common/SocialFloatingMenu";
import HeroSection from "../components/common/HeroSection";
import AnimatedBackground from "../components/common/AnimatedBackground";
import { MenuSEO } from "../config/seo.presets";
import { useLocation } from "react-router-dom";
import { useMemo } from "react";
import { useApiWithCache } from "../hooks/useApi";
import { menuService } from "../services/menu.service";
import type { PrimaryCategory } from "../types/api.types";
import { Box } from "@mui/material";

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
    const category = primaryCategories.find(
      (pc) => pc.id === selectedCategoryId
    );
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
    <Box
      sx={{
        minHeight: "100vh",
        background: "transparent",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <AnimatedBackground variant="default" />
      <MenuSEO />
      <Nav />
      <Callicon />
      <SocialMedia />

      {/* Hero Section - using reusable component */}
      <HeroSection
        id="menu-hero"
        title={categoryName}
        subtitle={subtitle}
        overlineText="✦ EXPLORE OUR OFFERINGS ✦"
        variant="light"
      />

      <MainMenu />
      <Footer />
    </Box>
  );
};

export default MainMenuPage;
