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
        href="tel:+19054253055"
        variant="contained"
        sx={{
          width: size,
          background: "rgba(255,255,255,0.35)",
          backdropFilter: "blur(10px)",
          boxShadow: "0px 6px 14px rgba(0,0,0,0.3)",
          transition: "all 0.3s ease",

          height: size,
          borderRadius: "50%",
          minWidth: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          "&:hover": {
            transform: "scale(1.15)",
            background: "rgba(255,255,255,0.55)",
          },
          color: "#8B4513",
        }}
      >
        <FontAwesomeIcon
          icon={faPhone}
          style={{ fontSize: isMobile ? 18 : 22 }}
        />
      </Button>
    </Box>
  );
};

export default CallButton;
