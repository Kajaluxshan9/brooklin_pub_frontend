import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/system";
import { motion } from "framer-motion";

interface MenuItem {
  name: string;
  image: string;
}

const menuItems: MenuItem[] = [
  { name: "Kiwi", image: "https://pngimg.com/d/apple_PNG12433.png" },
  { name: "Orange", image: "https://pngimg.com/d/apple_PNG12433.png" },
  { name: "Apple", image: "https://pngimg.com/d/apple_PNG12433.png" },
  { name: "Banana", image: "https://pngimg.com/d/apple_PNG12433.png" },
  { name: "Kiwi", image: "https://pngimg.com/d/apple_PNG12433.png" },
  { name: "Orange", image: "https://pngimg.com/d/apple_PNG12433.png" },
  { name: "Apple", image: "https://pngimg.com/d/apple_PNG12433.png" },
  { name: "Banana", image: "https://pngimg.com/d/apple_PNG12433.png" },
];

// Motion image styled
const MotionImg = motion(
  styled("img")({
    width: "100%",
    height: "clamp(100px, 20vw, 180px)",
    objectFit: "contain",
    borderRadius: "12px",
    cursor: "pointer",
  })
);

const MenuListRandomGrid = () => {
  const [shuffledItems, setShuffledItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    const shuffled = [...menuItems].sort(() => Math.random() - 0.5);
    setShuffledItems(shuffled);
  }, []);

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        py: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        background: "transparent", // transparent background
      }}
    >
      {/* Title */}
      <Typography
        variant="h3"
        component="h1"
        sx={{
          fontSize: { xs: "24px", sm: "32px", md: "48px" },
          mb: 4,
          fontFamily: '"Cormorant Garamond", Georgia, serif',
          textAlign: "center",
        }}
      >
        Our Menu
      </Typography>

      {/* Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, 1fr)",
            sm: "repeat(3, 1fr)",
            md: "repeat(4, 1fr)",
          },
          gap: { xs: 2, sm: 3, md: 4 },
          width: "95%",
          maxWidth: 1200,
        }}
      >
        {shuffledItems.map((item, index) => (
          <Box key={index} sx={{ textAlign: "center" }}>
            <MotionImg
              src={item.image}
              alt={item.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: index * 0.1,
                duration: 0.5,
                ease: "easeOut",
              }}
              whileHover={{ scale: 1.1, rotate: 3 }}
            />
            <Typography
              variant="subtitle1"
              sx={{
                mt: 1,
                fontWeight: 700,
                fontSize: { xs: "12px", sm: "14px", md: "16px" },
              }}
            >
              {item.name}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default MenuListRandomGrid;
