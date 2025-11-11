"use client";
import { Button, Box } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone } from "@fortawesome/free-solid-svg-icons";

const CallButton = () => {
  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 30,
        right: 30,
        zIndex: 4000, // ensure it stays above everything
        display: { xs: "none", md: "flex" }, // show ONLY on desktop
      }}
    >
      <Button
        href="tel:+94779123456"
        variant="contained"
        sx={{
          width: 60,
          height: 60,
          borderRadius: "50%",
          minWidth: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 8px 20px rgba(0,0,0,0.30)",
        }}
      >
        <FontAwesomeIcon icon={faPhone} style={{ fontSize: 22 }} />
      </Button>
    </Box>
  );
};

export default CallButton;
