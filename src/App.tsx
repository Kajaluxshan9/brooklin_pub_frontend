import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './assets/components/home';
import About from './assets/components/about';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import ContactUs from './assets/components/contactus';
import * as React from "react";
import { useState } from "react";
import {
  ThemeProvider,
  createTheme,
  useMediaQuery,
} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  Box,
  Container,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import StarIcon from "@mui/icons-material/Star";

const theme = createTheme({
  palette: {
    primary: { main: "#8B4513" }, // SaddleBrown
    secondary: { main: "#DAA520" }, // GoldenRod
    background: { default: "#f5f5f5" },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

const menuItems = [
  {
    id: 1,
    name: "Classic Burger",
    description:
      "Grilled beef patty, cheddar, lettuce, tomato, house sauce on a toasted bun.",
    price: 14.99,
    imageUrl:
      "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Fish & Chips",
    description:
      "Crispy battered cod served with fries, coleslaw, lemon & tartar.",
    price: 16.5,
    imageUrl:
      "https://images.unsplash.com/photo-1560813837-d5400f0aa1f3?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Chicken Wings",
    description:
      "Jumbo wings tossed in your choice of sauce. Served with ranch.",
    price: 15.0,
    imageUrl:
      "https://images.unsplash.com/photo-1606756790138-261c1e3be0a5?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 4,
    name: "Steak & Fries",
    description: "Grilled striploin, herb butter, crispy fries.",
    price: 24.0,
    imageUrl:
      "https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 5,
    name: "Caesar Salad",
    description: "Romaine, parmesan, bacon, croutons, creamy dressing.",
    price: 12.0,
    imageUrl:
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 6,
    name: "Margherita Pizza",
    description: "San Marzano tomato, fior di latte, basil, olive oil.",
    price: 17.0,
    imageUrl:
      "https://images.unsplash.com/photo-1548365328-9f547fb09530?q=80&w=1200&auto=format&fit=crop",
  },
];

function App() {
  const isMobile = useMediaQuery("(max-width:900px)");
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => setMobileOpen((prev) => !prev);

  const drawer = (
    <Box role="presentation" sx={{ width: 250 }}>
      <Box sx={{ p: 2, display: "flex", alignItems: "center", gap: 1.5 }}>
        <RestaurantIcon color="primary" />
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Brooklin Pub
        </Typography>
      </Box>
      <Divider />
      <List>
        {["Home", "Menu", "About", "Contact"].map((text) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <Box sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Open daily · Kitchen till late
        </Typography>
      </Box>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {/* Top App Bar */}
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" elevation={2}>
          <Toolbar>
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}
            <RestaurantIcon sx={{ mr: 2 }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Brooklin Pub
            </Typography>
            {!isMobile && (
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button color="inherit">Home</Button>
                <Button color="inherit">Menu</Button>
                <Button color="inherit">About</Button>
                <Button color="inherit">Contact</Button>
              </Box>
            )}
          </Toolbar>
        </AppBar>

        {/* Mobile Navigation Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: 250 },
          }}
        >
          {drawer}
        </Drawer>

        {/* Hero Section */}
        <Box
          sx={{
            backgroundImage:
              "linear-gradient(rgba(139, 69, 19, 0.6), rgba(139, 69, 19, 0.6)), url(https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1600&h=500&fit=crop)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            color: "white",
            py: { xs: 6, md: 12 },
            textAlign: "center",
          }}
        >
          <Container maxWidth="lg">
            <Typography
              variant="h2"
              component="h1"
              gutterBottom
              sx={{
                fontSize: { xs: "2.25rem", md: "3.5rem" },
                fontWeight: "bold",
                textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
              }}
            >
              Welcome to Brooklin Pub
            </Typography>
            <Typography
              variant="h6"
              component="h2"
              sx={{
                mb: 4,
                fontSize: { xs: "1.1rem", md: "1.25rem" },
                textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
              }}
            >
              Experience the finest dining and atmosphere in town
            </Typography>
            <Button variant="contained" size="large" color="secondary" sx={{ px: 4, py: 1.5 }}>
              View Menu
            </Button>
          </Container>
        </Box>

        {/* Desktop Sidebar + Main Content */}
        <Box sx={{ display: "flex" }}>
          {/* Desktop Sidebar */}
          {!isMobile && (
            <Box
              component="nav"
              sx={{
                width: 250,
                flexShrink: 0,
                bgcolor: "background.paper",
                borderRight: "1px solid",
                borderColor: "divider",
                minHeight: "calc(100vh - 64px)",
              }}
            >
              {drawer}
            </Box>
          )}

          {/* Main Content */}
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: { xs: 2, md: 3 },
              width: { md: `calc(100% - 250px)` },
            }}
          >
            <Container maxWidth="xl" sx={{ px: { xs: 1, md: 3 } }}>
              <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 4 }}>
                Our Menu
              </Typography>

              <Grid container spacing={3}>
                {menuItems.map((item) => (
                  <Grid item xs={12} sm={6} lg={4} key={item.id}>
                    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                      <CardMedia
                        component="img"
                        height="200"
                        image={item.imageUrl}
                        alt={item.name}
                        sx={{ objectFit: "cover" }}
                      />
                      <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
                        <Typography gutterBottom variant="h6" component="div" sx={{ mb: 1 }}>
                          {item.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                          {item.description}
                        </Typography>
                        <Typography variant="h6" color="primary" sx={{ fontWeight: "bold" }}>
                          ${item.price}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              {/* Features Section */}
              <Box sx={{ mt: 8, mb: 4 }}>
                <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mb: 6 }}>
                  Why Choose Brooklin Pub?
                </Typography>
                <Grid container spacing={4}>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ textAlign: "center", p: 3 }}>
                      <RestaurantIcon sx={{ fontSize: 60, color: "primary.main", mb: 2 }} />
                      <Typography variant="h6" gutterBottom>
                        Fresh Ingredients
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        We source only the finest, locally-sourced ingredients for all our dishes.
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ textAlign: "center", p: 3 }}>
                      <StarIcon sx={{ fontSize: 60, color: "secondary.main", mb: 2 }} />
                      <Typography variant="h6" gutterBottom>
                        Award-Winning
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Recognized for excellence in food quality and customer service.
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ textAlign: "center", p: 3 }}>
                      <StarIcon sx={{ fontSize: 60, color: "error.main", mb: 2 }} />
                      <Typography variant="h6" gutterBottom>
                        Community Favorite
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Loved by locals and visitors alike for our warm atmosphere.
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Container>
          </Box>
        </Box>

        {/* Footer */}
        <Box
          component="footer"
          sx={{
            bgcolor: "primary.main",
            color: "white",
            py: 4,
            mt: 8,
          }}
        >
          <Container maxWidth="lg">
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Brooklin Pub
                </Typography>
                <Typography variant="body2">
                  Experience the finest dining and atmosphere in town. Join us for an unforgettable culinary journey.
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Contact Info
                </Typography>
                <Typography variant="body2">
                  15 Baldwin St, Whitby, ON L1M 0K8
                  <br />
                  Phone: (905) 425-3055
                  <br />
                  Email: info@brooklinpub.com
                </Typography>
              </Grid>
            </Grid>
            <Box sx={{ mt: 3, pt: 3, borderTop: "1px solid rgba(255,255,255,0.2)" }}>
              <Typography variant="body2" align="center">
                © {new Date().getFullYear()} Brooklin Pub. All rights reserved.
              </Typography>
            </Box>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
