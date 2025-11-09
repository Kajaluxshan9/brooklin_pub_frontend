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
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";

import { useLocation } from "react-router-dom";

/** ========= Nav Data ========= */
type DropdownItem = { label: string; path: string };
type NavLink = { label: string; path?: string; dropdown?: DropdownItem[] };

const navLinks: NavLink[] = [
  { label: "Home", path: "/" },
  { label: "About Us", path: "/about" },
  { label: "Menu", path: "/menu" },

  {
    label: "Special",
    dropdown: [
      { label: "Today’s Special", path: "/special/today" },
      { label: "Chef’s Choice", path: "/special/chef" },
    ],
  },
  { label: "Contact Us", path: "/contactus" },
];

// Removed legacy SVG icon components (HouseIcon, AboutIcon, SpecialIcon, MenuIcon, ContactIcon) after migrating to MUI icons.

const Nav = () => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
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

  // delayed close helpers to make dropdowns easier to select
  const closeTimeoutRef = useRef<number | null>(null);

  const handleOpen = (label: string) => {
    if (closeTimeoutRef.current) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setOpenDropdown(label);
  };

  const scheduleClose = () => {
    if (closeTimeoutRef.current) window.clearTimeout(closeTimeoutRef.current);
    // short delay so small pointer gaps don't immediately close the dropdown
    closeTimeoutRef.current = window.setTimeout(
      () => setOpenDropdown(null),
      180
    );
  };

  const closeNow = () => {
    if (closeTimeoutRef.current) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setOpenDropdown(null);
  };

  /** ======= Desktop View ======= */
  if (!isMobileOrTablet) {
    return (
      <Box sx={{ flexGrow: 1 }}>
        <AppBar
          position="fixed"
          elevation={hasShadow ? 4 : 0}
          sx={{
            top: 25,
            left: "50%",
            transform: "translateX(-50%)",
            width: { xs: "80%", sm: "95%", md: "85%" },
            background: isHome ? "white" : hasShadow ? "white" : "transparent",
            backdropFilter: hasShadow ? "blur(12px)" : "none",
            transition:
              "background 0.4s ease, box-shadow 0.4s ease, backdrop-filter 0.4s ease",
            borderRadius: 50,
            boxShadow: hasShadow ? "0 8px 32px rgba(0,0,0,0.15)" : "none",
            height: { xs: 70, sm: 90, md: 110 },
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
                objectFit: "cont  ain",
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
                const isActive = link.path && location.pathname === link.path;
                return link.dropdown ? (
                  <Box
                    key={link.label}
                    sx={{ position: "relative" }}
                    onMouseEnter={() => handleOpen(link.label)}
                    onMouseLeave={scheduleClose}
                  >
                    <Button
                      color="primary"
                      endIcon={
                        <FontAwesomeIcon
                          icon={
                            openDropdown === link.label
                              ? faChevronUp
                              : faChevronDown
                          }
                          style={{ fontSize: 16 }}
                        />
                      }
                      sx={{
                        fontWeight: 500,
                        textTransform: "none",
                        color: "primary.main",
                        position: "relative",
                        "&::after": {
                          content: '""',
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          width: openDropdown === link.label ? "100%" : "0%",
                          height: "2px",
                          backgroundColor: "currentColor",
                          transition: "width 0.3s ease",
                        },
                        "&:hover::after": { width: "100%" },
                      }}
                    >
                      {link.label}
                    </Button>

                    {openDropdown === link.label && (
                      <motion.ul
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        style={{
                          position: "absolute",
                          top: "100%",
                          left: 0,
                          background: "white",
                          borderRadius: 8,
                          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                          padding: "8px 0",
                          listStyle: "none",
                          minWidth: 220,
                          zIndex: 2000,
                          textAlign: "center",
                        }}
                      >
                        {link.dropdown.map((item) => (
                          <li key={item.path}>
                            <Button
                              component={Link}
                              to={item.path}
                              sx={{
                                width: "100%",
                                justifyContent: "center",
                                textAlign: "center",
                                textTransform: "none",
                                color: "primary.main",
                                px: 3,
                                py: 1.2,
                                minWidth: 220,
                                "&:hover": { bgcolor: "grey.100" },
                              }}
                              onClick={closeNow}
                              onMouseEnter={() => {
                                if (closeTimeoutRef.current) {
                                  window.clearTimeout(closeTimeoutRef.current);
                                  closeTimeoutRef.current = null;
                                }
                              }}
                            >
                              {item.label}
                            </Button>
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </Box>
                ) : (
                  <Box key={link.path} sx={{ position: "relative" }}>
                    <Button
                      component={Link}
                      to={link.path!}
                      sx={{
                        fontWeight: 500,
                        textTransform: "none",
                        color: "primary.main",
                        position: "relative",
                        px: 0.5,
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
                          background: "#7A4A22",
                          borderRadius: 2,
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30,
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
            >
              Order Online
            </Button>
          </Toolbar>
        </AppBar>
        <Toolbar disableGutters sx={{ minHeight: 0 }} />
      </Box>
    );
  }

  return (
    <>
      {/* Floating mobile header (logo + title text + CTA) */}
      <AppBar position="fixed" elevation={0} sx={{ top: 0, bgcolor: "transparent", zIndex: 1300 }}>
        <Toolbar sx={{ py: 1.2 }}>
          <Box
            sx={{
              bgcolor: "white",
              color: "black",
              width: "100%",
              mx: "auto",
              borderRadius: 999,
              height: 54,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: 2,
              boxShadow: hasShadow ? "0 8px 24px rgba(0,0,0,0.12)" : "0 4px 12px rgba(0,0,0,0.08)",
              backdropFilter: "saturate(120%) blur(12px)",
              border: "1px solid rgba(0,0,0,0.06)",
            }}
          >
            <Box component={Link} to="/" sx={{ display: "flex", alignItems: "center", gap: 1.2, textDecoration: "none" }}>
              <Box component="img" src="/brooklinpub-logo.png" alt="Logo" sx={{ height: 34, objectFit: "contain", cursor: "pointer" }} />
              <Box
                component="span"
                sx={{
                  fontFamily: '"Playfair Display", serif',
                  fontWeight: 700,
                  fontSize: "1.05rem",
                  lineHeight: 1,
                  color: "primary.main",
                  letterSpacing: 0.2,
                  display: { xs: "block", md: "none" },
                }}
              >
                The Brooklin Pub
              </Box>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Button
                variant="contained"
                sx={{
                  borderRadius: 999,
                  textTransform: "none",
                  px: 2,
                  py: "4px",
                  fontSize: "0.85rem",
                  bgcolor: "#7A4A22",
                  "&:hover": { bgcolor: "#653a1c" },
                }}
              >
                Order Online
              </Button>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      <Toolbar sx={{ minHeight: 70 }} />

      {/* FIXED BOTTOM NAV */}
      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          bgcolor: "white",
          boxShadow: "0 -2px 12px rgba(0,0,0,0.08)",
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          height: "75px",
          paddingBottom: "env(safe-area-inset-bottom)", // ensures no clipping on iOS
          borderTop: "1px solid rgba(0,0,0,0.08)",
          zIndex: 1200,
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
            item.path === "/" ? location.pathname === "/" : location.pathname.startsWith(item.path);
          return (
            <Button
              key={item.path}
              component={Link}
              to={item.path}
              disableRipple
              sx={{
                minWidth: 0,
                color: isActive ? "#8B4513" : "#6d4c41",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                p: 0,
                fontSize: "0.65rem",
              }}
              aria-label={item.label}
            >
              {item.icon}
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
