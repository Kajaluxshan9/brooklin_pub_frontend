import React, { useMemo } from "react";

const NUM_BUBBLES = 128;

function random(min, max) {
  return min + Math.random() * (max - min);
}

const GoeyFooter = () => {
  const bubbles = useMemo(() => {
    return Array.from({ length: NUM_BUBBLES }).map((_, i) => {
      // generate random properties for each bubble
      const size = `${2 + Math.random() * 4}rem`;
      const distance = `${6 + Math.random() * 4}rem`;
      const position = `${-5 + Math.random() * 110}%`;
      const time = `${2 + Math.random() * 2}s`;
      const delay = `${-1 * (2 + Math.random() * 2)}s`;

      return { size, distance, position, time, delay, key: i };
    });
  }, []);

  return (
    <div className="footer">
      {/* SVG Filter */}
      <svg
        style={{ position: "fixed", top: "100vh" }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="blob">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  
                      0 1 0 0 0  
                      0 0 1 0 0  
                      0 0 0 19 -9"
              result="blob"
            />
            {/* The original pen had a feComposite, but commented */}
          </filter>
        </defs>
      </svg>

      {/* Bubbles container */}
      <div className="bubbles">
        {bubbles.map(({ size, distance, position, time, delay, key }) => (
          <div
            key={key}
            className="bubble"
            style={{
              "--size": size,
              "--distance": distance,
              "--position": position,
              "--time": time,
              "--delay": delay,
            }}
          ></div>
        ))}
      </div>

      {/* Content overlay */}
      <div className="content">
        <div>
          <div>
            <b>Eldew</b>
            <a href="#">Secuce</a>
            <a href="#">Drupand</a>
            <a href="#">Oceash</a>
            <a href="#">Ugefe</a>
            <a href="#">Babed</a>
          </div>
          <div>
            <b>Spotha</b>
            <a href="#">Miskasa</a>
            <a href="#">Agithe</a>
            <a href="#">Scesha</a>
            <a href="#">Lulle</a>
            <a href="#">Babed</a>
          </div>
          <div>
            <b>Chashakib</b>
            <a href="#">Chogauw</a>
            <a href="#">Phachuled</a>
            <a href="#">Tiebeft</a>
          </div>
        </div>
        <div
          className="image"
          style={{
            backgroundImage:
              "url('https://s3-us-west-2.amazonaws.com/s.cdpn.io/199011/happy.svg')",
          }}
        />
        <p>©2019 Not Really</p>
      </div>
    </div>
  );
};

export default GoeyFooter;
