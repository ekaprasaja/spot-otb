"use client";

import React, { useEffect, useRef } from "react";
import { animate, stagger, utils } from "animejs";

export default function AnimeBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Check if device is mobile (width <= 768px) to save CPU/battery and prevent main thread blocking
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      // On mobile, clear container and only apply a beautiful, lightweight GPU-accelerated static background gradient
      containerRef.current.innerHTML = "";
      containerRef.current.style.cssText = "position: absolute; inset: 0; background: radial-gradient(circle at 50% 0%, rgba(0, 119, 255, 0.08) 0%, transparent 80%); transform: translateZ(0); will-change: transform; pointer-events: none;";
      return;
    }

    // On desktop, defer animation initialization slightly to prioritize React hydration and interactive load speed
    const initTimeout = setTimeout(() => {
      if (!containerRef.current) return;
      containerRef.current.innerHTML = "";

      // Create complex SVG paths for "Data Streams"
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("width", "100%");
      svg.setAttribute("height", "100%");
      svg.setAttribute("viewBox", "0 0 1000 1000");
      svg.style.position = "absolute";
      svg.style.top = "0";
      svg.style.left = "0";
      svg.style.pointerEvents = "none";
      svg.style.opacity = "0.6";
      svg.style.filter = "drop-shadow(0 0 4px rgba(174, 198, 255, 0.3))";
      svg.style.transform = "translate3d(0, 0, 0)";
      svg.style.willChange = "transform";

      const paths: SVGPathElement[] = [];
      for (let i = 0; i < 5; i++) { // Reduced count from 6 to 5 for additional optimization
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        const startX = Math.random() * 1000;
        const startY = Math.random() * 1000;
        const d = `M ${startX} ${startY} Q ${Math.random() * 1000} ${Math.random() * 1000} ${Math.random() * 1000} ${Math.random() * 1000} T ${Math.random() * 1000} ${Math.random() * 1000}`;
        
        path.setAttribute("d", d);
        path.setAttribute("fill", "none");
        path.setAttribute("stroke", "rgba(174, 198, 255, 0.35)");
        path.setAttribute("stroke-width", "1.5");
        path.setAttribute("stroke-dasharray", "1000");
        path.setAttribute("stroke-dashoffset", "1000");
        
        svg.appendChild(path);
        paths.push(path);
      }

      containerRef.current.appendChild(svg);

      // AnimeJS V4 Staggered Path Animation
      animate(paths, {
        strokeDashoffset: [1000, 0],
        easing: "easeInOutSine",
        duration: 3500,
        delay: stagger(500),
        loop: true,
        direction: "alternate"
      });

      // Floating Particles (Reduced count from 25 to 15 for optimal performance)
      const particles: HTMLDivElement[] = [];
      for (let i = 0; i < 15; i++) {
        const dot = document.createElement("div");
        dot.style.position = "absolute";
        dot.style.width = "3px";
        dot.style.height = "3px";
        dot.style.background = "rgba(174, 198, 255, 0.5)";
        dot.style.boxShadow = "0 0 8px rgba(174, 198, 255, 0.7)";
        dot.style.borderRadius = "50%";
        dot.style.top = `${Math.random() * 100}%`;
        dot.style.left = `${Math.random() * 100}%`;
        dot.style.transform = "translate3d(0, 0, 0)";
        dot.style.willChange = "transform";
        containerRef.current.appendChild(dot);
        particles.push(dot);
      }

      animate(particles, {
        translateX: () => utils.random(-40, 40),
        translateY: () => utils.random(-40, 40),
        scale: [0, 1.2, 0],
        opacity: [0, 1, 0],
        easing: "easeInOutQuad",
        duration: () => utils.random(3500, 5500),
        delay: stagger(200),
        loop: true
      });

      // Optical Flares (Reduced from 3 to 2 for optimal CPU usage)
      const flares: HTMLDivElement[] = [];
      for (let i = 0; i < 2; i++) {
        const flare = document.createElement("div");
        flare.style.position = "absolute";
        flare.style.width = "120px";
        flare.style.height = "120px";
        flare.style.background = "radial-gradient(circle, rgba(174, 198, 255, 0.08) 0%, transparent 70%)";
        flare.style.borderRadius = "50%";
        flare.style.top = `${Math.random() * 100}%`;
        flare.style.left = `${Math.random() * 100}%`;
        flare.style.transform = "translate3d(0, 0, 0)";
        flare.style.willChange = "transform";
        flare.style.opacity = "0";
        containerRef.current.appendChild(flare);
        flares.push(flare);
      }

      animate(flares, {
        scale: [0.6, 1.4],
        opacity: [0, 0.35, 0],
        duration: () => utils.random(6000, 10000),
        delay: stagger(2500),
        loop: true,
        easing: "easeInOutSine"
      });
    }, 150);

    return () => {
      clearTimeout(initTimeout);
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 overflow-hidden pointer-events-none -z-10" 
    />
  );
}
