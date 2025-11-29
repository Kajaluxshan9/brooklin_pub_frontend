import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { addSpecial } from "../../lib/specials";
import { createPortal } from "react-dom";
import { useApiWithCache } from "../../hooks/useApi";
import { specialsService } from "../../services/specials.service";
import { getImageUrl } from "../../services/api";
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
  const screenWidth = typeof window !== "undefined" ? window.innerWidth : 1200;
  // Derived value for card sizing
  const mobile = screenWidth < 768;
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
      setAngle((prev) => (prev + 0.4) % 360);
    }, 30);
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
    }
  };
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isCylinder) return;
    if (isMobile && isInteracting && lastX !== null && e.touches.length === 1) {
      const touchX = e.touches[0].clientX;
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
  return (
    <div>
      <div
        style={{
          width: "100vw",
          height: mobile
            ? "clamp(350px, 70vh, 900px)"
            : "clamp(600px, 100vh, 1200px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          perspective: "1200px",
          overflow: "hidden",
          position: "relative",
          touchAction: "none",
          userSelect: "none",
          background: "#1a0a0f",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onWheel={(e) => {
          if (!isCylinder) return;
          setAutoRotate(false);
          setAngle((prev) => (prev + e.deltaY * 0.2) % 360);
        }}
      >
        {/* Animated Background Layers */}
        <style>
          {`
            @keyframes float1 {
              0%, 100% { transform: translate(0%, 0%) scale(1); }
              33% { transform: translate(15%, 20%) scale(1.1); }
              66% { transform: translate(-10%, 15%) scale(0.95); }
            }
            @keyframes float2 {
              0%, 100% { transform: translate(0%, 0%) scale(1); }
              33% { transform: translate(-20%, -15%) scale(1.05); }
              66% { transform: translate(10%, -10%) scale(0.9); }
            }
            @keyframes float3 {
              0%, 100% { transform: translate(0%, 0%) scale(1); }
              33% { transform: translate(20%, -10%) scale(0.95); }
              66% { transform: translate(-15%, 20%) scale(1.1); }
            }
            @keyframes float4 {
              0%, 100% { transform: translate(0%, 0%) scale(1); }
              33% { transform: translate(-10%, 25%) scale(1.05); }
              66% { transform: translate(15%, -15%) scale(0.9); }
            }
          `}
        </style>

        {/* Base Mesh Gradient */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 20% 30%, rgba(139, 38, 53, 0.4) 0%, transparent 50%), " +
              "radial-gradient(circle at 80% 70%, rgba(107, 62, 30, 0.35) 0%, transparent 50%), " +
              "radial-gradient(circle at 50% 50%, rgba(74, 20, 25, 0.3) 0%, transparent 60%), " +
              "linear-gradient(135deg, #2a1015 0%, #1a0a0f 50%, #2d1a10 100%)",
            zIndex: 1,
          }}
        />

        {/* Floating Orbs with Blur */}
        <div
          style={{
            position: "absolute",
            top: "10%",
            left: "15%",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(220, 100, 80, 0.25) 0%, rgba(180, 60, 50, 0.1) 40%, transparent 70%)",
            filter: "blur(60px)",
            animation: "float1 20s ease-in-out infinite",
            zIndex: 2,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "60%",
            right: "10%",
            width: "350px",
            height: "350px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(200, 120, 60, 0.22) 0%, rgba(160, 90, 40, 0.08) 40%, transparent 70%)",
            filter: "blur(70px)",
            animation: "float2 25s ease-in-out infinite",
            zIndex: 2,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "15%",
            left: "25%",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(160, 50, 70, 0.2) 0%, rgba(120, 30, 50, 0.08) 40%, transparent 70%)",
            filter: "blur(65px)",
            animation: "float3 22s ease-in-out infinite",
            zIndex: 2,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "30%",
            right: "30%",
            width: "280px",
            height: "280px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(180, 80, 50, 0.18) 0%, rgba(140, 60, 30, 0.06) 40%, transparent 70%)",
            filter: "blur(55px)",
            animation: "float4 18s ease-in-out infinite",
            zIndex: 2,
          }}
        />

        {/* Radial Overlay for Depth */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at center, transparent 0%, rgba(26, 10, 15, 0.4) 70%, rgba(26, 10, 15, 0.8) 100%)",
            zIndex: 3,
          }}
        />

        {/* Subtle Vignette */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at center, transparent 40%, rgba(0, 0, 0, 0.3) 100%)",
            zIndex: 4,
            pointerEvents: "none",
          }}
        />

        {/* Cylinder */}
        <motion.div
          ref={containerRef}
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
            marginTop: "60px",
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
                    color: "#fff",
                    padding: "1rem",
                    textShadow: "0 2px 8px rgba(0,0,0,0.7)",
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
                  background: "rgba(0,0,0,0.9)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 999999999,
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
                      top: "28px",
                      right: "28px",
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                      backdropFilter: "blur(14px)",
                      background: "rgba(255,255,255,0.08)",
                      border: "1px solid rgba(255,255,255,0.3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      boxShadow: "0 0 0 rgba(255,255,255,0.4)",
                      transition: "0.35s cubic-bezier(0.165, 0.84, 0.44, 1)",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.boxShadow =
                        "0 0 22px rgba(255,255,255,0.45)";
                      (e.currentTarget as HTMLElement).style.background =
                        "rgba(255,255,255,0.16)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.boxShadow =
                        "0 0 0 rgba(255,255,255,0.4)";
                      (e.currentTarget as HTMLElement).style.background =
                        "rgba(255,255,255,0.08)";
                    }}
                  >
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{
                        transition: "0.35s",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as SVGElement).style.transform =
                          "rotate(90deg)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as SVGElement).style.transform =
                          "rotate(0deg)";
                      }}
                    >
                      <path d="M18 6L6 18" />
                      <path d="M6 6l12 12" />
                    </svg>
                  </button>
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
    </div >
  );
}
