import { useEffect, useState, useRef } from "react";
import { Zoom, useMediaQuery, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import NorthIcon from "@mui/icons-material/North";

// Floating scroll-to-top button: simple arrow centered horizontally.
// Auto-hides after 3 seconds of no scrolling.
export default function ScrollTopFab() {
  const [visible, setVisible] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => {
      // Clear any existing hide timeout
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }

      // Show button if scrolled past 300px
      if (window.scrollY > 300) {
        setVisible(true);

        // Set timeout to hide after 3 seconds of no scrolling
        hideTimeoutRef.current = setTimeout(() => {
          setVisible(false);
        }, 3000);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
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
          left: 0,
          right: 0,
          bottom: isMobile ? 90 : 24,
          width: size,
          height: size,
          marginLeft: "auto",
          marginRight: "auto",
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
            transform: "translateY(-2px)",
          },
        }}
      >
        <NorthIcon
          sx={{
            color: "#b87333",
            fontSize: isMobile ? 18 : 22,
          }}
        />
      </Box>
    </Zoom>
  );
}
