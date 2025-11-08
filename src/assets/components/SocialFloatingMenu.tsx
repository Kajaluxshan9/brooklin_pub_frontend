"use client";
import { Box, Button, useMediaQuery } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { faInstagram, faFacebook, faWhatsapp } from "@fortawesome/free-brands-svg-icons";

const SocialFloatingMenu = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const iconSize = isMobile ? "lg" : "xl";

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* SOCIAL ICONS (Middle Right) */}
      <Box
        sx={{
          position: "fixed",
          top: "50%",
          right: isMobile ? 20 : 30,
          transform: "translateY(-50%)",
          zIndex: 4000,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: isMobile ? 1 : 1.2,
        }}
      >
        {[
          { icon: faWhatsapp, link: "https://wa.me/94779123456" },
          { icon: faInstagram, link: "https://instagram.com/" },
          { icon: faFacebook, link: "https://facebook.com/" },
        ].map((item, idx) => (
          <Button
            key={idx}
            href={item.link}
            target="_blank"
            sx={{
              width: isMobile ? 48 : 60,
              height: isMobile ? 48 : 60,
              minWidth: isMobile ? 48 : 60,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.35)",
              backdropFilter: "blur(10px)",
              boxShadow: "0px 6px 14px rgba(0,0,0,0.3)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "scale(1.15)",
                background: "rgba(255,255,255,0.55)",
              },
            }}
          >
            <FontAwesomeIcon icon={item.icon} size={iconSize} />
          </Button>
        ))}
      </Box>

      {/* ARROW BUTTON (Bottom Right) */}
      <Button
        variant="contained"
        onClick={scrollToTop}
        sx={{
          position: "fixed",
          bottom: isMobile ? 25 : 40,
          right: isMobile ? 20 : 30,
          width: isMobile ? 50 : 60,
          height: isMobile ? 50 : 60,
          minWidth: isMobile ? 50 : 60,
          borderRadius: "50%",
          boxShadow: "0px 6px 14px rgba(0,0,0,0.3)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 4000,
          transition: "all 0.3s ease",
          "&:hover": { transform: "scale(1.1)" },
        }}
      >
        <FontAwesomeIcon icon={faArrowUp} size={iconSize} />
      </Button>
    </>
  );
};

export default SocialFloatingMenu;
