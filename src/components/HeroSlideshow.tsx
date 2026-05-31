"use client";

import { useState, useEffect } from "react";

const images = [
  "/gallery/design1.png",
  "/gallery/6.png", 
  "/gallery/2.png",
  
];

export default function HeroSlideshow() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl bg-neutral-900">
      {images.map((src, i) => (
        <div
          key={src}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Using standard img for simplicity, or use next/image if configured */}
          <img
            src={src}
            alt={`Boutique Editorial ${i + 1}`}
            className="h-full w-full object-cover"
          />
          {/* Subtle overlay to maintain the luxury aesthetic */}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_60%,rgba(0,0,0,0.4)_100%)]" />
        </div>
      ))}
      
      {/* Visual Indicator Dots */}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
        {images.map((_, i) => (
          <div
            key={i}
            className={`h-1 rounded-full transition-all duration-500 ${
              i === index ? "w-4 bg-amber-200" : "w-1 bg-white/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
}