import React, { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function LongScrollMenu() {
  const ref = useRef(null);
  const pathRef = useRef(null);
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
      menuItems: [
        { name: "Veggie Delight", desc: "Avocado & veggie patty", price: "11€" },
        { name: "Green Garden", desc: "Grilled tofu & greens", price: "10€" },
      ],
    },
  ];

  const [points, setPoints] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // helper clamp
  const clamp = (val, a, b) => Math.max(a, Math.min(val, b));

  // Generate points along curved path with non-overlap and full visibility
  useEffect(() => {
    const generatePoints = () => {
      if (!pathRef.current) return;
      const pathElement = pathRef.current;
      const length = pathElement.getTotalLength();
      if (!length) return;

      const numPoints = menuData.length;
      const newPoints = [];

      // size adjusts on mobile
      const isMobile = window.innerWidth < 768;
      const baseSize = isMobile ? 160 : 280;

      // horizontal zones (left/center/right) expressed as percentage positions
      const zones = [
        screenWidth * 0.18, // left (~18% of width)
        screenWidth * 0.5,  // center
        screenWidth * 0.82  // right (~82% of width)
      ];

      for (let i = 0; i < numPoints; i++) {
        const t = (length / (numPoints - 1 || 1)) * i; // evenly spaced along path
        const point = pathElement.getPointAtLength(t);

        // alternate zone index but ensure first item uses zone 0 (left) in bounds
        const zoneIndex = i % 3;
        const desiredX = zones[zoneIndex];

        const size = baseSize;

        // compute raw x,y centered at point
        let rawX = desiredX;
        let rawY = point.y;

        // clamp so the *entire* image stays in view
        const minX = padding + size / 2;
        const maxX = screenWidth - padding - size / 2;
        const minY = padding + size / 2;
        const maxY = containerHeight - padding - size / 2;

        const finalX = clamp(rawX, minX, maxX);
        const finalY = clamp(rawY, minY, maxY);

        newPoints.push({
          x: finalX, // we'll center using transform: translate(-50%, -50%)
          y: finalY,
          size,
        });
      }

      setPoints(newPoints);
    };

    // small timeout to allow SVG to render & measure
    const timer = setTimeout(generatePoints, 160);
    window.addEventListener("resize", generatePoints);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", generatePoints);
    };
  }, [curvedPath, menuData.length, screenWidth]);

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
        background: "#0e3b4e",
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
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#111",
    border: "4px solid white",
    cursor: "pointer",
    zIndex: 10,
    boxShadow: "0 12px 30px rgba(0,0,0,0.7)",
    willChange: "transform, filter", // 🔒 prevents layout shift
  }}
  whileHover={{
    // ✅ No scale, no position shift — only visual glow
    boxShadow: "0 20px 50px rgba(0,0,0,0.9)",
    filter: "brightness(1.15)",
  }}
  transition={{
    type: "spring",
    stiffness: 200,
    damping: 18,
  }}
>
  <motion.img
    src={menuData[idx].mainImage}
    alt=""
    style={{
      maxWidth: "100%",
      maxHeight: "100%",
      width: "100%",
      height: "100%",
      objectFit: "contain",
      display: "block",
      pointerEvents: "none",
      background: "#000",
      borderRadius: "50%",
      willChange: "filter",
    }}
    whileHover={{
      // subtle brightness only — no transform
      filter: "brightness(1.2) contrast(1.1)",
    }}
    transition={{
      duration: 0.3,
    }}
  />
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
function ImageCarousel({ images, currentIndex, setCurrentIndex }) {
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
function MenuPanel({ onClose, highlightIndex, setCurrentIndex, menuItems }) {
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
