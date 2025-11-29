import { Box, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";

interface InitialPageProps {
  line1: string;
  line2: string;
}

const InitialPage = ({ line1, line2 }: InitialPageProps) => {
  const { pathname } = useLocation();

  // Show only on /contactus
  if (pathname !== "/contactus") return null;

  return (
    <Box
      sx={{
        minHeight: {
          xs: "40vh",
          sm: "45vh",
          md: "50vh",
          lg: "55vh",
        },
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        gap: { xs: 1, sm: 1.5, md: 2 },
        px: { xs: 2, sm: 4, md: 6 },
        background: "var(--brown-gradient)",
      }}
    >
      <Typography
        sx={{
          fontWeight: 700,
          fontSize: {
            xs: "1.8rem",
            sm: "2.3rem",
            md: "2.8rem",
            lg: "3.2rem",
          },
          lineHeight: 1.2,
          color: "#3C1F0E",
          fontFamily: '"Cormorant Garamond", Georgia, serif',
        }}
      >
        {line1}
      </Typography>

      <Typography
        sx={{
          fontSize: {
            xs: "0.9rem",
            sm: "1rem",
            md: "1.1rem",
          },
          maxWidth: "650px",
          color: "#3C1F0E",
          fontFamily: '"Inter", sans-serif',
        }}
      >
        {line2}
      </Typography>
    </Box>
  );
};

export default InitialPage;
