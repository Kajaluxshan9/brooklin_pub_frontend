import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const images = [
  "https://i.pinimg.com/736x/8b/b4/c5/8bb4c59a46590ce36065bf3b60c8b3e1.jpg",
  "https://i.pinimg.com/736x/6d/31/89/6d3189d24742473a6b3187fc48dffdd6.jpg",
  "https://i.pinimg.com/736x/52/1a/01/521a01d28f8bc09a8042ee20a0f6451c.jpg",
  "https://i.pinimg.com/736x/57/58/8b/57588b32c55b721df9710bfe1093fe1f.jpg",
  "https://i.pinimg.com/736x/85/c3/de/85c3dec46e77529ddc41c788d23193ef.jpg",
  "https://i.pinimg.com/736x/26/a7/0e/26a70e2ddd9a68f19c12f2dbce11d0dc.jpg",
  "https://i.pinimg.com/736x/5c/7a/43/5c7a43138d9740941d0326a156551135.jpg",
  "https://i.pinimg.com/736x/fd/62/8f/fd628f20363bdb533e548ece109407f3.jpg",
  "https://i.pinimg.com/736x/c3/8c/c2/c38cc2d23a8b71091a6f72dd01f35294.jpg",
  "https://i.pinimg.com/736x/5f/66/39/5f66391ae599dfeb0b9338bef8e81897.jpg",
];

const LandingPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const tinyRefs = useRef<(HTMLDivElement | null)[]>([]);

  const radius = 800;
  const spacing = 250;

  const shuffleArray = (arr: string[]) => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  useEffect(() => {
    // prevent global horizontal scrolling while this component is mounted
    const prevOverflowX = document.documentElement.style.overflowX;
    document.documentElement.style.overflowX = "hidden";
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
              cards[i]!.style.background = `url(${src}) center/cover no-repeat`;
              gsap.to(cards[i], { opacity: 1, duration: 0.5 });
            },
          });
        }
      });
    }, 5000);

    // Tiny floating images spread all over the component container
    const tinyElements = tinyRefs.current;
    tinyElements.forEach((el) => {
      if (!el || !containerRef.current) return;

      const vw = containerRef.current.clientWidth || window.innerWidth;
      const vh = containerRef.current.clientHeight || window.innerHeight;
      const count = 50; // number of tiny images
      const imgSize = 20;

      el!.innerHTML = ""; // clear previous tiny images
      for (let j = 0; j < count; j++) {
        const imgEl = document.createElement("div");
        imgEl.classList.add("tiny-img");
        imgEl.style.width = `${imgSize}px`;
        imgEl.style.height = `${imgSize}px`;
        imgEl.style.borderRadius = "50%";
        imgEl.style.background = `url(${images[j % images.length]}) center/cover no-repeat`;
        imgEl.style.position = "absolute";

        // random position constrained to container bounds
        const x = Math.random() * Math.max(0, vw - imgSize);
        const y = Math.random() * Math.max(0, vh - imgSize);
        imgEl.style.left = `${x}px`;
        imgEl.style.top = `${y}px`;

        el!.appendChild(imgEl);

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

    return () => {
      clearInterval(interval);
      // restore document overflow-x
      document.documentElement.style.overflowX = prevOverflowX;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        perspective: "1500px",
        width: "100%",
        height: "100vh",
        background: "var(--brown-gradient)",
        overflow: "hidden",
        position: "relative",
        
      }}
    >
      {images.map((src, i) => (
        <div
          key={i}
          ref={(el) => {
            cardsRef.current[i] = el;
          }}
          className="spiral-card"
          style={{
            width: "90%",
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
            ref={(el) => {
              tinyRefs.current[i] = el;
            }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
            }}
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
          background: "rgba(92, 50, 50, 0.6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10,
          textAlign: "center",
          color: "#fff",
          padding: "20px",
        }}
      >
        <h1
          style={{ fontSize: "2.5rem", fontWeight: "bold", lineHeight: "1.2" }}
        >
         Step in to the Brooklin Pub
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
