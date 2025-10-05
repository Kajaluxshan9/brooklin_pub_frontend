"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import Lottie from "lottie-react";
import confettiJson from "../Animation/Confetti - Animation 01.json";

export default function Special() {
  const [showConfetti, setShowConfetti] = useState(true);

  // Hide confetti after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={outerContainer}>
      {/* 🎉 Confetti Animation */}
      {showConfetti && (
        <div style={lottieContainer}>
          <Lottie
            animationData={confettiJson}
            loop={false}
            autoplay
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      )}

      {/* 🏷️ Full-width heading */}
      <div style={headerContainer}>
        <h2 style={title}>Our Special Menu</h2>
      </div>

      {/* 🍽️ Centered Cards */}
      <div style={centerContainer}>
        <div style={cardWrapper}>
          {menuItems.map(([name, image], i) => (
            <Card i={i} name={name} image={image} key={name} />
          ))}
        </div>
      </div>
    </div>
  );
}

interface CardProps {
  name: string;
  image: string;
  i: number;
}

function Card({ name, image, i }: CardProps) {
  return (
    <motion.div
      className={`card-container-${i}`}
      style={cardContainer}
      initial="offscreen"
      whileInView="onscreen"
      viewport={{ amount: 0.8 }}
    >
      <motion.div style={{ ...splash, background: "#8B4513" }} />
      <motion.div style={card} variants={cardVariants}>
        <img src={image} alt={name} style={imageStyle} />
        <h3 style={foodName}>{name}</h3>
      </motion.div>
    </motion.div>
  );
}

/* ================= Motion Variants ================= */
const cardVariants: Variants = {
  offscreen: {
    y: 200,
    opacity: 0,
  },
  onscreen: {
    y: 0,
    rotate: -5,
    opacity: 1,
    transition: {
      type: "spring",
      bounce: 0.4,
      duration: 0.8,
    },
  },
};

/* ================= Styles ================= */

const outerContainer: React.CSSProperties = {
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "flex-start",
  background: "#fafafa",
  textAlign: "center",
  overflowX: "hidden",
  width: "100vw",
  position: "relative",
};

const headerContainer: React.CSSProperties = {
  width: "100%",
  background: "#222",
  color: "#fff",
  padding: "40px 0",
  marginBottom: 40,
  textAlign: "center",
  height: "500px",
};

const title: React.CSSProperties = {
  fontSize: "2.8rem",
  fontWeight: 700,
  letterSpacing: "1px",
  margin: 200,
};

const centerContainer: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  flexGrow: 1,
};

const cardWrapper: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: 100,
  width: "100%",
  maxWidth: 600,
};

const cardContainer: React.CSSProperties = {
  overflow: "hidden",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  position: "relative",
  paddingTop: 20,
  width: "100%",
  height: 500,
};

const splash: React.CSSProperties = {
  position: "absolute",
  top: "50%",
  left: "50%",
  width: 500,
  height: 450,
  transform: "translate(-50%, -50%)",
  clipPath: `path("M 0 303.5 C 0 292.454 8.995 285.101 20 283.5 L 460 219.5 C 470.085 218.033 480 228.454 480 239.5 L 500 430 C 500 441.046 491.046 450 480 450 L 20 450 C 8.954 450 0 441.046 0 430 Z")`,
  zIndex: 1,
  background: "#8B4513",
};

const card: React.CSSProperties = {
  width: 320,
  height: 440,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: 20,
  background: "#fff",
  boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  transformOrigin: "10% 60%",
  zIndex: 2,
};

const imageStyle: React.CSSProperties = {
  width: 160,
  height: 160,
  objectFit: "cover",
  borderRadius: "50%",
  marginBottom: 20,
  boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
};

const foodName: React.CSSProperties = {
  fontSize: "1.5rem",
  fontWeight: 600,
  color: "#333",
};

const lottieContainer: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  pointerEvents: "none",
  zIndex: 999,
  overflow: "hidden",
};

/* ================= Menu Data ================= */

const menuItems: [string, string][] = [
  ["Margherita Pizza", "/images/pizza.jpg"],
  ["Pasta Alfredo", "/images/pasta.jpg"],
  ["Grilled Salmon", "/images/salmon.jpg"],
  ["Cheeseburger", "/images/burger.jpg"],
  ["Chocolate Lava Cake", "/images/dessert.jpg"],
];
