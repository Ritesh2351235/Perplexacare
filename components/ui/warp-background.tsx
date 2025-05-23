"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface WarpBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

export const WarpBackground: React.FC<WarpBackgroundProps> = ({
  children,
  className,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const animate = () => {
      if (!ctx) return;

      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      for (let i = 0; i < 100; i++) {
        const angle = (i / 100) * Math.PI * 2;
        const x = centerX + Math.cos(angle + time) * (100 + Math.sin(time * 0.5) * 50);
        const y = centerY + Math.sin(angle + time) * (100 + Math.sin(time * 0.5) * 50);

        ctx.fillStyle = `hsl(${(i * 3.6 + time * 50) % 360}, 70%, 60%)`;
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      time += 0.01;
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener("resize", resize);
    resize();
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className={cn("relative min-h-screen overflow-hidden bg-black", className)}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-50"
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}; 