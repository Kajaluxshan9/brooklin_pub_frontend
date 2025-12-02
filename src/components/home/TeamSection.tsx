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
}

const teamMembers: TeamMember[] = [
  {
    id: 1,
    image: Team3,
    name: "Premium Service",
    role: "Fine Dining Specialist",
    specialty: "Steak & Wine Pairing Expert",
  },
  {
    id: 2,
    image: Team2,
    name: "Hospitality Expert",
    role: "Guest Experience",
    specialty: "Creating warm welcomes",
  },
  {
    id: 3,
    image: Team4,
    name: "Service Excellence",
    role: "Customer Relations",
    specialty: "Ensuring perfect moments",
  },
  {
    id: 4,
    image: Team5,
    name: "Culinary Artisan",
    role: "Food & Beverage",
    specialty: "Signature dishes & drinks",
  },
];

const TeamSection = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const headingRef = useRef<HTMLDivElement>(null);
    const galleryRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
    const [hoveredMember, setHoveredMember] = useState<number | null>(null);

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
        const rows = galleryRef.current.querySelectorAll(".team-row");

        rows.forEach((row, index) => {
          const isEven = index % 2 === 0;
          gsap.fromTo(
            row,
            {
              opacity: 0,
              x: isEven ? -100 : 100,
              y: 50,
            },
            {
              opacity: 1,
              x: 0,
              y: 0,
              duration: 1.2,
              delay: index * 0.2,
              ease: "power4.out",
              scrollTrigger: {
                trigger: row,
                start: "top 85%",
                toggleActions: "play none none none",
              },
            }
          );
        });
      }
    }, [isInView]);

    return (
      <Box
        ref={sectionRef}
        sx={{
          position: "relative",
          py: { xs: 10, md: 16 },
          background:
            "linear-gradient(180deg, #FDF8F3 0%, #FAF7F2 50%, #FDF8F3 100%)",
          overflow: "hidden",
        }}
      >
        {/* MenuBackground - Advanced GSAP Animations */}
        <MenuBackground />

        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
          {/* Section Header */}
          <Box
            ref={headingRef}
            sx={{
              textAlign: "center",
              mb: { xs: 8, md: 10 },
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
                background:
                  "linear-gradient(90deg, transparent, #D9A756, transparent)",
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
                letterSpacing: "0.35em",
                fontSize: { xs: "0.7rem", sm: "0.8rem" },
                fontFamily: '"Inter", sans-serif',
                fontWeight: 600,
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
                letterSpacing: "-0.025em",
                lineHeight: 1.15,
                opacity: 0,
              }}
            >
              Meet Our{" "}
              <Box
                component="span"
                sx={{
                  background:
                    "linear-gradient(135deg, #D9A756 0%, #B08030 100%)",
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
                lineHeight: 1.85,
                letterSpacing: "0.01em",
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
                background:
                  "linear-gradient(90deg, transparent, rgba(217,167,86,0.5), transparent)",
                opacity: 0,
              }}
            />
          </Box>

          {/* Zigzag Team Gallery */}
          <Box
            ref={galleryRef}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: { xs: 8, md: 10 },
            }}
          >
            {teamMembers.map((member, index) => {
              const isEven = index % 2 === 0;

              return (
                <Box
                  key={member.id}
                  className="team-row"
                  component={motion.div}
                  onHoverStart={() => setHoveredMember(member.id)}
                  onHoverEnd={() => setHoveredMember(null)}
                  sx={{
                    display: "flex",
                    flexDirection: {
                      xs: "column",
                      md: isEven ? "row" : "row-reverse",
                    },
                    alignItems: "center",
                    gap: { xs: 4, md: 6, lg: 8 },
                    opacity: 0,
                  }}
                >
                  {/* Image Section */}
                  <Box
                    component={motion.div}
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    sx={{
                      position: "relative",
                      width: { xs: "100%", md: "50%" },
                      maxWidth: { xs: "400px", md: "none" },
                      mx: { xs: "auto", md: 0 },
                    }}
                  >
                    {/* Decorative Frame */}
                    <Box
                      sx={{
                        position: "absolute",
                        top: { xs: -12, md: -16 },
                        left: isEven ? { xs: -12, md: -16 } : "auto",
                        right: isEven ? "auto" : { xs: -12, md: -16 },
                        width: { xs: "70%", md: "80%" },
                        height: { xs: "70%", md: "80%" },
                        border: "2px solid",
                        borderColor:
                          hoveredMember === member.id
                            ? "rgba(217,167,86,0.6)"
                            : "rgba(217,167,86,0.3)",
                        transition: "all 0.5s ease",
                        zIndex: 0,
                      }}
                    />

                    {/* Main Image Container */}
                    <Box
                      sx={{
                        position: "relative",
                        aspectRatio: "4/5",
                        overflow: "hidden",
                        zIndex: 1,
                        "&::before": {
                          content: '""',
                          position: "absolute",
                          inset: 0,
                          background:
                            hoveredMember === member.id
                              ? "linear-gradient(180deg, transparent 50%, rgba(60,31,14,0.4) 100%)"
                              : "linear-gradient(180deg, transparent 60%, rgba(60,31,14,0.2) 100%)",
                          zIndex: 2,
                          transition: "all 0.5s ease",
                          pointerEvents: "none",
                        },
                      }}
                    >
                      <Box
                        component={motion.img}
                        src={member.image}
                        alt={member.name}
                        animate={{
                          scale: hoveredMember === member.id ? 1.05 : 1,
                        }}
                        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          // add top offset only in the initial (not-hovered) state
                          mt: hoveredMember === member.id ? "30px" : "30px",
                          filter:
                            hoveredMember === member.id
                              ? "brightness(1.05)"
                              : "brightness(1)",
                          transition: "filter 0.5s ease, margin-top 0.25s ease",
                        }}
                      />

                      {/* Gold Accent Corner - Decorative Only */}
                      <Box
                        sx={{
                          position: "absolute",
                          bottom: 0,
                          left: isEven ? 0 : "auto",
                          right: isEven ? "auto" : 0,
                          width: { xs: 50, md: 60 },
                          height: { xs: 50, md: 60 },
                          background:
                            "linear-gradient(135deg, #D9A756 0%, #B08030 100%)",
                          clipPath: isEven
                            ? "polygon(0 100%, 0 0, 100% 100%)"
                            : "polygon(100% 100%, 100% 0, 0 100%)",
                          zIndex: 3,
                          opacity: hoveredMember === member.id ? 1 : 0.8,
                          transition: "opacity 0.4s ease",
                        }}
                      />
                    </Box>

                    {/* Decorative Dot Pattern */}
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: { xs: -20, md: -30 },
                        left: isEven ? "auto" : { xs: -20, md: -30 },
                        right: isEven ? { xs: -20, md: -30 } : "auto",
                        display: "grid",
                        gridTemplateColumns: "repeat(3, 8px)",
                        gap: "8px",
                        opacity: hoveredMember === member.id ? 1 : 0.5,
                        transition: "opacity 0.4s ease",
                      }}
                    >
                      {[...Array(9)].map((_, i) => (
                        <Box
                          key={i}
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            background: "#D9A756",
                            opacity: ((i % 3) + i / 3) % 2 === 0 ? 1 : 0.4,
                          }}
                        />
                      ))}
                    </Box>
                  </Box>

                  {/* Content Section */}
                  <Box
                    sx={{
                      flex: 1,
                      width: { xs: "100%", md: "50%" },
                      textAlign: {
                        xs: "center",
                        md: isEven ? "left" : "right",
                      },
                      px: { xs: 2, md: 0 },
                    }}
                  >
                    {/* Decorative Line */}
                    <Box
                      component={motion.div}
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                      sx={{
                        width: { xs: 60, md: 80 },
                        height: 3,
                        background: "linear-gradient(90deg, #D9A756, #B08030)",
                        mb: 3,
                        mx: { xs: "auto", md: isEven ? 0 : "auto" },
                        mr: { md: isEven ? "auto" : 0 },
                        transformOrigin: isEven ? "left" : "right",
                      }}
                    />

                    {/* Role Badge */}
                    <Typography
                      component={motion.span}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                      sx={{
                        display: "inline-block",
                        px: 3,
                        py: 1,
                        mb: 2.5,
                        background: "rgba(217,167,86,0.15)",
                        borderRadius: "30px",
                        border: "1px solid rgba(217,167,86,0.3)",
                        color: "#D9A756",
                        fontSize: { xs: "0.7rem", md: "0.75rem" },
                        fontFamily: '"Inter", sans-serif',
                        fontWeight: 600,
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                      }}
                    >
                      {member.role}
                    </Typography>

                    {/* Name */}
                    <Typography
                      component={motion.h3}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.5 }}
                      sx={{
                        fontSize: { xs: "1.8rem", sm: "2.2rem", md: "2.5rem" },
                        fontFamily: '"Cormorant Garamond", Georgia, serif',
                        fontWeight: 700,
                        color: "#3C1F0E",
                        mb: 2,
                        lineHeight: 1.2,
                      }}
                    >
                      {member.name}
                    </Typography>

                    {/* Specialty */}
                    <Typography
                      component={motion.p}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.6 }}
                      sx={{
                        fontSize: { xs: "1rem", md: "1.1rem" },
                        fontFamily: '"Inter", sans-serif',
                        color: "rgba(60,31,14,0.7)",
                        lineHeight: 1.8,
                        maxWidth: { xs: "none", md: "400px" },
                        mx: { xs: "auto", md: isEven ? 0 : "auto" },
                        ml: { md: isEven ? 0 : "auto" },
                      }}
                    >
                      {member.specialty}
                    </Typography>

                    {/* Decorative Quote Mark */}
                    <Typography
                      component={motion.span}
                      initial={{ opacity: 0, scale: 0.5 }}
                      whileInView={{ opacity: 0.15, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.7 }}
                      sx={{
                        display: { xs: "none", md: "block" },
                        fontSize: "8rem",
                        fontFamily: '"Cormorant Garamond", Georgia, serif',
                        color: "#D9A756",
                        lineHeight: 0.5,
                        mt: 3,
                        userSelect: "none",
                      }}
                    >
                      ❝
                    </Typography>
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
              mt: { xs: 10, md: 14 },
            }}
          >
            <Box
              sx={{
                width: { xs: 30, md: 60 },
                height: 1,
                background:
                  "linear-gradient(90deg, transparent, rgba(217,167,86,0.5))",
              }}
            />
            <Box
              sx={{
                width: 12,
                height: 12,
                border: "2px solid #D9A756",
                transform: "rotate(45deg)",
                opacity: 0.6,
              }}
            />
            <Typography
              sx={{
                color: "rgba(217,167,86,0.8)",
                fontSize: { xs: "0.7rem", md: "0.8rem" },
                fontFamily: '"Inter", sans-serif',
                fontWeight: 600,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                px: 2,
              }}
            >
              Serving with Pride Since 2014
            </Typography>
            <Box
              sx={{
                width: 12,
                height: 12,
                border: "2px solid #D9A756",
                transform: "rotate(45deg)",
                opacity: 0.6,
              }}
            />
            <Box
              sx={{
                width: { xs: 30, md: 60 },
                height: 1,
                background:
                  "linear-gradient(90deg, rgba(217,167,86,0.5), transparent)",
              }}
            />
          </Box>
        </Container>
      </Box>
    );
};

export default TeamSection;
