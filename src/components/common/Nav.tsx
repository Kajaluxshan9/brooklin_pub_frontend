"use client";
import { useState, useEffect, useRef } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import RestaurantMenuRoundedIcon from "@mui/icons-material/RestaurantMenuRounded";
import LocalFireDepartmentRoundedIcon from "@mui/icons-material/LocalFireDepartmentRounded";
import LocalBarRoundedIcon from "@mui/icons-material/LocalBarRounded";
import NightlightRoundedIcon from "@mui/icons-material/NightlightRounded";
import ContactSupportRoundedIcon from "@mui/icons-material/ContactSupportRounded";
import { Link } from "react-router-dom";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { hasNewSpecial } from "../../lib/specials";

type NavNode = { label: string; path?: string; dropdown?: NavNode[] };

const navLinks: NavNode[] = [
  { label: "Home", path: "/" },
  { label: "About Us", path: "/about" },

  {
    label: "Menu",
    dropdown: [
      { label: "Main Menu", path: "/menu/main-menu" },
      { label: "Drinks Menu", path: "/menu/drink-menu" },
    ],
  },

  {
    label: "Special",
    dropdown: [
      { label: "Daily Special", path: "/special/daily" },
      { label: "Night Special", path: "/special/night" },
    ],
  },

  { label: "Contact Us", path: "/contactus" },
];

const Nav = () => {
  // which top-level parent is open
  const [openParent, setOpenParent] = useState<string | null>(null);
  const [mobileOpenParent, setMobileOpenParent] = useState<string | null>(null);
  // which second-level child is open (inside the parent)

  const location = useLocation();
  const mobileNavRef = useRef<HTMLDivElement | null>(null);
  const mobileDropdownRef = useRef<HTMLDivElement | null>(null);

  const theme = useTheme();
  const isMobileOrTablet = useMediaQuery(theme.breakpoints.down("md"));

  const [showSpecialBadge, setShowSpecialBadge] = useState<boolean>(() =>
    typeof window !== "undefined" ? hasNewSpecial() : false
  );

  useEffect(() => {
    const onUpdate = () => setShowSpecialBadge(hasNewSpecial());
    if (typeof window !== "undefined" && (window as any).addEventListener) {
      window.addEventListener("specials-updated", onUpdate);
    }
    return () => {
      if (
        typeof window !== "undefined" &&
        (window as any).removeEventListener
      ) {
        window.removeEventListener("specials-updated", onUpdate);
      }
    };
  }, []);

  // Close mobile dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!mobileOpenParent) return;
      const target = e.target as Node | null;
      if (
        mobileDropdownRef.current &&
        (mobileDropdownRef.current.contains(target) || mobileNavRef.current?.contains(target))
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

  const getIconFor = (label: string) => {
    switch (label) {
      case "Main Menu":
        return <RestaurantMenuRoundedIcon sx={{ mr: 1, color: "#7A4A22" }} />;
      case "Drinks Menu":
        return <LocalBarRoundedIcon sx={{ mr: 1, color: "#7A4A22" }} />;
      case "Daily Special":
        return <LocalFireDepartmentRoundedIcon sx={{ mr: 1, color: "#7A4A22" }} />;
      case "Night Special":
        return <NightlightRoundedIcon sx={{ mr: 1, color: "#7A4A22" }} />;
      default:
        return null;
    }
  };

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
                      color="primary"
                      sx={{
                        fontWeight: 500,
                        textTransform: "none",
                        color: isActive ? "#7A4A22" : "primary.main",
                        position: "relative",
                        px: 0.5,
                        "&::after": {
                          content: '""',
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          width: isActive ? "100%" : "0%",
                          height: "2px",
                          backgroundColor: "#7A4A22",
                          transition: "width 0.25s ease",
                          borderRadius: 2,
                        },
                        "&:hover::after": { width: "100%" },
                      }}
                    >
                      {link.label}
                      {link.label === "Special" && showSpecialBadge && (
                        <span
                          style={{
                            display: "inline-block",
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            background: "#d9534f",
                            marginLeft: 8,
                            verticalAlign: "middle",
                          }}
                          aria-hidden
                        />
                      )}
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
      const isChildActive = location.pathname.startsWith(item.path || "");

      return (
        <motion.li
          key={item.label}
          whileHover={{ x: 4 }}
          transition={{ type: "spring", stiffness: 200, damping: 18 }}
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
              color: isChildActive ? "#7A4A22" : "primary.main",
              fontSize: "0.94rem",
              borderRadius: 0,
              position: "relative",
              "&:hover": {
                bgcolor: "rgba(245, 240, 235, 0.6)",
              },
            }}
            onClick={closeParentNow}
          >
            {/* Highlight left bar when active */}
            {isChildActive && (
              <motion.span
                layoutId="special-left-bar"
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: "4px",
                  height: "100%",
                  background: "#7A4A22",
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
                        color: isActive ? "#7A4A22" : "primary.main",
                        position: "relative",
                        "&:hover": { color: "primary.dark" },
                      }}
                    >
                      {link.label}
                      {link.label === "Special" && showSpecialBadge && (
                        <span
                          style={{
                            display: "inline-block",
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            background: "#d9534f",
                            marginLeft: 8,
                            verticalAlign: "middle",
                          }}
                          aria-hidden
                        />
                      )}
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
                          background: "#7A4A22",
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
              sx={{
                ml: 2,
                px: 3,
                py: 1.2,
                borderRadius: 50,
                textTransform: "none",
                fontWeight: 600,
              }}
              onClick={() => {}}
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
          PaperProps={{ sx: { borderRadius: 2 } }}
        >
          <DialogTitle sx={{ fontWeight: 700, textAlign: "center" }}>{mobileOpenParent}</DialogTitle>
          <DialogContent>
            <List>
              {mobileOpenParent && navLinks.find(n => n.label === mobileOpenParent)?.dropdown?.map((d) => (
                <ListItemButton
                  key={d.label}
                  component={Link}
                  to={d.path || "/"}
                  onClick={() => setMobileOpenParent(null)}
                  sx={{ justifyContent: "center", gap: 1, py: 1 }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>{getIconFor(d.label)}</ListItemIcon>
                  <ListItemText primary={d.label} primaryTypographyProps={{ align: "center" }} />
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
                  fontFamily: '"Moon Dance", serif',
                  fontWeight: 700,
                  fontSize: "1.3rem",
                  color: "primary.main",
                  display: { xs: "block", md: "none" },
                  lineHeight: 1,
                }}
              >
                The Brooklin Pub
              </Box>
            </Box>

            {/* ORDER BUTTON */}
            <Button
              variant="contained"
              sx={{
                borderRadius: 999,
                textTransform: "none",
                px: 2.2,
                py: "6px",
                fontSize: "0.85rem",
                fontWeight: 600,
                bgcolor: "#7A4A22",
                "&:hover": { bgcolor: "#623819" },
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
          {[
            { label: "Home", path: "/", icon: <HomeRoundedIcon fontSize="medium" /> },
            { label: "About", path: "/about", icon: <InfoRoundedIcon fontSize="medium" /> },
            { label: "Menu", path: "/menu", icon: <RestaurantMenuRoundedIcon fontSize="medium" /> },
            { label: "Special", path: "/special/today", icon: <LocalFireDepartmentRoundedIcon fontSize="medium" /> },
            { label: "Contact", path: "/contactus", icon: <ContactSupportRoundedIcon fontSize="medium" /> },
          ].map((item) => {
            const isActive =
              item.path === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(item.path || "");

            // find the navLinks entry for dropdowns
            const linkDef = navLinks.find((n) => n.label === item.label);

            if (linkDef && linkDef.dropdown) {
              // parent with dropdown — render only the button here; centralized dropdown will be rendered once below
              return (
                <Box key={item.label} sx={{ position: "relative" }}>
                  <Button
                    disableRipple
                    onClick={(e) => {
                      e.stopPropagation();
                      setMobileOpenParent((p) => (p === item.label ? null : item.label));
                    }}
                    sx={{
                      minWidth: 0,
                      color: isActive ? "#7A4A22" : "#5c4a3f",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      p: 0,
                      fontSize: "0.65rem",
                    }}
                  >
                    <span style={{ position: "relative", display: "inline-block" }}>
                      {item.icon}
                      {item.label === "Special" && showSpecialBadge && (
                        <span
                          style={{
                            position: "absolute",
                            top: -6,
                            right: -2,
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            background: "#d9534f",
                          }}
                        />
                      )}
                    </span>
                  </Button>
                </Box>
              );
            }

            return (
              <Button
                key={item.path}
                component={Link}
                to={item.path}
                disableRipple
                sx={{
                  minWidth: 0,
                  color: isActive ? "#7A4A22" : "#5c4a3f",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  p: 0,
                  fontSize: "0.65rem",
                }}
              >
                <span style={{ position: "relative", display: "inline-block" }}>
                  {item.icon}
                  {item.label === "Special" && showSpecialBadge && (
                    <span
                      style={{
                        position: "absolute",
                        top: -6,
                        right: -2,
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        background: "#d9534f",
                      }}
                    />
                  )}
                </span>
              </Button>
            );
          })}

        
      </Box>

      {/* Popup dialog (used for Menu / Special) - mobile/bottom nav */}
      <Dialog
        open={!!mobileOpenParent}
        onClose={() => setMobileOpenParent(null)}
        fullWidth
        maxWidth="xs"
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle sx={{ fontWeight: 700, textAlign: "center" }}>{mobileOpenParent}</DialogTitle>
        <DialogContent>
          <List>
            {mobileOpenParent && navLinks.find(n => n.label === mobileOpenParent)?.dropdown?.map((d) => (
              <ListItemButton
                key={d.label}
                component={Link}
                to={d.path || "/"}
                onClick={() => setMobileOpenParent(null)}
                sx={{ justifyContent: "center", gap: 1, py: 1 }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>{getIconFor(d.label)}</ListItemIcon>
                <ListItemText primary={d.label} primaryTypographyProps={{ align: "center" }} />
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
