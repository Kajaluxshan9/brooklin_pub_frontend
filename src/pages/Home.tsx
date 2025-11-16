import Nav from "../components/common/Nav";
import AdditionalSpecial from "../components/special/additionalSpecial";
import LandingPage from "../components/home/LandingPage";
import Footer from "../components/common/Footer";
import { Box, Typography, Alert, AlertTitle, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import BgImage from "../assets/components/image-2.jpg";
import Callicon from "../components/icons/CalendarIcon";
import SocialMedia from "../components/common/SocialFloatingMenu";
import { hasNewSpecial, getLatestSpecial, getNewSpecialsCount, getNewSpecialsCountByCategory, getLatestSpecialByCategory } from "../lib/specials";
import { useState, useEffect } from "react";

const Home = () => {
  const [showNotif, setShowNotif] = useState(false);
  const [latest, setLatest] = useState<any | null>(null);
  const [count, setCount] = useState(0);
  const [dailyCount, setDailyCount] = useState(0);
  const [chefCount, setChefCount] = useState(0);
  const [dailyLatest, setDailyLatest] = useState<any | null>(null);
  const [chefLatest, setChefLatest] = useState<any | null>(null);

  useEffect(() => {
    const has = hasNewSpecial();
    setShowNotif(has);
    if (has) {
      setLatest(getLatestSpecial());
      setCount(getNewSpecialsCount());
      setDailyCount(getNewSpecialsCountByCategory('daily'));
      setChefCount(getNewSpecialsCountByCategory('chef'));
      setDailyLatest(getLatestSpecialByCategory('daily'));
      setChefLatest(getLatestSpecialByCategory('chef'));
    }
  }, []);

  useEffect(() => {
    const onSpecialsUpdated = () => {
      const has = hasNewSpecial();
      setShowNotif(has);
      if (has) {
        setLatest(getLatestSpecial());
        setCount(getNewSpecialsCount());
        setDailyCount(getNewSpecialsCountByCategory('daily'));
        setChefCount(getNewSpecialsCountByCategory('chef'));
        setDailyLatest(getLatestSpecialByCategory('daily'));
        setChefLatest(getLatestSpecialByCategory('chef'));
      }
    };

    if (typeof window !== "undefined" && (window as any).addEventListener) {
      window.addEventListener("specials-updated", onSpecialsUpdated);
    }

    return () => {
      if (typeof window !== "undefined" && (window as any).removeEventListener) {
        window.removeEventListener("specials-updated", onSpecialsUpdated);
      }
    };
  }, []);

  return (
    <div>
      <Nav />
      {showNotif && (
        <Box sx={{ px: 2, pt: 10, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {dailyLatest && dailyCount > 0 && (
            <Alert
              severity="info"
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => setShowNotif(false)}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
              sx={{ alignItems: 'center' }}
            >
              <AlertTitle>Daily Specials ({dailyCount})</AlertTitle>
              <strong>{dailyLatest.title}</strong> — {dailyLatest.desc}
            </Alert>
          )}
          {chefLatest && chefCount > 0 && (
            <Alert
              severity="info"
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => setShowNotif(false)}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
              sx={{ alignItems: 'center' }}
            >
              <AlertTitle>Chef Specials ({chefCount})</AlertTitle>
              <strong>{chefLatest.title}</strong> — {chefLatest.desc}
            </Alert>
          )}
        </Box>
      )}

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

      <AdditionalSpecial />
      <Footer />
    </div>
  );
};

export default Home;
