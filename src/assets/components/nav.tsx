import React, { useState } from 'react';
import type { MouseEvent } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { Link } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';


type DropdownItem = {
  label: string;
  path: string;
};

type NavLink = {
  label: string;
  path?: string;
  dropdown?: DropdownItem[];
};

const navLinks: NavLink[] = [
  { label: 'Home', path: '/' },
  { label: 'About Us', path: '/about' },
  {
    label: 'Menu',
    dropdown: [
      { label: 'Drinks', path: '/menu/drinks' },
      { label: 'Food', path: '/menu/food' },
      { label: 'Desserts', path: '/menu/desserts' },
    ],
  },
  {
    label: 'Special',
    dropdown: [
      { label: 'Today’s Special', path: '/special/today' },
      { label: 'Chef’s Choice', path: '/special/chef' },
    ],
  },
  { label: 'Contact Us', path: '/contactus' },
];

const Nav = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleOpen = (event: MouseEvent<HTMLElement>, label: string) => {
    setAnchorEl(event.currentTarget);
    setOpenDropdown(label);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpenDropdown(null);
  };

  const toggleDrawer = (open: boolean) => () => {
    setMobileOpen(open);
  };

  const drawerContent = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        {navLinks.map((link) =>
          link.dropdown ? (
            <React.Fragment key={link.label}>
              <ListItem>
                <ListItemText primary={link.label} />
              </ListItem>
              {link.dropdown.map((item) => (
                <ListItem key={item.path} component={Link} to={item.path} sx={{ pl: 4 }}>
                  <ListItemText primary={item.label} />
                </ListItem>
              ))}
            </React.Fragment>
          ) : (
            <ListItem key={link.path} component={Link} to={link.path!}>
              <ListItemText primary={link.label} />
            </ListItem>
          )
        )}
      </List>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
 <AppBar
  position="fixed"
  elevation={3}
  sx={{
    top: 25,
    left: '50%',
    transform: 'translateX(-50%)',
    width: { xs: '95%', sm: '90%', md: '85%' },
    bgcolor: 'background.paper',
    borderRadius: 50,
    boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
    height: 110,
  }}
>
<Toolbar
  disableGutters 
  sx={{
    minHeight: '0 important',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
    px: 4,
  }}
>
  {/* Logo */}
  <Box sx={{ display: 'flex', alignItems: 'center' }}>
    <img
      src="./brooklinpub-logo.png"
      alt="Logo"
      style={{
        height: '80px',
        objectFit: 'contain',
        cursor: 'pointer',
      }}
    />
  </Box>


    {isMobile ? (
      <>
        <IconButton size="large" edge="start" onClick={toggleDrawer(true)}>
          <MenuIcon sx={{ color: 'primary.main' }} />
        </IconButton>
        <Drawer anchor="left" open={mobileOpen} onClose={toggleDrawer(false)}>
          {drawerContent}
        </Drawer>
      </>
    ) : (
      <>
        {/* Centered Nav Links */}
{/* Centered Nav Links */}
<Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', gap: 3 }}>
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
            textTransform: 'none',
            color: 'primary.main',
            '&:hover': {
              color: 'secondary.main',
            },
          }}
        >
          {link.label}
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={openDropdown === link.label}
          onClose={handleClose}
        >
          {link.dropdown.map((item) => (
            <MenuItem
              key={item.path}
              component={Link}
              to={item.path}
              onClick={handleClose}
              sx={{
                color: 'primary.main',
                '&:hover': {
                  color: 'secondary.main',
                },
              }}
            >
              {item.label}
            </MenuItem>
          ))}
        </Menu>
      </React.Fragment>
    ) : (
      <Button
        key={link.path}
        component={Link}
        to={link.path!}
        sx={{
          fontWeight: 500,
          textTransform: 'none',
          color: 'primary.main',
          '&:hover': {
            color: 'secondary.main',
          },
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
            textTransform: 'none',
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
