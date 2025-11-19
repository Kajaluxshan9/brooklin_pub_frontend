import { useEffect, useState } from "react";
// navigation removed — component no longer navigates
import {
  loadInitialSpecials,
  getNewSpecialsCountByCategory,
} from "../../lib/specials";

export default function FloatingSpecials() {
  const [dailyCount, setDailyCount] = useState(0);
  const [chefCount, setChefCount] = useState(0);
  

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

    return () => {
      window.removeEventListener("specials-updated", onUpdate);
    };
  }, []);

  if (dailyCount === 0 && chefCount === 0) return null;
  // Floating buttons removed for all breakpoints per request.
  return null;
}
