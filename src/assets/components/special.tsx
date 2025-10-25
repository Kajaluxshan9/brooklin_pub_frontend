"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Nav from "../components/nav";

const cards = [
  {
    title: "Appetizers",
    desc: "Start your meal with crispy seafood bites.",
    bg: "https://i.pinimg.com/736x/42/2c/2e/422c2e649799697f1d1355ba8f308edd.jpg",
    popupImg: "https://images.template.net/278326/Restaurant-Menu-Template-edit-online.png",
  },
  {
    title: "Soups & Salad",
    desc: "Fresh and warm flavors for every taste.",
    bg: "/images/soups-bg.jpg",
    popupImg: "/images/soups-menu.png",
  },
  {
    title: "Desserts",
    desc: "Sweet endings with our finest treats.",
    bg: "/images/desserts-bg.jpg",
    popupImg: "/images/desserts-menu.png",
  },
  {
    title: "Drinks",
    desc: "Refreshing beverages to complement your meal.",
    bg: "/images/drinks-bg.jpg",
    popupImg: "/images/drinks-menu.png",
  },
  {
    title: "Chef Specials",
    desc: "Exclusive dishes crafted with passion.",
    bg: "/images/chef-special-bg.jpg",
    popupImg: "/images/chef-special-menu.png",
  },
  {
    title: "Family Combos",
    desc: "Perfect meals for sharing.",
    bg: "/images/family-bg.jpg",
    popupImg: "/images/family-menu.png",
  },
  {
    title: "Vegetarian",
    desc: "Healthy and hearty options for all.",
    bg: "/images/veg-bg.jpg",
    popupImg: "/images/veg-menu.png",
  },
  {
    title: "Seafood",
    desc: "Ocean-fresh specialties you’ll love.",
    bg: "/images/seafood-bg.jpg",
    popupImg: "/images/seafood-menu.png",
  },
  {
    title: "Kids Menu",
    desc: "Tasty meals for little foodies.",
    bg: "/images/kids-bg.jpg",
    popupImg: "/images/kids-menu.png",
  },
  {
    title: "Dessert Drinks",
    desc: "End your meal with a sweet sip.",
    bg: "/images/dessert-drinks-bg.jpg",
    popupImg: "/images/dessert-drinks-menu.png",
  },
];

export default function CylinderMenuPopup() {
  const [angle, setAngle] = useState(0);
  const [selectedCard, setSelectedCard] = useState(null);
  const [isInteracting, setIsInteracting] = useState(false);
  const [lastX, setLastX] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);

  const containerRef = useRef(null);
  const cardWidth = 300;
  const cardHeight = 300;
  const radius = 480;
  const total = cards.length;
  const anglePerCard = 360 / total;

  // Detect mobile / tablet
  useEffect(() => {
    const checkMobile = () =>
      /Android|iPhone|iPad|iPod|Tablet|Mobile/i.test(navigator.userAgent);
    setIsMobile(checkMobile());
  }, []);

  // Auto rotate
  useEffect(() => {
    if (!autoRotate) return;
    const interval = setInterval(() => {
      setAngle((prev) => (prev + 0.4) % 360);
    }, 30);
    return () => clearInterval(interval);
  }, [autoRotate]);

  // Mouse & Touch Controls
  const handleMouseMove = (e) => {
    if (!isMobile && isInteracting && lastX !== null) {
      const deltaX = e.clientX - lastX;
      setAngle((prev) => (prev + deltaX * 0.3) % 360);
    }
    setLastX(e.clientX);
  };
  const handleMouseDown = (e) => {
    if (!isMobile && containerRef.current?.contains(e.target)) {
      setIsInteracting(true);
      setAutoRotate(false);
      setLastX(e.clientX);
    }
  };
  const handleMouseUp = () => {
    if (!isMobile) {
      setIsInteracting(false);
      setLastX(null);
    }
  };
  const handleTouchStart = (e) => {
    if (isMobile && e.touches.length === 1) {
      setIsInteracting(true);
      setAutoRotate(false);
      setLastX(e.touches[0].clientX);
    }
  };
  const handleTouchMove = (e) => {
    if (isMobile && isInteracting && lastX !== null && e.touches.length === 1) {
      const touchX = e.touches[0].clientX;
      const deltaX = touchX - lastX;
      setAngle((prev) => (prev + deltaX * 0.3) % 360);
      setLastX(touchX);
    }
  };
  const handleTouchEnd = () => {
    if (isMobile) {
      setIsInteracting(false);
      setLastX(null);
    }
  };

  // Resume auto-scroll on outside click
  useEffect(() => {
    const handleOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setAutoRotate(true);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("touchstart", handleOutside);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("touchstart", handleOutside);
    };
  }, []);

  return (
    <div>
      {!selectedCard && <Nav />}

      <div
        style={{
          width: "100vw",
          height: "100vh",
          // background:
          //   "radial-gradient(circle at center, #ffffff 0%, #f2f2f2 60%, #e6e6e6 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          perspective: "1200px",
          overflow: "hidden",
          position: "relative",
          touchAction: "none",
          userSelect: "none",
        background: "#DAA520",


        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Cylinder */}
        <motion.div
          ref={containerRef}
          style={{
            rotateY: angle,
            transformStyle: "preserve-3d",
            width: `${cardWidth}px`,
            height: `${cardHeight}px`,
            position: "relative",
            transition: "rotateY 0.1s linear",
            marginTop:"60px"
          }}
        >
          {cards.map((card, i) => {
            const rotateY = (anglePerCard * i) % 360;
            return (
              <motion.div
                key={i}
                onClick={() => setSelectedCard(card)}
                whileHover={!isMobile ? { filter: "brightness(1.1)" } : {}}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  borderRadius: "18px",
                  backgroundImage: `url(${card.bg})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  color: "#fff",
                  padding: "1rem",
                  textShadow: "0 2px 8px rgba(0,0,0,0.7)",
                  transform: `rotateY(${rotateY}deg) translateZ(${radius}px)`,
                  cursor: "pointer",
                }}
              >
                <h2
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: "700",
                    marginBottom: "0.2rem",
                  }}
                >
                  {card.title}
                </h2>
                <p style={{ fontSize: "0.9rem", opacity: 0.9 }}>{card.desc}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Popup */}
        <AnimatePresence>
          {selectedCard && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                background: "rgba(0,0,0,0.85)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 99999,
              }}
              onClick={() => setSelectedCard(null)}
            >
              <motion.div
                onClick={(e) => e.stopPropagation()}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", stiffness: 120, damping: 15 }}
                style={{
                  position: "relative",
                  width: "100vw",
                  height: "100vh",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {/* Close Button */}
                <button
                  onClick={() => setSelectedCard(null)}
                  style={{
                    position: "absolute",
                    top: "20px",
                    right: "20px",
                    background: "rgba(255,255,255,0.2)",
                    border: "2px solid #fff",
                    borderRadius: "50%",
                    width: "40px",
                    height: "40px",
                    fontSize: "24px",
                    color: "#fff",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "0.2s",
                    zIndex: 100000,
                  }}
                >
                  ×
                </button>

                <img
                  src={selectedCard.popupImg}
                  alt={selectedCard.title}
                  style={{
                    width: "100vw",
                    height: "100vh",
                    objectFit: "contain",
                    borderRadius: "12px",
                    boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
                  }}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
