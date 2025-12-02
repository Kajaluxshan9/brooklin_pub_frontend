import { Box, Typography, Container } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";
import { motion } from "framer-motion";
import { colors, typography, components } from "../../config/theme.tokens";
import DefaultHeroBg from "../../assets/images/hero-bg.jpg";

interface HeroSectionProps {
  /** Main title text */
  title: string;
  /** Optional subtitle/description */
  subtitle?: string;
  /** Background image URL - defaults to hero-bg.jpg (only used in 'dark' variant) */
  backgroundImage?: string;
  /** Custom height settings */
  minHeight?: { xs?: string; sm?: string; md?: string };
  /** Whether to show decorative lines */
  showDecorativeLines?: boolean;
  /** Custom overlay gradient (only used in 'dark' variant) */
  overlayGradient?: string;
  /** Additional content to render below title/subtitle */
  children?: React.ReactNode;
  /** Additional sx props for the container */
  sx?: SxProps<Theme>;
  /** ID for accessibility */
  id?: string;
  /** Hero style variant - 'dark' uses image bg, 'light' uses cream gradient like Events page */
  variant?: "dark" | "light";
  /** Decorative label above title (only used in 'light' variant) */
  overlineText?: string;
}

/**
 * HeroSection - Reusable hero component for page headers
 * Provides consistent styling across all pages with configurable content
 *
 * Variants:
 * - 'dark': Image background with dark overlay (original style)
 * - 'light': Light cream gradient with decorative geometric elements (Events style)
 */
export default function HeroSection({
  title,
  subtitle,
  backgroundImage = DefaultHeroBg,
  minHeight = components.hero.minHeight,
  showDecorativeLines = true,
  overlayGradient = colors.background.overlay,
  children,
  sx,
  id,
  variant = "light",
  overlineText,
}: HeroSectionProps) {
  // Light variant (Events-style)
  if (variant === "light") {
    return (
      <Box
        component="section"
        id={id}
        aria-labelledby={`${id || "hero"}-title`}
        sx={{
          pt: { xs: 12, md: 20 },
          // Reduce bottom padding on small screens so the hero has a smaller gap
          pb: { xs: 6, md: 14 },
          minHeight: { xs: "40vh", sm: "55vh", md: "50vh" },
          background:
            "linear-gradient(135deg, #FDF8F3 0%, #F5EBE0 50%, #E8D5C4 100%)",
          position: "relative",
          overflow: "hidden",
          ...sx,
        }}
      >
        {/* Decorative Geometric Elements */}
        {[...Array(6)].map((_, i) => (
          <Box
            key={i}
            component={motion.div}
            animate={{
              y: [0, -30, 0],
              rotate: [0, 180, 360],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
            sx={{
              position: "absolute",
              width: `${30 + i * 15}px`,
              height: `${30 + i * 15}px`,
              border: "2px solid #D9A756",
              borderRadius: i % 2 === 0 ? "50%" : "0%",
              top: `${15 + i * 12}%`,
              left: `${5 + i * 15}%`,
              opacity: 0.15,
              pointerEvents: "none",
            }}
          />
        ))}

        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", position: "relative", zIndex: 2 }}>
            {/* Decorative Line Above */}
            {showDecorativeLines && (
              <Box
                component={motion.div}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1 }}
                sx={{
                  width: 80,
                  height: 3,
                  background:
                    "linear-gradient(90deg, transparent, #D9A756, transparent)",
                  mx: "auto",
                  mb: 2,
                }}
              />
            )}

            {/* Overline Text */}
            {overlineText && (
              <Typography
                component={motion.div}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                variant="overline"
                sx={{
                  color: "#D9A756",
                  letterSpacing: "0.45em",
                  fontSize: { xs: "0.7rem", md: "0.85rem" },
                  fontFamily: '"Inter", sans-serif',
                  fontWeight: 600,
                  mb: 2,
                  display: "block",
                  textTransform: "uppercase",
                }}
              >
                {overlineText}
              </Typography>
            )}

            {/* Title */}
            <Typography
              component={motion.h1}
              id={`${id || "hero"}-title`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              sx={{
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4.5rem" },
                fontWeight: 700,
                color: "#4A2C17",
                mb: 2,
                textShadow: "0 0 40px rgba(106,58,30,0.12)",
                letterSpacing: "-0.015em",
                lineHeight: 1.05,
              }}
            >
              {title}
            </Typography>

            {/* Subtitle */}
            {subtitle && (
              <Typography
                component={motion.p}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                sx={{
                  fontFamily: '"Inter", sans-serif',
                  fontSize: { xs: "0.95rem", md: "1.1rem" },
                  color: "#6A3A1E",
                  maxWidth: 580,
                  mx: "auto",
                  lineHeight: 1.75,
                  letterSpacing: "0.01em",
                  px: 2,
                  fontWeight: 400,
                }}
              >
                {subtitle}
              </Typography>
            )}

            {/* Decorative Line Below */}
            {showDecorativeLines && (
              <Box
                component={motion.div}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                sx={{
                  width: 120,
                  height: 3,
                  background:
                    "linear-gradient(90deg, transparent, #D9A756, transparent)",
                  mx: "auto",
                  mt: 3,
                }}
              />
            )}

            {/* Additional custom content */}
            {children}
          </Box>
        </Container>
      </Box>
    );
  }

  // Dark variant (original style with image background)
  return (
    <Box
      component="section"
      id={id}
      aria-labelledby={`${id || "hero"}-title`}
      sx={{
        minHeight,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        px: { xs: 2, sm: 4 },
        pt: { xs: 10, sm: 6, md: 0 },
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: overlayGradient,
        },
        ...sx,
      }}
    >
      {/* Decorative overlay pattern */}
      <Box
        aria-hidden="true"
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(217,167,86,0.1) 0%, transparent 50%),
                            radial-gradient(circle at 80% 50%, rgba(217,167,86,0.08) 0%, transparent 50%)`,
          pointerEvents: "none",
        }}
      />

      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Decorative line above */}
        {showDecorativeLines && (
          <Box
            component={motion.div}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            aria-hidden="true"
            sx={{
              width: 80,
              height: 2,
              backgroundColor: colors.secondary.main,
              mb: 2,
            }}
          />
        )}

        <Typography
          component={motion.h1}
          id={`${id || "hero"}-title`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          sx={{
            margin: 0,
            color: colors.text.light,
            fontSize: { xs: "2rem", sm: "3rem", md: "4rem" },
            letterSpacing: { xs: 1, sm: 2, md: 4 },
            textTransform: "uppercase",
            fontWeight: typography.fontWeight.bold,
            fontFamily: typography.fontFamily.heading,
            textShadow: "2px 2px 12px rgba(0,0,0,0.4)",
            lineHeight: typography.lineHeight.tight,
          }}
        >
          {title}
        </Typography>

        {subtitle && (
          <Typography
            component={motion.p}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            sx={{
              mt: { xs: 1.5, md: 2 },
              color: colors.text.lightMuted,
              fontSize: { xs: "0.9rem", sm: "1rem", md: "1.2rem" },
              fontFamily: typography.fontFamily.body,
              fontWeight: typography.fontWeight.regular,
              letterSpacing: { xs: 0.5, md: 1 },
              maxWidth: { xs: "90%", md: 600 },
              px: 2,
              textShadow: "1px 1px 4px rgba(0,0,0,0.3)",
            }}
          >
            {subtitle}
          </Typography>
        )}

        {/* Decorative line below */}
        {showDecorativeLines && (
          <Box
            component={motion.div}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            aria-hidden="true"
            sx={{
              width: 120,
              height: 2,
              backgroundColor: colors.secondary.main,
              mt: 3,
            }}
          />
        )}

        {/* Additional custom content */}
        {children}
      </Box>
    </Box>
  );
}
