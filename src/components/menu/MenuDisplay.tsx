import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { DrawTextSVG } from "../icons/SvgNames";
import { createPortal } from "react-dom";

export default function LongScrollMenu() {
  const ref = useRef<HTMLDivElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);
  const screenWidth = typeof window !== "undefined" ? window.innerWidth : 1000;
  const containerHeight = 4000;
  const padding = 36; // safe padding from edges

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const left = 0;
  const right = screenWidth;
  const centerX = screenWidth / 2;

  const curvedPath = `
    M${left} 0
    C${right * 0.25} ${containerHeight * 0.1},
     ${right * 0.75} ${containerHeight * 0.2},
     ${right} ${containerHeight * 0.3}
    S${left} ${containerHeight * 0.45},
     ${right} ${containerHeight * 0.6}
    S${left} ${containerHeight * 0.75},
     ${right} ${containerHeight * 0.9}
    S${centerX} ${containerHeight * 0.97},
     ${centerX} ${containerHeight}
  `;

  const menuData = [
    {
      mainImage:
        "https://i.pinimg.com/736x/42/2c/2e/422c2e649799697f1d1355ba8f308edd.jpg",
      images: [
        "https://i.pinimg.com/736x/42/2c/2e/422c2e649799697f1d1355ba8f308edd.jpg",
        "https://i.pinimg.com/736x/ab/b1/29/abb12910f1d49d7c67cfe3a94c1612b5.jpg",
      ],
      name: "Classic Burger",
      namePath: `M4.20 42.90Q0 42.90 0 39.60Q0 38.05 1.05 36.95Q2.10 35.80 3.55 35.80Q4.60 35.80 5.20 36.50Q5.65 37.10 5.65 37.80Q5.65 38.40 5.43 38.98Q5.20 39.55 4.65 39.95Q3.85 40.70 2.80 40.70Q1.90 40.70 1.30 40.10Q1.85 41.55 4.15 41.55Q4.75 41.55 5.25 41.40Q9.55 40.25 12.75 36.45Q15.50 33.10 19.95 24.35L27.40 9.70Q28.00 8.55 28.78 7.57Q29.55 6.60 30.40 5.80Q28.50 5.85 26.43 6.30Q24.35 6.75 22.10 7.50Q17.55 9.05 15 11.10Q10.10 14.95 10.10 18.25Q10.10 20.20 12.35 20.20Q15 20.20 17.90 18.50Q20.55 16.95 22.50 14.55Q22.65 14.40 22.80 14.40Q23.15 14.40 23.15 14.65Q23.15 16.60 18.35 19.15Q13.95 21.55 11.65 21.55Q7 21.55 7 18Q7 16.35 8.30 14.50Q9.85 12.30 12.45 10.52Q15.05 8.75 18.75 7.40Q25.15 5.05 31.25 5Q34.40 2.30 37.75 2.30Q39.15 2.30 40.40 2.85Q40.65 2.95 40.65 3.20Q40.65 3.95 40.25 3.70Q39.45 3.25 38.25 3.25Q35.85 3.25 33.65 5.05Q37.80 5.45 39.85 7.35Q41.55 9.05 41.55 11.25Q41.55 14.55 38.70 17.85Q35.95 21.05 31.90 22.45Q38.70 23.65 38.70 29.05Q38.70 33.55 34.05 37.70Q29.00 42.15 21.85 42.65Q21.50 42.70 21.13 42.70Q20.75 42.70 20.35 42.70Q13.80 42.70 13.85 38.75Q8.80 42.90 4.20 42.90M25.00 22.40Q26.00 22.30 26.98 22.22Q27.95 22.15 28.85 22.15Q32.60 21.50 35.40 18.30Q38.30 15 38.30 11.40Q38.30 9.45 37.15 8.05Q35.70 6.25 32.75 5.85Q31.80 6.80 31.08 8.02Q30.35 9.25 29.75 10.70L25.00 22.40M20.05 41.85Q21.05 41.85 22.25 41.60Q23.45 41.35 24.95 40.90Q29.30 39.50 32.20 36.05Q35.20 32.50 35.20 29.25Q35.20 26.70 33.30 25.20Q31.20 23.55 27.15 23.55Q25.90 23.55 24.45 23.70Q24.05 24.70 23.38 26.15Q22.70 27.60 21.70 29.40Q21.35 30 20.95 30.65Q20.55 31.30 20.05 32Q22.05 31 24.18 30.27Q26.30 29.55 28.60 29.05Q29.30 28.90 29.65 28.90Q30.20 28.90 30.20 29.10Q30.20 29.60 28.65 29.95Q22.00 31.70 18.55 35.30Q16.40 37.50 16.40 39.15Q16.40 40 16.95 40.70Q17.95 41.85 20.05 41.85ZM44.75 39.95Q41.55 39.95 41.55 36.95Q41.55 35.90 42.15 34.13Q42.75 32.35 43.85 29.90L46.60 23.85Q47.05 22.80 48.55 22.80L51.55 22.80Q49.80 24.10 48.35 27Q47.80 28.10 47.03 29.73Q46.25 31.35 45.25 33.45Q44.30 35.40 44.30 36.95Q44.30 38.55 45.40 38.55Q46.60 38.55 48.25 36.65Q51 33.45 55.65 23.85Q56.20 22.80 57.55 22.80L60.25 22.80Q58.60 24.15 56.80 27.75Q54.30 32.80 53.80 35.45Q53.75 35.75 53.73 36Q53.70 36.25 53.70 36.50Q53.70 38.45 55.05 38.45Q56.50 38.45 58.45 35.60L59.20 35.95Q56.50 39.95 53.85 39.95Q51.05 39.95 51.05 36.40Q51.05 35.05 51.55 33.55Q47.85 39.95 44.75 39.95ZM59.05 40.35Q60 37.95 61.57 34.35Q63.15 30.75 65.15 26.15Q65.55 25.15 65.92 24.55Q66.30 23.95 66.60 23.60Q67.25 22.85 68.35 23L69.40 23.15Q69.75 23.20 70.03 23.22Q70.30 23.25 70.50 23.20Q69.50 23.70 68.17 26.02Q66.85 28.35 65.25 32.35Q65.80 31.65 66.65 30.48Q67.50 29.30 68.80 27.75Q70.25 26.05 71.80 24.60Q73.35 23.15 74.80 23.15Q75.95 23.15 76.45 23.90Q76.95 24.65 76.95 25.60Q76.95 26.75 76.05 27.65Q75.15 28.55 74.30 28.55Q73.95 28.55 73.58 28.40Q73.20 28.25 73.20 27.95Q73.20 27.70 73.30 27.48Q73.40 27.25 73.40 26.95Q73.40 26.20 72.70 26.20Q72.45 26.20 72.03 26.32Q71.60 26.45 70.90 27.15Q69.50 28.45 67.88 30.27Q66.25 32.10 64.83 34.35Q63.40 36.60 62.50 39.30Q62.25 40.05 61 40.10Q59.30 40.20 59.05 40.35ZM73.75 53.05Q71.10 53.05 69.80 51.30Q69.25 50.45 69.25 49.05Q69.25 47.95 69.55 47.45L70.45 47.40Q70.20 48.30 70.20 48.95Q70.20 51.65 73.35 51.65Q76.25 51.65 79.25 47Q80.10 45.70 80.97 43.88Q81.85 42.05 82.65 39.75Q83.20 38.25 83.72 36.73Q84.25 35.20 84.80 33.65Q83 36.55 81.20 38.30Q79.35 40.05 77.80 40.05Q76.55 40.05 75.80 38.90Q75 37.80 75 35.85Q75 31.15 79.20 26.05Q79.90 25.20 80.80 24.50Q81.70 23.80 82.75 23.25Q84.90 22.15 86.90 22.15Q89.35 22.15 90.80 23.75Q91.15 24.10 91.15 24.55Q91.15 25.40 90.25 25.20Q89.75 23.40 87.95 23.40Q85.85 23.40 83 26.35Q80.90 28.55 79.35 31.10Q77.25 34.60 77.25 36.95Q77.25 38.65 78.50 38.65Q80 38.65 81.90 36.45Q83.95 34 86.35 29.45Q87.30 27.65 87.85 27Q88.65 26.20 89.75 26.25L90.80 26.40Q91.40 26.55 91.85 26.45Q91.50 26.80 91.15 27.20Q90.80 27.60 90.55 28Q90.10 28.70 89.55 29.77Q89 30.85 88.45 32.30Q87.85 33.85 87.33 35.30Q86.80 36.75 86.25 38.05Q85 41.25 83.95 43.60Q82.90 45.95 82.10 47.50Q81.55 48.60 80.72 49.50Q79.90 50.40 78.85 51.20Q76.40 53.05 73.75 53.05ZM96.45 40.20Q94.50 40.20 93.10 38.95Q92.35 38.25 92.03 37.33Q91.70 36.40 91.70 35.20Q91.70 30.60 95.50 26.05Q98.70 22.20 102.15 22.20Q103.30 22.20 104.10 22.80Q104.95 23.50 104.95 24.60Q104.95 27.35 101.30 30.10Q100.15 30.95 98.25 31.60Q96.15 32.30 95.20 32.30Q94.50 34 94.50 35.90Q94.50 39.15 96.90 39.15Q100.05 39.15 102.80 35.05L103 34.75L103.85 35.10L103.70 35.40Q102.45 37.90 100.55 39.05Q98.65 40.20 96.45 40.20M95.50 31.45Q96.35 31.45 97.85 30.90Q98.70 30.55 99.48 30.15Q100.25 29.75 100.85 29.25Q103.60 26.95 103.60 24.40Q103.60 23.30 102.80 23.30Q101.40 23.30 98.55 26.75Q97.10 28.50 95.50 31.45ZM103.95 40.35Q104.90 37.95 106.48 34.35Q108.05 30.75 110.05 26.15Q110.45 25.15 110.83 24.55Q111.20 23.95 111.50 23.60Q112.15 22.85 113.25 23L114.30 23.15Q114.65 23.20 114.93 23.22Q115.20 23.25 115.40 23.20Q114.40 23.70 113.08 26.02Q111.75 28.35 110.15 32.35Q110.70 31.65 111.55 30.48Q112.40 29.30 113.70 27.75Q115.15 26.05 116.70 24.60Q118.25 23.15 119.70 23.15Q120.85 23.15 121.35 23.90Q121.85 24.65 121.85 25.60Q121.85 26.75 120.95 27.65Q120.05 28.55 119.20 28.55Q118.85 28.55 118.48 28.40Q118.10 28.25 118.10 27.95Q118.10 27.70 118.20 27.48Q118.30 27.25 118.30 26.95Q118.30 26.20 117.60 26.20Q117.35 26.20 116.93 26.32Q116.50 26.45 115.80 27.15Q114.40 28.45 112.78 30.27Q111.15 32.10 109.73 34.35Q108.30 36.60 107.40 39.30Q107.15 40.05 105.90 40.10Q104.20 40.20 103.95 40.35Z`,

      menuItems: [
        { name: "Classic Burger", desc: "Beef, lettuce, cheese", price: "12€" },
        { name: "Cheese Deluxe", desc: "Double cheese & bacon", price: "14€" },
      ],
    },
  ];

  const [points, setPoints] = useState<
    { x: number; y: number; size: number }[]
  >([]);
  const [selectedImage, setSelectedImage] = useState<{
    index: number;
    data: (typeof menuData)[0];
  } | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // helper clamp
  const clamp = (val: number, a: number, b: number) =>
    Math.max(a, Math.min(val, b));

  // Generate points along curved path with non-overlap and full visibility
  useEffect(() => {
    const generatePoints = () => {
      if (!pathRef.current) return;
      const pathElement = pathRef.current as SVGPathElement;
      const length = pathElement.getTotalLength();
      if (!length) return;

      const numPoints = menuData.length;
      // recompute width here so resize is handled correctly
      const sw = window.innerWidth || screenWidth;
      const newPoints: { x: number; y: number; size: number }[] = [];

      // If there's only one item, make it cover the entire container (with padding)
      if (numPoints === 1) {
        const swCenter = sw / 2;
        const availWidth = sw - padding * 2;
        const availHeight = containerHeight - padding * 2;
        // size should be the smaller of available width/height so it fits fully
        const fullSize = Math.max(100, Math.min(availWidth, availHeight));
        const finalX = clamp(
          swCenter,
          padding + fullSize / 2,
          sw - padding - fullSize / 2
        );
        const finalY = clamp(
          containerHeight / 2,
          padding + fullSize / 2,
          containerHeight - padding - fullSize / 2
        );
        newPoints.push({ x: finalX, y: finalY, size: fullSize });
        setPoints(newPoints);
        return;
      }

      // compute sizing based on number of items so everything fits the full path
      const isMobileLocal = sw < 768;
      const maxSizeDesktop = 260;
      const maxSizeMobile = 160;

      // derive ideal spacing along the path (use numPoints+1 to add margins at ends)
      const idealSpacingAlongPath = Math.max(
        1,
        length / Math.max(1, numPoints + 1)
      );

      // starting base size estimated from path spacing, bounded
      let baseSize = Math.round(
        Math.max(
          40,
          Math.min(
            isMobileLocal ? maxSizeMobile : maxSizeDesktop,
            idealSpacingAlongPath * 0.7
          )
        )
      );

      const minSize = 36;

      const buildPointsForSize = (size: number, jitterAlong = 0) => {
        const pts: { x: number; y: number; size: number }[] = [];
        for (let i = 0; i < numPoints; i++) {
          let t = ((i + 1) / (numPoints + 1)) * length;
          if (jitterAlong) {
            const dir = i % 2 === 0 ? -1 : 1;
            t = clamp(t + dir * jitterAlong, 0, length);
          }

          const point = pathElement.getPointAtLength(t);

          // ✅ Spread full width
          const desiredX =
            padding + (i + 1) * ((sw - padding * 2) / (numPoints + 1));
          const finalX = clamp(
            desiredX,
            padding + size / 2,
            sw - padding - size / 2
          );

          const finalY = clamp(
            point.y,
            padding + size / 2,
            containerHeight - padding - size / 2
          );

          pts.push({ x: finalX, y: finalY, size });
        }
        return pts;
      };

      // 1 cm ≈ 37.8 px → 10 cm ≈ 378 px
      const CM_TO_PX = 37.8;
      const MIN_GAP_CM = 10;
      const MIN_GAP_PX = MIN_GAP_CM * CM_TO_PX;

      const hasCollision = (pts: { x: number; y: number; size: number }[]) => {
        const border = 4;
        const safety = 8;
        for (let i = 0; i < pts.length; i++) {
          for (let j = i + 1; j < pts.length; j++) {
            const dx = pts[i].x - pts[j].x;
            const dy = pts[i].y - pts[j].y;
            const dist = Math.hypot(dx, dy);

            // required min distance between centers
            const minAllowed =
              (pts[i].size + pts[j].size) / 2 + border + safety + MIN_GAP_PX;

            if (dist < minAllowed) return true;
          }
        }
        return false;
      };

      // Build initial evenly spaced points and iteratively shrink size until no collisions
      let pts = buildPointsForSize(baseSize, 0);
      let attempts = 0;
      // progressively shrink more aggressively to resolve tight collisions
      while (hasCollision(pts) && baseSize > minSize && attempts < 20) {
        baseSize = Math.max(minSize, Math.floor(baseSize * 0.85));
        pts = buildPointsForSize(baseSize, 0);
        attempts++;
      }

      // If collisions still exist, try a small along-path jitter to separate overlapping clusters
      if (hasCollision(pts)) {
        // increase jitter to a larger proportion of the ideal spacing for stronger separation
        const jitterStep = Math.max(
          8,
          Math.floor(idealSpacingAlongPath * 0.12)
        );
        for (let pass = 1; pass <= 10 && hasCollision(pts); pass++) {
          pts = buildPointsForSize(baseSize, jitterStep * pass);
        }
      }

      // Final fallback: if still collisions, reduce to minimal size and evenly place
      if (hasCollision(pts)) {
        baseSize = minSize;
        pts = buildPointsForSize(baseSize, 0);
      }

      setPoints(pts);
    };

    // small timeout to allow SVG to render & measure
    const timer = setTimeout(generatePoints, 160);
    window.addEventListener("resize", generatePoints);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", generatePoints);
    };
  }, [curvedPath, menuData.length]);

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      ref={ref}
      style={{
        height: containerHeight,
        background: "var(--wine-red)",
        position: "relative",
        overflow: "visible",
      }}
    >
      <svg
        width="100%"
        height={containerHeight}
        viewBox={`0 0 ${screenWidth} ${containerHeight}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          position: "sticky",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          overflow: "visible",
        }}
      >
        <motion.path
          ref={pathRef}
          d={curvedPath}
          stroke="white"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
          style={{ pathLength }}
        />
      </svg>
      {points.map((point, idx) => {
        const { x, y, size } = point;

        // ✅ Add this line INSIDE the map:
        const circleSize = isMobile
          ? Math.min(size * 2.2, 140) // smaller on phones
          : Math.min(size * 6, 500); // larger but capped on desktop

        return (
          <motion.div
            key={idx}
            onClick={() => {
              setSelectedImage({ index: idx, data: menuData[idx] });
              setCurrentIndex(0);
            }}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: circleSize,
              height: circleSize,
              transform: "translate(-50%, -50%)",
              transformOrigin: "center center",
              borderRadius: "50%",
              overflow: "visible",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#111",
              border: "4px solid white",
              cursor: "pointer",
              zIndex: 10,
              boxShadow: "0 12px 30px rgba(0,0,0,0.7)",
              filter: "brightness(1)",
            }}
            whileHover={{
              boxShadow: "0 20px 50px rgba(0,0,0,0.9)",
              filter: "brightness(1.15)",
            }}
            transition={{ type: "spring", stiffness: 200, damping: 18 }}
          >
            <motion.img
              src={menuData[idx].mainImage}
              alt=""
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "50%",
                filter: "brightness(1) contrast(1)",
              }}
              whileHover={{ filter: "brightness(1.2) contrast(1.1)" }}
              transition={{ duration: 0.3 }}
            />

            <DrawTextSVG
              path={menuData[idx].namePath}
              width={isMobile ? circleSize * 1.2 : circleSize * 1.2}
              stroke="white"
              scale={1.8}
            />
          </motion.div>
        );
      })}

      {/* Modal (unchanged functionality) */}
      {selectedImage &&
        createPortal(
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(0,0,0,0.7)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 999999,
              overflowY: "auto",
              padding: "20px",
            }}
            onClick={() => setSelectedImage(null)}
          >
            <div
              style={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                background: "#fff",
                borderRadius: "15px",
                overflow: "hidden",
                width: "90%",
                maxWidth: "1000px",
                boxShadow: "0 0 30px rgba(0,0,0,0.3)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <ImageCarousel
                images={selectedImage.data.images}
                currentIndex={currentIndex}
                setCurrentIndex={setCurrentIndex}
              />

              <MenuPanel
                onClose={() => setSelectedImage(null)}
                highlightIndex={currentIndex}
                setCurrentIndex={setCurrentIndex}
                menuItems={selectedImage.data.menuItems}
              />
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}

/* ===== Image Carousel ===== */
function ImageCarousel({
  images,
  currentIndex,
  setCurrentIndex,
}: {
  images: string[];
  currentIndex: number;
  setCurrentIndex: (n: number) => void;
}) {
  return (
    <div
      style={{
        flex: 1,
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        background: "#000",
      }}
    >
      <motion.img
        key={currentIndex}
        src={images[currentIndex]}
        alt=""
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "15px",
          top: "50%",
          transform: "translateY(-50%)",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {images.map((_, i) => (
          <span
            key={i}
            onClick={() => setCurrentIndex(i)}
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              background:
                i === currentIndex ? "#8bc34a" : "rgba(255,255,255,0.5)",
              cursor: "pointer",
              transition: "0.3s",
            }}
          ></span>
        ))}
      </div>
    </div>
  );
}

/* ===== Menu Panel (Re-Designed) ===== */
function MenuPanel({
  onClose,
  highlightIndex,
  setCurrentIndex,
  menuItems,
}: {
  onClose: () => void;
  highlightIndex: number;
  setCurrentIndex: (n: number) => void;
  menuItems: { name: string; desc: string; price: string }[];
}) {
  return (
    <div
      style={{
        flex: 1,
        padding: "40px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#fafafa",
        position: "relative",
      }}
    >
      {/* Title */}
      <div style={{ marginBottom: "25px" }}>
        <h2
          style={{
            fontSize: "26px",
            fontWeight: 700,
            letterSpacing: "1px",
            textTransform: "uppercase",
            color: "#222",
            margin: 0,
          }}
        >
          Menu Selection
        </h2>

        <div
          style={{
            width: "70px",
            height: "4px",
            background: "#8bc34a",
            marginTop: "10px",
            borderRadius: "2px",
          }}
        ></div>
      </div>

      {/* Menu List */}
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {menuItems.map((item, i) => (
          <li
            key={i}
            onClick={() => setCurrentIndex(i)}
            style={{
              background: i === highlightIndex ? "#e9f7e9" : "white",
              padding: "18px 20px",
              borderRadius: "14px",
              marginBottom: "18px",
              cursor: "pointer",
              boxShadow:
                i === highlightIndex
                  ? "0 6px 14px rgba(0,0,0,0.15)"
                  : "0 2px 6px rgba(0,0,0,0.08)",
              transform: i === highlightIndex ? "scale(1.02)" : "scale(1)",
              transition: "all 0.35s ease",
              border:
                i === highlightIndex ? "1px solid #8bc34a" : "1px solid #eee",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "4px",
              }}
            >
              <strong
                style={{
                  fontSize: "17px",
                  color: "#222",
                }}
              >
                {item.name}
              </strong>
              <span
                style={{
                  fontSize: "16px",
                  fontWeight: "600",
                  color: "#4a7b2f",
                }}
              >
                {item.price}
              </span>
            </div>

            <p
              style={{
                fontSize: "14px",
                color: "#555",
                marginTop: "4px",
                lineHeight: "1.5",
                paddingRight: "4px",
              }}
            >
              {item.desc}
            </p>
          </li>
        ))}
      </ul>

      {/* Close Icon Button */}
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: "18px",
          right: "18px",
          width: "38px",
          height: "38px",
          borderRadius: "50%",
          border: "none",
          background: "rgba(0,0,0,0.75)",
          color: "#fff",
          cursor: "pointer",
          fontSize: "18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 10px rgba(0,0,0,0.4)",
          backdropFilter: "blur(4px)",
          transition: "0.3s",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = "rgba(0,0,0,1)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.background = "rgba(0,0,0,0.75)")
        }
      >
        ✕
      </button>
    </div>
  );
}
