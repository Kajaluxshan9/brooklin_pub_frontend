"use client";
import { Box, Button, useMediaQuery } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone } from "@fortawesome/free-solid-svg-icons";
import { faInstagram, faFacebook } from "@fortawesome/free-brands-svg-icons";
import { faTiktok } from "@fortawesome/free-brands-svg-icons";

const SocialFloatingMenu = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const iconSize = isMobile ? "lg" : "xl";

  // Social icons list
  const icons = [
    ...(isMobile
      ? [{ icon: faPhone, link: "tel:+94771234567" }] // Only show call icon on mobile
      : []),
    { icon: faTiktok, link: "https://www.tiktok.com/" },
    { icon: faInstagram, link: "https://instagram.com/" },
    { icon: faFacebook, link: "https://facebook.com/" },
  ];

  return (
    <Box
      sx={{
        position: "fixed",
        top: "50%",
        left: isMobile ? 20 : 30,
        transform: "translateY(-50%)",
        zIndex: 4000,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: isMobile ? 1 : 1.2,
      }}
    >
      {icons.map((item, idx) => (
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
  );
};

export default SocialFloatingMenu;
