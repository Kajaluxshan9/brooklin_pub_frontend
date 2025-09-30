import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { 
  Container, 
  Typography, 
  AppBar, 
  Toolbar, 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Button, 
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery
} from '@mui/material';
import {
  Restaurant as RestaurantIcon,
  Menu as MenuIcon,
  Star as StarIcon
} from '@mui/icons-material';
import { useState } from 'react';

const theme = createTheme({
  palette: {
    primary: {
      main: '#8B4513', // Brown color for pub theme
    },
    secondary: {
      main: '#DAA520', // Gold color
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
          },
        },
      },
    },
  },
});

// Sample menu data
const menuItems = [
  {
    id: 1,
    name: 'Classic Burger',
    description: 'Juicy beef patty with lettuce, tomato, and our special sauce',
    price: 12.99,
    category: 'main',
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop',
  },
  {
    id: 2,
    name: 'Fish & Chips',
    description: 'Beer-battered cod with crispy fries and mushy peas',
    price: 15.99,
    category: 'main',
    imageUrl: 'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=300&h=200&fit=crop',
  },
  {
    id: 3,
    name: 'Chicken Wings',
    description: 'Spicy buffalo wings served with blue cheese dip',
    price: 9.99,
    category: 'appetizer',
    imageUrl: 'https://images.unsplash.com/photo-1608039755401-742074f0548d?w=300&h=200&fit=crop',
  },
  {
    id: 4,
    name: 'Craft Beer',
    description: 'Local brewery selection - Ask your server',
    price: 6.99,
    category: 'beverage',
    imageUrl: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=300&h=200&fit=crop',
  },
];

function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ width: 250, p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Menu Categories
      </Typography>
      <List>
        {['All Items', 'Appetizers', 'Main Course', 'Beverages', 'Desserts'].map((text) => (
          <ListItem key={text} sx={{ cursor: 'pointer' }}>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
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
          </Toolbar>
        </AppBar>

        {/* Mobile Navigation Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250 },
          }}
        >
          {drawer}
        </Drawer>

        {/* Hero Section */}
        <Box
          sx={{
            backgroundImage: 'linear-gradient(rgba(139, 69, 19, 0.7), rgba(139, 69, 19, 0.7)), url(https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1200&h=400&fit=crop)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            color: 'white',
            py: { xs: 6, md: 12 },
            textAlign: 'center',
          }}
        >
          <Container maxWidth="lg">
            <Typography 
              variant="h2" 
              component="h1" 
              gutterBottom
              sx={{ 
                fontSize: { xs: '2.5rem', md: '3.75rem' },
                fontWeight: 'bold',
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
              }}
            >
              Welcome to Brooklin Pub 1
            </Typography>
            <Typography 
              variant="h5" 
              component="h2" 
              sx={{ 
                mb: 4, 
                fontSize: { xs: '1.25rem', md: '1.5rem' },
                textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
              }}
            >
              Experience the finest dining and atmosphere in town
            </Typography>
            <Button 
              variant="contained" 
              size="large" 
              color="secondary"
              sx={{ 
                px: 4, 
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 'bold'
              }}
            >
              View Menu
            </Button>
          </Container>
        </Box>

        {/* Desktop Sidebar and Content */}
        <Box sx={{ display: 'flex' }}>
          {/* Desktop Sidebar */}
          {!isMobile && (
            <Box
              component="nav"
              sx={{
                width: 250,
                flexShrink: 0,
                bgcolor: 'background.paper',
                borderRight: '1px solid',
                borderColor: 'divider',
                minHeight: 'calc(100vh - 64px)',
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
                    <Card 
                      sx={{ 
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      <CardMedia
                        component="img"
                        height="200"
                        image={item.imageUrl}
                        alt={item.name}
                        sx={{ objectFit: 'cover' }}
                      />
                      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                        <Typography gutterBottom variant="h6" component="div" sx={{ mb: 1 }}>
                          {item.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                          {item.description}
                        </Typography>
                        <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
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
                    <Box sx={{ textAlign: 'center', p: 3 }}>
                      <RestaurantIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                      <Typography variant="h6" gutterBottom>
                        Fresh Ingredients
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        We source only the finest, locally-sourced ingredients for all our dishes.
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ textAlign: 'center', p: 3 }}>
                      <StarIcon sx={{ fontSize: 60, color: 'secondary.main', mb: 2 }} />
                      <Typography variant="h6" gutterBottom>
                        Award-Winning
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Recognized for excellence in food quality and customer service.
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ textAlign: 'center', p: 3 }}>
                      <StarIcon sx={{ fontSize: 60, color: 'error.main', mb: 2 }} />
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
            bgcolor: 'primary.main',
            color: 'white',
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
                  Experience the finest dining and atmosphere in town. 
                  Join us for an unforgettable culinary journey.
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Contact Info
                </Typography>
                <Typography variant="body2">
                  123 Main Street, Brooklyn, NY 11201<br />
                  Phone: (555) 123-4567<br />
                  Email: info@brooklinpub.com
                </Typography>
              </Grid>
            </Grid>
            <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid rgba(255,255,255,0.2)' }}>
              <Typography variant="body2" align="center">
                © 2025 Brooklin Pub. All rights reserved.
              </Typography>
            </Box>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
