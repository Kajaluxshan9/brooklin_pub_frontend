import { useRef, useEffect, useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { useApiWithCache } from "../../hooks/useApi";
import { menuService } from "../../services/menu.service";
import { getImageUrl } from "../../services/api";
import MenuBackground from "./PopupBackground";
import PopupCloseButton from "./PopupCloseButton";
import type {
  MenuCategory,
  MenuItem,
  MenuItemMeasurement,
} from "../../types/api.types";

// Premium card animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 60, scale: 0.9 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: "easeOut" as const,
    },
  }),
  hover: {
    y: -12,
    scale: 1.02,
    transition: {
      duration: 0.4,
      ease: "easeOut" as const,
    },
  },
};

const imageVariants = {
  rest: { rotate: 0, scale: 1 },
  hover: {
    rotate: -15,
    scale: 1.1,
    y: -20,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
};

export default function MainMenu() {
  const ref = useRef<HTMLDivElement | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Fetch data from backend
  const { data: categories } = useApiWithCache<MenuCategory[]>(
    "menu-categories",
    () => menuService.getCategories()
  );

  const { data: menuItems } = useApiWithCache<MenuItem[]>(
    "all-menu-items",
    () => menuService.getAllMenuItems()
  );

  // Type definitions matching the UI structure
  type DisplayMenuItem = {
    name: string;
    desc: string;
    price: string;
    image?: string;
    measurements?: MenuItemMeasurement[];
    hasMeasurements?: boolean;
  };

  type MenuEntry = {
    mainImage: string;
    name: string;
    namePath: string;
    menuItems: DisplayMenuItem[];
    description?: string;
    categoryId?: string;
    primaryCategoryId?: string;
  };

  const padding = 36;

  const [selectedItem, setSelectedItem] = useState<MenuEntry | null>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [activeCard, setActiveCard] = useState<number | null>(null); // For touch devices

  // Transform backend data to UI format
  const transformedMenuData = useMemo((): MenuEntry[] => {
    if (!categories || !menuItems) return [];

    return categories
      .filter((cat) => cat.isActive)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((category) => {
        const categoryItems = menuItems
          .filter((item) => item.categoryId === category.id && item.isAvailable)
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map((item) => {
            let priceDisplay = "";
            if (!item.hasMeasurements && item.price != null && item.price > 0) {
              priceDisplay = `$${item.price.toFixed(2)}`;
            }

            return {
              name: item.name,
              desc: item.description || "",
              price: priceDisplay,
              image:
                getImageUrl(item.imageUrls?.[0]) || "/brooklinpub-logo.png",
              measurements: item.measurements,
              hasMeasurements: item.hasMeasurements,
            } as DisplayMenuItem;
          });

        const generateNamePath = (name: string): string => {
          const baseY = 20;
          const charWidth = 15;
          let path = `M10 ${baseY}`;
          for (let i = 0; i < name.length; i++) {
            const x = 10 + i * charWidth;
            path += ` L${x} ${baseY}`;
          }
          return path;
        };

        return {
          mainImage:
            getImageUrl(category.imageUrl) ||
            categoryItems[0]?.image ||
            "/brooklinpub-logo.png",
          name: category.name,
          description: category.description || "",
          namePath: generateNamePath(category.name),
          menuItems: categoryItems,
          categoryId: category.id,
          primaryCategoryId: category.primaryCategoryId,
        } as MenuEntry;
      })
      .filter((entry) => entry.menuItems.length > 0);
  }, [categories, menuItems]);

  // Lock body scroll when popup is open
  useEffect(() => {
    if (typeof document === "undefined") return;
    const original = document.body.style.overflow;
    if (selectedItem) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = original;
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedItem(null);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = original;
    };
  }, [selectedItem]);

  // Get selected primary category from URL
  const location = useLocation();
  const getCategoryFromQuery = () => {
    try {
      const params = new URLSearchParams(location.search);
      const q = params.get("category");
      return q ? String(q).trim() : "all";
    } catch {
      return "all";
    }
  };

  const selectedPrimaryCategoryId = getCategoryFromQuery();

  // Filter menu by primary category
  const filteredMenu = useMemo(() => {
    if (!selectedPrimaryCategoryId || selectedPrimaryCategoryId === "all") {
      return transformedMenuData;
    }
    return transformedMenuData.filter(
      (entry) => entry.primaryCategoryId === selectedPrimaryCategoryId
    );
  }, [transformedMenuData, selectedPrimaryCategoryId]);

  // Inject Google Fonts
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (document.getElementById("fonts-inspiration-preconnect")) return;

    const pre1 = document.createElement("link");
    pre1.rel = "preconnect";
    pre1.href = "https://fonts.googleapis.com";
    pre1.id = "fonts-inspiration-preconnect";
    document.head.appendChild(pre1);

    const pre2 = document.createElement("link");
    pre2.rel = "preconnect";
    pre2.href = "https://fonts.gstatic.com";
    pre2.crossOrigin = "";
    pre2.id = "fonts-inspiration-preconnect-2";
    document.head.appendChild(pre2);

    const sheet = document.createElement("link");
    sheet.rel = "stylesheet";
    sheet.href =
      "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Great+Vibes&family=Montserrat:wght@400;500;600;700&display=swap";
    sheet.id = "fonts-inspiration-stylesheet";
    document.head.appendChild(sheet);

    return () => {
      // keep links
    };
  }, []);

  return (
    <Box
      ref={ref}
      sx={{
        paddingTop: `${padding}px`,
        paddingBottom: `${padding}px`,
        background: "linear-gradient(180deg, #FDF8F3 0%, #F5EBE0 100%)",
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <MenuBackground />

      {/* Premium Menu Grid */}
      <Box
        sx={{
          position: "relative",
          margin: "0 auto",
          width: "100%",
          maxWidth: "1400px",
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(3, 1fr)",
          },
          gap: { xs: "32px", md: "48px" },
          zIndex: 10,
          padding: { xs: "24px 16px", md: "48px 32px" },
        }}
      >
        {filteredMenu.map((item: MenuEntry, idx: number) => {
          const isHovered = hoveredCard === idx || activeCard === idx;
          const cardColors = [
            {
              bg: "linear-gradient(145deg, #6A3A1E 0%, #4A2C17 100%)",
              accent: "#D9A756",
            },
            {
              bg: "linear-gradient(145deg, #D9A756 0%, #B08030 100%)",
              accent: "#FDF8F3",
            },
            {
              bg: "linear-gradient(145deg, #4A2C17 0%, #3A2212 100%)",
              accent: "#C5933E",
            },
          ];
          const colorScheme = cardColors[idx % cardColors.length];

          return (
            <motion.div
              key={idx}
              custom={idx}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              whileTap={{ scale: 0.98 }}
              variants={cardVariants}
              onHoverStart={() => setHoveredCard(idx)}
              onHoverEnd={() => setHoveredCard(null)}
              onTouchStart={() => {
                // On touch, show hover state briefly
                setActiveCard(idx);
              }}
              onTouchEnd={() => {
                // Keep active briefly for visual feedback
                setTimeout(() => setActiveCard(null), 150);
              }}
              onClick={() => setSelectedItem(item)}
              style={{ cursor: "pointer" }}
            >
              <Box
                sx={{
                  position: "relative",
                  borderRadius: "24px",
                  overflow: "visible",
                  background: "transparent",
                  backdropFilter: isHovered ? "blur(8px)" : "none",
                  transition: "all 0.5s cubic-bezier(0.215, 0.61, 0.355, 1)",
                }}
              >
                {/* Subtle glow on hover */}
                <Box
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "80%",
                    height: "80%",
                    background: `radial-gradient(ellipse, ${colorScheme.accent}15 0%, transparent 70%)`,
                    borderRadius: "50%",
                    opacity: isHovered ? 1 : 0,
                    transition: "opacity 0.5s ease",
                    pointerEvents: "none",
                  }}
                />

                {/* Image Container */}
                <Box
                  sx={{
                    position: "relative",
                    height: { xs: "220px", md: "280px" },
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    pt: 2,
                    px: 2,
                    overflow: "visible",
                  }}
                >
                  <motion.div
                    variants={imageVariants}
                    initial="rest"
                    animate={isHovered ? "hover" : "rest"}
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Box
                      component="img"
                      src={item.mainImage}
                      alt={item.name}
                      draggable={false}
                      sx={{
                        maxWidth: "90%",
                        maxHeight: "90%",
                        objectFit: "contain",
                        filter: isHovered
                          ? `drop-shadow(0 30px 50px rgba(0,0,0,0.4))`
                          : `drop-shadow(0 15px 35px rgba(0,0,0,0.25))`,
                        transition: "filter 0.4s ease",
                      }}
                    />
                  </motion.div>

                  {/* Floating shadow/reflection */}
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: "-10px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "60%",
                      height: "20px",
                      background: `radial-gradient(ellipse, rgba(0,0,0,0.2) 0%, transparent 70%)`,
                      filter: "blur(8px)",
                      opacity: isHovered ? 0.8 : 0.5,
                      transition: "all 0.4s ease",
                    }}
                  />
                </Box>

                {/* Content */}
                <Box
                  sx={{
                    p: { xs: 2, md: 2.5 },
                    pt: 1,
                    textAlign: "center",
                  }}
                >
                  {/* Category name */}
                  <Box
                    sx={{
                      minHeight: { xs: "auto", md: "70px" },
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      mb: 1,
                      px: 2,
                    }}
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8, y: 20 }}
                      whileInView={{ opacity: 1, scale: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{
                        duration: 0.8,
                        delay: idx * 0.1,
                        ease: [0.215, 0.61, 0.355, 1],
                      }}
                      style={{ width: "100%" }}
                    >
                      <Typography
                        component={motion.div}
                        initial={{ backgroundPosition: "0% 50%" }}
                        animate={{ backgroundPosition: "100% 50%" }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          repeatType: "reverse",
                          ease: "easeInOut",
                        }}
                        sx={{
                          fontFamily: "'Great Vibes', cursive",
                          fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
                          fontWeight: 400,
                          background: `linear-gradient(90deg, #4A2C17 0%, #6A3A1E 25%, #D9A756 50%, #6A3A1E 75%, #4A2C17 100%)`,
                          backgroundSize: "200% 100%",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                          textAlign: "center",
                          filter: `drop-shadow(-1px -1px 0 #D9A75640) 
                                   drop-shadow(1px -1px 0 #D9A75640) 
                                   drop-shadow(-1px 1px 0 #D9A75640) 
                                   drop-shadow(1px 1px 0 #D9A75640)
                                   drop-shadow(0 0 8px rgba(217, 167, 86, 0.2))`,
                          lineHeight: 1.2,
                          wordWrap: "break-word",
                          overflowWrap: "break-word",
                          hyphens: "auto",
                        }}
                      >
                        {item.name}
                      </Typography>
                    </motion.div>
                  </Box>

                  {/* Item count - minimal style */}
                  <Typography
                    sx={{
                      fontFamily: "'Montserrat', sans-serif",
                      fontSize: "1.1rem",
                      fontWeight: 500,
                      color: "#8B7355",
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      opacity: 0.8,
                    }}
                  >
                    {item.menuItems.length} Items
                  </Typography>

                  {/* Explore indicator on hover */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{
                      opacity: isHovered ? 1 : 0,
                      y: isHovered ? 0 : 10,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <Box
                      sx={{
                        mt: 1.5,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 1,
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: "'Cormorant Garamond', serif",
                          fontSize: "1.1rem",
                          fontWeight: 600,
                          color: "#D9A756",
                          letterSpacing: "0.15em",
                          textTransform: "uppercase",
                        }}
                      >
                        Explore
                      </Typography>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#D9A756"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </Box>
                  </motion.div>
                </Box>

                {/* Subtle underline on hover */}
                <Box
                  sx={{
                    position: "absolute",
                    bottom: "8px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: isHovered ? "60%" : "0%",
                    height: "1px",
                    background:
                      "linear-gradient(90deg, transparent, #D9A75660, transparent)",
                    transition: "width 0.4s ease",
                  }}
                />
              </Box>

              {/* Mobile divider - only show on xs screens and not on last item */}
              {idx < filteredMenu.length - 1 && (
                <Box
                  sx={{
                    display: { xs: "flex", sm: "none" },
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 2,
                    my: 3,
                  }}
                >
                  <Box
                    sx={{
                      flex: 1,
                      height: "1px",
                      background:
                        "linear-gradient(90deg, transparent, #D9A756, transparent)",
                    }}
                  />
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "#D9A756",
                    }}
                  />
                  <Box
                    sx={{
                      flex: 1,
                      height: "1px",
                      background:
                        "linear-gradient(90deg, transparent, #D9A756, transparent)",
                    }}
                  />
                </Box>
              )}
            </motion.div>
          );
        })}
      </Box>

      {/* Premium Category Dialog */}
      <AnimatePresence>
        {selectedItem && (
          <Dialog
            open={!!selectedItem}
            onClose={() => setSelectedItem(null)}
            fullWidth
            fullScreen={isMobile}
            maxWidth="lg"
            sx={{ zIndex: 14000 }}
            PaperProps={{
              sx: {
                background: "transparent",
                boxShadow: "none",
                overflow: "visible",
                // Account for mobile browser chrome and safe areas
                maxHeight: isMobile
                  ? "100%"
                  : "calc(90vh - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px))",
                borderRadius: isMobile ? 0 : { xs: "16px", md: "24px" },
                margin: isMobile ? 0 : undefined,
              },
            }}
          >
            <PopupCloseButton onClick={() => setSelectedItem(null)} />

            <DialogContent
              sx={{
                position: "relative",
                zIndex: 1,
                p: 0,
                background: "transparent",
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-start",
                height: "100%",
                overflow: "hidden",
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 40 }}
                transition={{ duration: 0.4, ease: [0.215, 0.61, 0.355, 1] }}
                style={{
                  width: "100%",
                  height: isMobile ? "100%" : "auto",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: isMobile ? "stretch" : "flex-start",
                  padding: isMobile ? "0" : "40px 16px 24px",
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    width: isMobile ? "100%" : "min(1400px, 98vw)",
                    height: isMobile ? "100%" : "auto",
                    background:
                      "linear-gradient(180deg, rgba(253, 248, 243, 0.98) 0%, rgba(245, 235, 224, 0.98) 100%)",
                    backdropFilter: "blur(20px)",
                    borderRadius: isMobile ? 0 : { xs: "16px", md: "24px" },
                    border: isMobile
                      ? "none"
                      : "1px solid rgba(217, 167, 86, 0.3)",
                    boxShadow: isMobile
                      ? "none"
                      : `
                      0 32px 64px -16px rgba(106, 58, 30, 0.3),
                      0 0 0 1px rgba(255,255,255,0.5) inset,
                      0 2px 0 rgba(255,255,255,0.2) inset
                    `,
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    // Safe area padding for mobile
                    paddingTop: isMobile ? "env(safe-area-inset-top, 0px)" : 0,
                    paddingBottom: isMobile
                      ? "env(safe-area-inset-bottom, 0px)"
                      : 0,
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: "120px",
                      background:
                        "linear-gradient(180deg, rgba(217, 167, 86, 0.1) 0%, transparent 100%)",
                      pointerEvents: "none",
                    },
                  }}
                >
                  {/* Decorative top accent */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "200px",
                      height: "4px",
                      background:
                        "linear-gradient(90deg, transparent, #D9A756, transparent)",
                      borderRadius: "0 0 4px 4px",
                    }}
                  />

                  {/* Header Section */}
                  <Box
                    sx={{
                      position: "sticky",
                      top: 0,
                      bgcolor: "rgba(253, 248, 243, 0.95)",
                      backdropFilter: "blur(10px)",
                      zIndex: 10,
                      p: { xs: 3, md: 4 },
                      pb: { xs: 2, md: 3 },
                      borderBottom: "1px solid rgba(217, 167, 86, 0.2)",
                    }}
                  >
                    {/* Decorative flourish */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 2,
                        mb: 2,
                      }}
                    >
                      <Box
                        sx={{
                          width: "60px",
                          height: "1px",
                          background:
                            "linear-gradient(90deg, transparent, #D9A756)",
                        }}
                      />
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: "#D9A756",
                        }}
                      />
                      <Box
                        sx={{
                          width: "60px",
                          height: "1px",
                          background:
                            "linear-gradient(90deg, #D9A756, transparent)",
                        }}
                      />
                    </Box>

                    <Typography
                      variant="h3"
                      align="center"
                      sx={{
                        fontFamily: "'Cormorant Garamond', serif",
                        color: "#4A2C17",
                        fontWeight: 700,
                        fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        textShadow: "0 2px 4px rgba(106, 58, 30, 0.1)",
                      }}
                    >
                      {selectedItem.name}
                    </Typography>

                    {selectedItem?.description &&
                      selectedItem.description.length > 0 && (
                        <Typography
                          variant="body1"
                          align="center"
                          sx={{
                            fontFamily: "'Cormorant Garamond', serif",
                            color: "rgba(106, 58, 30, 0.7)",
                            fontSize: { xs: "1rem", md: "1.15rem" },
                            fontStyle: "italic",
                            mt: 1.5,
                            maxWidth: "600px",
                            mx: "auto",
                          }}
                        >
                          {selectedItem.description}
                        </Typography>
                      )}
                  </Box>

                  {/* Menu Items Grid */}
                  <Box
                    sx={{
                      p: { xs: 2, sm: 3, md: 4 },
                      pt: { xs: 2, md: 3 },
                      overflowY: "auto",
                      // Better height calculation for mobile
                      maxHeight: isMobile
                        ? "calc(100vh - 200px - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px))"
                        : "calc(90vh - 260px)",
                      flex: isMobile ? 1 : "none",
                      WebkitOverflowScrolling: "touch", // Smooth scrolling on iOS
                    }}
                  >
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: {
                          xs: "1fr",
                          sm: "repeat(2, 1fr)",
                          lg: "repeat(2, 1fr)",
                        },
                        gap: { xs: 2, md: 3 },
                        pb: 2,
                      }}
                    >
                      {(selectedItem?.menuItems || []).map(
                        (mi: DisplayMenuItem, i: number) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              delay: Math.min(i * 0.05, 0.5),
                              duration: 0.4,
                              ease: [0.215, 0.61, 0.355, 1],
                            }}
                          >
                            <Box
                              sx={{
                                position: "relative",
                                p: { xs: 2.5, md: 3 },
                                height: "100%",
                                borderRadius: "16px",
                                background: "rgba(255, 255, 255, 0.7)",
                                border: "1px solid rgba(217, 167, 86, 0.2)",
                                boxShadow:
                                  "0 4px 20px -8px rgba(106, 58, 30, 0.1)",
                                transition:
                                  "all 0.4s cubic-bezier(0.215, 0.61, 0.355, 1)",
                                overflow: "hidden",
                                "&::before": {
                                  content: '""',
                                  position: "absolute",
                                  top: 0,
                                  left: 0,
                                  width: "4px",
                                  height: "100%",
                                  background:
                                    "linear-gradient(180deg, #D9A756 0%, #B08030 100%)",
                                  opacity: 0,
                                  transition: "opacity 0.3s ease",
                                },
                                "&:hover": {
                                  background: "rgba(255, 255, 255, 0.95)",
                                  borderColor: "rgba(217, 167, 86, 0.4)",
                                  transform: "translateY(-4px)",
                                  boxShadow:
                                    "0 12px 32px -8px rgba(106, 58, 30, 0.2)",
                                  "&::before": {
                                    opacity: 1,
                                  },
                                },
                              }}
                            >
                              {/* Item Header */}
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "flex-start",
                                  mb: 1.5,
                                  flexWrap: "wrap",
                                  gap: 1,
                                }}
                              >
                                <Typography
                                  variant="h6"
                                  sx={{
                                    fontFamily: "'Cormorant Garamond', serif",
                                    fontWeight: 700,
                                    color: "#4A2C17",
                                    fontSize: { xs: "1.2rem", md: "1.4rem" },
                                    lineHeight: 1.3,
                                    flex: 1,
                                  }}
                                >
                                  {mi.name}
                                </Typography>
                                {!mi.hasMeasurements && mi.price && (
                                  <Box
                                    sx={{
                                      px: 1.5,
                                      py: 0.5,
                                      borderRadius: "8px",
                                      background:
                                        "linear-gradient(135deg, #6A3A1E 0%, #4A2C17 100%)",
                                      boxShadow:
                                        "0 2px 8px rgba(106, 58, 30, 0.3)",
                                    }}
                                  >
                                    <Typography
                                      sx={{
                                        fontFamily:
                                          "'Cormorant Garamond', serif",
                                        color: "#FDF8F3",
                                        fontWeight: 700,
                                        fontSize: { xs: "1rem", md: "1.15rem" },
                                      }}
                                    >
                                      {mi.price}
                                    </Typography>
                                  </Box>
                                )}
                              </Box>

                              {/* Description */}
                              {mi.desc && (
                                <Typography
                                  variant="body2"
                                  sx={{
                                    color: "rgba(74, 44, 23, 0.75)",
                                    fontFamily:
                                      "'Inter', 'Montserrat', sans-serif",
                                    fontSize: { xs: "0.9rem", md: "0.95rem" },
                                    lineHeight: 1.7,
                                    mb: mi.hasMeasurements ? 2 : 0,
                                  }}
                                >
                                  {mi.desc}
                                </Typography>
                              )}

                              {/* Measurements/Sizes */}
                              {mi.hasMeasurements && mi.measurements && (
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: 1,
                                    mt: "auto",
                                    pt: 1,
                                  }}
                                >
                                  {mi.measurements
                                    .filter((m) => m.price > 0)
                                    .sort((a, b) => a.sortOrder - b.sortOrder)
                                    .map((m, idx) => (
                                      <Box
                                        key={idx}
                                        sx={{
                                          px: 2,
                                          py: 0.75,
                                          borderRadius: "12px",
                                          background:
                                            "linear-gradient(135deg, rgba(217, 167, 86, 0.15) 0%, rgba(217, 167, 86, 0.25) 100%)",
                                          border:
                                            "1px solid rgba(217, 167, 86, 0.4)",
                                          display: "flex",
                                          alignItems: "center",
                                          gap: 1.5,
                                          transition: "all 0.3s ease",
                                          "&:hover": {
                                            background:
                                              "linear-gradient(135deg, rgba(217, 167, 86, 0.25) 0%, rgba(217, 167, 86, 0.35) 100%)",
                                            transform: "scale(1.02)",
                                          },
                                        }}
                                      >
                                        <Typography
                                          variant="caption"
                                          sx={{
                                            color: "#6A3A1E",
                                            fontWeight: 700,
                                            textTransform: "uppercase",
                                            letterSpacing: "0.08em",
                                            fontSize: "0.75rem",
                                          }}
                                        >
                                          {m.measurementTypeEntity?.name ||
                                            m.measurementType?.name ||
                                            "Size"}
                                        </Typography>
                                        <Box
                                          sx={{
                                            width: "1px",
                                            height: "16px",
                                            bgcolor: "rgba(106, 58, 30, 0.3)",
                                          }}
                                        />
                                        <Typography
                                          sx={{
                                            color: "#4A2C17",
                                            fontWeight: 700,
                                            fontFamily:
                                              "'Cormorant Garamond', serif",
                                            fontSize: "0.95rem",
                                          }}
                                        >
                                          ${m.price.toFixed(2)}
                                        </Typography>
                                      </Box>
                                    ))}
                                </Box>
                              )}
                            </Box>
                          </motion.div>
                        )
                      )}
                    </Box>
                  </Box>

                  {/* Bottom decorative accent */}
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: "4px",
                      background:
                        "linear-gradient(90deg, transparent, #D9A756, #B08030, #D9A756, transparent)",
                    }}
                  />
                </Box>
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </Box>
  );
}
