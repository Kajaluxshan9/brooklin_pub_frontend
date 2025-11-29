import { useState, useRef, useLayoutEffect, useEffect, useMemo } from "react";
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import { motion, useInView } from "framer-motion";
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
      }, 2000); // Faster cycling - 2 seconds per image
      return () => clearInterval(interval);
    }
  }, [isMobile, images.length, isActive]);

  // Signal when cycle is complete
  useEffect(() => {
    if (cycleCount >= 1 && onCycleComplete) {
      onCycleComplete();
    }
  }, [cycleCount, onCycleComplete]);

  // Mobile Layout
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
          gap: 2,
        }}
      >
        {/* Title and Description */}
        <Box>
          <Typography
            variant="h4"
            component="h2"
            sx={{
              fontWeight: 800,
              fontFamily: '"Cormorant Garamond", Georgia, serif',
              color: "#3C1F0E",
              mb: 1,
              letterSpacing: "-0.02em",
              fontSize: "1.5rem",
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
              lineHeight: 1.5,
              fontSize: "0.9rem",
            }}
          >
            {description}
          </Typography>
        </Box>

        {/* Single Image Container with auto-cycling */}
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: 220,
            borderRadius: 3,
            overflow: "hidden",
            boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
          }}
        >
          {images.map((src, idx) => (
            <motion.img
              key={idx}
              src={src}
              alt={`${title}-${idx}`}
              onContextMenu={(e: React.MouseEvent) => e.preventDefault()}
              initial={{ opacity: 0 }}
              animate={{
                opacity: currentImageIndex === idx ? 1 : 0,
                scale: currentImageIndex === idx ? 1 : 1.1,
              }}
              transition={{ duration: 0.5 }}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                userSelect: "none",
              }}
            />
          ))}
        </Box>

        {/* Dots indicator - positioned at bottom center */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 1,
          }}
        >
          {images.map((_, idx) => (
            <Box
              key={idx}
              component={motion.div}
              animate={{
                scale: currentImageIndex === idx ? 1.3 : 1,
                backgroundColor:
                  currentImageIndex === idx
                    ? "#D9A756"
                    : "rgba(217,167,86,0.4)",
              }}
              transition={{ duration: 0.3 }}
              onClick={() => setCurrentImageIndex(idx)}
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                cursor: "pointer",
              }}
            />
          ))}
        </Box>
      </Box>
    );
  }

  // Desktop Layout (original scrolling carousel)
  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, delay: rowIndex * 0.1 }}
      sx={{
        position: "relative",
        overflow: "hidden",
        width: "100vw",
        mb: 8,
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      <Box
        sx={{
          px: { xs: 3, md: 8, lg: 12 },
          maxWidth: "1400px",
          mx: "auto",
          width: "100%",
          textAlign: rowIndex % 2 !== 0 ? "right" : "left",
        }}
      >
        <Typography
          variant="h3"
          component="h2"
          sx={{
            fontWeight: 800,
            fontFamily: '"Cormorant Garamond", Georgia, serif',
            color: "#3C1F0E",
            mb: 1.5,
            letterSpacing: "-0.02em",
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: "#5D4037",
            maxWidth: "600px",
            fontStyle: "italic",
            fontWeight: 400,
            lineHeight: 1.6,
            ml: rowIndex % 2 !== 0 ? "auto" : 0,
          }}
        >
          {description}
        </Typography>
      </Box>

      <motion.div
        ref={rowRef}
        style={{
          display: "flex",
          gap: 24,
          width: "max-content",
        }}
        animate={{
          x: rowIndex % 2 === 0 ? [-width, 0] : [0, -width],
        }}
        transition={{
          repeat: Infinity,
          repeatType: "loop",
          duration: 45,
          ease: "linear",
        }}
      >
        {loopImages.map((src, idx) => (
          <Box
            key={idx}
            component={motion.img}
            src={src}
            alt={`Gallery-${idx}`}
            onContextMenu={(e: React.MouseEvent) => e.preventDefault()}
            whileHover={{ scale: 1.03, y: -5 }}
            sx={{
              flexShrink: 0,
              width: { sm: "45vw", md: "30vw", lg: "25vw" },
              height: { sm: 280, md: 350, lg: 400 },
              objectFit: "cover",
              borderRadius: 3,
              boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
              userSelect: "none",
              pointerEvents: "auto",
            }}
          />
        ))}
      </motion.div>
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
        // Get images from stories in this category
        const images = (category.stories || [])
          .filter((story) => story.isActive && story.imageUrls && story.imageUrls.length > 0)
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map((story) => getImageUrl(story.imageUrls[0]) || "");

        return {
          title: category.name,
          description: category.description || "",
          images: images.length > 0 ? images : [], // No fallback - empty if no images
        };
      })
      .filter((row) => row.images.length > 0); // Only show rows that have images
  }, [categoriesData]);

  // Lock scroll on mobile when gallery is active
  useEffect(() => {
    if (isMobile && isInView && !isGalleryComplete && galleryRows.length > 0) {
      // Scroll the gallery into full view
      containerRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      // Lock body scroll
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
      // All rows complete, unlock scrolling
      setIsGalleryComplete(true);
    }
  };

  // Don't render if loading or no data
  if (loading) {
    return (
      <Box
        sx={{
          width: "100vw",
          py: { xs: 6, md: 10 },
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#F3E3CC",
          minHeight: 200,
        }}
      >
        <Typography
          sx={{
            fontFamily: '"Cormorant Garamond", Georgia, serif',
            color: "#6A3A1E",
            fontSize: "1.2rem",
          }}
        >
          Loading gallery...
        </Typography>
      </Box>
    );
  }

  // Don't render if no gallery rows with images
  if (galleryRows.length === 0) {
    return null;
  }

  return (
    <Box
      ref={containerRef}
      sx={{
        width: "100vw",
        overflowX: "hidden",
        py: { xs: 6, md: 10 },
        display: "flex",
        flexDirection: "column",
        gap: { xs: 2, md: 6 },
        backgroundColor: "#F3E3CC",
        minHeight: isMobile ? "100vh" : "auto",
      }}
    >
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

      {/* Progress indicator for mobile */}
      {isMobile && !isGalleryComplete && galleryRows.length > 1 && (
        <Box
          sx={{
            position: "fixed",
            bottom: 100,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: 1,
            zIndex: 1000,
          }}
        >
          {galleryRows.map((_, idx) => (
            <Box
              key={idx}
              component={motion.div}
              animate={{
                width: idx === activeRowIndex ? 24 : 8,
                backgroundColor:
                  idx <= activeRowIndex ? "#D9A756" : "rgba(217,167,86,0.35)",
              }}
              transition={{ duration: 0.3 }}
              sx={{
                height: 8,
                borderRadius: 4,
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}
