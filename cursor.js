import { $, reduceMotion } from "./utils.js";

export function initCursor() {
  const cur = $("#cursor");
  if (!cur) return;
  const fine = window.matchMedia("(hover:hover) and (pointer:fine)").matches;
  if (reduceMotion || !fine) { cur.remove(); return; }

  let x = 0, y = 0, tx = 0, ty = 0;
  document.addEventListener("mousemove", (e) => { tx = e.clientX; ty = e.clientY; }, { passive: true });
  (function loop() {
    x += (tx - x) * 0.18; y += (ty - y) * 0.18;
    cur.style.transform = `translate(${x}px,${y}px) translate(-50%,-50%)`;
    requestAnimationFrame(loop);
  })();
  document.addEventListener("mouseover", (e) => {
    const t = e.target.closest("[data-cursor]");
    cur.classList.toggle("big", !!t);
    cur.querySelector("span").textContent = t ? "VIEW PROJECT" : "";
  });
}
