import { useState, useRef, useLayoutEffect, useEffect, useMemo } from "react";
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import { motion, useInView, useMotionValue, useTransform } from "framer-motion";
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
}

function GalleryRow({
  images,
  title,
  description,
  rowIndex,
  onCycleComplete,
  isActive = true,
}: GalleryRowProps) {
  const loopImages = [...images, ...images, ...images, ...images];
  const rowRef = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);
  const [dragStart, setDragStart] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-100, 0, 100], [0.5, 1, 0.5]);

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
    } else if (info.offset.x < -threshold && currentImageIndex < images.length - 1) {
      setCurrentImageIndex((prev) => prev + 1);
    }
  };

  // Mobile Layout with enhanced design
  if (isMobile) {
    return (
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 50 }}
        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0.3, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        sx={{
          px: 3,
          mb: 6,
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        {/* Glassmorphic Title Card */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={isActive ? { scale: 1, opacity: 1 } : { scale: 0.9, opacity: 0.3 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Box
            sx={{
              background: "rgba(255, 255, 255, 0.7)",
              backdropFilter: "blur(20px)",
              borderRadius: 4,
              p: 3,
              border: "1px solid rgba(217, 167, 86, 0.2)",
              boxShadow: "0 8px 32px rgba(60, 31, 14, 0.1)",
            }}
          >
            <Typography
              variant="h4"
              component="h2"
              sx={{
                fontWeight: 800,
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                background: "linear-gradient(135deg, #3C1F0E 0%, #6A3A1E 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 1.5,
                letterSpacing: "-0.02em",
                fontSize: "1.75rem",
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
                lineHeight: 1.6,
                fontSize: "0.95rem",
              }}
            >
              {description}
            </Typography>
          </Box>
        </motion.div>

        {/* Enhanced Image Container with swipe */}
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: 280,
            borderRadius: 4,
            overflow: "hidden",
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
              {/* Gradient overlay */}
              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: "40%",
                  background: "linear-gradient(to top, rgba(0,0,0,0.3), transparent)",
                  pointerEvents: "none",
                }}
              />
            </motion.div>
          ))}
        </Box>

        {/* Enhanced dots indicator with glassmorphism */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 1.5,
            p: 2,
            background: "rgba(255, 255, 255, 0.5)",
            backdropFilter: "blur(10px)",
            borderRadius: 3,
            border: "1px solid rgba(217, 167, 86, 0.15)",
          }}
        >
          {images.map((_, idx) => (
            <Box
              key={idx}
              component={motion.div}
              animate={{
                scale: currentImageIndex === idx ? 1.4 : 1,
                backgroundColor: currentImageIndex === idx ? "#D9A756" : "rgba(217,167,86,0.3)",
              }}
              whileHover={{ scale: 1.2 }}
              transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
              onClick={() => setCurrentImageIndex(idx)}
              sx={{
                width: currentImageIndex === idx ? 10 : 8,
                height: currentImageIndex === idx ? 10 : 8,
                borderRadius: "50%",
                cursor: "pointer",
                boxShadow: currentImageIndex === idx ? "0 2px 8px rgba(217,167,86,0.4)" : "none",
              }}
            />
          ))}
        </Box>
      </Box>
    );
  }

  // Enhanced Desktop Layout with parallax
  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay: rowIndex * 0.15, ease: "easeOut" }}
      sx={{
        position: "relative",
        overflow: "hidden",
        width: "100vw",
        mb: 12,
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      {/* Decorative background element */}
      <Box
        component={motion.div}
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 0.15, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, delay: rowIndex * 0.1 }}
        sx={{
          position: "absolute",
          top: "50%",
          left: rowIndex % 2 === 0 ? "-10%" : "auto",
          right: rowIndex % 2 !== 0 ? "-10%" : "auto",
          transform: "translateY(-50%)",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${rowIndex % 2 === 0 ? "#D9A756" : "#B08030"} 0%, transparent 70%)`,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Enhanced Title Section with glassmorphism */}
      <Box
        sx={{
          px: { xs: 3, md: 8, lg: 12 },
          maxWidth: "1400px",
          mx: "auto",
          width: "100%",
          textAlign: rowIndex % 2 !== 0 ? "right" : "left",
          position: "relative",
          zIndex: 1,
        }}
      >
        <motion.div
          initial={{ opacity: 0, x: rowIndex % 2 === 0 ? -50 : 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <Box
            sx={{
              display: "inline-block",
              background: "rgba(255, 255, 255, 0.8)",
              backdropFilter: "blur(20px)",
              borderRadius: 4,
              p: 4,
              border: "1px solid rgba(217, 167, 86, 0.25)",
              boxShadow: "0 8px 32px rgba(60, 31, 14, 0.12)",
              position: "relative",
              "&::before": {
                content: '""',
                position: "absolute",
                top: -2,
                left: -2,
                right: -2,
                bottom: -2,
                background: "linear-gradient(135deg, #D9A756, #B08030)",
                borderRadius: 4,
                opacity: 0,
                transition: "opacity 0.3s ease",
                zIndex: -1,
              },
              "&:hover::before": {
                opacity: 0.1,
              },
            }}
          >
            <Typography
              variant="h2"
              component="h2"
              sx={{
                fontWeight: 900,
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                background: "linear-gradient(135deg, #3C1F0E 0%, #6A3A1E 50%, #D9A756 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 2,
                letterSpacing: "-0.03em",
                fontSize: { md: "2.5rem", lg: "3rem" },
              }}
            >
              {title}
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: "#6A3A1E",
                maxWidth: "600px",
                fontStyle: "italic",
                fontWeight: 400,
                lineHeight: 1.7,
                ml: rowIndex % 2 !== 0 ? "auto" : 0,
                fontSize: "1.1rem",
              }}
            >
              {description}
            </Typography>
          </Box>
        </motion.div>
      </Box>

      {/* Enhanced Carousel with depth and parallax */}
      <Box sx={{ position: "relative", zIndex: 1 }}>
        <motion.div
          ref={rowRef}
          style={{
            display: "flex",
            gap: 32,
            width: "max-content",
            paddingLeft: 24,
            paddingRight: 24,
          }}
          animate={{
            x: rowIndex % 2 === 0 ? [-width, 0] : [0, -width],
          }}
          transition={{
            repeat: Infinity,
            repeatType: "loop",
            duration: 50,
            ease: "linear",
          }}
        >
          {loopImages.map((src, idx) => (
            <motion.div
              key={idx}
              whileHover={{
                scale: 1.05,
                y: -12,
                rotateY: 5,
                rotateX: -2,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
              }}
              style={{
                flexShrink: 0,
                perspective: 1000,
              }}
            >
              <Box
                sx={{
                  position: "relative",
                  width: { sm: "45vw", md: "32vw", lg: "26vw" },
                  height: { sm: 300, md: 380, lg: 450 },
                  borderRadius: 4,
                  overflow: "hidden",
                  // boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
                  border: "2px solid rgba(255, 255, 255, 0.8)",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: "linear-gradient(135deg, rgba(217,167,86,0.1) 0%, transparent 50%)",
                    pointerEvents: "none",
                    zIndex: 1,
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
                    transition: "transform 0.6s ease",
                    "&:hover": {
                      transform: "scale(1.08)",
                    },
                  }}
                />
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
  const [activeRowIndex, setActiveRowIndex] = useState(0);
  const [isGalleryComplete, setIsGalleryComplete] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isInView = useInView(containerRef, { once: false, margin: "-20%" });

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

  // Loading state with premium design
  if (loading) {
    return (
      <Box
        sx={{
          width: "100vw",
          py: { xs: 8, md: 12 },
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #FDF8F3 0%, #F5EBE0 50%, #E8D5C4 100%)",
          minHeight: 300,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Animated loading indicator */}
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <Box
            sx={{
              width: 60,
              height: 60,
              border: "4px solid rgba(217, 167, 86, 0.2)",
              borderTop: "4px solid #D9A756",
              borderRadius: "50%",
            }}
          />
        </motion.div>
      </Box>
    );
  }

  if (galleryRows.length === 0) {
    return null;
  }

  return (
    <Box
      ref={containerRef}
      sx={{
        width: "100vw",
        overflowX: "hidden",
        py: { xs: 8, md: 12 },
        display: "flex",
        flexDirection: "column",
        gap: { xs: 3, md: 8 },
        background: "linear-gradient(135deg, #FDF8F3 0%, #F5EBE0 50%, #E8D5C4 100%)",
        minHeight: isMobile ? "100vh" : "auto",
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

      {/* Animated geometric background */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        {[...Array(10)].map((_, i) => (
          <Box
            key={i}
            className="gallery-shape"
            sx={{
              position: "absolute",
              width: i % 3 === 0 ? 120 : i % 3 === 1 ? 80 : 60,
              height: i % 3 === 0 ? 120 : i % 3 === 1 ? 80 : 60,
              borderRadius: i % 2 === 0 ? "50%" : "20%",
              border: `2px solid ${i % 2 === 0 ? "#D9A756" : "#B08030"}`,
              background: i % 3 === 0 ? `${i % 2 === 0 ? "#D9A756" : "#B08030"}15` : "transparent",
              left: `${(i * 27 + 8) % 85}%`,
              top: `${(i * 19 + 10) % 80}%`,
              opacity: 0.08,
            }}
          />
        ))}
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
            isActive={isMobile ? rowIndex === activeRowIndex : true}
            onCycleComplete={
              isMobile && rowIndex === activeRowIndex
                ? handleRowComplete
                : undefined
            }
          />
        ))}
      </Box>

      {/* Enhanced progress indicator for mobile */}
      {isMobile && !isGalleryComplete && galleryRows.length > 1 && (
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          sx={{
            position: "fixed",
            bottom: 100,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: 1.5,
            zIndex: 1000,
            background: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(20px)",
            p: 2,
            borderRadius: 4,
            border: "1px solid rgba(217, 167, 86, 0.3)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
          }}
        >
          {galleryRows.map((_, idx) => (
            <Box
              key={idx}
              component={motion.div}
              animate={{
                width: idx === activeRowIndex ? 32 : 10,
                backgroundColor:
                  idx <= activeRowIndex ? "#D9A756" : "rgba(217,167,86,0.25)",
              }}
              transition={{ duration: 0.4, type: "spring", stiffness: 300 }}
              sx={{
                height: 10,
                borderRadius: 5,
                boxShadow: idx === activeRowIndex ? "0 2px 8px rgba(217,167,86,0.4)" : "none",
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}
