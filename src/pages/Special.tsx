import { useParams } from "react-router-dom";
import Nav from "../components/common/Nav";
import SpecialDisplay from "../components/special/SpecialDisplay";
import Footer from "../components/common/Footer";
import Callicon from "../components/icons/CalendarIcon";
import SocialMedia from "../components/common/SocialFloatingMenu";
import HeroSection from "../components/common/HeroSection";
import AnimatedBackground from "../components/menu/PopupBackground";
import { SpecialsSEO } from "../config/seo.presets";
import { Box } from "@mui/material";

const Special = () => {
  const { type } = useParams<{ type?: string }>();
  const specialType = type || "daily";

  // Generate appropriate title based on special type
  const getTitle = () => {
    if (specialType === "daily") return "Daily Specials";
    if (specialType === "other") return "Other Specials";
    // Legacy support for other types
    if (specialType === "chef") return "Chef's Specials";
    if (specialType === "night") return "Night Specials";
    // Capitalize first letter for other types
    return `${
      specialType.charAt(0).toUpperCase() + specialType.slice(1)
    } Specials`;
  };

  const getSubtitle = () => {
    if (specialType === "daily")
      return "Start your day right with our daily deals, late-night bites, and all-day favourites";
    if (specialType === "other")
      return "Seasonal flavours, game-day specials, and chef's exclusive creations you won't want to miss";
    if (specialType === "chef")
      return "Handcrafted dishes made with passion by our talented kitchen team";
    if (specialType === "night")
      return "Evening exclusives to cap off your night in style";
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
      <AnimatedBackground />
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
