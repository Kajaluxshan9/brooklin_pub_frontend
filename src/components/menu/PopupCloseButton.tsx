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
        top: "24px",
        right: "24px",
        width: "44px",
        height: "44px",
        borderRadius: "50%",
        backdropFilter: "blur(10px)",
        background: "rgba(255, 255, 255, 0.5)",
        border: "1px solid rgba(217, 167, 86, 0.3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        transition: "all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1)",
        zIndex,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.background =
          "rgba(255, 255, 255, 0.9)";
        (e.currentTarget as HTMLElement).style.transform = "rotate(90deg)";
        (e.currentTarget as HTMLElement).style.borderColor = "#D9A756";
        (e.currentTarget as HTMLElement).style.boxShadow =
          "0 4px 15px rgba(217, 167, 86, 0.2)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.background =
          "rgba(255, 255, 255, 0.5)";
        (e.currentTarget as HTMLElement).style.transform = "rotate(0deg)";
        (e.currentTarget as HTMLElement).style.borderColor =
          "rgba(217, 167, 86, 0.3)";
        (e.currentTarget as HTMLElement).style.boxShadow =
          "0 4px 12px rgba(0,0,0,0.05)";
      }}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#6A3A1E"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ transition: "stroke 0.3s" }}
      >
        <title>{ariaLabel}</title>
        <path d="M18 6L6 18" />
        <path d="M6 6l12 12" />
      </svg>
    </button>
  );
}
