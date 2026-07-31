"use client";
import { useEffect, useRef } from "react";

export default function Loading() {
  const canvasRef = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const targets = [];

    const img = new Image();
    img.src = "/logo1.jpg"; // 👈 YOUR SR LOGO

    img.onload = () => {
      const size = 220;

      const tempCanvas = document.createElement("canvas");
      const tempCtx = tempCanvas.getContext("2d");

      tempCanvas.width = size;
      tempCanvas.height = size;

      tempCtx.drawImage(img, 0, 0, size, size);

      const data = tempCtx.getImageData(0, 0, size, size).data;

      for (let y = 0; y < size; y += 2) {
        for (let x = 0; x < size; x += 2) {
          const index = (y * size + x) * 4;

          const r = data[index];
          const g = data[index + 1];
          const b = data[index + 2];
          const alpha = data[index + 3];

          // ❌ IGNORE NAVY BACKGROUND
          const isDarkBg = r < 50 && g < 50 && b < 100;

          if (alpha > 150 && !isDarkBg) {
            targets.push({
              x: canvas.width / 2 + (x - size / 2),
              y: canvas.height / 2 + (y - size / 2),
            });
          }
        }
      }
      initParticles();
    };

    const initParticles = () => {
      targets.forEach((t) => {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          tx: t.x,
          ty: t.y,
          vx: 0,
          vy: 0,
        });
      });

      animate();
    };

    let scale = 1;
    let dir = 1;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      scale += 0.004 * dir;
      if (scale > 1.08 || scale < 0.95) dir *= -1;

      particles.forEach((p) => {
        const targetX =
          canvas.width / 2 + (p.tx - canvas.width / 2) * scale;
        const targetY =
          canvas.height / 2 + (p.ty - canvas.height / 2) * scale;

        const dx = targetX - p.x;
        const dy = targetY - p.y;

        p.vx += dx * 0.04;
        p.vy += dy * 0.04;

        p.vx *= 0.85;
        p.vy *= 0.85;

        p.x += p.vx;
        p.y += p.vy;

        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.2 , 0, Math.PI * 2);

        ctx.fillStyle = "#d4af37";
        ctx.shadowColor = "#ffd700";
        ctx.shadowBlur = 25;

        ctx.fill();
      });

      requestAnimationFrame(animate);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[999999] bg-[#020617] flex flex-col items-center
     justify-center animate-fadeIn">

      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />

      <p className="relative text-white tracking-[8px] text-lg">
        LOADING...
      </p>

    </div>
  );
}