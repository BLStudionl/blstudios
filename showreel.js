import { $, $$ } from "./utils.js";

/**
 * Click-to-load video. Nothing is requested from a third party until the
 * visitor asks for it, which keeps the site cookie-free on first load.
 */
export function initShowreel() {
  const modal = $("#modal");
  const btn = $("#showreelBtn");
  const closeBtn = $("#modalClose");
  const frame = $("#modalFrame");
  if (!modal || !btn || !frame) return;

  let lastFocus = null;

  const load = () => {
    if (frame.dataset.loaded) return;
    const { video, poster, embed } = frame.dataset;
    if (video) {
      frame.innerHTML = `<video src="${video}" ${poster ? `poster="${poster}"` : ""} controls playsinline preload="none"></video>`;
      frame.querySelector("video").play().catch(() => {});
    } else if (embed) {
      frame.innerHTML = `<div class="embed-consent">
        <p>De showreel staat bij een externe videodienst. Als je die laadt, kan die dienst cookies plaatsen.</p>
        <button class="btn btn-primary" type="button" data-embed-accept>Video laden <span class="arw" aria-hidden="true">↗</span></button></div>`;
      frame.querySelector("[data-embed-accept]").addEventListener("click", () => {
        frame.innerHTML = `<iframe src="${embed}" title="Showreel van BL Studios" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>`;
      });
    }
    frame.dataset.loaded = "true";
  };

  const open = () => {
    lastFocus = document.activeElement;
    modal.hidden = false;
    requestAnimationFrame(() => modal.classList.add("open"));
    document.body.classList.add("modal-open");
    load();
    closeBtn.focus();
  };

  const close = () => {
    modal.classList.remove("open");
    document.body.classList.remove("modal-open");
    const v = frame.querySelector("video");
    if (v) v.pause();
    const f = frame.querySelector("iframe");
    if (f) f.remove(), (frame.dataset.loaded = "");
    setTimeout(() => { modal.hidden = true; }, 400);
    lastFocus?.focus();
  };

  btn.addEventListener("click", open);
  closeBtn.addEventListener("click", close);
  modal.addEventListener("click", (e) => { if (e.target === modal) close(); });
  document.addEventListener("keydown", (e) => {
    if (modal.hidden) return;
    if (e.key === "Escape") close();
    if (e.key === "Tab") {
      const focusables = $$("button, [href], video, iframe", modal).filter((el) => !el.hidden);
      if (!focusables.length) return;
      const first = focusables[0], last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
}

export function initBooking() {
  const host = $("[data-booking]");
  const trigger = $("[data-booking-load]");
  if (!host || !trigger) return;
  trigger.addEventListener("click", () => {
    const wrap = document.createElement("div");
    wrap.style.cssText = "margin-top:24px;border:1px solid var(--line);border-radius:var(--r-lg);overflow:hidden;aspect-ratio:4/3";
    wrap.innerHTML = `<iframe src="${host.dataset.booking}" title="Beschikbaarheid en boeking" style="width:100%;height:100%;border:0" loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>`;
    trigger.replaceWith(wrap);
  });
}
