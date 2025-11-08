import { motion } from "framer-motion";

export function DrawTextSVG({ path, width, stroke = "white", scale }) {
  const screenWidth = typeof window !== "undefined" ? window.innerWidth : 1024;
  const isSmall = screenWidth < 480;
  const isTablet = screenWidth >= 480 && screenWidth < 1024;

  // Adjust width & scale smoothly
  const finalWidth = width ?? (isSmall ? 160 : isTablet ? 230 : 300);
  const finalScale = scale ?? (isSmall ? 0.65 : isTablet ? 0.85 : 1);

  return (
    <motion.svg
      width={finalWidth}
      viewBox="0 0 400 120"
      fill="none"
      style={{
        position: "absolute",
        // CLAMP prevents overlap: scales bottom distance based on screen size
        bottom: `clamp(-75px, -10vw, -115px)`,
        left: `clamp(120%, 120%, 120%)`,
        transform: `translateX(-50%) scale(${finalScale})`,
        overflow: "visible",
        pointerEvents: "none",
      }}
    >
      <motion.path
        d={path}
        fill="none"
        stroke={stroke}
        strokeWidth={isSmall ? 2 : isTablet ? 2.5 : 3}
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        transition={{ duration: 2, ease: "easeInOut" }}
      />
    </motion.svg>
  );
}
