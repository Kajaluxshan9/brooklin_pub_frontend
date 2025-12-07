import { useState, useRef, useLayoutEffect, useEffect, useMemo } from "react";
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import { motion, useInView, useMotionValue, useTransform } from "framer-motion";
import { gsap } from "gsap";
import PopupBackground from "../menu/PopupBackground";
import { useApiWithCache } from "../../hooks/useApi";
import { storiesService } from "../../services/stories.service";
import { getImageUrl } from "../../services/api";
import type { StoryCategory } from "../../types/api.types";

interface GalleryRowData {
  title: string;
  description: string;
  images: string[];
}

interface GalleryRowProps {
  images: string[];
  title: string;
  description: string;
  rowIndex: number;
  onCycleComplete?: () => void;
  isActive?: boolean;
  isLast?: boolean;
}

function GalleryRow({
  images,
  title,
  description,
  rowIndex,
  onCycleComplete,
  isActive = true,
  isLast = false,
}: GalleryRowProps) {
  const loopImages = [...images, ...images, ...images, ...images];
  const rowRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);
  const [_dragStart, _setDragStart] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-100, 0, 100], [0.5, 1, 0.5]);
  const isRowInView = useInView(titleRef, { once: true, margin: "-100px" });

  // GSAP animation for title
  useEffect(() => {
    if (isRowInView && titleRef.current && !isMobile) {
      gsap.fromTo(
        titleRef.current,
        {
          opacity: 0,
          x: rowIndex % 2 === 0 ? -80 : 80,
          rotateY: rowIndex % 2 === 0 ? -15 : 15,
        },
        {
          opacity: 1,
          x: 0,
          rotateY: 0,
          duration: 1,
          ease: "power3.out",
          delay: 0.2,
        }
      );
    }
  }, [isRowInView, rowIndex, isMobile]);

  // Measure width for desktop carousel
  useLayoutEffect(() => {
    if (!isMobile) {
      const measure = () => {
        if (rowRef.current) {
          setWidth(rowRef.current.scrollWidth / 4);
        }
      };
      measure();
      const resizeObserver = new ResizeObserver(measure);
      if (rowRef.current) {
        resizeObserver.observe(rowRef.current);
      }
      return () => resizeObserver.disconnect();
    }
  }, [isMobile]);

  // Auto-cycle through images for mobile - complete one full cycle then signal
  useEffect(() => {
    if (isMobile && isActive) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % images.length;
          // When we complete a full cycle (back to 0)
          if (nextIndex === 0) {
            setCycleCount((c) => c + 1);
          }
          return nextIndex;
        });
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [isMobile, images.length, isActive]);

  // Signal when cycle is complete
  useEffect(() => {
    if (cycleCount >= 1 && onCycleComplete) {
      onCycleComplete();
    }
  }, [cycleCount, onCycleComplete]);

  // Handle swipe gestures
  const handleDragEnd = (_: any, info: any) => {
    const threshold = 50;
    if (info.offset.x > threshold && currentImageIndex > 0) {
      setCurrentImageIndex((prev) => prev - 1);
    } else if (
      info.offset.x < -threshold &&
      currentImageIndex < images.length - 1
    ) {
      setCurrentImageIndex((prev) => prev + 1);
    }
  };

  // Mobile Layout with enhanced premium design
  if (isMobile) {
    return (
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        sx={{
          px: 3,
          mb: isLast ? 0 : 6,
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        {/* Premium Glassmorphic Title Card */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Box
            sx={{
              background:
                "linear-gradient(145deg, rgba(255,253,251,0.95) 0%, rgba(253,248,243,0.9) 100%)",
              backdropFilter: "blur(25px)",
              borderRadius: 5,
              p: 4,
              border: "1px solid rgba(217,167,86,0.25)",
              boxShadow:
                "0 15px 50px rgba(60,31,14,0.12), 0 5px 20px rgba(217,167,86,0.1)",
              position: "relative",
              overflow: "hidden",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "3px",
                background:
                  "linear-gradient(90deg, transparent, #D9A756, transparent)",
              },
            }}
          >
            {/* Decorative Element */}
            <Box
              sx={{
                position: "absolute",
                top: -20,
                right: -20,
                width: 80,
                height: 80,
                background:
                  "radial-gradient(circle, rgba(217,167,86,0.15) 0%, transparent 70%)",
                pointerEvents: "none",
              }}
            />
            <Typography
              variant="h4"
              component="h2"
              sx={{
                fontWeight: 800,
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                background:
                  "linear-gradient(135deg, #4A2C17 0%, #6A3A1E 50%, #D9A756 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                mb: 2,
                letterSpacing: "-0.02em",
                fontSize: "1.9rem",
                position: "relative",
              }}
            >
              {title}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "#6A3A1E",
                fontStyle: "italic",
                fontWeight: 400,
                lineHeight: 1.7,
                fontSize: "0.95rem",
                opacity: 0.9,
              }}
            >
              {description}
            </Typography>
          </Box>
        </motion.div>

        {/* Enhanced Premium Image Container with swipe */}
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: 300,
            borderRadius: 5,
            overflow: "hidden",
            boxShadow:
              "0 20px 60px rgba(60,31,14,0.2), 0 8px 25px rgba(217,167,86,0.1)",
            border: "2px solid rgba(255,253,251,0.8)",
          }}
        >
          {images.map((src, idx) => (
            <motion.div
              key={idx}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              initial={{ opacity: 0 }}
              animate={{
                opacity: currentImageIndex === idx ? 1 : 0,
                scale: currentImageIndex === idx ? 1 : 1.05,
                zIndex: currentImageIndex === idx ? 1 : 0,
              }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                x,
              }}
            >
              <motion.img
                src={src}
                alt={`${title}-${idx}`}
                onContextMenu={(e: React.MouseEvent) => e.preventDefault()}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  userSelect: "none",
                  opacity: opacity.get(),
                }}
              />
              {/* Premium Gradient overlay */}
              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: "50%",
                  background:
                    "linear-gradient(to top, rgba(74,44,23,0.4), transparent)",
                  pointerEvents: "none",
                }}
              />
              {/* Top gradient */}
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "30%",
                  background:
                    "linear-gradient(to bottom, rgba(217,167,86,0.15), transparent)",
                  pointerEvents: "none",
                }}
              />
            </motion.div>
          ))}

          {/* Image Counter Badge */}
          <Box
            sx={{
              position: "absolute",
              bottom: 16,
              right: 16,
              background: "rgba(255,253,251,0.9)",
              backdropFilter: "blur(10px)",
              px: 2,
              py: 0.75,
              borderRadius: 3,
              border: "1px solid rgba(217,167,86,0.3)",
              boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
            }}
          >
            <Typography
              sx={{
                fontSize: "0.75rem",
                fontWeight: 700,
                color: "#4A2C17",
                fontFamily: '"Inter", sans-serif',
              }}
            >
              {currentImageIndex + 1} / {images.length}
            </Typography>
          </Box>
        </Box>

        {/* Enhanced premium pagination with progress rings - showing 5 dots */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 1.5,
            p: 2,
            background:
              "linear-gradient(145deg, rgba(255,253,251,0.9) 0%, rgba(253,248,243,0.85) 100%)",
            backdropFilter: "blur(15px)",
            borderRadius: 4,
            border: "1px solid rgba(217,167,86,0.2)",
            boxShadow: "0 8px 25px rgba(60,31,14,0.08)",
          }}
        >
          {(() => {
            // Calculate which 5 dots to show (sliding window)
            const totalDots = images.length;
            if (totalDots <= 5) {
              // Show all dots if 5 or fewer
              return images.map((_, idx) => idx);
            }

            // Show current + 2 on each side
            const visibleIndices: number[] = [];
            for (let i = -2; i <= 2; i++) {
              let index = currentImageIndex + i;
              // Wrap around
              if (index < 0) index += totalDots;
              if (index >= totalDots) index -= totalDots;
              visibleIndices.push(index);
            }
            return visibleIndices;
          })().map((idx) => (
            <Box
              key={idx}
              component={motion.div}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.85 }}
              onClick={() => setCurrentImageIndex(idx)}
              sx={{
                position: "relative",
                width: 32,
                height: 32,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* Animated SVG Progress Ring */}
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 32 32"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  transform: "rotate(-90deg)",
                }}
              >
                {/* Background circle */}
                <circle
                  cx="16"
                  cy="16"
                  r="13"
                  fill="none"
                  stroke="rgba(217, 167, 86, 0.2)"
                  strokeWidth="1.5"
                />
                {/* Progress circle - animates when active */}
                <motion.circle
                  cx="16"
                  cy="16"
                  r="13"
                  fill="none"
                  stroke={idx === currentImageIndex ? "#D9A756" : "rgba(217, 167, 86, 0.3)"}
                  strokeWidth="2"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{
                    pathLength: idx === currentImageIndex ? 1 : 0,
                    opacity: idx === currentImageIndex ? 1 : 0.5,
                  }}
                  transition={{
                    pathLength: { duration: 2.5, ease: "linear" },
                    opacity: { duration: 0.3 },
                  }}
                  strokeDasharray="82"
                />
              </svg>
              {/* Inner dot */}
              <Box
                component={motion.div}
                animate={{
                  scale: idx === currentImageIndex ? 1 : 0.6,
                  backgroundColor:
                    idx === currentImageIndex ? "#D9A756" : "rgba(217, 167, 86, 0.5)",
                }}
                transition={{ duration: 0.3 }}
                sx={{
                  width: 9,
                  height: 9,
                  borderRadius: "50%",
                  boxShadow:
                    idx === currentImageIndex
                      ? "0 0 15px rgba(217, 167, 86, 0.6), 0 0 30px rgba(217, 167, 86, 0.3)"
                      : "none",
                }}
              />
            </Box>
          ))}
        </Box>
      </Box>
    );
  }

  // Enhanced Premium Desktop Layout with parallax
  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay: rowIndex * 0.1 }}
      sx={{
        position: "relative",
        overflow: "hidden",
        width: "100vw",
        // Reduced bottom margin so gallery sits closer to previous section
        mb: isLast ? 0 : 6,
        display: "flex",
        flexDirection: "column",
        gap: 5,
      }}
    >
      {/* Enhanced Decorative background element */}
      <Box
        component={motion.div}
        initial={{ opacity: 0, scale: 0.6 }}
        whileInView={{ opacity: 0.2, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, delay: rowIndex * 0.1 }}
        sx={{
          position: "absolute",
          top: "50%",
          left: rowIndex % 2 === 0 ? "-8%" : "auto",
          right: rowIndex % 2 !== 0 ? "-8%" : "auto",
          transform: "translateY(-50%)",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${rowIndex % 2 === 0 ? "#D9A756" : "#B08030"
            } 0%, transparent 60%)`,
          pointerEvents: "none",
          zIndex: 0,
          filter: "blur(60px)",
        }}
      />

      {/* Secondary decorative circles */}
      <Box
        component={motion.div}
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        sx={{
          position: "absolute",
          top: "20%",
          left: rowIndex % 2 === 0 ? "5%" : "auto",
          right: rowIndex % 2 !== 0 ? "5%" : "auto",
          width: 200,
          height: 200,
          border: "1px solid rgba(217,167,86,0.15)",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Premium Title Section with glassmorphism */}
      <Box
        ref={titleRef}
        sx={{
          px: { xs: 3, md: 8, lg: 14 },
          maxWidth: "1400px",
          mx: "auto",
          width: "100%",
          textAlign: rowIndex % 2 !== 0 ? "right" : "left",
          position: "relative",
          zIndex: 1,
          opacity: 0,
          perspective: "1000px",
        }}
      >
        <Box
          sx={{
            display: "inline-block",
            background:
              "linear-gradient(145deg, rgba(255,253,251,0.95) 0%, rgba(253,248,243,0.9) 100%)",
            backdropFilter: "blur(25px)",
            borderRadius: 5,
            p: 5,
            border: "1px solid rgba(217,167,86,0.25)",
            boxShadow:
              "0 20px 60px rgba(60,31,14,0.12), 0 8px 25px rgba(217,167,86,0.08)",
            position: "relative",
            overflow: "hidden",
            maxWidth: "650px",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: rowIndex % 2 === 0 ? 0 : "auto",
              right: rowIndex % 2 !== 0 ? 0 : "auto",
              width: rowIndex % 2 === 0 ? "4px" : "4px",
              height: "100%",
              background: "linear-gradient(180deg, #D9A756, #B08030, #D9A756)",
              borderRadius: rowIndex % 2 === 0 ? "4px 0 0 4px" : "0 4px 4px 0",
            },
            "&::after": {
              content: '""',
              position: "absolute",
              bottom: -50,
              right: rowIndex % 2 === 0 ? -50 : "auto",
              left: rowIndex % 2 !== 0 ? -50 : "auto",
              width: 150,
              height: 150,
              background:
                "radial-gradient(circle, rgba(217,167,86,0.1) 0%, transparent 70%)",
              pointerEvents: "none",
            },
          }}
        >
          {/* Decorative Number */}
          <Typography
            sx={{
              position: "absolute",
              top: 10,
              left: rowIndex % 2 === 0 ? "auto" : 20,
              right: rowIndex % 2 === 0 ? 20 : "auto",
              fontSize: "5rem",
              fontWeight: 900,
              fontFamily: '"Cormorant Garamond", Georgia, serif',
              color: "rgba(217,167,86,0.08)",
              lineHeight: 1,
              pointerEvents: "none",
            }}
          >
            {/* 0{rowIndex + 1} */}
          </Typography>

          <Typography
            variant="h2"
            component="h2"
            sx={{
              fontWeight: 800,
              fontFamily: '"Cormorant Garamond", Georgia, serif',
              background:
                "linear-gradient(135deg, #4A2C17 0%, #6A3A1E 50%, #D9A756 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              mb: 2.5,
              letterSpacing: "-0.03em",
              fontSize: { md: "2.8rem", lg: "3.2rem" },
              lineHeight: 1.1,
              position: "relative",
            }}
          >
            {title}
          </Typography>

          {/* Decorative Divider */}
          <Box
            sx={{
              width: 60,
              height: 3,
              background: "linear-gradient(90deg, #D9A756, transparent)",
              borderRadius: 2,
              mb: 2.5,
              ml: rowIndex % 2 !== 0 ? "auto" : 0,
            }}
          />

          <Typography
            variant="h6"
            sx={{
              color: "#6A3A1E",
              maxWidth: "550px",
              fontStyle: "italic",
              fontWeight: 400,
              lineHeight: 1.8,
              ml: rowIndex % 2 !== 0 ? "auto" : 0,
              fontSize: "1.1rem",
              opacity: 0.9,
            }}
          >
            {description}
          </Typography>
        </Box>
      </Box>

      {/* Premium Carousel with depth and parallax */}
      <Box sx={{ position: "relative", zIndex: 1 }}>
        <motion.div
          ref={rowRef}
          style={{
            display: "flex",
            gap: 40,
            width: "max-content",
            paddingLeft: 32,
            paddingRight: 32,
          }}
          animate={{
            x: rowIndex % 2 === 0 ? [-width, 0] : [0, -width],
          }}
          transition={{
            repeat: Infinity,
            repeatType: "loop",
            duration: 55,
            ease: "linear",
          }}
        >
          {loopImages.map((src, idx) => (
            <motion.div
              key={idx}
              whileHover={{
                scale: 1.08,
                y: -30,
                rotateY: 8,
                rotateX: -4,
                rotateZ: idx % 2 === 0 ? 2 : -2,
              }}
              transition={{
                type: "spring",
                stiffness: 350,
                damping: 20,
              }}
              style={{
                flexShrink: 0,
                perspective: 2000,
              }}
            >
              {/* Animated glow effect behind card */}
              <Box
                component={motion.div}
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: idx * 0.3,
                }}
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "110%",
                  height: "110%",
                  background:
                    "radial-gradient(circle, rgba(217, 167, 86, 0.4) 0%, rgba(217, 167, 86, 0.2) 40%, transparent 70%)",
                  borderRadius: "32px",
                  filter: "blur(40px)",
                  zIndex: -1,
                  pointerEvents: "none",
                }}
              />

              {/* Thick gradient border wrapper with animated glow */}
              <Box
                sx={{
                  position: "relative",
                  width: { sm: "42vw", md: "30vw", lg: "25vw" },
                  height: { sm: 320, md: 400, lg: 480 },
                  borderRadius: "32px",
                  padding: "6px",
                  background:
                    "linear-gradient(145deg, #D9A756 0%, #B08030 25%, #6A3A1E 50%, #B08030 75%, #D9A756 100%)",
                  backgroundSize: "200% 200%",
                  animation: "gradientShift 6s ease infinite",
                  boxShadow:
                    "0 35px 90px rgba(60,31,14,0.35), 0 20px 50px rgba(217,167,86,0.25), 0 0 60px rgba(217,167,86,0.15), inset 0 0 0 1px rgba(255, 255, 255, 0.2)",
                  transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    boxShadow:
                      "0 50px 120px rgba(60,31,14,0.45), 0 30px 70px rgba(217,167,86,0.35), 0 0 100px rgba(217,167,86,0.3), inset 0 0 0 1px rgba(255, 255, 255, 0.4)",
                    transform: "translateY(-5px)",
                  },
                  "@keyframes gradientShift": {
                    "0%, 100%": { backgroundPosition: "0% 50%" },
                    "50%": { backgroundPosition: "100% 50%" },
                  },
                }}
              >
                {/* Inner glow ring */}
                <Box
                  sx={{
                    position: "absolute",
                    inset: "6px",
                    borderRadius: "26px",
                    background:
                      "linear-gradient(145deg, rgba(255,253,251,0.3) 0%, transparent 50%, rgba(217,167,86,0.2) 100%)",
                    pointerEvents: "none",
                    zIndex: 10,
                  }}
                />

                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    height: "100%",
                    borderRadius: "26px",
                    overflow: "hidden",
                    backgroundColor: "#0a0a0a",
                    // Dramatic gradient overlays
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background:
                        "linear-gradient(135deg, rgba(217,167,86,0.25) 0%, transparent 25%, rgba(74,44,23,0.2) 100%)",
                      pointerEvents: "none",
                      zIndex: 1,
                      mixBlendMode: "overlay",
                    },
                    // Animated light sweep
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      top: "-50%",
                      left: "-50%",
                      width: "200%",
                      height: "200%",
                      background:
                        "linear-gradient(45deg, transparent 30%, rgba(255,253,251,0.3) 50%, transparent 70%)",
                      animation: "lightSweep 8s ease-in-out infinite",
                      pointerEvents: "none",
                      zIndex: 2,
                    },
                    "@keyframes lightSweep": {
                      "0%, 100%": { transform: "translate(-100%, -100%) rotate(45deg)" },
                      "50%": { transform: "translate(100%, 100%) rotate(45deg)" },
                    },
                  }}
                >
                  <Box
                    component="img"
                    src={src}
                    alt={`Gallery-${idx}`}
                    onContextMenu={(e: React.MouseEvent) => e.preventDefault()}
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      userSelect: "none",
                      transition: "transform 0.9s cubic-bezier(0.4, 0, 0.2, 1), filter 0.6s ease",
                      filter: "brightness(0.95) contrast(1.05)",
                      "&:hover": {
                        transform: "scale(1.15) rotate(1deg)",
                        filter: "brightness(1.05) contrast(1.1)",
                      },
                    }}
                  />

                  {/* Corner accent highlights */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100px",
                      height: "100px",
                      background:
                        "radial-gradient(circle at top left, rgba(217,167,86,0.4) 0%, transparent 60%)",
                      pointerEvents: "none",
                      zIndex: 3,
                    }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      width: "120px",
                      height: "120px",
                      background:
                        "radial-gradient(circle at bottom right, rgba(217,167,86,0.3) 0%, transparent 60%)",
                      pointerEvents: "none",
                      zIndex: 3,
                    }}
                  />

                  {/* Bottom gradient for depth */}
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: "40%",
                      background:
                        "linear-gradient(to top, rgba(60,31,14,0.7) 0%, rgba(60,31,14,0.3) 50%, transparent 100%)",
                      pointerEvents: "none",
                      zIndex: 4,
                    }}
                  />
                </Box>
              </Box>
            </motion.div>
          ))}
        </motion.div>
      </Box>
    </Box>
  );
}

export default function Gallery() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [activeRowIndex, setActiveRowIndex] = useState(0);
  const [isGalleryComplete, setIsGalleryComplete] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isInView = useInView(containerRef, { once: false, margin: "-20%" });
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-50px" });

  // GSAP animation for header
  useEffect(() => {
    if (isHeaderInView && headerRef.current) {
      gsap.fromTo(
        headerRef.current.querySelectorAll(".gallery-header-element"),
        {
          opacity: 0,
          y: 40,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
        }
      );
    }
  }, [isHeaderInView]);

  // Fetch story categories with their stories from backend
  const { data: categoriesData, loading } = useApiWithCache<StoryCategory[]>(
    "story-categories",
    () => storiesService.getAllCategories()
  );

  // Transform backend data to gallery rows format
  const galleryRows: GalleryRowData[] = useMemo(() => {
    if (!categoriesData || categoriesData.length === 0) return [];

    return categoriesData
      .filter((category) => category.isActive)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((category) => {
        const images = (category.stories || [])
          .filter(
            (story) =>
              story.isActive && story.imageUrls && story.imageUrls.length > 0
          )
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .flatMap((story) =>
            story.imageUrls.map((url) => getImageUrl(url) || "").filter(Boolean)
          );

        return {
          title: category.name,
          description: category.description || "",
          images: images.length > 0 ? images : [],
        };
      })
      .filter((row) => row.images.length > 0);
  }, [categoriesData]);

  // Lock scroll on mobile when gallery is active
  useEffect(() => {
    if (isMobile && isInView && !isGalleryComplete && galleryRows.length > 0) {
      containerRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
      document.body.style.top = `-${window.scrollY}px`;

      return () => {
        const scrollY = document.body.style.top;
        document.body.style.overflow = "";
        document.body.style.position = "";
        document.body.style.width = "";
        document.body.style.top = "";
        window.scrollTo(0, parseInt(scrollY || "0") * -1);
      };
    }
  }, [isMobile, isInView, isGalleryComplete, galleryRows.length]);

  // Handle row cycle complete
  const handleRowComplete = () => {
    if (activeRowIndex < galleryRows.length - 1) {
      setActiveRowIndex((prev) => prev + 1);
    } else {
      setIsGalleryComplete(true);
    }
  };

  if (loading || galleryRows.length === 0) {
    return null;
  }

  return (
    <Box
      ref={containerRef}
      sx={{
        width: "100vw",
        overflowX: "hidden",
        // reduced top padding so header sits closer to gallery rows
        pt: { xs: 8, md: 10 },
        pb: { xs: 6, md: 0 },
        display: "flex",
        flexDirection: "column",
        gap: { xs: 3, md: 4 },
        background:
          "linear-gradient(180deg, #FDF8F3 0%, #F5EBE0 35%, #E8D5C4 65%, #F5EBE0 85%, #FDF8F3 100%)",
        minHeight: "auto",
        position: "relative",
      }}
    >
      {/* CSS Animated Background Shapes */}
      <style>
        {`
          @keyframes floatGallery {
            0%, 100% {
              transform: translate(0, 0) rotate(0deg);
            }
            33% {
              transform: translate(40px, -40px) rotate(120deg);
            }
            66% {
              transform: translate(-30px, 30px) rotate(240deg);
            }
          }

          .gallery-shape {
            animation: floatGallery 30s ease-in-out infinite;
            will-change: transform;
          }

          .gallery-shape:nth-child(2n) {
            animation-duration: 35s;
            animation-delay: -8s;
          }

          .gallery-shape:nth-child(3n) {
            animation-duration: 40s;
            animation-delay: -16s;
          }
        `}
      </style>

      {/* Popup animated background (scoped to gallery so it stays behind content) */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
        }}
      >
        <PopupBackground scoped />
      </Box>

      {/* Premium Section Header */}
      <Box
        ref={headerRef}
        sx={{
          textAlign: "center",
          // tighten spacing between header and the following container
          mb: { xs: 2, md: 1 },
          px: 3,
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Decorative Top Element */}
        <Box
          className="gallery-header-element"
          sx={{
            width: 100,
            height: 3,
            background:
              "linear-gradient(90deg, transparent, #D9A756, transparent)",
            mx: "auto",
            mb: 3,
            position: "relative",
            opacity: 1,
            transition: "opacity 0.7s ease, transform 0.7s ease",
            "&::before, &::after": {
              content: '""',
              position: "absolute",
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              background: "#D9A756",
              top: "50%",
              transform: "translateY(-50%)",
              boxShadow: "0 0 15px rgba(217,167,86,0.5)",
            },
            "&::before": { left: -6 },
            "&::after": { right: -6 },
          }}
        />

        <Typography
          className="gallery-header-element"
          variant="overline"
          sx={{
            color: "#D9A756",
            letterSpacing: "0.35em",
            fontSize: { xs: "0.75rem", md: "0.85rem" },
            fontFamily: '"Inter", sans-serif',
            fontWeight: 600,
            mb: 2,
            display: "block",
            textTransform: "uppercase",
            opacity: 1,
            transition: "opacity 0.7s ease, transform 0.7s ease",
            "&::before, &::after": {
              content: '"◆"',
              position: "relative",
              mx: 2,
              opacity: 0.5,
              fontSize: "0.6em",
            },
          }}
        >
          Our Story
        </Typography>

        <Typography
          className="gallery-header-element"
          variant="h2"
          sx={{
            fontFamily: '"Cormorant Garamond", Georgia, serif',
            fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4.5rem" },
            fontWeight: 700,
            color: "#4A2C17",
            mb: 3,
            letterSpacing: "-0.025em",
            lineHeight: 1.1,
            background: "linear-gradient(180deg, #4A2C17 0%, #6A3A1E 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            textShadow: "none",
            opacity: 1,
            transition: "opacity 0.7s ease, transform 0.7s ease",
          }}
        >
          A Glimpse Inside
        </Typography>

        <Typography
          className="gallery-header-element"
          sx={{
            fontFamily: '"Inter", sans-serif',
            fontSize: { xs: "1rem", md: "1.1rem" },
            color: "#6A3A1E",
            maxWidth: { xs: 600, md: 900, lg: 1100 },
            mx: "auto",
            lineHeight: 1.85,
            letterSpacing: "0.01em",
            fontWeight: 400,
            opacity: 1,
            transition: "opacity 0.7s ease, transform 0.7s ease",
            textAlign: "justify",
            px: { xs: 2, sm: 3, md: 4 },
          }}
        >
          Nestled in the heart of Whitby at 15 Baldwin Street, Brooklin Pub &
          Grill has been a cornerstone of the community, bringing people
          together over exceptional food and drinks. Our commitment to quality
          and hospitality has made us a favorite destination for locals and
          visitors alike. We pride ourselves on creating a warm, welcoming
          atmosphere where families can enjoy a meal together, friends can catch
          up over drinks, and everyone feels like they're part of our extended
          family. Our menu features both classic pub favorites and innovative
          dishes that celebrate the best of Canadian cuisine. At Brooklin Pub &
          Grill, we're more than just a restaurant – we're a gathering place
          where memories are made, celebrations happen, and the community comes
          together.
        </Typography>

        {/* Bottom Decorative Divider */}
        <Box
          className="gallery-header-element"
          sx={{
            width: 200,
            height: 1,
            background:
              "linear-gradient(90deg, transparent, rgba(217,167,86,0.4), transparent)",
            mx: "auto",
            mt: 4,
            opacity: 1,
            transition: "opacity 0.7s ease, transform 0.7s ease",
          }}
        />
      </Box>

      {/* Gallery Rows */}
      <Box sx={{ position: "relative", zIndex: 1 }}>
        {galleryRows.map((row, rowIndex) => (
          <GalleryRow
            key={rowIndex}
            images={row.images}
            title={row.title}
            description={row.description}
            rowIndex={rowIndex}
            isActive={true}
            isLast={rowIndex === galleryRows.length - 1}
            onCycleComplete={
              isMobile && rowIndex === activeRowIndex
                ? handleRowComplete
                : undefined
            }
          />
        ))}
      </Box>

      {/* Enhanced premium progress indicator for mobile */}
    </Box>
  );
}
