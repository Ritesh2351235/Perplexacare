"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface IconCloudProps {
  icons?: string[];
  className?: string;
}

export const IconCloud: React.FC<IconCloudProps> = ({
  icons = [],
  className = "",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: Array<{
      x: number;
      y: number;
      size: number;
      speed: number;
      text: string;
      color: string;
    }> = [];

    const colors = [
      "#3b82f6", // blue
      "#06b6d4", // cyan
      "#6366f1", // indigo
      "#8b5cf6", // violet
      "#d946ef", // fuchsia
    ];

    const createParticles = () => {
      particles = [];
      const particleCount = icons.length || 10;

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 20 + 10,
          speed: Math.random() * 2 + 0.5,
          text: icons[i] || "⚡",
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    };

    const animate = () => {
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        ctx.font = `${particle.size}px monospace`;
        ctx.fillStyle = particle.color;
        ctx.fillText(particle.text, particle.x, particle.y);

        particle.y += particle.speed;

        if (particle.y > canvas.height) {
          particle.y = -particle.size;
          particle.x = Math.random() * canvas.width;
        }
      });

      requestAnimationFrame(animate);
    };

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      createParticles();
    };

    window.addEventListener("resize", resize);
    resize();
    animate();

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, [icons]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("w-full h-full bg-transparent", className)}
    />
  );
}; 