import { Box } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

interface ProtectedImageProps {
  src: string;
  alt: string;
  sx?: SxProps<Theme>;
  containerSx?: SxProps<Theme>;
  className?: string;
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
}

/**
 * ProtectedImage - A component that prevents users from downloading images
 *
 * Features:
 * - Disables right-click context menu
 * - Prevents drag and drop
 * - Adds invisible overlay to block direct image access
 * - Disables user selection
 */
export default function ProtectedImage({
  src,
  alt,
  sx,
  containerSx,
  className,
  objectFit = "cover",
}: ProtectedImageProps) {
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    return false;
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.preventDefault();
    return false;
  };

  return (
    <Box
      className={`protected-image ${className || ""}`}
      sx={{
        position: "relative",
        overflow: "hidden",
        ...containerSx,
      }}
      onContextMenu={handleContextMenu}
    >
      <Box
        component="img"
        src={src}
        alt={alt}
        draggable={false}
        onContextMenu={handleContextMenu}
        onDragStart={handleDragStart}
        sx={{
          width: "100%",
          height: "100%",
          objectFit,
          pointerEvents: "none",
          userSelect: "none",
          WebkitUserDrag: "none",
          ...sx,
        }}
      />
      {/* Invisible overlay to prevent direct image access */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "transparent",
          zIndex: 1,
        }}
        onContextMenu={handleContextMenu}
      />
    </Box>
  );
}
