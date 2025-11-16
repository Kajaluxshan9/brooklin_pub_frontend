import { motion } from "framer-motion";

interface DrawTextSVGProps {
  path: string;
  width?: number;
  stroke?: string;
  scale?: number;
}

export function DrawTextSVG({
  path,
  width,
  stroke = "white",
  scale,
}: DrawTextSVGProps) {
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
      preserveAspectRatio="xMidYMid meet"
      style={{
        // make the SVG inline and centered so its "in view" detection works
        position: "relative",
        left: "50%",
        transform: `translateX(-50%) scale(${finalScale})`,
        overflow: "visible",
        pointerEvents: "none",
        display: "block",
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
        // allow the animation to reverse when the element leaves the viewport
        viewport={{ once: false, amount: 0.6 }}
        transition={{ duration: 0.9, ease: "easeInOut" }}
      />
    </motion.svg>
  );

}
