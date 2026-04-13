import React, { useState, useCallback, useRef } from "react";
import "./BubbleBackground.css";

let bubbleId = 0;

export default function BubbleBackground({ children }) {
  const [bubbles, setBubbles] = useState([]);
  const containerRef = useRef(null);

  const spawnBubbles = useCallback((e) => {
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const count = 6 + Math.floor(Math.random() * 5); // 6-10 bubbles per hover burst
    const newBubbles = [];

    for (let i = 0; i < count; i++) {
      const id = ++bubbleId;
      const size = 20 + Math.random() * 60; // 20px - 80px
      const duration = 4 + Math.random() * 1.5; // 4 - 5.5 seconds
      const delay = Math.random() * 0.6;

      // Spread bubbles around the mouse position
      const startX = mouseX + (Math.random() - 0.5) * 400;
      const startY = mouseY + (Math.random() - 0.5) * 300;

      // Random drift direction
      const driftX = (Math.random() - 0.5) * 300;
      const driftY = -(100 + Math.random() * 250); // float upward

      // Random color from a curated neon palette
      const colors = [
        "rgba(99, 102, 241, 0.35)",   // indigo
        "rgba(139, 92, 246, 0.30)",    // violet
        "rgba(236, 72, 153, 0.25)",    // pink
        "rgba(6, 182, 212, 0.30)",     // cyan
        "rgba(16, 185, 129, 0.25)",    // emerald
        "rgba(245, 158, 11, 0.20)",    // amber
        "rgba(59, 130, 246, 0.30)",    // blue
      ];
      const color = colors[Math.floor(Math.random() * colors.length)];

      newBubbles.push({
        id,
        size,
        duration,
        delay,
        startX,
        startY,
        driftX,
        driftY,
        color,
      });
    }

    setBubbles((prev) => [...prev, ...newBubbles]);

    // Auto-clean bubbles after they finish animating
    const maxLifetime = Math.max(...newBubbles.map((b) => (b.duration + b.delay) * 1000));
    setTimeout(() => {
      setBubbles((prev) =>
        prev.filter((b) => !newBubbles.some((nb) => nb.id === b.id))
      );
    }, maxLifetime + 200);
  }, []);

  // Throttle hover spawning
  const lastSpawn = useRef(0);
  const handleMouseMove = useCallback(
    (e) => {
      const now = Date.now();
      if (now - lastSpawn.current > 800) {
        lastSpawn.current = now;
        spawnBubbles(e);
      }
    },
    [spawnBubbles]
  );

  return (
    <div
      ref={containerRef}
      className="bubble-container"
      onMouseMove={handleMouseMove}
    >
      {/* Bubble layer */}
      <div className="bubble-layer" aria-hidden="true">
        {bubbles.map((b) => (
          <div
            key={b.id}
            className="bubble"
            style={{
              "--size": `${b.size}px`,
              "--startX": `${b.startX}px`,
              "--startY": `${b.startY}px`,
              "--driftX": `${b.driftX}px`,
              "--driftY": `${b.driftY}px`,
              "--duration": `${b.duration}s`,
              "--delay": `${b.delay}s`,
              "--color": b.color,
            }}
          />
        ))}
      </div>

      {/* Actual content */}
      {children}
    </div>
  );
}
