import { useParams } from "react-router-dom";
import Nav from "../components/common/Nav";
import SpecialDisplay from "../components/special/SpecialDisplay";
import Footer from "../components/common/Footer";
import Callicon from "../components/icons/CalendarIcon";
import SocialMedia from "../components/common/SocialFloatingMenu";
import HeroSection from "../components/common/HeroSection";
import AnimatedBackground from "../components/common/AnimatedBackground";
import { SpecialsSEO } from "../config/seo.presets";
import { Box } from "@mui/material";

const Special = () => {
  const { type } = useParams<{ type?: string }>();
  const specialType = type || "daily";

  // Generate appropriate title based on special type
  const getTitle = () => {
    if (specialType === "daily") return "Daily Specials";
    if (specialType === "chef") return "Chef's Specials";
    if (specialType === "night") return "Night Specials";
    // Capitalize first letter for other types
    return `${
      specialType.charAt(0).toUpperCase() + specialType.slice(1)
    } Specials`;
  };

  const getSubtitle = () => {
    if (specialType === "daily")
      return "Discover our chef's handpicked selections and daily delights";
    if (specialType === "chef")
      return "Exquisite creations crafted with passion by our master chef";
    if (specialType === "night")
      return "Evening exclusives to elevate your dining experience";
    return "Discover our special offerings";
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#FDF8F3",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <AnimatedBackground variant="default" />
      <SpecialsSEO type={specialType} />
      <Nav />
      <Callicon />
      <SocialMedia />

      {/* Hero Section - using reusable component */}
      <HeroSection
        id="special-hero"
        title={getTitle()}
        subtitle={getSubtitle()}
        overlineText="✦ LIMITED TIME OFFERS ✦"
        variant="light"
      />

      <SpecialDisplay />
      <Footer />
    </Box>
  );
};

export default Special;
