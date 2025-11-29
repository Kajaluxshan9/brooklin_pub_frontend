import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const sections = [
  {
    title: "Crafted with Care",
    description:
      "Every dish at Brooklin Pub is prepared with the freshest ingredients and a passion for authentic flavors. Our kitchen team takes pride in creating memorable meals.",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80",
  },
  {
    title: "Game Day Ready",
    description:
      "Catch all the action on our big screens with ice-cold drinks and our famous pub bites. The perfect spot to cheer on your favorite team with friends.",
    image:
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&q=80",
  },
  {
    title: "Unforgettable Nights",
    description:
      "From live music to trivia nights, Brooklin Pub is the place to be for entertainment and great times. Join us for an experience you won't forget.",
    image:
      "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=1200&q=80",
  },
];

const AdditionalSpecial = () => {
  return (
    <div style={{ margin: 0, padding: 0 }}>
      {sections.map((section, index) => {
        const isEven = index % 2 === 0;

        // 🎨 Consistent font families matching brand theme
        const titleFont = "'Cormorant Garamond', Georgia, serif";
        const bodyFont = "'Inter', sans-serif";

        // 🔥 Consistent responsive font sizes
        const titleSize = {
          xs: "2.5rem",
          sm: "3.5rem",
          md: "4.5rem",
        };

        const bodySize = {
          xs: "1rem",
          sm: "1.1rem",
          md: "1.2rem",
        };

        return (
          <Box
            key={index}
            sx={{
              display: "flex",
              height: "100vh",
              width: "100vw",
              flexDirection: { xs: "column", md: "row" },
              overflow: "hidden",
            }}
          >
            {/* TEXT */}
            <Box
              sx={{
                flex: 1,
                order: { xs: 1, md: isEven ? 1 : 2 },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: isEven
                  ? "linear-gradient(135deg, #6A3A1E 0%, #3C1F0E 100%)"
                  : "linear-gradient(135deg, #D9A756 0%, #B8923F 100%)",
                color: "white",
                p: { xs: 2, sm: 3, md: 4 },
                textAlign: { xs: "center", md: "left" },
              }}
            >
              <Box>
                <Typography
                  variant="h3"
                  gutterBottom
                  sx={{
                    fontFamily: titleFont,
                    fontSize: titleSize,
                    lineHeight: 1.1,
                  }}
                >
                  {section.title}
                </Typography>

                <Typography
                  variant="body1"
                  sx={{
                    fontFamily: bodyFont,
                    fontSize: bodySize,
                    maxWidth: { xs: "90%", md: "80%" },
                    margin: "0 auto",
                  }}
                >
                  {section.description}
                </Typography>
              </Box>
            </Box>

            {/* IMAGE */}
            <Box
              sx={{
                flex: 1,
                order: { xs: 2, md: isEven ? 2 : 1 },
                backgroundImage: `url(${section.image})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundAttachment: "fixed",
              }}
            />
          </Box>
        );
      })}
    </div>
  );
};

export default AdditionalSpecial;




