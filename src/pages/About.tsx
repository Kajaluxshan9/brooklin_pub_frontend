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
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#FDF8F3",
        position: "relative",
        overflow: "hidden",
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
      <Footer />
    </Box>
  );
};

export default About;
