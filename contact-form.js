import { $, $$ } from "./utils.js";

/**
 * Smart contact flow. Content of the questions lives here; wiring is generic,
 * so adding a subject is one object entry.
 */
const FLOW = {
  podcast: { label: "Podcast", questions: [
    { key: "organisatie", label: "Organisatie of naam", type: "text" },
    { key: "format", label: "Wat voor podcast wordt het?", type: "select", options: ["Interview", "Panelgesprek", "Solo", "Weet ik nog niet"] },
    { key: "afleveringen", label: "Hoeveel afleveringen?", type: "text", placeholder: "Bijvoorbeeld 6 afleveringen" },
    { key: "montage", label: "Montage nodig?", type: "select", options: ["Ja, volledige montage", "Alleen ruwe bestanden", "Nog niet zeker"] },
  ]},
  video: { label: "Video", questions: [
    { key: "organisatie", label: "Organisatie of naam", type: "text" },
    { key: "doel", label: "Waar is de video voor?", type: "text", placeholder: "Bijvoorbeeld campagne, website, social" },
    { key: "deadline", label: "Deadline", type: "date" },
    { key: "budget", label: "Budgetindicatie", type: "select", options: ["Nog onbekend", "Tot 2.500", "2.500 – 7.500", "7.500 en hoger"] },
  ]},
  campagne: { label: "Campagne", questions: [
    { key: "organisatie", label: "Organisatie", type: "text" },
    { key: "doel", label: "Wat wil je bereiken?", type: "textarea" },
    { key: "content", label: "Welke content zie je voor je?", type: "text", placeholder: "Bijvoorbeeld video, foto, social clips" },
    { key: "budget", label: "Budgetindicatie", type: "select", options: ["Nog onbekend", "Tot 5.000", "5.000 – 15.000", "15.000 en hoger"] },
    { key: "deadline", label: "Deadline", type: "date" },
  ]},
  studio: { label: "Studio huren", questions: [
    { key: "datum", label: "Gewenste datum", type: "date" },
    { key: "duur", label: "Hoe lang?", type: "select", options: ["2 uur", "Halve dag", "Hele dag", "Meerdere dagen"] },
    { key: "personen", label: "Aantal personen", type: "number" },
    { key: "av", label: "Audio of video?", type: "select", options: ["Audio en video", "Alleen audio", "Weet ik nog niet"] },
    { key: "montage", label: "Montage nodig?", type: "select", options: ["Ja", "Nee", "Nog niet zeker"] },
  ]},
  anders: { label: "Iets anders", questions: [
    { key: "organisatie", label: "Organisatie of naam", type: "text" },
    { key: "idee", label: "Waar denk je aan?", type: "textarea" },
  ]},
};

// Service slugs from the services page map onto a subject
const ALIAS = { podcastproductie: "podcast", contentproductie: "video", "creatieve-campagnes": "campagne", contentstrategie: "anders" };

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

export function initContactFlow() {
  const root = $("#flow");
  if (!root) return;

  const state = { subject: null, done: false };
  const params = new URLSearchParams(location.search);
  const wanted = params.get("onderwerp");
  const resolved = ALIAS[wanted] || wanted;
  if (resolved && FLOW[resolved]) state.subject = resolved;

  const field = (q) => {
    const id = `f-${q.key}`;
    const control =
      q.type === "select"
        ? `<select id="${id}" name="${q.key}">${q.options.map((o) => `<option>${esc(o)}</option>`).join("")}</select>`
        : q.type === "textarea"
        ? `<textarea id="${id}" name="${q.key}" placeholder="${esc(q.placeholder || "")}"></textarea>`
        : `<input id="${id}" name="${q.key}" type="${q.type}" placeholder="${esc(q.placeholder || "")}">`;
    return `<div class="field"><label for="${id}">${esc(q.label)}</label>${control}</div>`;
  };

  const render = () => {
    if (state.done) {
      root.innerHTML = `<div class="flow-done">
        <div class="tick" aria-hidden="true"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6"><path d="m5 13 4 4L19 7"/></svg></div>
        <h2>Verstuurd<i class="dotc"></i></h2>
        <p class="lede" style="margin-top:18px">Bedankt. Je krijgt binnen twee werkdagen antwoord van ons. Heb je al materiaal of een briefing liggen, stuur het gerust na.</p>
        <button class="btn btn-ghost" style="margin-top:28px" type="button" data-action="reset">Nog een aanvraag doen</button></div>`;
      root.querySelector("h2").setAttribute("tabindex", "-1");
      root.querySelector("h2").focus();
      return;
    }

    if (!state.subject) {
      root.innerHTML = `<span class="eyebrow y">Stap 1 van 3</span>
        <h2 style="margin-top:16px">Wat gaan we maken<i class="dotc"></i></h2>
        <div class="choices">${Object.entries(FLOW)
          .map(([k, v]) => `<button type="button" data-subject="${k}">${esc(v.label)}</button>`).join("")}</div>`;
      return;
    }

    const cfg = FLOW[state.subject];
    root.innerHTML = `<form id="contactForm" novalidate>
      <span class="eyebrow y">Stap 2 van 3 · ${esc(cfg.label)}</span>
      <h2 style="margin-top:16px">Vertel er iets meer over<i class="dotc"></i></h2>
      ${cfg.questions.map(field).join("")}
      <h3 style="margin-top:38px;font-size:20px">Je gegevens</h3>
      <div class="two-col">
        <div class="field"><label for="f-naam">Naam</label><input id="f-naam" name="naam" type="text" autocomplete="name" required></div>
        <div class="field"><label for="f-email">E-mailadres</label><input id="f-email" name="email" type="email" autocomplete="email" required></div>
      </div>
      <div class="hp-field" aria-hidden="true"><label for="f-bot">Laat dit veld leeg</label><input id="f-bot" name="bot-field" tabindex="-1" autocomplete="off"></div>
      <p class="form-status" id="formStatus" role="status" aria-live="polite"></p>
      <div class="flow-foot">
        <button class="btn btn-primary" type="submit">Versturen <span class="arw" aria-hidden="true">↗</span></button>
        <button class="flow-back" type="button" data-action="back">Ander onderwerp kiezen</button>
        <span class="flow-progress">02 / 03</span>
      </div>
    </form>`;
  };

  const showError = (input, message) => {
    const wrap = input.closest(".field");
    wrap.classList.add("has-error");
    input.setAttribute("aria-invalid", "true");
    if (!wrap.querySelector(".error-text")) {
      const p = document.createElement("span");
      p.className = "error-text";
      p.textContent = message;
      wrap.appendChild(p);
    }
  };
  const clearError = (input) => {
    const wrap = input.closest(".field");
    wrap.classList.remove("has-error");
    input.removeAttribute("aria-invalid");
    wrap.querySelector(".error-text")?.remove();
  };

  const submit = async (form) => {
    const status = $("#formStatus", form);
    const naam = $("#f-naam", form);
    const email = $("#f-email", form);
    [naam, email].forEach(clearError);

    let firstBad = null;
    if (!naam.value.trim()) { showError(naam, "Vul je naam in."); firstBad ||= naam; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) { showError(email, "Vul een geldig e-mailadres in."); firstBad ||= email; }
    if (firstBad) { status.dataset.state = "error"; status.textContent = "Er ontbreekt nog iets. Kijk de gemarkeerde velden na."; firstBad.focus(); return; }

    const data = new FormData(form);
    data.append("form-name", `contact-${state.subject}`);
    data.append("onderwerp", FLOW[state.subject].label);

    const button = $("button[type=submit]", form);
    button.disabled = true;
    status.dataset.state = "";
    status.textContent = "Bezig met versturen…";

    const provider = root.dataset.provider;
    const endpoint = root.dataset.endpoint || (provider === "netlify" ? "/" : "");

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: provider === "netlify" ? { "Content-Type": "application/x-www-form-urlencoded" } : { Accept: "application/json" },
        body: provider === "netlify" ? new URLSearchParams(data).toString() : data,
      });
      if (!res.ok) throw new Error(res.status);
      state.done = true;
      render();
    } catch {
      button.disabled = false;
      status.dataset.state = "error";
      status.innerHTML = `Versturen lukt nu niet. Probeer het zo nog eens of mail rechtstreeks naar <a href="mailto:${document.querySelector('a[href^="mailto:"]')?.textContent.trim() || ""}" style="text-decoration:underline">ons</a>.`;
    }
  };

  root.addEventListener("click", (e) => {
    const subject = e.target.closest("[data-subject]");
    if (subject) { state.subject = subject.dataset.subject; render(); return; }
    const action = e.target.closest("[data-action]")?.dataset.action;
    if (action === "back") { state.subject = null; render(); }
    if (action === "reset") { state.subject = null; state.done = false; render(); }
  });
  root.addEventListener("submit", (e) => { e.preventDefault(); submit(e.target); });
  root.addEventListener("input", (e) => { if (e.target.closest(".field.has-error")) clearError(e.target); });

  render();
}
