import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const sections = [
  {
    title: "Left Side Text 1",
    description: "This is the first section's text content on the left side.",
    image: "https://i.pinimg.com/736x/b7/7a/96/b77a96c72fa03abf25c398e565aec1a1.jpg",
  },
  {
    title: "Right Side Text 2",
    description: "This is the second section's text content on the right side.",
    image: "https://i.pinimg.com/736x/b0/2f/c8/b02fc86b1a599455dfb134e44b033b02.jpg",
  },
  {
    title: "Left Side Text 3",
    description: "This is the third section's text content on the left side.",
    image: "https://i.pinimg.com/736x/42/2c/2e/422c2e649799697f1d1355ba8f308edd.jpg",
  },
];

const AdditionalSpecial = () => {
  return (
    <div style={{ margin: 0, padding: 0 }}>
      {sections.map((section, index) => {
        const isEven = index % 2 === 0;

        // 🎨 Different font families
        const titleFont =
          index === 0
            ? "'Moon Dance', cursive"
            : index === 1
            ? "'Roboto Mono', monospace"
            : "'Poppins', sans-serif";

        const bodyFont =
          index === 0
            ? "'Poppins', sans-serif"
            : index === 1
            ? "'Playfair Display', serif"
            : "'Roboto Mono', monospace";

        // 🔥 Different font sizes (responsive)
        const titleSize = {
          xs: "48px", // 📱 mobile
          sm: "72px", // small tablets
          md: index === 0 ? "148px" : index === 1 ? "136px" : "140px", // desktop
        };

        const bodySize = {
          xs: "14px",
          sm: "16px",
          md: index === 0 ? "16px" : index === 1 ? "18px" : "15px",
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
                backgroundColor: isEven ? "primary.main" : "secondary.main",
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
