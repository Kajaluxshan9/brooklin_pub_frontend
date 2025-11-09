import { Box, Typography } from "@mui/material";

interface InitialPageProps {
  line1: string;
  line2: string;
}

const InitialPage = ({ line1, line2 }: InitialPageProps) => {
  return (
    <Box
      sx={{
        minHeight: {
          xs: "40vh", // mobile
          sm: "45vh", // small tablets
          md: "50vh", // laptops
          lg: "55vh", // big screens
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
        fontWeight={700}
        sx={{
          fontSize: {
            xs: "1.8rem",
            sm: "2.3rem",
            md: "2.8rem",
            lg: "3.2rem",
          },
          lineHeight: 1.2,
        }}
      >
        {line1}
      </Typography>

      <Typography
        color="text.secondary"
        sx={{
          fontSize: {
            xs: "0.9rem",
            sm: "1rem",
            md: "1.1rem",
          },
          maxWidth: "650px",
        }}
      >
        {line2}
      </Typography>
    </Box>
  );
};

export default InitialPage;
