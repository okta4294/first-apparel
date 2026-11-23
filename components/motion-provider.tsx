"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { ReactLenis, type LenisRef } from "lenis/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function MotionProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin") ?? false;
  const lenisRef = useRef<LenisRef>(null);

  useEffect(() => {
    if (isAdmin) return;

    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }

    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    const lenis = lenisRef.current?.lenis;
    lenis?.on("scroll", ScrollTrigger.update);

    return () => {
      lenis?.off("scroll", ScrollTrigger.update);
      gsap.ticker.remove(update);
    };
  }, [isAdmin]);

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <ReactLenis
      root
      ref={lenisRef}
      options={{
        autoRaf: false,
        lerp: 0.1,
        smoothWheel: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}

export function PageMotion() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const heroContainers = gsap.utils.toArray<HTMLElement>('[data-animate="hero"]');
        heroContainers.forEach((container) => {
          const items =
            container.children.length > 0 ? Array.from(container.children) : [container];
          gsap.from(items, {
            y: 22,
            opacity: 0,
            duration: 0.75,
            stagger: 0.1,
            ease: "power3.out",
            clearProps: "transform,opacity",
          });
        });

        const textBlocks = gsap.utils.toArray<HTMLElement>('[data-animate="text-reveal"]');
        textBlocks.forEach((block) => {
          const targets =
            block.children.length > 0 ? Array.from(block.children) : [block];
          gsap.from(targets, {
            y: 24,
            opacity: 0,
            duration: 0.7,
            stagger: 0.08,
            ease: "power3.out",
            clearProps: "transform,opacity",
            scrollTrigger: {
              trigger: block,
              start: "top 88%",
              once: true,
            },
          });
        });

        const cardGrids = gsap.utils.toArray<HTMLElement>('[data-animate="stagger-cards"]');
        cardGrids.forEach((grid) => {
          const cards = Array.from(grid.children);
          if (cards.length === 0) return;
          gsap.from(cards, {
            y: 26,
            opacity: 0,
            duration: 0.65,
            stagger: 0.08,
            ease: "power2.out",
            clearProps: "transform,opacity",
            scrollTrigger: {
              trigger: grid,
              start: "top 86%",
              once: true,
            },
          });
        });

        const fadeUps = gsap.utils.toArray<HTMLElement>('[data-animate="fade-up"]');
        fadeUps.forEach((el) => {
          gsap.from(el, {
            y: 22,
            opacity: 0,
            duration: 0.65,
            ease: "power2.out",
            clearProps: "transform,opacity",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              once: true,
            },
          });
        });
      });

      ScrollTrigger.refresh();
    });

    return () => {
      ctx.revert();
    };
  }, []);

  return null;
}
