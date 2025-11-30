import { Box } from "@mui/material";
import { colors, typography, zIndex } from "../../config/theme.tokens";

/**
 * SkipLink - Accessibility component for keyboard navigation
 * Allows keyboard users to skip repetitive navigation and jump to main content
 *
 * Usage: Place at the very beginning of your app, before the Nav component
 * Make sure to add id="main-content" to your main content area
 */
export default function SkipLink() {
  return (
    <Box
      component="a"
      href="#main-content"
      sx={{
        position: "fixed",
        top: "-100%",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: zIndex.modalBackdrop + 1,
        padding: "12px 24px",
        backgroundColor: colors.primary.main,
        color: colors.text.light,
        fontFamily: typography.fontFamily.body,
        fontWeight: typography.fontWeight.semibold,
        fontSize: typography.fontSize.base,
        textDecoration: "none",
        borderRadius: "0 0 8px 8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        transition: "top 0.2s ease",

        // Show when focused (Tab key)
        "&:focus": {
          top: 0,
          outline: `3px solid ${colors.secondary.main}`,
          outlineOffset: "2px",
        },

        "&:focus-visible": {
          top: 0,
        },
      }}
    >
      Skip to main content
    </Box>
  );
}
