import { useEffect, useRef } from "react";
import gsap from "gsap";
import Box from "@mui/material/Box";

export default function PopupBackground() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const ctx = gsap.context(() => {
            const shapes = containerRef.current?.querySelectorAll(".bg-shape");
            const particles = containerRef.current?.querySelectorAll(".bg-particle");

            // Animate geometric shapes
            if (shapes) {
                shapes.forEach((shape, i) => {
                    // Floating movement
                    gsap.to(shape, {
                        x: "random(-100, 100)",
                        y: "random(-100, 100)",
                        rotation: "random(-180, 180)",
                        duration: "random(8, 15)",
                        repeat: -1,
                        yoyo: true,
                        ease: "sine.inOut",
                    });

                    // Pulsing scale and opacity
                    gsap.to(shape, {
                        scale: "random(0.8, 1.2)",
                        opacity: "random(0.15, 0.35)",
                        duration: "random(4, 8)",
                        repeat: -1,
                        yoyo: true,
                        ease: "power1.inOut",
                        delay: i * 0.2,
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
                            x: "random(-50, 50)",
                            opacity: 0,
                        },
                        {
                            y: "-20vh",
                            x: "random(-100, 100)",
                            opacity: "random(0.3, 0.7)",
                            duration: "random(15, 25)",
                            repeat: -1,
                            ease: "none",
                            delay: i * 0.5,
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
            }
        }, containerRef);

        return () => ctx.revert();
    }, []);

    // Geometric shapes with varied styles
    const shapes = [
        { size: 200, top: "10%", left: "5%", rotation: 45, type: "square", color: "#B08030" },
        { size: 150, top: "70%", left: "85%", rotation: 0, type: "circle", color: "#D9A756" },
        { size: 180, top: "30%", left: "75%", rotation: 30, type: "square", color: "#8a5a2a" },
        { size: 120, top: "85%", left: "15%", rotation: 60, type: "circle", color: "#B08030" },
        { size: 160, top: "50%", left: "90%", rotation: 15, type: "square", color: "#D9A756" },
        { size: 140, top: "15%", left: "50%", rotation: 75, type: "circle", color: "#8a5a2a" },
    ];

    // Floating particles
    const particles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        size: Math.random() * 8 + 4,
        left: `${Math.random() * 100}%`,
    }));

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
                        borderRadius: shape.type === "circle" ? "50%" : "20%",
                        border: `3px solid ${shape.color}`,
                        background: `${shape.color}15`,
                        transform: `rotate(${shape.rotation}deg)`,
                        opacity: 0.25,
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
                        background: particle.id % 2 === 0 ? "#B08030" : "#D9A756",
                        left: particle.left,
                        opacity: 0,
                        boxShadow: `0 0 ${particle.size * 2}px ${particle.id % 2 === 0 ? "#B08030" : "#D9A756"}`,
                    }}
                />
            ))}
        </Box>
    );
}
