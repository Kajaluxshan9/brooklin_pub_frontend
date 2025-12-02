import { useState, useEffect, useRef, useMemo } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
// Modern, sleek icons for bottom navigation
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import RestaurantMenuRoundedIcon from "@mui/icons-material/RestaurantMenuRounded";
import EventRoundedIcon from "@mui/icons-material/EventRounded";
// Icons used inline elsewhere
import MailRoundedIcon from "@mui/icons-material/MailRounded";
import LocalFireDepartmentRoundedIcon from "@mui/icons-material/LocalFireDepartmentRounded";
import { Link } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { useApiWithCache } from "../../hooks/useApi";
import { menuService } from "../../services/menu.service";
import { specialsService } from "../../services/specials.service";
import type { PrimaryCategory, Special } from "../../types/api.types";

type NavNode = {
  label: string;
  path?: string;
  dropdown?: NavNode[];
  id?: string;
};

// Helper function to check if a special is currently visible based on display dates
const isSpecialVisible = (special: Special): boolean => {
  if (!special.isActive) return false;

  const now = new Date();

  // For specials with display date range (game_time, seasonal, chef)
  if (special.displayStartDate && special.displayEndDate) {
    const startDate = new Date(special.displayStartDate);
    const endDate = new Date(special.displayEndDate);
    return now >= startDate && now <= endDate;
  }

  // For daily specials, always visible if active
  if (special.type === "daily") {
    return true;
  }

  // If no display dates but active, show it
  return true;
};

const Nav = () => {
  // EastServe ordering URL
  const orderUrl =
    "https://www.eastserve.ca/ordering/restaurant/menu?company_uid=f0d6a7d8-6663-43c6-af55-0d11a9773920&restaurant_uid=29e4ef84-c523-4a58-9e4b-6546d6637312&facebook=true";

  // Fetch primary categories from backend
  const { data: primaryCategories } = useApiWithCache<PrimaryCategory[]>(
    "primary-categories",
    () => menuService.getPrimaryCategories()
  );

  // Fetch active specials from backend
  const { data: specialsData } = useApiWithCache<Special[]>(
    "active-specials",
    () => specialsService.getActiveSpecials()
  );

  // Fetch all menu items from backend
  const { data: _menuItems } = useApiWithCache<any[]>("all-menu-items", () =>
    menuService.getAllMenuItems()
  );

  // Filter specials that are currently visible (within display date range)
  const visibleSpecials = useMemo(() => {
    if (!specialsData) return [];
    return specialsData.filter(isSpecialVisible);
  }, [specialsData]);

  // Create two categories: "Daily Specials" (daily + late_night + all_day) and "Specials" (everything else)
  const specialTypes = useMemo(() => {
    if (!visibleSpecials || visibleSpecials.length === 0) return [];

    // Check if there are daily specials (daily type, late_night category, or day_time type)
    const hasDailySpecials = visibleSpecials.some(
      (s) =>
        s.type === "daily" ||
        s.type === "day_time" ||
        s.specialCategory === "late_night"
    );

    // Check if there are other specials (game_time, chef, seasonal, etc.)
    const hasOtherSpecials = visibleSpecials.some(
      (s) =>
        s.type !== "daily" &&
        s.type !== "day_time" &&
        s.specialCategory !== "late_night"
    );

    const categories: { label: string; path: string; id: string }[] = [];

    if (hasDailySpecials) {
      categories.push({
        label: "Daily Specials",
        path: "/special/daily",
        id: "daily",
      });
    }

    if (hasOtherSpecials) {
      categories.push({
        label: "Other Specials",
        path: "/special/other",
        id: "other",
      });
    }

    return categories;
  }, [visibleSpecials]);

  // Build navigation links dynamically
  const navLinks: NavNode[] = [
    { label: "Home", path: "/" },
    { label: "About Us", path: "/about" },
    { label: "Events", path: "/events" },
    {
      label: "Menu",
      path: undefined, // No navigation - dropdown only
      dropdown:
        primaryCategories && primaryCategories.length > 0
          ? primaryCategories
              .filter((pc) => pc.isActive)
              .sort((a, b) => a.sortOrder - b.sortOrder)
              .map((pc) => ({
                label: pc.name,
                path: `/menu?category=${pc.id}`,
                id: pc.id,
              }))
          : [],
    },
    {
      label: "Special",
      path: undefined, // Do not navigate when clicking parent; open dropdown instead
      dropdown: specialTypes.length > 0 ? specialTypes : [],
    },
    { label: "Contact Us", path: "/contactus" },
  ];
  // which top-level parent is open
  const [openParent, setOpenParent] = useState<string | null>(null);
  const [mobileOpenParent, setMobileOpenParent] = useState<string | null>(null);
  // Track which category is expanded in the dropdown
  const [_expandedCategory, setExpandedCategory] = useState<string | null>(
    null
  );

  const location = useLocation();
  const navigate = useNavigate();
  const mobileNavRef = useRef<HTMLDivElement | null>(null);
  const mobileDropdownRef = useRef<HTMLDivElement | null>(null);

  // Helper to parse `categories` fields which might be string, string[] or other
  const parseCategories = (val: any): string[] => {
    if (!val && val !== 0) return [];
    if (Array.isArray(val))
      return val
        .map(String)
        .map((s) => s.trim())
        .filter(Boolean);
    if (typeof val === "string")
      return val
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    return [String(val)];
  };

  // derive list of category names that might be used in query params
  const allCategoryNames = useMemo(() => {
    const fromPrimary = (primaryCategories || [])
      .filter((pc) => pc && pc.id)
      .flatMap((pc) => parseCategories(pc.id));

    // add special types from backend data
    const fromSpecials = (specialsData || [])
      .map((s) => s.type)
      .filter(Boolean);

    return Array.from(new Set(["all", ...fromPrimary, ...fromSpecials]));
  }, [primaryCategories, specialsData]);

  const getCategoryFromQuery = () => {
    try {
      const params = new URLSearchParams(location.search);
      const q = params.get("category");
      if (!q) return allCategoryNames[0] || "all";
      return q;
    } catch (e) {
      return allCategoryNames[0] || "all";
    }
  };

  const [selectedCategory, setSelectedCategory] = useState<string>(
    getCategoryFromQuery()
  );

  useEffect(() => {
    setSelectedCategory(getCategoryFromQuery());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search, allCategoryNames.join(",")]);

  const theme = useTheme();
  const isMobileOrTablet = useMediaQuery(theme.breakpoints.down("md"));

  // Close mobile dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!mobileOpenParent) return;
      const target = e.target as Node | null;
      if (
        mobileDropdownRef.current &&
        (mobileDropdownRef.current.contains(target) ||
          mobileNavRef.current?.contains(target))
      ) {
        return;
      }
      setMobileOpenParent(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [mobileOpenParent]);

  // separate timeout refs so parent/child closing don't conflict
  const parentCloseTimeout = useRef<number | null>(null);

  // Parent-level handlers
  const openParentNow = (label: string) => {
    // cancel any pending parent close
    if (parentCloseTimeout.current) {
      window.clearTimeout(parentCloseTimeout.current);
      parentCloseTimeout.current = null;
    }
    setOpenParent(label);
  };

  const scheduleCloseParent = () => {
    if (parentCloseTimeout.current)
      window.clearTimeout(parentCloseTimeout.current);
    parentCloseTimeout.current = window.setTimeout(() => {
      setOpenParent(null);
      // also clear child when parent closes
      parentCloseTimeout.current = null;
    }, 200); // small delay for pointer movement
  };

  const closeParentNow = () => {
    if (parentCloseTimeout.current) {
      window.clearTimeout(parentCloseTimeout.current);
      parentCloseTimeout.current = null;
    }
    setOpenParent(null);
  };

  // Icon mapping moved inline — Removed legacy `getIconFor` helper to avoid unused variable TS6133

  /** ======= Desktop View ======= */
  if (!isMobileOrTablet) {
    return (
      <Box sx={{ flexGrow: 1 }}>
        <AppBar
          elevation={0}
          sx={{
            position: "fixed",
            top: 12,
            left: "50%",
            transform: "translateX(-50%)",
            width: "85%",
            borderRadius: "50px",
            background: "rgba(255, 255, 255, 0.69)",
            backdropFilter: "blur(18px)",
            boxShadow: "0 4px 24px rgba(0,0,0,0.20)",
            border: "1px solid rgba(255,255,255,0.35)",
            zIndex: 9999,
          }}
        >
          <Toolbar
            disableGutters
            sx={{
              minHeight: "0 !important",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              height: "100%",
              px: 4,
            }}
          >
            <Box
              component="img"
              src="/brooklinpub-logo.png"
              alt="Logo"
              sx={{
                height: { xs: 40, sm: 55, md: 80 },
                padding: "8px 0",
                objectFit: "contain",
                cursor: "pointer",
              }}
            />

            {/* Center Nav Links with animated active underline */}
            <Box
              sx={{
                flexGrow: 1,
                display: "flex",
                justifyContent: "center",
                gap: 3,
                position: "relative",
                alignItems: "center",
              }}
            >
              {navLinks.map((link) => {
                // Determine active state: either the parent's own path matches or any child path matches
                const parentPathMatch = link.path
                  ? link.path === "/"
                    ? location.pathname === "/"
                    : location.pathname.startsWith(link.path)
                  : false;

                const childPathMatch = link.dropdown
                  ? link.dropdown.some((item) => {
                      if (!item.path) return false;
                      try {
                        // Parse the item's path to handle query params (e.g. /menu?category=...)
                        const parsed = new URL(
                          item.path,
                          window.location.origin
                        );
                        // Match when pathname matches (or startsWith for nested routes)
                        if (location.pathname.startsWith(parsed.pathname))
                          return true;
                        // If the item's path included a search (query), also compare search strings
                        if (
                          parsed.search &&
                          location.pathname === parsed.pathname
                        ) {
                          return location.search.startsWith(parsed.search);
                        }
                        return false;
                      } catch (e) {
                        // Fallback: plain startsWith if URL parsing fails
                        return location.pathname.startsWith(
                          item.path as string
                        );
                      }
                    })
                  : false;

                const isActive = parentPathMatch || childPathMatch;

                return link.dropdown ? (
                  <Box
                    key={link.label}
                    sx={{ position: "relative" }}
                    onMouseEnter={() => openParentNow(link.label)}
                    onMouseLeave={scheduleCloseParent}
                  >
                    {/* Parent Button (dropdown) — styled like other nav links; clickable if `path` exists */}
                    {link.path ? (
                      <Button
                        component={Link}
                        to={link.path}
                        onClick={() => closeParentNow()}
                        sx={{
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                          fontFamily: '"Inter", sans-serif',
                          color: isActive ? "#6A3A1E" : "#4A2C17",
                          position: "relative",
                          px: 1,
                          cursor: "pointer",
                          display: "inline-flex",
                          flexDirection: "column",
                          alignItems: "center",
                          fontSize: "0.75rem",
                          lineHeight: 1.2,
                          minHeight: 0,
                          py: 0.5,
                          pb: 1.5,
                          transition: "color 0.2s ease",
                          "&:hover": { color: "#6A3A1E" },
                        }}
                      >
                        {link.label}
                        {/* Active dot indicator */}
                        <Box
                          sx={{
                            position: "absolute",
                            bottom: 2,
                            left: "50%",
                            transform: "translateX(-50%)",
                            width: 5,
                            height: 5,
                            borderRadius: "50%",
                            backgroundColor: "#D9A756",
                            opacity: isActive ? 1 : 0,
                            transition: "opacity 0.25s ease",
                          }}
                        />
                      </Button>
                    ) : (
                      <Button
                        onClick={() => openParentNow(link.label)}
                        sx={{
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                          fontFamily: '"Inter", sans-serif',
                          color: isActive ? "#6A3A1E" : "#4A2C17",
                          position: "relative",
                          px: 1,
                          cursor: "pointer",
                          display: "inline-flex",
                          flexDirection: "column",
                          alignItems: "center",
                          fontSize: "0.75rem",
                          lineHeight: 1.2,
                          minHeight: 0,
                          py: 0.5,
                          pb: 1.5,
                          transition: "color 0.2s ease",
                          "&:hover": { color: "#6A3A1E" },
                        }}
                      >
                        {link.label}
                        {/* Active dot indicator */}
                        <Box
                          sx={{
                            position: "absolute",
                            bottom: 2,
                            left: "50%",
                            transform: "translateX(-50%)",
                            width: 5,
                            height: 5,
                            borderRadius: "50%",
                            backgroundColor: "#D9A756",
                            opacity: isActive ? 1 : 0,
                            transition: "opacity 0.25s ease",
                          }}
                        />
                      </Button>
                    )}

                    {openParent === link.label && (
                      <motion.ul
                        onMouseEnter={() => {
                          if (parentCloseTimeout.current) {
                            window.clearTimeout(parentCloseTimeout.current);
                            parentCloseTimeout.current = null;
                          }
                        }}
                        onMouseLeave={scheduleCloseParent}
                        initial={{ opacity: 0, y: -12, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -12, scale: 0.95 }}
                        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                        style={{
                          position: "absolute",
                          top: "calc(100% + 8px)",
                          left: "50%",
                          transform: "translateX(-50%)",
                          background:
                            "linear-gradient(145deg, rgba(255,255,255,0.98), rgba(253,248,243,0.98))",
                          borderRadius: 20,
                          boxShadow:
                            "0 25px 50px -12px rgba(106, 58, 30, 0.25), 0 12px 24px -8px rgba(0,0,0,0.12), 0 0 0 1px rgba(217, 167, 86, 0.15)",
                          padding: "16px 8px",
                          listStyle: "none",
                          minWidth: 260,
                          maxWidth: 320,
                          maxHeight: "70vh",
                          overflowY: "auto",
                          zIndex: 2000,
                          backdropFilter: "blur(20px)",
                          border: "1px solid rgba(217, 167, 86, 0.2)",
                        }}
                      >
                        {/* Decorative top accent */}
                        <Box
                          component="li"
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            mb: 1.5,
                            pb: 1.5,
                            borderBottom: "1px solid rgba(217, 167, 86, 0.15)",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1.5,
                            }}
                          >
                            <Box
                              sx={{
                                width: 30,
                                height: 1.5,
                                background:
                                  "linear-gradient(90deg, transparent, #D9A756)",
                                borderRadius: 1,
                              }}
                            />
                            <Box
                              sx={{
                                width: 6,
                                height: 6,
                                borderRadius: "50%",
                                backgroundColor: "#D9A756",
                              }}
                            />
                            <Box
                              sx={{
                                width: 30,
                                height: 1.5,
                                background:
                                  "linear-gradient(90deg, #D9A756, transparent)",
                                borderRadius: 1,
                              }}
                            />
                          </Box>
                        </Box>

                        {link.dropdown!.map((item, index) => {
                          const pathWithoutQuery = (item.path || "").split(
                            "?"
                          )[0];
                          const hasQueryParam = (item.path || "").includes(
                            "?category="
                          );
                          const isChildActive = hasQueryParam
                            ? location.pathname === pathWithoutQuery &&
                              !!item.id &&
                              item.id === selectedCategory
                            : location.pathname === pathWithoutQuery;

                          return (
                            <motion.li
                              key={item.label}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{
                                delay: index * 0.05,
                                duration: 0.2,
                              }}
                              style={{
                                position: "relative",
                                margin: "0 4px",
                              }}
                            >
                              <Button
                                component={Link}
                                to={item.path || "/"}
                                sx={{
                                  width: "100%",
                                  justifyContent: "flex-start",
                                  textTransform: "none",
                                  px: 2.5,
                                  py: 1.4,
                                  color: isChildActive ? "#6A3A1E" : "#4A2C17",
                                  fontSize: "0.95rem",
                                  fontWeight: isChildActive ? 600 : 500,
                                  fontFamily: '"Inter", sans-serif',
                                  letterSpacing: "0.02em",
                                  borderRadius: "12px",
                                  position: "relative",
                                  background: isChildActive
                                    ? "linear-gradient(135deg, rgba(217, 167, 86, 0.12), rgba(217, 167, 86, 0.06))"
                                    : "transparent",
                                  transition:
                                    "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                                  overflow: "hidden",
                                  "&::before": {
                                    content: '""',
                                    position: "absolute",
                                    left: 0,
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    width: isChildActive ? 4 : 0,
                                    height: isChildActive ? "60%" : 0,
                                    background:
                                      "linear-gradient(180deg, #D9A756, #B08030)",
                                    borderRadius: "0 4px 4px 0",
                                    transition: "all 0.25s ease",
                                  },
                                  "&:hover": {
                                    bgcolor: "rgba(217, 167, 86, 0.08)",
                                    color: "#6A3A1E",
                                    transform: "translateX(4px)",
                                    "&::before": {
                                      width: 4,
                                      height: "60%",
                                    },
                                  },
                                }}
                                onClick={closeParentNow}
                              >
                                {/* Subtle icon indicator */}
                                <Box
                                  sx={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: "50%",
                                    mr: 1.5,
                                    background: isChildActive
                                      ? "#D9A756"
                                      : "rgba(106, 58, 30, 0.2)",
                                    transition: "all 0.25s ease",
                                    flexShrink: 0,
                                  }}
                                />
                                {item.label}
                              </Button>

                              {/* Subtle divider between items */}
                              {index < link.dropdown!.length - 1 && (
                                <Box
                                  sx={{
                                    width: "70%",
                                    height: "1px",
                                    mx: "auto",
                                    my: 0.5,
                                    background:
                                      "linear-gradient(90deg, transparent, rgba(217, 167, 86, 0.15), transparent)",
                                  }}
                                />
                              )}
                            </motion.li>
                          );
                        })}

                        {/* Decorative bottom accent */}
                        <Box
                          component="li"
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            mt: 1.5,
                            pt: 1.5,
                            borderTop: "1px solid rgba(217, 167, 86, 0.15)",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                            {[...Array(3)].map((_, i) => (
                              <Box
                                key={i}
                                sx={{
                                  width: 4,
                                  height: 4,
                                  borderRadius: "50%",
                                  backgroundColor: "rgba(217, 167, 86, 0.4)",
                                }}
                              />
                            ))}
                          </Box>
                        </Box>
                      </motion.ul>
                    )}
                  </Box>
                ) : (
                  // Non dropdown links
                  <Box
                    key={link.path}
                    sx={{
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      component={Link}
                      to={link.path!}
                      sx={{
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        fontFamily: '"Inter", sans-serif',
                        color: isActive ? "#6A3A1E" : "#4A2C17",
                        position: "relative",
                        lineHeight: 1.2,
                        minHeight: 0,
                        px: 1,
                        py: 0.5,
                        pb: 1.5,
                        fontSize: "0.75rem",
                        display: "inline-flex",
                        flexDirection: "column",
                        alignItems: "center",
                        transition: "color 0.2s ease",
                        "&:hover": { color: "#6A3A1E" },
                      }}
                    >
                      {link.label}
                      {/* Active dot indicator */}
                      {isActive && (
                        <motion.div
                          layoutId="nav-dot"
                          style={{
                            position: "absolute",
                            bottom: 2,
                            left: "50%",
                            transform: "translateX(-50%)",
                            width: 5,
                            height: 5,
                            borderRadius: "50%",
                            background: "#D9A756",
                          }}
                        />
                      )}
                    </Button>
                  </Box>
                );
              })}
            </Box>
            <Button
              variant="contained"
              component="a"
              href={orderUrl}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                ml: 2,
                px: 3,
                py: 1.2,
                borderRadius: 50,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                fontWeight: 700,
                fontSize: "0.8rem",
              }}
            >
              Order Online
            </Button>
          </Toolbar>
        </AppBar>
        <Toolbar disableGutters sx={{ minHeight: 0 }} />

        {/* Popup dialog (used for Menu / Special) - desktop - Premium style */}
        <Dialog
          open={!!mobileOpenParent}
          onClose={() => setMobileOpenParent(null)}
          fullWidth
          maxWidth="xs"
          disableRestoreFocus
          PaperProps={{
            sx: {
              borderRadius: "20px",
              background:
                "linear-gradient(145deg, rgba(255,255,255,0.98), rgba(253,248,243,0.98))",
              backdropFilter: "blur(20px)",
              boxShadow:
                "0 25px 50px -12px rgba(106, 58, 30, 0.25), 0 12px 24px -8px rgba(0,0,0,0.12)",
              border: "1px solid rgba(217, 167, 86, 0.2)",
              overflow: "hidden",
            },
          }}
        >
          {/* Decorative top accent - matching dropdown */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              pt: 2.5,
              pb: 2,
              borderBottom: "1px solid rgba(217, 167, 86, 0.15)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
              }}
            >
              <Box
                sx={{
                  width: 30,
                  height: 1.5,
                  background: "linear-gradient(90deg, transparent, #D9A756)",
                  borderRadius: 1,
                }}
              />
              <Typography
                sx={{
                  fontFamily: '"Cormorant Garamond", Georgia, serif',
                  fontWeight: 700,
                  fontSize: "1.3rem",
                  color: "#3C1F0E",
                  letterSpacing: "0.02em",
                }}
              >
                {mobileOpenParent}
              </Typography>
              <Box
                sx={{
                  width: 30,
                  height: 1.5,
                  background: "linear-gradient(90deg, #D9A756, transparent)",
                  borderRadius: 1,
                }}
              />
            </Box>
          </Box>

          <DialogContent sx={{ py: 2, px: 1.5 }}>
            <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
              {mobileOpenParent &&
                navLinks
                  .find((n) => n.label === mobileOpenParent)
                  ?.dropdown?.map((d, index, arr) => {
                    // For menu items (with query params like /menu?category=xxx), check if the id matches selectedCategory
                    // Only apply selection styling for Menu dropdown when on the /menu page
                    const isMenuPage = location.pathname === "/menu";
                    const hasQueryParam = d.path?.includes("?category=");
                    // For special items (with path segments like /special/daily), check exact path match
                    const pathWithoutQuery = d.path?.split("?")[0] || "";
                    const isActive = hasQueryParam
                      ? isMenuPage && !!d.id && d.id === selectedCategory
                      : d.path && location.pathname === pathWithoutQuery;
                    // Combined selection state (single source of truth)
                    const isSelected = isActive;

                    return (
                      <Box
                        component="li"
                        key={d.label}
                        sx={{ position: "relative", mx: 0.5 }}
                      >
                        <Box
                          component={Link}
                          to={d.path || "/"}
                          onClick={() => setMobileOpenParent(null)}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            width: "100%",
                            textDecoration: "none",
                            px: 2.5,
                            py: 1.6,
                            color: isSelected ? "#6A3A1E" : "#5D4037",
                            fontSize: "1rem",
                            fontWeight: isSelected ? 600 : 400,
                            fontFamily: '"Inter", sans-serif',
                            letterSpacing: "0.02em",
                            borderRadius: "12px",
                            position: "relative",
                            background: isSelected
                              ? "linear-gradient(135deg, rgba(217, 167, 86, 0.15), rgba(217, 167, 86, 0.08))"
                              : "transparent",
                            cursor: "pointer",
                            transition:
                              "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                            "&::before": {
                              content: '""',
                              position: "absolute",
                              left: 0,
                              top: "50%",
                              transform: "translateY(-50%)",
                              width: isSelected ? 4 : 0,
                              height: isSelected ? "60%" : 0,
                              background:
                                "linear-gradient(180deg, #D9A756, #B08030)",
                              borderRadius: "0 4px 4px 0",
                              transition: "all 0.25s ease",
                            },
                            "&:hover": {
                              bgcolor: "rgba(217, 167, 86, 0.08)",
                              color: "#6A3A1E",
                            },
                          }}
                        >
                          {/* Dot indicator - only show when selected */}
                          {isSelected && (
                            <Box
                              sx={{
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                mr: 1.5,
                                background: "#D9A756",
                                flexShrink: 0,
                              }}
                            />
                          )}
                          {d.label}
                        </Box>

                        {/* Subtle divider between items */}
                        {index < arr.length - 1 && (
                          <Box
                            sx={{
                              height: "1px",
                              mx: 3,
                              my: 0.5,
                              background:
                                "linear-gradient(90deg, transparent, rgba(217, 167, 86, 0.15), transparent)",
                            }}
                          />
                        )}
                      </Box>
                    );
                  })}
            </Box>
          </DialogContent>

          {/* Decorative bottom accent */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              pb: 2,
              pt: 1,
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 3,
                background: "linear-gradient(90deg, #D9A756, #B08030)",
                borderRadius: 2,
                opacity: 0.5,
              }}
            />
          </Box>
        </Dialog>
      </Box>
    );
  }

  // ---------- MOBILE LAYOUT (unchanged) ----------
  return (
    <>
      {/* Floating mobile header (logo + title text + CTA) */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          top: 0,
          bgcolor: "transparent",
          zIndex: 1300,
          // ensure AppBar respects iPhone notch area
          paddingTop: "env(safe-area-inset-top, 0px)",
        }}
      >
        <Toolbar
          sx={{ py: 0.8, pt: `calc(env(safe-area-inset-top, 0px) + 6px)` }}
        >
          <Box
            sx={{
              position: "fixed",
              top: `calc(env(safe-area-inset-top, 0px) + 12px)`, // safe-area aware lift
              left: "50%",
              transform: "translateX(-50%)",
              width: "90%", // not full width → floating bar look
              borderRadius: "50px",
              backdropFilter: "blur(18px)",
              background: "rgba(255, 255, 255, 0.69)",
              boxShadow: "0 4px 24px rgba(0,0,0,0.20)", // elegant shadow
              border: "1px solid rgba(255,255,255,0.35)", // glass highlight edge
              transition: "0.25s ease-in-out",
              zIndex: 9999,
              display: "flex",
              justifyContent: "space-between",
              padding: "8px 16px",
            }}
          >
            {/* LOGO + NAME */}
            <Box
              component={Link}
              to="/"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                textDecoration: "none",
              }}
            >
              <Box
                component="img"
                src="/brooklinpub-logo.png"
                alt="Logo"
                sx={{
                  height: 32,
                  objectFit: "contain",
                  cursor: "pointer",
                }}
              />
              <Box
                component="span"
                sx={{
                  fontFamily: '"Cormorant Garamond", Georgia, serif',
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  color: "#3C1F0E",
                  display: { xs: "block", md: "none" },
                  lineHeight: 1.1,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                Brooklin Pub
              </Box>
            </Box>

            {/* ORDER BUTTON */}
            <Button
              variant="contained"
              component="a"
              href={orderUrl}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                borderRadius: 999,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                px: 2.2,
                py: "6px",
                fontSize: "0.75rem",
                fontWeight: 700,
                bgcolor: "#6A3A1E",
                "&:hover": { bgcolor: "#3C1F0E" },
              }}
            >
              Order
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Toolbar
        sx={{ minHeight: `calc(70px + env(safe-area-inset-top, 0px))` }}
      />

      {/* FIXED BOTTOM NAV (GLASS FLOATING STYLE) */}
      <Box
        sx={{
          position: "fixed",
          // respect safe area inset for iPhone home indicator; keep a comfortable offset
          bottom: `calc(env(safe-area-inset-bottom, 0px) + 12px)`,
          left: "50%",
          transform: "translateX(-50%)",
          width:
            "calc(90% - env(safe-area-inset-left, 0px) - env(safe-area-inset-right, 0px))",
          borderRadius: "50px",
          background: "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)", // Safari support
          boxShadow: "0 4px 24px rgba(0,0,0,0.20)",
          border: "1px solid rgba(255,255,255,0.35)",
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          height: "50px",
          padding: "0 10px",
          zIndex: 2000,
        }}
        ref={mobileNavRef}
      >
        {/* Home */}
        <Button
          component={Link}
          to="/"
          disableRipple
          aria-label="Home"
          sx={{
            minWidth: 40,
            minHeight: 40,
            color: location.pathname === "/" ? "#D9A756" : "#6A3A1E",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            p: 0.5,
            borderRadius: "50%",
            transition: "background-color 0.2s ease",
            "&:active": {
              backgroundColor: "rgba(217, 167, 86, 0.15)",
            },
          }}
        >
          <HomeRoundedIcon sx={{ fontSize: 22 }} />
        </Button>

        {/* About */}
        <Button
          component={Link}
          to="/about"
          disableRipple
          aria-label="About Us"
          sx={{
            minWidth: 40,
            minHeight: 40,
            color: location.pathname.startsWith("/about")
              ? "#D9A756"
              : "#6A3A1E",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            p: 0.5,
            borderRadius: "50%",
            transition: "background-color 0.2s ease",
            "&:active": {
              backgroundColor: "rgba(217, 167, 86, 0.15)",
            },
          }}
        >
          <InfoRoundedIcon sx={{ fontSize: 22 }} />
        </Button>

        {/* Events */}
        <Button
          component={Link}
          to="/events"
          disableRipple
          aria-label="Events"
          sx={{
            minWidth: 40,
            minHeight: 40,
            color: location.pathname.startsWith("/events")
              ? "#D9A756"
              : "#6A3A1E",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            p: 0.5,
            borderRadius: "50%",
            transition: "background-color 0.2s ease",
            "&:active": {
              backgroundColor: "rgba(217, 167, 86, 0.15)",
            },
          }}
        >
          <EventRoundedIcon sx={{ fontSize: 22 }} />
        </Button>

        {/* Menu */}
        <Button
          onClick={() => setMobileOpenParent("Menu")}
          disableRipple
          aria-label="Menu"
          sx={{
            minWidth: 40,
            minHeight: 40,
            color: location.pathname.startsWith("/menu")
              ? "#D9A756"
              : "#6A3A1E",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            p: 0.5,
            borderRadius: "50%",
            transition: "background-color 0.2s ease",
            "&:active": {
              backgroundColor: "rgba(217, 167, 86, 0.15)",
            },
          }}
        >
          <RestaurantMenuRoundedIcon sx={{ fontSize: 22 }} />
        </Button>

        {/* Special */}
        <Button
          onClick={() => setMobileOpenParent("Special")}
          disableRipple
          aria-label="Specials"
          sx={{
            minWidth: 40,
            minHeight: 40,
            color: location.pathname.startsWith("/special")
              ? "#D9A756"
              : "#6A3A1E",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            p: 0.5,
            borderRadius: "50%",
            transition: "background-color 0.2s ease",
            "&:active": {
              backgroundColor: "rgba(217, 167, 86, 0.15)",
            },
          }}
        >
          <LocalFireDepartmentRoundedIcon sx={{ fontSize: 22 }} />
        </Button>

        {/* Contact */}
        <Button
          component={Link}
          to="/contactus"
          disableRipple
          aria-label="Contact Us"
          sx={{
            minWidth: 40,
            minHeight: 40,
            color: location.pathname.startsWith("/contactus")
              ? "#D9A756"
              : "#6A3A1E",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            p: 0.5,
            borderRadius: "50%",
            transition: "background-color 0.2s ease",
            "&:active": {
              backgroundColor: "rgba(217, 167, 86, 0.15)",
            },
          }}
        >
          <MailRoundedIcon sx={{ fontSize: 22 }} />
        </Button>
      </Box>

      {/* Popup dialog (used for Menu / Special) - mobile/bottom nav - Desktop style */}
      <Dialog
        open={!!mobileOpenParent}
        onClose={() => setMobileOpenParent(null)}
        fullWidth
        maxWidth="xs"
        disableRestoreFocus
        PaperProps={{
          sx: {
            borderRadius: "20px",
            background:
              "linear-gradient(145deg, rgba(255,255,255,0.98), rgba(253,248,243,0.98))",
            backdropFilter: "blur(20px)",
            boxShadow:
              "0 25px 50px -12px rgba(106, 58, 30, 0.25), 0 12px 24px -8px rgba(0,0,0,0.12)",
            border: "1px solid rgba(217, 167, 86, 0.2)",
            overflow: "hidden",
          },
        }}
      >
        {/* Decorative top accent - matching desktop */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            pt: 2.5,
            pb: 2,
            borderBottom: "1px solid rgba(217, 167, 86, 0.15)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            <Box
              sx={{
                width: 30,
                height: 1.5,
                background: "linear-gradient(90deg, transparent, #D9A756)",
                borderRadius: 1,
              }}
            />
            <Typography
              sx={{
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                fontWeight: 700,
                fontSize: "1.3rem",
                color: "#3C1F0E",
                letterSpacing: "0.02em",
              }}
            >
              {mobileOpenParent}
            </Typography>
            <Box
              sx={{
                width: 30,
                height: 1.5,
                background: "linear-gradient(90deg, #D9A756, transparent)",
                borderRadius: 1,
              }}
            />
          </Box>
        </Box>

        <DialogContent sx={{ py: 2, px: 1.5 }}>
          <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
            {mobileOpenParent &&
              navLinks
                .find((n) => n.label === mobileOpenParent)
                ?.dropdown?.map((d, index, arr) => {
                  // For menu items (with query params like /menu?category=xxx), check if the id matches selectedCategory
                  // Only apply selection styling for Menu dropdown when on the /menu page
                  const isMenuPage = location.pathname === "/menu";
                  const hasQueryParam = d.path?.includes("?category=");
                  // For special items (with path segments like /special/daily), check exact path match
                  const pathWithoutQuery = d.path?.split("?")[0] || "";
                  const isActive = hasQueryParam
                    ? isMenuPage && !!d.id && d.id === selectedCategory
                    : d.path && location.pathname === pathWithoutQuery;
                  // Combined selection state
                  const isSelected = isActive;

                  return (
                    <Box
                      component="li"
                      key={d.label}
                      sx={{ position: "relative", mx: 0.5 }}
                    >
                      <Box
                        component="div"
                        onTouchEnd={(e: React.TouchEvent) => {
                          e.preventDefault();
                          e.stopPropagation();
                          const targetPath = d.path;
                          if (targetPath) {
                            setMobileOpenParent(null);
                            setExpandedCategory(null);
                            setTimeout(() => {
                              navigate(targetPath);
                            }, 50);
                          }
                        }}
                        onClick={(e: React.MouseEvent) => {
                          e.preventDefault();
                          e.stopPropagation();
                          const targetPath = d.path;
                          if (targetPath) {
                            setMobileOpenParent(null);
                            setExpandedCategory(null);
                            setTimeout(() => {
                              navigate(targetPath);
                            }, 50);
                          }
                        }}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          width: "100%",
                          textTransform: "none",
                          px: 2.5,
                          py: 1.6,
                          color: isSelected ? "#6A3A1E" : "#5D4037",
                          fontSize: "1rem",
                          fontWeight: isSelected ? 600 : 400,
                          fontFamily: '"Inter", sans-serif',
                          letterSpacing: "0.02em",
                          borderRadius: "12px",
                          position: "relative",
                          background: isSelected
                            ? "linear-gradient(135deg, rgba(217, 167, 86, 0.15), rgba(217, 167, 86, 0.08))"
                            : "transparent",
                          cursor: "pointer",
                          transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                          WebkitTapHighlightColor: "transparent",
                          "&::before": {
                            content: '""',
                            position: "absolute",
                            left: 0,
                            top: "50%",
                            transform: "translateY(-50%)",
                            width: isSelected ? 4 : 0,
                            height: isSelected ? "60%" : 0,
                            background:
                              "linear-gradient(180deg, #D9A756, #B08030)",
                            borderRadius: "0 4px 4px 0",
                            transition: "all 0.25s ease",
                          },
                          "&:hover": {
                            bgcolor: "rgba(217, 167, 86, 0.08)",
                            color: "#6A3A1E",
                          },
                          "&:active": {
                            bgcolor: "rgba(217, 167, 86, 0.15)",
                            transform: "scale(0.98)",
                          },
                        }}
                      >
                        {/* Dot indicator - only show when selected */}
                        {isSelected && (
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              mr: 1.5,
                              background: "#D9A756",
                              flexShrink: 0,
                            }}
                          />
                        )}
                        {d.label}
                      </Box>

                      {/* Subtle divider between items */}
                      {index < arr.length - 1 && (
                        <Box
                          sx={{
                            width: "70%",
                            height: "1px",
                            mx: "auto",
                            my: 0.5,
                            background:
                              "linear-gradient(90deg, transparent, rgba(217, 167, 86, 0.15), transparent)",
                          }}
                        />
                      )}
                    </Box>
                  );
                })}
          </Box>

          {/* Decorative bottom accent */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: 2,
              pt: 2,
              borderTop: "1px solid rgba(217, 167, 86, 0.15)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              {[...Array(3)].map((_, i) => (
                <Box
                  key={i}
                  sx={{
                    width: 4,
                    height: 4,
                    borderRadius: "50%",
                    backgroundColor: "rgba(217, 167, 86, 0.4)",
                  }}
                />
              ))}
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Spacer to account for bottom nav with safe area */}
      <Toolbar
        sx={{ minHeight: "calc(60px + env(safe-area-inset-bottom, 0px))" }}
      />
    </>
  );
};

export default Nav;
