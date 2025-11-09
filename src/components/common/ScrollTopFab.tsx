import { useEffect, useState } from "react";
import { Fab, Zoom, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

// Floating scroll-to-top button: bottom-center, small, appears after scrolling.
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

  return (
    <Zoom in={visible} unmountOnExit>
      <Fab
        size={isMobile ? "small" : "medium"}
        color="primary"
        aria-label="scroll back to top"
        onClick={handleClick}
        sx={{
          position: "fixed",
          left: "50%",
          bottom: isMobile ? 100 : 16, // keep above bottom mobile nav
          transform: "translateX(-50%)",
          zIndex: (theme) => theme.zIndex.tooltip + 1,
          boxShadow: 3,
        }}
      >
        <KeyboardArrowUpIcon fontSize="small" />
      </Fab>
    </Zoom>
  );
}
