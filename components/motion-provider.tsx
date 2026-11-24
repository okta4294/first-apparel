"use client";

import { useEffect } from "react";

export function PageMotion() {
  useEffect(() => {
    if (
      typeof window === "undefined" ||
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    let observer: IntersectionObserver | null = null;
    let toObserve: HTMLElement[] = [];

    const setup = () => {
      const selectors = '[data-animate="text-reveal"], [data-animate="stagger-cards"], [data-animate="fade-up"]';
      const elements = Array.from(document.querySelectorAll<HTMLElement>(selectors));
      if (elements.length === 0) return;

      const viewportHeight = window.innerHeight;
      // Baca posisi semua elemen sekaligus sebelum menulis style agar tidak memicu forced reflow
      toObserve = elements.filter(
        (el) => el.getBoundingClientRect().top >= viewportHeight * 0.95
      );

      if (toObserve.length === 0) return;

      for (const el of toObserve) {
        el.style.opacity = "0";
        el.style.transform = "translate3d(0, 18px, 0)";
        el.style.transition = "opacity 0.5s ease-out, transform 0.5s ease-out";
      }

      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            const target = entry.target as HTMLElement;
            target.style.opacity = "1";
            target.style.transform = "translate3d(0, 0, 0)";
            observer?.unobserve(target);
          }
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
      );

      for (const el of toObserve) {
        observer.observe(el);
      }
    };

    const idleId =
      typeof window.requestIdleCallback === "function"
        ? window.requestIdleCallback(setup, { timeout: 300 })
        : window.setTimeout(setup, 1);

    return () => {
      if (typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(idleId);
      } else {
        window.clearTimeout(idleId);
      }
      observer?.disconnect();
      for (const el of toObserve) {
        el.style.opacity = "";
        el.style.transform = "";
        el.style.transition = "";
      }
    };
  }, []);

  return null;
}
