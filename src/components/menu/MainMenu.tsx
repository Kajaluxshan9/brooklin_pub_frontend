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
import MenuBackground from "./PopupBackground";
import PopupCloseButton from "./PopupCloseButton";
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
    description?: string;
    categoryId?: string;
    primaryCategoryId?: string;
  };

  const padding = 36;

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
    <div
      ref={ref}
      style={{
        paddingTop: padding,
        paddingBottom: padding,
        background: "var(--dark-color-lighten)",
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style>{`
        :root {
          --dark-color-lighten: #f2f5ff;
          --red-card: #a62121;
          --blue-card: #4bb7e6;
          --btn: #141414;
          --btn-hover: #3a3a3a;
          --text: #fbf7f7;
        }
        
        .nike-card {
          position: relative;
          padding: 1rem;
          width: 320px;
          height: auto;
          box-shadow: -1px 15px 30px -12px rgb(32, 32, 32);
          border-radius: 50%;
          color: var(--text);
          cursor: pointer;
          transform-style: preserve-3d;
          transition: transform 0.3s ease;
          background-color: var(--red-card);
          overflow: visible;
        }

        .nike-card.card-blue {
          background: var(--blue-card);
        }
        
        .nike-card.card-brown {
          background: #6A3A1E;
        }
        .nike-card.card-gold {
          background: #D9A756;
        }

        .nike-card .product-image {
          height: 230px;
          width: 100%;
          transform: translate(0, );
          transition: transform 500ms ease-in-out;
          filter: drop-shadow(5px 10px 15px rgba(8, 9, 13, 0.4));
          display: flex;
          justify-content: center;
          align-items: center;
        }
        
        .nike-card .product-image img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          user-select: none;
        }

        .nike-card:hover .product-image {
          transform: translate(-1.5rem, -1rem) rotate(-20deg);
        }

        .nike-card .product-info {
          text-align: center;
          margin-top: 1rem;
        }

        .nike-card .product-info h2 {
          font-size: 1.4rem;
          font-weight: 600;
          font-family: "Montserrat", sans-serif;
          margin-bottom: 0.5rem;
        }

        .nike-card .product-info p {
          margin: 0.4rem;
          font-size: 0.8rem;
          font-weight: 600;
          font-family: "Montserrat", sans-serif;
          opacity: 0.9;
        }

        .nike-card .price {
          font-size: 1.2rem;
          font-weight: 500;
          margin-top: 0.5rem;
          font-family: "Montserrat", sans-serif;
        }

        .nike-card .btn {
          display: flex;
          justify-content: space-evenly;
          align-items: center;
          margin-top: 1.5rem;
        }

        .nike-card .buy-btn {
          background-color: var(--btn);
          padding: 0.6rem 2.5rem;
          font-weight: 600;
          font-size: 1rem;
          transition: 300ms ease;
          border: none;
          border-radius: 0.2rem;
          color: var(--text);
          cursor: pointer;
          font-family: "Montserrat", sans-serif;
        }

        .nike-card .buy-btn:hover {
          background-color: var(--btn-hover);
        }

        .nike-card .fav {
          box-sizing: border-box;
          background: #fff;
          padding: 0.5rem 0.5rem;
          border: 1px solid #000;
          display: grid;
          place-items: center;
          border-radius: 0.2rem;
          cursor: pointer;
        }

        .nike-card .fav .svg {
          height: 25px;
          width: 25px;
          fill: #fff;
          stroke: #000;
          stroke-width: 2;
          transition: all 500ms ease;
        }

        .nike-card .fav:hover .svg {
          fill: #000;
        }
      `}</style>

      <MenuBackground />

      <div
        style={{
          position: "relative",
          margin: "0 auto",
          width: "100%",
          maxWidth: "1400px",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "60px 40px",
          zIndex: 10,
          padding: "40px 20px",
        }}
      >
        {filteredMenu.map((item: MenuEntry, idx: number) => {
          const cardClass = idx % 2 === 0 ? "card-brown" : "card-gold";

          return (
            <div
              key={idx}
              className={`nike-card ${cardClass}`}
              onClick={() => setSelectedItem(item)}
            >
              <div className="product-image">
                <img src={item.mainImage} alt={item.name} draggable="false" />
              </div>
              <div className="product-info">
                <div style={{ height: '60px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <DrawTextSVG
                    text={item.name}
                    width={280}
                    stroke="var(--text)"
                    scale={1}
                  />
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {selectedItem && (
        <Dialog
          open={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          fullWidth
          maxWidth="lg"
          sx={{ zIndex: 14000 }}
          PaperProps={{
            sx: {
              background: "transparent",
              boxShadow: "none",
              overflow: "hidden",
              maxHeight: "auto",
              borderRadius: { xs: 2, md: 3 },
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
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-start",
                padding: "40px 16px 24px",
              }}
            >
              <Box
                sx={{
                  position: "relative",
                  width: "min(1400px, 98vw)",
                  bgcolor: "rgba(255, 253, 251, 0.98)",
                  backdropFilter: "blur(10px)",
                  borderRadius: { xs: "12px", md: "18px" },
                  border: "1px solid rgba(106, 58, 30, 0.15)",
                  boxShadow: "0 25px 50px -12px rgba(106, 58, 30, 0.25)",
                  p: { xs: 2, sm: 3, md: 4 },
                  maxHeight: "calc(80vh - 80px)",
                  overflow: "hidden",
                }}
              >
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
                      fontSize: { xs: "0.9rem", md: "1rem" },
                      mt: 0.5,
                    }}
                  >
                    {selectedItem?.description && selectedItem.description.length > 0
                      ? selectedItem.description
                      : `description`}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    overflowY: "auto",
                    pr: 1,
                    maxHeight: "calc(80vh - 220px)",
                  }}
                >
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                      gap: { xs: 2, md: 3 },
                      pb: 2,
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
              </Box>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
