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

const HouseIcon = ({ active }: { active: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="26"
    height="26"
    viewBox="0 0 48 48"
    fill={active ? "#7A4A22" : "#000"}   // <-- brown when active
  >
    <path d="M 24.001953 4.0039062 C 23.233953 4.0039062 22.466359 4.2963125 21.880859 4.8828125 L 0.88085938 25.882812 C -0.29114062 27.055812 -0.29114062 28.950047 0.88085938 30.123047 C 2.0058594 31.256047 3.809375 31.295859 4.984375 30.255859 L 6.1347656 29.109375 C 6.3307656 28.922375 6.6457969 28.922375 6.8417969 29.109375 C 7.0367969 29.309375 7.0367969 29.629406 6.8417969 29.816406 L 5.828125 30.828125 C 5.574125 31.081125 5.2969531 31.29575 5.0019531 31.46875 L 5.0019531 47.003906 L 42.998047 47.001953 L 42.996094 31.46875 C 42.703094 31.29575 42.426781 31.081125 42.175781 30.828125 L 41.162109 29.814453 C 40.967109 29.627453 40.967109 29.307422 41.162109 29.107422 L 43.019531 30.255859 C 44.195531 31.295859 45.996047 31.254094 47.123047 30.121094 C 48.295047 28.948094 48.295047 27.055813 47.123047 25.882812 L 39.003906 17.761719 L 39.003906 10.001953 L 40.005859 9.0019531 L 40.005859 8.0019531 L 33.003906 8.0019531 L 33.003906 9.0019531 L 34.003906 10.001953 L 34.003906 11.349609 L 35.841797 13.189453 C 36.036797 13.376453 36.036797 13.696484 35.841797 13.896484 L 26.123047 4.8828125 C 25.537547 4.2963125 24.769953 4.0039062 24.001953 4.0039062 z"/>
  </svg>
);

const AboutIcon = ({ active }: { active: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="35"
    height="35"
    viewBox="0 0 72 72"
    preserveAspectRatio="xMidYMid meet"
    fill={active ? "#7A4A22" : "#000"}
  >
    <path d="M36,12c14.921,0,27.06,9.869,27.06,22S50.921,56,36,56c-0.272,0-0.547-0.004-0.827-0.011
      c-7.242,5.125-13.055,5.911-13.725,5.986c-0.15,0.017-0.3,0.025-0.449,0.025c-1.372,0-2.662-0.707-3.396-1.891
      c-0.814-1.312-0.801-2.976,0.034-4.275c0.015-0.023,1.058-1.65,2.379-4.056C13.091,47.689,8.94,41.161,8.94,34
      C8.94,21.869,21.079,12,36,12z M38,42.994c0-0.601,0-6.399,0-7c0-1.104-0.895-2-2-2c-1.104,0-2,0.896-2,2c0,0.601,0,6.399,0,7
      c0,1.104,0.896,2,2,2C37.105,44.994,38,44.098,38,42.994z M36,30.203c1.657,0,3-1.343,3-3s-1.343-3-3-3s-3,1.343-3,3
      S34.343,30.203,36,30.203z"/>
  </svg>
);

const SpecialIcon = ({ active }: { active: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="30"
    height="30"
    viewBox="0 0 125 125" 
    fill={active ? "#7A4A22" : "#000"}
  >
    <path d="M0.661,59.444L60.454,0.6c0.442-0.436,1.03-0.633,1.605-0.595c0.85,0.033,1.695,0.084,2.535,0.151l0.078,0.003 c0.055,0.003,0.109,0.009,0.164,0.017c6.82,0.569,13.33,2.222,19.354,4.777c7.113,3.018,13.553,7.297,19.033,12.539 c11.736,11.229,18.121,26.082,18.92,41.208c0.797,15.081-3.955,30.442-14.486,42.77c-2.504,2.93-5.211,5.56-8.08,7.888 c-11.443,9.284-25.43,13.754-39.352,13.513c-13.921-0.241-27.78-5.193-38.968-14.752c-2.849-2.435-5.526-5.17-7.988-8.204 C8.838,94.455,5.333,88.23,3.042,81.47c-2.183-6.441-3.267-13.377-3.004-20.61C0.058,60.303,0.293,59.806,0.661,59.444 L0.661,59.444z M66.463,4.536c-0.262,3.008-0.646,5.908-1.15,8.7c25.385,1.998,45.361,23.228,45.361,49.125 c0,27.219-22.064,49.283-49.284,49.283c-26.059,0-47.392-20.225-49.163-45.833C9.646,66.185,7,66.433,4.297,66.559 c0.315,4.713,1.246,9.258,2.707,13.568c2.131,6.291,5.39,12.079,9.506,17.152c2.298,2.831,4.8,5.387,7.464,7.663 c10.43,8.912,23.346,13.528,36.315,13.753c12.971,0.226,25.998-3.937,36.65-12.58c2.674-2.168,5.199-4.623,7.541-7.362 c9.807-11.479,14.23-25.787,13.488-39.84c-0.746-14.104-6.695-27.948-17.627-38.409C95.23,15.614,89.217,11.62,82.568,8.8 C77.523,6.661,72.115,5.199,66.463,4.536L66.463,4.536z M4.181,62.385c16.298-0.775,30.345-6.292,40.563-16.489 c9.593-9.573,15.859-23.322,17.505-41.201L4.19,61.833C4.186,62.017,4.183,62.201,4.181,62.385L4.181,62.385z"/>
  </svg>
);


const MenuIcon = ({ active }: { active: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="25"
    height="25"
    viewBox="0 0 125 125"
    fill={active ? "#7A4A22" : "#000"}   // <-- brown when active
  >
  <path class="st0" d="M0,16.86L34,0v106.02L0,122.88V16.86L0,16.86z M79.8,16.86L113.79,0v106.02L79.8,122.88V16.86L79.8,16.86z M73.89,16.86L39.9,0v106.02l33.99,16.86L73.89,16.86L73.89,16.86L73.89,16.86z"/>
  </svg>
);


const ContactIcon = ({ active }: { active: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="30"
    height="30"
    viewBox="0 0 125 125"
    fill={active ? "#7A4A22" : "#000"}   // <-- brown when active
  >
<path class="cls-1" d="M61.44,0A61.44,61.44,0,1,1,0,61.44,61.44,61.44,0,0,1,61.44,0ZM30.73,38,62,63.47,91.91,38Zm-2,42.89L51,58.55,28.71,40.39V80.87ZM53.43,60.55l-22.95,23H92.21l-21.94-23L63,66.71h0a1.57,1.57,0,0,1-2,0l-7.59-6.19Zm19.24-2,21.5,22.54V40.19L72.67,58.51Z"/>
  </svg>
);



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

 return (
    <>
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
<Box component={Link} to="/" sx={{ display: "flex", alignItems: "center" }}>
  <Box component="img" src="/brooklinpub-logo.png" alt="Logo" sx={{ height: 35, objectFit: "contain", cursor: "pointer" }} />
</Box>

  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
    <Button
      variant="contained"
      sx={{
        borderRadius: 50,
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

    <Button href="tel:+94779123456" sx={{ minWidth: "auto", color: "primary.main" }}>
      <FontAwesomeIcon icon={faPhone} style={{ fontSize: 20 }} />
    </Button>
  </Box>
</Toolbar>

      </AppBar>

      <Toolbar sx={{ minHeight: 60 }} />

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
          { label: "Home", path: "/", icon: HouseIcon },
          { label: "About", path: "/about", icon: AboutIcon },
          { label: "Menu", path: "/menu", icon: MenuIcon },
          { label: "Special", path: "/special/today", icon: SpecialIcon },
          { label: "Contact", path: "/contactus", icon: ContactIcon },
        ].map((item) => {
          const isActive = item.path === "/" ? location.pathname === "/" : location.pathname.startsWith(item.path);
          const Icon = item.icon;
          return (
            <Button
              key={item.path}
              component={Link}
              to={item.path}
              disableRipple
              sx={{
                minWidth: "auto",
                color: isActive ? "#7A4A22" : "black",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "6px 0",
              }}
            >
              <Icon active={isActive} />
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
