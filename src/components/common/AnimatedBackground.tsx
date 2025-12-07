import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Box from "@mui/material/Box";

gsap.registerPlugin(ScrollTrigger);

interface AnimatedBackgroundProps {
  /**
   * Variant style for the background
   * - 'default': Standard floating geometric shapes with scroll parallax
   * - 'subtle': Less prominent, more subtle animation for content-heavy pages
   * - 'dense': More shapes and particles for visual impact
   */
  variant?: "default" | "subtle" | "dense";
  /**
   * Whether to enable scroll-based parallax effect
   */
  enableParallax?: boolean;
  /**
   * Custom z-index for the background
   */
  zIndex?: number;
}

export default function AnimatedBackground({
  variant = "default",
  enableParallax = true,
  zIndex = 0,
}: AnimatedBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Configuration based on variant
  const config = {
    default: {
      shapeCount: 12,
      particleCount: 15,
      opacityRange: [0.05, 0.15],
      scaleRange: [0.5, 1.5],
    },
    subtle: {
      shapeCount: 8,
      particleCount: 10,
      opacityRange: [0.03, 0.1],
      scaleRange: [0.4, 1.2],
    },
    dense: {
      shapeCount: 16,
      particleCount: 25,
      opacityRange: [0.08, 0.2],
      scaleRange: [0.6, 1.8],
    },
  }[variant];

  useEffect(() => {
    if (!containerRef.current) return;

    // Kill any existing ScrollTrigger instances for this container
    ScrollTrigger.getAll().forEach((trigger) => {
      if (trigger.vars.trigger === document.body) {
        // Refresh instead of killing to maintain proper state
      }
    });

    const ctx = gsap.context(() => {
      const shapes = containerRef.current?.querySelectorAll(".bg-shape");
      const particles = containerRef.current?.querySelectorAll(".bg-particle");

      // Initial random positions for shapes
      shapes?.forEach((shape) => {
        gsap.set(shape, {
          left: `random(0, 100)%`,
          top: `random(0, 100)%`,
          x: 0,
          y: 0,
          rotation: "random(0, 360)",
          opacity: `random(${config.opacityRange[0]}, ${config.opacityRange[1]})`,
          scale: `random(${config.scaleRange[0]}, ${config.scaleRange[1]})`,
        });
      });

      // Parallax Scroll Animation
      if (enableParallax && shapes) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: document.body,
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
          },
        });

        shapes.forEach((shape, i) => {
          const speed = (i + 1) * 50;
          const rotationSpeed = (i % 2 === 0 ? 1 : -1) * 180;

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
      }

      // Continuous Floating Animation for shapes
      shapes?.forEach((shape, i) => {
        gsap.to(shape, {
          x: `random(-50, 50)`,
          y: `random(-50, 50)`,
          duration: "random(3, 6)",
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });

        // Pulsing effect
        gsap.to(shape, {
          scale: `random(${config.scaleRange[0]}, ${config.scaleRange[1]})`,
          opacity: `random(${config.opacityRange[0]}, ${config.opacityRange[1]})`,
          duration: "random(4, 8)",
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
          delay: i * 0.15,
        });
      });

      // Animate particles with rising motion
      particles?.forEach((particle, i) => {
        gsap.fromTo(
          particle,
          {
            y: "100vh",
            x: "random(-50, 50)",
            opacity: 0,
          },
          {
            y: "-20vh",
            x: "random(-100, 100)",
            opacity: "random(0.2, 0.5)",
            duration: "random(15, 25)",
            repeat: -1,
            ease: "none",
            delay: i * 0.4,
          }
        );

        // Horizontal drift
        gsap.to(particle, {
          x: `+=${Math.random() * 200 - 100}`,
          duration: "random(5, 10)",
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });
    }, containerRef);

    // Refresh ScrollTrigger after animations are set up to ensure proper scroll behavior
    // Use a small delay to allow DOM to settle after navigation
    const refreshTimeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => {
      clearTimeout(refreshTimeout);
      ctx.revert();
    };
  }, [variant, enableParallax, config]);

  // Generate shapes array
  const shapes = Array.from({ length: config.shapeCount }, (_, i) => ({
    id: i,
    size: i % 3 === 0 ? 150 : i % 3 === 1 ? 100 : 60,
    isCircle: i % 2 === 0,
    color: i % 2 === 0 ? "#B08030" : "#D9A756",
    hasFill: i % 4 === 0,
  }));

  // Generate particles array
  const particles = Array.from({ length: config.particleCount }, (_, i) => ({
    id: i,
    size: Math.random() * 8 + 4,
    left: `${Math.random() * 100}%`,
    color: i % 2 === 0 ? "#B08030" : "#D9A756",
  }));

  return (
    <Box
      ref={containerRef}
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {/* Geometric Shapes */}
      {shapes.map((shape) => (
        <Box
          key={`shape-${shape.id}`}
          className="bg-shape"
          sx={{
            position: "absolute",
            width: shape.size,
            height: shape.size,
            borderRadius: shape.isCircle ? "50%" : "15%",
            border: `2px solid ${shape.color}`,
            background: shape.hasFill ? `${shape.color}15` : "transparent",
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
            background: particle.color,
            left: particle.left,
            opacity: 0,
            boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
          }}
        />
      ))}
    </Box>
  );
}
