import { Box, Skeleton as MuiSkeleton } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";
import { colors, borderRadius } from "../../config/theme.tokens";

interface SkeletonProps {
  variant?: "text" | "rectangular" | "rounded" | "circular";
  width?: number | string;
  height?: number | string;
  animation?: "pulse" | "wave" | false;
  sx?: SxProps<Theme>;
}

/**
 * Skeleton - Base skeleton component with pub theming
 */
export function Skeleton({
  variant = "rounded",
  width,
  height,
  animation = "wave",
  sx,
}: SkeletonProps) {
  return (
    <MuiSkeleton
      variant={variant}
      width={width}
      height={height}
      animation={animation}
      sx={{
        bgcolor: colors.glass.gold,
        "&::after": {
          background: `linear-gradient(90deg, transparent, ${colors.glass.white}, transparent)`,
        },
        ...sx,
      }}
    />
  );
}

/**
 * CardSkeleton - Skeleton for card-style loading
 */
export function CardSkeleton({
  height = 200,
  showImage = true,
  showText = true,
  imageHeight = 140,
}: {
  height?: number | string;
  showImage?: boolean;
  showText?: boolean;
  imageHeight?: number;
}) {
  return (
    <Box
      sx={{
        bgcolor: colors.background.paper,
        borderRadius: borderRadius.lg,
        overflow: "hidden",
        height,
        p: 2,
      }}
    >
      {showImage && (
        <Skeleton
          variant="rounded"
          width="100%"
          height={imageHeight}
          sx={{ mb: 2 }}
        />
      )}
      {showText && (
        <>
          <Skeleton variant="text" width="80%" height={24} sx={{ mb: 1 }} />
          <Skeleton variant="text" width="60%" height={16} sx={{ mb: 1 }} />
          <Skeleton variant="text" width="40%" height={16} />
        </>
      )}
    </Box>
  );
}

/**
 * MenuItemSkeleton - Skeleton for menu items
 */
export function MenuItemSkeleton() {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        p: 2,
        bgcolor: colors.glass.white,
        borderRadius: borderRadius.md,
        mb: 2,
      }}
    >
      <Skeleton variant="rounded" width={80} height={80} />
      <Box sx={{ flex: 1 }}>
        <Skeleton variant="text" width="70%" height={24} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="100%" height={16} sx={{ mb: 0.5 }} />
        <Skeleton variant="text" width="90%" height={16} sx={{ mb: 1 }} />
        <Skeleton variant="text" width={60} height={20} />
      </Box>
    </Box>
  );
}

/**
 * EventCardSkeleton - Skeleton for event cards
 */
export function EventCardSkeleton({ isOdd = false }: { isOdd?: boolean }) {
  return (
    <Box
      sx={{
        width: "100%",
        background: "#f6f6f6",
        borderRadius: isOdd ? "24px 24px 48px 24px" : "24px 24px 24px 48px",
        padding: isOdd
          ? { xs: "88px 36px 36px", md: "48px 308px 48px 60px" }
          : { xs: "88px 36px 36px", md: "48px 48px 48px 308px" },
        margin: { xs: "64px 0", md: "84px 0" },
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      <Skeleton variant="rounded" width={100} height={28} sx={{ mb: 2 }} />
      <Skeleton variant="text" width="60%" height={32} sx={{ mb: 2 }} />
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <Skeleton variant="text" width={120} height={20} />
        <Skeleton variant="text" width={80} height={20} />
      </Box>
      <Skeleton variant="text" width="80%" height={18} sx={{ mb: 0.5 }} />
      <Skeleton variant="text" width="70%" height={18} />
      <Skeleton
        variant="rounded"
        sx={{
          width: { xs: 150, md: 240 },
          height: { xs: 150, md: 280 },
          position: "absolute",
          top: { xs: 16, md: -24 },
          right: isOdd ? { xs: 16, md: 24 } : "auto",
          left: isOdd ? "auto" : { xs: "auto", md: 24 },
          borderRadius: "24px",
        }}
      />
    </Box>
  );
}

/**
 * HeroSkeleton - Skeleton for hero sections
 */
export function HeroSkeleton() {
  return (
    <Box
      sx={{
        minHeight: { xs: "55vh", md: "60vh" },
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: colors.primary.dark,
        px: { xs: 2, sm: 4 },
      }}
    >
      <Skeleton
        variant="rectangular"
        width={80}
        height={2}
        sx={{ mb: 2, bgcolor: colors.secondary.main }}
      />
      <Skeleton
        variant="text"
        width={300}
        height={60}
        sx={{ mb: 2, bgcolor: colors.glass.white }}
      />
      <Skeleton
        variant="text"
        width={400}
        height={24}
        sx={{ bgcolor: colors.glass.white }}
      />
      <Skeleton
        variant="rectangular"
        width={120}
        height={2}
        sx={{ mt: 3, bgcolor: colors.secondary.main }}
      />
    </Box>
  );
}

/**
 * GridSkeleton - Skeleton for grid layouts
 */
export function GridSkeleton({
  count = 6,
  columns = { xs: 1, sm: 2, md: 3 },
  itemHeight = 200,
}: {
  count?: number;
  columns?: { xs?: number; sm?: number; md?: number };
  itemHeight?: number;
}) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: `repeat(${columns.xs || 1}, 1fr)`,
          sm: `repeat(${columns.sm || 2}, 1fr)`,
          md: `repeat(${columns.md || 3}, 1fr)`,
        },
        gap: 3,
      }}
    >
      {Array.from({ length: count }).map((_, index) => (
        <CardSkeleton key={index} height={itemHeight} />
      ))}
    </Box>
  );
}

/**
 * TableSkeleton - Skeleton for table data
 */
export function TableSkeleton({
  rows = 5,
  columns = 4,
}: {
  rows?: number;
  columns?: number;
}) {
  return (
    <Box sx={{ width: "100%" }}>
      {/* Header */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: 2,
          p: 2,
          bgcolor: colors.glass.gold,
          borderRadius: `${borderRadius.md} ${borderRadius.md} 0 0`,
        }}
      >
        {Array.from({ length: columns }).map((_, index) => (
          <Skeleton key={index} variant="text" width="80%" height={24} />
        ))}
      </Box>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <Box
          key={rowIndex}
          sx={{
            display: "grid",
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            gap: 2,
            p: 2,
            borderBottom: `1px solid ${colors.glass.goldBorder}`,
          }}
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton
              key={colIndex}
              variant="text"
              width={colIndex === 0 ? "90%" : "70%"}
              height={20}
            />
          ))}
        </Box>
      ))}
    </Box>
  );
}

export default Skeleton;
