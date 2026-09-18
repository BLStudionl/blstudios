import { $$, reduceMotion } from "./utils.js";

export function initReveals() {
  if (reduceMotion) { $$(".reveal").forEach((e) => e.classList.add("in")); return; }
  const io = new IntersectionObserver(
    (entries) => entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
    }),
    { rootMargin: "0px 0px -12% 0px", threshold: 0.08 }
  );
  $$(".reveal:not(.in)").forEach((el) => io.observe(el));
}
