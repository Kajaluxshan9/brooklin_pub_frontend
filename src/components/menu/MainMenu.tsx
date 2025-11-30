import { useRef, useEffect, useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { DrawTextSVG } from "../icons/SvgNames";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useApiWithCache } from "../../hooks/useApi";
import { menuService } from "../../services/menu.service";
import { getImageUrl } from "../../services/api";
import type {
  MenuCategory,
  MenuItem,
  MenuItemMeasurement,
} from "../../types/api.types";

export default function MainMenu() {
  const ref = useRef<HTMLDivElement | null>(null);
  // Removed pagination - show all items

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
    categoryId?: string;
    primaryCategoryId?: string;
  };

  const screenWidth = typeof window !== "undefined" ? window.innerWidth : 1000;
  const padding = 36;

  const [gridConfig, setGridConfig] = useState<{
    cols: number;
    rows: number;
    cellSize: number;
    gap: number;
    containerWidth: number;
    containerHeight?: number;
  }>({ cols: 1, rows: 1, cellSize: 120, gap: 18, containerWidth: 0 });

  const [selectedItem, setSelectedItem] = useState<MenuEntry | null>(null);

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
                getImageUrl(item.imageUrls?.[0]) || "/placeholder-food.svg",
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
            "/placeholder-category.svg",
          name: category.name,
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

  // Pagination removed - all items shown

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

  // Generate grid-based points
  useEffect(() => {
    const generateGridPoints = () => {
      const numPoints = filteredMenu.length;
      const sw =
        (typeof window !== "undefined" ? window.innerWidth : screenWidth) ||
        screenWidth;

      const isMobileLocal = sw < 768;
      const desiredCols = isMobileLocal ? 1 : 3;
      const cols = Math.min(desiredCols, Math.max(1, numPoints));
      const rows = Math.ceil(numPoints / cols);

      const usableWidth = Math.max(300, sw - padding * 2);
      const cellWidth = usableWidth / cols;

      const maxSizeDesktop = 260;
      const maxSizeMobile = 160;
      const maxAllowed = isMobileLocal ? maxSizeMobile : maxSizeDesktop;

      const gap = Math.max(24, Math.round(cellWidth * 0.08)); // Increased gap for elegance
      const approxCell = Math.floor(
        Math.max(40, Math.min(cellWidth * 0.78, maxAllowed))
      );
      // Calculate exact height needed for the grid items
      const estimatedRowsHeight = rows * approxCell + (rows - 1) * gap;
      const containerHeightUsed = estimatedRowsHeight + padding * 2 + 120; // Add space for text labels

      const containerWidth = Math.min(
        sw - padding * 2,
        Math.round(cellWidth * cols + gap * (cols - 1))
      );

      setGridConfig({
        cols,
        rows,
        cellSize: approxCell,
        gap,
        containerWidth,
        containerHeight: containerHeightUsed,
      });
    };

    const t = setTimeout(generateGridPoints, 80);
    window.addEventListener("resize", generateGridPoints);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", generateGridPoints);
    };
  }, [filteredMenu.length, screenWidth]);

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
      "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Great+Vibes&display=swap";
    sheet.id = "fonts-inspiration-stylesheet";
    document.head.appendChild(sheet);

    return () => {
      // keep links
    };
  }, []);

  // Let content determine height; no forced effective container height

  // Calculate positions for SVG connecting lines
  const generateSvgLines = () => {
    if (!gridConfig.containerWidth || filteredMenu.length < 2) return null;

    const size = Math.max(40, Math.floor(gridConfig.cellSize || 220));
    const gap = gridConfig.gap;
    const cols = gridConfig.cols;

    // Calculate center positions for each item
    const cellWidth = (gridConfig.containerWidth + gap) / cols - gap;
    const itemTotalHeight = size + 60; // Circle + label + gap

    const positions: { x: number; y: number }[] = [];

    for (let i = 0; i < filteredMenu.length; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);

      const x = col * (cellWidth + gap) + cellWidth / 2;
      const y = row * (itemTotalHeight + gap) + size / 2;

      positions.push({ x, y });
    }

    return positions;
  };

  const svgPositions = generateSvgLines();

  return (
    <div
      ref={ref}
      style={{
        // Allow the container to grow to fit content (no fixed heights)
        paddingTop: padding,
        paddingBottom: padding,
        background:
          "linear-gradient(135deg, #FDF8F3 0%, #F5EBE0 50%, #E8D5C4 100%)", // Warm cream gradient
        position: "relative",
        overflow: "visible",
      }}
    >
      {/* Animated Geometric Shapes Background */}
      <div
        ref={(el) => {
          if (!el) return;
          const shapes = el.querySelectorAll(".menu-bg-shape");

          // Initial random positions
          shapes.forEach((shape) => {
            const randomLeft = Math.random() * 100;
            const randomTop = Math.random() * 100;
            const randomRotation = Math.random() * 360;
            const randomOpacity = 0.05 + Math.random() * 0.1;
            const randomScale = 0.5 + Math.random();

            (shape as HTMLElement).style.left = `${randomLeft}%`;
            (shape as HTMLElement).style.top = `${randomTop}%`;
            (shape as HTMLElement).style.transform = `rotate(${randomRotation}deg) scale(${randomScale})`;
            (shape as HTMLElement).style.opacity = `${randomOpacity}`;
          });

          // Continuous floating animation
          shapes.forEach((shape, i) => {
            const duration = 3000 + Math.random() * 3000;
            const animate = () => {
              const randomX = -50 + Math.random() * 100;
              const randomY = -50 + Math.random() * 100;
              const randomRotation = -180 + Math.random() * 360;

              (shape as HTMLElement).style.transition = `transform ${duration}ms ease-in-out`;
              (shape as HTMLElement).style.transform = `translate(${randomX}px, ${randomY}px) rotate(${randomRotation}deg)`;

              setTimeout(animate, duration);
            };
            setTimeout(animate, i * 200);
          });
        }}
        style={{
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
        {/* Abstract Geometric Shapes */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="menu-bg-shape"
            style={{
              position: "absolute",
              width: i % 3 === 0 ? "150px" : i % 3 === 1 ? "100px" : "50px",
              height: i % 3 === 0 ? "150px" : i % 3 === 1 ? "100px" : "50px",
              borderRadius: i % 2 === 0 ? "50%" : "10%",
              border: `2px solid ${i % 2 === 0 ? "#B08030" : "#D9A756"}`,
              background: i % 4 === 0 ? `${i % 2 === 0 ? "#B08030" : "#D9A756"}20` : "transparent",
            }}
          />
        ))}
      </div>

      {/* SVG Decorative Connecting Lines */}
      {svgPositions && svgPositions.length >= 2 && (
        <motion.svg
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          style={{
            position: "absolute",
            top: padding,
            left: "50%",
            transform: "translateX(-50%)",
            width: gridConfig.containerWidth,
            height: gridConfig.containerHeight || "100%",
            pointerEvents: "none",
            zIndex: 1,
          }}
        >
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#D9A756" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#B8923F" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#D9A756" stopOpacity="0.3" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Horizontal lines connecting items in same row */}
          {svgPositions.map((pos, idx) => {
            const nextInRow = svgPositions[idx + 1];
            const isLastInRow = (idx + 1) % gridConfig.cols === 0;

            if (!nextInRow || isLastInRow) return null;

            return (
              <motion.path
                key={`h-${idx}`}
                d={`M ${pos.x} ${pos.y} C ${pos.x + 40} ${pos.y - 15}, ${nextInRow.x - 40
                  } ${nextInRow.y - 15}, ${nextInRow.x} ${nextInRow.y}`}
                stroke="url(#lineGradient)"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                filter="url(#glow)"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, delay: 0.5 + idx * 0.1 }}
              />
            );
          })}

          {/* Vertical/diagonal lines connecting rows */}
          {svgPositions.map((pos, idx) => {
            const nextRowIdx = idx + gridConfig.cols;
            const nextRowPos = svgPositions[nextRowIdx];

            if (!nextRowPos) return null;

            // Create elegant curved path between rows
            const midY = (pos.y + nextRowPos.y) / 2;

            return (
              <motion.path
                key={`v-${idx}`}
                d={`M ${pos.x} ${pos.y} C ${pos.x} ${midY}, ${nextRowPos.x} ${midY}, ${nextRowPos.x} ${nextRowPos.y}`}
                stroke="url(#lineGradient)"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeDasharray="8 4"
                filter="url(#glow)"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, delay: 0.8 + idx * 0.1 }}
              />
            );
          })}

          {/* Decorative dots at connection points */}
          {svgPositions.map((pos, idx) => (
            <motion.circle
              key={`dot-${idx}`}
              cx={pos.x}
              cy={pos.y}
              r="4"
              fill="#D9A756"
              opacity="0.6"
              filter="url(#glow)"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 1 + idx * 0.05 }}
            />
          ))}
        </motion.svg>
      )}

      <div
        style={{
          // Use normal flow so height is determined by content
          position: "relative",
          margin: "0 auto",
          width: gridConfig.containerWidth ? gridConfig.containerWidth : "90%",
          display: "grid",
          gridTemplateColumns: `repeat(${gridConfig.cols}, 1fr)`,
          gridTemplateRows: `repeat(${gridConfig.rows}, auto)`,
          gap: `${gridConfig.gap}px`,
          justifyContent: "center",
          justifyItems: "center",
          alignContent: "start",
          zIndex: 10,
        }}
      >
        {filteredMenu.map((item: MenuEntry, idx: number) => {
          // Use configured cellSize as a stable basis for item size
          const size = Math.max(40, Math.floor(gridConfig.cellSize || 220));

          return (
            <motion.div
              key={idx}
              onClick={() => setSelectedItem(item)}
              style={{
                width: size,
                height: "auto",
                justifySelf: "center",
                alignSelf: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "16px",
                cursor: "pointer",
                position: "relative",
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {/* Image Container with Premium Border */}
              <div
                style={{
                  width: size,
                  height: size,
                  borderRadius: "50%",
                  padding: "6px",
                  background: "linear-gradient(145deg, #d9a756, #8a5a2a)", // Gold gradient border
                  boxShadow: "0 10px 30px rgba(106,58,30,0.25)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    overflow: "hidden",
                    border: "2px solid #F5EBE0", // Light cream inner border
                    position: "relative",
                  }}
                >
                  <motion.img
                    src={item.mainImage}
                    alt={item.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.4 }}
                  />
                  {/* Overlay for depth */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "radial-gradient(circle, transparent 50%, rgba(0,0,0,0.3) 100%)",
                      pointerEvents: "none",
                    }}
                  />
                </div>
              </div>

              {/* Elegant Text Label */}
              <div
                style={{
                  width: Math.min(
                    size * 1.8,
                    gridConfig.containerWidth || 9999
                  ), // Increased from 1.4
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  pointerEvents: "none",
                  marginTop: -5,
                  overflow: "visible", // Explicitly allow overflow
                }}
              >
                <DrawTextSVG
                  text={item.name}
                  width={size * 1.5} // Increased from 1.2
                  stroke="#6A3A1E" // Brown text for light theme
                  scale={1.1}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Premium Modal - Updated to match Home Page Popup Style */}
      {selectedItem && (
        <Dialog
          open={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          fullScreen
          sx={{ zIndex: 14000 }}
          PaperProps={{
            sx: {
              background: "rgba(253,248,243,0.95)", // Warm cream backdrop
              boxShadow: "none",
              overflow: "hidden", // We'll handle scrolling in the content
            },
          }}
        >
          {/* Animated Background for Popup */}
          <div
            ref={(el) => {
              if (!el) return;
              const shapes = el.querySelectorAll(".popup-bg-shape");

              // Initial random positions
              shapes.forEach((shape) => {
                const randomLeft = Math.random() * 100;
                const randomTop = Math.random() * 100;
                const randomRotation = Math.random() * 360;
                const randomOpacity = 0.05 + Math.random() * 0.1;
                const randomScale = 0.5 + Math.random();

                (shape as HTMLElement).style.left = `${randomLeft}%`;
                (shape as HTMLElement).style.top = `${randomTop}%`;
                (shape as HTMLElement).style.transform = `rotate(${randomRotation}deg) scale(${randomScale})`;
                (shape as HTMLElement).style.opacity = `${randomOpacity}`;
              });

              // Continuous floating animation
              shapes.forEach((shape, i) => {
                const duration = 3000 + Math.random() * 3000;
                const animate = () => {
                  const randomX = -50 + Math.random() * 100;
                  const randomY = -50 + Math.random() * 100;
                  const randomRotation = -180 + Math.random() * 360;

                  (shape as HTMLElement).style.transition = `transform ${duration}ms ease-in-out`;
                  (shape as HTMLElement).style.transform = `translate(${randomX}px, ${randomY}px) rotate(${randomRotation}deg)`;

                  setTimeout(animate, duration);
                };
                setTimeout(animate, i * 200);
              });
            }}
            style={{
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
            {/* Abstract Geometric Shapes */}
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="popup-bg-shape"
                style={{
                  position: "absolute",
                  width: i % 3 === 0 ? "150px" : i % 3 === 1 ? "100px" : "50px",
                  height: i % 3 === 0 ? "150px" : i % 3 === 1 ? "100px" : "50px",
                  borderRadius: i % 2 === 0 ? "50%" : "10%",
                  border: `2px solid ${i % 2 === 0 ? "#B08030" : "#D9A756"}`,
                  background: i % 4 === 0 ? `${i % 2 === 0 ? "#B08030" : "#D9A756"}20` : "transparent",
                }}
              />
            ))}
          </div>

          {/* Close Button - Matching SpecialDisplay style */}
          <button
            onClick={() => setSelectedItem(null)}
            aria-label="Close menu popup"
            style={{
              position: "fixed",
              top: "28px",
              right: "28px",
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              backdropFilter: "blur(4px)",
              background: "rgba(106, 58, 30, 0.9)", // Brown background
              border: "1px solid rgba(217, 167, 86, 0.6)", // Gold border
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(106,58,30,0.3)",
              transition: "0.35s cubic-bezier(0.165, 0.84, 0.44, 1)",
              zIndex: 14002,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow =
                "0 0 22px rgba(217, 167, 86, 0.45)";
              (e.currentTarget as HTMLElement).style.background =
                "rgba(106, 58, 30, 1)";
              (e.currentTarget as HTMLElement).style.borderColor = "#d9a756";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow =
                "0 4px 12px rgba(106,58,30,0.3)";
              (e.currentTarget as HTMLElement).style.background =
                "rgba(106, 58, 30, 0.9)";
              (e.currentTarget as HTMLElement).style.borderColor =
                "rgba(217, 167, 86, 0.6)";
            }}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                transition: "0.35s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as SVGElement).style.transform =
                  "rotate(90deg)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as SVGElement).style.transform =
                  "rotate(0deg)";
              }}
            >
              <title>Close menu popup</title>
              <path d="M18 6L6 18" />
              <path d="M6 6l12 12" />
            </svg>
          </button>

          <DialogContent
            sx={{
              p: 0,
              background: "transparent",
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-start",
              height: "100%",
              overflowY: "auto",
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              style={{
                width: "100%",
                minHeight: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-start",
                padding: "100px 16px 60px", // More top padding for close button on mobile
              }}
            >
              <Box
                sx={{
                  position: "relative",
                  width: "min(1000px, 95vw)",
                  bgcolor: "rgba(255, 253, 251, 0.98)",
                  backdropFilter: "blur(10px)",
                  borderRadius: { xs: "16px", md: "24px" },
                  border: "1px solid rgba(106, 58, 30, 0.15)",
                  boxShadow: "0 25px 50px -12px rgba(106, 58, 30, 0.25)",
                  p: { xs: 2, sm: 3, md: 6 },
                  maxHeight: "none",
                }}
              >
                {/* Category Header - Prominent and Sticky */}
                <Box
                  sx={{
                    position: "sticky",
                    top: 0,
                    bgcolor: "rgba(255, 253, 251, 0.98)",
                    zIndex: 10,
                    pb: 2,
                    mb: 3,
                    borderBottom: "2px solid rgba(217, 167, 86, 0.5)",
                  }}
                >
                  <Typography
                    variant="h3"
                    align="center"
                    sx={{
                      fontFamily: "'Cormorant Garamond', serif",
                      color: "#6A3A1E",
                      fontWeight: 700,
                      fontSize: { xs: "1.75rem", sm: "2rem", md: "2.5rem" },
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      pt: 1,
                    }}
                  >
                    {selectedItem.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    align="center"
                    sx={{
                      fontFamily: "'Inter', sans-serif",
                      color: "rgba(106, 58, 30, 0.6)",
                      fontSize: { xs: "0.8rem", md: "0.9rem" },
                      mt: 0.5,
                    }}
                  >
                    {selectedItem.menuItems?.length || 0} items
                  </Typography>
                </Box>

                {/* Menu Items List - All Items (No Pagination) */}
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                    gap: { xs: 2, md: 3 },
                  }}
                >
                  {(selectedItem?.menuItems || []).map(
                    (mi: DisplayMenuItem, i: number) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: Math.min(i * 0.03, 0.5) }}
                      >
                        <Box
                          sx={{
                            p: { xs: 2, md: 2.5 },
                            height: "100%",
                            borderRadius: "12px",
                            background: "rgba(245, 235, 224, 0.6)",
                            border: "1px solid rgba(106, 58, 30, 0.1)",
                            transition: "all 0.3s ease",
                            "&:hover": {
                              background: "rgba(217, 167, 86, 0.15)",
                              borderColor: "rgba(106, 58, 30, 0.25)",
                              transform: "translateY(-2px)",
                            },
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "baseline",
                              mb: 1,
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
                                fontSize: { xs: "1.1rem", md: "1.4rem" },
                              }}
                            >
                              {mi.name}
                            </Typography>
                            {!mi.hasMeasurements && mi.price && (
                              <Typography
                                variant="h6"
                                sx={{
                                  fontFamily: "'Cormorant Garamond', serif",
                                  color: "#8B5A2B",
                                  fontWeight: 700,
                                  fontSize: { xs: "1rem", md: "1.2rem" },
                                }}
                              >
                                {mi.price}
                              </Typography>
                            )}
                          </Box>

                          {mi.desc && (
                            <Typography
                              variant="body2"
                              sx={{
                                color: "rgba(74, 44, 23, 0.8)",
                                fontFamily: "'Inter', sans-serif",
                                fontSize: { xs: "0.85rem", md: "0.95rem" },
                                lineHeight: 1.6,
                                mb: mi.hasMeasurements ? 2 : 0,
                              }}
                            >
                              {mi.desc}
                            </Typography>
                          )}

                          {/* Measurements */}
                          {mi.hasMeasurements && mi.measurements && (
                            <Box
                              sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 1,
                                mt: "auto",
                              }}
                            >
                              {mi.measurements
                                .filter((m) => m.price > 0)
                                .sort((a, b) => a.sortOrder - b.sortOrder)
                                .map((m, idx) => (
                                  <Box
                                    key={idx}
                                    sx={{
                                      px: 1.5,
                                      py: 0.5,
                                      borderRadius: "20px",
                                      border:
                                        "1px solid rgba(106, 58, 30, 0.25)",
                                      bgcolor: "rgba(217, 167, 86, 0.15)",
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 1,
                                    }}
                                  >
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        color: "#6A3A1E",
                                        fontWeight: 600,
                                        textTransform: "uppercase",
                                        letterSpacing: "0.05em",
                                      }}
                                    >
                                      {m.measurementTypeEntity?.name ||
                                        m.measurementType?.name ||
                                        "Size"}
                                    </Typography>
                                    <Box
                                      sx={{
                                        width: 1,
                                        height: 12,
                                        bgcolor: "rgba(106, 58, 30, 0.25)",
                                      }}
                                    />
                                    <Typography
                                      variant="caption"
                                      sx={{ color: "#4A2C17" }}
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
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
