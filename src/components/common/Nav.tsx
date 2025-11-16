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
import ContactSupportRoundedIcon from "@mui/icons-material/ContactSupportRounded";
import { Link } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronUp,
  faChevronRight
} from "@fortawesome/free-solid-svg-icons";

import { useLocation } from "react-router-dom";
import { hasNewSpecial } from "../../lib/specials";

/** ========= Nav Data ========= */
/** Unified node type so dropdowns can nest arbitrarily */
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
  // which second-level child is open (inside the parent)

  const [hasShadow, setHasShadow] = useState(false);

  useEffect(() => {
    const triggerPoint = window.innerHeight * 0.1;
    const handleScroll = () => {
      setHasShadow(window.scrollY > triggerPoint);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const location = useLocation();
  const isHome = location.pathname === "/";

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
      if (typeof window !== "undefined" && (window as any).removeEventListener) {
        window.removeEventListener("specials-updated", onUpdate);
      }
    };
  }, []);

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
    if (parentCloseTimeout.current) window.clearTimeout(parentCloseTimeout.current);
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

      {/* Dropdown stays same */}
      {openParent === link.label && (
        <motion.ul
          onMouseEnter={() => {
            if (parentCloseTimeout.current) {
              window.clearTimeout(parentCloseTimeout.current);
              parentCloseTimeout.current = null;
            }
          }}
          onMouseLeave={scheduleCloseParent}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18 }}
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            background: "rgba(255, 255, 255, 1)",
            borderRadius: 8,
            boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
            padding: "6px 0",
            listStyle: "none",
            minWidth: 220,
            zIndex: 2000,
            textAlign: "center",
          }}
        >
          {link.dropdown!.map((item) => (
            <li key={item.label}>
              <Button
                component={Link}
                to={item.path}
                sx={{
                  width: "100%",
                  justifyContent: "center",
                  textTransform: "none",
                  px: 3,
                  py: 1.1,
                  minWidth: 220,
                  color: location.pathname.startsWith(item.path || "")
                    ? "#7A4A22"
                    : "primary.main",
                  "&:hover": { bgcolor: "grey.100" },
                  fontSize: "0.92rem",
                }}
                onClick={closeParentNow}
              >
                {item.label}
              </Button>
            </li>
          ))}
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
              : location.pathname.startsWith(item.path);

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

      {/* Spacer */}
      <Toolbar sx={{ minHeight: 75 }} />
    </>
  );
};

export default Nav;
