import { useEffect } from "react";
import Nav from "../components/common/Nav";
import Footer from "../components/common/Footer";
import AboutUs from "../components/about/AboutUs";
import Gallery from "../components/home/Gallery";
import Callicon from "../components/icons/CalendarIcon";
import SocialMedia from "../components/common/SocialFloatingMenu";
import HeroSection from "../components/common/HeroSection";
import AnimatedBackground from "../components/common/AnimatedBackground";
import { AboutSEO } from "../config/seo.presets";
import { Box } from "@mui/material";

const About = () => {
  // Ensure scroll is restored when navigating to About page
  useEffect(() => {
    // Reset any scroll locks from Gallery or other components
    document.body.style.overflow = "";
    document.body.style.position = "";
    document.body.style.width = "";
    document.body.style.top = "";
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "transparent",
        position: "relative",
        overflow: "visible",
      }}
    >
      <AnimatedBackground variant="subtle" />
      <AboutSEO />
      <Nav />
      <Callicon />
      <SocialMedia />

      {/* Hero Section - using reusable component */}
      <HeroSection
        id="about-hero"
        title="About Us"
        subtitle="A local favorite since 2014, where great food meets warm hospitality"
        overlineText="✦ DISCOVER OUR HERITAGE ✦"
        variant="light"
      />

      <AboutUs />
      <Gallery />
      {/* Spacer for desktop before footer with theme background */}
      <Box
        sx={{
          height: { xs: 0, md: 80 },
          background: "transparent",
        }}
      />
      <Footer />
    </Box>
  );
};

export default About;
