"use client";
import { useState } from "react";
import { Box, Button, useMediaQuery } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { faInstagram, faFacebook, faWhatsapp } from "@fortawesome/free-brands-svg-icons";

const SocialFloatingMenu = () => {
  const [open, setOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const iconSize = isMobile ? "lg" : "xl";

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: isMobile ? 25 : 110,
        right: isMobile ? 20 : 30,
        zIndex: 4000,
        display: "flex",
        alignItems: "center",
        flexDirection: isMobile ? "row" : "column", // <-- changed row-reverse to row
        gap: isMobile ? 1 : 1.5,
      }}
    >
      {/* MOBILE / TABLET MODE - Floating Glass Bar */}
      {isMobile && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.3,
            padding: open ? "8px 14px" : 0,
            background: open ? "rgba(255,255,255,0.28)" : "transparent",
            borderRadius: "40px",
            backdropFilter: open ? "blur(14px)" : "none",
            boxShadow: open ? "0px 8px 22px rgba(0,0,0,0.3)" : "none",
            transition: "all 0.35s ease",
            overflow: "hidden",
            maxWidth: open ? "260px" : "0px",
          }}
        >
          <Button variant="text" href="https://wa.me/94779123456" target="_blank">
            <FontAwesomeIcon icon={faWhatsapp} size={iconSize} />
          </Button>

          <Button variant="text" href="https://instagram.com/" target="_blank">
            <FontAwesomeIcon icon={faInstagram} size={iconSize} />
          </Button>

          <Button variant="text" href="https://facebook.com/" target="_blank">
            <FontAwesomeIcon icon={faFacebook} size={iconSize} />
          </Button>
        </Box>
      )}

      {/* DESKTOP MODE (Vertical Menu) */}
{/* DESKTOP MODE (Vertical Fade-In + Circle Glass) */}
{!isMobile && (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      gap: 1.5,
    }}
  >
    {[
      { icon: faWhatsapp, link: "https://wa.me/94779123456" },
      { icon: faInstagram, link: "https://instagram.com/" },
      { icon: faFacebook, link: "https://facebook.com/" }
    ].map((item, index) => (
      <Button
        key={index}
        href={item.link}
        target="_blank"
        sx={{
          width: 60,
          height: 60,
          minWidth: 60,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.35)", // same as arrow
          backdropFilter: "blur(10px)",
          boxShadow: "0px 6px 14px rgba(0,0,0,0.3)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          opacity: open ? 1 : 0,
          transform: open ? "scale(1)" : "scale(0.5)",
          transition: `opacity 0.4s ease ${index * 0.1}s, transform 0.4s ease ${index * 0.1}s`,
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
)}


      {/* TOGGLE BUTTON (Shown on all devices) */}
<Button
  variant="contained"
  onClick={() => setOpen(!open)}
  sx={{
    width: isMobile ? 50 : 60,
    height: isMobile ? 50 : 60,
    minWidth: isMobile ? 50 : 60,
    borderRadius: "50%",
    boxShadow: "0px 6px 14px rgba(0,0,0,0.3)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    transition: "all 0.35s ease",
    transform: isMobile
      ? open
        ? "rotate(-90deg)"   // when open
        : "rotate(90deg)"    // when closed → horizontal default
      : open
      ? "rotate(180deg)"     // desktop rotation normal
      : "rotate(0deg)",
  }}
>
  <FontAwesomeIcon icon={faArrowUp} size={iconSize} />
</Button>

    </Box>
  );
};

export default SocialFloatingMenu;
