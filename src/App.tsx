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
import Menu from "./pages/Menu";
import ChefSpecial from "./pages/ChefSpecial";
import ScrollTopFab from "./components/common/ScrollTopFab";
import MainMenu from "./pages/mainmenu";
import DrinksMenu from "./pages/DrinkMenu";

const theme = createTheme({
  palette: {
    primary: { main: "#8B4513" },
    secondary: { main: "#DAA520" },
    background: { default: "#f5f5f5" },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
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
          <Route path="/menu" element={<Menu />} />
          <Route path="/special/night" element={<ChefSpecial />} />
          <Route path="/menu/main-menu" element={<MainMenu />} />
          <Route path="/menu/drink-menu" element={<DrinksMenu />} />
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
