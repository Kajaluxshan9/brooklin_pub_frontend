import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { addSpecial } from "../../lib/specials";
import { createPortal } from "react-dom";
import { useApiWithCache } from "../../hooks/useApi";
import { specialsService } from "../../services/specials.service";
import { getImageUrl } from "../../services/api";
import PopupCloseButton from "../menu/PopupCloseButton";
import type { Special } from "../../types/api.types";

// Card type used locally
type Card = {
  title: string;
  desc: string;
  bg: string;
  popupImg: string;
  status?: string;
  type?: string;
};
// Transform backend Special entities to Card format
function transformSpecialsToCards(specials: Special[]): Card[] {
  return specials.map((special) => ({
    title: special.title,
    desc: special.description || "Delicious special of the day",
    bg:
      getImageUrl(special.imageUrls?.[0]) ||
      "https://i.pinimg.com/736x/42/2c/2e/422c2e649799697f1d1355ba8f308edd.jpg",
    popupImg:
      getImageUrl(special.imageUrls?.[1]) ||
      getImageUrl(special.imageUrls?.[0]) ||
      "https://images.template.net/278326/Restaurant-Menu-Template-edit-online.png",
    status: "new",
  }));
}
// Transform for chef specials (filters by type)
function transformChefSpecialsToCards(specials: Special[]): Card[] {
  return specials
    .filter((special) => special.type === "chef")
    .map((special) => ({
      title: special.title,
      desc: special.description || "Chef's handcrafted creation",
      bg:
        getImageUrl(special.imageUrls?.[0]) ||
        "https://i.pinimg.com/736x/42/2c/2e/422c2e649799697f1d1355ba8f308edd.jpg",
      popupImg:
        getImageUrl(special.imageUrls?.[1]) ||
        getImageUrl(special.imageUrls?.[0]) ||
        "https://images.template.net/278326/Restaurant-Menu-Template-edit-online.png",
      status: "new",
    }));
}
// Export for preloading - will be populated by the component
export let exportedDailySpecials: Card[] = [];
export let exportedChefSpecials: Card[] = [];
export default function CylinderMenuPopup() {
  const { type: routeType } = useParams<{ type?: string }>();
  const [angle, setAngle] = useState(0);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [isInteracting, setIsInteracting] = useState(false);
  const [lastX, setLastX] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  // Fetch specials from backend
  const { data: specialsData } = useApiWithCache<Special[]>(
    "active-specials",
    () => specialsService.getActiveSpecials()
  );
  // Fetch all specials to derive chef specials (kept separate to avoid breaking existing API behavior)
  const { data: allSpecialsData } = useApiWithCache<Special[]>(
    "chef-specials",
    () => specialsService.getAllSpecials()
  );
  // Transform backend data to cards format (no fallback - purely backend data)
  const dailyCards =
    specialsData && specialsData.length > 0
      ? transformSpecialsToCards(specialsData)
      : [];
  const chefCards =
    allSpecialsData && allSpecialsData.length > 0
      ? transformChefSpecialsToCards(allSpecialsData)
      : [];

  // Determine which cards to render based on the route param `/special/:type`.
  const getCardsForRouteType = (typeParam?: string): Card[] => {
    const t = typeParam ? String(typeParam).toLowerCase() : "";
    if (!t || t === "daily") return dailyCards;
    // Filter by type from API data
    const fromApi = (allSpecialsData || []).filter(
      (s) => String(s.type || "").toLowerCase() === t
    );
    if (fromApi.length > 0) return transformSpecialsToCards(fromApi);
    // Nothing matched — show daily by default
    return dailyCards;
  };
  const cards = getCardsForRouteType(routeType);
  // Update exported specials for preloading
  useEffect(() => {
    if (dailyCards && dailyCards.length > 0) exportedDailySpecials = dailyCards;
    if (chefCards && chefCards.length > 0) exportedChefSpecials = chefCards;
  }, [dailyCards, chefCards]);
  const containerRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef<number | null>(null);
  const startYRef = useRef<number | null>(null);
  const isScrollingRef = useRef<boolean>(false);
  const screenWidth = typeof window !== "undefined" ? window.innerWidth : 1200;
  // Derived value for card sizing
  const mobile = screenWidth < 768;
  const verticalGap = 60; // px - consistent gap above and below the cylinder container
  const cardWidth = mobile
    ? Math.max(120, Math.min(screenWidth * 0.6, 320)) // mobile
    : Math.max(180, Math.min(screenWidth * 0.3, 300)); // desktop
  const cardHeight = cardWidth * 1.05;
  const radius = cardWidth * 1.7;
  const total = cards.length;
  const isCylinder = total > 2;
  const isTwo = total === 2;
  const isSingle = total === 1;
  const anglePerCard = 360 / total;
  // Detect mobile / tablet
  useEffect(() => {
    const checkMobile = () =>
      /Android|iPhone|iPad|iPod|Tablet|Mobile/i.test(navigator.userAgent);
    setIsMobile(checkMobile());
  }, []);
  // Register daily specials and chef specials into shared specials list
  useEffect(() => {
    dailyCards.forEach((c: Card, idx: number) => {
      try {
        addSpecial({
          id: `special-${idx}`,
          title: c.title,
          desc: c.desc,
          bg: c.bg,
          popupImg: c.popupImg,
          status: "new",
          category: "daily",
        });
      } catch (err) {
        // swallow errors — this is just a simple registration
      }
    });
  }, [dailyCards]);
  useEffect(() => {
    chefCards.forEach((c: Card, idx: number) => {
      try {
        addSpecial({
          id: `chef-${idx}`,
          title: c.title,
          desc: c.desc,
          bg: c.bg,
          popupImg: c.popupImg,
          status: "new",
          category: "chef",
        });
      } catch (err) {
        // swallow errors — this is just a simple registration
      }
    });
  }, [chefCards]);
  // intro slideshow removed
  // Auto rotate
  useEffect(() => {
    if (!autoRotate || !isCylinder) return;
    const interval = setInterval(() => {
      setAngle((prev) => (prev + 0.2) % 360);
    }, 40);
    return () => clearInterval(interval);
  }, [autoRotate]);
  // if not a cylinder (1-2 cards) keep angle fixed at 0
  useEffect(() => {
    if (!isCylinder) setAngle(0);
  }, [isCylinder]);
  // Mouse & Touch Controls
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isCylinder) return;
    if (!isMobile && isInteracting && lastX !== null) {
      const deltaX = e.clientX - lastX;
      setAngle((prev) => (prev + deltaX * 0.3) % 360);
    }
    setLastX(e.clientX);
  };
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isCylinder) return;
    if (!isMobile && containerRef.current?.contains(e.target as Node)) {
      setIsInteracting(true);
      setAutoRotate(false);
      setLastX(e.clientX);
    }
  };
  const handleMouseUp = () => {
    if (!isCylinder) return;
    if (!isMobile) {
      setIsInteracting(false);
      setLastX(null);
    }
  };
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isCylinder) return;
    if (isMobile && e.touches.length === 1) {
      setIsInteracting(true);
      setAutoRotate(false);
      setLastX(e.touches[0].clientX);
      startXRef.current = e.touches[0].clientX;
      startYRef.current = e.touches[0].clientY;
      isScrollingRef.current = false;
    }
  };
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isCylinder) return;
    if (isMobile && isInteracting && lastX !== null && e.touches.length === 1) {
      const touchX = e.touches[0].clientX;
      const touchY = e.touches[0].clientY;

      // If we've already determined this is a scroll, ignore rotation
      if (isScrollingRef.current) return;

      // Check for vertical scroll intent
      if (startXRef.current !== null && startYRef.current !== null) {
        const deltaXTotal = Math.abs(touchX - startXRef.current);
        const deltaYTotal = Math.abs(touchY - startYRef.current);

        // If moved enough to determine direction and vertical movement dominates
        if (deltaYTotal > 5 && deltaYTotal > deltaXTotal) {
          isScrollingRef.current = true;
          return;
        }
      }

      const deltaX = touchX - lastX;
      setAngle((prev) => (prev + deltaX * 0.4) % 360);
      setLastX(touchX);
    }
  };
  const handleTouchEnd = () => {
    if (!isCylinder) return;
    if (isMobile) {
      setIsInteracting(false);
      setLastX(null);
    }
  };
  // Resume auto-scroll on outside click
  useEffect(() => {
    const handleOutside = (e: MouseEvent | TouchEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
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

  // Track if mouse is over the cylinder
  const [isHoveringCylinder, setIsHoveringCylinder] = useState(false);

  // Native wheel listener for non-passive scrolling
  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const handleWheel = (e: WheelEvent) => {
      if (!isCylinder) return;

      // Only prevent default scroll if hovering over the cylinder
      if (isHoveringCylinder) {
        e.preventDefault();

        // Stop auto-rotation when user interacts
        setAutoRotate(false);

        // Rotate based on scroll delta
        setAngle((prev) => (prev + e.deltaY * 0.2) % 360);
      }
      // If not hovering, allow normal page scroll
    };

    // Add listener with passive: false to allow preventDefault()
    element.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      element.removeEventListener("wheel", handleWheel);
    };
  }, [isCylinder, isHoveringCylinder]);

  return (
    <div>
      <div
        ref={containerRef}
        style={{
          width: "100vw",
          height: mobile
            ? `clamp(350px, calc(100vh - ${verticalGap * 2}px), 900px)`
            : `clamp(600px, calc(100vh - ${verticalGap * 2}px), 1200px)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          perspective: "1200px",
          overflow: "hidden",
          position: "relative",
          touchAction: "pan-y",
          userSelect: "none",
          background: "linear-gradient(180deg, #FDF8F3 0%, #F5EBE0 100%)",
          marginTop: `${verticalGap}px`,

        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* CSS Animated Geometric Shapes Background */}
        <style>
          {`
            @keyframes floatShape {
              0%, 100% {
                transform: translate(0, 0) rotate(0deg);
              }
              25% {
                transform: translate(30px, -30px) rotate(90deg);
              }
              50% {
                transform: translate(-20px, 20px) rotate(180deg);
              }
              75% {
                transform: translate(20px, 30px) rotate(270deg);
              }
            }

            .bg-shape {
              animation: floatShape 25s ease-in-out infinite;
              will-change: transform;
            }

            .bg-shape:nth-child(2n) {
              animation-duration: 30s;
              animation-delay: -5s;
            }

            .bg-shape:nth-child(3n) {
              animation-duration: 35s;
              animation-delay: -10s;
            }

            .bg-shape:nth-child(4n) {
              animation-duration: 28s;
              animation-delay: -15s;
            }
          `}
        </style>
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 1,
            pointerEvents: "none",
            overflow: "hidden",
          }}
        >
          {/* Abstract Geometric Shapes */}
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="bg-shape"
              style={{
                position: "absolute",
                width: i % 3 === 0 ? "150px" : i % 3 === 1 ? "100px" : "50px",
                height: i % 3 === 0 ? "150px" : i % 3 === 1 ? "100px" : "50px",
                borderRadius: i % 2 === 0 ? "50%" : "10%",
                border: `2px solid ${i % 2 === 0 ? "#B08030" : "#D9A756"}`,
                background:
                  i % 4 === 0
                    ? `${i % 2 === 0 ? "#B08030" : "#D9A756"}20`
                    : "transparent",
                left: `${(i * 23 + 10) % 90}%`,
                top: `${(i * 17 + 5) % 85}%`,
                opacity: 0.05 + (i % 3) * 0.03,
              }}
            />
          ))}
        </div>

        {/* Cylinder */}
        <motion.div
          onMouseEnter={() => setIsHoveringCylinder(true)}
          onMouseLeave={() => setIsHoveringCylinder(false)}
          style={{
            rotateY: isCylinder ? angle : 0,
            transformStyle: isCylinder ? "preserve-3d" : "flat",
            width: isCylinder
              ? `${cardWidth}px`
              : isTwo
                ? isMobile
                  ? "90%"
                  : `${cardWidth * 2 + 16}px`
                : "min(1100px, 92%)",
            height: isCylinder
              ? `${cardHeight}px`
              : isTwo
                ? isMobile
                  ? "auto"
                  : `${cardHeight}px`
                : "auto",
            position: "relative",
            transition: isCylinder ? "rotateY 0.1s linear" : "none",
            marginTop: 0,
            padding: isMobile ? "0 20px" : "0",
            display: isCylinder ? undefined : "flex",
            flexDirection: isTwo ? (isMobile ? "column" : "row") : "column",
            flexWrap: isTwo ? "wrap" : undefined,
            gap: isTwo ? "1rem" : undefined,
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
          }}
        >
          {/* Selection is now controlled by the Nav's /special/<type> route. */}
          {cards.map((card: Card, i: number) => {
            const rotateY = (anglePerCard * i) % 360;
            return (
              <motion.div
                key={i}
                onClick={() => setSelectedCard(card)}
                initial={{ filter: "brightness(1)" }}
                whileHover={!isMobile ? { filter: "brightness(1.1)" } : {}}
                style={(() => {
                  const base: React.CSSProperties = {
                    borderRadius: "18px",
                    backgroundImage: `url(${card.bg})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    color: "#2a1a10",
                    padding: "1rem",
                    textShadow: "0 2px 8px rgba(255,255,255,0.8)",
                    cursor: "pointer",
                    filter: "brightness(1)",
                  } as React.CSSProperties;
                  if (isCylinder) {
                    return {
                      ...base,
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      transform: `rotateY(${rotateY}deg) translateZ(${radius}px)`,
                    };
                  }
                  // two or single: layout in flow
                  // Keep exact card dimensions on desktop for two cards (side-by-side).
                  const flowWidth = isSingle
                    ? isMobile
                      ? "92%"
                      : `${cardWidth}px`
                    : isMobile
                      ? "92%"
                      : `${cardWidth}px`;
                  const flowHeight = isMobile ? "auto" : `${cardHeight}px`;
                  return {
                    ...base,
                    position: "relative",
                    width: flowWidth,
                    height: flowHeight,
                    minHeight: "140px",
                    transform: "none",
                  };
                })()}
              >
                {/* <h2
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: "700",
                    marginBottom: "0.2rem",
                  }}
                >
                  {card.title}
                </h2>
                <p style={{ fontSize: "0.9rem", opacity: 0.9 }}>{card.desc}</p> */}
              </motion.div>
            );
          })}
        </motion.div>
        {/* intro slideshow removed */}
        {/* Popup */}
        {selectedCard &&
          createPortal(
            <AnimatePresence>
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
                  background:
                    "linear-gradient(135deg, #FDF8F3 0%, #F5EBE0 50%, #E8D5C4 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 999999999,
                  overflow: "hidden",
                }}
                onClick={() => setSelectedCard(null)}
              >
                {/* CSS Animated Background for Popup */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    zIndex: 1,
                    pointerEvents: "none",
                    overflow: "hidden",
                  }}
                >
                  {/* Abstract Geometric Shapes */}
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-shape"
                      style={{
                        position: "absolute",
                        width:
                          i % 3 === 0
                            ? "150px"
                            : i % 3 === 1
                              ? "100px"
                              : "50px",
                        height:
                          i % 3 === 0
                            ? "150px"
                            : i % 3 === 1
                              ? "100px"
                              : "50px",
                        borderRadius: i % 2 === 0 ? "50%" : "10%",
                        border: `2px solid ${i % 2 === 0 ? "#B08030" : "#D9A756"
                          }`,
                        background:
                          i % 4 === 0
                            ? `${i % 2 === 0 ? "#B08030" : "#D9A756"}20`
                            : "transparent",
                        left: `${(i * 23 + 10) % 90}%`,
                        top: `${(i * 17 + 5) % 85}%`,
                        opacity: 0.05 + (i % 3) * 0.03,
                      }}
                    />
                  ))}
                </div>
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
                  <PopupCloseButton
                    onClick={() => setSelectedCard(null)}
                    ariaLabel={`Close ${selectedCard?.title || "popup"}`}
                    zIndex={14005}
                  />
                  <img
                    src={selectedCard.popupImg}
                    alt={selectedCard.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      borderRadius: "12px",
                      boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
                    }}
                  />
                </motion.div>
              </motion.div>
            </AnimatePresence>,
            document.body
          )}
      </div>
    </div>
  );
}
