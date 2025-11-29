import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useEffect } from "react";
import Home from "./pages/Home";
import About from "./pages/About";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import ContactUs from "./pages/ContactUs";
import Special from "./pages/Special";
// import Menu from "./pages/Menu";
import ChefSpecial from "./pages/ChefSpecial";
import SpecialDisplay from "./components/special/SpecialDisplay";
import ScrollTopFab from "./components/common/ScrollTopFab";
import MainMenu from "./pages/MainMenu";

const theme = createTheme({
  palette: {
    primary: {
      main: "#6A3A1E", // --brown-primary
      dark: "#3C1F0E", // --brown-dark
      light: "#8B4513", // lighter brown
    },
    secondary: {
      main: "#D9A756", // --gold-accent
      light: "#E8C078",
      dark: "#B8923F",
    },
    background: {
      default: "#FDF8F3", // warm cream
      paper: "#FFFDFB",
    },
    text: {
      primary: "#3C1F0E", // --brown-dark for main text
      secondary: "#6A3A1E", // --brown-primary for secondary
    },
    error: {
      main: "#8A2A2A", // --wine-red
    },
  },
  typography: {
    // Primary font for body text - clean, modern, highly readable
    fontFamily: '"Inter", "Helvetica Neue", "Arial", sans-serif',
    // Heading styles with elegant serif
    h1: {
      fontFamily: '"Cormorant Garamond", "Georgia", serif',
      fontWeight: 600,
    },
    h2: {
      fontFamily: '"Cormorant Garamond", "Georgia", serif',
      fontWeight: 600,
    },
    h3: {
      fontFamily: '"Cormorant Garamond", "Georgia", serif',
      fontWeight: 600,
    },
    h4: {
      fontFamily: '"Cormorant Garamond", "Georgia", serif',
      fontWeight: 500,
    },
    h5: {
      fontFamily: '"Cormorant Garamond", "Georgia", serif',
      fontWeight: 500,
    },
    h6: {
      fontFamily: '"Cormorant Garamond", "Georgia", serif',
      fontWeight: 500,
    },
    subtitle1: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 500,
    },
    subtitle2: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 500,
    },
    body1: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 400,
    },
    body2: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 400,
    },
    button: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 600,
      textTransform: "none" as const,
    },
  },
  components: {
    MuiToolbar: {
      styleOverrides: {
        root: {
          minHeight: "0 !important",
          "@media (min-width:600px)": {
            minHeight: "0 !important",
          },
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contactus" element={<ContactUs />} />
          <Route path="/special/daily" element={<Special />} />
          <Route path="/special/night" element={<ChefSpecial />} />
          {/* Generic special route for any type (e.g. /special/chef, /special/daily, /special/night) */}
          <Route path="/special/:type" element={<SpecialDisplay />} />
          {/* Generic menu route that responds to query params like ?category=<id> */}
          <Route path="/menu" element={<MainMenu />} />
        </Routes>
        <ScrollTopFab />
      </Router>
    </ThemeProvider>
  );
}

export default App;

/** ScrollToTop component ensures each route change starts at page top */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}
