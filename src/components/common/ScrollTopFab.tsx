import { useEffect, useState } from "react";
import { Zoom, useMediaQuery, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

// Floating scroll-to-top button: tiny brown arrow in transparent round.
export default function ScrollTopFab() {
  const [visible, setVisible] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const size = isMobile ? 36 : 42;

  return (
    <Zoom in={visible} unmountOnExit>
      <Box
        onClick={handleClick}
        aria-label="scroll back to top"
        sx={{
          position: "fixed",
          left: "50%",
          transform: "translateX(-50%)",
          bottom: isMobile ? 90 : 24,
          width: size,
          height: size,
          borderRadius: "50%",
          backgroundColor: "rgba(184, 115, 51, 0.15)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(184, 115, 51, 0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          transition: "all 0.2s ease",
          zIndex: (theme) => theme.zIndex.tooltip + 1,
          "&:hover": {
            backgroundColor: "rgba(184, 115, 51, 0.25)",
            transform: "translateX(-50%) translateY(-2px)",
          },
        }}
      >
        <KeyboardArrowUpIcon
          sx={{
            color: "#b87333",
            fontSize: isMobile ? 20 : 24,
          }}
        />
      </Box>
    </Zoom>
  );
}
