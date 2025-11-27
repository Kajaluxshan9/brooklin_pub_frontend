import { useState, useRef, useLayoutEffect } from "react";
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import { motion } from "framer-motion";

const galleryRows = [
  {
    title: "Culinary Masterpieces",
    description: "Experience the finest flavors crafted with passion, where every dish tells a story of tradition and innovation.",
    images: [
      "https://i.pinimg.com/736x/6b/3a/c2/6b3ac22af731ea09354668e6fc51eeb8.jpg",
      "https://source.unsplash.com/400x300/?pizza",
      "https://source.unsplash.com/400x300/?salad",
    ]
  },
  {
    title: "Sweet Indulgences",
    description: "Treat yourself to our exquisite selection of desserts and beverages, perfect for those sweet moments.",
    images: [
      "https://source.unsplash.com/400x300/?dessert",
      "https://source.unsplash.com/400x300/?drink",
      "https://source.unsplash.com/400x300/?coffee",
    ]
  },
  {
    title: "Savory Delights",
    description: "Hearty meals that bring comfort and joy to your table, prepared with the freshest ingredients.",
    images: [
      "https://source.unsplash.com/400x300/?burger",
      "https://source.unsplash.com/400x300/?pasta",
      "https://source.unsplash.com/400x300/?steak",
    ]
  },
  {
    title: "Ambiance & Spirits",
    description: "Relax in our cozy atmosphere with a curated wine list and signature cocktails designed to elevate your evening.",
    images: [
      "https://source.unsplash.com/400x300/?soup",
      "https://source.unsplash.com/400x300/?wine",
      "https://source.unsplash.com/400x300/?restaurant",
    ]
  },
];

interface GalleryRowProps {
  images: string[];
  title: string;
  description: string;
  rowIndex: number;
}

// Container variants for staggered children animation
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    }
  }
};

// Individual image variants
const imageVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5
    }
  }
};

function GalleryRow({ images, title, description, rowIndex }: GalleryRowProps) {
  const loopImages = [...images, ...images, ...images, ...images];
  const rowRef = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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

  // Mobile Layout
  if (isMobile) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Auto-cycle through images
    useLayoutEffect(() => {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 3000); // Change image every 3 seconds

      return () => clearInterval(interval);
    }, [images.length]);

    return (
      <Box
        sx={{
          px: 3,
          mb: 8,
          display: 'flex',
          flexDirection: 'column',
          gap: 3
        }}
      >
        {/* Title and Description */}
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Typography
            variant="h4"
            component="h2"
            sx={{
              fontWeight: 800,
              fontFamily: '"Playfair Display", serif',
              color: "#2C1810",
              mb: 1.5,
              letterSpacing: '-0.02em'
            }}
          >
            {title}
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: "#5D4037",
              fontStyle: 'italic',
              fontWeight: 400,
              lineHeight: 1.6,
            }}
          >
            {description}
          </Typography>
        </Box>

        {/* Single Image Container with auto-cycling */}
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: 250,
            borderRadius: 3,
            overflow: 'hidden',
            boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
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
                scale: currentImageIndex === idx ? 1 : 1.1
              }}
              transition={{ duration: 0.7 }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: "cover",
                userSelect: 'none',
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
      sx={{
        position: "relative",
        overflow: "hidden",
        width: "100vw",
        mb: 8,
        display: 'flex',
        flexDirection: 'column',
        gap: 3
      }}
    >
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        sx={{
          px: { xs: 3, md: 8, lg: 12 },
          maxWidth: '1400px',
          mx: 'auto',
          width: '100%',
          textAlign: rowIndex % 2 !== 0 ? 'right' : 'left'
        }}
      >
        <Typography
          variant="h3"
          component="h2"
          sx={{
            fontWeight: 800,
            fontFamily: '"Playfair Display", serif',
            color: "#2C1810",
            mb: 1.5,
            letterSpacing: '-0.02em'
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: "#5D4037",
            maxWidth: '600px',
            fontStyle: 'italic',
            fontWeight: 400,
            lineHeight: 1.6,
            ml: rowIndex % 2 !== 0 ? 'auto' : 0
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
              boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
              userSelect: 'none',
              pointerEvents: 'auto'
            }}
          />
        ))}
      </motion.div>
    </Box>
  );
}

export default function Gallery() {
  return (
    <Box
      sx={{
        width: "100vw",
        overflowX: "hidden",
        py: 10,
        display: "flex",
        flexDirection: "column",
        gap: 6,
        backgroundColor: "#F3E3CC",
        minHeight: '100vh'
      }}
    >
      {galleryRows.map((row, rowIndex) => (
        <GalleryRow
          key={rowIndex}
          images={row.images}
          title={row.title}
          description={row.description}
          rowIndex={rowIndex}
        />
      ))}
    </Box>
  );
}
