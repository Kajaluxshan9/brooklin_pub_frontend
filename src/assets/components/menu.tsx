import React, { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { DrawTextSVG } from "../components/svgNames";

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
      name:"Classic Burger",
          namePath:`M10 60 Q 80 10, 160 60 T 310 60`,
      menuItems: [
        { name: "Classic Burger", desc: "Beef, lettuce, cheese", price: "12€" },
        { name: "Cheese Deluxe", desc: "Double cheese & bacon", price: "14€" },
      ],
    },
    {
      mainImage:
        "https://i.pinimg.com/736x/dc/f3/a0/dcf3a052cda09a8f8081c21fa28e1c91.jpg",
      images: [
        "https://i.pinimg.com/736x/dc/f3/a0/dcf3a052cda09a8f8081c21fa28e1c91.jpg",
        "https://i.pinimg.com/736x/ae/34/0f/ae340f9a2de1e445e2e53b79b276b8c3.jpg",
      ],
      name:"Classic Burger",

      menuItems: [
        { name: "Chicken Ranch", desc: "Grilled chicken & ranch", price: "13€" },
        { name: "Hot BBQ", desc: "Smoky BBQ beef", price: "15€" },
      ],
    },
    {
      mainImage:
        "https://i.pinimg.com/736x/59/a3/d4/59a3d40a498cd09a8e4231e8c49b8a89.jpg",
      images: [
        "https://i.pinimg.com/736x/59/a3/d4/59a3d40a498cd09a8e4231e8c49b8a89.jpg",
        "https://i.pinimg.com/736x/a9/bc/1a/a9bc1ae2d5c9b74eb21cb1f4f69d29a1.jpg",
      ],
      name:"Classic Burger",

      menuItems: [
        { name: "Veggie Delight", desc: "Avocado & veggie patty", price: "11€" },
        { name: "Green Garden", desc: "Grilled tofu & greens", price: "10€" },
      ],
    },
        {
      mainImage:
        "https://i.pinimg.com/736x/42/2c/2e/422c2e649799697f1d1355ba8f308edd.jpg",
      images: [
        "https://i.pinimg.com/736x/42/2c/2e/422c2e649799697f1d1355ba8f308edd.jpg",
        "https://i.pinimg.com/736x/ab/b1/29/abb12910f1d49d7c67cfe3a94c1612b5.jpg",
      ],
      name:"Classic Burger",

      menuItems: [
        { name: "Classic Burger", desc: "Beef, lettuce, cheese", price: "12€" },
        { name: "Cheese Deluxe", desc: "Double cheese & bacon", price: "14€" },
      ],
    },
    {
      mainImage:
        "https://i.pinimg.com/736x/dc/f3/a0/dcf3a052cda09a8f8081c21fa28e1c91.jpg",
      images: [
        "https://i.pinimg.com/736x/dc/f3/a0/dcf3a052cda09a8f8081c21fa28e1c91.jpg",
        "https://i.pinimg.com/736x/ae/34/0f/ae340f9a2de1e445e2e53b79b276b8c3.jpg",
      ],
      name:"Classic Burger",

      menuItems: [
        { name: "Chicken Ranch", desc: "Grilled chicken & ranch", price: "13€" },
        { name: "Hot BBQ", desc: "Smoky BBQ beef", price: "15€" },
      ],
    },
     {
      mainImage:
        "https://i.pinimg.com/736x/59/a3/d4/59a3d40a498cd09a8e4231e8c49b8a89.jpg",
      images: [
        "https://i.pinimg.com/736x/59/a3/d4/59a3d40a498cd09a8e4231e8c49b8a89.jpg",
        "https://i.pinimg.com/736x/a9/bc/1a/a9bc1ae2d5c9b74eb21cb1f4f69d29a1.jpg",
      ],
      name:"Classic Burger",

      menuItems: [
        { name: "Veggie Delight", desc: "Avocado & veggie patty", price: "11€" },
        { name: "Green Garden", desc: "Grilled tofu & greens", price: "10€" },
      ],
    },     {
      mainImage:
        "https://i.pinimg.com/736x/59/a3/d4/59a3d40a498cd09a8e4231e8c49b8a89.jpg",
      images: [
        "https://i.pinimg.com/736x/59/a3/d4/59a3d40a498cd09a8e4231e8c49b8a89.jpg",
        "https://i.pinimg.com/736x/a9/bc/1a/a9bc1ae2d5c9b74eb21cb1f4f69d29a1.jpg",
      ],
      name:"Classic Burger",

      menuItems: [
        { name: "Veggie Delight", desc: "Avocado & veggie patty", price: "11€" },
        { name: "Green Garden", desc: "Grilled tofu & greens", price: "10€" },
      ],
    },     {
      mainImage:
        "https://i.pinimg.com/736x/59/a3/d4/59a3d40a498cd09a8e4231e8c49b8a89.jpg",
      images: [
        "https://i.pinimg.com/736x/59/a3/d4/59a3d40a498cd09a8e4231e8c49b8a89.jpg",
        "https://i.pinimg.com/736x/a9/bc/1a/a9bc1ae2d5c9b74eb21cb1f4f69d29a1.jpg",
      ],
      name:"Classic Burger",

      menuItems: [
        { name: "Veggie Delight", desc: "Avocado & veggie patty", price: "11€" },
        { name: "Green Garden", desc: "Grilled tofu & greens", price: "10€" },
      ],
    },
  ];

  const [points, setPoints] = useState<{ x: number; y: number; size: number }[]>([]);
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // helper clamp
  const clamp = (val, a, b) => Math.max(a, Math.min(val, b));

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
        const finalX = clamp(swCenter, padding + fullSize / 2, sw - padding - fullSize / 2);
        const finalY = clamp(containerHeight / 2, padding + fullSize / 2, containerHeight - padding - fullSize / 2);
        newPoints.push({ x: finalX, y: finalY, size: fullSize });
        setPoints(newPoints);
        return;
      }

      // compute sizing based on number of items so everything fits the full path
      const isMobileLocal = sw < 768;
      const maxSizeDesktop = 260;
      const maxSizeMobile = 160;

      // derive ideal spacing along the path (use numPoints+1 to add margins at ends)
      const idealSpacingAlongPath = Math.max(1, length / Math.max(1, numPoints + 1));

      // starting base size estimated from path spacing, bounded
      let baseSize = Math.round(
        Math.max(40, Math.min(isMobileLocal ? maxSizeMobile : maxSizeDesktop, idealSpacingAlongPath * 0.7))
      );

      const minSize = 36;
      const zones = [sw * 0.18, sw * 0.5, sw * 0.82];

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
    const desiredX = padding + (i + 1) * ((sw - padding * 2) / (numPoints + 1));
    const finalX = clamp(desiredX, padding + size / 2, sw - padding - size / 2);

    const finalY = clamp(point.y, padding + size / 2, containerHeight - padding - size / 2);

    pts.push({ x: finalX, y: finalY, size });
  }
  return pts;
};


      const hasCollision = (pts: { x: number; y: number; size: number }[]) => {
        // consider border and a small safety margin when checking collisions
        const border = 4; // px border from CSS
        const safety = 8; // extra buffer
        for (let i = 0; i < pts.length; i++) {
          for (let j = i + 1; j < pts.length; j++) {
            const dx = pts[i].x - pts[j].x;
            const dy = pts[i].y - pts[j].y;
            const dist = Math.hypot(dx, dy);
            // required minimum center distance is sum of radii plus border+buffer
            const minAllowed = (pts[i].size + pts[j].size) / 2 + border + safety;
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
        let jitterStep = Math.max(8, Math.floor(idealSpacingAlongPath * 0.12));
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
    width: size,
    height: size,
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
    }}
    whileHover={{ filter: "brightness(1.2) contrast(1.1)" }}
    transition={{ duration: 0.3 }}
  />

<DrawTextSVG path={menuData[idx].namePath} width={isMobile ? 120 : 180} stroke="white" />

</motion.div>


  );
})}


      {/* Modal (unchanged functionality) */}
      {selectedImage && (
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
            zIndex: 999,
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
        </div>
      )}
    </div>
  );
}

/* ===== Image Carousel ===== */
function ImageCarousel({ images, currentIndex, setCurrentIndex }: { images: string[]; currentIndex: number; setCurrentIndex: (n: number) => void }) {
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
              background: i === currentIndex ? "#8bc34a" : "rgba(255,255,255,0.5)",
              cursor: "pointer",
              transition: "0.3s",
            }}
          ></span>
        ))}
      </div>
    </div>
  );
}

/* ===== Menu Panel ===== */
function MenuPanel({ onClose, highlightIndex, setCurrentIndex, menuItems }: { onClose: () => void; highlightIndex: number; setCurrentIndex: (n: number) => void; menuItems: { name: string; desc: string; price: string }[] }) {
  return (
    <div
      style={{
        flex: 1,
        padding: "40px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div>
        <h2
          style={{
            fontSize: "22px",
            letterSpacing: "1px",
            fontWeight: "600",
            textTransform: "uppercase",
            color: "#333",
            marginBottom: "10px",
          }}
        >
          Menu
        </h2>

        <div
          style={{
            height: "3px",
            width: "80px",
            background: "#8bc34a",
            marginBottom: "30px",
          }}
        ></div>

        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {menuItems.map((item, i) => (
            <li
              key={i}
              onClick={() => setCurrentIndex(i)}
              style={{
                marginBottom: "25px",
                padding: "10px",
                borderRadius: "8px",
                background: i === highlightIndex ? "#e8f5e9" : "transparent",
                cursor: "pointer",
                transition: "0.3s ease",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                }}
              >
                <strong
                  style={{
                    fontSize: "16px",
                    color: i === highlightIndex ? "#388e3c" : "#333",
                  }}
                >
                  {item.name}
                </strong>
                <span
                  style={{
                    fontWeight: "500",
                    color: i === highlightIndex ? "#388e3c" : "#333",
                  }}
                >
                  {item.price}
                </span>
              </div>
              <p
                style={{
                  fontSize: "13px",
                  color: "#555",
                  marginTop: "5px",
                  lineHeight: "1.4",
                }}
              >
                {item.desc}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={onClose}
        style={{
          alignSelf: "flex-end",
          marginTop: "20px",
          padding: "10px 20px",
          border: "none",
          borderRadius: "8px",
          background: "#d32f2f",
          color: "#fff",
          cursor: "pointer",
          fontSize: "14px",
        }}
      >
        Close ✕
      </button>
    </div>
  );
}
