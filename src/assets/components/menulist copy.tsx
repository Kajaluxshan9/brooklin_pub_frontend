"use client";
import React, { useEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";

// Replace these with your real categories (title, subtitle, image/icon)
const baseCategories = [
  {
    title: "Web3-Ready Real Estate Clients",
    subtitle: "Users buy, rent, and tokenize real estate through blockchain",
    image: "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d",
  },
  {
    title: "Millions of People",
    subtitle: "Everyday users, silently powered by our technologies",
    image: "https://images.unsplash.com/photo-151620 incidence",
  },
  {
    title: "Freelancers & Solopreneurs",
    subtitle: "Use our products for global payments and to store funds",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d",
  },
  {
    title: "KYC'd Users Across 30+ Platforms",
    subtitle: "Verified users across many marketplaces",
    image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2",
  },
  {
    title: "Users of CeDeFi Wallets",
    subtitle: "Secure on/off ramps and custodial experiences",
    image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2",
  },
  {
    title: "Enterprises & Partners",
    subtitle: "White-label integrations and enterprise tooling",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf",
  },
];

export default function CylindricalMenuCarousel() {
  const containerRef = useRef(null);
  const angleRef = useRef(0); // degrees
  const velocityRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const [angle, setAngle] = useState(0);

  // Config
  const autoSpeed = 10; // degrees per second (base auto-rotate)
  const scrollInfluence = 0.28; // how strongly scroll changes rotation
  const inertia = 0.94; // velocity decay
  const radius = 420; // distance from center (px)
  const cardW = 300;
  const cardH = 420;

  // Scroll influence
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const dy = y - lastY;
      lastY = y;
      velocityRef.current += dy * scrollInfluence;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Drag interaction (horizontal) to spin
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let dragging = false;
    let startX = 0;
    let startAngle = 0;

    const onDown = (e) => {
      dragging = true;
      startX = e.touches ? e.touches[0].clientX : e.clientX;
      startAngle = angleRef.current;
      document.body.style.cursor = "grabbing";
      document.body.style.userSelect = "none";
    };
    const onMove = (e) => {
      if (!dragging) return;
      const x = e.touches ? e.touches[0].clientX : e.clientX;
      const dx = x - startX;
      angleRef.current = startAngle + dx * 0.35; // sensitivity
      // small carry velocity
      velocityRef.current = dx * 0.03;
    };
    const onUp = () => {
      dragging = false;
      document.body.style.cursor = "auto";
      document.body.style.userSelect = "auto";
    };

    el.addEventListener("mousedown", onDown);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);

    el.addEventListener("touchstart", onDown, { passive: true });
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("touchend", onUp);

    return () => {
      el.removeEventListener("mousedown", onDown);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      el.removeEventListener("touchstart", onDown);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };
  }, []);

  // RAF loop: continuous rotation + velocity influence + inertia
  useEffect(() => {
    let raf = 0;
    const loop = (t) => {
      const dt = (t - lastTimeRef.current) / 1000;
      lastTimeRef.current = t;

      // base auto-rotate
      angleRef.current += autoSpeed * dt;

      // scroll / drag influence
      angleRef.current += velocityRef.current * dt;

      // decay velocity
      velocityRef.current *= Math.pow(inertia, dt * 60);

      // keep angle within reasonable bounds
      if (Math.abs(angleRef.current) > 3600) angleRef.current %= 360;

      setAngle(angleRef.current);
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const count = baseCategories.length;

  return (
    <Box
      ref={containerRef}
      sx={{
        width: "100%",
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(180deg, #ffffff 0%, #f2f4f7 100%)",
        p: { xs: 4, md: 8 },
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* header */}
      <Box sx={{ position: "absolute", top: 28, left: 32, zIndex: 50 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Explore Our Menu
        </Typography>
      </Box>

      {/* Cylinder viewport */}
      <Box
        sx={{
          width: { xs: "95%", md: 1100 },
          height: 520,
          position: "relative",
          perspective: 1600,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <motion.div
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            transformStyle: "preserve-3d",
            willChange: "transform",
            transform: `translateZ(-120px) rotateY(${angle}deg)`,
            transition: "transform 0.03s linear",
          }}
        >
          {baseCategories.map((c, i) => {
            const theta = (360 / count) * i; // card position around cylinder

            // compute relative angle difference to center facing angle
            const relative = ((angle - theta + 540) % 360) - 180; // range [-180,180]

            // simulate depth and focus
            const cos = Math.cos((relative * Math.PI) / 180);
            const depthZ = radius * cos; // closer when cos ~ 1
            const scale = 0.75 + 0.5 * Math.max(0.25, cos); // scale front cards larger
            const opacity = 0.25 + 0.75 * Math.max(0, cos); // dim side/back cards
            const blur = Math.max(0, 12 * (1 - cos));
            const transform = `rotateY(${theta}deg) translateZ(${radius}px)`;

            return (
              <Box
                key={i}
                sx={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  pointerEvents: "auto",
                }}
              >
                <motion.div
                  style={{
                    width: cardW,
                    height: cardH,
                    borderRadius: 18,
                    transformStyle: "preserve-3d",
                    transformOrigin: "center center",
                    transform,
                    zIndex: Math.round(100 * (cos + 1)),
                    scale,
                    opacity,
                    transition: "transform 0.2s linear, opacity 0.25s ease, filter 0.25s ease",
                    boxShadow:
                      "0 18px 40px rgba(15,23,42,0.08), 0 6px 18px rgba(15,23,42,0.06)",
                    background: "rgba(255,255,255,0.85)",
                    border: "1px solid rgba(15,23,42,0.04)",
                    overflow: "hidden",
                    backdropFilter: "blur(6px)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                  }}
                >
                  <Box
                    component="div"
                    sx={{
                      position: "absolute",
                      inset: 0,
                      backgroundImage: `url(${c.image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      filter: `brightness(${0.9 + 0.1 * cos})`,
                      transform: `translateZ(1px)`,
                    }}
                  />

                  <Box
                    sx={{
                      position: "absolute",
                      left: 0,
                      right: 0,
                      bottom: 0,
                      p: 3,
                      background: "linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.95) 85%)",
                      transform: "translateZ(2px)",
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a" }}>
                      {c.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#475569", mt: 0.5 }}>
                      {c.subtitle}
                    </Typography>
                  </Box>

                  {/* subtle depth-shift overlay to mimic blur for back cards */}
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      pointerEvents: "none",
                      backdropFilter: `blur(${blur}px)`,
                      WebkitBackdropFilter: `blur(${blur}px)`,
                    }}
                  />
                </motion.div>
              </Box>
            );
          })}
        </motion.div>
      </Box>
    </Box>
  );
}
