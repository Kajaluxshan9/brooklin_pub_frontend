import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { colors, typography } from "../../config/theme.tokens";

interface LoadingScreenProps {
  message?: string;
  fullScreen?: boolean;
  showLogo?: boolean;
}

/**
 * LoadingScreen - A premium branded loading component for route transitions
 * Used as Suspense fallback for lazy-loaded routes
 */
export default function LoadingScreen({
  message = "",
  fullScreen = true,
  showLogo = true,
}: LoadingScreenProps) {
  // Animation variants for staggered children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" as const },
    },
  };

  return (
    <Box
      component={motion.div}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, transition: { duration: 0.3 } }}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: fullScreen ? "100vh" : "400px",
        width: "100%",
        background: colors.background.default,
        position: "relative",
        overflow: "hidden",
      }}
      role="alert"
      aria-busy="true"
      aria-live="polite"
    >
      {/* Background decorative elements */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        {/* Floating geometric shapes */}
        {[...Array(6)].map((_, i) => (
          <Box
            key={i}
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{
              opacity: 0.08,
              x: [0, 20, 0, -20, 0],
              y: [0, -15, 0, 15, 0],
            }}
            transition={{
              opacity: { duration: 1, delay: i * 0.2 },
              x: {
                duration: 8 + i * 2,
                repeat: Infinity,
                ease: "easeInOut" as const,
              },
              y: {
                duration: 6 + i * 2,
                repeat: Infinity,
                ease: "easeInOut" as const,
              },
            }}
            sx={{
              position: "absolute",
              width: [100, 150, 80, 120, 90, 140][i],
              height: [100, 150, 80, 120, 90, 140][i],
              borderRadius: i % 2 === 0 ? "50%" : "20%",
              border: `1.5px solid ${colors.secondary.main}`,
              top: ["10%", "60%", "30%", "70%", "15%", "50%"][i],
              left: ["5%", "80%", "70%", "10%", "85%", "30%"][i],
              transform: `rotate(${i * 15}deg)`,
            }}
          />
        ))}

        {/* Ambient glow orbs */}
        <Box
          component={motion.div}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut" as const,
          }}
          sx={{
            position: "absolute",
            top: "20%",
            left: "10%",
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${colors.secondary.main}20 0%, transparent 70%)`,
            filter: "blur(40px)",
          }}
        />
        <Box
          component={motion.div}
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut" as const,
            delay: 1,
          }}
          sx={{
            position: "absolute",
            bottom: "15%",
            right: "15%",
            width: 250,
            height: 250,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${colors.primary.main}15 0%, transparent 70%)`,
            filter: "blur(40px)",
          }}
        />
      </Box>

      {/* Main content */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
          zIndex: 1,
        }}
      >
        {showLogo && (
          <motion.div variants={itemVariants}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
              }}
            >
              {/* Logo Image */}
              <motion.img
                src="/brooklinpub-logo.png"
                alt="The Brooklin Pub"
                style={{
                  width: 120,
                  height: 120,
                  objectFit: "contain",
                }}
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut" as const,
                }}
              />

              {/* Brand Name with decorative lines */}
              <Typography
                sx={{
                  fontFamily: typography.fontFamily.heading,
                  fontSize: { xs: "1.5rem", md: "1.75rem" },
                  color: colors.primary.main,
                  fontWeight: typography.fontWeight.semibold,
                  letterSpacing: typography.letterSpacing.wide,
                  textAlign: "center",
                  position: "relative",
                }}
              >
                <Box
                  component="span"
                  sx={{
                    position: "relative",
                    "&::before, &::after": {
                      content: '""',
                      position: "absolute",
                      top: "50%",
                      width: { xs: 30, md: 50 },
                      height: "1px",
                      background: `linear-gradient(90deg, transparent, ${colors.secondary.main})`,
                    },
                    "&::before": {
                      right: "calc(100% + 12px)",
                      background: `linear-gradient(90deg, transparent, ${colors.secondary.main})`,
                    },
                    "&::after": {
                      left: "calc(100% + 12px)",
                      background: `linear-gradient(90deg, ${colors.secondary.main}, transparent)`,
                    },
                  }}
                >
                  The Brooklin Pub
                </Box>
              </Typography>
            </Box>
          </motion.div>
        )}

        {/* Premium animated loader */}
        <motion.div variants={itemVariants}>
          <Box
            sx={{
              position: "relative",
              width: 100,
              height: 100,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Pulsing center glow */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut" as const,
              }}
              style={{
                position: "absolute",
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: `radial-gradient(circle, ${colors.secondary.main}60 0%, transparent 70%)`,
                filter: "blur(8px)",
              }}
            />

            {/* Rotating rings */}
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{
                  rotate: i % 2 === 0 ? 360 : -360,
                }}
                transition={{
                  duration: 3 + i * 0.5,
                  repeat: Infinity,
                  ease: "linear" as const,
                }}
                style={{
                  position: "absolute",
                  width: 50 + i * 20,
                  height: 50 + i * 20,
                  borderRadius: "50%",
                  border: `${2 - i * 0.5}px solid transparent`,
                  borderTopColor:
                    i === 0
                      ? colors.secondary.main
                      : i === 1
                      ? colors.primary.main
                      : colors.secondary.light,
                  borderRightColor:
                    i === 1 ? colors.secondary.main : "transparent",
                  opacity: 1 - i * 0.2,
                }}
              />
            ))}

            {/* Center dot */}
            <motion.div
              animate={{
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut" as const,
              }}
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: colors.secondary.main,
                boxShadow: `0 0 15px ${colors.secondary.main}80`,
              }}
            />
          </Box>
        </motion.div>

        {/* Loading text with animated dots */}
        <motion.div variants={itemVariants}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Typography
              sx={{
                color: colors.text.muted,
                fontFamily: typography.fontFamily.body,
                fontWeight: typography.fontWeight.medium,
                fontSize: "0.95rem",
                letterSpacing: typography.letterSpacing.wide,
              }}
            >
              {message || "Loading"}
            </Typography>
            <Box sx={{ display: "flex", gap: 0.5, ml: 0.5 }}>
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  animate={{
                    opacity: [0.3, 1, 0.3],
                    y: [0, -3, 0],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut" as const,
                  }}
                  style={{
                    display: "block",
                    width: 4,
                    height: 4,
                    borderRadius: "50%",
                    background: colors.secondary.main,
                  }}
                />
              ))}
            </Box>
          </Box>
        </motion.div>

        {/* Decorative flourish */}
        <motion.div variants={itemVariants} style={{ marginTop: 8 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Box
              sx={{
                width: 40,
                height: "1px",
                background: `linear-gradient(90deg, transparent, ${colors.secondary.main}50)`,
              }}
            />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear" as const,
              }}
              style={{
                width: 6,
                height: 6,
                borderRadius: 1,
                background: colors.secondary.main,
                transform: "rotate(45deg)",
                opacity: 0.6,
              }}
            />
            <Box
              sx={{
                width: 40,
                height: "1px",
                background: `linear-gradient(90deg, ${colors.secondary.main}50, transparent)`,
              }}
            />
          </Box>
        </motion.div>
      </Box>
    </Box>
  );
}
