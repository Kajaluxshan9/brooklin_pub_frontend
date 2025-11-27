import { useRef, useEffect, useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { DrawTextSVG } from "../icons/SvgNames";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useApiWithCache } from "../../hooks/useApi";
import { menuService } from "../../services/menu.service";
import type {
  MenuCategory,
  MenuItem,
  MenuItemMeasurement,
} from "../../types/api.types";

export default function MainMenu() {
  const pathRef = useRef<SVGPathElement | null>(null);
  const ref = useRef<HTMLDivElement | null>(null);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const pageSize = 6;

  // Fetch data from backend
  const { data: categories } = useApiWithCache<MenuCategory[]>(
    "menu-categories",
    () => menuService.getCategories()
  );

  const { data: menuItems } = useApiWithCache<MenuItem[]>(
    "all-menu-items",
    () => menuService.getAllMenuItems()
  ); // Type definitions matching the UI structure
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

  const [focusedItem, setFocusedItem] = useState<DisplayMenuItem | null>(null);
  const screenWidth = typeof window !== "undefined" ? window.innerWidth : 1000;
  const containerHeight = 4000;
  const padding = 36;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const left = 0;
  const right = screenWidth;
  const centerX = screenWidth / 2;

  const getCurvedPath = (h: number) => `
    M${left} 0
    C${right * 0.25} ${h * 0.1},
     ${right * 0.75} ${h * 0.2},
     ${right} ${h * 0.3}
    S${left} ${h * 0.45},
     ${right} ${h * 0.6}
    S${left} ${h * 0.75},
     ${right} ${h * 0.9}
    S${centerX} ${h * 0.97},
     ${centerX} ${h}
  `;

  const [gridConfig, setGridConfig] = useState<{
    cols: number;
    rows: number;
    cellSize: number;
    gap: number;
    containerWidth: number;
    containerHeight?: number;
  }>({ cols: 1, rows: 1, cellSize: 120, gap: 18, containerWidth: 0 });

  const [selectedItem, setSelectedItem] = useState<MenuEntry | null>(null);

  const clamp = (val: number, a: number, b: number) =>
    Math.max(a, Math.min(val, b));

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
            // Don't show price if item has measurements - those will be shown from measurement records
            let priceDisplay = "";
            if (!item.hasMeasurements && item.price != null && item.price > 0) {
              priceDisplay = `$${item.price.toFixed(2)}`;
            }

            return {
              name: item.name,
              desc: item.description || "",
              price: priceDisplay,
              image: item.imageUrls?.[0] || "https://via.placeholder.com/300",
              measurements: item.measurements,
              hasMeasurements: item.hasMeasurements,
            } as DisplayMenuItem;
          });

        // Generate a simple SVG path for the category name
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
            category.imageUrl ||
            categoryItems[0]?.image ||
            "https://via.placeholder.com/400",
          name: category.name,
          namePath: generateNamePath(category.name),
          menuItems: categoryItems,
          categoryId: category.id,
          primaryCategoryId: category.primaryCategoryId,
        } as MenuEntry;
      })
      .filter((entry) => entry.menuItems.length > 0); // Only show categories with items
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

  useEffect(() => {
    setPageIndex(0);
    setFocusedItem(null);
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

  // Generate grid-based points (replaces path-based random placement)
  useEffect(() => {
    const generateGridPoints = () => {
      const numPoints = filteredMenu.length;
      const sw =
        (typeof window !== "undefined" ? window.innerWidth : screenWidth) ||
        screenWidth;
      const newPoints: { x: number; y: number; size: number }[] = [];

      // Decide columns based on viewport: single-column layout for mobile
      const isMobileLocal = sw < 768;
      // On mobile show a single column, otherwise try up to 3 columns
      const desiredCols = isMobileLocal ? 1 : 3;
      const cols = Math.min(desiredCols, Math.max(1, numPoints));
      const rows = Math.ceil(numPoints / cols);

      // compute widths/heights based on computed rows/cols so grid scales with item count
      const usableWidth = Math.max(300, sw - padding * 2);
      const cellWidth = usableWidth / cols;

      // size caps
      const maxSizeDesktop = 260;
      const maxSizeMobile = 160;
      const maxAllowed = isMobileLocal ? maxSizeMobile : maxSizeDesktop;

      // compute a compact container height derived from rows so page height adapts to item count
      const gap = Math.max(12, Math.round(cellWidth * 0.06));
      const approxCell = Math.floor(
        Math.max(40, Math.min(cellWidth * 0.78, maxAllowed))
      );
      const estimatedRowsHeight = rows * (approxCell + gap + 16); // 16px extra for labels/padding
      const containerHeightUsed = Math.max(
        estimatedRowsHeight + padding * 2,
        380
      );

      // Single item -> center it and make it large
      if (numPoints === 1) {
        const swCenter = sw / 2;
        const availWidth = sw - padding * 2;
        const availHeight = containerHeightUsed - padding * 2;
        const fullSize = Math.max(140, Math.min(availWidth, availHeight));
        const finalX = clamp(
          swCenter,
          padding + fullSize / 2,
          sw - padding - fullSize / 2
        );
        const finalY = clamp(
          containerHeightUsed / 2,
          padding + fullSize / 2,
          containerHeightUsed - padding - fullSize / 2
        );
        newPoints.push({ x: finalX, y: finalY, size: fullSize });
      } else {
        // distribute rows evenly through available container height (respecting padding)
        const availableHeight = Math.max(
          300,
          containerHeightUsed - padding * 2
        );
        const rowGap = Math.floor(availableHeight / (rows + 1));

        for (let i = 0; i < numPoints; i++) {
          const col = i % cols;
          const row = Math.floor(i / cols);

          // center of the cell (x based on columns, y spreads across rows using rowGap)
          const cx = padding + cellWidth * col + cellWidth / 2;
          const cy = padding + rowGap * (row + 1);

          // size scales with available cell space; reduce size when many items exist
          const sizeFromWidth = Math.floor(cellWidth * 0.78);
          const sizeFromHeight = Math.floor(rowGap * 0.7);
          // reduce scale slightly when many rows to avoid overlap
          const densityFactor = Math.max(0.5, 1 - (rows - 1) * 0.08);
          let size = Math.floor(
            Math.min(sizeFromWidth, sizeFromHeight) * densityFactor
          );
          size = Math.max(40, Math.min(size, maxAllowed));

          const finalX = clamp(cx, padding + size / 2, sw - padding - size / 2);
          const finalY = clamp(
            cy,
            padding + size / 2,
            containerHeightUsed - padding - size / 2
          );

          newPoints.push({ x: finalX, y: finalY, size });
        }
      }

      // also expose computed grid config so rendering can use a CSS grid
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

  // mobile-detection removed; previously used for popup layout

  // Inject Google Fonts link for the Inspiration family (only once)
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
      "https://fonts.googleapis.com/css2?family=Corinthia&family=Carattere&family=Cedarville+Cursive&family=Great+Vibes&family=Inspiration&family=Momo+Signature&family=Moon+Dance&display=swap";
    sheet.id = "fonts-inspiration-stylesheet";
    document.head.appendChild(sheet);

    return () => {
      // keep links during the session; do not remove on unmount
    };
  }, []);

  // Ensure the sticky heading sits below any site nav bar. We measure common
  // nav/header elements and offset the heading so it doesn't get hidden.
  const [, setHeaderOffset] = useState<number>(0);
  useEffect(() => {
    if (typeof document === "undefined") return;
    const selectors = [
      "nav",
      "header",
      "#nav",
      ".nav",
      ".Nav",
      ".navbar",
      ".nav-bar",
    ];
    const measure = () => {
      let h = 0;
      for (const sel of selectors) {
        const el = document.querySelector(sel) as HTMLElement | null;
        if (el && el.offsetHeight) {
          h = Math.max(h, el.offsetHeight);
        }
      }

      // ensure a minimum top offset of 100px across all devices so the heading
      // never sits under small navbars and is consistently positioned.
      const buffer = 8;
      const minTop = 100;
      setHeaderOffset(Math.max(h + buffer, minTop));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // No empty-cell allocation needed: show every menu item.
  const effectiveContainerHeight =
    gridConfig.containerHeight ?? containerHeight;

  return (
    <div
      ref={ref}
      style={{
        height: effectiveContainerHeight,
        background: "var(--wine-red)",
        position: "relative",
        overflow: "visible",
      }}
    >
      <svg
        width="100%"
        height={effectiveContainerHeight}
        viewBox={`0 0 ${screenWidth} ${effectiveContainerHeight}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          position: "sticky",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          overflow: "visible",
        }}
      >
        <motion.path
          ref={pathRef}
          d={getCurvedPath(effectiveContainerHeight)}
          stroke="white"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
          style={{ pathLength }}
        />
      </svg>
      {/* Grid-aligned layout: centered container whose width depends on item count */}
      <div
        style={{
          position: "absolute",
          // start a little below the top padding and spread to bottom padding
          top: padding,
          left: "50%",
          transform: "translateX(-50%)",
          width: gridConfig.containerWidth ? gridConfig.containerWidth : "90%",
          // make the grid fill the available container height so rows distribute evenly
          height: gridConfig.containerHeight
            ? gridConfig.containerHeight - padding * 2
            : effectiveContainerHeight - padding * 2,
          display: "grid",
          gridTemplateColumns: `repeat(${gridConfig.cols}, 1fr)`,
          // rows should split the full height equally
          gridTemplateRows: `repeat(${gridConfig.rows}, 1fr)`,
          gap: `${gridConfig.gap}px`,
          justifyContent: "center",
          alignContent: "stretch",
          zIndex: 10,
          paddingBottom: 100,
        }}
      >
        {filteredMenu.map((item: MenuEntry, idx: number) => {
          // compute per-row height and choose item size so it fits comfortably in the row
          const availableHeight =
            effectiveContainerHeight -
            padding * 2 -
            gridConfig.gap * (gridConfig.rows - 1);
          const rowHeight =
            gridConfig.rows > 0
              ? Math.floor(availableHeight / gridConfig.rows)
              : availableHeight;
          const size = Math.min(
            gridConfig.cellSize || 220,
            Math.max(40, Math.floor(rowHeight * 0.78))
          );

          // Render every item (no empty cells)

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
                gap: "10px",
                cursor: "pointer",
              }}
              whileHover={{
                filter: "brightness(1.03)",
              }}
              transition={{ type: "spring", stiffness: 200, damping: 18 }}
            >
              {/* image circle wrapper */}
              <div
                style={{
                  width: size,
                  height: size,
                  borderRadius: "50%",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#111",
                  border: "4px solid white",
                  boxShadow: "0 12px 30px rgba(0,0,0,0.7)",
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
                  whileHover={{ filter: "brightness(1.08) contrast(1.05)" }}
                  transition={{ duration: 0.25 }}
                />
              </div>

              {/* svg name under the image */}
              <div
                style={{
                  width: Math.min(
                    size * 1.1,
                    gridConfig.containerWidth || 9999
                  ),
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  pointerEvents: "none",
                }}
              >
                <DrawTextSVG
                  text={item.name}
                  width={size}
                  stroke="white"
                  scale={1.2}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
      {/* Popup/modal for submenu - show all images for the menu item (images only) */}
      {selectedItem && (
        <>
          <Dialog
            open={!!selectedItem}
            onClose={() => setSelectedItem(null)}
            maxWidth="lg"
            sx={{ zIndex: 14000 }}
            BackdropProps={{
              sx: { zIndex: 13990, backgroundColor: "rgba(0,0,0,0.45)" },
            }}
            PaperProps={{
              sx: {
                background: "transparent",
                boxShadow: "none",
                overflow: "visible",
                zIndex: 14001,
              },
            }}
          >
            <DialogContent
              sx={{
                p: 2,
                display: "flex",
                justifyContent: "center",
                background: "transparent",
              }}
            >
              <Box
                sx={{
                  position: "relative",
                  width: "min(920px, 96vw)",
                  bgcolor: "background.paper",
                  borderRadius: 2,
                  boxShadow: 6,
                  p: 2,
                }}
              >
                <IconButton
                  aria-label="close"
                  onClick={() => setSelectedItem(null)}
                  size="large"
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                  }}
                >
                  <span style={{ fontSize: 20, lineHeight: 1 }}>×</span>
                </IconButton>

                {/* List view: show menu items with measurements */}
                <AnimatePresence mode="wait">
                  <Box
                    key={pageIndex}
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                  >
                    {(
                      selectedItem?.menuItems?.slice(
                        pageIndex * pageSize,
                        (pageIndex + 1) * pageSize
                      ) || []
                    ).map((mi: DisplayMenuItem, i: number) => (
                      <motion.div
                        key={`${pageIndex}-${i}`}
                        layoutId={`item-${mi.name}-${i}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{
                          delay: i * 0.05,
                          duration: 0.3,
                          ease: "easeOut",
                        }}
                      >
                        <Box
                          onClick={() => setFocusedItem(mi)}
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            gap: 2,
                            p: 2,
                            cursor: "pointer",
                            borderRadius: 2,
                            border: "1px solid rgba(0,0,0,0.08)",
                            bgcolor: "background.paper",
                            transition: "all 200ms ease",
                            "&:hover": {
                              bgcolor: "rgba(184, 115, 51, 0.05)",
                              borderColor: "rgba(184, 115, 51, 0.3)",
                              transform: "translateX(4px)",
                              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                            },
                          }}
                        >
                          {/* Item details - taking full width */}
                          <Box
                            sx={{
                              flex: 1,
                              display: "flex",
                              flexDirection: "column",
                              gap: 0.5,
                            }}
                          >
                            <Typography
                              variant="h6"
                              sx={{ fontWeight: 700, color: "#1a1a1a" }}
                            >
                              {mi.name}
                            </Typography>

                            {mi.desc && (
                              <Typography
                                variant="body2"
                                sx={{ color: "#666", fontSize: "0.9rem" }}
                              >
                                {mi.desc}
                              </Typography>
                            )}

                            {/* Show measurements if available */}
                            {mi.hasMeasurements &&
                              mi.measurements &&
                              mi.measurements.length > 0 ? (
                              <Box
                                sx={{
                                  mt: 1,
                                  display: "flex",
                                  flexWrap: "wrap",
                                  gap: 1.5,
                                }}
                              >
                                {mi.measurements
                                  .filter((m) => m.price > 0)
                                  .sort((a, b) => a.sortOrder - b.sortOrder)
                                  .map((measurement, idx) => (
                                    <Box
                                      key={idx}
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 0.5,
                                        px: 1.5,
                                        py: 0.5,
                                        borderRadius: 1,
                                        bgcolor: "rgba(184, 115, 51, 0.1)",
                                        border:
                                          "1px solid rgba(184, 115, 51, 0.2)",
                                      }}
                                    >
                                      <Typography
                                        variant="body2"
                                        sx={{
                                          fontWeight: 600,
                                          color: "#b87333",
                                        }}
                                      >
                                        {measurement.measurementTypeEntity
                                          ?.name ||
                                          measurement.measurementType?.name ||
                                          "Size"}
                                      </Typography>
                                      <Typography
                                        variant="body2"
                                        sx={{ color: "#666" }}
                                      >
                                        ${measurement.price.toFixed(2)}
                                      </Typography>
                                    </Box>
                                  ))}
                              </Box>
                            ) : mi.price ? (
                              <Typography
                                variant="body1"
                                sx={{
                                  fontWeight: 700,
                                  color: "#b87333",
                                  mt: 0.5,
                                }}
                              >
                                {mi.price}
                              </Typography>
                            ) : null}
                          </Box>
                        </Box>
                      </motion.div>
                    ))}
                  </Box>
                </AnimatePresence>

                {(selectedItem?.menuItems?.length || 0) > pageSize &&
                  (() => {
                    const totalPages = Math.ceil(
                      (selectedItem?.menuItems?.length || 0) / pageSize
                    );

                    const prevPage = Math.max(0, pageIndex - 1);
                    const nextPage = Math.min(totalPages - 1, pageIndex + 1);

                    return (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 2,
                          mt: 2,
                        }}
                      >
                        {/* LEFT ARROW */}
                        <IconButton
                          aria-label="previous page"
                          onClick={() => setPageIndex(prevPage)}
                          disabled={pageIndex === 0}
                        >
                          ‹
                        </IconButton>

                        {/* DOTS */}
                        <Box sx={{ display: "flex", gap: 1 }}>
                          {/* PREVIOUS DOT */}
                          <motion.div
                            onClick={() =>
                              pageIndex > 0 && setPageIndex(prevPage)
                            }
                            animate={{
                              scale: pageIndex === 0 ? 0.5 : 0.7,
                              opacity: pageIndex === 0 ? 0.3 : 1,
                              backgroundColor:
                                pageIndex === 0 ? "#bdbdbd" : "#757575",
                            }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                            style={{
                              width: 10,
                              height: 10,
                              borderRadius: "50%",
                              cursor: pageIndex === 0 ? "default" : "pointer",
                            }}
                          />

                          {/* ACTIVE DOT */}
                          <motion.div
                            animate={{
                              scale: 1.4,
                              backgroundColor: "var(--wine-red)",
                            }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                            style={{
                              width: 12,
                              height: 12,
                              borderRadius: "50%",
                            }}
                          />

                          {/* NEXT DOT */}
                          <motion.div
                            onClick={() =>
                              pageIndex < totalPages - 1 &&
                              setPageIndex(nextPage)
                            }
                            animate={{
                              scale: pageIndex === totalPages - 1 ? 0.5 : 0.7,
                              opacity: pageIndex === totalPages - 1 ? 0.3 : 1,
                              backgroundColor:
                                pageIndex === totalPages - 1
                                  ? "#bdbdbd"
                                  : "#757575",
                            }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                            style={{
                              width: 10,
                              height: 10,
                              borderRadius: "50%",
                              cursor:
                                pageIndex === totalPages - 1
                                  ? "default"
                                  : "pointer",
                            }}
                          />
                        </Box>

                        {/* RIGHT ARROW */}
                        <IconButton
                          aria-label="next page"
                          onClick={() => setPageIndex(nextPage)}
                          disabled={pageIndex === totalPages - 1}
                        >
                          ›
                        </IconButton>
                      </Box>
                    );
                  })()}

                {/* Focused item: opening in a separate dialog (nested popup) */}
                {/* Inline details panel removed; a nested Dialog is rendered below when focusedItem is set. */}

                {/* Removed main image; thumbnails are shown in the grid above with pagination */}
              </Box>
            </DialogContent>
          </Dialog>

          {/* Nested details dialog for the clicked thumbnail (separate popup) */}
          <Dialog
            open={!!focusedItem}
            onClose={() => setFocusedItem(null)}
            maxWidth="sm"
            sx={{ zIndex: 15000 }}
            BackdropProps={{
              sx: { zIndex: 14990, backgroundColor: "rgba(0,0,0,0.55)" },
            }}
            PaperProps={{ sx: { borderRadius: 2, zIndex: 15001 } }}
          >
            <DialogContent
              sx={{ p: 2, position: "relative", bgcolor: "background.paper" }}
            >
              <IconButton
                aria-label="close details"
                onClick={() => setFocusedItem(null)}
                size="small"
                sx={{ position: "absolute", top: 8, right: 8 }}
              >
                ×
              </IconButton>
              <Box
                component="img"
                src={focusedItem?.image || selectedItem?.mainImage}
                alt={focusedItem?.name}
                loading="lazy"
                sx={{
                  width: "100%",
                  height: "auto",
                  maxHeight: "70vh",
                  objectFit: "cover",
                  borderRadius: 1,
                }}
              />
              <Box sx={{ mt: 1, textAlign: "center" }}>
                <div style={{ fontWeight: 800, fontSize: 18 }}>
                  {focusedItem?.name}
                </div>

                {/* Display measurements if available */}
                {focusedItem?.hasMeasurements &&
                  focusedItem?.measurements &&
                  focusedItem.measurements.length > 0 ? (
                  <div style={{ marginTop: 8 }}>
                    {focusedItem.measurements
                      .filter((m) => m.price > 0)
                      .sort((a, b) => a.sortOrder - b.sortOrder)
                      .map((measurement, idx) => (
                        <div key={idx} style={{ color: "#666", marginTop: 4 }}>
                          {measurement.measurementTypeEntity?.name ||
                            measurement.measurementType?.name ||
                            "Size"}
                          : ${measurement.price.toFixed(2)}
                        </div>
                      ))}
                  </div>
                ) : focusedItem?.price ? (
                  <div style={{ color: "#666", marginTop: 4 }}>
                    {focusedItem?.price}
                  </div>
                ) : null}

                <div style={{ color: "#444", marginTop: 8 }}>
                  {focusedItem?.desc}
                </div>
              </Box>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}
