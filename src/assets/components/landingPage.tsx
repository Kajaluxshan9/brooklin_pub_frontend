import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

const LandingPage = () => {
  const containerRef = useRef(null);
  const cardsRef = useRef([]);
  const tinyRefs = useRef([]);

  const images = [
    "https://i.pinimg.com/736x/42/2c/2e/422c2e649799697f1d1355ba8f308edd.jpg",
    "https://i.pinimg.com/736x/b0/2f/c8/b02fc86b1a599455dfb134e44b033b02.jpg",
    "https://i.pinimg.com/736x/b0/2f/c8/b02fc86b1a599455dfb134e44b033b02.jpg",
    "https://i.pinimg.com/736x/b0/2f/c8/b02fc86b1a599455dfb134e44b033b02.jpg",
    "https://i.pinimg.com/736x/b0/2f/c8/b02fc86b1a599455dfb134e44b033b02.jpg",
    "https://i.pinimg.com/736x/b0/2f/c8/b02fc86b1a599455dfb134e44b033b02.jpg",
    "https://i.pinimg.com/736x/b0/2f/c8/b02fc86b1a599455dfb134e44b033b02.jpg",
    "https://i.pinimg.com/736x/b0/2f/c8/b02fc86b1a599455dfb134e44b033b02.jpg",
    "https://i.pinimg.com/736x/b0/2f/c8/b02fc86b1a599455dfb134e44b033b02.jpg",
    "https://i.pinimg.com/736x/b0/2f/c8/b02fc86b1a599455dfb134e44b033b02.jpg",
  ];

  const radius = 800;
  const spacing = 250;

  const shuffleArray = (arr) => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  useEffect(() => {
    const cards = cardsRef.current;
    const total = cards.length;

    // Main spiral cards
    cards.forEach((card, i) => {
      const angle = (i / total) * Math.PI * 2;
      const y = i * spacing;

      gsap.set(card, {
        rotationY: (angle * 180) / Math.PI,
        transformOrigin: `50% 50% ${-radius}px`,
        y: y,
        xPercent: -50,
        yPercent: -50,
        left: "50%",
        top: "50%",
        opacity: 1,
      });
    });

    gsap.to(cards, {
      rotationY: "+=360",
      duration: 20,
      repeat: -1,
      ease: "none",
      stagger: { each: 0.3, repeat: -1 },
    });

    // Continuous upward scroll
    gsap.to(cards, {
      y: `-=${total * spacing}`,
      duration: total * 2,
      repeat: -1,
      ease: "none",
      modifiers: {
        y: (y) => `${parseFloat(y) % (total * spacing)}px`,
      },
      stagger: { each: 0.3 },
    });

    // Image shuffle every 5s
    const interval = setInterval(() => {
      const shuffled = shuffleArray(images);
      shuffled.forEach((src, i) => {
        if (cards[i]) {
          gsap.to(cards[i], {
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
              cards[i].style.background = `url(${src}) center/cover no-repeat`;
              gsap.to(cards[i], { opacity: 1, duration: 0.5 });
            },
          });
        }
      });
    }, 5000);

    // Tiny floating images spread all over screen
    const tinyElements = tinyRefs.current;
    tinyElements.forEach((el, i) => {
      if (!el) return;

      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const count = 50; // number of tiny images

      el.innerHTML = ""; // clear previous tiny images
      for (let j = 0; j < count; j++) {
        const imgEl = document.createElement("div");
        imgEl.classList.add("tiny-img");
        imgEl.style.width = "20px";
        imgEl.style.height = "20px";
        imgEl.style.borderRadius = "50%";
        imgEl.style.background = `url(${images[j % images.length]}) center/cover no-repeat`;
        imgEl.style.position = "absolute";

        // random position
        const x = Math.random() * vw;
        const y = Math.random() * vh;
        imgEl.style.left = `${x}px`;
        imgEl.style.top = `${y}px`;

        el.appendChild(imgEl);

        // random floating animation
        gsap.to(imgEl, {
          x: "+=" + (Math.random() * 100 - 50),
          y: "+=" + (Math.random() * 100 - 50),
          duration: 5 + Math.random() * 5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }
    });

    return () => clearInterval(interval);
  }, [images]);

  return (
    <div
      ref={containerRef}
      style={{
        perspective: "1500px",
        width: "100vw",
        height: "100vh",
        background: "#DAA520",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {images.map((src, i) => (
        <div
          key={i}
          ref={(el) => (cardsRef.current[i] = el)}
          className="spiral-card"
          style={{
            width: "90vw",
            maxWidth: "600px",
            aspectRatio: "16/9",
            background: `url(${src}) center/cover no-repeat`,
            borderRadius: "20px",
            position: "absolute",
            boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
            opacity: 0,
          }}
        >
          <div
            ref={(el) => (tinyRefs.current[i] = el)}
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
          ></div>
        </div>
      ))}

      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0, 0, 0, 0.6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10,
          textAlign: "center",
          color: "#fff",
          padding: "20px",
        }}
      >
        <h1 style={{ fontSize: "2.5rem", fontWeight: "bold", lineHeight: "1.2" }}>
          Welcome to My Landing Page
        </h1>
      </div>

      <style>{`
        .tiny-img { pointer-events: none; }
        @media (max-width: 1024px) { .spiral-card { max-width: 500px; } }
        @media (max-width: 768px) { .spiral-card { max-width: 400px; } }
        @media (max-width: 480px) { .spiral-card { max-width: 320px; } }
      `}</style>
    </div>
  );
};

export default LandingPage;
