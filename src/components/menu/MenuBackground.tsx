import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Box from "@mui/material/Box";

gsap.registerPlugin(ScrollTrigger);

export default function MenuBackground() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const ctx = gsap.context(() => {
          const shapes = containerRef.current?.querySelectorAll(".shape");
          const floatingDots =
            containerRef.current?.querySelectorAll(".floating-dot");
          const glowOrbs = containerRef.current?.querySelectorAll(".glow-orb");

          // Initial random positions for shapes
          shapes?.forEach((shape) => {
            gsap.set(shape, {
              left: `random(5, 95)%`,
              top: `random(5, 95)%`,
              rotation: "random(0, 360)",
              opacity: "random(0.08, 0.18)",
              scale: "random(0.6, 1.2)",
            });
          });

          // Parallax Scroll Animation
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: document.body,
              start: "top top",
              end: "bottom bottom",
              scrub: 1.5,
            },
          });

          shapes?.forEach((shape, i) => {
            const speed = (i + 1) * 40;
            const rotationSpeed = (i % 2 === 0 ? 1 : -1) * 120;

            tl.to(
              shape,
              {
                y: `+=${speed}`,
                rotation: `+=${rotationSpeed}`,
                ease: "none",
              },
              0
            );
          });

          // Continuous Floating Animation for shapes
          shapes?.forEach((shape) => {
            gsap.to(shape, {
              x: `random(-40, 40)`,
              y: `random(-40, 40)`,
              duration: "random(4, 8)",
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
            });
          });

          // Floating dots animation
          floatingDots?.forEach((dot, i) => {
            gsap.set(dot, {
              left: `random(10, 90)%`,
              top: `random(10, 90)%`,
              opacity: 0,
            });

            gsap.to(dot, {
              opacity: "random(0.3, 0.6)",
              scale: "random(0.8, 1.2)",
              duration: "random(2, 4)",
              delay: i * 0.3,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
            });

            gsap.to(dot, {
              x: "random(-60, 60)",
              y: "random(-60, 60)",
              duration: "random(6, 12)",
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
            });
          });

          // Glow orbs animation
          glowOrbs?.forEach((orb, i) => {
            gsap.to(orb, {
              scale: "random(0.8, 1.3)",
              opacity: "random(0.1, 0.25)",
              duration: "random(4, 8)",
              delay: i * 0.5,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
            });

            gsap.to(orb, {
              x: "random(-100, 100)",
              y: "random(-100, 100)",
              duration: "random(10, 20)",
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
            });
          });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
      <Box
        ref={containerRef}
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        {/* Abstract Geometric Shapes */}
        {[...Array(10)].map((_, i) => {
          const sizes = [180, 140, 100, 70, 50];
          const size = sizes[i % sizes.length];
          const isCircle = i % 3 !== 0;
          const colors = ["#D9A756", "#B08030", "#C5933E", "#8B5A2B"];
          const color = colors[i % colors.length];
          const hasFill = i % 4 === 0;

          return (
            <Box
              key={`shape-${i}`}
              className="shape"
              sx={{
                position: "absolute",
                width: size,
                height: size,
                borderRadius: isCircle ? "50%" : "16%",
                border: `2px solid ${color}`,
                background: hasFill ? `${color}15` : "transparent",
                transform: "translate(-50%, -50%)",
              }}
            />
          );
        })}

        {/* Floating Dots */}
        {[...Array(20)].map((_, i) => (
          <Box
            key={`dot-${i}`}
            className="floating-dot"
            sx={{
              position: "absolute",
              width: i % 3 === 0 ? 8 : i % 3 === 1 ? 6 : 4,
              height: i % 3 === 0 ? 8 : i % 3 === 1 ? 6 : 4,
              borderRadius: "50%",
              background: i % 2 === 0 ? "#D9A756" : "#B08030",
              boxShadow: `0 0 ${i % 2 === 0 ? 10 : 6}px ${
                i % 2 === 0 ? "#D9A756" : "#B08030"
              }60`,
              transform: "translate(-50%, -50%)",
            }}
          />
        ))}

        {/* Glow Orbs */}
        {[
          { size: 300, top: "10%", left: "10%", color: "#D9A756" },
          { size: 250, top: "70%", left: "80%", color: "#B08030" },
          { size: 200, top: "40%", left: "90%", color: "#C5933E" },
          { size: 280, top: "80%", left: "20%", color: "#D9A756" },
        ].map((orb, i) => (
          <Box
            key={`orb-${i}`}
            className="glow-orb"
            sx={{
              position: "absolute",
              width: orb.size,
              height: orb.size,
              top: orb.top,
              left: orb.left,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${orb.color}25 0%, transparent 70%)`,
              filter: "blur(40px)",
              opacity: 0.15,
              transform: "translate(-50%, -50%)",
            }}
          />
        ))}

        {/* Decorative Lines */}
        <Box
          sx={{
            position: "absolute",
            top: "20%",
            left: "5%",
            width: "200px",
            height: "1px",
            background:
              "linear-gradient(90deg, transparent, #D9A75640, transparent)",
            transform: "rotate(-30deg)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: "30%",
            right: "8%",
            width: "180px",
            height: "1px",
            background:
              "linear-gradient(90deg, transparent, #B0803040, transparent)",
            transform: "rotate(25deg)",
          }}
        />
      </Box>
    );
}
