'use client';
import React, { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const [clicking, setClicking] = useState(false);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;
    let raf;

    const onMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX + 'px';
      dot.style.top = mouseY + 'px';
    };

    const animate = () => {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      ring.style.left = ringX + 'px';
      ring.style.top = ringY + 'px';
      raf = requestAnimationFrame(animate);
    };

    const onEnter = (e) => {
      if (e.target.closest('a, button, [role="button"], .rd-service-card, .rd-pricing-card, .rd-testimonial-card, .rd-tab-btn')) {
        setHovered(true);
      }
    };
    const onLeave = () => setHovered(false);
    const onDown = () => setClicking(true);
    const onUp = () => setClicking(false);

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseover', onEnter);
    document.addEventListener('mouseout', onLeave);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('mouseup', onUp);
    raf = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onEnter);
      document.removeEventListener('mouseout', onLeave);
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('mouseup', onUp);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className={`rd-cursor-dot${hovered ? ' hovered' : ''}${clicking ? ' clicking' : ''}`}
      />
      <div
        ref={ringRef}
        className={`rd-cursor-ring${hovered ? ' hovered' : ''}${clicking ? ' clicking' : ''}`}
      />
    </>
  );
}
