import React, { useState, useEffect, useRef } from "react";

const slides = [
  { image: "/homeslider1.png", label: "Fresh Fruits" },
    { image: "/homeslider5.png", label: "Premium Oils" },
      { image: "/homeslider7.png", label: "Premium Oils" },
         { image: "/homeslider8.png", label: "Premium Oils" },
        { image: "/homeslider6.png", label: "Premium Oils" },
          { image: "/homeslider9.png", label: "Premium Oils" },
//     { image: "/homeslider4.png", label: "Premium Oils" },
     
  
//   { image: "/homeslider2.png", label: "Farm Vegetables" },
//   { image: "/homeslider3.png", label: "Premium Oils" },
  
  
];

export const HomeSlider = () => {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef(null);

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 3500);
  };

  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
  }, []);

  const goTo = (index) => {
    setCurrent(index);
    clearInterval(timerRef.current);
    startTimer();
  };

  const goPrev = () => goTo((current - 1 + slides.length) % slides.length);
  const goNext = () => goTo((current + 1) % slides.length);

  return (
    <div
      style={sliderWrapper}
      onMouseEnter={() => { setIsHovered(true); clearInterval(timerRef.current); }}
      onMouseLeave={() => { setIsHovered(false); startTimer(); }}
    >
      {/* Slides */}
      <div style={slidesTrack}>
        {slides.map((slide, i) => (
          <div
            key={i}
            style={{
              ...slideStyle,
              opacity: i === current ? 1 : 0,
              zIndex: i === current ? 1 : 0,
              transform: i === current ? "scale(1)" : "scale(1.02)",
              transition: "opacity 0.7s ease, transform 0.7s ease",
            }}
          >
            <img
              src={slide.image}
              alt={slide.label}
              style={imgStyle}
            />
            {/* Overlay gradient */}
            <div style={overlayGradient} />

            {/* Slide Label */}
            <div style={labelWrap}>
              <span style={labelStyle}>{slide.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Prev Button */}
      <button
        style={{ ...arrowBtn, left: 16, opacity: isHovered ? 1 : 0 }}
        onClick={goPrev}
        onMouseEnter={e => e.currentTarget.style.background = "#000000"}
        onMouseLeave={e => e.currentTarget.style.background = "rgba(0,0,0,0.45)"}
        aria-label="Previous"
      >
        <ChevronLeft />
      </button>

      {/* Next Button */}
      <button
        style={{ ...arrowBtn, right: 16, opacity: isHovered ? 1 : 0 }}
        onClick={goNext}
        onMouseEnter={e => e.currentTarget.style.background = "#000000"}
        onMouseLeave={e => e.currentTarget.style.background = "rgba(0,0,0,0.45)"}
        aria-label="Next"
      >
        <ChevronRight />
      </button>

      {/* Dots */}
      <div style={dotsWrap}>
        {slides.map((_, i) => (
          <button
            key={i}
            style={{
              ...dotBase,
              width: i === current ? 24 : 8,
              background: i === current ? "#000000" : "rgba(0,0,0,0.25)",
            }}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Slide counter */}
      <div style={counterStyle}>
        {current + 1} / {slides.length}
      </div>
    </div>
  );
};

/* ── Arrow Icons ── */
const ChevronLeft = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);
const ChevronRight = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);

/* ── Styles ── */
const sliderWrapper = {
  position: "relative",
  width: "100%",
   height: "clamp(320px, 50vw, 600px)",
  overflow: "hidden",
  background: "#e8e8e8",
  cursor: "pointer",
};
const slidesTrack = {
  position: "relative",
  width: "100%",
  height: "100%",
};
const slideStyle = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
};
const imgStyle = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  display: "block",
};
const overlayGradient = {
  position: "absolute",
  inset: 0,
  background: "linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 50%)",
  pointerEvents: "none",
};
const labelWrap = {
  position: "absolute",
  bottom: 56,
  left: 36,
};
const labelStyle = {
  display: "inline-block",
  padding: "8px 20px",
  background: "#ffffff",
  color: "#000000",
  fontWeight: 700,
  fontSize: "1rem",
  borderRadius: 99,
  letterSpacing: "-0.01em",
  boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
};
const arrowBtn = {
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  zIndex: 10,
  width: 44,
  height: 44,
  borderRadius: "50%",
  border: "none",
  background: "rgba(0,0,0,0.45)",
  color: "#ffffff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  transition: "opacity 0.3s ease, background 0.2s ease",
};
const dotsWrap = {
  position: "absolute",
  bottom: 18,
  left: "50%",
  transform: "translateX(-50%)",
  display: "flex",
  alignItems: "center",
  gap: 6,
  zIndex: 10,
};
const dotBase = {
  height: 8,
  borderRadius: 99,
  border: "none",
  cursor: "pointer",
  transition: "width 0.3s ease, background 0.3s ease",
  padding: 0,
};
const counterStyle = {
  position: "absolute",
  top: 16,
  right: 20,
  fontSize: "0.75rem",
  fontWeight: 600,
  color: "#ffffff",
  background: "rgba(0,0,0,0.35)",
  padding: "4px 10px",
  borderRadius: 99,
  zIndex: 10,
  letterSpacing: "0.05em",
};