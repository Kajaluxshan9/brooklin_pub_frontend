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
  { label: 'Contact Us', path: '/contact' },
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
                <ListItemText primary={link.label} sx={{ color: 'secondary.main' }} />
              </ListItem>
              {link.dropdown.map((item) => (
                <ListItem
                  key={item.path}
                  component={Link}
                  to={item.path}
                  sx={{ pl: 4, color: 'secondary.main' }}
                >
                  <ListItemText primary={item.label} sx={{ color: 'secondary.main' }} />
                </ListItem>
              ))}
            </React.Fragment>
          ) : (
            <ListItem key={link.path} component={Link} to={link.path!}>
              <ListItemText primary={link.label} sx={{ color: 'secondary.main' }} />
            </ListItem>
          )
        )}
      </List>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" elevation={0} sx={{ backgroundColor: 'primary.main', height: 56 }}>
        <Toolbar variant="dense" sx={{ minHeight: 56, px: 2 }}>
          {isMobile ? (
            <>
              <IconButton size="large" edge="start" color="inherit" onClick={toggleDrawer(true)}>
                <MenuIcon sx={{ color: 'secondary.main' }} />
              </IconButton>
              <Typography variant="h6" sx={{ flexGrow: 1, color: 'secondary.main' }}>
                Brooklin Pub
              </Typography>
              <Drawer anchor="left" open={mobileOpen} onClose={toggleDrawer(false)}>
                {drawerContent}
              </Drawer>
            </>
          ) : (
            <>
              <Typography variant="h6" sx={{ flexGrow: 1, color: 'secondary.main' }}>
                Brooklin Pub
              </Typography>
              {navLinks.map((link) =>
                link.dropdown ? (
                  <React.Fragment key={link.label}>
                    <Button
                      color="inherit"
                      size="small"
                      onClick={(e) => handleOpen(e, link.label)}
                      sx={{
                        color: 'secondary.main',
                        '&:hover': { color: 'secondary.light', backgroundColor: 'transparent' },
                        mx: 0.5,
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
                            color: 'secondary.main',
                            '&:hover': { color: 'secondary.light', backgroundColor: 'inherit' },
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
                    color="inherit"
                    size="small"
                    component={Link}
                    to={link.path!}
                    sx={{
                      color: 'secondary.main',
                      '&:hover': { color: 'secondary.light', backgroundColor: 'transparent' },
                      mx: 0.5,
                    }}
                  >
                    {link.label}
                  </Button>
                )
              )}
            </>
          )}
        </Toolbar>
      </AppBar>
      <Toolbar variant="dense" sx={{ minHeight: 56 }} />
    </Box>
  );
};

export default Nav;
