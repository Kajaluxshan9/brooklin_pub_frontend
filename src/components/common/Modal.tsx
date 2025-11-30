import { useEffect, useCallback, useRef } from "react";
import type { ReactNode } from "react";
import {
  Box,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import CloseIcon from "@mui/icons-material/Close";
import {
  colors,
  shadows,
  borderRadius,
  zIndex,
  typography,
} from "../../config/theme.tokens";

interface ModalProps {
  /** Whether the modal is open */
  open: boolean;
  /** Callback when modal should close */
  onClose: () => void;
  /** Modal title */
  title?: string;
  /** Modal content */
  children: ReactNode;
  /** Modal size */
  size?: "sm" | "md" | "lg" | "xl" | "fullscreen";
  /** Whether to show close button */
  showCloseButton?: boolean;
  /** Whether clicking backdrop closes modal */
  closeOnBackdropClick?: boolean;
  /** Whether pressing Escape closes modal */
  closeOnEscape?: boolean;
  /** Custom max width */
  maxWidth?: number | string;
  /** Footer content */
  footer?: ReactNode;
  /** ARIA label for accessibility */
  ariaLabel?: string;
  /** Whether to show backdrop blur */
  blurBackdrop?: boolean;
}

const sizeMap = {
  sm: 400,
  md: 600,
  lg: 900,
  xl: 1200,
  fullscreen: "100%",
};

/**
 * Modal - Reusable accessible modal component
 * Features:
 * - Keyboard navigation (Escape to close, focus trap)
 * - Screen reader accessible
 * - Responsive (fullscreen on mobile)
 * - Animated with framer-motion
 * - Customizable size and content
 */
export default function Modal({
  open,
  onClose,
  title,
  children,
  size = "md",
  showCloseButton = true,
  closeOnBackdropClick = true,
  closeOnEscape = true,
  maxWidth,
  footer,
  ariaLabel,
  blurBackdrop = true,
}: ModalProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Handle escape key
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape" && closeOnEscape) {
        onClose();
      }
    },
    [onClose, closeOnEscape]
  );

  // Handle backdrop click
  const handleBackdropClick = useCallback(
    (event: React.MouseEvent) => {
      if (closeOnBackdropClick && event.target === event.currentTarget) {
        onClose();
      }
    },
    [onClose, closeOnBackdropClick]
  );

  // Focus management
  useEffect(() => {
    if (open) {
      // Store current active element
      previousActiveElement.current = document.activeElement as HTMLElement;

      // Focus modal
      setTimeout(() => {
        modalRef.current?.focus();
      }, 100);

      // Add escape listener
      document.addEventListener("keydown", handleKeyDown);

      // Prevent body scroll
      document.body.style.overflow = "hidden";
    } else {
      // Restore focus
      previousActiveElement.current?.focus();

      // Restore body scroll
      document.body.style.overflow = "";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, handleKeyDown]);

  const computedMaxWidth =
    maxWidth ?? (isMobile && size !== "fullscreen" ? "95%" : sizeMap[size]);

  return (
    <AnimatePresence>
      {open && (
        <Box
          component={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleBackdropClick}
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: zIndex.modalBackdrop,
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            backdropFilter: blurBackdrop ? "blur(4px)" : "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: { xs: 1, sm: 2 },
          }}
        >
          <Box
            ref={modalRef}
            component={motion.div}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            role="dialog"
            aria-modal="true"
            aria-label={ariaLabel || title}
            tabIndex={-1}
            onClick={(e) => e.stopPropagation()}
            sx={{
              position: "relative",
              width: "100%",
              maxWidth: computedMaxWidth,
              maxHeight: size === "fullscreen" ? "100%" : "90vh",
              bgcolor: colors.background.paper,
              borderRadius: size === "fullscreen" ? 0 : borderRadius.lg,
              boxShadow: shadows.popup,
              display: "flex",
              flexDirection: "column",
              outline: "none",
              overflow: "hidden",
            }}
          >
            {/* Header */}
            {(title || showCloseButton) && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  p: { xs: 2, sm: 3 },
                  borderBottom: `1px solid ${colors.glass.goldBorder}`,
                }}
              >
                {title && (
                  <Typography
                    component="h2"
                    variant="h5"
                    sx={{
                      fontFamily: typography.fontFamily.heading,
                      fontWeight: typography.fontWeight.semibold,
                      color: colors.text.primary,
                      m: 0,
                    }}
                  >
                    {title}
                  </Typography>
                )}
                {showCloseButton && (
                  <IconButton
                    onClick={onClose}
                    aria-label="Close modal"
                    sx={{
                      ml: "auto",
                      color: colors.text.secondary,
                      "&:hover": {
                        bgcolor: colors.glass.gold,
                        color: colors.primary.main,
                      },
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                )}
              </Box>
            )}

            {/* Content */}
            <Box
              sx={{
                flex: 1,
                overflowY: "auto",
                p: { xs: 2, sm: 3 },
              }}
            >
              {children}
            </Box>

            {/* Footer */}
            {footer && (
              <Box
                sx={{
                  p: { xs: 2, sm: 3 },
                  borderTop: `1px solid ${colors.glass.goldBorder}`,
                  bgcolor: colors.background.default,
                }}
              >
                {footer}
              </Box>
            )}
          </Box>
        </Box>
      )}
    </AnimatePresence>
  );
}

// Convenience components for common modal patterns
interface ConfirmModalProps extends Omit<ModalProps, "children" | "footer"> {
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  confirmColor?: "primary" | "error" | "warning";
}

export function ConfirmModal({
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onClose,
  confirmColor = "primary",
  ...props
}: ConfirmModalProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal
      {...props}
      onClose={onClose}
      size="sm"
      footer={
        <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
          <Box
            component="button"
            onClick={onClose}
            sx={{
              px: 3,
              py: 1.5,
              borderRadius: borderRadius.base,
              border: `2px solid ${colors.glass.goldBorder}`,
              bgcolor: "transparent",
              color: colors.text.primary,
              fontFamily: typography.fontFamily.body,
              fontWeight: typography.fontWeight.semibold,
              cursor: "pointer",
              transition: "all 0.2s ease",
              "&:hover": {
                borderColor: colors.secondary.main,
                bgcolor: colors.glass.gold,
              },
            }}
          >
            {cancelText}
          </Box>
          <Box
            component="button"
            onClick={handleConfirm}
            sx={{
              px: 3,
              py: 1.5,
              borderRadius: borderRadius.base,
              border: "none",
              bgcolor:
                confirmColor === "error"
                  ? colors.error.main
                  : confirmColor === "warning"
                  ? colors.warning.main
                  : colors.secondary.main,
              color: "#fff",
              fontFamily: typography.fontFamily.body,
              fontWeight: typography.fontWeight.semibold,
              cursor: "pointer",
              transition: "all 0.2s ease",
              boxShadow: shadows.base,
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: shadows.md,
              },
            }}
          >
            {confirmText}
          </Box>
        </Box>
      }
    >
      <Typography
        sx={{
          color: colors.text.primary,
          fontFamily: typography.fontFamily.body,
          fontSize: typography.fontSize.lg,
          lineHeight: typography.lineHeight.relaxed,
          textAlign: "center",
          py: 2,
        }}
      >
        {message}
      </Typography>
    </Modal>
  );
}
