import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { DrawTextSVG } from "../icons/SvgNames";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import { useSearchParams } from "react-router-dom";
import { useApiWithCache } from "../../hooks/useApi";
import { menuService } from "../../services/menu.service";
import type {
  MenuCategory,
  MenuItem as ApiMenuItem,
} from "../../types/api.types";

export default function MainMenu() {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");

  const pathRef = useRef<SVGPathElement | null>(null);
  const ref = useRef<HTMLDivElement | null>(null);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const pageSize = 6;

  type MenuItem = { name: string; desc: string; price: string; image?: string };
  type MenuEntry = {
    mainImage: string;
    name: string;
    namePath: string;
    menuItems: MenuItem[];
    images?: string[];
  };

  const [selectedItem, setSelectedItem] = useState<MenuEntry | null>(null);
  const [focusedItem, setFocusedItem] = useState<MenuItem | null>(null);

  const screenWidth = typeof window !== "undefined" ? window.innerWidth : 1000;
  const containerHeight = 4000;

  // Fetch backend data
  const { data: categories } = useApiWithCache<MenuCategory[]>(
    "menu-categories",
    () => menuService.getCategories()
  );

  const { data: allMenuItems } = useApiWithCache<ApiMenuItem[]>(
    "all-menu-items",
    () => menuService.getAllMenuItems()
  );

  // Helper function to get SVG path for category name
  const getPathForCategory = (_name: string): string => {
    // Return a default path - in production you could generate or store these
    return `M4.20 42.90Q0 42.90 0 39.60Q0 38.05 1.05 36.95Q2.10 35.80 3.55 35.80Q4.60 35.80 5.20 36.50Q5.65 37.10 5.65 37.80Q5.65 38.40 5.43 38.98Q5.20 39.55 4.65 39.95Q3.85 40.70 2.80 40.70Q1.90 40.70 1.30 40.10Q1.85 41.55 4.15 41.55Q4.75 41.55 5.25 41.40Q9.55 40.25 12.75 36.45Q15.50 33.10 19.95 24.35L27.40 9.70Q28.00 8.55 28.78 7.57Q29.55 6.60 30.40 5.80Q28.50 5.85 26.43 6.30Q24.35 6.75 22.10 7.50Q17.55 9.05 15 11.10Q10.10 14.95 10.10 18.25Q10.10 20.20 12.35 20.20Q15 20.20 17.90 18.50Q20.55 16.95 22.50 14.55Q22.65 14.40 22.80 14.40Q23.15 14.40 23.15 14.65Q23.15 16.60 18.35 19.15Q13.95 21.55 11.65 21.55Q7 21.55 7 18Q7 16.35 8.30 14.50Q9.85 12.30 12.45 10.52Q15.05 8.75 18.75 7.40Q25.15 5.05 31.25 5Q34.40 2.30 37.75 2.30Q39.15 2.30 40.40 2.85Q40.65 2.95 40.65 3.20Q40.65 3.95 40.25 3.70Q39.45 3.25 38.25 3.25Q35.85 3.25 33.65 5.05Q37.80 5.45 39.85 7.35Q41.55 9.05 41.55 11.25Q41.55 14.55 38.70 17.85Q35.95 21.05 31.90 22.45Q38.70 23.65 38.70 29.05Q38.70 33.55 34.05 37.70Q29.00 42.15 21.85 42.65Q21.50 42.70 21.13 42.70Q20.75 42.70 20.35 42.70Q13.80 42.70 13.85 38.75Q8.80 42.90 4.20 42.90`;
  };

  // Transform backend data to frontend format
  const menuData: MenuEntry[] = (() => {
    if (!categories || !allMenuItems) return [];

    let filteredCategories = categories.filter((c) => c.isActive);

    // Filter by primary category if specified
    if (categoryParam) {
      filteredCategories = filteredCategories.filter(
        (c) => c.primaryCategoryId === categoryParam
      );
    }

    return filteredCategories
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((category) => {
        const categoryItems = allMenuItems
          .filter((item) => item.categoryId === category.id && item.isAvailable)
          .sort((a, b) => a.sortOrder - b.sortOrder);

        return {
          mainImage:
            categoryItems[0]?.imageUrls?.[0] ||
            "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800",
          name: category.name,
          namePath: getPathForCategory(category.name),
          menuItems: categoryItems.map((item) => ({
            name: item.name,
            desc: item.description || "",
            price: item.price
              ? `$${item.price.toFixed(2)}`
              : item.hasMeasurements
              ? "Market Price"
              : "N/A",
            image: item.imageUrls?.[0] || undefined,
          })),
          images: categoryItems
            .filter((item) => item.imageUrls.length > 0)
            .flatMap((item) => item.imageUrls),
        };
      });
  })();

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

  const pathData = getCurvedPath(containerHeight);

  const [markerPositions, setMarkerPositions] = useState<
    { x: number; y: number }[]
  >([]);

  useEffect(() => {
    const pathEl = pathRef.current;
    if (!pathEl || menuData.length === 0) return;
    const totalLength = pathEl.getTotalLength();
    const step = totalLength / (menuData.length + 1);
    const positions = menuData.map((_, i) => {
      const pt = pathEl.getPointAtLength(step * (i + 1));
      return { x: pt.x, y: pt.y };
    });
    setMarkerPositions(positions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuData.length]);

  // Show loading state while data is being fetched
  if (!categories || !allMenuItems) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ fontSize: 24, color: "#666" }}>Loading menu...</div>
      </div>
    );
  }

  if (menuData.length === 0) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <div style={{ fontSize: 24, color: "#666" }}>No menu items found</div>
        {categoryParam && (
          <div style={{ fontSize: 16, color: "#999" }}>
            Try selecting a different category
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      style={{
        width: "100%",
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#0a0a0a",
        paddingTop: 100,
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: containerHeight,
        }}
      >
        <svg
          viewBox={`0 0 ${screenWidth} ${containerHeight}`}
          preserveAspectRatio="xMidYMid slice"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
          }}
        >
          <defs>
            <linearGradient id="pathGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ff6b6b" stopOpacity={0.4} />
              <stop offset="50%" stopColor="#4ecdc4" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#ffe66d" stopOpacity={0.4} />
            </linearGradient>
          </defs>
          <path
            ref={pathRef}
            d={pathData}
            fill="none"
            stroke="url(#pathGradient)"
            strokeWidth={4}
            opacity={0.5}
          />
          <motion.path
            d={pathData}
            fill="none"
            stroke="#fff"
            strokeWidth={3}
            strokeLinecap="round"
            strokeDasharray="1 0"
            style={{ pathLength }}
          />
        </svg>

        {markerPositions.map((pos, idx) => {
          const item = menuData[idx];
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              style={{
                position: "absolute",
                left: pos.x,
                top: pos.y,
                transform: "translate(-50%, -50%)",
                cursor: "pointer",
                zIndex: 10,
              }}
              onClick={() => {
                setSelectedItem(item);
                setPageIndex(0);
              }}
            >
              <motion.div
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  position: "relative",
                  width: 180,
                  height: 180,
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: "4px solid rgba(255,255,255,0.8)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
                  backgroundColor: "#1a1a1a",
                }}
              >
                <img
                  src={item.mainImage}
                  alt={item.name}
                  loading="lazy"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    width: "100%",
                    padding: "12px 8px",
                    backgroundColor: "rgba(0,0,0,0.75)",
                    textAlign: "center",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 14,
                    backdropFilter: "blur(8px)",
                  }}
                >
                  {item.name}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 + idx * 0.1 }}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "120%",
                  transform: "translateY(-50%)",
                  pointerEvents: "none",
                  zIndex: 5,
                }}
              >
                <DrawTextSVG
                  path={item.namePath}
                  stroke="#ffffff"
                  width={200}
                  scale={0.8}
                />
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedItem && (
          <Dialog
            open={!!selectedItem}
            onClose={() => {
              setSelectedItem(null);
              setFocusedItem(null);
              setPageIndex(0);
            }}
            maxWidth="md"
            fullWidth
            sx={{ zIndex: 10000 }}
            BackdropProps={{
              sx: {
                zIndex: 9990,
                backgroundColor: "rgba(0,0,0,0.85)",
                backdropFilter: "blur(12px)",
              },
            }}
            PaperProps={{
              sx: {
                borderRadius: 3,
                zIndex: 10001,
                bgcolor: "background.paper",
                backgroundImage:
                  "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
                color: "#fff",
              },
            }}
          >
            <DialogContent sx={{ p: 3, position: "relative" }}>
              <IconButton
                aria-label="close"
                onClick={() => {
                  setSelectedItem(null);
                  setFocusedItem(null);
                  setPageIndex(0);
                }}
                size="small"
                sx={{
                  position: "absolute",
                  top: 12,
                  right: 12,
                  color: "#fff",
                  bgcolor: "rgba(255,255,255,0.1)",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
                }}
              >
                ×
              </IconButton>

              <Box sx={{ textAlign: "center", mb: 3 }}>
                <h2 style={{ margin: 0, fontSize: 28, fontWeight: 800 }}>
                  {selectedItem.name}
                </h2>
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {(() => {
                  const start = pageIndex * pageSize;
                  const end = start + pageSize;
                  const pageItems = selectedItem.menuItems.slice(start, end);
                  const totalPages = Math.ceil(
                    selectedItem.menuItems.length / pageSize
                  );

                  return (
                    <>
                      <Box
                        sx={{
                          display: "grid",
                          gridTemplateColumns:
                            "repeat(auto-fill, minmax(200px, 1fr))",
                          gap: 2,
                        }}
                      >
                        {pageItems.map((mi, i) => (
                          <motion.div
                            key={start + i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            onClick={() => setFocusedItem(mi)}
                            style={{
                              cursor: "pointer",
                              borderRadius: 12,
                              overflow: "hidden",
                              backgroundColor: "rgba(255,255,255,0.05)",
                              border: "1px solid rgba(255,255,255,0.1)",
                              transition: "all 0.3s ease",
                            }}
                            whileHover={{
                              scale: 1.03,
                              backgroundColor: "rgba(255,255,255,0.1)",
                            }}
                          >
                            {mi.image && (
                              <img
                                src={mi.image}
                                alt={mi.name}
                                loading="lazy"
                                style={{
                                  width: "100%",
                                  height: 150,
                                  objectFit: "cover",
                                }}
                              />
                            )}
                            <Box sx={{ p: 2 }}>
                              <div style={{ fontWeight: 700, fontSize: 16 }}>
                                {mi.name}
                              </div>
                              <div
                                style={{
                                  color: "#aaa",
                                  fontSize: 14,
                                  marginTop: 4,
                                }}
                              >
                                {mi.price}
                              </div>
                              {mi.desc && (
                                <div
                                  style={{
                                    color: "#888",
                                    fontSize: 12,
                                    marginTop: 8,
                                  }}
                                >
                                  {mi.desc}
                                </div>
                              )}
                            </Box>
                          </motion.div>
                        ))}
                      </Box>

                      {totalPages > 1 && (
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: 2,
                            mt: 2,
                          }}
                        >
                          <IconButton
                            aria-label="previous page"
                            disabled={pageIndex === 0}
                            onClick={() =>
                              setPageIndex((p) => Math.max(0, p - 1))
                            }
                            sx={{ color: "#fff" }}
                          >
                            ‹
                          </IconButton>
                          <span style={{ color: "#aaa" }}>
                            Page {pageIndex + 1} of {totalPages}
                          </span>
                          <IconButton
                            aria-label="next page"
                            disabled={pageIndex >= totalPages - 1}
                            onClick={() =>
                              setPageIndex((p) =>
                                Math.min(totalPages - 1, p + 1)
                              )
                            }
                            sx={{ color: "#fff" }}
                          >
                            ›
                          </IconButton>
                        </Box>
                      )}
                    </>
                  );
                })()}
              </Box>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>

      <Dialog
        open={!!focusedItem}
        onClose={() => setFocusedItem(null)}
        maxWidth="sm"
        sx={{ zIndex: 15000 }}
        BackdropProps={{
          sx: {
            zIndex: 14990,
            backgroundColor: "rgba(0,0,0,0.55)",
          },
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
          {focusedItem?.image && (
            <Box
              component="img"
              src={focusedItem.image}
              alt={focusedItem.name}
              loading="lazy"
              sx={{
                width: "100%",
                height: "auto",
                maxHeight: "70vh",
                objectFit: "cover",
                borderRadius: 1,
              }}
            />
          )}
          <Box sx={{ mt: 1, textAlign: "center" }}>
            <div style={{ fontWeight: 800, fontSize: 18 }}>
              {focusedItem?.name}
            </div>
            <div style={{ color: "#666", marginTop: 4 }}>
              {focusedItem?.price}
            </div>
            {focusedItem?.desc && (
              <div style={{ color: "#444", marginTop: 8 }}>
                {focusedItem.desc}
              </div>
            )}
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
}
