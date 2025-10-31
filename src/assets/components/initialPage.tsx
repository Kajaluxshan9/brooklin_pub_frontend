import React from "react";
import { Box, Typography } from "@mui/material";

const InitialPage = ({ line1, line2 }) => {
  return (
    <Box
      sx={{
        minHeight: "70vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        gap: 1.5,
        background: 'var(--brown-gradient)',
      }}
    >
      <Typography variant="h2" fontWeight={700}>
        {line1}
      </Typography>

      <Typography variant="body1" color="text.secondary">
        {line2}
      </Typography>
    </Box>
  );
};

export default InitialPage;
