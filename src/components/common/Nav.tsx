import { useState, useEffect, useRef, useMemo } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
// Modern, distinctive icons for bottom navigation
import CottageRoundedIcon from "@mui/icons-material/CottageRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
// Icons used inline elsewhere — legacy icons removed
import AlternateEmailRoundedIcon from "@mui/icons-material/AlternateEmailRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import { Link } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
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

  // Filter specials that are currently visible (within display date range)
  const visibleSpecials = useMemo(() => {
    if (!specialsData) return [];
    return specialsData.filter(isSpecialVisible);
  }, [specialsData]);

  // Extract unique special types from visible specials only
  const specialTypes = useMemo(() => {
    if (!visibleSpecials || visibleSpecials.length === 0) return [];

    // Get unique types that have at least one visible special
    const typeMap = new Map<
      string,
      { label: string; path: string; id: string }
    >();

    visibleSpecials.forEach((s) => {
      if (!typeMap.has(s.type)) {
        const label =
          s.type.charAt(0).toUpperCase() + s.type.slice(1).replace(/_/g, " ");
        typeMap.set(s.type, {
          label,
          path: `/special/${s.type}`,
          id: s.type,
        });
      }
    });

    // Sort to ensure 'daily' comes first
    const sorted = Array.from(typeMap.values()).sort((a, b) => {
      if (a.id === "daily") return -1;
      if (b.id === "daily") return 1;
      return a.label.localeCompare(b.label);
    });

    return sorted;
  }, [visibleSpecials]);

  // Build navigation links dynamically
  const navLinks: NavNode[] = [
    { label: "Home", path: "/" },
    { label: "About Us", path: "/about" },
    {
      label: "Menu",
      path: "/menu", // Default path when no dropdown items
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
      path: "/special/daily", // Default path when clicking Special
      dropdown: specialTypes.length > 0 ? specialTypes : [],
    },
    { label: "Contact Us", path: "/contactus" },
  ];
  // which top-level parent is open
  const [openParent, setOpenParent] = useState<string | null>(null);
  const [mobileOpenParent, setMobileOpenParent] = useState<string | null>(null);

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
              }}
            >
              {navLinks.map((link) => {
                // If the link has children, check if any child's path matches current location
                const isParentActive = link.dropdown
                  ? link.dropdown.some(
                      (item) =>
                        item.path &&
                        (item.path === "/"
                          ? location.pathname === "/"
                          : location.pathname.startsWith(item.path))
                    )
                  : false;

                const isActive = link.path
                  ? link.path === "/"
                    ? location.pathname === "/"
                    : location.pathname.startsWith(link.path)
                  : isParentActive;

                return link.dropdown ? (
                  <Box
                    key={link.label}
                    sx={{ position: "relative" }}
                    onMouseEnter={() => openParentNow(link.label)}
                    onMouseLeave={scheduleCloseParent}
                  >
                    {/* Parent Button (underline stays when dropdown item page is active) */}
                    <Button
                      component={Link}
                      to={
                        // Use explicit path if defined, otherwise prefer the first dropdown path
                        link.path ||
                        (link.dropdown && link.dropdown.length > 0
                          ? link.dropdown[0].path || "/menu"
                          : "/menu")
                      }
                      color="primary"
                      sx={{
                        fontWeight: 500,
                        textTransform: "none",
                        color: isActive ? "#6A3A1E" : "primary.main",
                        position: "relative",
                        px: 0.5,
                        "&::after": {
                          content: '""',
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          width: isActive ? "100%" : "0%",
                          height: "2px",
                          backgroundColor: "#6A3A1E",
                          transition: "width 0.25s ease",
                          borderRadius: 2,
                        },
                        "&:hover::after": { width: "100%" },
                      }}
                      onClick={closeParentNow}
                    >
                      {link.label}
                    </Button>

                    {openParent === link.label && (
                      <motion.ul
                        onMouseEnter={() => {
                          if (parentCloseTimeout.current) {
                            window.clearTimeout(parentCloseTimeout.current);
                            parentCloseTimeout.current = null;
                          }
                        }}
                        onMouseLeave={scheduleCloseParent}
                        initial={{ opacity: 0, y: -8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.98 }}
                        transition={{ duration: 0.22, ease: "easeOut" }}
                        style={{
                          position: "absolute",
                          top: "100%",
                          left: 0,
                          background:
                            "linear-gradient(180deg, rgba(255,255,255,0.95), rgba(250,250,250,0.90))",
                          borderRadius: 14,
                          boxShadow:
                            "0 10px 30px rgba(0,0,0,0.12), 0 2px 10px rgba(0,0,0,0.06)",
                          padding: "10px 0",
                          listStyle: "none",
                          minWidth: 230,
                          zIndex: 2000,
                          overflow: "hidden",
                          backdropFilter: "blur(12px)",
                          border: "1px solid rgba(255,255,255,0.45)",
                        }}
                      >
                        {link.dropdown!.map((item, index) => {
                          const isChildActive = location.pathname.startsWith(
                            item.path || ""
                          );
                          const isSelectedByQuery =
                            !!item.id && item.id === selectedCategory;

                          return (
                            <motion.li
                              key={item.label}
                              whileHover={{ x: 4 }}
                              transition={{
                                type: "spring",
                                stiffness: 200,
                                damping: 18,
                              }}
                              style={{
                                position: "relative",
                              }}
                            >
                              <Button
                                component={Link}
                                to={item.path || "/"}
                                sx={{
                                  width: "100%",
                                  justifyContent: "flex-start",
                                  textTransform: "none",
                                  px: 3,
                                  py: 1.2,
                                  minWidth: 230,
                                  color:
                                    isChildActive || isSelectedByQuery
                                      ? "#6A3A1E"
                                      : "primary.main",
                                  fontSize: "0.94rem",
                                  borderRadius: 0,
                                  position: "relative",
                                  "&:hover": {
                                    bgcolor: "rgba(245, 240, 235, 0.6)",
                                  },
                                }}
                                onClick={closeParentNow}
                              >
                                {/* Highlight left bar when active or selected by query */}
                                {(isChildActive || isSelectedByQuery) && (
                                  <motion.span
                                    layoutId="special-left-bar"
                                    style={{
                                      position: "absolute",
                                      left: 0,
                                      top: 0,
                                      width: "4px",
                                      height: "100%",
                                      background: "#6A3A1E",
                                      borderRadius: "0 6px 6px 0",
                                    }}
                                  />
                                )}

                                {item.label}
                              </Button>

                              {/* Add subtle divider except last */}
                              {index < link.dropdown!.length - 1 && (
                                <Box
                                  sx={{
                                    width: "85%",
                                    height: "1px",
                                    mx: "auto",
                                    bgcolor: "rgba(0,0,0,0.06)",
                                  }}
                                />
                              )}
                            </motion.li>
                          );
                        })}
                      </motion.ul>
                    )}
                  </Box>
                ) : (
                  // Non dropdown links unchanged
                  <Box key={link.path} sx={{ position: "relative" }}>
                    <Button
                      component={Link}
                      to={link.path!}
                      sx={{
                        fontWeight: 500,
                        textTransform: "none",
                        color: isActive ? "#6A3A1E" : "primary.main",
                        position: "relative",
                        "&:hover": { color: "primary.dark" },
                      }}
                    >
                      {link.label}
                    </Button>
                    {isActive && (
                      <motion.div
                        layoutId="nav-underline"
                        style={{
                          position: "absolute",
                          left: 0,
                          bottom: 0,
                          height: 2,
                          width: "100%",
                          background: "#6A3A1E",
                          borderRadius: 2,
                        }}
                      />
                    )}
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
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Order Online
            </Button>
          </Toolbar>
        </AppBar>
        <Toolbar disableGutters sx={{ minHeight: 0 }} />

        {/* Popup dialog (used for Menu / Special) - desktop */}
        <Dialog
          open={!!mobileOpenParent}
          onClose={() => setMobileOpenParent(null)}
          fullWidth
          maxWidth="xs"
          PaperProps={{
            sx: {
              borderRadius: 3,
              bgcolor: "#FAF7F2",
              border: "2px solid #D9A756",
            },
          }}
        >
          <DialogTitle
            sx={{
              fontWeight: 700,
              textAlign: "center",
              fontFamily: '"Cormorant Garamond", Georgia, serif',
              color: "#3C1F0E",
              fontSize: "1.5rem",
              borderBottom: "1px solid rgba(217,167,86,0.3)",
              pb: 2,
            }}
          >
            {mobileOpenParent}
          </DialogTitle>
          <DialogContent sx={{ py: 2 }}>
            <List>
              {mobileOpenParent &&
                navLinks
                  .find((n) => n.label === mobileOpenParent)
                  ?.dropdown?.map((d) => (
                    <ListItemButton
                      key={d.label}
                      component={Link}
                      to={d.path || "/"}
                      onClick={() => setMobileOpenParent(null)}
                      sx={{
                        justifyContent: "center",
                        py: 1.5,
                        borderRadius: 2,
                        mb: 0.5,
                        "&:hover": {
                          bgcolor: "rgba(217,167,86,0.15)",
                        },
                      }}
                    >
                      <ListItemText
                        primary={d.label}
                        primaryTypographyProps={{
                          align: "center",
                          sx: {
                            fontFamily: '"Inter", sans-serif',
                            fontWeight: 500,
                            fontSize: "1rem",
                            color:
                              d.id && d.id === selectedCategory
                                ? "#D9A756"
                                : "#3C1F0E",
                          },
                        }}
                      />
                    </ListItemButton>
                  ))}
            </List>
          </DialogContent>
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
        }}
      >
        <Toolbar sx={{ py: 0.8 }}>
          <Box
            sx={{
              position: "fixed",
              top: 12, // lifts the bar down a bit (floating look)
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
                  fontWeight: 700,
                  fontSize: "1.15rem",
                  color: "#3C1F0E",
                  display: { xs: "block", md: "none" },
                  lineHeight: 1.1,
                  letterSpacing: "0.02em",
                }}
              >
                The Brooklin Pub
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
                textTransform: "none",
                px: 2.2,
                py: "6px",
                fontSize: "0.85rem",
                fontWeight: 600,
                bgcolor: "#6A3A1E",
                "&:hover": { bgcolor: "#3C1F0E" },
              }}
            >
              Order
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Toolbar sx={{ minHeight: 70 }} />

      {/* FIXED BOTTOM NAV (GLASS FLOATING STYLE) */}
      <Box
        sx={{
          position: "fixed",
          bottom: 12,
          left: "50%",
          transform: "translateX(-50%)",
          width: "90%",
          borderRadius: "50px",
          background: "rgba(255, 255, 255, 0.69)",
          backdropFilter: "blur(18px)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.20)",
          border: "1px solid rgba(255,255,255,0.35)",
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          height: "65px",
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
          sx={{
            minWidth: 0,
            color: location.pathname === "/" ? "#D9A756" : "#6A3A1E",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            p: 0,
          }}
        >
          <CottageRoundedIcon fontSize="medium" />
        </Button>

        {/* About */}
        <Button
          component={Link}
          to="/about"
          disableRipple
          sx={{
            minWidth: 0,
            color: location.pathname.startsWith("/about")
              ? "#D9A756"
              : "#6A3A1E",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            p: 0,
          }}
        >
          <InfoOutlinedIcon fontSize="medium" />
        </Button>

        {/* Menu */}
        <Button
          component={Link}
          to="/menu"
          disableRipple
          sx={{
            minWidth: 0,
            color: location.pathname.startsWith("/menu")
              ? "#D9A756"
              : "#6A3A1E",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            p: 0,
          }}
        >
          <MenuBookRoundedIcon fontSize="medium" />
        </Button>

        {/* Special */}
        <Button
          component={Link}
          to="/special/daily"
          disableRipple
          sx={{
            minWidth: 0,
            color: location.pathname.startsWith("/special")
              ? "#D9A756"
              : "#6A3A1E",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            p: 0,
          }}
        >
          <StarRoundedIcon fontSize="medium" />
        </Button>

        {/* Contact */}
        <Button
          component={Link}
          to="/contactus"
          disableRipple
          sx={{
            minWidth: 0,
            color: location.pathname.startsWith("/contactus")
              ? "#D9A756"
              : "#6A3A1E",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            p: 0,
          }}
        >
          <AlternateEmailRoundedIcon fontSize="medium" />
        </Button>
      </Box>

      {/* Popup dialog (used for Menu / Special) - mobile/bottom nav */}
      <Dialog
        open={!!mobileOpenParent}
        onClose={() => setMobileOpenParent(null)}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: {
            borderRadius: 3,
            bgcolor: "#FAF7F2",
            border: "2px solid #D9A756",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 700,
            textAlign: "center",
            fontFamily: '"Cormorant Garamond", Georgia, serif',
            color: "#3C1F0E",
            fontSize: "1.5rem",
            borderBottom: "1px solid rgba(217,167,86,0.3)",
            pb: 2,
          }}
        >
          {mobileOpenParent}
        </DialogTitle>
        <DialogContent sx={{ py: 2 }}>
          <List>
            {mobileOpenParent &&
              navLinks
                .find((n) => n.label === mobileOpenParent)
                ?.dropdown?.map((d) => (
                  <ListItemButton
                    key={d.label}
                    onClick={() => {
                      const targetPath = d.path;
                      setMobileOpenParent(null);
                      // Navigate after closing dialog
                      setTimeout(() => {
                        if (targetPath) {
                          navigate(targetPath);
                        }
                      }, 100);
                    }}
                    sx={{
                      justifyContent: "center",
                      py: 1.5,
                      borderRadius: 2,
                      mb: 0.5,
                      "&:hover": {
                        bgcolor: "rgba(217,167,86,0.15)",
                      },
                    }}
                  >
                    <ListItemText
                      primary={d.label}
                      primaryTypographyProps={{
                        align: "center",
                        sx: {
                          fontFamily: '"Inter", sans-serif',
                          fontWeight: 500,
                          fontSize: "1rem",
                          color:
                            d.id && d.id === selectedCategory
                              ? "#D9A756"
                              : "#3C1F0E",
                        },
                      }}
                    />
                  </ListItemButton>
                ))}
          </List>
        </DialogContent>
      </Dialog>

      {/* Spacer */}
      <Toolbar sx={{ minHeight: 75 }} />
    </>
  );
};

export default Nav;
