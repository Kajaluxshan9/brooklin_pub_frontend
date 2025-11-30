type Props = {
  onClick: () => void;
  ariaLabel?: string;
  zIndex?: number;
};

export default function PopupCloseButton({
  onClick,
  ariaLabel = "Close popup",
  zIndex = 14002,
}: Props) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      style={{
        position: "fixed",
        top: "28px",
        right: "28px",
        width: "50px",
        height: "50px",
        borderRadius: "50%",
        backdropFilter: "blur(4px)",
        background: "rgba(106, 58, 30, 0.9)",
        border: "1px solid rgba(217, 167, 86, 0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        boxShadow: "0 4px 12px rgba(106,58,30,0.3)",
        transition: "0.35s cubic-bezier(0.165, 0.84, 0.44, 1)",
        zIndex,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow =
          "0 0 22px rgba(217, 167, 86, 0.45)";
        (e.currentTarget as HTMLElement).style.background =
          "rgba(106, 58, 30, 1)";
        (e.currentTarget as HTMLElement).style.borderColor = "#d9a756";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow =
          "0 4px 12px rgba(106,58,30,0.3)";
        (e.currentTarget as HTMLElement).style.background =
          "rgba(106, 58, 30, 0.9)";
        (e.currentTarget as HTMLElement).style.borderColor =
          "rgba(217, 167, 86, 0.6)";
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
        style={{ transition: "0.35s" }}
        onMouseEnter={(e) => {
          (e.currentTarget as SVGElement).style.transform = "rotate(90deg)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as SVGElement).style.transform = "rotate(0deg)";
        }}
      >
        <title>{ariaLabel}</title>
        <path d="M18 6L6 18" />
        <path d="M6 6l12 12" />
      </svg>
    </button>
  );
}
