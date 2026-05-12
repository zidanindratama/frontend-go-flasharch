"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export function AnimatedGridBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      time += 0.003;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Grid lines
      const gridSize = 60;
      const offsetX = (time * 10) % gridSize;
      const offsetY = (time * 6) % gridSize;

      ctx.strokeStyle = "rgba(255, 102, 0, 0.06)";
      ctx.lineWidth = 1;

      for (let x = -gridSize + offsetX; x < canvas.width + gridSize; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      for (let y = -gridSize + offsetY; y < canvas.height + gridSize; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Floating nodes
      const nodes = [
        { x: 0.2, y: 0.3, r: 2, speed: 0.5 },
        { x: 0.7, y: 0.2, r: 3, speed: 0.7 },
        { x: 0.5, y: 0.7, r: 2, speed: 0.4 },
        { x: 0.85, y: 0.6, r: 2.5, speed: 0.6 },
        { x: 0.15, y: 0.8, r: 1.5, speed: 0.8 },
        { x: 0.4, y: 0.5, r: 2, speed: 0.3 },
      ];

      nodes.forEach((node, i) => {
        const nx = node.x * canvas.width + Math.sin(time * node.speed + i) * 30;
        const ny = node.y * canvas.height + Math.cos(time * node.speed + i * 2) * 20;

        ctx.beginPath();
        ctx.arc(nx, ny, node.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 102, 0, 0.4)";
        ctx.fill();

        // Connect nearby nodes
        nodes.forEach((other, j) => {
          if (i >= j) return;
          const ox = other.x * canvas.width + Math.sin(time * other.speed + j) * 30;
          const oy = other.y * canvas.height + Math.cos(time * other.speed + j * 2) * 20;
          const dist = Math.hypot(nx - ox, ny - oy);
          if (dist < 200) {
            ctx.beginPath();
            ctx.moveTo(nx, ny);
            ctx.lineTo(ox, oy);
            ctx.strokeStyle = `rgba(255, 102, 0, ${0.08 * (1 - dist / 200)})`;
            ctx.stroke();
          }
        });
      });

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ opacity: 0.7 }}
    />
  );
}
