import { motion } from "framer-motion";

export function DrawTextSVG({ path, width = 150, stroke = "white" }) {
  return (
    <motion.svg
      width={width}
      viewBox="0 0 400 120"
      fill="none"
      style={{
        position: "absolute",
        bottom: "-60px",
        left: "50%",
        transform: "translateX(-50%)",
        overflow: "visible",
        pointerEvents: "none",
      }}
    >
      <motion.path
        d={path}
        fill="none"
        stroke={stroke}
        strokeWidth="8"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        transition={{
          duration: 2,
          ease: "easeInOut"
        }}
      />
    </motion.svg>
  );
}
