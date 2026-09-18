import { $$ } from "./utils.js";

/**
 * Case study video. The poster is a background image, the YouTube iframe is
 * only inserted after a click, so nothing loads from YouTube unasked.
 */
export function initCaseVideo() {
  $$(".video-embed").forEach((box) => {
    const poster = box.dataset.poster;
    if (poster) box.style.setProperty("--poster", `url("${poster}")`);

    const btn = box.querySelector("[data-embed-play]");
    if (!btn || !box.dataset.embed) return;

    btn.addEventListener("click", () => {
      const frame = document.createElement("iframe");
      frame.src = box.dataset.embed + "&autoplay=1";
      frame.title = btn.getAttribute("aria-label") || "Video";
      frame.allow = "autoplay; fullscreen; picture-in-picture; encrypted-media";
      frame.allowFullscreen = true;
      frame.referrerPolicy = "strict-origin-when-cross-origin";
      box.appendChild(frame);
      box.classList.add("is-playing");
    });
  });
}
