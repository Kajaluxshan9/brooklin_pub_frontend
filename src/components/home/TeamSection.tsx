import { Box, Typography, Container } from "@mui/material";
import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MenuBackground from "../menu/MenuBackground";

// Import team images
import Team2 from "../../assets/images/team/team-2.png";
import Team3 from "../../assets/images/team/team-3.png";
import Team4 from "../../assets/images/team/team-4.png";
import Team5 from "../../assets/images/team/team-5.png";

gsap.registerPlugin(ScrollTrigger);

interface TeamMember {
    id: number;
    image: string;
    name: string;
    role: string;
    specialty: string;
    position: { x: number; y: number; rotation: number };
}

const teamMembers: TeamMember[] = [
    {
        id: 2,
        image: Team3,
        name: "Premium Service",
        role: "Fine Dining Specialist",
        specialty: "Steak & Wine Pairing Expert",
        position: { x: 12, y: 5, rotation: 2 },
    },
    {
        id: 3,
        image: Team2,
        name: "Hospitality Expert",
        role: "Guest Experience",
        specialty: "Creating warm welcomes",
        position: { x: -8, y: -3, rotation: 1 },
    },
    {
        id: 4,
        image: Team4,
        name: "Service Excellence",
        role: "Customer Relations",
        specialty: "Ensuring perfect moments",
        position: { x: 10, y: 8, rotation: -2 },
    },
    {
        id: 5,
        image: Team5,
        name: "Culinary Artisan",
        role: "Food & Beverage",
        specialty: "Signature dishes & drinks",
        position: { x: -5, y: 2, rotation: 3 },
    },
];

const TeamSection = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const headingRef = useRef<HTMLDivElement>(null);
    const galleryRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
    const [hoveredMember, setHoveredMember] = useState<number | null>(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        if (isInView && headingRef.current) {
            gsap.fromTo(
                headingRef.current.querySelectorAll(".team-heading-animate"),
                { opacity: 0, y: 60 },
                { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: "power3.out" }
            );
        }
    }, [isInView]);

    useEffect(() => {
        if (isInView && galleryRef.current) {
            const images = galleryRef.current.querySelectorAll(".team-image");

            gsap.fromTo(
                images,
                { opacity: 0, scale: 0.8, y: 100 },
                {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    duration: 1.2,
                    stagger: 0.12,
                    ease: "power4.out",
                }
            );
        }
    }, [isInView]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!galleryRef.current) return;
        const rect = galleryRef.current.getBoundingClientRect();
        setMousePosition({
            x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
            y: ((e.clientY - rect.top) / rect.height - 0.5) * 2,
        });
    };

    return (
        <Box
            ref={sectionRef}
            sx={{
                position: "relative",
                py: { xs: 10, md: 16 },
                background: "linear-gradient(180deg, #FDF8F3 0%, #FAF7F2 50%, #FDF8F3 100%)",
                overflow: "hidden",
            }}
        >
            {/* MenuBackground - Advanced GSAP Animations */}
            <MenuBackground />

            <Container maxWidth="xl" sx={{ position: "relative", zIndex: 2 }}>
                {/* Section Header */}
                <Box
                    ref={headingRef}
                    sx={{
                        textAlign: "center",
                        mb: { xs: 8, md: 12 },
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 3,
                    }}
                >
                    <Box
                        className="team-heading-animate"
                        sx={{
                            width: 80,
                            height: 3,
                            background: "linear-gradient(90deg, transparent, #D9A756, transparent)",
                            position: "relative",
                            opacity: 0,
                            "&::before, &::after": {
                                content: '""',
                                position: "absolute",
                                width: "8px",
                                height: "8px",
                                borderRadius: "50%",
                                background: "#D9A756",
                                top: "50%",
                                transform: "translateY(-50%)",
                                boxShadow: "0 0 15px rgba(217,167,86,0.6)",
                            },
                            "&::before": { left: -4 },
                            "&::after": { right: -4 },
                        }}
                    />

                    <Typography
                        className="team-heading-animate"
                        sx={{
                            color: "#D9A756",
                            letterSpacing: "0.3em",
                            fontSize: { xs: "0.7rem", sm: "0.8rem" },
                            fontFamily: '"Inter", sans-serif',
                            fontWeight: 700,
                            textTransform: "uppercase",
                            opacity: 0,
                        }}
                    >
                        ◆ The Heart of Brooklin Pub ◆
                    </Typography>

                    <Typography
                        className="team-heading-animate"
                        variant="h2"
                        sx={{
                            fontSize: { xs: "2rem", sm: "2.5rem", md: "3.5rem" },
                            color: "#3C1F0E",
                            fontFamily: '"Cormorant Garamond", Georgia, serif',
                            fontWeight: 700,
                            letterSpacing: "-0.02em",
                            lineHeight: 1.2,
                            opacity: 0,
                        }}
                    >
                        Meet Our{" "}
                        <Box
                            component="span"
                            sx={{
                                background: "linear-gradient(135deg, #D9A756 0%, #B08030 100%)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                backgroundClip: "text",
                            }}
                        >
                            Dedicated Team
                        </Box>
                    </Typography>

                    <Typography
                        className="team-heading-animate"
                        sx={{
                            maxWidth: "700px",
                            fontSize: { xs: "1rem", md: "1.1rem" },
                            color: "rgba(60,31,14,0.8)",
                            fontFamily: '"Inter", sans-serif',
                            lineHeight: 1.8,
                            opacity: 0,
                        }}
                    >
                        The passionate people behind every exceptional meal, warm welcome,
                        and unforgettable moment at Brooklin Pub.
                    </Typography>

                    <Box
                        className="team-heading-animate"
                        sx={{
                            width: { xs: 100, md: 150 },
                            height: 1,
                            background: "linear-gradient(90deg, transparent, rgba(217,167,86,0.5), transparent)",
                            opacity: 0,
                        }}
                    />
                </Box>

                {/* Cinematic Diagonal Gallery */}
                <Box
                    ref={galleryRef}
                    onMouseMove={handleMouseMove}
                    sx={{
                        position: "relative",
                        minHeight: { xs: "2000px", sm: "1800px", md: "1400px" },
                        display: { xs: "flex", md: "block" },
                        flexDirection: { xs: "column", md: "unset" },
                        gap: { xs: 4, md: 0 },
                    }}
                >
                    {teamMembers.map((member, index) => {
                        const isEven = index % 2 === 0;
                        const isMobile = typeof window !== 'undefined' && window.innerWidth < 900;

                        return (
                            <Box
                                key={member.id}
                                className="team-image"
                                component={motion.div}
                                onHoverStart={() => setHoveredMember(member.id)}
                                onHoverEnd={() => setHoveredMember(null)}
                                whileHover={{ scale: 1.05, zIndex: 10 }}
                                animate={
                                    hoveredMember === member.id
                                        ? {
                                            x: mousePosition.x * 15,
                                            y: mousePosition.y * 15,
                                        }
                                        : {}
                                }
                                transition={{ type: "spring", stiffness: 150, damping: 15 }}
                                sx={{
                                    position: { xs: "relative", md: "absolute" },
                                    width: { xs: "100%", sm: "80%", md: "380px", lg: "420px" },
                                    height: { xs: "450px", md: "500px", lg: "550px" },
                                    top: isMobile ? "auto" : `${index * 220}px`,
                                    left: isMobile ? "auto" : isEven ? "5%" : "auto",
                                    right: isMobile ? "auto" : isEven ? "auto" : "5%",
                                    mx: { xs: "auto", md: 0 },
                                    opacity: 0,
                                    cursor: "pointer",
                                }}
                            >
                                {/* Main Image Container */}
                                <Box
                                    sx={{
                                        position: "relative",
                                        width: "100%",
                                        height: "100%",
                                        transform: `rotate(${member.position.rotation}deg)`,
                                        transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                                        "&:hover": {
                                            transform: "rotate(0deg)",
                                        },
                                    }}
                                >
                                    {/* Image with clip-path */}
                                    <Box
                                        component="img"
                                        src={member.image}
                                        alt={member.name}
                                        sx={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                            clipPath: isEven
                                                ? "polygon(0 0, 100% 5%, 100% 100%, 0 95%)"
                                                : "polygon(0 5%, 100% 0, 100% 95%, 0 100%)",
                                            boxShadow:
                                                hoveredMember === member.id
                                                    ? "0 40px 80px rgba(106,58,30,0.35), 0 0 0 3px rgba(217,167,86,0.6)"
                                                    : "0 20px 50px rgba(106,58,30,0.2), 0 0 0 1px rgba(217,167,86,0.3)",
                                            transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                                            filter: hoveredMember === member.id ? "brightness(1.1)" : "brightness(1)",
                                        }}
                                    />

                                    {/* Decorative Corner Accent */}
                                    <Box
                                        sx={{
                                            position: "absolute",
                                            top: isEven ? 20 : 30,
                                            right: isEven ? 30 : 20,
                                            width: 60,
                                            height: 60,
                                            border: "3px solid #D9A756",
                                            borderRadius: "50%",
                                            opacity: hoveredMember === member.id ? 1 : 0,
                                            transform: hoveredMember === member.id ? "scale(1)" : "scale(0.5)",
                                            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                                            "&::before": {
                                                content: '""',
                                                position: "absolute",
                                                inset: -10,
                                                border: "2px solid rgba(217,167,86,0.4)",
                                                borderRadius: "50%",
                                            },
                                        }}
                                    />

                                    {/* Gradient Overlay */}
                                    <Box
                                        sx={{
                                            position: "absolute",
                                            inset: 0,
                                            background: isEven
                                                ? "linear-gradient(135deg, rgba(217,167,86,0.15) 0%, transparent 50%)"
                                                : "linear-gradient(225deg, rgba(176,128,48,0.15) 0%, transparent 50%)",
                                            clipPath: isEven
                                                ? "polygon(0 0, 100% 5%, 100% 100%, 0 95%)"
                                                : "polygon(0 5%, 100% 0, 100% 95%, 0 100%)",
                                            opacity: hoveredMember === member.id ? 0.8 : 0.3,
                                            transition: "opacity 0.4s ease",
                                        }}
                                    />
                                </Box>

                                {/* Info Panel - Always visible */}
                                <Box
                                    component={motion.div}
                                    initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                                    animate={{
                                        opacity: 1,
                                        x: 0,
                                    }}
                                    transition={{ duration: 0.4, ease: "easeOut" }}
                                    sx={{
                                        position: "absolute",
                                        bottom: { xs: -80, md: -60 },
                                        left: isEven ? { xs: 0, md: "100%" } : { xs: 0, md: "auto" },
                                        right: isEven ? { xs: 0, md: "auto" } : { xs: 0, md: "100%" },
                                        ml: isEven ? { xs: 0, md: 3 } : 0,
                                        mr: isEven ? 0 : { xs: 0, md: 3 },
                                        width: { xs: "100%", md: "300px" },
                                        p: 3,
                                        background: "linear-gradient(135deg, rgba(255,253,251,0.98) 0%, rgba(250,247,242,0.95) 100%)",
                                        backdropFilter: "blur(20px)",
                                        borderRadius: "16px",
                                        boxShadow: "0 20px 50px rgba(106,58,30,0.25), 0 0 0 1px rgba(217,167,86,0.2)",
                                        pointerEvents: "none",
                                    }}
                                >
                                    {/* Role Badge */}
                                    <Box
                                        sx={{
                                            display: "inline-block",
                                            px: 2.5,
                                            py: 0.75,
                                            mb: 2,
                                            background: "linear-gradient(135deg, #D9A756 0%, #B08030 100%)",
                                            borderRadius: "20px",
                                            boxShadow: "0 4px 15px rgba(217,167,86,0.4)",
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                fontSize: "0.7rem",
                                                fontFamily: '"Inter", sans-serif',
                                                fontWeight: 700,
                                                letterSpacing: "0.15em",
                                                textTransform: "uppercase",
                                                color: "#FFFDFB",
                                            }}
                                        >
                                            {member.role}
                                        </Typography>
                                    </Box>

                                    {/* Name */}
                                    <Typography
                                        sx={{
                                            fontSize: "1.4rem",
                                            fontFamily: '"Cormorant Garamond", Georgia, serif',
                                            fontWeight: 700,
                                            color: "#3C1F0E",
                                            mb: 1,
                                            lineHeight: 1.3,
                                        }}
                                    >
                                        {member.name}
                                    </Typography>

                                    {/* Specialty */}
                                    <Typography
                                        sx={{
                                            fontSize: "0.9rem",
                                            fontFamily: '"Inter", sans-serif',
                                            color: "rgba(60,31,14,0.7)",
                                            lineHeight: 1.6,
                                        }}
                                    >
                                        {member.specialty}
                                    </Typography>

                                    {/* Decorative accent line */}
                                    <Box
                                        sx={{
                                            mt: 2,
                                            width: "80px",
                                            height: "3px",
                                            background: "linear-gradient(90deg, #D9A756, transparent)",
                                        }}
                                    />
                                </Box>
                            </Box>
                        );
                    })}
                </Box>

                {/* Bottom decorative element */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 2,
                        mt: { xs: 8, md: 12 },
                    }}
                >
                    <Box sx={{ width: 40, height: 1, background: "rgba(217,167,86,0.3)" }} />
                    <Typography
                        sx={{
                            color: "rgba(217,167,86,0.7)",
                            fontSize: "0.75rem",
                            fontFamily: '"Inter", sans-serif',
                            fontWeight: 600,
                            letterSpacing: "0.2em",
                            textTransform: "uppercase",
                        }}
                    >
                        Serving with Pride Since 2014
                    </Typography>
                    <Box sx={{ width: 40, height: 1, background: "rgba(217,167,86,0.3)" }} />
                </Box>
            </Container>
        </Box>
    );
};

export default TeamSection;
