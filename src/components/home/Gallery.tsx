import { useState, useRef, useLayoutEffect } from "react";
import { Box, Backdrop, IconButton } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import CloseIcon from "@mui/icons-material/Close";

const galleryRows = [
  [
    "https://i.pinimg.com/736x/6b/3a/c2/6b3ac22af731ea09354668e6fc51eeb8.jpg",
    "https://source.unsplash.com/400x300/?pizza",
    "https://source.unsplash.com/400x300/?salad",
  ],
  [
    "https://source.unsplash.com/400x300/?dessert",
    "https://source.unsplash.com/400x300/?drink",
    "https://source.unsplash.com/400x300/?coffee",
  ],
  [
    "https://source.unsplash.com/400x300/?burger",
    "https://source.unsplash.com/400x300/?pasta",
    "https://source.unsplash.com/400x300/?steak",
  ],
  [
    "https://source.unsplash.com/400x300/?soup",
    "https://source.unsplash.com/400x300/?wine",
    "https://source.unsplash.com/400x300/?restaurant",
  ],
];

interface GalleryRowProps {
  images: string[];
  rowIndex: number;
  onImageClick: (src: string) => void;
}

function GalleryRow({ images, rowIndex, onImageClick }: GalleryRowProps) {
  const loopImages = [...images, ...images, ...images, ...images];
  const rowRef = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
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
  }, []);

  return (
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
        width: "100vw",
      }}
    >
      <motion.div
        ref={rowRef}
        style={{
          display: "flex",
          gap: 16,
          width: "max-content",
        }}
        animate={{
          x: rowIndex % 2 === 0 ? [-width, 0] : [0, -width],
        }}
        transition={{
          repeat: Infinity,
          repeatType: "loop",
          duration: 35,
          ease: "linear",
        }}
      >
        {loopImages.map((src, idx) => (
          <Box
            key={idx}
            component="img"
            src={src}
            alt={`Gallery-${idx}`}
            onClick={() => onImageClick(src)}
            sx={{
              flexShrink: 0,
              width: { xs: "85vw", sm: "45vw", md: "28vw", lg: "22vw" },
              height: { xs: 180, sm: 230, md: 260, lg: 300 },
              objectFit: "cover",
              cursor: "pointer",
              transition: "transform 0.3s",
              "&:hover": { transform: "scale(1.05)" },
            }}
          />
        ))}
      </motion.div>
    </Box>
  );
}

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <Box
      sx={{
        width: "100vw",
        overflow: "hidden",
        py: 4,
        display: "flex",
        flexDirection: "column",
        gap: 4,
        backgroundColor: "#F3E3CC",
      }}
    >
      {galleryRows.map((images, rowIndex) => (
        <GalleryRow
          key={rowIndex}
          images={images}
          rowIndex={rowIndex}
          onImageClick={setSelectedImage}
        />
      ))}
      <AnimatePresence>
        {selectedImage && (
          <Backdrop
            open={true}
            sx={{
              backgroundColor: "rgba(0,0,0,0.9)",
              zIndex: (theme) => theme.zIndex.drawer + 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              p: 2,
            }}
          >
            <Box
              sx={{
                position: "relative",
                maxWidth: "100vw",
                maxHeight: "100vh",
              }}
            >
              <IconButton
                onClick={() => setSelectedImage(null)}
                sx={{
                  position: "absolute",
                  top: { xs: -10, sm: -40 },
                  right: { xs: -10, sm: -40 },
                  color: "#fff",
                  background: "rgba(0,0,0,0.4)",
                  "&:hover": { background: "rgba(0,0,0,0.6)" },
                }}
              >
                <CloseIcon fontSize="large" />
              </IconButton>

              <motion.img
                src={selectedImage}
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.7, opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{
                  width: "100%",
                  height: "auto",
                  maxWidth: "90vw",
                  maxHeight: "85vh",
                  objectFit: "contain",
                  borderRadius: "8px",
                  boxShadow: "0 10px 40px rgba(0,0,0,0.6)",
                }}
              />
            </Box>
          </Backdrop>
        )}
      </AnimatePresence>
    </Box>
  );
}
