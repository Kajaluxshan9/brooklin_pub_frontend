import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from '../src/assets/pages/home';
import About from '../src/assets/pages/about';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Contactus from '../src/assets/pages/contactus';
import Special from '../src/assets/pages/special';
import Menu from '../src/assets/pages/menu';
import ChefSpecial from '../src/assets/pages/chefSpecial';

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
          minHeight: '0 !important',
          '@media (min-width:600px)': {
            minHeight: '0 !important',
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
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contactus" element={<Contactus />} />
          <Route path="/special/today" element={<Special />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/special/chef" element={<ChefSpecial />} />
          
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
