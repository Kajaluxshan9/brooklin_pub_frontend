import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { motion } from "framer-motion";
import { Box, Typography, Button } from "@mui/material";
import Image1 from "../../assets/images/Landing page/item1.jpg";
import Image2 from "../../assets/images/Landing page/item2.jpg";
import Image3 from "../../assets/images/Landing page/item3.jpg";
import Image4 from "../../assets/images/Landing page/item4.jpg";
import Image5 from "../../assets/images/Landing page/item5.jpg";
import Image6 from "../../assets/images/Landing page/item6.jpg";
import Image7 from "../../assets/images/Landing page/item7.jpg";
import Image8 from "../../assets/images/Landing page/item8.jpg";


const images = [Image1,Image2,Image3,Image4,Image5,Image6,Image7,Image8];


const LandingPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const tinyRefs = useRef<(HTMLDivElement | null)[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);

  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Detect iOS for specific optimizations
    const iOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    setIsIOS(iOS);
  }, []);

  // Responsive radius and spacing based on viewport
  const getResponsiveValues = () => {
    if (typeof window === "undefined") return { radius: 800, spacing: 250 };
    const width = window.innerWidth;
    if (width < 480) return { radius: 300, spacing: 150 };
    if (width < 768) return { radius: 400, spacing: 180 };
    if (width < 1024) return { radius: 600, spacing: 200 };
    return { radius: 800, spacing: 250 };
  };

  const shuffleArray = (arr: string[]) => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  useEffect(() => {
    // prevent global horizontal scrolling while this component is mounted
    const prevOverflowX = document.documentElement.style.overflowX;
    document.documentElement.style.overflowX = "hidden";
    const cards = cardsRef.current;
    const total = cards.length;
    const { radius, spacing } = getResponsiveValues();

    // Main spiral cards
    cards.forEach((card, i) => {
      const angle = (i / total) * Math.PI * 2;
      const y = i * spacing;

      gsap.set(card, {
        rotationY: (angle * 180) / Math.PI,
        transformOrigin: `50% 50% ${-radius}px`,
        y: y,
        xPercent: -50,
        yPercent: -50,
        left: "50%",
        top: "50%",
        opacity: 1,
      });
    });

    gsap.to(cards, {
      rotationY: "+=360",
      duration: 20,
      repeat: -1,
      ease: "none",
      stagger: { each: 0.3, repeat: -1 },
    });

    // Continuous upward scroll
    gsap.to(cards, {
      y: `-=${total * spacing}`,
      duration: total * 2,
      repeat: -1,
      ease: "none",
      modifiers: {
        y: (y) => `${parseFloat(y) % (total * spacing)}px`,
      },
      stagger: { each: 0.3 },
    });

    // Image shuffle every 5s
    const interval = setInterval(() => {
      const shuffled = shuffleArray(images);
      shuffled.forEach((src, i) => {
        if (cards[i]) {
          gsap.to(cards[i], {
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
              cards[i]!.style.background = `url(${src}) center/cover no-repeat`;
              gsap.to(cards[i], { opacity: 1, duration: 0.5 });
            },
          });
        }
      });
    }, 5000);

    // Tiny floating images - reduce count on mobile for performance
    const tinyElements = tinyRefs.current;
    const isMobileView = window.innerWidth < 768;
    const isIOSDevice =
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

    tinyElements.forEach((el) => {
      if (!el || !containerRef.current) return;

      const vw = containerRef.current.clientWidth || window.innerWidth;
      const vh = containerRef.current.clientHeight || window.innerHeight;
      // Fewer particles on mobile/iOS for better performance
      const count = isIOSDevice ? 10 : isMobileView ? 15 : 50;
      const imgSize = isMobileView ? 12 : 20;

      el!.innerHTML = ""; // clear previous tiny images
      for (let j = 0; j < count; j++) {
        const imgEl = document.createElement("div");
        imgEl.classList.add("tiny-img");
        imgEl.style.width = `${imgSize}px`;
        imgEl.style.height = `${imgSize}px`;
        imgEl.style.borderRadius = "50%";
        imgEl.style.background = `url(${
          images[j % images.length]
        }) center/cover no-repeat`;
        imgEl.style.position = "absolute";
        // Use will-change for GPU acceleration
        imgEl.style.willChange = "transform";
        imgEl.style.transform = "translateZ(0)";

        // random position constrained to container bounds
        const x = Math.random() * Math.max(0, vw - imgSize);
        const y = Math.random() * Math.max(0, vh - imgSize);
        imgEl.style.left = `${x}px`;
        imgEl.style.top = `${y}px`;

        el!.appendChild(imgEl);

        // random floating animation - slower on mobile/iOS for performance
        const duration = isIOSDevice ? 12 : isMobileView ? 10 : 5;
        const movement = isIOSDevice ? 30 : isMobileView ? 40 : 100;
        gsap.to(imgEl, {
          x: "+=" + (Math.random() * movement - movement / 2),
          y: "+=" + (Math.random() * movement - movement / 2),
          duration: duration + Math.random() * 5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }
    });

    // GSAP animation for content
    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current.querySelectorAll(".hero-content-item"),
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          delay: 0.3,
        }
      );
    }

    return () => {
      clearInterval(interval);
      // restore document overflow-x
      document.documentElement.style.overflowX = prevOverflowX;
    };
  }, []);

  return (
    <Box
      ref={containerRef}
      sx={{
        perspective: "1500px",
        width: "100%",
        height: "100vh",
        // iOS doesn't support background-attachment: fixed, use static gradient
        background: isIOS
          ? "linear-gradient(135deg, #FDF8F3 0%, #F5EBE0 50%, #E8D5C4 100%)"
          : "linear-gradient(135deg, #FDF8F3 0%, #F5EBE0 50%, #E8D5C4 100%)",
        overflow: "hidden",
        position: "relative",
        // GPU acceleration for better mobile performance
        transform: "translateZ(0)",
        WebkitBackfaceVisibility: "hidden",
        backfaceVisibility: "hidden",
      }}
    >
      {images.map((src, i) => (
        <Box
          key={i}
          ref={(el: HTMLDivElement | null) => {
            cardsRef.current[i] = el;
          }}
          className="spiral-card"
          sx={{
            width: "90%",
            maxWidth: "600px",
            aspectRatio: "16/9",
            background: `url(${src}) center/cover no-repeat`,
            borderRadius: "24px",
            position: "absolute",
            boxShadow:
              "0 25px 50px rgba(0,0,0,0.5), 0 10px 20px rgba(0,0,0,0.3)",
            opacity: 0,
            border: "1px solid rgba(255,255,255,0.15)",
          }}
        >
          <Box
            ref={(el: HTMLDivElement | null) => {
              tinyRefs.current[i] = el;
            }}
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
            }}
          />
        </Box>
      ))}

      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background:
            "linear-gradient(180deg, rgba(74,44,23,0.65) 0%, rgba(60,31,14,0.75) 40%, rgba(74,44,23,0.7) 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10,
          textAlign: "center",
          color: "#FFFDFB",
          padding: "20px",
          gap: "20px",
        }}
      >
        {/* Decorative top accent */}
        <Box
          component={motion.div}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.1 }}
          sx={{
            width: { xs: 60, md: 100 },
            height: 3,
            background:
              "linear-gradient(90deg, transparent, #D9A756, transparent)",
            mb: 1,
            position: "relative",
            "&::before, &::after": {
              content: '""',
              position: "absolute",
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "#D9A756",
              top: "50%",
              transform: "translateY(-50%)",
            },
            "&::before": { left: -3 },
            "&::after": { right: -3 },
          }}
        />

        {/* Overline */}
        <Typography
          component={motion.p}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          sx={{
            color: "#D9A756",
            letterSpacing: { xs: "0.25em", md: "0.4em" },
            fontSize: { xs: "0.65rem", sm: "0.75rem", md: "0.9rem" },
            fontFamily: '"Inter", sans-serif',
            fontWeight: 700,
            textTransform: "uppercase",
            textShadow: "0 2px 10px rgba(0,0,0,0.3)",
          }}
        >
          ✦ Est. 2014 • Brooklin, Ontario ✦
        </Typography>

        {/* Main Heading */}
        <Typography
          component={motion.h1}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          sx={{
            fontSize: {
              xs: "2.5rem",
              sm: "3.5rem",
              md: "4.5rem",
              lg: "5.5rem",
            },
            fontWeight: 800,
            lineHeight: 1.05,
            fontFamily: '"Cormorant Garamond", Georgia, serif',
            letterSpacing: "-0.02em",
            textShadow: "0 6px 30px rgba(0,0,0,0.4)",
            maxWidth: "900px",
            px: 2,
            background: "linear-gradient(180deg, #FFFDFB 0%, #F3E3CC 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Welcome to Brooklin Pub
        </Typography>

        {/* Decorative divider */}
        <Box
          component={motion.div}
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: "auto" }}
          transition={{ duration: 0.6, delay: 0.6 }}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            my: 1,
          }}
        >
          <Box
            sx={{
              width: { xs: 30, md: 50 },
              height: 1,
              background: "rgba(217,167,86,0.5)",
            }}
          />
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#D9A756",
            }}
          />
          <Box
            sx={{
              width: { xs: 30, md: 50 },
              height: 1,
              background: "rgba(217,167,86,0.5)",
            }}
          />
        </Box>

        {/* Tagline */}
        <Typography
          component={motion.p}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          sx={{
            fontSize: { xs: "1rem", sm: "1.1rem", md: "1.35rem" },
            fontFamily: '"Inter", sans-serif',
            fontWeight: 400,
            color: "rgba(255,253,251,0.95)",
            maxWidth: "650px",
            lineHeight: 1.8,
            px: 3,
            textShadow: "0 2px 10px rgba(0,0,0,0.3)",
          }}
        >
          Where great food, cold drinks, and warm hospitality come together
        </Typography>

        {/* CTA Button */}
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          sx={{ mt: 3 }}
        >
          <Button
            component={motion.button}
            whileHover={{ scale: 1.06, y: -3 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              const nextSection =
                document.getElementById("menu-section") ||
                document.querySelector("section:nth-of-type(2)");
              if (nextSection) {
                nextSection.scrollIntoView({ behavior: "smooth" });
              } else {
                window.scrollBy({
                  top: window.innerHeight,
                  behavior: "smooth",
                });
              }
            }}
            sx={{
              background: "linear-gradient(135deg, #D9A756 0%, #B8923F 100%)",
              color: "#FFFDFB",
              px: { xs: 4, md: 5 },
              py: { xs: 1.5, md: 1.8 },
              borderRadius: "50px",
              fontFamily: '"Inter", sans-serif',
              fontWeight: 700,
              fontSize: { xs: "0.9rem", md: "1rem" },
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              boxShadow:
                "0 10px 35px rgba(217,167,86,0.5), 0 5px 15px rgba(0,0,0,0.2)",
              border: "2px solid rgba(255,255,255,0.15)",
              cursor: "pointer",
              position: "relative",
              overflow: "hidden",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: "-100%",
                width: "100%",
                height: "100%",
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
                transition: "left 0.5s ease",
              },
              "&:hover": {
                background: "linear-gradient(135deg, #E5B566 0%, #D9A756 100%)",
                boxShadow:
                  "0 15px 45px rgba(217,167,86,0.6), 0 8px 20px rgba(0,0,0,0.25)",
              },
              "&:hover::before": {
                left: "100%",
              },
            }}
          >
            Explore Our Menu
          </Button>
        </Box>

        {/* Scroll Indicator - positioned to avoid bottom nav on mobile */}
        <Box
          component={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{
            opacity: { duration: 0.6, delay: 1.3 },
            y: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
          }}
          sx={{
            position: "absolute",
            // Account for bottom nav on mobile (safe area + nav height)
            bottom: {
              xs: "calc(90px + env(safe-area-inset-bottom, 0px))",
              md: 40,
            },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
            cursor: "pointer",
            // Ensure clickable on mobile
            zIndex: 20,
            padding: "8px",
          }}
          onClick={() =>
            window.scrollBy({ top: window.innerHeight, behavior: "smooth" })
          }
        >
          <Typography
            sx={{
              fontSize: "0.7rem",
              letterSpacing: "0.25em",
              color: "rgba(255,253,251,0.6)",
              fontFamily: '"Inter", sans-serif',
              textTransform: "uppercase",
              fontWeight: 500,
            }}
          >
            Scroll Down
          </Typography>
          <Box
            sx={{
              width: 24,
              height: 40,
              borderRadius: 12,
              border: "2px solid rgba(217,167,86,0.5)",
              display: "flex",
              justifyContent: "center",
              pt: 1,
            }}
          >
            <Box
              component={motion.div}
              animate={{ y: [0, 12, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              sx={{
                width: 4,
                height: 8,
                borderRadius: 2,
                background: "#D9A756",
              }}
            />
          </Box>
        </Box>
      </Box>

      <style>{`
        .tiny-img { pointer-events: none; }
        @media (max-width: 1024px) { .spiral-card { max-width: 500px; } }
        @media (max-width: 768px) { .spiral-card { max-width: 350px; } }
        @media (max-width: 480px) { .spiral-card { max-width: 280px; } }
      `}</style>
    </Box>
  );
};

export default LandingPage;
