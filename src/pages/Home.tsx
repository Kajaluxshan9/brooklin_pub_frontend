import Nav from "../components/common/Nav";
import Item from "../components/about/AboutUs";
import LandingPage from "../components/home/LandingPage";
import Footer from "../components/common/Footer";
import { Box, Typography } from "@mui/material";
import BgImage from "../assets/components/image-2.jpg";
import Callicon from "../components/icons/CalendarIcon";
import SocialMedia from "../components/common/SocialFloatingMenu";

const Home = () => {
  return (
    <div>
      <Nav />
      <LandingPage />
      <Callicon />
      <SocialMedia />

      <Box
        sx={{
          minHeight: { xs: "60vh", sm: "70vh", md: "80vh" }, // responsive height
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          px: { xs: 2, sm: 4 },
          backgroundImage: `url(${BgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <Typography
          variant="h3"
          fontWeight={700}
          sx={{
            fontSize: { xs: "1.8rem", sm: "2.5rem", md: "3rem" }, // responsive title
          }}
          gutterBottom
        >
          Your Title Text Here
        </Typography>

        <Typography
          variant="body1"
          sx={{
            maxWidth: "700px",
            fontSize: { xs: "1rem", sm: "1.1rem", md: "1.2rem" }, // responsive paragraph
          }}
        >
          Your description paragraph or message goes here. This text will resize
          smoothly across mobile, tablet, and desktop screens.
        </Typography>
      </Box>

      <Item />
      <Footer />
    </div>
  );
};

export default Home;
