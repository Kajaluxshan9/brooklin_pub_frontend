import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  loadInitialSpecials,
  getNewSpecialsCountByCategory,
} from "../../lib/specials";

export default function FloatingSpecials() {
  const navigate = useNavigate();

  const [dailyCount, setDailyCount] = useState(0);
  const [chefCount, setChefCount] = useState(0);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    (async () => {
      await loadInitialSpecials();
      setDailyCount(getNewSpecialsCountByCategory("daily"));
      setChefCount(getNewSpecialsCountByCategory("chef"));
    })();

    const onUpdate = () => {
      setDailyCount(getNewSpecialsCountByCategory("daily"));
      setChefCount(getNewSpecialsCountByCategory("chef"));
    };

    window.addEventListener("specials-updated", onUpdate);

    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("specials-updated", onUpdate);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  if (dailyCount === 0 && chefCount === 0) return null;

  // Mobile position
  const mobileRight = 18;
  const mobileBottom = 86;

  return (
    <>
      {/* DESKTOP VERSION - two floating circle buttons */}
      {!isMobile && (
        <>
          {/* DAILY SPECIAL */}
          <div
            style={{
              position: "fixed",
              right: 30,
              bottom: 180,
              width: 61,
              height: 61,
              borderRadius: "50%",
              background: "rgba(140,75,22,0.95)",
              boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              zIndex: 4500,
              transition: "transform 0.25s ease",
            }}
            onClick={() => navigate("/special/daily")}
          >
            <svg width="30" height="30" viewBox="0 0 24 24">
              <path
                fill="#fff"
                d="M6.76 4.84l-1.8-1.79L4 4l1.79 1.79 1-.95zM1 11h3v2H1v-2zm10-9h2v3h-2V2zm7.24 2.05l1.79-1.8L21 4l-1.79 1.79-1.97-1.74zM17.24 19.16l1.79 1.79L20 20l-1.79-1.79-1-.95zM20 11h3v2h-3v-2zM11 19h2v3h-2v-3zm-7.24.95l1.79 1.8L4 20l-1.79-1.79 1-.95zM12 7a5 5 0 100 10 5 5 0 000-10z"
              />
            </svg>

            {dailyCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: -8,
                  right: -4,
                  minWidth: 24,
                  height: 24,
                  borderRadius: "50%",
                  background: "#ff3b30",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                {dailyCount}
              </span>
            )}
          </div>

          {/* NIGHT SPECIAL */}
          <div
            style={{
              position: "fixed",
              right: 30,
              bottom: 100,
              width: 61,
              height: 61,
              borderRadius: "50%",
              background: "rgba(140,75,22,0.95)",
              boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              zIndex: 4500,
              transition: "transform 0.25s ease",
            }}
            onClick={() => navigate("/special/night")}
          >
            <svg width="28" height="28" viewBox="0 0 24 24">
              <path
                fill="#fff"
                d="M12 2a9 9 0 000 18 9 9 0 010-18zm0 2c.88 0 1.72.15 2.5.43A7.002 7.002 0 0112 18a7 7 0 010-14z"
              />
            </svg>

            {chefCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: -8,
                  right: -4,
                  minWidth: 24,
                  height: 24,
                  borderRadius: "50%",
                  background: "#ff3b30",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                {chefCount}
              </span>
            )}
          </div>
        </>
      )}

      {/* MOBILE VERSION — same as desktop but smaller */}
      {isMobile && (
        <>
          {/* DAILY - mini */}
          <div
            style={{
              position: "fixed",
              right: mobileRight,
              bottom: mobileBottom + 70,
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: "rgba(140,75,22,0.95)",
              boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              zIndex: 4500,
            }}
            onClick={() => navigate("/special/daily")}
          >
            <svg width="22" height="22" viewBox="0 0 24 24">
              <path
                fill="#fff"
                d="M6.76 4.84l-1.8-1.79L4 4l1.79 1.79 1-.95zM1 11h3v2H1v-2zm10-9h2v3h-2V2zm7.24 2.05l1.79-1.8L21 4l-1.79 1.79-1.97-1.74zM17.24 19.16l1.79 1.79L20 20l-1.79-1.79-1-.95zM20 11h3v2h-3v-2zM11 19h2v3h-2v-3zm-7.24.95l1.79 1.8L4 20l-1.79-1.79 1-.95zM12 7a5 5 0 100 10 5 5 0 000-10z"
              />
            </svg>

            {dailyCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: -6,
                  right: -6,
                  minWidth: 18,
                  height: 18,
                  borderRadius: "50%",
                  background: "#ff3b30",
                  color: "#fff",
                  fontSize: 10,
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {dailyCount}
              </span>
            )}
          </div>

          {/* NIGHT - mini */}
          <div
            style={{
              position: "fixed",
              right: mobileRight,
              bottom: mobileBottom,
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: "rgba(140,75,22,0.95)",
              boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              zIndex: 4500,
            }}
            onClick={() => navigate("/special/night")}
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path
                fill="#fff"
                d="M12 2a9 9 0 000 18 9 9 0 010-18zm0 2c.88 0 1.72.15 2.5.43A7.002 7.002 0 0112 18a7 7 0 010-14z"
              />
            </svg>

            {chefCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: -6,
                  right: -6,
                  minWidth: 18,
                  height: 18,
                  borderRadius: "50%",
                  background: "#ff3b30",
                  color: "#fff",
                  fontSize: 10,
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {chefCount}
              </span>
            )}
          </div>
        </>
      )}
    </>
  );
}
