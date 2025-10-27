import React, { useState } from "react";
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

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <Box
      sx={{
        width: "100vw",
        overflow: "hidden",
        py: 4,
        display: "flex",
        flexDirection: "column",
        gap: 4,
        backgroundColor: "white", // optional for contrast
      }}
    >
      {galleryRows.map((images, rowIndex) => {
        const loopImages = [...images, ...images];

        return (
          <motion.div
            key={rowIndex}
            style={{
              display: "flex",
              gap: 16,
              width: "max-content",
            }}
            animate={{
              x:
                rowIndex % 2 === 0
                  ? [0, -images.length * window.innerWidth] // scroll left
                  : [0, images.length * window.innerWidth], // scroll right
            }}
            transition={{
              repeat: Infinity,
              duration: 30,
              ease: "linear",
            }}
          >
            {loopImages.map((src, idx) => (
              <Box
                key={idx + rowIndex * loopImages.length}
                component="img"
                src={src}
                alt={`Gallery ${idx}`}
                onClick={() => setSelectedImage(src)}
                sx={{
                  flexShrink: 0,
                  width: { xs: "90vw", sm: "50vw", md: "33vw" }, // responsive width
                  height: { xs: 200, sm: 250, md: 300 },
                  objectFit: "cover",
                  borderRadius: 2,
                  cursor: "pointer",
                  transition: "transform 0.3s",
                  "&:hover": { transform: "scale(1.05)" },
                }}
              />
            ))}
          </motion.div>
        );
      })}

      {/* Popup Modal */}
      <AnimatePresence>
        {selectedImage && (
          <Backdrop
            open={!!selectedImage}
            sx={{
              color: "#fff",
              zIndex: (theme) => theme.zIndex.drawer + 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0,0,0,0.85)",
            }}
          >
            <Box sx={{ position: "relative" }}>
              <IconButton
                onClick={() => setSelectedImage(null)}
                sx={{
                  position: "absolute",
                  top: -40,
                  right: -40,
                  color: "#fff",
                  backgroundColor: "rgba(0, 0, 0, 0.6)",
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.2)",
                  },
                }}
              >
                <CloseIcon fontSize="large" />
              </IconButton>

              <motion.img
                src={selectedImage}
                alt="Selected"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{
                  maxWidth: "90vw",
                  maxHeight: "80vh",
                  borderRadius: "12px",
                  objectFit: "contain",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
                }}
              />
            </Box>
          </Backdrop>
        )}
      </AnimatePresence>
    </Box>
  );
}
