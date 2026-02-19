"use client";

import { useState, useRef } from "react";
import Image from "next/image";

interface ImageZoomProps {
  src: string;
  alt: string;
}

export default function ImageZoom({ src, alt }: ImageZoomProps) {
  const [zoomed, setZoomed] = useState(false);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPosition({ x, y });
  };

  return (
    <div
      ref={containerRef}
      className="relative aspect-square bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden cursor-zoom-in"
      onMouseEnter={() => setZoomed(true)}
      onMouseLeave={() => setZoomed(false)}
      onMouseMove={handleMouseMove}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-contain p-8 transition-transform duration-150 ease-out"
        style={
          zoomed
            ? {
                transform: "scale(2)",
                transformOrigin: `${position.x}% ${position.y}%`,
              }
            : undefined
        }
        sizes="(max-width: 1024px) 100vw, 50vw"
        priority
      />
    </div>
  );
}
