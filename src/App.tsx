import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useEffect, Suspense, lazy } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import ErrorBoundary from "./components/common/ErrorBoundary";
import LoadingScreen from "./components/common/LoadingScreen";
import ScrollTopFab from "./components/common/ScrollTopFab";
import SkipLink from "./components/common/SkipLink";

// Lazy-loaded page components for code splitting
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const ContactUs = lazy(() => import("./pages/ContactUs"));
const Special = lazy(() => import("./pages/Special"));
const MainMenu = lazy(() => import("./pages/MainMenu"));
const Events = lazy(() => import("./pages/Events"));

// Global image protection - prevent right-click and drag on all images
const setupImageProtection = () => {
  // Prevent right-click context menu on images
  document.addEventListener("contextmenu", (e) => {
    const target = e.target as HTMLElement;
    if (target.tagName === "IMG" || target.closest(".protected-image")) {
      e.preventDefault();
      return false;
    }
  });

  // Prevent drag on images
  document.addEventListener("dragstart", (e) => {
    const target = e.target as HTMLElement;
    if (target.tagName === "IMG") {
      e.preventDefault();
      return false;
    }
  });

  // Disable keyboard shortcuts for saving images (Ctrl+S, etc.)
  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "s") {
      e.preventDefault();
      return false;
    }
  });
};

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
    // Heading styles with elegant serif - refined hierarchy
    h1: {
      fontFamily: '"Cormorant Garamond", "Georgia", serif',
      fontWeight: 700,
      letterSpacing: "-0.02em",
      lineHeight: 1.1,
    },
    h2: {
      fontFamily: '"Cormorant Garamond", "Georgia", serif',
      fontWeight: 700,
      letterSpacing: "-0.015em",
      lineHeight: 1.15,
    },
    h3: {
      fontFamily: '"Cormorant Garamond", "Georgia", serif',
      fontWeight: 600,
      letterSpacing: "-0.01em",
      lineHeight: 1.2,
    },
    h4: {
      fontFamily: '"Cormorant Garamond", "Georgia", serif',
      fontWeight: 600,
      letterSpacing: "0",
      lineHeight: 1.25,
    },
    h5: {
      fontFamily: '"Cormorant Garamond", "Georgia", serif',
      fontWeight: 500,
      letterSpacing: "0.01em",
      lineHeight: 1.3,
    },
    h6: {
      fontFamily: '"Cormorant Garamond", "Georgia", serif',
      fontWeight: 500,
      letterSpacing: "0.02em",
      lineHeight: 1.35,
    },
    subtitle1: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 500,
      letterSpacing: "0.01em",
      lineHeight: 1.5,
    },
    subtitle2: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 500,
      letterSpacing: "0.02em",
      lineHeight: 1.5,
    },
    body1: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 400,
      letterSpacing: "0.01em",
      lineHeight: 1.7,
    },
    body2: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 400,
      letterSpacing: "0.015em",
      lineHeight: 1.6,
    },
    button: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 600,
      textTransform: "none" as const,
      letterSpacing: "0.03em",
    },
    caption: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 500,
      letterSpacing: "0.04em",
      lineHeight: 1.5,
    },
    overline: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 600,
      letterSpacing: "0.15em",
      lineHeight: 1.5,
      textTransform: "uppercase" as const,
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
  // Initialize image protection on mount
  useEffect(() => {
    setupImageProtection();
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <SkipLink />
          <ScrollToTop />
          <Suspense fallback={<LoadingScreen />}>
            <main id="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/contactus" element={<ContactUs />} />
                <Route path="/events" element={<Events />} />
                {/* All special routes use the Special page wrapper with SpecialDisplay */}
                <Route path="/special/:type" element={<Special />} />
                {/* Fallback: /special without type redirects to daily */}
                <Route path="/special" element={<Special />} />
                {/* Generic menu route that responds to query params like ?category=<id> */}
                <Route path="/menu" element={<MainMenu />} />
              </Routes>
            </main>
          </Suspense>
          <ScrollTopFab />
        </Router>
      </ThemeProvider>
    </ErrorBoundary>
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
