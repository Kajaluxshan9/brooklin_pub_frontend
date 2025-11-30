import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Box from "@mui/material/Box";

gsap.registerPlugin(ScrollTrigger);

export default function MenuBackground() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const shapes = containerRef.current.querySelectorAll(".shape");

        // Initial random positions using percentages for full coverage
        shapes.forEach((shape) => {
            gsap.set(shape, {
                left: `random(0, 100)%`,
                top: `random(0, 100)%`,
                x: 0,
                y: 0,
                rotation: "random(0, 360)",
                opacity: "random(0.05, 0.15)",
                scale: "random(0.5, 1.5)",
            });
        });

        // Parallax Scroll Animation
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: document.body,
                start: "top top",
                end: "bottom bottom",
                scrub: 1, // Smooth scrubbing
            },
        });

        shapes.forEach((shape, i) => {
            const speed = (i + 1) * 50; // Different speeds for depth
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

        // Continuous Floating Animation (independent of scroll)
        shapes.forEach((shape) => {
            gsap.to(shape, {
                x: `random(-50, 50)`,
                y: `random(-50, 50)`,
                duration: "random(3, 6)",
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
            });
        });

        return () => {
            tl.kill();
            if (tl.scrollTrigger) {
                tl.scrollTrigger.kill();
            }
            gsap.killTweensOf(shapes);
        };
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
            {[...Array(12)].map((_, i) => (
                <Box
                    key={i}
                    className="shape"
                    sx={{
                        position: "absolute",
                        width: i % 3 === 0 ? 150 : i % 3 === 1 ? 100 : 50,
                        height: i % 3 === 0 ? 150 : i % 3 === 1 ? 100 : 50,
                        borderRadius: i % 2 === 0 ? "50%" : "10%", // Mix of circles and rounded squares
                        border: `2px solid ${i % 2 === 0 ? "#B08030" : "#D9A756"}`, // Gold/Bronze
                        background: i % 4 === 0 ? `${i % 2 === 0 ? "#B08030" : "#D9A756"}20` : "transparent", // Some filled, some outlined
                    }}
                />
            ))}
        </Box>
    );
}
