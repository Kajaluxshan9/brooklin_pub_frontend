import { useState, useEffect } from "react";
import Nav from "../components/common/Nav";
import MainMenu from "../components/menu/MainMenu";
import Footer from "../components/common/Footer";
import InitialPage from "../components/home/InitialPage";
import Callicon from "../components/icons/CalendarIcon";
import SocialMedia from "../components/common/SocialFloatingMenu";

const Special = () => {
    const [isMobile, setIsMobile] = useState<boolean>(
      typeof window !== "undefined" ? window.innerWidth < 768 : false
    );
  
    useEffect(() => {
      const onResize = () => setIsMobile(window.innerWidth < 768);
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    }, []);
  
  return (
    <div>
      <Nav />
      <Callicon />
      <SocialMedia />
      <InitialPage
        line1="Welcome to Brooklin Pub"
        line2="Experience the finest dining and drinks in a cozy atmosphere."
      />
            <div style={{ display: 'flex', justifyContent: 'center',backgroundColor: "var(--wine-red)" }}>
        <h2
          style={{
            margin: 0,
            color: "white",
            fontSize: "50px",
            letterSpacing: "2px",
            textTransform: "uppercase",
            fontWeight: "Bold",
            backgroundColor: "var(--wine-red)",
            fontFamily: "'Inspiration', 'Cedarville Cursive', 'Great Vibes', cursive",
            marginTop: isMobile ? 70 : 100,
          }}
        >
          Our Menu
        </h2>
      </div>
      <MainMenu />
      <div style={{ height: isMobile ? 180 : 50, backgroundColor: "var(--wine-red)" }}></div>
      <Footer />
    </div>
  );
};

export default Special;
