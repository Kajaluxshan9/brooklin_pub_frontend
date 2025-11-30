import { useEffect, useRef } from "react";
import gsap from "gsap";
import Box from "@mui/material/Box";

export default function PopupBackground() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (!containerRef.current) return;

      const ctx = gsap.context(() => {
        const shapes = containerRef.current?.querySelectorAll(".bg-shape");
        const particles =
          containerRef.current?.querySelectorAll(".bg-particle");
        const rings = containerRef.current?.querySelectorAll(".bg-ring");
        const sparkles = containerRef.current?.querySelectorAll(".bg-sparkle");

        // Animate geometric shapes
        if (shapes) {
          shapes.forEach((shape, i) => {
            // Floating movement
            gsap.to(shape, {
              x: "random(-80, 80)",
              y: "random(-80, 80)",
              rotation: "random(-120, 120)",
              duration: "random(10, 18)",
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
            });

            // Pulsing scale and opacity
            gsap.to(shape, {
              scale: "random(0.85, 1.15)",
              opacity: "random(0.1, 0.25)",
              duration: "random(5, 10)",
              repeat: -1,
              yoyo: true,
              ease: "power1.inOut",
              delay: i * 0.3,
            });
          });
        }

        // Animate particles
        if (particles) {
          particles.forEach((particle, i) => {
            // Rising motion
            gsap.fromTo(
              particle,
              {
                y: "100vh",
                x: "random(-30, 30)",
                opacity: 0,
              },
              {
                y: "-20vh",
                x: "random(-80, 80)",
                opacity: "random(0.4, 0.8)",
                duration: "random(18, 28)",
                repeat: -1,
                ease: "none",
                delay: i * 0.4,
              }
            );
          });
        }

        // Animate decorative rings
        if (rings) {
          rings.forEach((ring, i) => {
            gsap.to(ring, {
              scale: "random(0.9, 1.1)",
              opacity: "random(0.08, 0.18)",
              duration: "random(4, 8)",
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
              delay: i * 0.2,
            });

            gsap.to(ring, {
              rotation: "+=360",
              duration: 60 + i * 10,
              repeat: -1,
              ease: "none",
            });
          });
        }

        // Animate sparkles
        if (sparkles) {
          sparkles.forEach((sparkle, i) => {
            gsap.set(sparkle, { opacity: 0, scale: 0 });

            gsap.to(sparkle, {
              opacity: "random(0.5, 1)",
              scale: "random(0.8, 1.2)",
              duration: "random(1, 2)",
              repeat: -1,
              yoyo: true,
              ease: "power2.inOut",
              delay: i * 0.3 + Math.random() * 2,
            });
          });
        }
      }, containerRef);

      return () => ctx.revert();
    }, []);

    // Enhanced geometric shapes
    const shapes = [
      {
        size: 220,
        top: "8%",
        left: "3%",
        rotation: 45,
        type: "square",
        color: "#D9A756",
      },
      {
        size: 160,
        top: "75%",
        left: "88%",
        rotation: 0,
        type: "circle",
        color: "#B08030",
      },
      {
        size: 180,
        top: "35%",
        left: "78%",
        rotation: 30,
        type: "hexagon",
        color: "#C5933E",
      },
      {
        size: 130,
        top: "88%",
        left: "12%",
        rotation: 60,
        type: "circle",
        color: "#D9A756",
      },
      {
        size: 170,
        top: "55%",
        left: "92%",
        rotation: 15,
        type: "square",
        color: "#B08030",
      },
      {
        size: 150,
        top: "12%",
        left: "55%",
        rotation: 75,
        type: "circle",
        color: "#C5933E",
      },
      {
        size: 100,
        top: "45%",
        left: "8%",
        rotation: 20,
        type: "diamond",
        color: "#D9A756",
      },
      {
        size: 90,
        top: "25%",
        left: "92%",
        rotation: 45,
        type: "square",
        color: "#8B5A2B",
      },
    ];

    // Floating particles
    const particles = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      size: Math.random() * 6 + 3,
      left: `${Math.random() * 100}%`,
    }));

    // Decorative rings
    const rings = [
      { size: 400, top: "50%", left: "50%", borderWidth: 1 },
      { size: 320, top: "50%", left: "50%", borderWidth: 1 },
      { size: 240, top: "50%", left: "50%", borderWidth: 1 },
    ];

    // Sparkles
    const sparkles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      size: Math.random() * 4 + 2,
      left: `${10 + Math.random() * 80}%`,
      top: `${10 + Math.random() * 80}%`,
    }));

    const getShapeBorderRadius = (type: string) => {
      switch (type) {
        case "circle":
          return "50%";
        case "hexagon":
          return "25%";
        case "diamond":
          return "10%";
        default:
          return "15%";
      }
    };

    return (
      <Box
        ref={containerRef}
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          overflow: "hidden",
          zIndex: 0,
          pointerEvents: "none",
        }}
      >
        {/* Ambient Gradient Overlay */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background:
              "radial-gradient(ellipse at 30% 20%, #D9A75608 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, #B0803008 0%, transparent 50%)",
          }}
        />

        {/* Decorative Rings */}
        {rings.map((ring, i) => (
          <Box
            key={`ring-${i}`}
            className="bg-ring"
            sx={{
              position: "absolute",
              width: ring.size,
              height: ring.size,
              top: ring.top,
              left: ring.left,
              borderRadius: "50%",
              border: `${ring.borderWidth}px solid #D9A75615`,
              transform: "translate(-50%, -50%)",
              opacity: 0.12,
            }}
          />
        ))}

        {/* Geometric Shapes */}
        {shapes.map((shape, i) => (
          <Box
            key={`shape-${i}`}
            className="bg-shape"
            sx={{
              position: "absolute",
              width: shape.size,
              height: shape.size,
              top: shape.top,
              left: shape.left,
              borderRadius: getShapeBorderRadius(shape.type),
              border: `2px solid ${shape.color}`,
              background: `linear-gradient(135deg, ${shape.color}08 0%, ${shape.color}15 100%)`,
              transform: `rotate(${shape.rotation}deg)`,
              opacity: 0.18,
              boxShadow: `inset 0 0 30px ${shape.color}10`,
            }}
          />
        ))}

        {/* Floating Particles */}
        {particles.map((particle) => (
          <Box
            key={`particle-${particle.id}`}
            className="bg-particle"
            sx={{
              position: "absolute",
              width: particle.size,
              height: particle.size,
              borderRadius: "50%",
              background:
                particle.id % 3 === 0
                  ? "#D9A756"
                  : particle.id % 3 === 1
                  ? "#B08030"
                  : "#C5933E",
              left: particle.left,
              opacity: 0,
              boxShadow: `0 0 ${particle.size * 3}px ${
                particle.id % 2 === 0 ? "#D9A756" : "#B08030"
              }80`,
            }}
          />
        ))}

        {/* Sparkles */}
        {sparkles.map((sparkle) => (
          <Box
            key={`sparkle-${sparkle.id}`}
            className="bg-sparkle"
            sx={{
              position: "absolute",
              width: sparkle.size,
              height: sparkle.size,
              left: sparkle.left,
              top: sparkle.top,
              borderRadius: "50%",
              background: "#D9A756",
              boxShadow: `0 0 ${sparkle.size * 2}px #D9A756`,
            }}
          />
        ))}

        {/* Corner Accents */}
        <Box
          sx={{
            position: "absolute",
            top: 40,
            left: 40,
            width: 60,
            height: 60,
            borderTop: "2px solid #D9A75620",
            borderLeft: "2px solid #D9A75620",
            borderTopLeftRadius: 8,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: 40,
            right: 40,
            width: 60,
            height: 60,
            borderBottom: "2px solid #D9A75620",
            borderRight: "2px solid #D9A75620",
            borderBottomRightRadius: 8,
          }}
        />
      </Box>
    );
}
