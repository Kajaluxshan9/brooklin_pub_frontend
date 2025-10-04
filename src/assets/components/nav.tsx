"use client";
import React, { useState, MouseEvent } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { Link } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion"; // ✅ type-only import

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
      { label: "Today’s Special", path: "/special/today" },
      { label: "Chef’s Choice", path: "/special/chef" },
    ],
  },
  { label: "Contact Us", path: "/contactus" },
];

/** ========= Motion Variants ========= */
const sidebarVariants: Variants = {
  open: {
    x: 0, // fully visible
    transition: { type: "spring", stiffness: 80 }
  },
  closed: {
    x: "-100%", // push the whole thing out of view
    transition: { type: "spring", stiffness: 300, damping: 40 }
  },
};


/** ========= Menu Toggle ========= */
const Path = (props: any) => (
  <motion.path
    fill="transparent"
    strokeWidth="3"
    stroke="hsl(0, 0%, 18%)"
    strokeLinecap="round"
    {...props}
  />
);

const MenuToggle = ({ toggle, isOpen }: { toggle: () => void; isOpen: boolean }) => (
  <button
    onClick={toggle}
    style={{
      outline: "none",
      border: "none",
      background: "transparent",
      cursor: "pointer",
      width: 50,
      height: 50,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <svg width="23" height="23" viewBox="0 0 23 23">
      <Path
        variants={{ closed: { d: "M 2 2.5 L 20 2.5" }, open: { d: "M 3 16.5 L 17 2.5" } }}
        animate={isOpen ? "open" : "closed"}
      />
      <Path
        d="M 2 9.423 L 20 9.423"
        variants={{ closed: { opacity: 1 }, open: { opacity: 0 } }}
        animate={isOpen ? "open" : "closed"}
        transition={{ duration: 0.1 }}
      />
      <Path
        variants={{ closed: { d: "M 2 16.346 L 20 16.346" }, open: { d: "M 3 2.5 L 17 16.346" } }}
        animate={isOpen ? "open" : "closed"}
      />
    </svg>
  </button>
);

const Nav = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleOpen = (event: MouseEvent<HTMLElement>, label: string) => {
    setAnchorEl(event.currentTarget);
    setOpenDropdown(label);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpenDropdown(null);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="fixed"
        elevation={3}
        sx={{
          top: 25,
          left: "50%",
          transform: "translateX(-50%)",
          width: { xs: "100.01%", sm: "100.01%", md: "85%" },
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
          {/* Logo */}
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

          {isMobile ? (
            <>
              <MenuToggle toggle={() => setSidebarOpen(!sidebarOpen)} isOpen={sidebarOpen} />

<motion.div
  initial="closed"
  animate={sidebarOpen ? "open" : "closed"}
  variants={sidebarVariants}
  style={{
    position: "fixed",
    top: 0,
    left: 0,
    width: 200,
    height: "100vh",
    background: "#fff",
    boxShadow: "2px 0 8px rgba(0,0,0,0.15)",
    padding: "20px",
    zIndex: 1200,
    transform: "translateX(-100%)",
  }}
>


<List>
  {navLinks.map((link) =>
    link.dropdown ? (
      <React.Fragment key={link.label}>
        <ListItem disablePadding>
          <Button
            disableRipple
            fullWidth
            onClick={() =>
              setOpenDropdown(openDropdown === link.label ? null : link.label)
            }
            sx={{
              justifyContent: "space-between",
              color: "primary.main",
              textTransform: "none",
              fontSize: "0.85rem",
              fontWeight: 600,
              "&:hover": { color: "secondary.main" },
              "&.Mui-focusVisible": { outline: "none" },
            }}
          >
            {link.label}
            {openDropdown === link.label ? (
              <KeyboardArrowUpIcon fontSize="small" />
            ) : (
              <KeyboardArrowDownIcon fontSize="small" />
            )}
          </Button>
        </ListItem>

        {/* Dropdown items */}
        {openDropdown === link.label &&
          link.dropdown.map((item) => (
            <ListItem key={item.path} disablePadding sx={{ pl: 3 }}>
              <Button
                disableRipple
                component={Link}
                to={item.path}
                fullWidth
                sx={{
                  justifyContent: "flex-start",
                  color: "primary.main",
                  textTransform: "none",
                  fontSize: "0.8rem", // 👈 smaller submenu
                  "&:hover": { color: "secondary.main" },
                  "&.Mui-focusVisible": { outline: "none" },
                }}
                onClick={() => setSidebarOpen(false)}
              >
                {item.label}
              </Button>
            </ListItem>
          ))}
      </React.Fragment>
    ) : (
      <ListItem key={link.path} disablePadding>
        <Button
          disableRipple
          component={Link}
          to={link.path!}
          fullWidth
          sx={{
            justifyContent: "flex-start",
            color: "primary.main",
            textTransform: "none",
            fontSize: "0.85rem", // 👈 smaller font
            "&:hover": { color: "secondary.main" },
            "&.Mui-focusVisible": { outline: "none" },
          }}
          onClick={() => setSidebarOpen(false)}
        >
          {link.label}
        </Button>
      </ListItem>
    )
  )}
</List>


                {/* CTA Button */}
                <Box sx={{ mt: 3 }}>
                  <Button
                    disableRipple
                    variant="contained"
                    color="secondary"
                    fullWidth
                    sx={{
                      borderRadius: 50,
                      textTransform: "none",
                      fontWeight: 600,
                      py: 1.2,
                      "&.Mui-focusVisible": { outline: "none" },
                    }}
                  >
                    Order Online
                  </Button>
                </Box>
              </motion.div>
            </>
          ) : (
            <>
              {/* Desktop Links */}
              <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center", gap: 3 }}>
                {navLinks.map((link) =>
                  link.dropdown ? (
                    <React.Fragment key={link.label}>
                      <Button
                        color="primary"
                        onClick={(e) => handleOpen(e, link.label)}
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
                    </React.Fragment>
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

              {/* CTA Button */}
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
            </>
          )}
        </Toolbar>
      </AppBar>

      <Toolbar disableGutters sx={{ minHeight: 0 }} />
    </Box>
  );
};

export default Nav;
