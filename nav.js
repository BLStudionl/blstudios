import { $, $$ } from "./utils.js";

export function initHeader() {
  const header = $("#header");
  if (!header) return;
  const bar = $("#scrollBar");
  const num = $("#scrollNum");

  const onScroll = () => {
    header.classList.toggle("scrolled", window.scrollY > 24);
    if (bar) {
      const max = Math.max(1, window.innerHeight * 3);
      const p = Math.min(1, window.scrollY / max);
      bar.style.transform = `translateY(${p * 180}px)`;
      if (num) num.textContent = "0" + Math.min(4, Math.floor(p * 4) + 1);
    }
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

export function initMobileNav() {
  const burger = $("#burger");
  const nav = $("#mobileNav");
  if (!burger || !nav) return;

  const setOpen = (open) => {
    nav.hidden = !open;
    // hidden must be removed before the transition can run
    requestAnimationFrame(() => nav.classList.toggle("open", open));
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Menu sluiten" : "Menu openen");
    document.body.classList.toggle("modal-open", open);
    if (open) $$("a", nav)[0]?.focus();
  };

  burger.addEventListener("click", () => setOpen(nav.hidden));
  nav.addEventListener("click", (e) => { if (e.target.closest("a")) setOpen(false); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !nav.hidden) { setOpen(false); burger.focus(); }
  });
}
