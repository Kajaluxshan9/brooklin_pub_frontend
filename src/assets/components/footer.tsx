import React from "react";
import { Box, Typography, Link, IconButton } from "@mui/material";
import { Facebook, Instagram } from "@mui/icons-material";
import MusicNoteIcon from "@mui/icons-material/MusicNote";

const Footer = () => {
return (
<Box
component="footer"
sx={{
backgroundColor: "#6b4423", // brown background
color: "white",
padding: "2rem 4rem",
fontFamily: "Arial, sans-serif",
}}
>
{/* Top Section */}
<Box sx={{ textAlign: "center", marginBottom: "2rem" }}>
<Typography variant="h4" sx={{ fontWeight: "bold" }}>
Ready to Dine With Us? </Typography>
<Typography sx={{ marginTop: "0.5rem" }}>
Visit us at 15 Baldwin St, Whitby or order online for pickup and delivery </Typography>
<Box
component="button"
sx={{
backgroundColor: "#d4af37",
border: "none",
padding: "0.8rem 2rem",
borderRadius: "8px",
marginTop: "1.5rem",
fontWeight: "bold",
fontSize: "1rem",
cursor: "pointer",
boxShadow: "0px 2px 4px rgba(0,0,0,0.3)",
}}
>
Order Online Now </Box> </Box>

```
  {/* Bottom Section */}
  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      flexWrap: "wrap",
      borderTop: "1px solid rgba(255,255,255,0.2)",
      paddingTop: "2rem",
    }}
  >
    {/* Left Column */}
    <Box sx={{ maxWidth: "250px" }}>
      <img
        src="https://i.imgur.com/NM5JX0P.png" // Replace with your logo
        alt="Brooklin Logo"
        style={{ width: "60px", marginBottom: "10px" }}
      />
      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
        Brooklin Pub & Grill
      </Typography>
      <Typography sx={{ marginTop: "0.5rem", fontSize: "0.9rem" }}>
        Experience the best pub dining in Whitby. Great food, great atmosphere, great times!
      </Typography>
      <Typography
        sx={{ marginTop: "0.5rem", fontSize: "0.9rem", fontStyle: "italic" }}
      >
        Happy-hour food • Great cocktails • Live music
      </Typography>

      {/* Social Icons */}
      <Box sx={{ marginTop: "1rem" }}>
        <IconButton sx={{ color: "white" }}>
          <Facebook />
        </IconButton>
        <IconButton sx={{ color: "white" }}>
          <Instagram />
        </IconButton>
        <IconButton sx={{ color: "white" }}>
          <MusicNoteIcon />
        </IconButton>
      </Box>
    </Box>

    {/* Contact Info */}
    <Box>
      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
        Contact Info
      </Typography>
      <Typography sx={{ fontSize: "0.9rem", marginTop: "0.5rem" }}>
        📍 15 Baldwin St, Whitby, ON L1M 1A2
      </Typography>
      <Typography sx={{ fontSize: "0.9rem" }}>📞 +1 905-425-3055</Typography>
      <Typography sx={{ fontSize: "0.9rem" }}>
        ✉️ brooklinpub@gmail.com
      </Typography>
    </Box>

    {/* Opening Hours */}
    <Box>
      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
        Opening Hours
      </Typography>
      <Typography sx={{ fontSize: "0.9rem", marginTop: "0.5rem" }}>
        Sunday - Thursday: 11 AM - 11 PM
      </Typography>
      <Typography sx={{ fontSize: "0.9rem" }}>
        Friday - Saturday: 11 AM - 1 AM
      </Typography>
    </Box>

    {/* Quick Links */}
    <Box>
      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
        Quick Links
      </Typography>
      <Box sx={{ marginTop: "0.5rem", display: "flex", flexDirection: "column" }}>
        <Link href="#" underline="hover" color="inherit">
          Home
        </Link>
        <Link href="#" underline="hover" color="inherit">
          About Us
        </Link>
        <Link href="#" underline="hover" color="inherit">
          Menu
        </Link>
        <Link href="#" underline="hover" color="inherit">
          Specials
        </Link>
        <Link href="#" underline="hover" color="inherit">
          Contact Us
        </Link>
      </Box>
    </Box>
  </Box>

  {/* Footer Bottom */}
  <Box
    sx={{
      textAlign: "center",
      marginTop: "2rem",
      borderTop: "1px solid rgba(255,255,255,0.2)",
      paddingTop: "1rem",
      fontSize: "0.85rem",
      color: "rgba(255,255,255,0.7)",
    }}
  >
    © 2025 BROOKLINPUB. ALL RIGHTS RESERVED <br />
    Website design by{" "}
    <Link href="#" color="inherit" underline="hover">
      AK Vision Systems
    </Link>
  </Box>
</Box>

);
};

export default Footer;
