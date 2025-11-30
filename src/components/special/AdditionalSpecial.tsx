import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const sections = [
  {
    title: "Crafted with Care",
    description:
      "Every dish at Brooklin Pub is prepared with the freshest ingredients and a passion for authentic flavors. Our kitchen team takes pride in creating memorable meals.",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80",
    accent: "Culinary Excellence",
    color: "#B08030", // Darker gold for contrast
  },
  {
    title: "Game Day Ready",
    description:
      "Catch all the action on our big screens with ice-cold drinks and our famous pub bites. The perfect spot to cheer on your favorite team with friends.",
    image:
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&q=80",
    accent: "Sports & Entertainment",
    color: "#A07020", // Darker bronze
  },
  {
    title: "Unforgettable Nights",
    description:
      "From live music to trivia nights, Brooklin Pub is the place to be for entertainment and great times. Join us for an experience you won't forget.",
    image:
      "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=1200&q=80",
    accent: "Live Events",
    color: "#906020", // Darker brown-gold
  },
];

const SectionComponent = ({
  section,
  index,
}: {
  section: typeof sections[0];
  index: number;
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Smooth spring animations
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // 3D rotation effect based on scroll
  const rotateX = useTransform(smoothProgress, [0, 0.5, 1], [15, 0, -15]);
  const rotateY = useTransform(
    smoothProgress,
    [0, 0.5, 1],
    index % 2 === 0 ? [-10, 0, 10] : [10, 0, -10]
  );

  // Scale and opacity
  const scale = useTransform(smoothProgress, [0, 0.3, 0.7, 1], [0.8, 1, 1, 0.8]);
  const opacity = useTransform(
    smoothProgress,
    [0, 0.2, 0.8, 1],
    [0, 1, 1, 0]
  );

  // Image zoom effect
  const imageScale = useTransform(smoothProgress, [0, 0.5, 1], [1.2, 1, 1.2]);

  // Text reveal animations
  const textY = useTransform(smoothProgress, [0, 0.3, 0.7, 1], [100, 0, 0, -100]);
  const textOpacity = useTransform(
    smoothProgress,
    [0, 0.3, 0.7, 1],
    [0, 1, 1, 0]
  );

  const isEven = index % 2 === 0;

  return (
    <Box
      ref={sectionRef}
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        py: { xs: 8, md: 12 },
        px: { xs: 2, md: 4 },
        background: `linear-gradient(135deg, 
          ${isEven ? "#faf9f6" : "#f0eadd"} 0%, 
          ${isEven ? "#f0eadd" : "#e6dfd1"} 50%, 
          ${isEven ? "#faf9f6" : "#f0eadd"} 100%)`,
      }}
    >
      {/* Animated mesh gradient background */}
      <Box
        component={motion.div}
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%"],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "linear",
        }}
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            radial-gradient(at 20% 30%, ${section.color}10 0%, transparent 50%),
            radial-gradient(at 80% 70%, ${section.color}08 0%, transparent 50%),
            radial-gradient(at 50% 50%, rgba(106,58,30,0.03) 0%, transparent 60%)
          `,
          backgroundSize: "200% 200%",
          pointerEvents: "none",
        }}
      />

      {/* Floating geometric shapes */}
      {[...Array(6)].map((_, i) => (
        <Box
          key={i}
          component={motion.div}
          animate={{
            y: [0, -30, 0],
            rotate: [0, 180, 360],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 10 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5,
          }}
          sx={{
            position: "absolute",
            width: `${40 + i * 20}px`,
            height: `${40 + i * 20}px`,
            border: `2px solid ${section.color}`,
            borderRadius: i % 2 === 0 ? "50%" : "0%",
            top: `${10 + i * 15}%`,
            left: `${5 + i * 15}%`,
            opacity: 0.15,
            pointerEvents: "none",
          }}
        />
      ))}

      {/* Main content container with 3D effect */}
      <Box
        component={motion.div}
        style={{
          rotateX,
          rotateY,
          scale,
          opacity,
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        sx={{
          maxWidth: "1400px",
          width: "100%",
          perspective: "2000px",
          transformStyle: "preserve-3d",
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: { xs: 4, md: 6 },
            alignItems: "center",
          }}
        >
          {/* Image Section with Magnetic Effect */}
          <Box
            component={motion.div}
            whileHover={{ scale: 1.02 }}
            sx={{
              order: { xs: 1, md: isEven ? 1 : 2 },
              position: "relative",
              height: { xs: "400px", md: "600px" },
              borderRadius: "30px",
              overflow: "hidden",
              boxShadow: `0 30px 80px rgba(0,0,0,0.15), 
                         0 0 0 1px ${section.color}40,
                         inset 0 0 100px rgba(0,0,0,0.1)`,
              transform: isHovered ? "translateZ(50px)" : "translateZ(0px)",
              transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            {/* Layered image with parallax */}
            <Box
              component={motion.div}
              style={{ scale: imageScale }}
              sx={{
                position: "absolute",
                inset: 0,
                backgroundImage: `url(${section.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                filter: isHovered ? "brightness(1.05)" : "brightness(1)",
                transition: "filter 0.6s ease",
              }}
            />

            {/* Gradient overlay with animated border */}
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                background: `linear-gradient(135deg, 
                  transparent 0%, 
                  ${section.color}15 50%, 
                  transparent 100%)`,
                opacity: isHovered ? 0.4 : 0.2,
                transition: "opacity 0.6s ease",
              }}
            />

            {/* Animated corner accents */}
            <Box
              component={motion.div}
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 2, delay: 0.5 }}
              sx={{
                position: "absolute",
                top: 20,
                left: 20,
                width: 80,
                height: 80,
                border: `3px solid ${section.color}`,
                borderRight: "none",
                borderBottom: "none",
                opacity: 0.9,
              }}
            />
            <Box
              component={motion.div}
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 2, delay: 0.7 }}
              sx={{
                position: "absolute",
                bottom: 20,
                right: 20,
                width: 80,
                height: 80,
                border: `3px solid ${section.color}`,
                borderLeft: "none",
                borderTop: "none",
                opacity: 0.9,
              }}
            />

            {/* Floating number badge */}
            <Box
              component={motion.div}
              whileHover={{ scale: 1.15, rotate: 360 }}
              transition={{ duration: 0.6 }}
              sx={{
                position: "absolute",
                top: -20,
                right: -20,
                width: 100,
                height: 100,
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${section.color} 0%, ${section.color}dd 100%)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                fontSize: "3rem",
                fontWeight: 800,
                color: "#fff",
                boxShadow: `0 10px 40px ${section.color}60, inset 0 2px 0 rgba(255,255,255,0.4)`,
                border: "4px solid rgba(255,255,255,0.4)",
                cursor: "pointer",
                textShadow: "0 2px 4px rgba(0,0,0,0.2)",
              }}
            >
              {index + 1}
            </Box>

            {/* Shimmer effect */}
            <Box
              component={motion.div}
              animate={{
                x: ["-100%", "200%"],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatDelay: 2,
                ease: "easeInOut",
              }}
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: `linear-gradient(90deg, 
                  transparent 0%, 
                  rgba(255,255,255,0.3) 50%, 
                  transparent 100%)`,
                transform: "skewX(-20deg)",
                pointerEvents: "none",
              }}
            />
          </Box>

          {/* Text Content Section */}
          <Box
            component={motion.div}
            style={{ y: textY, opacity: textOpacity }}
            sx={{
              order: { xs: 2, md: isEven ? 2 : 1 },
              position: "relative",
              zIndex: 2,
            }}
          >
            {/* Accent label with animated underline */}
            <Box sx={{ mb: 3 }}>
              <Typography
                component={motion.div}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                sx={{
                  fontFamily: '"Inter", sans-serif',
                  fontSize: { xs: "0.9rem", md: "1rem" },
                  fontWeight: 700,
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: section.color,
                  mb: 1,
                  display: "inline-block",
                }}
              >
                {section.accent}
              </Typography>
              <Box
                component={motion.div}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                sx={{
                  height: 3,
                  width: 120,
                  background: `linear-gradient(90deg, ${section.color} 0%, transparent 100%)`,
                  transformOrigin: "left",
                }}
              />
            </Box>

            {/* Main title with split text animation */}
            <Typography
              component={motion.h2}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              sx={{
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                fontSize: { xs: "3.5rem", sm: "4.5rem", md: "6rem" },
                fontWeight: 800,
                lineHeight: 0.95,
                mb: 4,
                color: "#2a1410",
                textShadow: `0 4px 20px rgba(0,0,0,0.05), 0 0 40px ${section.color}20`,
                letterSpacing: "-0.02em",
                position: "relative",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  bottom: -10,
                  left: 0,
                  width: "60%",
                  height: 2,
                  background: `linear-gradient(90deg, ${section.color} 0%, transparent 100%)`,
                },
              }}
            >
              {section.title}
            </Typography>

            {/* Description with stagger effect */}
            <Typography
              component={motion.p}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}
              sx={{
                fontFamily: '"Inter", sans-serif',
                fontSize: { xs: "1.1rem", md: "1.25rem" },
                lineHeight: 1.9,
                color: "rgba(42, 20, 16, 0.8)",
                mb: 5,
                maxWidth: "90%",
                textShadow: "0 1px 2px rgba(0,0,0,0.05)",
              }}
            >
              {section.description}
            </Typography>

            {/* Decorative elements */}
            <Box
              sx={{
                display: "flex",
                gap: 2,
                alignItems: "center",
              }}
            >
              {[...Array(3)].map((_, i) => (
                <Box
                  key={i}
                  component={motion.div}
                  initial={{ scale: 0, rotate: -180 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.6,
                    delay: 0.7 + i * 0.1,
                    type: "spring",
                  }}
                  sx={{
                    width: 12,
                    height: 12,
                    background: section.color,
                    transform: "rotate(45deg)",
                    opacity: 1 - i * 0.3,
                  }}
                />
              ))}
            </Box>

            {/* Large decorative quote mark */}
            <Box
              component={motion.div}
              initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
              whileInView={{ opacity: 0.08, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.8 }}
              sx={{
                position: "absolute",
                bottom: { xs: -80, md: -120 },
                right: { xs: -40, md: -60 },
                fontSize: { xs: "15rem", md: "20rem" },
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                fontWeight: 700,
                color: section.color,
                lineHeight: 1,
                pointerEvents: "none",
                userSelect: "none",
              }}
            >
              "
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Scroll indicator */}
      {index < sections.length - 1 && (
        <Box
          component={motion.div}
          animate={{
            y: [0, 15, 0],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          sx={{
            position: "absolute",
            bottom: 40,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
            color: section.color,
          }}
        >
          <Typography
            sx={{
              fontSize: "0.75rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              fontFamily: '"Inter", sans-serif',
              fontWeight: 600,
            }}
          >
            Scroll
          </Typography>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </svg>
        </Box>
      )}
    </Box>
  );
};

const AdditionalSpecial = () => {
  return (
    <Box sx={{ margin: 0, padding: 0, overflow: "hidden" }}>
      {sections.map((section, index) => (
        <SectionComponent key={index} section={section} index={index} />
      ))}
    </Box>
  );
};

export default AdditionalSpecial;
