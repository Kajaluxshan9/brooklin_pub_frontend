import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './assets/components/home';
import About from './assets/components/about';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import ContactUs from './assets/components/contactus';

const theme = createTheme({
  palette: {
    primary: {
      main: '#8B4513',
    },
    secondary: {
      main: '#DAA520',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About/>} />
          <Route path="/contact" element={<ContactUs/>} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
