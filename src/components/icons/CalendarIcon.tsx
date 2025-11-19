"use client";
import { Button, Box, useMediaQuery } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone } from "@fortawesome/free-solid-svg-icons";

const CallButton = () => {
  const isMobile = useMediaQuery("(max-width:768px)");
  const size = isMobile ? 48 : 60;

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: isMobile ? 100 : 24,
        right: 30,
        zIndex: 4000, // ensure it stays above everything
        display: "flex", // show on all breakpoints
      }}
    >
      <Button
        href="tel:+94779123456"
        variant="contained"
        sx={{
          width: size,
          height: size,
          borderRadius: "50%",
          minWidth: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 8px 20px rgba(0,0,0,0.30)",
        }}
      >
        <FontAwesomeIcon icon={faPhone} style={{ fontSize: isMobile ? 18 : 22 }} />
      </Button>
    </Box>
  );
};

export default CallButton;
