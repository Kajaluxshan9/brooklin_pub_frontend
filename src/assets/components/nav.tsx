"use client";
import { useState, useEffect, useRef } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faBookOpen,
  faBagShopping,
  faCircleInfo,
  faPhone,
  faChevronDown,
  faChevronUp
} from "@fortawesome/free-solid-svg-icons";

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

const Nav = () => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [arrowY, setArrowY] = useState(100);
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


  const sidebarVariants: Variants = {
    hidden: {
      opacity: 0,
      x: 36,
      scale: 0.98,
      transition: { when: "afterChildren" },
    },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 26,
        staggerChildren: 0.06,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: -8, scale: 0.96 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 28 },
    },
  };

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
    closeTimeoutRef.current = window.setTimeout(() => setOpenDropdown(null), 180);
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
    background: isHome ? "white" : (hasShadow ? "white" : "transparent"),
    backdropFilter: hasShadow ? "blur(12px)" : "none",
    transition: "background 0.4s ease, box-shadow 0.4s ease, backdrop-filter 0.4s ease",
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

            {/* Center Nav Links */}
            <Box
              sx={{
                flexGrow: 1,
                display: "flex",
                justifyContent: "center",
                gap: 3,
                position: "relative",
              }}
            >
              {navLinks.map((link) =>
                link.dropdown ? (
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
    icon={openDropdown === link.label ? faChevronUp : faChevronDown}
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
                  <Button
                    key={link.path}
                    component={Link}
                    to={link.path!}
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
                        width: "0%",
                        height: "2px",
                        backgroundColor: "currentColor",
                        transition: "width 0.3s ease",
                      },
                      "&:hover::after": {
                        width: "100%",
                      },
                    }}
                  >
                    {link.label}
                  </Button>

                )
              )}
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

 /** ======= Mobile / Tablet View (Instagram Style) ======= */
return (
  <>
    {/* Top Compact Header */}
<AppBar
  position="fixed"
  sx={{
    top: 0,
    bgcolor: "white",
    color: "black",
    height: 60,
    display: "flex",
    justifyContent: "center",
    zIndex: 1300,
    boxShadow: hasShadow ? "0 2px 6px rgba(0,0,0,0.1)" : "none",
    transition: "box-shadow 0.3s ease",
  }}
>
  <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: 2 }}>
    <Box
      component="img"
      src="/brooklinpub-logo.png"
      alt="Logo"
      sx={{ height: 35, objectFit: "contain" }}
    />

    {/* Call Icon */}
    <Button
      href="tel:+94779123456"
      sx={{ minWidth: "auto", color: "primary.main" }}
    >
      <FontAwesomeIcon icon={faPhone} style={{ fontSize: 20 }} />
    </Button>
  </Toolbar>
</AppBar>

    <Toolbar sx={{ minHeight: 60 }} />

    {/* FIXED BOTTOM NAV — INSTAGRAM STYLE */}
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
        height: 65,
        zIndex: 1300,
        borderTop: "1px solid rgba(0,0,0,0.08)",
      }}
    >
      {[
{ icon: faHouse, path: "/" },
{ icon: faBookOpen, path: "/menu" },
{ icon: faBagShopping, path: "/special/today" },
{ icon: faCircleInfo, path: "/about" },
{ icon: faPhone, path: "/contactus" },

      ].map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Button
            key={item.path}
            disableRipple
            component={Link}
            to={item.path}
            sx={{
              minWidth: "auto",
              color: isActive ? "primary.main" : "black",
              transition: "0.2s",
              "&:hover": { color: "primary.main" },
              display: "flex",
              flexDirection: "column",
            }}
          >
<Box sx={{ fontSize: 24 }}>
  <FontAwesomeIcon icon={item.icon} />
</Box>
          </Button>
        );
      })}
    </Box>

    {/* Bottom Spacer to avoid content hidden behind nav */}
    <Toolbar sx={{ minHeight: 65 }} />
  </>
);
};

export default Nav;
