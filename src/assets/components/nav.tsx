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

// Icons
import HomeIcon from "@mui/icons-material/Home";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import InfoIcon from "@mui/icons-material/Info";
import ContactPhoneIcon from "@mui/icons-material/ContactPhone";
import PhoneIcon from "@mui/icons-material/Phone";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

/** ========= Nav Data ========= */
type DropdownItem = { label: string; path: string };
type NavLink = { label: string; path?: string; dropdown?: DropdownItem[] };

const navLinks: NavLink[] = [
  { label: "Home", path: "/" },
  { label: "About Us", path: "/about" },
  {
    label: "Menu",
    dropdown: [
      { label: "Drinks", path: "/menu/drinks" },
      { label: "Food", path: "/menu/food" },
      { label: "Desserts", path: "/menu/desserts" },
    ],
  },
  {
    label: "Special",
    dropdown: [
      { label: "Today’s Special", path: "/special" },
      { label: "Chef’s Choice", path: "/special/chef" },
    ],
  },
  { label: "Contact Us", path: "/contactus" },
];

const Nav = () => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [arrowY, setArrowY] = useState(100);

  useEffect(() => {
    const handleResize = () => setArrowY(Math.max(80, window.innerHeight * 0.1));
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  // allow a short delay before closing dropdowns so small pointer gaps don't close them
  const closeTimeoutRef = useRef<number | null>(null);

  const handleOpen = (label: string) => {
    if (closeTimeoutRef.current) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setOpenDropdown(label);
  };

  // schedule a delayed close (used on mouse leave)
  const scheduleClose = () => {
    if (closeTimeoutRef.current) window.clearTimeout(closeTimeoutRef.current);
    closeTimeoutRef.current = window.setTimeout(() => setOpenDropdown(null), 150);
  };

  // close immediately (used on click/select)
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
          elevation={3}
          sx={{
            top: 25,
            left: "50%",
            transform: "translateX(-50%)",
            width: { xs: "80%", sm: "95%", md: "85%" },
            bgcolor: "background.paper",
            borderRadius: 50,
            boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
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
              src="./brooklinpub-logo.png"
              alt="Logo"
              sx={{
                height: { xs: 40, sm: 55, md: 80 },
                objectFit: "contain",
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
                        openDropdown === link.label ? (
                          <KeyboardArrowUpIcon sx={{ fontSize: 20 }} />
                        ) : (
                          <KeyboardArrowDownIcon sx={{ fontSize: 20 }} />
                        )
                      }
                      sx={{
                        fontWeight: 500,
                        textTransform: "none",
                        color: "primary.main",
                        "&:hover": { color: "secondary.main" },
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
                          minWidth: 220, // wider for easier selection
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
                                px: 3, // larger horizontal padding
                                py: 1.2, // slightly larger vertical padding
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
                      "&:hover": { color: "secondary.main" },
                    }}
                  >
                    {link.label}
                  </Button>
                )
              )}
            </Box>

            <Button
              variant="contained"
              color="secondary"
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

  /** ======= Mobile / Tablet View ======= */
  return (
    <>
      {/* Top bar */}
      <AppBar
        position="fixed"
        sx={{
          top: 0,
          bgcolor: "white",
          color: "black",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          height: 60,
          display: "flex",
          justifyContent: "center",
          zIndex: 1300,
        }}
      >
        <Toolbar sx={{ display: "flex", alignItems: "center", px: 2, gap: 1 }}>
          <Box
            component="img"
            src="./brooklinpub-logo.png"
            alt="Logo"
            sx={{ height: 35, objectFit: "contain" }}
          />
          <Box component="span" sx={{ fontWeight: 600, fontSize: "1rem" }}>
            Brooklin Pub
          </Box>
        </Toolbar>
      </AppBar>

      <Toolbar sx={{ minHeight: 60 }} />

      {/* ✅ Fixed Arrow */}
      <motion.div
        style={{
          position: "fixed",
          right: 0,
          top: arrowY,
          zIndex: 1500,
          touchAction: "none",
          cursor: "pointer",
        }}
      >
        <div
          style={{
            borderTopLeftRadius: "80%",
            borderBottomLeftRadius: "80%",
            width: 30,
            height: 30,
            background: "white",
            boxShadow: "0 4px 10px rgba(0,0,0,0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <motion.div
            animate={{ rotate: sidebarOpen ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Button
              onClick={() => setSidebarOpen((s) => !s)}
                disableRipple
                sx={{
                  color: "primary.main",
                  fontSize: "1rem",
                  minWidth: "auto",
                  p: 0,
                  bgcolor: "transparent",
                  // ensure it never shows a blue/filled state when clicked/focused
                  "&:hover": { bgcolor: "transparent", color: "primary.main" },
                  "&:active": { bgcolor: "transparent", color: "primary.main" },
                  "&:focus": { outline: "none", bgcolor: "transparent", color: "primary.main" },
                  // MUI adds a class for keyboard focus - handle that too
                  "&.Mui-focusVisible": { outline: "none", bgcolor: "transparent", color: "primary.main" },
                }}
            >
              ⮜
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* ✅ Scrollable Sidebar (stops under top bar) */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            variants={sidebarVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            style={{
              position: "fixed",
              right: 46,
              top: arrowY,
              transform: "translateY(-50%)",
              overflowY: "auto",
              background: "white",
              borderRadius: 40,
              boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "10px 8px",
              zIndex: 1200,
              maxHeight: "calc(100vh - 80px)", // cap height so it won't overlap the AppBar
            }}
          >
            {[
              { icon: <HomeIcon />, path: "/" },
              { icon: <MenuBookIcon />, path: "/special" },
              { icon: <ShoppingBagIcon />, path: "/order" },
              { icon: <InfoIcon />, path: "/about" },
              { icon: <ContactPhoneIcon />, path: "/contactus" },
            ].map((item, i) => (
              <motion.div key={i} variants={itemVariants}>
                <Button
                  disableRipple
                  component={Link}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  sx={{
                    color: "primary.main",
                    borderRadius: "50%",
                    width: 45,
                    height: 45,
                    bgcolor: "white",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    // keep appearance stable on hover/active/focus
                    "&:hover": { bgcolor: "white", color: "primary.main" },
                    "&:active": { bgcolor: "white", color: "primary.main" },
                    "&:focus": { bgcolor: "white", color: "primary.main" },
                    "&.Mui-focusVisible": { bgcolor: "white", color: "primary.main" },
                    minWidth: "auto",
                    mb: 1,
                  }}
                >
                  {item.icon}
                </Button>
              </motion.div>
            ))}

            {/* divider removed as requested */}

            {[
              { icon: <PhoneIcon />, href: "tel:+123456789", color: "green" },
              { icon: <FacebookIcon />, href: "https://facebook.com", color: "#1877f2" },
              { icon: <InstagramIcon />, href: "https://instagram.com", color: "#E1306C" },
              { icon: <WhatsAppIcon />, href: "https://wa.me/123456789", color: "#25D366" },
            ].map((item, i) => (
              <motion.div key={i} variants={itemVariants}>
                <Button
                  disableRipple
                  component="a"
                  href={item.href}
                  target="_blank"
                  sx={{
                    color: item.color,
                    borderRadius: "50%",
                    width: 45,
                    height: 45,
                    bgcolor: "white",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    // keep appearance stable on hover/active/focus
                    "&:hover": { bgcolor: "white", color: item.color },
                    "&:active": { bgcolor: "white", color: item.color },
                    "&:focus": { bgcolor: "white", color: item.color },
                    "&.Mui-focusVisible": { bgcolor: "white", color: item.color },
                    minWidth: "auto",
                    mb: 1,
                  }}
                >
                  {item.icon}
                </Button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Nav;
