import { motion } from "framer-motion";

interface DrawTextSVGProps {
  text: string;
  width?: number;
  stroke?: string;
  fill?: string;
  scale?: number;
}

/**
 * Component to render text in Carattere font as SVG
 * This creates a beautiful handwritten appearance for category names
 * with a drawing/writing animation effect
 */
export function DrawTextSVG({
  text,
  width,
  stroke = "white",
  fill = "none",
  scale,
}: DrawTextSVGProps) {
  const screenWidth = typeof window !== "undefined" ? window.innerWidth : 1024;
  const isSmall = screenWidth < 480;
  const isTablet = screenWidth >= 480 && screenWidth < 1024;

  // Adjust width & scale smoothly
  const finalWidth = width ?? (isSmall ? 160 : isTablet ? 230 : 300);
  const finalScale = scale ?? (isSmall ? 0.65 : isTablet ? 0.85 : 1);

  // Estimate viewBox based on text length
  const estimatedWidth = Math.max(400, text.length * 40);
  const viewBoxHeight = 120;

  // Calculate approximate path length for the text stroke animation
  // This is an estimation based on character count and font size
  const estimatedPathLength = text.length * 60;

  return (
    <motion.svg
      width={finalWidth}
      viewBox={`0 0 ${estimatedWidth} ${viewBoxHeight}`}
      fill="none"
      preserveAspectRatio="xMidYMid meet"
      style={{
        position: "relative",
        left: "50%",
        transform: `translateX(-50%) scale(${finalScale})`,
        overflow: "visible",
        pointerEvents: "none",
        display: "block",
      }}
    >
      <motion.text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        fill={fill}
        stroke={stroke}
        strokeWidth={isSmall ? 1.5 : isTablet ? 2 : 2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          fontFamily: "'Corinthia', cursive",
          fontSize: "72px",
          letterSpacing: "2px",
          paintOrder: "stroke fill",
        }}
        initial={{
          strokeDasharray: estimatedPathLength,
          strokeDashoffset: estimatedPathLength,
          opacity: 0.5
        }}
        whileInView={{
          strokeDashoffset: 0,
          opacity: 1
        }}
        viewport={{ once: false, amount: 0.6 }}
        transition={{
          strokeDashoffset: { duration: 1.2, ease: "easeInOut" },
          opacity: { duration: 0.3, ease: "easeIn" }
        }}
      >
        {text}
      </motion.text>
    </motion.svg>
  );
}

// Keep the old path-based component for backward compatibility
interface DrawPathSVGProps {
  path: string;
  width?: number;
  stroke?: string;
  scale?: number;
}

export function DrawPathSVG({
  path,
  width,
  stroke = "white",
  scale,
}: DrawPathSVGProps) {
  const screenWidth = typeof window !== "undefined" ? window.innerWidth : 1024;
  const isSmall = screenWidth < 480;
  const isTablet = screenWidth >= 480 && screenWidth < 1024;

  const finalWidth = width ?? (isSmall ? 160 : isTablet ? 230 : 300);
  const finalScale = scale ?? (isSmall ? 0.65 : isTablet ? 0.85 : 1);

  return (
    <motion.svg
      width={finalWidth}
      viewBox="0 0 400 120"
      fill="none"
      preserveAspectRatio="xMidYMid meet"
      style={{
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
        viewport={{ once: false, amount: 0.6 }}
        transition={{ duration: 0.9, ease: "easeInOut" }}
      />
    </motion.svg>
  );
}
